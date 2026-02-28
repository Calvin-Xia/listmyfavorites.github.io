/**
 * SearchEngine 单元测试
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
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
}

function assertTrue(value) {
    if (value !== true) {
        throw new Error(`Expected true, got ${value}`);
    }
}

function assertFalse(value) {
    if (value !== false) {
        throw new Error(`Expected false, got ${value}`);
    }
}

const { SearchEngine } = require('../script.js');

test('isSubsequence: 正确匹配子序列', () => {
    assertTrue(SearchEngine.isSubsequence('gh', 'github'));
    assertTrue(SearchEngine.isSubsequence('git', 'github'));
    assertTrue(SearchEngine.isSubsequence('hub', 'github'));
    assertTrue(SearchEngine.isSubsequence('', 'github'));
    assertTrue(SearchEngine.isSubsequence('abc', 'a_b_c'));
});

test('isSubsequence: 不匹配非子序列', () => {
    assertFalse(SearchEngine.isSubsequence('hg', 'github'));
    assertFalse(SearchEngine.isSubsequence('xyz', 'github'));
    assertFalse(SearchEngine.isSubsequence('githubx', 'github'));
});

test('isSubsequence: 大小写敏感测试', () => {
    assertFalse(SearchEngine.isSubsequence('GH', 'github'));
    assertFalse(SearchEngine.isSubsequence('git', 'GITHUB'));
    assertTrue(SearchEngine.isSubsequence('GIT', 'GITHUB'));
});

test('filter: 精确模式返回匹配项', () => {
    const engine = new SearchEngine([
        { name: 'GitHub', url: 'https://github.com' },
        { name: 'Google', url: 'https://google.com' }
    ]);
    const result = engine.filter('git', 'exact');
    assertEqual(result.length, 1);
    assertEqual(result[0].name, 'GitHub');
});

test('filter: 空搜索词返回全部', () => {
    const engine = new SearchEngine([
        { name: 'GitHub', url: 'https://github.com' },
        { name: 'Google', url: 'https://google.com' }
    ]);
    const result = engine.filter('', 'exact');
    assertEqual(result.length, 2);
});

test('filter: 空格搜索词返回全部', () => {
    const engine = new SearchEngine([
        { name: 'GitHub', url: 'https://github.com' },
        { name: 'Google', url: 'https://google.com' }
    ]);
    const result = engine.filter('   ', 'exact');
    assertEqual(result.length, 2);
});

test('filter: 无匹配返回空数组', () => {
    const engine = new SearchEngine([
        { name: 'GitHub', url: 'https://github.com' },
        { name: 'Google', url: 'https://google.com' }
    ]);
    const result = engine.filter('xyz', 'exact');
    assertEqual(result.length, 0);
});

test('filter: 匹配 URL', () => {
    const engine = new SearchEngine([
        { name: 'GitHub', url: 'https://github.com' },
        { name: 'Google', url: 'https://google.com' }
    ]);
    const result = engine.filter('gthb', 'exact');
    assertEqual(result.length, 1);
    assertEqual(result[0].name, 'GitHub');
});

test('filter: 匹配描述', () => {
    const engine = new SearchEngine([
        { name: 'GitHub', url: 'https://github.com', description: 'Code hosting platform' },
        { name: 'Google', url: 'https://google.com', description: 'Search engine' }
    ]);
    const result = engine.filter('code', 'exact');
    assertEqual(result.length, 1);
    assertEqual(result[0].name, 'GitHub');
});

test('updateSource: 更新数据源', () => {
    const engine = new SearchEngine([]);
    engine.updateSource([
        { name: 'Test', url: 'https://test.com' }
    ]);
    assertEqual(engine.data.length, 1);
    assertEqual(engine.data[0].name, 'Test');
});

test('updateSource: 非数组参数转为空数组', () => {
    const engine = new SearchEngine([
        { name: 'Test', url: 'https://test.com' }
    ]);
    engine.updateSource(null);
    assertEqual(engine.data.length, 0);
});

console.log('\nSearchEngine 测试完成');
