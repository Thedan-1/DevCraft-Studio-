import React from 'react';
import { ActiveTab } from '../types';
import { 
  FileCode2, 
  Camera, 
  Palette, 
  Wrench, 
  Sparkles, 
  Rocket, 
  Github, 
  Share2,
  Terminal,
  Check
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [copied, setCopied] = React.useState(false);

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'readme', label: 'README 架构师', icon: <FileCode2 className="w-4 h-4" /> },
    { id: 'snapshot', label: '代码生成器', icon: <Camera className="w-4 h-4" /> },
    { id: 'palette', label: '调色与玻璃拟态', icon: <Palette className="w-4 h-4" /> },
    { id: 'workbench', label: '数据与正则工作台', icon: <Wrench className="w-4 h-4" /> },
    { id: 'ai-assistant', label: 'AI 代码助手', icon: <Sparkles className="w-4 h-4" />, badge: 'Gemini' },
    { id: 'launch-kit', label: 'GitHub 开源发布包', icon: <Rocket className="w-4 h-4" /> },
  ];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">
                  DevCraft <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Studio</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-medium tracking-wide bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                  v1.0 • GitHub Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                开源开发者 & 创作者工具箱
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700/60 rounded-lg transition-all"
              title="复制分享链接"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">已复制!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>分享应用</span>
                </>
              )}
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg shadow-sm transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub 仓库</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/60">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
