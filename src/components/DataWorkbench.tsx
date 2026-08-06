import React, { useState } from 'react';
import { 
  Wrench, 
  FileJson, 
  Key, 
  Search, 
  Type, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertCircle,
  CheckCircle2,
  Code
} from 'lucide-react';

export const DataWorkbench: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'json' | 'jwt' | 'regex' | 'text'>('json');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // JSON Workbench State
  const [jsonInput, setJsonInput] = useState(`{\n  "name": "DevCraft Studio",\n  "version": "1.0.0",\n  "openSource": true,\n  "author": {\n    "name": "OpenSource Dev",\n    "github": "octocat"\n  },\n  "tags": ["react", "typescript", "tailwind"]\n}`);
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [tsInterface, setTsInterface] = useState('');

  // JWT State
  const [jwtInput, setJwtInput] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldkNyYWZ0IERldiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTk5OTk5OTk5OX0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  const [jwtHeader, setJwtHeader] = useState('');
  const [jwtPayload, setJwtPayload] = useState('');
  const [jwtStatus, setJwtStatus] = useState<string | null>(null);

  // Regex State
  const [regexPattern, setRegexPattern] = useState('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexTestText, setRegexTestText] = useState('Contact us at support@devcraft.io or dev@github.com');
  const [regexMatches, setRegexMatches] = useState<string[]>([]);

  // Text Converter State
  const [textInput, setTextInput] = useState('devcraft studio open source toolkit');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // JSON Functions
  const handleFormatJson = () => {
    try {
      setJsonError(null);
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));

      // Auto generate TypeScript interface
      generateTsInterface(parsed);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
    }
  };

  const handleMinifyJson = () => {
    try {
      setJsonError(null);
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed));
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
    }
  };

  const generateTsInterface = (obj: any, name: string = 'RootObject') => {
    if (typeof obj !== 'object' || obj === null) return;
    let code = `export interface ${name} {\n`;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      let type: string = typeof val;
      if (Array.isArray(val)) {
        type = val.length > 0 ? `${typeof val[0]}[]` : 'any[]';
      } else if (val === null) {
        type = 'null | any';
      } else if (type === 'object') {
        type = `${key.charAt(0).toUpperCase() + key.slice(1)}Type`;
      }
      code += `  ${key}: ${type};\n`;
    }
    code += `}`;
    setTsInterface(code);
  };

  // JWT Decoder
  const handleDecodeJwt = () => {
    try {
      setJwtStatus(null);
      const parts = jwtInput.split('.');
      if (parts.length !== 3) {
        setJwtStatus('Invalid JWT structure. JWTs must contain header, payload, and signature.');
        return;
      }
      const headerObj = JSON.parse(atob(parts[0]));
      const payloadObj = JSON.parse(atob(parts[1]));

      setJwtHeader(JSON.stringify(headerObj, null, 2));
      setJwtPayload(JSON.stringify(payloadObj, null, 2));

      if (payloadObj.exp) {
        const expDate = new Date(payloadObj.exp * 1000);
        const isExpired = expDate < new Date();
        setJwtStatus(isExpired ? `Expired on ${expDate.toLocaleString()}` : `Valid until ${expDate.toLocaleString()}`);
      } else {
        setJwtStatus('Valid payload (No exp claim found)');
      }
    } catch (e: any) {
      setJwtStatus(`Failed to decode JWT: ${e.message}`);
    }
  };

  // Regex Tester
  const handleTestRegex = () => {
    try {
      const re = new RegExp(regexPattern, regexFlags);
      const matches = regexTestText.match(re);
      setRegexMatches(matches ? Array.from(matches) : []);
    } catch (e) {
      setRegexMatches(['Invalid Regular Expression syntax']);
    }
  };

  // Text Converters
  const toCamelCase = (str: string) => str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
  const toSnakeCase = (str: string) => str.toLowerCase().replace(/\s+/g, '_');
  const toKebabCase = (str: string) => str.toLowerCase().replace(/\s+/g, '-');
  const toConstantCase = (str: string) => str.toUpperCase().replace(/\s+/g, '_');
  const toBase64 = (str: string) => btoa(str);
  const fromBase64 = (str: string) => { try { return atob(str); } catch { return 'Invalid Base64'; } };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-indigo-400" />
            数据格式化与正则测试工作台
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            将 JSON 格式化并自动生成 TypeScript 类型，在线解码 JWT Token、测试正则表达式及转换文本大小写。
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
          {[
            { id: 'json', label: 'JSON & TypeScript', icon: <FileJson className="w-3.5 h-3.5" /> },
            { id: 'jwt', label: 'JWT 解码器', icon: <Key className="w-3.5 h-3.5" /> },
            { id: 'regex', label: '正则测试器', icon: <Search className="w-3.5 h-3.5" /> },
            { id: 'text', label: '文本大小写转换', icon: <Type className="w-3.5 h-3.5" /> },
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

      {/* 1. JSON & TS INTERFACE TAB */}
      {activeTab === 'json' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-1">
                <FileJson className="w-4 h-4" /> JSON Input
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleFormatJson}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-all"
                >
                  Format & TS
                </button>
                <button
                  onClick={handleMinifyJson}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-all"
                >
                  Minify
                </button>
              </div>
            </div>

            <textarea
              rows={14}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />

            {jsonError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{jsonError}</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Formatted JSON */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-emerald-400">Formatted JSON Output</span>
                {jsonOutput && (
                  <button
                    onClick={() => handleCopy(jsonOutput, 'json-out')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'json-out' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                )}
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 h-40 overflow-y-auto whitespace-pre-wrap">
                {jsonOutput || 'Click "Format & TS" above...'}
              </pre>
            </div>

            {/* Generated TypeScript Interface */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-purple-400 flex items-center gap-1">
                  <Code className="w-4 h-4" /> Auto Generated TypeScript Interface
                </span>
                {tsInterface && (
                  <button
                    onClick={() => handleCopy(tsInterface, 'ts-out')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'ts-out' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy TS</span>
                  </button>
                )}
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-purple-300 h-40 overflow-y-auto whitespace-pre-wrap">
                {tsInterface || '// Generated TypeScript interface will appear here'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 2. JWT DECODER TAB */}
      {activeTab === 'jwt' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-1">
                <Key className="w-4 h-4" /> Encoded JWT Token String
              </label>
              <button
                onClick={handleDecodeJwt}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-all"
              >
                Decode JWT Token
              </button>
            </div>

            <textarea
              rows={3}
              value={jwtInput}
              onChange={(e) => setJwtInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 break-all"
            />

            {jwtStatus && (
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>{jwtStatus}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-bold text-rose-400 uppercase">Header (Algorithm & Token Type)</span>
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-rose-300 h-48 overflow-y-auto">
                {jwtHeader || 'Header decoded payload'}
              </pre>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-bold text-purple-400 uppercase">Payload (Data Claims)</span>
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-purple-300 h-48 overflow-y-auto">
                {jwtPayload || 'Payload decoded claims'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 3. REGEX TESTER TAB */}
      {activeTab === 'regex' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Regex Pattern</label>
              <input
                type="text"
                value={regexPattern}
                onChange={(e) => setRegexPattern(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Flags (g, i, m)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={regexFlags}
                  onChange={(e) => setRegexFlags(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleTestRegex}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl transition-all"
                >
                  Test
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Test String</label>
            <textarea
              rows={4}
              value={regexTestText}
              onChange={(e) => setRegexTestText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-emerald-400 block mb-2">
              Matches Found ({regexMatches.length}):
            </span>
            <div className="flex flex-wrap gap-2">
              {regexMatches.length > 0 ? (
                regexMatches.map((match, i) => (
                  <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs rounded-lg">
                    {match}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">No matches found with current expression.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. TEXT & CASE CONVERTER TAB */}
      {activeTab === 'text' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Input Text</label>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'camelCase', val: toCamelCase(textInput) },
              { label: 'snake_case', val: toSnakeCase(textInput) },
              { label: 'kebab-case', val: toKebabCase(textInput) },
              { label: 'CONSTANT_CASE', val: toConstantCase(textInput) },
              { label: 'Base64 Encoded', val: toBase64(textInput) },
              { label: 'Base64 Decoded', val: fromBase64(textInput) },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-indigo-300 truncate">{item.val}</span>
                  <button
                    onClick={() => handleCopy(item.val, `case-${idx}`)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                  >
                    {copiedKey === `case-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
