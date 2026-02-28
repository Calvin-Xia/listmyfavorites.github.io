/**
 * @typedef {Object} FavoriteItem
 * @property {string} name - 网站名称
 * @property {string} url - 网站地址
 * @property {string} [description] - 可选的描述
 */

/**
 * @typedef {Object} GistConfig
 * @property {string} owner - Gist 所有者
 * @property {string} id - Gist ID
 * @property {string} filename - 文件名
 */

/**
 * @typedef {Object} FormPayload
 * @property {string} name - 名称
 * @property {string} url - 网址
 * @property {string} description - 描述
 */

/**
 * @typedef {Object} ModalElements
 * @property {HTMLElement} modal - 模态框容器
 * @property {HTMLElement} openBtn - 打开按钮
 * @property {HTMLElement} closeBtn - 关闭按钮
 * @property {HTMLElement} tokenSection - Token 输入区域
 * @property {HTMLInputElement} tokenInput - Token 输入框
 * @property {HTMLElement} saveTokenBtn - 保存 Token 按钮
 * @property {HTMLElement} clearTokenBtn - 清除 Token 按钮
 * @property {HTMLFormElement} addForm - 添加表单
 * @property {HTMLElement} statusMsg - 状态消息元素
 * @property {HTMLElement} submitBtn - 提交按钮
 */

/**
 * @typedef {Object} AppState
 * @property {FavoriteItem[]} favorites - 收藏列表
 * @property {string} token - GitHub Token
 */

/**
 * @typedef {Object} FavoritesAppOptions
 * @property {FavoritesService} service - 收藏服务
 * @property {Object} storage - 存储对象
 * @property {FavoritesView} view - 视图对象
 * @property {HTMLInputElement} searchInput - 搜索输入框
 * @property {HTMLInputElement} exactMatchCheckbox - 精确匹配复选框
 * @property {ModalController} modal - 模态框控制器
 */

/**
 * @typedef {Object} ModalCallbacks
 * @property {Function} [onOpen] - 打开回调
 * @property {Function} [onClose] - 关闭回调
 * @property {Function} [onSaveToken] - 保存 Token 回调
 * @property {Function} [onClearToken] - 清除 Token 回调
 * @property {Function} [onSubmit] - 提交回调
 */

/**
 * Gist 配置常量
 * @type {Readonly<GistConfig>}
 */
const GIST_CONFIG = Object.freeze({
    owner: 'Calvin-Xia',
    id: '9c84112f9a5affcc63d4693a6282f74f',
    filename: 'data.json'
});

/**
 * Token 存储管理器
 * @type {Object}
 * @property {string} key - localStorage 存储键名
 */
const TokenStorage = {
    /** @type {string} */
    key: 'github_token',
    _fallback: '',

    /**
    /**
     * 获取存储的 Token
     * @returns {string} Token 值，不存在则返回空字符串
     */
    get() {
        try {
            return localStorage.getItem(this.key) || '';
        } catch (err) {
            return this._fallback;
        }
    },

    /**
     * 保存 Token 到 localStorage
     * @param {string} token - 要保存的 Token
     * @returns {void}
     */
    set(token) {
        try {
            localStorage.setItem(this.key, token);
        } catch (err) {
            this._fallback = token;
        }
    },

    /**
     * 清除存储的 Token
     * @returns {void}
     */
    clear() {
        try {
            localStorage.removeItem(this.key);
        } catch (err) {
            this._fallback = '';
        }
    }
};

/**
 * 收藏夹服务 - 处理 GitHub Gist API 交互
 */
class FavoritesService {
    /**
     * @param {GistConfig} config - Gist 配置
     */
    constructor(config) {
        /** @type {string} */
        this.owner = config.owner;
        /** @type {string} */
        this.gistId = config.id;
        /** @type {string} */
        this.filename = config.filename;
        /** @type {boolean} */
        this.isUpdating = false;
    }

