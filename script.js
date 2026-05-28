/**
 * @typedef {Object} FavoriteItem
 * @property {string} name - 网站名称
 * @property {string} url - 网站地址
 * @property {string} [description] - 可选的描述
 * @property {string[]} [tags] - 可选的标签列表
 * @property {string} [createdAt] - 创建时间 (ISO8601)
 * @property {string} [updatedAt] - 更新时间 (ISO8601)
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
 * @property {string} tags - 逗号分隔的标签字符串
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
 * 国际化翻译对象
 * @type {Object}
 */
const TRANSLATIONS = {
    zh: {
        title: '我的网络收藏夹',
        searchPlaceholder: '搜索网站名称或网址...',
        exactSearch: '精确搜索 (顺序匹配)',
        addBtn: '＋ 添加',
        exportBtn: '导出',
        importBtn: '导入',
        modalTitle: '添加新收藏',
        editModalTitle: '编辑收藏',
        nameLabel: '名称',
        namePlaceholder: '例如: GitHub',
        urlLabel: '网址',
        urlPlaceholder: 'https://...',
        descLabel: '描述 (可选)',
        descPlaceholder: '简短的描述...',
        tagsLabel: '标签 (可选，逗号分隔)',
        tagsPlaceholder: '例如: 工具, 设计, 学习',
        saveBtn: '保存到 Gist',
        updateBtn: '更新',
        savingBtn: '正在保存...',
        tokenTip: '首次使用需要配置 GitHub Token (需开启 Gist 权限)',
        tokenPlaceholder: '粘贴 GitHub Personal Access Token',
        saveTokenBtn: '保存配置',
        resetTokenBtn: '重置 Token',
        applyTokenLink: '去 GitHub 申请 Token →',
        loadingMsg: '正在从云端加载收藏夹...',
        noResults: '没有找到匹配的网站',
        editBtn: '编辑',
        deleteBtn: '删除',
        offlineMsg: '当前处于离线状态，显示的是缓存数据',
        copyright: '© 2025 My Favorites',
        confirmDelete: (name) => `确定要删除"${name}"吗？`,
        saveSuccess: '保存成功！收藏夹已刷新。',
        updateSuccess: '更新成功！收藏夹已刷新。',
        deleteSuccess: '删除成功',
        exportSuccess: '导出成功',
        importSuccess: (count) => `成功导入 ${count} 个收藏项`,
        tokenRequired: '请先配置 Token',
        nameUrlRequired: '名称和网址不能为空',
        invalidUrl: '请输入有效的网址（需以 http:// 或 https:// 开头）',
        nameTooLong: '名称不能超过 100 个字符',
        descTooLong: '描述不能超过 500 个字符',
        tokenSaved: 'Token 保存成功',
        tokenCleared: 'Token 已清除',
        confirmClearToken: '确定要清除本地保存的 Token 吗？',
        tokenEmpty: 'Token 不能为空',
        importNotArray: '导入文件格式错误：不是数组',
        importNoValid: '导入文件中没有有效的收藏项',
        importAllExists: '所有收藏项已存在，无需导入',
        importValidationFail: '导入验证失败',
        appError: '应用发生错误，请刷新页面重试',
        searchUnavailable: '搜索功能不可用',
        loadFailed: '加载失败',
        saveFailed: '保存失败',
        deleteFailed: '删除失败',
        importFailed: '导入失败',
        networkError: '网络连接失败',
        authError: '认证失败',
        validationError: '数据错误',
        unknownError: '加载失败',
        statusSaving: '正在保存到云端...',
        statusUpdating: '正在更新...'
    },
    en: {
        title: 'My Favorites',
        searchPlaceholder: 'Search by name or URL...',
        exactSearch: 'Exact search (sequence match)',
        addBtn: '＋ Add',
        exportBtn: 'Export',
        importBtn: 'Import',
        modalTitle: 'Add New Favorite',
        editModalTitle: 'Edit Favorite',
        nameLabel: 'Name',
        namePlaceholder: 'e.g. GitHub',
        urlLabel: 'URL',
        urlPlaceholder: 'https://...',
        descLabel: 'Description (optional)',
        descPlaceholder: 'Short description...',
        tagsLabel: 'Tags (optional, comma-separated)',
        tagsPlaceholder: 'e.g. tools, design, learning',
        saveBtn: 'Save to Gist',
        updateBtn: 'Update',
        savingBtn: 'Saving...',
        tokenTip: 'First time requires GitHub Token (with Gist permission)',
        tokenPlaceholder: 'Paste GitHub Personal Access Token',
        saveTokenBtn: 'Save Config',
        resetTokenBtn: 'Reset Token',
        applyTokenLink: 'Get GitHub Token →',
        loadingMsg: 'Loading favorites from cloud...',
        noResults: 'No matching websites found',
        editBtn: 'Edit',
        deleteBtn: 'Delete',
        offlineMsg: 'You are offline. Showing cached data.',
        copyright: '© 2025 My Favorites',
        confirmDelete: (name) => `Delete "${name}"?`,
        saveSuccess: 'Saved! Favorites refreshed.',
        updateSuccess: 'Updated! Favorites refreshed.',
        deleteSuccess: 'Deleted successfully',
        exportSuccess: 'Export successful',
        importSuccess: (count) => `Imported ${count} favorites`,
        tokenRequired: 'Please configure Token first',
        nameUrlRequired: 'Name and URL are required',
        invalidUrl: 'Please enter a valid URL (starting with http:// or https://)',
        nameTooLong: 'Name cannot exceed 100 characters',
        descTooLong: 'Description cannot exceed 500 characters',
        tokenSaved: 'Token saved successfully',
        tokenCleared: 'Token cleared',
        confirmClearToken: 'Clear saved Token?',
        tokenEmpty: 'Token cannot be empty',
        importNotArray: 'Import format error: not an array',
        importNoValid: 'No valid favorites in import file',
        importAllExists: 'All favorites already exist',
        importValidationFail: 'Import validation failed',
        appError: 'Application error, please refresh',
        searchUnavailable: 'Search unavailable',
        loadFailed: 'Failed to load data',
        saveFailed: 'Save failed',
        deleteFailed: 'Delete failed',
        importFailed: 'Import failed',
        networkError: 'Network error',
        authError: 'Authentication failed',
        validationError: 'Validation error',
        unknownError: 'Load failed',
        statusSaving: 'Saving to cloud...',
        statusUpdating: 'Updating...'
    }
};

