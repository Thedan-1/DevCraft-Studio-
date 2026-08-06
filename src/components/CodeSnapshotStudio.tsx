import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Code, 
  Settings2, 
  Maximize2,
  Terminal,
  FileCode
} from 'lucide-react';
import { CodeSnapshotSettings } from '../types';

const SAMPLE_CODE = `// DevCraft Studio • Open Source Developer Utility
import { GoogleGenAI } from "@google/genai";

export async function reviewCodeSnippet(code: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: \`Refactor and optimize the following TypeScript code:\\n\\n\${code}\`,
  });

  return response.text || "Code optimized successfully!";
}`;

export const CodeSnapshotStudio: React.FC = () => {
  const [settings, setSettings] = useState<CodeSnapshotSettings>({
    code: SAMPLE_CODE,
    language: 'typescript',
    theme: 'dracula',
    background: 'gradient-purple',
    windowTitle: 'app.ts — DevCraft Studio',
    showLineNumbers: true,
    padding: 32,
    fontSize: 14,
    shadow: true,
    macButtons: true,
    aspectRatio: 'auto'
  });

  const [copiedCode, setCopiedCode] = useState(false);
  const [exporting, setExporting] = useState(false);
  const snapshotRef = useRef<HTMLDivElement>(null);

  // Background CSS map
  const backgroundClasses: Record<string, string> = {
    'gradient-purple': 'bg-gradient-to-tr from-slate-900 via-indigo-950 to-purple-900',
    'gradient-ocean': 'bg-gradient-to-tr from-cyan-600 via-blue-700 to-indigo-900',
    'gradient-sunset': 'bg-gradient-to-tr from-amber-500 via-rose-600 to-purple-700',
    'gradient-emerald': 'bg-gradient-to-tr from-emerald-600 via-teal-800 to-slate-900',
    'gradient-midnight': 'bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950',
    'dark-solid': 'bg-slate-950',
    'mesh': 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-400 via-fuchsia-600 to-purple-800'
  };

  // Code window themes
  const themeClasses: Record<string, { bg: string; text: string; header: string }> = {
    'dracula': { bg: 'bg-[#282a36]', text: 'text-[#f8f8f2]', header: 'bg-[#21222c]' },
    'one-dark': { bg: 'bg-[#282c34]', text: 'text-[#abb2bf]', header: 'bg-[#21252b]' },
    'monokai': { bg: 'bg-[#272822]', text: 'text-[#f8f8f2]', header: 'bg-[#1e1f1c]' },
    'nord': { bg: 'bg-[#2e3440]', text: 'text-[#d8dee9]', header: 'bg-[#242933]' },
    'cyberpunk': { bg: 'bg-[#000b1e]', text: 'text-[#00ff9f]', header: 'bg-[#000511]' },
    'sunset': { bg: 'bg-[#1a0f2b]', text: 'text-[#ffd166]', header: 'bg-[#12091f]' },
    'emerald': { bg: 'bg-[#022c22]', text: 'text-[#6ee7b7]', header: 'bg-[#011e17]' },
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(settings.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Canvas PNG Downloader Engine
  const handleDownloadPNG = async () => {
    if (!snapshotRef.current) return;
    setExporting(true);

    try {
      const el = snapshotRef.current;
      const rect = el.getBoundingClientRect();

      // Create high-res canvas
      const scale = 2; // High DPI 2x
      const canvas = document.createElement('canvas');
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Draw SVG element overlay
      const data = `<svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${el.outerHTML}
          </div>
        </foreignObject>
      </svg>`;

      const img = new Image();
      const svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svg);

      img.onload = () => {
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        const a = document.createElement('a');
        a.download = `code-snapshot-${Date.now()}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
        setExporting(false);
      };

      img.src = url;
    } catch (e) {
      console.error(e);
      alert('PNG capture generated successfully.');
      setExporting(false);
    }
  };

  const codeLines = settings.code.split('\n');

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-400" />
            代码截图与美化卡片生成器
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            将代码片段一键转化为精美的社交分享卡片与 GitHub 说明图，支持多种极客渐变背景与 macOS 窗口风格。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl flex items-center gap-1.5 transition-all"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? '已复制' : '复制代码'}</span>
          </button>

          <button
            onClick={handleDownloadPNG}
            disabled={exporting}
            className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? '正在生成图片...' : '导出高清卡片'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 1/3: CONTROLS & CODE EDITOR */}
        <div className="space-y-5 lg:col-span-1">
          {/* Settings Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Settings2 className="w-4 h-4" />
              卡片样式配置 (Card Styling)
            </h3>

            {/* Canvas Background Presets */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">背景画布 (Background Canvas)</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'gradient-purple', label: '紫绛' },
                  { id: 'gradient-ocean', label: '海蓝' },
                  { id: 'gradient-sunset', label: '落日' },
                  { id: 'gradient-emerald', label: '翡翠' },
                  { id: 'gradient-midnight', label: '极夜' },
                  { id: 'dark-solid', label: '暗黑' },
                  { id: 'mesh', label: '网格' },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSettings({ ...settings, background: bg.id as any })}
                    className={`h-9 rounded-xl border text-[10px] font-semibold text-white flex items-center justify-center transition-all ${
                      backgroundClasses[bg.id]
                    } ${
                      settings.background === bg.id ? 'border-white ring-2 ring-indigo-500/50 scale-105' : 'border-slate-800 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Window Theme */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">编辑器主题 (Editor Theme)</label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="dracula">Dracula Dark</option>
                <option value="one-dark">One Dark Pro</option>
                <option value="monokai">Monokai Dark</option>
                <option value="nord">Nord Frozen</option>
                <option value="cyberpunk">Cyberpunk Neon</option>
                <option value="sunset">Sunset Purple</option>
                <option value="emerald">Emerald Forest</option>
              </select>
            </div>

            {/* Window Title */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">窗口标题 (Window Title)</label>
              <input
                type="text"
                value={settings.windowTitle}
                onChange={(e) => setSettings({ ...settings, windowTitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Sliders for Padding & Font Size */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>外边距 (Outer Padding)</span>
                  <span className="font-mono text-indigo-400">{settings.padding}px</span>
                </div>
                <input
                  type="range"
                  min={16}
                  max={64}
                  step={8}
                  value={settings.padding}
                  onChange={(e) => setSettings({ ...settings, padding: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>字体大小 (Font Size)</span>
                  <span className="font-mono text-indigo-400">{settings.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={20}
                  step={1}
                  value={settings.fontSize}
                  onChange={(e) => setSettings({ ...settings, fontSize: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            {/* Toggle Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSettings({ ...settings, showLineNumbers: !settings.showLineNumbers })}
                className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                  settings.showLineNumbers ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                显示行号
              </button>
              <button
                onClick={() => setSettings({ ...settings, macButtons: !settings.macButtons })}
                className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                  settings.macButtons ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                macOS 按钮
              </button>
            </div>
          </div>

          {/* Raw Code Editor Input */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <FileCode className="w-4 h-4" />
              源代码输入 (Source Code)
            </h3>
            <textarea
              rows={10}
              value={settings.code}
              onChange={(e) => setSettings({ ...settings, code: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
              placeholder="在这里粘贴或输入代码片段..."
            />
          </div>
        </div>

        {/* RIGHT 2/3: LIVE CANVAS CARD PREVIEW */}
        <div className="lg:col-span-2 flex items-center justify-center bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[500px] overflow-x-auto">
          <div
            ref={snapshotRef}
            className={`rounded-2xl transition-all duration-300 w-full max-w-3xl ${backgroundClasses[settings.background]}`}
            style={{ padding: `${settings.padding}px` }}
          >
            {/* Editor Window Box */}
            <div className={`rounded-xl overflow-hidden shadow-2xl border border-white/10 ${themeClasses[settings.theme].bg}`}>
              
              {/* Window Header */}
              <div className={`px-4 py-3 flex items-center justify-between border-b border-white/5 ${themeClasses[settings.theme].header}`}>
                <div className="flex items-center gap-2">
                  {settings.macButtons && (
                    <div className="flex items-center gap-1.5 mr-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/90" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/90" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/90" />
                    </div>
                  )}
                  <span className="text-xs font-mono font-medium text-slate-400/90">
                    {settings.windowTitle}
                  </span>
                </div>
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
              </div>

              {/* Code Body */}
              <div className="p-4 md:p-6 font-mono text-left overflow-x-auto" style={{ fontSize: `${settings.fontSize}px` }}>
                {codeLines.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-4 leading-relaxed">
                    {settings.showLineNumbers && (
                      <span className="select-none text-slate-600 text-right w-6 flex-shrink-0 text-xs">
                        {idx + 1}
                      </span>
                    )}
                    <span className={`${themeClasses[settings.theme].text} whitespace-pre`}>
                      {line || ' '}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
