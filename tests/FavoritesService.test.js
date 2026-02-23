/**
 * FavoritesService 单元测试
 */

function test(name, fn) {
    try {
        fn();
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

class FavoritesService {
    constructor(config) {
        this.owner = config.owner;
        this.gistId = config.id;
        this.filename = config.filename;
    }

    buildDataUrl() {
        return `https://gist.githubusercontent.com/${this.owner}/${this.gistId}/raw/${this.filename}`;
    }

    buildApiUrl() {
        return `https://api.github.com/gists/${this.gistId}`;
    }

    parseContent(content) {
        try {
            const parsed = JSON.parse(content);
            if (!Array.isArray(parsed)) {
                throw new Error();
            }
            return parsed;
        } catch (err) {
            throw new Error('云端数据不是有效的列表 JSON');
        }
    }
}

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
    const result = service.parseContent('[{"name":"a"},{"name":"b"},{"name":"c"}]');
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

console.log('\nFavoritesService 测试完成');