    /**
     * 构建数据获取 URL
     * @returns {string} 数据文件 URL
     */
    buildDataUrl() {
        return `https://gist.githubusercontent.com/${this.owner}/${this.gistId}/raw/${this.filename}`;
    }

    /**
     * 构建 API URL
     * @returns {string} Gist API URL
     */
    buildApiUrl() {
        return `https://api.github.com/gists/${this.gistId}`;
    }

    /**
     * 获取所有收藏数据
     * @param {AbortSignal} signal - 中断信号
     * @returns {Promise<FavoriteItem[]>} 收藏列表
     * @throws {Error} HTTP 请求失败时抛出错误
     */
    async fetchAll(signal) {
        const url = `${this.buildDataUrl()}?t=${Date.now()}`;
        const response = await fetch(url, { signal });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    }

    /**
     * 追加新收藏项到 Gist
     * @param {FavoriteItem} item - 要追加的收藏项
     * @param {string} token - GitHub Token
     * @returns {Promise<void>}
     * @throws {Error} Token 无效或请求失败时抛出错误
     */
    async append(item, token) {
        if (!token) {
            throw new Error('缺少访问 Token');
        }
        if (this.isUpdating) {
            throw new Error('正在保存中，请稍后再试');
        }
        this.isUpdating = true;

        try {
            const gist = await this.fetchGist(token);
            const rawContent = gist.files?.[this.filename]?.content ?? '[]';
            const list = this.parseContent(rawContent);
            list.push(item);
            await this.updateGist(list, token);
        } finally {
            this.isUpdating = false;
        }
    }

    /**
     * 获取 Gist 信息
     * @param {string} token - GitHub Token
     * @returns {Promise<Object>} Gist 对象
     * @throws {Error} 请求失败时抛出错误
     */
    async fetchGist(token) {
        const response = await fetch(this.buildApiUrl(), {
            headers: {
                Authorization: `token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('拉取 Gist 信息失败，请检查 Token 权限');
        }

        return response.json();
    }

    /**
     * 解析内容为 JSON 数组
     * @param {string} content - 要解析的内容
     * @returns {FavoriteItem[]} 解析后的数组
     * @throws {Error} 内容不是有效的 JSON 数组时抛出错误
     */
    parseContent(content) {
        try {
            const parsed = JSON.parse(content);
            if (!Array.isArray(parsed)) {
                throw new Error();
            }
            return parsed.filter(item => item && typeof item.url === 'string' && typeof item.name === 'string');
        } catch (err) {
            throw new Error('云端数据不是有效的列表 JSON');
        }
    }

    /**
     * 更新 Gist 内容
     * @param {FavoriteItem[]} updatedList - 更新后的列表
     * @param {string} token - GitHub Token
     * @returns {Promise<void>}
     * @throws {Error} 更新失败时抛出错误
     */
    async updateGist(updatedList, token) {
        const response = await fetch(this.buildApiUrl(), {
            method: 'PATCH',
            headers: {
                Authorization: `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    [this.filename]: {
                        content: JSON.stringify(updatedList, null, 4)
                    }
                }
            })
        });

        if (!response.ok) {
            throw new Error('更新 Gist 失败');
        }
    }
}

/**
 * 收藏夹视图 - 处理 DOM 渲染
 */
class FavoritesView {
    /**
     * @param {Object} options - 视图选项
     * @param {HTMLElement} options.listEl - 列表容器元素
     * @param {HTMLElement} options.emptyEl - 空状态元素
     */
    constructor({ listEl, emptyEl }) {
        /** @type {HTMLElement} */
        this.listEl = listEl;
        /** @type {HTMLElement} */
        this.emptyEl = emptyEl;
    }

    /**
     * 显示加载状态
     * @param {string} [message='正在从云端加载收藏夹...'] - 加载消息
     * @returns {void}
     */
    showLoading(message = '正在从云端加载收藏夹...') {
        this.showMessage(message, '#666');
    }