/**
 * 语言管理器 - 处理界面语言切换与持久化
 * @type {Object}
 */
const LanguageManager = {
    /** @type {string} */
    current: 'zh',

    /**
     * 初始化语言设置，优先读取 localStorage，其次检测浏览器语言
     * @returns {void}
     */
    init() {
        const saved = localStorage.getItem('lang');
        if (saved && TRANSLATIONS[saved]) {
            this.current = saved;
        } else if (navigator.language.startsWith('en')) {
            this.current = 'en';
        }
    },

    /**
     * 获取翻译文本
     * @param {string} key - 翻译键名
     * @returns {string|Function} 翻译文本或翻译函数
     */
    t(key) {
        return TRANSLATIONS[this.current]?.[key] ?? TRANSLATIONS.zh[key] ?? key;
    },

    /**
     * 设置语言
     * @param {string} lang - 语言代码
     * @returns {void}
     */
    setLang(lang) {
        if (TRANSLATIONS[lang]) {
            this.current = lang;
            localStorage.setItem('lang', lang);
            document.documentElement.setAttribute('lang', lang);
        }
    },

    /**
     * 切换语言
     * @returns {void}
     */
    toggle() {
        this.setLang(this.current === 'zh' ? 'en' : 'zh');
    }
};

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
     * 带指数退避的重试
     * @param {Function} fn - 要重试的异步函数
     * @param {number} [maxRetries=3] - 最大重试次数
     * @param {number} [baseDelay=1000] - 基础延迟（毫秒）
     * @returns {Promise<*>} 函数结果
     */
    static async retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                if (attempt === maxRetries) throw error;
                const delay = baseDelay * Math.pow(2, attempt);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
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
        return FavoritesService.retryWithBackoff(async () => {
            const url = `${this.buildDataUrl()}?t=${Date.now()}`;
            const response = await fetch(url, { signal });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        });
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
        return FavoritesService.retryWithBackoff(async () => {
            const response = await fetch(this.buildApiUrl(), {
                headers: {
                    Authorization: `token ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('拉取 Gist 信息失败，请检查 Token 权限');
            }

            return response.json();
        });
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
            return parsed.filter((item) => item && typeof item.url === 'string' && typeof item.name === 'string');
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

    /**
     * 根据 URL 查找收藏项
     * @param {string} url - 要查找的 URL
     * @returns {Promise<{item: FavoriteItem, index: number} | null>} 查找结果
     */
    async findByUrl(url) {
        const list = await this.fetchAll(new AbortController().signal);
        const index = list.findIndex((item) => item.url === url);
        if (index === -1) return null;
        return { item: list[index], index };
    }

    /**
     * 编辑指定索引的收藏项
     * @param {number} index - 要编辑的项索引
     * @param {FavoriteItem} updatedItem - 更新后的数据
     * @param {string} token - GitHub Token
     * @returns {Promise<void>}
     * @throws {Error} 索引无效或请求失败时抛出错误
     */
    async edit(index, updatedItem, token) {
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
            if (index < 0 || index >= list.length) {
                throw new Error('无效的收藏索引');
            }
            list[index] = { ...list[index], ...updatedItem, updatedAt: new Date().toISOString() };
            await this.updateGist(list, token);
        } finally {
            this.isUpdating = false;
        }
    }

    /**
     * 删除指定索引的收藏项
     * @param {number} index - 要删除的项索引
     * @param {string} token - GitHub Token
     * @returns {Promise<void>}
     * @throws {Error} 索引无效或请求失败时抛出错误
     */
    async delete(index, token) {
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
            if (index < 0 || index >= list.length) {
                throw new Error('无效的收藏索引');
            }
            list.splice(index, 1);
            await this.updateGist(list, token);
        } finally {
            this.isUpdating = false;
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
     * @returns {void}
     */
    showLoading() {
        this.listEl.style.display = 'grid';
        this.listEl.innerHTML = '';
        this.emptyEl.style.display = 'none';

        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 6; i++) {
            const card = document.createElement('div');
            card.className = 'skeleton-card';
            card.innerHTML = `
                <div class="skeleton-line"></div>
                <div class="skeleton-line skeleton-line--medium"></div>
                <div class="skeleton-line skeleton-line--short"></div>
            `;
            fragment.appendChild(card);
        }
        this.listEl.appendChild(fragment);
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
    render(items, showActions = false) {
        this.listEl.innerHTML = '';

        if (!items || items.length === 0) {
            this.listEl.style.display = 'none';
            this.emptyEl.style.display = 'block';
            return;
        }

        this.listEl.style.display = 'grid';
        this.emptyEl.style.display = 'none';

        const fragment = document.createDocumentFragment();
        items.forEach((item, index) => {
            fragment.appendChild(this.buildCard(item, index, showActions));
        });
        this.listEl.appendChild(fragment);
    }

    /**
     * 构建卡片元素
     * @param {FavoriteItem} item - 收藏项数据
     * @param {number} [index=0] - 卡片索引（用于动画延迟）
     * @returns {HTMLAnchorElement} 卡片元素
     */
    buildCard(item, index = 0, showActions = false) {
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

        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                card.click();
            }
        });

        card.style.setProperty('--delay', `${index * 0.05}s`);

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

        if (item.tags && item.tags.length > 0) {
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'card-tags';
            item.tags.forEach((tag) => {
                const pill = document.createElement('span');
                pill.className = 'tag-pill';
                pill.textContent = tag;
                tagsContainer.appendChild(pill);
            });
            card.appendChild(tagsContainer);
        }

        if (showActions) {
            const actions = document.createElement('div');
            actions.className = 'card-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'card-action-btn';
            editBtn.textContent = LanguageManager.t('editBtn');
            editBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                card.dispatchEvent(new CustomEvent('edit-favorite', { bubbles: true, detail: { index } }));
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'card-action-btn card-action-btn--danger';
            deleteBtn.textContent = LanguageManager.t('deleteBtn');
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                card.dispatchEvent(new CustomEvent('delete-favorite', { bubbles: true, detail: { index } }));
            });

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
            card.appendChild(actions);
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

        // Handle #tag syntax
        if (query.startsWith('#')) {
            const tagPart = query.slice(1).split(' ')[0].toLowerCase();
            const remainingQuery = query.slice(1 + tagPart.length).trim();
            const tagMatches = this.data.filter(
                (item) => item.tags && item.tags.some((t) => t.toLowerCase() === tagPart)
            );
            if (remainingQuery) {
                return tagMatches.filter((item) => {
                    const target = `${item.name ?? ''} ${item.url ?? ''} ${item.description ?? ''}`.toLowerCase();
                    return target.includes(remainingQuery);
                });
            }
            return tagMatches;
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
        this.openBtn.addEventListener('click', (e) => {
            e.preventDefault();
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

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
                onClose?.();
            }
        });
    }

    /**
     * 打开模态框
     * @returns {void}
     */
    open() {
        this.modal.classList.add('active');
        this.resetStatus();
        document.getElementById('modalTitle').textContent = LanguageManager.t('modalTitle');
        this.submitBtn.textContent = LanguageManager.t('saveBtn');
        if (this._focusTrapHandler) {
            this.modal.removeEventListener('keydown', this._focusTrapHandler);
        }
        this._focusTrapHandler = (e) => this._trapFocus(e);
        this.modal.addEventListener('keydown', this._focusTrapHandler);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const focusTarget = this.tokenSection.style.display !== 'none'
                    ? this.tokenInput
                    : this.modal.querySelector('#siteName');
                if (focusTarget) focusTarget.focus();
            });
        });
    }

    openForEdit(item) {
        this.open();
        this.addForm.querySelector('#siteName').value = item.name || '';
        this.addForm.querySelector('#siteUrl').value = item.url || '';
        this.addForm.querySelector('#siteDesc').value = item.description || '';
        this.addForm.querySelector('#siteTags').value = (item.tags || []).join(', ');
        document.getElementById('modalTitle').textContent = LanguageManager.t('editModalTitle');
        this.submitBtn.textContent = LanguageManager.t('updateBtn');
    }

    /**
     * 关闭模态框
     * @returns {void}
     */
    close() {
        this.modal.classList.remove('active');
        this.resetStatus();
        if (this._focusTrapHandler) {
            this.modal.removeEventListener('keydown', this._focusTrapHandler);
        }
        if (this.openBtn) this.openBtn.focus();
    }

    /**
     * 捕获焦点在模态框内循环
     * @param {KeyboardEvent} event - 键盘事件
     * @returns {void}
     */
    _trapFocus(event) {
        if (event.key !== 'Tab') return;
        const focusable = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey) {
            if (document.activeElement === first) {
                event.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    }

    /**
     * 序列化表单数据
     * @returns {FormPayload} 表单数据
     */
    serializeForm() {
        return {
            name: this.addForm.querySelector('#siteName')?.value.trim() ?? '',
            url: this.addForm.querySelector('#siteUrl')?.value.trim() ?? '',
            description: this.addForm.querySelector('#siteDesc')?.value.trim() ?? '',
            tags: this.addForm.querySelector('#siteTags')?.value.trim() ?? ''
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
        this.submitBtn.textContent = isSaving ? LanguageManager.t('savingBtn') : LanguageManager.t('saveBtn');
    }

    /**
     * 显示状态消息
     * @param {string} message - 消息内容
     * @param {'info'|'error'} [type='info'] - 消息类型
     * @returns {void}
     */
    showStatus(message, type = 'info') {
        if (!message) {
            this.statusMsg.textContent = '';
            this.statusMsg.removeAttribute('role');
            return;
        }
        if (type === 'error') {
            this.statusMsg.innerHTML = `<span class="status-icon status-icon--error"><svg class="icon-svg icon-svg--sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span>${message}`;
            this.statusMsg.setAttribute('role', 'alert');
        } else {
            this.statusMsg.textContent = message;
            this.statusMsg.setAttribute('role', 'status');
        }
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
            token: storage.get(),
            editIndex: null
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

        this.view.listEl.addEventListener('edit-favorite', (e) => {
            this.openForEdit(e.detail.index);
        });
        this.view.listEl.addEventListener('delete-favorite', (e) => {
            this.handleDeleteFavorite(e.detail.index);
        });

        this.view.listEl.addEventListener('click', (e) => {
            const tagPill = e.target.closest('.tag-pill');
            if (tagPill) {
                e.preventDefault();
                e.stopPropagation();
                this.searchInput.value = tagPill.textContent;
                this.applySearch();
            }
        });
    }

    /**
     * 绑定搜索事件
     * @returns {void}
     */
    bindSearch() {
        let debounceTimer;
        const triggerSearch = () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => this.applySearch(), 250);
        };

        this.searchInput.addEventListener('input', triggerSearch);
        this.exactMatchCheckbox.addEventListener('change', triggerSearch);

        const searchClear = document.getElementById('searchClear');
        if (searchClear) {
            const updateClearVisibility = () => {
                searchClear.classList.toggle('visible', Boolean(this.searchInput.value.trim()));
            };
            this.searchInput.addEventListener('input', updateClearVisibility);
            searchClear.addEventListener('click', () => {
                this.searchInput.value = '';
                searchClear.classList.remove('visible');
                this.applySearch();
                this.searchInput.focus();
            });
        }
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
                    this.modal.showStatus(LanguageManager.t('tokenEmpty'), 'error');
                    return;
                }
                this.storage.set(token);
                this.state.token = token;
                this.modal.syncTokenState(true);
                this.modal.showStatus(LanguageManager.t('tokenSaved'));
            },
            onClearToken: () => {
                const confirmed = window.confirm(LanguageManager.t('confirmClearToken'));
                if (!confirmed) {
                    return;
                }
                this.storage.clear();
                this.state.token = '';
                this.modal.fillToken('');
                this.modal.syncTokenState(false);
                this.modal.showStatus(LanguageManager.t('tokenCleared'));
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
            const type = this._classifyError(error);
            const prefix =
                type === 'network'
                    ? LanguageManager.t('networkError')
                    : type === 'auth'
                      ? LanguageManager.t('authError')
                      : LanguageManager.t('loadFailed');
            this.view.showError(`${prefix}：${error.message}`);
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
        const showActions = Boolean(this.state.token);

        if (!term.trim() || forceFullRender) {
            this.view.render(this.state.favorites, showActions);
            return;
        }

        try {
            const result = this.searchEngine.filter(term, mode);
            this.view.render(result, showActions);
        } catch (error) {
            console.error('搜索失败:', error);
            this.view.showError(`${LanguageManager.t('searchUnavailable')}：${error.message}`);
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
            description: payload.description.trim(),
            tags: payload.tags
                ? payload.tags
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean)
                : []
        };

        if (!sanitized.name || !sanitized.url) {
            this.modal.showStatus(LanguageManager.t('nameUrlRequired'), 'error');
            return;
        }

        try {
            const urlObj = new URL(sanitized.url);
            if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
                throw new Error('Invalid protocol');
            }
        } catch (e) {
            this.modal.showStatus(LanguageManager.t('invalidUrl'), 'error');
            return;
        }

        if (sanitized.name.length > 100) {
            this.modal.showStatus(LanguageManager.t('nameTooLong'), 'error');
            return;
        }

        if (sanitized.description.length > 500) {
            this.modal.showStatus(LanguageManager.t('descTooLong'), 'error');
            return;
        }

        if (!this.state.token) {
            this.modal.showStatus(LanguageManager.t('tokenRequired'), 'error');
            this.modal.syncTokenState(false);
            return;
        }

        const isEdit = this.state.editIndex !== null;

        try {
            this.modal.setSavingState(true);
            this.modal.showStatus(isEdit ? LanguageManager.t('statusUpdating') : LanguageManager.t('statusSaving'));
            if (isEdit) {
                await this.service.edit(this.state.editIndex, sanitized, this.state.token);
                this.state.editIndex = null;
            } else {
                await this.service.append(sanitized, this.state.token);
            }
            this.modal.resetForm();
            this.modal.close();
            await this.loadFavorites();
            window.alert(isEdit ? LanguageManager.t('updateSuccess') : LanguageManager.t('saveSuccess'));
        } catch (error) {
            console.error(isEdit ? '更新失败:' : '保存失败:', error);
            const type = this._classifyError(error);
            const prefix =
                type === 'auth'
                    ? LanguageManager.t('authError')
                    : type === 'network'
                      ? LanguageManager.t('networkError')
                      : type === 'validation'
                        ? LanguageManager.t('validationError')
                        : LanguageManager.t('saveFailed');
            this.modal.showStatus(`${prefix}：${error.message}`, 'error');
        } finally {
            this.modal.setSavingState(false);
        }
    }

    /**
     * 打开编辑模态框
     * @param {number} index - 要编辑的收藏项索引
     * @returns {void}
     */
    openForEdit(index) {
        const item = this.state.favorites[index];
        if (!item) return;
        this.state.editIndex = index;
        this.modal.openForEdit(item);
    }

    /**
     * 删除收藏项
     * @param {number} index - 要删除的收藏项索引
     * @returns {Promise<void>}
     */
    async handleDeleteFavorite(index) {
        const item = this.state.favorites[index];
        if (!item) return;
        const confirmed = window.confirm(LanguageManager.t('confirmDelete')(item.name));
        if (!confirmed) return;
        if (!this.state.token) {
            showToast(LanguageManager.t('tokenRequired'), 'error');
            return;
        }
        try {
            await this.service.delete(index, this.state.token);
            await this.loadFavorites();
            showToast(LanguageManager.t('deleteSuccess'), 'success');
        } catch (error) {
            console.error('删除失败:', error);
            showToast(`${LanguageManager.t('deleteFailed')}：${error.message}`, 'error');
        }
    }

    /**
     * 导出收藏为 JSON 文件
     * @returns {void}
     */
    exportFavorites() {
        const data = JSON.stringify(this.state.favorites, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `favorites-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast(LanguageManager.t('exportSuccess'), 'success');
    }

    /**
     * 验证导入数据的格式和内容
     * @param {*} data - 要验证的数据
     * @returns {{valid: boolean, errors: string[]}} 验证结果
     */
    _validateImportData(data) {
        const errors = [];
        if (!Array.isArray(data)) {
            errors.push('导入数据不是数组');
            return { valid: false, errors };
        }
        data.forEach((item, index) => {
            if (!item || typeof item !== 'object') {
                errors.push(`第 ${index + 1} 项不是对象`);
                return;
            }
            if (typeof item.name !== 'string' || !item.name.trim()) {
                errors.push(`第 ${index + 1} 项缺少名称`);
            }
            if (typeof item.url !== 'string' || !item.url.trim()) {
                errors.push(`第 ${index + 1} 项缺少网址`);
            } else {
                try {
                    const urlObj = new URL(item.url);
                    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
                        errors.push(`第 ${index + 1} 项网址协议无效`);
                    }
                } catch {
                    errors.push(`第 ${index + 1} 项网址格式无效`);
                }
            }
            if (item.tags !== undefined && item.tags !== null) {
                if (!Array.isArray(item.tags)) {
                    errors.push(`第 ${index + 1} 项标签格式无效（应为数组）`);
                } else if (!item.tags.every((t) => typeof t === 'string')) {
                    errors.push(`第 ${index + 1} 项标签包含非字符串值`);
                }
            }
        });
        return { valid: errors.length === 0, errors };
    }

    /**
     * 分类错误类型
     * @param {Error} error - 错误对象
     * @returns {'auth'|'network'|'validation'|'unknown'} 错误类型
     */
    _classifyError(error) {
        const msg = error.message || '';
        if (msg.includes('Token') || msg.includes('权限') || msg.includes('401') || msg.includes('403')) {
            return 'auth';
        }
        if (msg.includes('网络') || msg.includes('fetch') || msg.includes('Network') || msg.includes('Failed')) {
            return 'network';
        }
        if (msg.includes('验证') || msg.includes('格式') || msg.includes('无效')) {
            return 'validation';
        }
        return 'unknown';
    }

    /**
     * 从 JSON 文件导入收藏
     * @param {File} file - 要导入的 JSON 文件
     * @returns {void}
     */
    importFavorites(file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                const validation = this._validateImportData(imported);
                if (!validation.valid) {
                    showToast(`${LanguageManager.t('importValidationFail')}：${validation.errors[0]}`, 'error');
                    return;
                }
                const existingUrls = new Set(this.state.favorites.map((f) => f.url));
                const newItems = imported.filter((item) => !existingUrls.has(item.url));
                if (newItems.length === 0) {
                    showToast(LanguageManager.t('importAllExists'), 'error');
                    return;
                }
                if (!this.state.token) {
                    showToast(LanguageManager.t('tokenRequired'), 'error');
                    return;
                }
                const merged = [...this.state.favorites, ...newItems];
                await this.service.updateGist(merged, this.state.token);
                await this.loadFavorites();
                showToast(LanguageManager.t('importSuccess')(newItems.length), 'success');
            } catch (error) {
                console.error('导入失败:', error);
                showToast(`${LanguageManager.t('importFailed')}：${error.message}`, 'error');
            }
        };
        reader.readAsText(file);
    }
}

function showToast(message, type = 'error') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('aria-live', 'polite');
    toast.setAttribute('role', 'status');

    const iconSvg = type === 'error'
        ? '<svg class="toast__icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
        : '<svg class="toast__icon" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';

    toast.innerHTML = iconSvg + `<span>${message}</span>`;

    if (type === 'error') {
        toast.classList.add('toast--error');
    } else if (type === 'success') {
        toast.classList.add('toast--success');
    }
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
        console.error('全局错误:', event.error);
        showToast(`${LanguageManager.t('appError')}: ` + (event.error?.message || LanguageManager.t('unknownError')));
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('未处理的 Promise 错误:', event.reason);
        showToast(`${LanguageManager.t('appError')}: ` + (event.reason?.message || LanguageManager.t('unknownError')));
    });

    window.addEventListener('DOMContentLoaded', () => {
        const favoritesList = document.getElementById('favoritesList');
        const noResults = document.getElementById('noResults');
        const searchInput = document.getElementById('searchInput');
        const exactMatchCheckbox = document.getElementById('exactMatch');

        LanguageManager.init();
        document.documentElement.setAttribute('lang', LanguageManager.current);

        const langToggle = document.getElementById('langToggle');
        const langText = langToggle.querySelector('.lang-toggle__text');

        const updateUILanguage = () => {
            langText.textContent = LanguageManager.current === 'zh' ? 'EN' : '中';
            document.getElementById('searchInput').placeholder = LanguageManager.t('searchPlaceholder');
            document.getElementById('addBtn').textContent = LanguageManager.t('addBtn');
            document.getElementById('exportBtn').textContent = LanguageManager.t('exportBtn');
            document.getElementById('importBtnLabel').textContent = LanguageManager.t('importBtn');
            document.querySelector('h1').textContent = LanguageManager.t('title');
            document.getElementById('exactMatchLabel').textContent = LanguageManager.t('exactSearch');
            document.getElementById('noResults').textContent = LanguageManager.t('noResults');
            document.getElementById('offlineBanner').querySelector('span').textContent = LanguageManager.t('offlineMsg');
            document.querySelector('footer p').textContent = LanguageManager.t('copyright');
            document.getElementById('modalTitle').textContent = LanguageManager.t('modalTitle');
            document.getElementById('tokenLabel').textContent = LanguageManager.t('tokenTip');
            document.getElementById('tokenInput').placeholder = LanguageManager.t('tokenPlaceholder');
            document.getElementById('saveTokenBtn').textContent = LanguageManager.t('saveTokenBtn');
            document.getElementById('clearTokenBtn').textContent = LanguageManager.t('resetTokenBtn');
            document.querySelector('#tokenSection .small-tip a').textContent = LanguageManager.t('applyTokenLink');
            document.querySelector('label[for="siteName"]').textContent = LanguageManager.t('nameLabel');
            document.getElementById('siteName').placeholder = LanguageManager.t('namePlaceholder');
            document.querySelector('label[for="siteUrl"]').textContent = LanguageManager.t('urlLabel');
            document.getElementById('siteUrl').placeholder = LanguageManager.t('urlPlaceholder');
            document.querySelector('label[for="siteDesc"]').textContent = LanguageManager.t('descLabel');
            document.getElementById('siteDesc').placeholder = LanguageManager.t('descPlaceholder');
            document.querySelector('label[for="siteTags"]').textContent = LanguageManager.t('tagsLabel');
            document.getElementById('siteTags').placeholder = LanguageManager.t('tagsPlaceholder');
        };

        langToggle.addEventListener('click', () => {
            LanguageManager.toggle();
            updateUILanguage();
        });

        updateUILanguage();

        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('.theme-toggle__icon');

        const moonSvg = '<svg class="icon-svg icon-svg--md" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
        const sunSvg = '<svg class="icon-svg icon-svg--md" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            themeIcon.innerHTML = savedTheme === 'dark' ? sunSvg : moonSvg;
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.innerHTML = sunSvg;
        }

        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            themeIcon.innerHTML = next === 'dark' ? sunSvg : moonSvg;
        });

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

        const offlineBanner = document.getElementById('offlineBanner');
        const updateOnlineStatus = () => {
            if (navigator.onLine) {
                offlineBanner.classList.remove('visible');
                setTimeout(() => {
                    offlineBanner.style.display = 'none';
                }, 300);
            } else {
                offlineBanner.style.display = 'block';
                requestAnimationFrame(() => offlineBanner.classList.add('visible'));
            }
        };
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        if (!navigator.onLine) updateOnlineStatus();

        document.getElementById('exportBtn').addEventListener('click', () => app.exportFavorites());
        document.getElementById('importInput').addEventListener('change', (e) => {
            if (e.target.files[0]) {
                app.importFavorites(e.target.files[0]);
                e.target.value = '';
            }
        });

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch((err) => {
                console.error('SW 注册失败:', err);
            });
        }
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
        GIST_CONFIG,
        TRANSLATIONS,
        LanguageManager
    };
}
