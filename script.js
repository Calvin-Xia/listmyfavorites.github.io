const GIST_CONFIG = Object.freeze({
    owner: 'Calvin-Xia',
    id: '9c84112f9a5affcc63d4693a6282f74f',
    filename: 'data.json'
});

const TokenStorage = {
    key: 'github_token',
    get() {
        return localStorage.getItem(this.key) || '';
    },
    set(token) {
        localStorage.setItem(this.key, token);
    },
    clear() {
        localStorage.removeItem(this.key);
    }
};

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

    async fetchAll(signal) {
        const url = `${this.buildDataUrl()}?t=${Date.now()}`;
        const response = await fetch(url, { signal });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    }

    async append(item, token) {
        if (!token) {
            throw new Error('缺少访问 Token');
        }

        const gist = await this.fetchGist(token);
        const rawContent = gist.files?.[this.filename]?.content ?? '[]';
        const list = this.parseContent(rawContent);
        list.push(item);
        await this.updateGist(list, token);
    }

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

class FavoritesView {
    constructor({ listEl, emptyEl }) {
        this.listEl = listEl;
        this.emptyEl = emptyEl;
    }

    showLoading(message = '正在从云端加载收藏夹...') {
        this.showMessage(message, '#666');
    }

    showError(message) {
        this.showMessage(message, '#e74c3c');
    }

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

    render(items) {
        this.listEl.innerHTML = '';

        if (!items || items.length === 0) {
            this.listEl.style.display = 'none';
            this.emptyEl.style.display = 'block';
            return;
        }

        this.listEl.style.display = 'grid';
        this.emptyEl.style.display = 'none';

        items.forEach((item) => {
            this.listEl.appendChild(this.buildCard(item));
        });
    }

    buildCard(item) {
        const card = document.createElement('a');
        card.className = 'favorite-card';
        card.href = item.url;
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

class SearchEngine {
    constructor(data = []) {
        this.data = data;
        this.fuse = null;
    }

    updateSource(data) {
        this.data = Array.isArray(data) ? data : [];
        this.fuse = null;
    }

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

class ModalController {
    constructor(elements) {
        this.modal = elements.modal;
        this.openBtn = elements.openBtn;
        this.closeBtn = elements.closeBtn;
        this.tokenSection = elements.tokenSection;
        this.tokenInput = elements.tokenInput;
        this.saveTokenBtn = elements.saveTokenBtn;
        this.clearTokenBtn = elements.clearTokenBtn;
        this.addForm = elements.addForm;
        this.statusMsg = elements.statusMsg;
        this.submitBtn = elements.submitBtn;
    }

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

    open() {
        this.modal.style.display = 'block';
        this.resetStatus();
    }

    close() {
        this.modal.style.display = 'none';
        this.resetStatus();
    }

    serializeForm() {
        return {
            name: this.addForm.querySelector('#siteName')?.value.trim() ?? '',
            url: this.addForm.querySelector('#siteUrl')?.value.trim() ?? '',
            description: this.addForm.querySelector('#siteDesc')?.value.trim() ?? ''
        };
    }

    resetForm() {
        this.addForm.reset();
    }

    syncTokenState(hasToken) {
        if (hasToken) {
            this.tokenSection.style.display = 'none';
            this.addForm.style.display = 'block';
        } else {
            this.tokenSection.style.display = 'block';
            this.addForm.style.display = 'none';
        }
    }

    setSavingState(isSaving) {
        this.submitBtn.disabled = isSaving;
        this.submitBtn.textContent = isSaving ? '正在保存...' : '保存到 Gist';
    }

    showStatus(message, type = 'info') {
        this.statusMsg.textContent = message;
        this.statusMsg.style.color = type === 'error' ? '#e74c3c' : '#666';
    }

    resetStatus() {
        this.showStatus('');
    }

    fillToken(token) {
        this.tokenInput.value = token ?? '';
    }
}

class FavoritesApp {
    constructor({ service, storage, view, searchInput, exactMatchCheckbox, modal }) {
        this.service = service;
        this.storage = storage;
        this.view = view;
        this.searchInput = searchInput;
        this.exactMatchCheckbox = exactMatchCheckbox;
        this.modal = modal;

        this.state = {
            favorites: [],
            token: storage.get()
        };

        this.searchEngine = new SearchEngine();
        this.abortController = null;
    }

    init() {
        this.view.showLoading();
        this.bindSearch();
        this.setupModal();
        this.loadFavorites();
    }

    bindSearch() {
        const triggerSearch = () => {
            this.applySearch();
        };

        this.searchInput.addEventListener('input', triggerSearch);
        this.exactMatchCheckbox.addEventListener('change', triggerSearch);
    }

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

    async loadFavorites() {
        // 防止重复请求堆叠，按需中断旧请求
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