    /**
     * 显示错误状态
     * @param {string} message - 错误消息
     * @returns {void}
     */
    showError(message) {
        this.showMessage(message, '#e74c3c');
    }

    /**
     * 显示消息
     * @param {string} message - 消息内容
     * @param {string} color - 文字颜色
     * @returns {void}
     */
    showMessage(message, color) {
        this.listEl.style.display = 'grid';
        this.listEl.innerHTML = '';
        this.emptyEl.style.display = 'none';

        const wrapper = document.createElement('div');
        wrapper.style.textAlign = 'center';
        wrapper.style.gridColumn = '1 / -1';
        wrapper.style.color = color;
        wrapper.textContent = message;

        this.listEl.appendChild(wrapper);
    }

    /**
     * 渲染收藏列表
     * @param {FavoriteItem[]} items - 要渲染的收藏项
     * @returns {void}
     */
    render(items) {
        this.listEl.innerHTML = '';

        if (!items || items.length === 0) {
            this.listEl.style.display = 'none';
            this.emptyEl.style.display = 'block';
            return;
        }

        this.listEl.style.display = 'grid';
        this.emptyEl.style.display = 'none';

        const fragment = document.createDocumentFragment();
        items.forEach((item) => {
            fragment.appendChild(this.buildCard(item));
        });
        this.listEl.appendChild(fragment);
    }

    /**
     * 构建卡片元素
     * @param {FavoriteItem} item - 收藏项数据
     * @returns {HTMLAnchorElement} 卡片元素
     */
    buildCard(item) {
        const card = document.createElement('a');
        card.className = 'favorite-card';
        
        let safeUrl = '#';
        try {
            const urlObj = new URL(item.url);
            if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
                safeUrl = item.url;
            }
        } catch (e) {
            // Invalid URL fallback
        }

        card.href = safeUrl;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';

        const title = document.createElement('div');
        title.className = 'card-title';
        title.textContent = item.name ?? '';

        const url = document.createElement('div');
        url.className = 'card-url';
        url.textContent = item.url ?? '';

        card.appendChild(title);
        card.appendChild(url);

        if (item.description) {
            const desc = document.createElement('div');
            desc.className = 'card-desc';
            desc.textContent = item.description;
            card.appendChild(desc);
        }

        return card;
    }
}

/**
 * 搜索引擎 - 支持精确匹配和模糊搜索
 */
class SearchEngine {
    /**
     * @param {FavoriteItem[]} [data=[]] - 初始数据
     */
    constructor(data = []) {
        /** @type {FavoriteItem[]} */
        this.data = data;
        /** @type {Object|null} */
        this.fuse = null;
    }

    /**
     * 更新数据源
     * @param {FavoriteItem[]} data - 新数据源
     * @returns {void}
     */
    updateSource(data) {
        this.data = Array.isArray(data) ? data : [];
        this.fuse = null;
    }

    /**
     * 过滤搜索结果
     * @param {string} term - 搜索词
     * @param {'exact'|'fuzzy'} mode - 搜索模式
     * @returns {FavoriteItem[]} 过滤后的结果
     */
    filter(term, mode) {
        const query = term.trim().toLowerCase();
        if (!query) {
            return this.data;
        }

        if (mode === 'exact') {
            return this.data.filter((item) => {
                const target = `${item.name ?? ''} ${item.url ?? ''} ${item.description ?? ''}`.toLowerCase();
                return SearchEngine.isSubsequence(query, target);
            });
        }

        const fuse = this.ensureFuse();
        return fuse.search(query).map((result) => result.item);
    }

    /**
     * 确保 Fuse 实例已初始化
     * @returns {Object} Fuse 实例
     * @throws {Error} Fuse.js 未加载时抛出错误
     */
    ensureFuse() {
        if (!this.fuse) {
            if (typeof Fuse === 'undefined') {
                throw new Error('Fuse.js 未加载');
            }

            this.fuse = new Fuse(this.data, {
                includeScore: true,
                threshold: 0.4,
                keys: ['name', 'url', 'description']
            });
        }
        return this.fuse;
    }

