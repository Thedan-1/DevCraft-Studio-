import React, { useState } from 'react';
import { ActiveTab } from './types';
import { Header } from './components/Header';
import { ReadmeArchitect } from './components/ReadmeArchitect';
import { CodeSnapshotStudio } from './components/CodeSnapshotStudio';
import { CssPaletteLab } from './components/CssPaletteLab';
import { DataWorkbench } from './components/DataWorkbench';
import { AiCodingCompanion } from './components/AiCodingCompanion';
import { GitHubLaunchKit } from './components/GitHubLaunchKit';
import { Sparkles, Terminal, Github, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('readme');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Sticky Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        {activeTab === 'readme' && <ReadmeArchitect />}
        {activeTab === 'snapshot' && <CodeSnapshotStudio />}
        {activeTab === 'palette' && <CssPaletteLab />}
        {activeTab === 'workbench' && <DataWorkbench />}
        {activeTab === 'ai-assistant' && <AiCodingCompanion />}
        {activeTab === 'launch-kit' && <GitHubLaunchKit />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">DevCraft Studio</span>
            <span>— Open-Source GitHub Developer Suite</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for GitHub Creators
            </span>
            <span>•</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repo</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
