/**
 * TokenStorage 单元测试
 */

function test(name, fn) {
    try {
        fn();
        console.log(`\u2713 ${name}`);
    } catch (e) {
        console.error(`\u2717 ${name}`);
        console.error(e);
    }
}

function assertEqual(actual, expected) {
    if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
}

// Mock localStorage for Node.js environment
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = String(value); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();

// Temporarily replace global localStorage
const originalLocalStorage = global.localStorage;
global.localStorage = localStorageMock;

const { TokenStorage } = require('../script.js');

test('get: 无 Token 时返回空字符串', () => {
    localStorage.clear();
    assertEqual(TokenStorage.get(), '');
});

test('set + get: 保存后能获取', () => {
    localStorage.clear();
    TokenStorage.set('test-token-123');
    assertEqual(TokenStorage.get(), 'test-token-123');
});

test('clear: 清除后返回空字符串', () => {
    localStorage.clear();
    TokenStorage.set('test-token');
    TokenStorage.clear();
    assertEqual(TokenStorage.get(), '');
});

test('set: 覆盖之前的值', () => {
    localStorage.clear();
    TokenStorage.set('first');
    TokenStorage.set('second');
    assertEqual(TokenStorage.get(), 'second');
});

// Restore original localStorage
global.localStorage = originalLocalStorage;

console.log('\nTokenStorage \u6d4b\u8bd5\u5b8c\u6210');
