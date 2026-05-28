/**
 * FavoritesService 单元测试
 */

async function test(name, fn) {
    try {
        await fn();
        console.log(`✓ ${name}`);
    } catch (e) {
        console.error(`✗ ${name}`);
        console.error(e);
    }
}

function assertEqual(actual, expected) {
    if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
}

function assertIncludes(str, substr) {
    if (!str.includes(substr)) {
        throw new Error(`Expected "${str}" to include "${substr}"`);
    }
}

const { FavoritesService } = require('../script.js');

test('buildDataUrl: 生成正确的数据 URL', () => {
    const service = new FavoritesService({
        owner: 'test-user',
        id: 'test-id',
        filename: 'data.json'
    });
    const url = service.buildDataUrl();
    assertEqual(url, 'https://gist.githubusercontent.com/test-user/test-id/raw/data.json');
});

test('buildDataUrl: 包含正确的路径结构', () => {
    const service = new FavoritesService({
        owner: 'myuser',
        id: 'abc123',
        filename: 'favorites.json'
    });
    const url = service.buildDataUrl();
    assertIncludes(url, 'myuser');
    assertIncludes(url, 'abc123');
    assertIncludes(url, 'favorites.json');
});

test('buildApiUrl: 生成正确的 API URL', () => {
    const service = new FavoritesService({
        owner: 'test-user',
        id: 'test-id',
        filename: 'data.json'
    });
    const url = service.buildApiUrl();
    assertEqual(url, 'https://api.github.com/gists/test-id');
});

test('buildApiUrl: 不包含 owner', () => {
    const service = new FavoritesService({
        owner: 'test-user',
        id: 'test-id',
        filename: 'data.json'
    });
    const url = service.buildApiUrl();
    assertIncludes(url, 'api.github.com');
    assertIncludes(url, 'test-id');
});

test('parseContent: 正确解析有效 JSON 数组', () => {
    const service = new FavoritesService({});
    const result = service.parseContent('[{"name":"test","url":"https://test.com"}]');
    assertEqual(result.length, 1);
    assertEqual(result[0].name, 'test');
});

test('parseContent: 解析空数组', () => {
    const service = new FavoritesService({});
    const result = service.parseContent('[]');
    assertEqual(result.length, 0);
});

test('parseContent: 解析多个元素的数组', () => {
    const service = new FavoritesService({});
    const result = service.parseContent('[{"name":"a","url":"http://a.com"},{"name":"b","url":"http://b.com"},{"name":"c","url":"http://c.com"}]');
    assertEqual(result.length, 3);
});

test('parseContent: 无效 JSON 抛出错误', () => {
    const service = new FavoritesService({});
    try {
        service.parseContent('invalid json');
        throw new Error('Should have thrown');
    } catch (e) {
        assertIncludes(e.message, '有效的列表 JSON');
    }
});

test('parseContent: 非数组 JSON 抛出错误', () => {
    const service = new FavoritesService({});
    try {
        service.parseContent('{"key": "value"}');
        throw new Error('Should have thrown');
    } catch (e) {
        assertIncludes(e.message, '有效的列表 JSON');
    }
});

test('parseContent: 字符串 JSON 抛出错误', () => {
    const service = new FavoritesService({});
    try {
        service.parseContent('"just a string"');
        throw new Error('Should have thrown');
    } catch (e) {
        assertIncludes(e.message, '有效的列表 JSON');
    }
});

test('parseContent: 数字 JSON 抛出错误', () => {
    const service = new FavoritesService({});
    try {
        service.parseContent('123');
        throw new Error('Should have thrown');
    } catch (e) {
        assertIncludes(e.message, '有效的列表 JSON');
    }
});

test('constructor: 正确存储配置', () => {
    const service = new FavoritesService({
        owner: 'myowner',
        id: 'myid',
        filename: 'myfile.json'
    });
    assertEqual(service.owner, 'myowner');
    assertEqual(service.gistId, 'myid');
    assertEqual(service.filename, 'myfile.json');
});

test('findByUrl: 找到时返回 {item, index}', async () => {
    const service = new FavoritesService({
        owner: 'test-user',
        id: 'test-id',
        filename: 'data.json'
    });
    const items = [
        { name: 'A', url: 'https://a.com' },
        { name: 'B', url: 'https://b.com' },
        { name: 'C', url: 'https://c.com' }
    ];
    service.fetchAll = async () => items;
    const result = await service.findByUrl('https://b.com');
    assertEqual(result.index, 1);
    assertEqual(result.item.name, 'B');
});

test('findByUrl: 未找到时返回 null', async () => {
    const service = new FavoritesService({
        owner: 'test-user',
        id: 'test-id',
        filename: 'data.json'
    });
    service.fetchAll = async () => [
        { name: 'A', url: 'https://a.com' }
    ];
    const result = await service.findByUrl('https://missing.com');
    assertEqual(result, null);
});

class EditableService extends FavoritesService {
    constructor(config, mockList) {
        super(config);
        this._mockList = mockList;
        this._savedList = null;
    }
    async fetchGist(token) {
        return { files: { [this.filename]: { content: JSON.stringify(this._mockList) } } };
    }
    async updateGist(list, token) {
        this._savedList = list;
    }
}

