# DevCraft Studio 🚀

> **DevCraft Studio** 是一套专为开发者和开源贡献者打造的开箱即用全栈工具箱（Developer & Creator All-in-One Toolbox）。包含 GitHub README 架构师、代码高亮美化卡片生成器、Tailwind CSS 色彩与玻璃拟态实验室、数据格式化工作台以及 Gemini AI 代码助手。

---

## 🌟 核心功能亮点 (Key Features)

- **📝 README Architect (GitHub 文档架构师)**：交互式 Markdown 编辑器，内置 Shields.io 徽章库、实时渲染与一键导出。
- **📸 Code Snapshot Studio (代码卡片生成器)**：将代码片段一键转化为高清社交媒体分享图与 GitHub 展示图，支持多种极客主题与 macOS 视窗风格。
- **🎨 Color & Glass Lab (色彩与玻璃拟态实验室)**：自动计算 Tailwind CSS 11-Step 阶梯色阶、WCAG 无障碍对比度测试，以及 Glassmorphism 样式生成。
- **🛠️ Data & Regex Workbench (数据与正则工作台)**：JSON 格式化与 TypeScript Interface 自动生成、JWT Token 解码、正则表达式实时匹配与文本大小写转换。
- **🤖 AI Code Companion (Gemini AI 代码助手)**：基于 Google Gemini 2.5 Flash 模型，提供代码逻辑解析、重构优化与 Conventional Commit 规范提交信息生成。
- **📦 GitHub Launch Kit (开源发布包)**：一键生成标准 `.gitignore`、开源许可证 `LICENSE` 与 GitHub Actions CI 自动化流水线配置。

---

## 🛠️ 技术栈 (Tech Stack)

- **前端 Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4, Lucide React, React Markdown
- **后端 Backend**: Node.js, Express 4, esbuild, Google Gen AI SDK (@google/genai)
- **AI 引擎**: Google Gemini 2.5 Flash API

---

## ⚡ 快速开始 (Quick Start)

### 1. 克隆项目 & 安装依赖

```bash
# 克隆仓库
git clone https://github.com/Thedan-1/DevCraft-Studio-.git

# 进入目录
cd DevCraft-Studio-

# 安装项目依赖
npm install
```

### 2. 配置环境变量

复制 `.env.example` 并重命名为 `.env`：

```bash
cp .env.example .env
```

在 `.env` 中配置你的 Gemini API Key（可选，用于 AI 增强功能）：
```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 3. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 `http://localhost:3000` 即可启动 DevCraft Studio。

---

## 📦 项目构建与部署 (Build & Deployment)

```bash
# 生产环境编译 (编译 Vite 静态资源 + esbuild 打包后端)
npm run build

# 启动生产服务
npm run start
```

---

## 📄 开源许可证 (License)

本项目基于 **MIT License** 开源。详情参见 [LICENSE](./LICENSE) 文件。
