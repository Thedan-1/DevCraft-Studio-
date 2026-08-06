import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { 
  Sparkles, 
  Code2, 
  Zap, 
  GitCommit, 
  HelpCircle, 
  Copy, 
  Check, 
  RefreshCw,
  Terminal,
  Send
} from 'lucide-react';

export const AiCodingCompanion: React.FC = () => {
  const [task, setTask] = useState<'explain' | 'refactor' | 'commit'>('explain');
  const [language, setLanguage] = useState('typescript');
  const [inputCode, setInputCode] = useState(`// Paste code or git diff here
function calculateDiscount(user: { isPro: boolean; points: number }, price: number) {
  let discount = 0;
  if (user.isPro) {
    discount += price * 0.2;
  }
  if (user.points > 100) {
    discount += price * 0.1;
  }
  return price - discount;
}`);

  const [responseResult, setResponseResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!inputCode.trim()) return;
    setLoading(true);
    setResponseResult('');

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task,
          input: inputCode,
          language
        })
      });

      const data = await res.json();
      if (data.result) {
        setResponseResult(data.result);
      } else if (data.error) {
        setResponseResult(`⚠️ Error: ${data.error}`);
      }
    } catch (e: any) {
      setResponseResult(`⚠️ Failed to connect to AI server endpoint: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(responseResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Gemini AI 代码助手
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            基于 Google Gemini 2.5 Flash 模型，提供代码逻辑解析、重构优化与 Conventional Commit 提交生成。
          </p>
        </div>

        {/* Task Selector */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
          {[
            { id: 'explain', label: '代码解释', icon: <HelpCircle className="w-3.5 h-3.5 text-indigo-400" /> },
            { id: 'refactor', label: '重构优化', icon: <Zap className="w-3.5 h-3.5 text-amber-400" /> },
            { id: 'commit', label: 'Git 提交消息', icon: <GitCommit className="w-3.5 h-3.5 text-emerald-400" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTask(t.id as any)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                task === t.id ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: CODE INPUT */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Code2 className="w-4 h-4" />
              {task === 'commit' ? 'Git Diff 或变更说明' : '源代码输入 (Source Code)'}
            </label>

            {task !== 'commit' && (
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="rust">Rust</option>
                <option value="go">Go</option>
                <option value="html">HTML / CSS</option>
              </select>
            )}
          </div>

          <textarea
            rows={14}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-purple-500 leading-relaxed"
            placeholder={task === 'commit' ? '在此粘贴 git diff 输出或变更内容概要...' : '在此粘贴需要分析的代码...'}
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !inputCode.trim()}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{loading ? 'Gemini AI 分析中...' : `执行 AI ${task === 'explain' ? '代码解释' : task === 'refactor' ? '重构优化' : '提交生成'}`}</span>
          </button>
        </div>

        {/* RIGHT COLUMN: AI RESPONSE */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Gemini AI 分析与建议结果
              </span>

              {responseResult && (
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '已复制' : '复制结果'}</span>
                </button>
              )}
            </div>

            <div className="min-h-[300px] overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
                  <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
                  <span className="text-xs font-medium">Gemini 2.5 Flash 正在分析你的代码...</span>
                </div>
              ) : responseResult ? (
                <div className="markdown-body text-slate-200 text-xs leading-relaxed">
                  <Markdown>{responseResult}</Markdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 gap-2 text-slate-500 text-center">
                  <Terminal className="w-8 h-8 text-slate-700" />
                  <p className="text-xs">在左侧粘贴代码并点击执行，即可查看 AI 代码分析结果。</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
