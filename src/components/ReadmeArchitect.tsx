import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { 
  Copy, 
  Download, 
  Sparkles, 
  FileText, 
  Plus, 
  Trash2, 
  Check, 
  Eye, 
  Edit3, 
  Layers,
  Code2,
  RefreshCw,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ReadmeConfig, ReadmeSection } from '../types';

const INITIAL_README: ReadmeConfig = {
  projectTitle: "DevCraft Studio",
  tagline: "全栈开源开发者与创作者工具箱：内置 GitHub README 架构师、代码截图生成器及 AI 代码助手。",
  description: "DevCraft Studio 是一套旨在加速开源项目开发流程的开箱即用工具，支持一键生成精致文档、打造社交媒体分享图片、格式化复杂数据，并集成 Gemini AI 辅助代码分析。",
  author: "Developer",
  githubUsername: "octocat",
  repoName: "devcraft-studio",
  license: "MIT",
  demoUrl: "https://github.com",
  badges: [
    "https://img.shields.io/github/license/octocat/devcraft-studio?style=flat-square&color=indigo",
    "https://img.shields.io/github/stars/octocat/devcraft-studio?style=flat-square&color=gold",
    "https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react",
    "https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript",
    "https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss",
    "https://img.shields.io/badge/Gemini_AI-Powered-8E44AD?style=flat-square&logo=google"
  ],
  techStack: ["React 19", "TypeScript", "Vite", "Tailwind CSS v4", "Express", "Gemini 2.5 Flash", "Lucide Icons"],
  sections: [
    {
      id: "features",
      title: "✨ 核心功能 (Features)",
      enabled: true,
      content: `- **📝 GitHub README 架构师**: 交互式 Markdown 编辑器，支持 Shields.io 徽章库与实时渲染。
- **📸 代码卡片生成器**: 将代码片段一键转化为高清晰度社交分享图片与 macOS 视窗展示图。
- **🎨 调色与玻璃拟态实验室**: 自动计算 Tailwind CSS 11 阶阶梯色阶、WCAG 无障碍对比度测试及 Glassmorphism CSS 生成。
- **🛠️ 数据与正则工作台**: 快速格式化 JSON、生成 TypeScript Interface、解码 JWT Token 及正则表达式在线测试。
- **🤖 Gemini AI 代码助手**: 智能解释代码逻辑、重构优化与一键生成 Conventional Commit 提交规范。
- **📦 开源发布包**: 快速生成标准的 \`.gitignore\`、开源许可证 \`LICENSE\` 与 GitHub Actions CI 配置文件。`
    },
    {
      id: "installation",
      title: "⚡ 快速开始 (Quick Start)",
      enabled: true,
      content: `### 前置条件
- Node.js \`>= 18.0.0\`
- npm 或 pnpm

\`\`\`bash
# 1. 克隆仓库
git clone https://github.com/octocat/devcraft-studio.git

# 2. 进入项目目录
cd devcraft-studio

# 3. 安装依赖
npm install

# 4. 配置环境变量
cp .env.example .env

# 5. 启动本地开发服务
npm run dev
\`\`\`

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 即可使用。`
    },
    {
      id: "architecture",
      title: "🏗️ 项目架构 (Architecture)",
      enabled: true,
      content: `\`\`\`text
devcraft-studio/
├── server.ts                 # Express + Vite 全栈服务器及 AI 代理 API
├── src/
│   ├── App.tsx               # 应用根组件与选项卡路由
│   ├── components/
│   │   ├── Header.tsx        # 顶部导航栏
│   │   ├── ReadmeArchitect.tsx # README 交互构建器
│   │   ├── CodeSnapshotStudio.tsx # 代码高亮截图生成器
│   │   ├── CssPaletteLab.tsx # Tailwind 调色与 WCAG 分析
│   │   ├── DataWorkbench.tsx # JSON/JWT/正则/文本转换工作台
│   │   ├── AiCodingCompanion.tsx # Gemini AI 代码助手
│   │   └── GitHubLaunchKit.tsx # .gitignore / LICENSE / GitHub Actions 生成器
│   ├── types.ts              # TypeScript 全局接口定义
│   └── index.css             # Tailwind v4 全局样式
└── package.json
\`\`\``
    },
    {
      id: "contributing",
      title: "🤝 贡献指南 (Contributing)",
      enabled: true,
      content: `非常欢迎提交 Issue 或 Pull Request 来改进本项目！

1. Fork 本仓库
2. 创建特性分支 (\`git checkout -b feature/AmazingFeature\`)
3. 提交修改 (\`git commit -m 'feat: add AmazingFeature'\`)
4. 推送到分支 (\`git push origin feature/AmazingFeature\`)
5. 发起 Pull Request`
    },
    {
      id: "license",
      title: "📄 开源许可证 (License)",
      enabled: true,
      content: `本项目采用 **MIT License** 开源协议。详情参见 \`LICENSE\` 文件。`
    }
  ]
};

