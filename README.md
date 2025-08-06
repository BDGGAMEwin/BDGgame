# BDG GAME Official Website

## 项目概述

这是BDG GAME的官方网站项目，专门针对"BDG GAME"关键词进行SEO优化，面向印度和英语市场。

## 技术架构

- **前端**: 纯静态HTML/CSS/JS
- **部署**: Cloudflare Pages
- **自动化**: GitHub Actions
- **内容生成**: Gemini 2.0 Flash
- **CDN**: Cloudflare全球网络

## 项目结构

```
bdggame-official/
├── src/                    # 源代码目录
│   ├── index.html         # 首页
│   ├── download.html      # 下载页面
│   ├── about.html         # 关于页面
│   ├── contact.html       # 联系页面
│   ├── css/               # 样式文件
│   ├── js/                # JavaScript文件
│   └── images/            # 图片资源
├── content/               # 动态内容
│   ├── news/              # 新闻文章
│   ├── guides/            # 游戏攻略
│   └── blog/              # 博客文章
├── scripts/               # 构建脚本
│   ├── build.js           # 构建脚本
│   ├── generate-content.js # 内容生成
│   └── deploy.sh          # 部署脚本
├── .github/workflows/     # GitHub Actions
│   └── deploy.yml         # 自动部署
├── dist/                  # 构建输出
├── package.json           # 项目配置
└── README.md              # 项目说明
```

## 部署流程

1. **GitHub仓库设置**
   - 创建私有仓库
   - 配置Secrets
   - 设置分支保护

2. **Cloudflare Pages连接**
   - 连接GitHub仓库
   - 配置构建设置
   - 设置自定义域名

3. **自动化部署**
   - 代码推送触发构建
   - 定时生成新内容
   - 自动清除CDN缓存

## 环境变量

需要在GitHub Secrets中配置：

- `GEMINI_API_KEY`: Gemini API密钥
- `CLOUDFLARE_API_TOKEN`: Cloudflare API令牌
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare账户ID

## 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 本地开发服务器
npm run dev

# 构建项目
npm run build

# 生成内容
npm run generate
```

### 内容更新

- 手动更新：编辑`content/`目录下的文件
- 自动更新：每天凌晨2点自动生成新内容

## SEO优化

- 核心关键词："BDG GAME"
- 目标市场：印度、英语区域
- 页面加载速度：< 2.5秒
- 移动端优先设计

## 监控指标

- Google Search Console收录
- 关键词排名监控
- 页面性能指标
- 用户行为分析