test('edit: 有效索引更新指定项', async () => {
    const items = [
        { name: 'A', url: 'https://a.com' },
        { name: 'B', url: 'https://b.com' }
    ];
    const service = new EditableService({
        owner: 'test-user',
        id: 'test-id',
        filename: 'data.json'
    }, items);
    await service.edit(1, { name: 'B-Edited', url: 'https://b-new.com' }, 'fake-token');
    assertEqual(service._savedList[1].name, 'B-Edited');
    assertEqual(service._savedList[1].url, 'https://b-new.com');
    assertEqual(service._savedList[0].name, 'A');
});

test('edit: 设置 updatedAt 时间戳', async () => {
    const items = [
        { name: 'A', url: 'https://a.com' }
    ];
    const service = new EditableService({
        owner: 'test-user',
        id: 'test-id',
        filename: 'data.json'
    }, items);
    await service.edit(0, { name: 'A2' }, 'fake-token');
    const updated = service._savedList[0].updatedAt;
    assertEqual(typeof updated, 'string');
    assertEqual(isNaN(Date.parse(updated)), false);
});

test('edit: 无效索引抛出错误', async () => {
    const items = [{ name: 'A', url: 'https://a.com' }];
    const service = new EditableService({
        owner: 'test-user',
        id: 'test-id',
        filename: 'data.json'
    }, items);
    try {
        await service.edit(5, { name: 'X' }, 'fake-token');
        throw new Error('Should have thrown');
    } catch (e) {
        assertIncludes(e.message, '无效的收藏索引');
    }
});

test('edit: 无 Token 抛出错误', async () => {
    const service = new EditableService({
        owner: 'test-user',
        id: 'test-id',
        filename: 'data.json'
    }, []);
    try {
        await service.edit(0, { name: 'X' }, '');
        throw new Error('Should have thrown');
    } catch (e) {
        assertIncludes(e.message, '缺少访问 Token');
    }
});

test('edit: 保留已有字段', async () => {
    const items = [
        { name: 'A', url: 'https://a.com', description: 'desc A', tags: ['web'] }
    ];
    const service = new EditableService({
        owner: 'test-user',
        id: 'test-id',
        filename: 'data.json'
    }, items);
    await service.edit(0, { description: 'updated desc' }, 'fake-token');
    assertEqual(service._savedList[0].name, 'A');
    assertEqual(service._savedList[0].url, 'https://a.com');
    assertEqual(service._savedList[0].description, 'updated desc');
    assertEqual(service._savedList[0].tags[0], 'web');
});

test('delete: 有效索引删除指定项', async () => {
    const items = [
        { name: 'A', url: 'https://a.com' },
        { name: 'B', url: 'https://b.com' },
        { name: 'C', url: 'https://c.com' }
    ];
    const service = new EditableService({
        owner: 'test-user',
        id: 'test-id',
        filename: 'data.json'
    }, items);
    await service.delete(1, 'fake-token');
    assertEqual(service._savedList.length, 2);
    assertEqual(service._savedList[0].name, 'A');
    assertEqual(service._savedList[1].name, 'C');
});

test('delete: 无效索引抛出错误', async () => {
    const items = [{ name: 'A', url: 'https://a.com' }];
    const service = new EditableService({
        owner: 'test-user',
        id: 'test-id',
        filename: 'data.json'
    }, items);
    try {
        await service.delete(-1, 'fake-token');
        throw new Error('Should have thrown');
    } catch (e) {
        assertIncludes(e.message, '无效的收藏索引');
    }
});

test('delete: 无 Token 抛出错误', async () => {
    const service = new EditableService({
        owner: 'test-user',
        id: 'test-id',
        filename: 'data.json'
    }, []);
    try {
        await service.delete(0, '');
        throw new Error('Should have thrown');
    } catch (e) {
        assertIncludes(e.message, '缺少访问 Token');
    }
});

test('delete: 删除唯一项后列表为空', async () => {
    const items = [
        { name: 'Only', url: 'https://only.com' }
    ];
    const service = new EditableService({
        owner: 'test-user',
        id: 'test-id',
        filename: 'data.json'
    }, items);
    await service.delete(0, 'fake-token');
    assertEqual(service._savedList.length, 0);
});

test('retryWithBackoff: 成功时直接返回结果', async () => {
    let calls = 0;
    const fn = async () => { calls++; return 'ok'; };
    const result = await FavoritesService.retryWithBackoff(fn, 3, 10);
    assertEqual(result, 'ok');
    assertEqual(calls, 1);
});

test('retryWithBackoff: 失败后重试成功', async () => {
    let calls = 0;
    const fn = async () => {
        calls++;
        if (calls < 3) throw new Error('fail');
        return 'ok';
    };
    const result = await FavoritesService.retryWithBackoff(fn, 3, 10);
    assertEqual(result, 'ok');
    assertEqual(calls, 3);
});

test('retryWithBackoff: 超过最大重试次数抛出错误', async () => {
    let calls = 0;
    const fn = async () => { calls++; throw new Error('always fail'); };
    try {
        await FavoritesService.retryWithBackoff(fn, 2, 10);
        throw new Error('Should have thrown');
    } catch (e) {
        assertIncludes(e.message, 'always fail');
        assertEqual(calls, 3); // 1 initial + 2 retries
    }
});

console.log('\nFavoritesService 测试完成');
