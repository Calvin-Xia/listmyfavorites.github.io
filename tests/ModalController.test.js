/**
 * ModalController 单元测试
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

function mockModal() {
    const el = {
        classList: {
            add: function (cls) { el._classes.add(cls); },
            remove: function (cls) { el._classes.delete(cls); },
            contains: function (cls) { return el._classes.has(cls); }
        },
        _classes: new Set(),
        addEventListener: function () {},
        removeEventListener: function () {},
        querySelectorAll: function () { return []; },
        querySelector: function () { return { value: '' }; },
        style: {}
    };
    return el;
}

function mockInput() {
    return { value: '', addEventListener: function () {} };
}

function mockButton() {
    return { addEventListener: function () {}, disabled: false, textContent: '' };
}

function mockForm() {
    return {
        addEventListener: function () {},
        querySelector: function () { return { value: '' }; },
        reset: function () {}
    };
}

global.document = {
    createDocumentFragment: function () { return { appendChild: function () {} }; },
    createElement: function () { return { appendChild: function () {} }; },
    getElementById: function () { return { textContent: '' }; }
};

const { ModalController } = require('../script.js');

function createCtrl(overrides) {
    const defaults = {
        modal: mockModal(),
        openBtn: mockButton(),
        closeBtn: mockButton(),
        tokenSection: { style: {} },
        tokenInput: mockInput(),
        saveTokenBtn: mockButton(),
        clearTokenBtn: mockButton(),
        addForm: mockForm(),
        statusMsg: { textContent: '', style: {} },
        submitBtn: mockButton()
    };
    return new ModalController(Object.assign({}, defaults, overrides));
}

test('open: 添加 active 类', () => {
    const modal = mockModal();
    const ctrl = createCtrl({ modal });
    ctrl.open();
    assertTrue(modal.classList.contains('active'));
});

test('close: 移除 active 类', () => {
    const modal = mockModal();
    const ctrl = createCtrl({ modal });
    ctrl.open();
    ctrl.close();
    assertFalse(modal.classList.contains('active'));
});

test('syncTokenState: 有 Token 时显示表单', () => {
    const tokenSection = { style: {} };
    const addForm = { style: {} };
    const ctrl = createCtrl({ tokenSection, addForm });
    ctrl.syncTokenState(true);
    assertEqual(tokenSection.style.display, 'none');
    assertEqual(addForm.style.display, 'block');
});

test('syncTokenState: 无 Token 时显示 token 区域', () => {
    const tokenSection = { style: {} };
    const addForm = { style: {} };
    const ctrl = createCtrl({ tokenSection, addForm });
    ctrl.syncTokenState(false);
    assertEqual(tokenSection.style.display, 'block');
    assertEqual(addForm.style.display, 'none');
});

test('setSavingState: 保存中禁用按钮', () => {
    const submitBtn = mockButton();
    const ctrl = createCtrl({ submitBtn });
    ctrl.setSavingState(true);
    assertTrue(submitBtn.disabled);
    assertEqual(submitBtn.textContent, '正在保存...');
});

test('setSavingState: 非保存中启用按钮', () => {
    const submitBtn = mockButton();
    const ctrl = createCtrl({ submitBtn });
    ctrl.setSavingState(true);
    ctrl.setSavingState(false);
    assertFalse(submitBtn.disabled);
    assertEqual(submitBtn.textContent, '保存到 Gist');
});

test('showStatus: 设置状态文本', () => {
    const statusMsg = { textContent: '', style: {} };
    const ctrl = createCtrl({ statusMsg });
    ctrl.showStatus('测试消息');
    assertEqual(statusMsg.textContent, '测试消息');
});

test('showStatus: 错误类型设置红色', () => {
    const statusMsg = { textContent: '', style: {} };
    const ctrl = createCtrl({ statusMsg });
    ctrl.showStatus('错误', 'error');
    assertEqual(statusMsg.style.color, '#e74c3c');
});

test('showStatus: info 类型设置灰色', () => {
    const statusMsg = { textContent: '', style: {} };
    const ctrl = createCtrl({ statusMsg });
    ctrl.showStatus('信息');
    assertEqual(statusMsg.style.color, '#666');
});

test('resetStatus: 清空状态文本', () => {
    const statusMsg = { textContent: '旧消息', style: {} };
    const ctrl = createCtrl({ statusMsg });
    ctrl.resetStatus();
    assertEqual(statusMsg.textContent, '');
});

test('fillToken: 填充输入框值', () => {
    const tokenInput = mockInput();
    const ctrl = createCtrl({ tokenInput });
    ctrl.fillToken('abc123');
    assertEqual(tokenInput.value, 'abc123');
});

test('fillToken: 空参数清空输入框', () => {
    const tokenInput = mockInput();
    tokenInput.value = 'old';
    const ctrl = createCtrl({ tokenInput });
    ctrl.fillToken('');
    assertEqual(tokenInput.value, '');
});

test('constructor: 正确存储元素引用', () => {
    const modal = mockModal();
    const submitBtn = mockButton();
    const ctrl = createCtrl({ modal, submitBtn });
    assertEqual(ctrl.modal, modal);
    assertEqual(ctrl.submitBtn, submitBtn);
});

console.log('\nModalController 测试完成');
