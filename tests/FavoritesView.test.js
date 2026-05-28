/**
 * FavoritesView 单元测试
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

// Mock DOM elements for Node.js environment
function mockElement() {
    const el = {
        innerHTML: '',
        textContent: '',
        className: '',
        href: '',
        target: '',
        rel: '',
        style: {
            display: '',
            setProperty: function () {}
        },
        _children: [],
        appendChild: function (child) {
            this._children.push(child);
        },
        setAttribute: function () {},
        addEventListener: function () {}
    };
    return el;
}

// Global document mock — must exist before require
global.document = {
    createDocumentFragment: function () {
        return mockElement();
    },
    createElement: function () {
        return mockElement();
    },
    getElementById: function () {
        return mockElement();
    }
};

const { FavoritesView } = require('../script.js');

test('constructor: 正确存储元素引用', () => {
    const listEl = mockElement();
    const emptyEl = mockElement();
    const view = new FavoritesView({ listEl, emptyEl });
    assertEqual(view.listEl, listEl);
    assertEqual(view.emptyEl, emptyEl);
});

test('render: 空数组时隐藏列表显示空状态', () => {
    const listEl = mockElement();
    const emptyEl = mockElement();
    const view = new FavoritesView({ listEl, emptyEl });
    view.render([]);
    assertEqual(listEl.style.display, 'none');
    assertEqual(emptyEl.style.display, 'block');
});

test('render: null 时隐藏列表显示空状态', () => {
    const listEl = mockElement();
    const emptyEl = mockElement();
    const view = new FavoritesView({ listEl, emptyEl });
    view.render(null);
    assertEqual(listEl.style.display, 'none');
    assertEqual(emptyEl.style.display, 'block');
});

test('render: 有数据时显示列表隐藏空状态', () => {
    const listEl = mockElement();
    const emptyEl = mockElement();
    const view = new FavoritesView({ listEl, emptyEl });
    view.render([{ name: 'Test', url: 'https://test.com' }]);
    assertEqual(listEl.style.display, 'grid');
    assertEqual(emptyEl.style.display, 'none');
});

test('render: 清空列表 innerHTML', () => {
    const listEl = mockElement();
    listEl.innerHTML = '<div>旧内容</div>';
    const emptyEl = mockElement();
    const view = new FavoritesView({ listEl, emptyEl });
    view.render([]);
    assertEqual(listEl.innerHTML, '');
});

test('showLoading: 设置网格布局', () => {
    const listEl = mockElement();
    const emptyEl = mockElement();
    const view = new FavoritesView({ listEl, emptyEl });
    view.showLoading();
    assertEqual(listEl.style.display, 'grid');
});

test('showLoading: 隐藏空状态', () => {
    const listEl = mockElement();
    const emptyEl = mockElement();
    const view = new FavoritesView({ listEl, emptyEl });
    view.showLoading();
    assertEqual(emptyEl.style.display, 'none');
});

test('showError: 设置网格布局', () => {
    const listEl = mockElement();
    const emptyEl = mockElement();
    const view = new FavoritesView({ listEl, emptyEl });
    view.showError('测试错误');
    assertEqual(listEl.style.display, 'grid');
});

test('showError: 隐藏空状态', () => {
    const listEl = mockElement();
    const emptyEl = mockElement();
    const view = new FavoritesView({ listEl, emptyEl });
    view.showError('测试错误');
    assertEqual(emptyEl.style.display, 'none');
});

test('showMessage: 自定义颜色', () => {
    const listEl = mockElement();
    const emptyEl = mockElement();
    const view = new FavoritesView({ listEl, emptyEl });
    view.showMessage('信息消息', '#3498db');
    assertEqual(listEl.style.display, 'grid');
    assertEqual(emptyEl.style.display, 'none');
});

test('render: 多项数据正确渲染', () => {
    const listEl = mockElement();
    const emptyEl = mockElement();
    const view = new FavoritesView({ listEl, emptyEl });
    view.render([
        { name: 'A', url: 'https://a.com' },
        { name: 'B', url: 'https://b.com' },
        { name: 'C', url: 'https://c.com' }
    ]);
    assertEqual(listEl.style.display, 'grid');
    assertEqual(emptyEl.style.display, 'none');
    assertTrue(listEl._children.length > 0);
});

test('render: 带描述的数据', () => {
    const listEl = mockElement();
    const emptyEl = mockElement();
    const view = new FavoritesView({ listEl, emptyEl });
    view.render([{ name: 'Test', url: 'https://test.com', description: '描述' }]);
    assertEqual(listEl.style.display, 'grid');
    assertEqual(emptyEl.style.display, 'none');
});

console.log('\nFavoritesView 测试完成');
