// 配置常量
const GIST_ID = '9c84112f9a5affcc63d4693a6282f74f';
const GIST_FILENAME = 'data.json';
const DATA_URL = `https://gist.githubusercontent.com/Calvin-Xia/${GIST_ID}/raw/${GIST_FILENAME}`;

// 全局变量
let favoritesData = [];
let githubToken = localStorage.getItem('github_token');

// DOM 元素
const searchInput = document.getElementById('searchInput');
const favoritesList = document.getElementById('favoritesList');
const noResults = document.getElementById('noResults');

// Modal 元素
const modal = document.getElementById('modal');
const addBtn = document.getElementById('addBtn');
const closeBtn = document.querySelector('.close-btn');
const tokenSection = document.getElementById('tokenSection');
const addForm = document.getElementById('addForm');
const tokenInput = document.getElementById('tokenInput');
const saveTokenBtn = document.getElementById('saveTokenBtn');
const clearTokenBtn = document.getElementById('clearTokenBtn');
const statusMsg = document.getElementById('statusMsg');

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupModal();
});

// 监听搜索输入
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    filterFavorites(searchTerm);
});

// 从 Gist 加载数据
async function loadData() {
    try {
        favoritesList.innerHTML = '<div style="text-align:center; grid-column: 1/-1; color: #666;">正在从云端加载收藏夹...</div>';
        favoritesList.style.display = 'grid';

        // 添加时间戳防止缓存
        const response = await fetch(`${DATA_URL}?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        favoritesData = await response.json();
        renderFavorites(favoritesData);
    } catch (error) {
        console.error('加载数据失败:', error);
        favoritesList.innerHTML = `
            <div style="text-align:center; grid-column: 1/-1; color: #e74c3c;">
                <p>加载数据失败</p>
                <p style="font-size: 0.8em; margin-top: 5px;">${error.message}</p>
            </div>
        `;
    }
}

// 渲染收藏列表
function renderFavorites(items) {
    favoritesList.innerHTML = '';
    
    if (!items || items.length === 0) {
        favoritesList.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    favoritesList.style.display = 'grid';
    noResults.style.display = 'none';

    items.forEach(item => {
        const card = document.createElement('a');
        card.href = item.url;
        card.className = 'favorite-card';
        card.target = '_blank';
        card.rel = 'noopener noreferrer';

        card.innerHTML = `
            <div class="card-title">${escapeHtml(item.name)}</div>
            <div class="card-url">${escapeHtml(item.url)}</div>
            ${item.description ? `<div class="card-desc">${escapeHtml(item.description)}</div>` : ''}
        `;

        favoritesList.appendChild(card);
    });
}

// 搜索过滤功能
function filterFavorites(searchTerm) {
    if (!searchTerm) {
        renderFavorites(favoritesData);
        return;
    }

    const filteredItems = favoritesData.filter(item => {
        return (
            item.name.toLowerCase().includes(searchTerm) ||
            item.url.toLowerCase().includes(searchTerm) ||
            (item.description && item.description.toLowerCase().includes(searchTerm))
        );
    });

    renderFavorites(filteredItems);
}

// --- Modal & Token Logic ---

function setupModal() {
    // 打开模态框
    addBtn.onclick = () => {
        modal.style.display = "block";
        checkTokenState();
    }

    // 关闭模态框
    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    }

    // 保存 Token
    saveTokenBtn.onclick = () => {
        const token = tokenInput.value.trim();
        if (token) {
            localStorage.setItem('github_token', token);
            githubToken = token;
            checkTokenState();
        }
    }

    // 清除 Token
    clearTokenBtn.onclick = () => {
        if(confirm('确定要清除本地保存的 Token 吗？')) {
            localStorage.removeItem('github_token');
            githubToken = null;
            checkTokenState();
        }
    }

    // 提交新网站
    addForm.onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn');
        
        const newSite = {
            name: document.getElementById('siteName').value.trim(),
            url: document.getElementById('siteUrl').value.trim(),
            description: document.getElementById('siteDesc').value.trim()
        };

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = '正在保存...';
            statusMsg.textContent = '';

            await saveToGist(newSite);

            // 成功后重置表单并关闭
            addForm.reset();
            modal.style.display = "none";
            alert('保存成功！页面即将刷新。');
            loadData(); // 重新加载数据

        } catch (error) {
            console.error(error);
            statusMsg.textContent = '保存失败: ' + error.message;
            statusMsg.style.color = 'red';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '保存到 Gist';
        }
    }
}

function checkTokenState() {
    if (githubToken) {
        tokenSection.style.display = 'none';
        addForm.style.display = 'block';
    } else {
        tokenSection.style.display = 'block';
        addForm.style.display = 'none';
    }
}

// 核心：保存到 Gist
async function saveToGist(newItem) {
    if (!githubToken) throw new Error('未找到 Token');

    // 1. 获取当前 Gist 内容 (确保是基于最新版本修改)
    const getRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        headers: {
            'Authorization': `token ${githubToken}`
        }
    });

    if (!getRes.ok) throw new Error('无法获取 Gist 信息，请检查 Token 权限');
    
    const gistData = await getRes.json();
    const currentContent = gistData.files[GIST_FILENAME].content;
    
    let currentList = [];
    try {
        currentList = JSON.parse(currentContent);
    } catch (e) {
        throw new Error('Gist 内容不是有效的 JSON');
    }

    // 2. 添加新项
    currentList.push(newItem);

    // 3. 更新 Gist
    const updateRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            files: {
                [GIST_FILENAME]: {
                    content: JSON.stringify(currentList, null, 4) // 格式化 JSON
                }
            }
        })
    });

    if (!updateRes.ok) throw new Error('更新 Gist 失败');
}

// 工具函数
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}