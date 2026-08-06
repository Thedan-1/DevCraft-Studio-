import React, { useState } from 'react';
import { 
  Rocket, 
  FileCheck, 
  Shield, 
  Workflow, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download,
  FolderGit2
} from 'lucide-react';

const GITIGNORE_PRESETS: Record<string, string> = {
  'node-react': `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*

# Runtime data
pids
*.pid
*.seed

# Dependency directories
node_modules/
jspm_packages/

# Production builds
dist/
build/
.next/

# Environment files
.env
.env.local
.env.production
.DS_Store`,

  'python': `# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# Virtual environments
venv/
env/
ENV/
.venv/

# Distribution / packaging
build/
dist/
*.egg-info/`,

  'go': `# Binaries for programs and plugins
*.exe
*.exe;
*.dll
*.so
*.dylib

# Test binary
*.test

# Output of the go build command
bin/`
};

const LICENSE_PRESETS: Record<string, (year: string, name: string) => string> = {
  'MIT': (year, name) => `MIT License

Copyright (c) ${year} ${name}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction privileges, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,

  'Apache-2.0': (year, name) => `Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

Copyright ${year} ${name}

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0`
};

const GITHUB_ACTION_TEMPLATE = `name: Build & Lint CI

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run lint
    - run: npm run build`;

export const GitHubLaunchKit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gitignore' | 'license' | 'workflow' | 'checklist'>('gitignore');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Gitignore state
  const [gitignoreType, setGitignoreType] = useState('node-react');
  const [gitignoreContent, setGitignoreContent] = useState(GITIGNORE_PRESETS['node-react']);

  // License state
  const [licenseType, setLicenseType] = useState('MIT');
  const [authorName, setAuthorName] = useState('OpenSource Developer');
  const [licenseYear, setLicenseYear] = useState('2026');

  // Checklist state
  const [checklist, setChecklist] = useState([
    { id: 1, text: '选择合适的开源许可证 (如 MIT, Apache 2.0)', done: true },
    { id: 2, text: '撰写内容丰富、附带徽章的 README.md 文档', done: true },
    { id: 3, text: '配置 .gitignore 避免将 node_modules 与密钥上传', done: true },
    { id: 4, text: '设置 GitHub Actions CI 自动化构建与 Lint 校验', done: false },
    { id: 5, text: '编写 CONTRIBUTING.md 提供 Pull Request 贡献指南', done: false },
    { id: 6, text: '在 GitHub 项目主页配置分类标签 (Topics)', done: false },
  ]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const currentLicenseText = LICENSE_PRESETS[licenseType]
    ? LICENSE_PRESETS[licenseType](licenseYear, authorName)
    : LICENSE_PRESETS['MIT'](licenseYear, authorName);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Rocket className="w-5 h-5 text-indigo-400" />
            GitHub 开源发布包
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            快速生成标准的 .gitignore、开源许可证 LICENSE、GitHub Actions CI 及开源发布检查清单。
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
          {[
            { id: 'gitignore', label: '.gitignore 忽略配置', icon: <FolderGit2 className="w-3.5 h-3.5" /> },
            { id: 'license', label: 'LICENSE 许可证', icon: <Shield className="w-3.5 h-3.5" /> },
            { id: 'workflow', label: 'GitHub Actions 流水线', icon: <Workflow className="w-3.5 h-3.5" /> },
            { id: 'checklist', label: '开源准备清单', icon: <FileCheck className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. GITIGNORE GENERATOR */}
      {activeTab === 'gitignore' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 uppercase">Preset Template:</span>
              <select
                value={gitignoreType}
                onChange={(e) => {
                  setGitignoreType(e.target.value);
                  setGitignoreContent(GITIGNORE_PRESETS[e.target.value] || GITIGNORE_PRESETS['node-react']);
                }}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs text-white"
              >
                <option value="node-react">Node.js & React / Vite</option>
                <option value="python">Python & Django / FastAPI</option>
                <option value="go">Go (Golang)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(gitignoreContent, 'gitignore')}
                className="px-3 py-1.5 bg-slate-800 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1"
              >
                {copiedKey === 'gitignore' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
              <button
                onClick={() => handleDownload(gitignoreContent, '.gitignore')}
                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .gitignore</span>
              </button>
            </div>
          </div>

          <textarea
            rows={14}
            value={gitignoreContent}
            onChange={(e) => setGitignoreContent(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {/* 2. LICENSE GENERATOR */}
      {activeTab === 'license' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">License Type</label>
              <select
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="MIT">MIT License (Permissive)</option>
                <option value="Apache-2.0">Apache 2.0 (Patents Grant)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Copyright Holder Name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Year</label>
              <input
                type="text"
                value={licenseYear}
                onChange={(e) => setLicenseYear(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleCopy(currentLicenseText, 'license')}
              className="px-3 py-1.5 bg-slate-800 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1"
            >
              {copiedKey === 'license' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy LICENSE</span>
            </button>
            <button
              onClick={() => handleDownload(currentLicenseText, 'LICENSE')}
              className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download LICENSE</span>
            </button>
          </div>

          <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 h-64 overflow-y-auto whitespace-pre-wrap">
            {currentLicenseText}
          </pre>
        </div>
      )}

      {/* 3. GITHUB ACTIONS WORKFLOW */}
      {activeTab === 'workflow' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase">GitHub Actions CI Pipeline (.github/workflows/ci.yml)</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(GITHUB_ACTION_TEMPLATE, 'workflow')}
                className="px-3 py-1.5 bg-slate-800 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1"
              >
                {copiedKey === 'workflow' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy YAML</span>
              </button>
              <button
                onClick={() => handleDownload(GITHUB_ACTION_TEMPLATE, 'ci.yml')}
                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ci.yml</span>
              </button>
            </div>
          </div>

          <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 h-72 overflow-y-auto whitespace-pre-wrap">
            {GITHUB_ACTION_TEMPLATE}
          </pre>
        </div>
      )}

      {/* 4. LAUNCH CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Open Source Release Readiness Checklist
          </h3>

          <div className="space-y-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => setChecklist(checklist.map(c => c.id === item.id ? { ...c, done: !c.done } : c))}
                className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-all"
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => {}}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span className={`text-xs ${item.done ? 'text-slate-200 font-medium' : 'text-slate-400 line-through'}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