    /**
     * 判断 source 是否为 target 的子序列
     * @param {string} source - 源字符串
     * @param {string} target - 目标字符串
     * @returns {boolean} 是否为子序列
     */
    static isSubsequence(source, target) {
        let i = 0;
        let j = 0;

        while (i < source.length && j < target.length) {
            if (source[i] === target[j]) {
                i += 1;
            }
            j += 1;
        }

        return i === source.length;
    }
}

/**
 * 模态框控制器
 */
class ModalController {
    /**
     * @param {ModalElements} elements - DOM 元素引用
     */
    constructor(elements) {
        /** @type {HTMLElement} */
        this.modal = elements.modal;
        /** @type {HTMLElement} */
        this.openBtn = elements.openBtn;
        /** @type {HTMLElement} */
        this.closeBtn = elements.closeBtn;
        /** @type {HTMLElement} */
        this.tokenSection = elements.tokenSection;
        /** @type {HTMLInputElement} */
        this.tokenInput = elements.tokenInput;
        /** @type {HTMLElement} */
        this.saveTokenBtn = elements.saveTokenBtn;
        /** @type {HTMLElement} */
        this.clearTokenBtn = elements.clearTokenBtn;
        /** @type {HTMLFormElement} */
        this.addForm = elements.addForm;
        /** @type {HTMLElement} */
        this.statusMsg = elements.statusMsg;
        /** @type {HTMLElement} */
        this.submitBtn = elements.submitBtn;
    }

    /**
     * 初始化模态框事件
     * @param {ModalCallbacks} options - 回调函数配置
     * @returns {void}
     */
    init({ onOpen, onClose, onSaveToken, onClearToken, onSubmit }) {
        this.openBtn.addEventListener('click', () => {
            this.open();
            onOpen?.();
        });

        this.closeBtn.addEventListener('click', () => {
            this.close();
            onClose?.();
        });

        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.close();
                onClose?.();
            }
        });

        this.saveTokenBtn.addEventListener('click', () => {
            const token = this.tokenInput.value.trim();
            onSaveToken?.(token);
        });

        this.clearTokenBtn.addEventListener('click', () => {
            onClearToken?.();
        });

        this.addForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const payload = this.serializeForm();
            onSubmit?.(payload);
        });
    }

    /**
     * 打开模态框
     * @returns {void}
     */
    open() {
        this.modal.classList.add('active');
        this.resetStatus();
    }

    /**
     * 关闭模态框
     * @returns {void}
     */
    close() {
        this.modal.classList.remove('active');
        this.resetStatus();
    }

    /**
     * 序列化表单数据
     * @returns {FormPayload} 表单数据
     */
    serializeForm() {
        return {
            name: this.addForm.querySelector('#siteName')?.value.trim() ?? '',
            url: this.addForm.querySelector('#siteUrl')?.value.trim() ?? '',
            description: this.addForm.querySelector('#siteDesc')?.value.trim() ?? ''
        };
    }

    /**
     * 重置表单
     * @returns {void}
     */
    resetForm() {
        this.addForm.reset();
    }

    /**
     * 同步 Token 状态显示
     * @param {boolean} hasToken - 是否有 Token
     * @returns {void}
     */
    syncTokenState(hasToken) {
        if (hasToken) {
            this.tokenSection.style.display = 'none';
            this.addForm.style.display = 'block';
        } else {
            this.tokenSection.style.display = 'block';
            this.addForm.style.display = 'none';
        }
    }

    /**
     * 设置保存状态
     * @param {boolean} isSaving - 是否正在保存
     * @returns {void}
     */
    setSavingState(isSaving) {
        this.submitBtn.disabled = isSaving;
        this.submitBtn.textContent = isSaving ? '正在保存...' : '保存到 Gist';
    }

    /**
     * 显示状态消息
     * @param {string} message - 消息内容
     * @param {'info'|'error'} [type='info'] - 消息类型
     * @returns {void}
     */
    showStatus(message, type = 'info') {
        this.statusMsg.textContent = message;
        this.statusMsg.style.color = type === 'error' ? '#e74c3c' : '#666';
    }

    /**
     * 重置状态消息
     * @returns {void}
     */
    resetStatus() {
        this.showStatus('');
    }

    /**
     * 填充 Token 输入框
     * @param {string} [token=''] - Token 值
     * @returns {void}
     */
    fillToken(token = '') {
        this.tokenInput.value = token ?? '';
    }
}

