/**
 * FavoritesApp 单元测试
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

function assertIncludes(str, substr) {
    if (!str.includes(substr)) {
        throw new Error(`Expected "${str}" to include "${substr}"`);
    }
}

function mockService() {
    return {
        fetchAll: async function () { return []; },
        append: async function () {},
        edit: async function () {},
        delete: async function () {},
        updateGist: async function () {}
    };
}

function mockStorage() {
    return {
        get: function () { return ''; },
        set: function () {},
        clear: function () {}
    };
}

function mockView() {
    return {
        listEl: { addEventListener: function () {} },
        showLoading: function () {},
        showError: function () {},
        render: function () {}
    };
}

function mockSearchInput() {
    return { value: '', addEventListener: function () {} };
}

function mockCheckbox() {
    return { checked: true, addEventListener: function () {} };
}

function mockModal() {
    return {
        init: function () {},
        open: function () {},
        close: function () {},
        fillToken: function () {},
        syncTokenState: function () {},
        showStatus: function () {},
        setSavingState: function () {},
        resetForm: function () {},
        openForEdit: function () {}
    };
}

global.document = {
    createDocumentFragment: function () { return { appendChild: function () {} }; },
    createElement: function () { return { appendChild: function () {} }; },
    getElementById: function () { return { textContent: '' }; }
};

const { FavoritesApp } = require('../script.js');

function createApp(overrides) {
    const defaults = {
        service: mockService(),
        storage: mockStorage(),
        view: mockView(),
        searchInput: mockSearchInput(),
        exactMatchCheckbox: mockCheckbox(),
        modal: mockModal()
    };
    return new FavoritesApp(Object.assign({}, defaults, overrides));
}

test('constructor: 初始化状态', () => {
    const app = createApp();
    assertTrue(Array.isArray(app.state.favorites));
    assertEqual(app.state.favorites.length, 0);
    assertEqual(app.state.editIndex, null);
});

test('constructor: 从 storage 读取 token', () => {
    const storage = {
        get: function () { return 'my-token'; },
        set: function () {},
        clear: function () {}
    };
    const app = createApp({ storage });
    assertEqual(app.state.token, 'my-token');
});

test('constructor: 初始化 SearchEngine', () => {
    const app = createApp();
    assertTrue(app.searchEngine !== null);
    assertTrue(Array.isArray(app.searchEngine.data));
});

test('_classifyError: Token 错误归类为 auth', () => {
    const app = createApp();
    assertEqual(app._classifyError(new Error('Token 无效')), 'auth');
});

test('_classifyError: 权限错误归类为 auth', () => {
    const app = createApp();
    assertEqual(app._classifyError(new Error('权限不足')), 'auth');
});

test('_classifyError: 401 错误归类为 auth', () => {
    const app = createApp();
    assertEqual(app._classifyError(new Error('HTTP 401')), 'auth');
});

test('_classifyError: 403 错误归类为 auth', () => {
    const app = createApp();
    assertEqual(app._classifyError(new Error('HTTP 403')), 'auth');
});

test('_classifyError: Failed to fetch 归类为 network', () => {
    const app = createApp();
    assertEqual(app._classifyError(new Error('Failed to fetch')), 'network');
});

test('_classifyError: 网络错误归类为 network', () => {
    const app = createApp();
    assertEqual(app._classifyError(new Error('网络连接失败')), 'network');
});

test('_classifyError: Network 错误归类为 network', () => {
    const app = createApp();
    assertEqual(app._classifyError(new Error('Network error')), 'network');
});

test('_classifyError: 验证错误归类为 validation', () => {
    const app = createApp();
    assertEqual(app._classifyError(new Error('数据验证失败')), 'validation');
});

test('_classifyError: 格式错误归类为 validation', () => {
    const app = createApp();
    assertEqual(app._classifyError(new Error('格式不正确')), 'validation');
});

test('_classifyError: 无效参数归类为 validation', () => {
    const app = createApp();
    assertEqual(app._classifyError(new Error('参数无效')), 'validation');
});

test('_classifyError: 未知错误归类为 unknown', () => {
    const app = createApp();
    assertEqual(app._classifyError(new Error('something')), 'unknown');
});

test('_validateImportData: 有效数据返回 valid', () => {
    const app = createApp();
    const result = app._validateImportData([{ name: 'Test', url: 'https://test.com' }]);
    assertTrue(result.valid);
    assertEqual(result.errors.length, 0);
});

test('_validateImportData: 非数组返回 invalid', () => {
    const app = createApp();
    const result = app._validateImportData('not an array');
    assertFalse(result.valid);
    assertTrue(result.errors.length > 0);
});

test('_validateImportData: 缺少名称返回 invalid', () => {
    const app = createApp();
    const result = app._validateImportData([{ url: 'https://test.com' }]);
    assertFalse(result.valid);
});

test('_validateImportData: 缺少网址返回 invalid', () => {
    const app = createApp();
    const result = app._validateImportData([{ name: 'Test' }]);
    assertFalse(result.valid);
});

test('_validateImportData: 无效 URL 返回 invalid', () => {
    const app = createApp();
    const result = app._validateImportData([{ name: 'Test', url: 'not-a-url' }]);
    assertFalse(result.valid);
});

test('_validateImportData: 多项有效数据返回 valid', () => {
    const app = createApp();
    const result = app._validateImportData([
        { name: 'A', url: 'https://a.com' },
        { name: 'B', url: 'https://b.com' }
    ]);
    assertTrue(result.valid);
    assertEqual(result.errors.length, 0);
});

test('_validateImportData: 混合有效无效数据', () => {
    const app = createApp();
    const result = app._validateImportData([
        { name: 'A', url: 'https://a.com' },
        { name: '', url: 'https://b.com' }
    ]);
    assertFalse(result.valid);
});

test('_validateImportData: null 项返回 invalid', () => {
    const app = createApp();
    const result = app._validateImportData([null]);
    assertFalse(result.valid);
});

test('_validateImportData: ftp 协议返回 invalid', () => {
    const app = createApp();
    const result = app._validateImportData([{ name: 'Test', url: 'ftp://test.com' }]);
    assertFalse(result.valid);
});

console.log('\nFavoritesApp 测试完成');