const BADGE_PRESETS = [
  { name: "MIT License", url: "https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" },
  { name: "Build Passing", url: "https://img.shields.io/badge/build-passing-brightgreen?style=flat-square" },
  { name: "PRs Welcome", url: "https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" },
  { name: "React 19", url: "https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black" },
  { name: "TypeScript", url: "https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" },
  { name: "Tailwind CSS", url: "https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" },
  { name: "Node.js", url: "https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white" },
  { name: "Gemini AI", url: "https://img.shields.io/badge/Gemini_AI-Powered-8E44AD?style=flat-square&logo=google" },
  { name: "Vite", url: "https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite&logoColor=white" },
];

export const ReadmeArchitect: React.FC = () => {
  const [config, setConfig] = useState<ReadmeConfig>(INITIAL_README);
  const [activeView, setActiveView] = useState<'split' | 'edit' | 'preview'>('split');
  const [copied, setCopied] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [newBadgeUrl, setNewBadgeUrl] = useState('');

  // Generate full markdown string
  const generateMarkdown = (): string => {
    let md = `# ${config.projectTitle}\n\n`;
    
    if (config.tagline) {
      md += `> **${config.tagline}**\n\n`;
    }

    if (config.badges.length > 0) {
      md += `${config.badges.map(b => `![Badge](${b})`).join(' ')}\n\n`;
    }

    if (config.description) {
      md += `${config.description}\n\n`;
    }

    if (config.demoUrl) {
      md += `🔗 **Live Demo**: [${config.demoUrl}](${config.demoUrl})\n\n`;
    }

    if (config.techStack.length > 0) {
      md += `### 🛠️ Tech Stack\n\n`;
      md += `${config.techStack.map(tech => `\`${tech}\``).join(' • ')}\n\n`;
    }

    md += `---\n\n`;

    config.sections.forEach(sec => {
      if (sec.enabled && sec.content.trim()) {
        md += `## ${sec.title}\n\n${sec.content}\n\n`;
      }
    });

    md += `---\n\n*Crafted with ❤️ by [${config.author}](https://github.com/${config.githubUsername}) using DevCraft Studio.*\n`;

    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generateMarkdown()], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'readme',
          input: `Project Name: ${config.projectTitle}\nTagline: ${config.tagline}\nUser Summary: ${aiPrompt}`
        })
      });
      const data = await res.json();
      if (data.result) {
        // Add AI generated section or update description
        const newSection: ReadmeSection = {
          id: `ai-gen-${Date.now()}`,
          title: "🤖 AI Generated Overview & Features",
          enabled: true,
          content: data.result
        };
        setConfig(prev => ({
          ...prev,
          sections: [newSection, ...prev.sections]
        }));
        setAiPrompt('');
      } else if (data.error) {
        alert(`AI Generation Note: ${data.error}`);
      }
    } catch (err: any) {
      console.error(err);
      alert('Failed to contact AI service.');
    } finally {
      setAiLoading(false);
    }
  };

  const addBadge = (url: string) => {
    if (!url || config.badges.includes(url)) return;
    setConfig(prev => ({ ...prev, badges: [...prev.badges, url] }));
  };

  const removeBadge = (index: number) => {
    setConfig(prev => ({
      ...prev,
      badges: prev.badges.filter((_, i) => i !== index)
    }));
  };

  const addSection = () => {
    const newSec: ReadmeSection = {
      id: `sec-${Date.now()}`,
      title: "📌 Custom Section",
      enabled: true,
      content: "Add your markdown content here..."
    };
    setConfig(prev => ({ ...prev, sections: [...prev.sections, newSec] }));
  };

  const updateSection = (index: number, key: keyof ReadmeSection, val: any) => {
    const updated = [...config.sections];
    updated[index] = { ...updated[index], [key]: val };
    setConfig(prev => ({ ...prev, sections: updated }));
  };

  const deleteSection = (index: number) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            GitHub README 架构师
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            通过实时 Markdown 预览、徽章工具库和 Gemini AI 草稿生成高质量的开源项目文档。
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* View Toggles */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
            <button
              onClick={() => setActiveView('split')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeView === 'split' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>双栏</span>
            </button>
            <button
              onClick={() => setActiveView('edit')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeView === 'edit' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>编辑</span>
            </button>
            <button
              onClick={() => setActiveView('preview')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeView === 'preview' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>预览</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '已复制' : '复制 Markdown'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-2 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl flex items-center gap-1.5 shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            <span>导出 README.md</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className={`grid gap-6 ${activeView === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* LEFT / EDITOR PANEL */}
        {(activeView === 'split' || activeView === 'edit') && (
          <div className="space-y-6">
            
            {/* AI Prompt Box */}
            <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Gemini AI README 撰写助手
                </span>
                <span className="text-[10px] text-purple-400/80 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  自动草稿
                </span>
              </div>
              <p className="text-xs text-slate-300">
                描述你的项目功能、技术架构或核心思路，AI 将一键生成专业的文档草稿。
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="例如: 一个基于 React + TypeScript 的高性能画板应用，支持实时房间同步与 Webhooks..."
                  className="flex-1 bg-slate-950 border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={handleAiGenerate}
                  disabled={aiLoading || !aiPrompt.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all"
                >
                  {aiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>{aiLoading ? '生成中...' : '生成 AI 章节'}</span>
                </button>
              </div>
            </div>

            {/* Basic Project Info Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Code2 className="w-4 h-4" />
                项目基本信息 (Project Identity)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">项目名称 (Project Name)</label>
                  <input
                    type="text"
                    value={config.projectTitle}
                    onChange={(e) => setConfig({ ...config, projectTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">作者 / 组织 (Author/Org)</label>
                  <input
                    type="text"
                    value={config.author}
                    onChange={(e) => setConfig({ ...config, author: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">项目标语 (Tagline)</label>
                <input
                  type="text"
                  value={config.tagline}
                  onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">详细介绍 (Description)</label>
                <textarea
                  rows={3}
                  value={config.description}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">GitHub 用户名 (Username)</label>
                  <input
                    type="text"
                    value={config.githubUsername}
                    onChange={(e) => setConfig({ ...config, githubUsername: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">仓库名称 (Repo Name)</label>
                  <input
                    type="text"
                    value={config.repoName}
                    onChange={(e) => setConfig({ ...config, repoName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Badges Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Shields.io Badges Library
              </h3>

              {/* Preset Buttons */}
              <div className="flex flex-wrap gap-2">
                {BADGE_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => addBadge(preset.url)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3 h-3 text-indigo-400" />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>

              {/* Custom Badge Add */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBadgeUrl}
                  onChange={(e) => setNewBadgeUrl(e.target.value)}
                  placeholder="Custom badge image URL (e.g. https://img.shields.io/badge/...)"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => {
                    addBadge(newBadgeUrl);
                    setNewBadgeUrl('');
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Badge</span>
                </button>
              </div>

              {/* Active Badges List */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">Active Badges ({config.badges.length}):</span>
                <div className="flex flex-wrap gap-2">
                  {config.badges.map((badgeUrl, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
                      <img src={badgeUrl} alt="badge" className="h-5" />
                      <button
                        onClick={() => removeBadge(idx)}
                        className="text-slate-500 hover:text-rose-400 ml-1 p-0.5 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic Content Sections */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  README Sections
                </h3>
                <button
                  onClick={addSection}
                  className="px-2.5 py-1 text-xs font-medium bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>
              </div>

              <div className="space-y-4">
                {config.sections.map((sec, index) => (
                  <div key={sec.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={sec.enabled}
                          onChange={(e) => updateSection(index, 'enabled', e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => updateSection(index, 'title', e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 flex-1"
                        />
                      </div>
                      <button
                        onClick={() => deleteSection(index)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-900 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {sec.enabled && (
                      <textarea
                        rows={4}
                        value={sec.content}
                        onChange={(e) => updateSection(index, 'content', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* RIGHT / PREVIEW PANEL */}
        {(activeView === 'split' || activeView === 'preview') && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                Live GitHub README Preview
              </span>
              <span className="text-[11px] text-slate-500">
                GitHub Markdown Style
              </span>
            </div>

            {/* Markdown Body */}
            <div className="markdown-body text-slate-200 text-sm leading-relaxed space-y-4">
              <Markdown>{generateMarkdown()}</Markdown>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
