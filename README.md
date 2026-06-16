# xfjm136 GitHub Pages Homepage

这是为 `xfjm136` 准备的个人主页静态站，适合直接部署到 GitHub Pages。

## 文件结构

```text
.
├── index.html
├── styles.css
├── script.js
├── .nojekyll
└── README.md
```

## 本地预览

直接用浏览器打开 `index.html` 即可。页面是纯静态文件，不依赖构建步骤。

如果想通过本地服务预览：

```powershell
python -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 部署到 GitHub Pages

推荐创建仓库：

```text
xfjm136.github.io
```

然后把本目录所有文件提交到该仓库的 `main` 分支根目录。GitHub Pages 会自动发布到：

```text
https://xfjm136.github.io
```

也可以在任意仓库中启用 Pages，路径选择 `main` 分支 `/root`。

## 数据来源

页面内置了一份项目介绍内容，并在浏览器端尝试从 GitHub API 刷新公开统计数据和仓库更新时间。GitHub API 不可用时，页面仍会正常展示。