/**
 * 收藏夹应用主控制器
 */
class FavoritesApp {
    /**
     * @param {FavoritesAppOptions} options - 应用配置
     */
    constructor({ service, storage, view, searchInput, exactMatchCheckbox, modal }) {
        /** @type {FavoritesService} */
        this.service = service;
        /** @type {Object} */
        this.storage = storage;
        /** @type {FavoritesView} */
        this.view = view;
        /** @type {HTMLInputElement} */
        this.searchInput = searchInput;
        /** @type {HTMLInputElement} */
        this.exactMatchCheckbox = exactMatchCheckbox;
        /** @type {ModalController} */
        this.modal = modal;

        /** @type {AppState} */
        this.state = {
            favorites: [],
            token: storage.get()
        };

        /** @type {SearchEngine} */
        this.searchEngine = new SearchEngine();
        /** @type {AbortController|null} */
        this.abortController = null;
    }

    /**
     * 初始化应用
     * @returns {void}
     */
    init() {
        this.view.showLoading();
        this.bindSearch();
        this.setupModal();
        this.loadFavorites();
    }

    /**
     * 绑定搜索事件
     * @returns {void}
     */
    bindSearch() {
        const triggerSearch = () => {
            this.applySearch();
        };

        this.searchInput.addEventListener('input', triggerSearch);
        this.exactMatchCheckbox.addEventListener('change', triggerSearch);
    }

    /**
     * 设置模态框
     * @returns {void}
     */
    setupModal() {
        this.modal.init({
            onOpen: () => {
                this.modal.fillToken(this.state.token);
                this.modal.syncTokenState(Boolean(this.state.token));
            },
            onClose: () => {
                this.modal.fillToken(this.state.token);
            },
            onSaveToken: (token) => {
                if (!token) {
                    this.modal.showStatus('Token 不能为空', 'error');
                    return;
                }
                this.storage.set(token);
                this.state.token = token;
                this.modal.syncTokenState(true);
                this.modal.showStatus('Token 保存成功');
            },
            onClearToken: () => {
                const confirmed = window.confirm('确定要清除本地保存的 Token 吗？');
                if (!confirmed) {
                    return;
                }
                this.storage.clear();
                this.state.token = '';
                this.modal.fillToken('');
                this.modal.syncTokenState(false);
                this.modal.showStatus('Token 已清除');
            },
            onSubmit: (payload) => {
                this.handleCreateFavorite(payload);
            }
        });

        this.modal.syncTokenState(Boolean(this.state.token));
    }

    /**
     * 加载收藏数据
     * @returns {Promise<void>}
     */
    async loadFavorites() {
        this.abortController?.abort();
        this.abortController = new AbortController();

        try {
            const data = await this.service.fetchAll(this.abortController.signal);
            this.state.favorites = Array.isArray(data) ? data : [];
            this.searchEngine.updateSource(this.state.favorites);
            const hasQuery = Boolean((this.searchInput.value ?? '').trim());
            this.applySearch(!hasQuery);
        } catch (error) {
            if (this.abortController.signal.aborted) {
                return;
            }
            console.error('加载数据失败:', error);
            this.view.showError(`加载数据失败：${error.message}`);
        }
    }

