# 我的网络收藏夹 (My Favorites)

> 一个纯静态、云同步的个人收藏夹。

## Table of Contents
- [我的网络收藏夹 (My Favorites)](#我的网络收藏夹-my-favorites)
  - [Table of Contents](#table-of-contents)
  - [Background](#background)
  - [Features](#features)
  - [Usage](#usage)
  - [Configuration](#configuration)
  - [Development](#development)
  - [Maintainers](#maintainers)
  - [Contributing](#contributing)
  - [License](#license)

## Background
以最小化的前端堆栈构建个人收藏夹，使用 GitHub Pages 部署静态页面，并借助 GitHub Gist 充当远程 JSON 数据源，实现多端同步且无需独立后端。

## Features
- 卡片式信息层级与响应式布局
- 即时搜索：支持子序列匹配与 Fuse.js 模糊容错
- Gist 驱动的数据存储，兼顾稳定性与易用性
- 通过模态框直接追加收藏并写回云端数据

## Usage
1. 打开线上页面或本地预览。
2. 在顶部搜索框输入网站名称、URL 或描述片段。
3. 结果区会根据搜索模式即时过滤，点击任意卡片将在新标签页打开对应站点。

## Configuration
- **数据源**：收藏数据托管于 GitHub Gist（JSON 数组）。
- **鉴权**：首次添加收藏需在模态框配置 GitHub Personal Access Token，并授予 Gist 权限。
- **字段规范**：每个收藏对象包含 `name`、`url`、可选的 `description`，所有值需满足有效的 JSON 格式。

## Development
1. 克隆仓库并进入项目目录。
2. 使用浏览器直接打开 [index.html](index.html) 即可预览。
3. 静态资源位于 [style.css](style.css) 与 [script.js](script.js)。

## Maintainers
- Calvin Xia (@Calvin-Xia)

## Contributing
欢迎提交 Issue 与 Pull Request。贡献前请在本地验证搜索与收藏新增流程，以确保数据同步逻辑正常。

## License
本项目尚未指定开源许可证，保留所有权利。