    /**
     * 应用搜索过滤
     * @param {boolean} [forceFullRender=false] - 是否强制完整渲染
     * @returns {void}
     */
    applySearch(forceFullRender = false) {
        const term = this.searchInput.value ?? '';
        const mode = this.exactMatchCheckbox.checked ? 'exact' : 'fuzzy';

        if (!term.trim() || forceFullRender) {
            this.view.render(this.state.favorites);
            return;
        }

        try {
            const result = this.searchEngine.filter(term, mode);
            this.view.render(result);
        } catch (error) {
            console.error('搜索失败:', error);
            this.view.showError(`搜索功能不可用：${error.message}`);
        }
    }

    /**
     * 处理创建收藏
     * @param {FormPayload} payload - 表单数据
     * @returns {Promise<void>}
     */
    async handleCreateFavorite(payload) {
        const sanitized = {
            name: payload.name.trim(),
            url: payload.url.trim(),
            description: payload.description.trim()
        };

        if (!sanitized.name || !sanitized.url) {
            this.modal.showStatus('名称和网址不能为空', 'error');
            return;
        }

        try {
            const urlObj = new URL(sanitized.url);
            if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
                throw new Error('Invalid protocol');
            }
        } catch (e) {
            this.modal.showStatus('请输入有效的网址（需以 http:// 或 https:// 开头）', 'error');
            return;
        }

        if (sanitized.name.length > 100) {
            this.modal.showStatus('名称不能超过 100 个字符', 'error');
            return;
        }

        if (sanitized.description.length > 500) {
            this.modal.showStatus('描述不能超过 500 个字符', 'error');
            return;
        }

        if (!this.state.token) {
            this.modal.showStatus('请先配置 Token', 'error');
            this.modal.syncTokenState(false);
            return;
        }

        try {
            this.modal.setSavingState(true);
            this.modal.showStatus('正在保存到云端...');
            await this.service.append(sanitized, this.state.token);
            this.modal.resetForm();
            this.modal.close();
            await this.loadFavorites();
            window.alert('保存成功！收藏夹已刷新。');
        } catch (error) {
            console.error('保存失败:', error);
            this.modal.showStatus(`保存失败：${error.message}`, 'error');
        } finally {
            this.modal.setSavingState(false);
        }
    }
}

function showToast(message, type = 'error') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = type === 'error' ? '#e74c3c' : '#333';
    toast.style.color = '#fff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.zIndex = '9999';
    toast.style.fontFamily = 'inherit';
    toast.style.fontSize = '14px';
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.transition = 'opacity 0.5s ease';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
        console.error('全局错误:', event.error);
        showToast('应用发生错误，请刷新页面重试: ' + (event.error?.message || '未知错误'));
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('未处理的 Promise 错误:', event.reason);
        showToast('应用发生错误，请刷新页面重试: ' + (event.reason?.message || '未知错误'));
    });

    window.addEventListener('DOMContentLoaded', () => {
        const favoritesList = document.getElementById('favoritesList');
        const noResults = document.getElementById('noResults');
        const searchInput = document.getElementById('searchInput');
        const exactMatchCheckbox = document.getElementById('exactMatch');

        const modal = new ModalController({
            modal: document.getElementById('modal'),
            openBtn: document.getElementById('addBtn'),
            closeBtn: document.querySelector('.close-btn'),
            tokenSection: document.getElementById('tokenSection'),
            tokenInput: document.getElementById('tokenInput'),
            saveTokenBtn: document.getElementById('saveTokenBtn'),
            clearTokenBtn: document.getElementById('clearTokenBtn'),
            addForm: document.getElementById('addForm'),
            statusMsg: document.getElementById('statusMsg'),
            submitBtn: document.getElementById('submitBtn')
        });

        const app = new FavoritesApp({
            service: new FavoritesService(GIST_CONFIG),
            storage: TokenStorage,
            view: new FavoritesView({ listEl: favoritesList, emptyEl: noResults }),
            searchInput,
            exactMatchCheckbox,
            modal
        });

        app.init();
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FavoritesService,
        FavoritesView,
        SearchEngine,
        ModalController,
        FavoritesApp,
        TokenStorage,
        GIST_CONFIG
    };
}
