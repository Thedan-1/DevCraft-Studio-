import React, { useState } from 'react';
import { 
  Palette, 
  Copy, 
  Check, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  Sliders,
  Layers,
  Zap
} from 'lucide-react';

interface PaletteItem {
  hex: string;
  name: string;
  rgb: string;
}

export const CssPaletteLab: React.FC = () => {
  const [primaryColor, setPrimaryColor] = useState('#6366f1'); // Indigo 500
  const [bgColor, setBgColor] = useState('#0f172a'); // Slate 900
  const [textColor, setTextColor] = useState('#f8fafc'); // Slate 50
  const [blurAmount, setBlurAmount] = useState(16);
  const [opacityAmount, setOpacityAmount] = useState(20);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Helper function to calculate relative luminance
  const getLuminance = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const hexToRgb = (hex: string) => {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map((c) => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    return isNaN(num)
      ? { r: 99, g: 102, b: 241 }
      : { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  };

  // Calculate contrast ratio
  const luminance1 = getLuminance(textColor);
  const luminance2 = getLuminance(bgColor);
  const l1 = Math.max(luminance1, luminance2);
  const l2 = Math.min(luminance1, luminance2);
  const contrastRatio = ((l1 + 0.05) / (l2 + 0.05)).toFixed(2);
  const numRatio = parseFloat(contrastRatio);

  const passesAA = numRatio >= 4.5;
  const passesAAA = numRatio >= 7.0;

  // Generate Tailwind Shade Steps (50 to 950)
  const generateShades = (hex: string) => {
    const rgb = hexToRgb(hex);
    const shades = [
      { step: '50', factor: 0.9 },
      { step: '100', factor: 0.8 },
      { step: '200', factor: 0.6 },
      { step: '300', factor: 0.4 },
      { step: '400', factor: 0.2 },
      { step: '500', factor: 0 },
      { step: '600', factor: -0.15 },
      { step: '700', factor: -0.3 },
      { step: '800', factor: -0.45 },
      { step: '900', factor: -0.6 },
      { step: '950', factor: -0.75 },
    ];

    return shades.map(({ step, factor }) => {
      let r = rgb.r;
      let g = rgb.g;
      let b = rgb.b;

      if (factor > 0) {
        // Lighten
        r = Math.round(r + (255 - r) * factor);
        g = Math.round(g + (255 - g) * factor);
        b = Math.round(b + (255 - b) * factor);
      } else if (factor < 0) {
        // Darken
        r = Math.round(r * (1 + factor));
        g = Math.round(g * (1 + factor));
        b = Math.round(b * (1 + factor));
      }

      const hexRes = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      return { step, hex: hexRes, rgb: `rgb(${r}, ${g}, ${b})` };
    });
  };

  const shades = generateShades(primaryColor);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const cssVariablesSnippet = `:root {\n` +
    shades.map((s) => `  --color-primary-${s.step}: ${s.hex};`).join('\n') +
    `\n}`;

  const glassmorphismCss = `/* Glassmorphism Card CSS */
background: rgba(255, 255, 255, ${opacityAmount / 100});
backdrop-filter: blur(${blurAmount}px);
-webkit-backdrop-filter: blur(${blurAmount}px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px;`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-400" />
            Tailwind 调色板与玻璃拟态实验室
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            计算 Tailwind CSS 11 阶阶梯色阶、测试 WCAG AA/AAA 无障碍对比度，并在线生成 Glassmorphism 组件代码。
          </p>
        </div>

        {/* Color Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: '靛蓝', color: '#6366f1' },
            { label: '翡翠', color: '#10b981' },
            { label: '青蓝', color: '#06b6d4' },
            { label: '紫色', color: '#a855f7' },
            { label: '玫瑰', color: '#f43f5e' },
            { label: '琥珀', color: '#f59e0b' },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => setPrimaryColor(preset.color)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg text-white border border-white/10 flex items-center gap-1.5 transition-all hover:scale-105"
              style={{ backgroundColor: preset.color }}
            >
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: TAILWIND SHADE GENERATOR & WCAG */}
        <div className="space-y-6">
          
          {/* Primary Picker & Shade List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                Tailwind CSS 11-Step Shade Generator
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-xs text-slate-300 font-bold">{primaryColor.toUpperCase()}</span>
              </div>
            </div>

            {/* Shades Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {shades.map((shade) => (
                <div
                  key={shade.step}
                  onClick={() => handleCopy(shade.hex, `shade-${shade.step}`)}
                  className="p-2.5 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-600 transition-all group"
                  style={{ backgroundColor: shade.hex }}
                >
                  <span className={`text-xs font-bold font-mono ${parseInt(shade.step) > 400 ? 'text-white' : 'text-slate-900'}`}>
                    {shade.step}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono ${parseInt(shade.step) > 400 ? 'text-slate-200' : 'text-slate-800'}`}>
                      {shade.hex}
                    </span>
                    {copiedKey === `shade-${shade.step}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 ${parseInt(shade.step) > 400 ? 'text-white' : 'text-slate-900'}`} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleCopy(cssVariablesSnippet, 'css-vars')}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {copiedKey === 'css-vars' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
              <span>{copiedKey === 'css-vars' ? '已复制 CSS 变量代码!' : '复制 :root CSS 变量定义'}</span>
            </button>
          </div>

          {/* WCAG Contrast Ratio Checker */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              WCAG 无障碍色彩对比度测试
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">文字颜色 (Text Color)</label>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-white">{textColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">背景颜色 (Background Color)</label>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-white">{bgColor}</span>
                </div>
              </div>
            </div>

            {/* Test Card Box */}
            <div
              className="p-6 rounded-2xl border text-center transition-all shadow-inner"
              style={{ backgroundColor: bgColor, color: textColor, borderColor: `${textColor}30` }}
            >
              <h4 className="text-lg font-bold">无障碍对比度测试示例</h4>
              <p className="text-xs mt-1 opacity-90">
                清晰易读的排版可确保项目在不同显示器与设备上均具备良好的无障碍体验。
              </p>
            </div>

            {/* Score & Badges */}
            <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <div>
                <span className="text-xs text-slate-400 block">Contrast Ratio</span>
                <span className="text-lg font-bold font-mono text-white">{contrastRatio} : 1</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${passesAA ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                  WCAG AA {passesAA ? 'PASS' : 'FAIL'}
                </span>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${passesAAA ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                  WCAG AAA {passesAAA ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: GLASSMORPHISM & GRADIENT MESH DESIGNER */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              Glassmorphism 玻璃拟态设计器
            </h3>

            {/* Sliders for Glass */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>高斯模糊 (Backdrop Blur)</span>
                  <span className="font-mono text-indigo-400">{blurAmount}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={blurAmount}
                  onChange={(e) => setBlurAmount(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>透明度 (Glass Opacity)</span>
                  <span className="font-mono text-indigo-400">{opacityAmount}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={80}
                  value={opacityAmount}
                  onChange={(e) => setOpacityAmount(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            {/* Live Glass Preview Canvas */}
            <div className="relative h-64 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-6 flex items-center justify-center overflow-hidden shadow-2xl">
              {/* Decorative Floating Circles */}
              <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-amber-400 opacity-60 blur-lg animate-pulse" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-cyan-400 opacity-60 blur-xl animate-pulse" />

              {/* Glass Card */}
              <div
                className="relative z-10 w-full max-w-sm p-6 text-white text-center space-y-2 shadow-2xl transition-all"
                style={{
                  backgroundColor: `rgba(255, 255, 255, ${opacityAmount / 100})`,
                  backdropFilter: `blur(${blurAmount}px)`,
                  WebkitBackdropFilter: `blur(${blurAmount}px)`,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                }}
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-white/20 flex items-center justify-center border border-white/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-base">玻璃拟态卡片预览</h4>
                <p className="text-xs text-white/80">
                  毛玻璃效果与 backdrop-filter 过滤的现代交互 UI。
                </p>
              </div>
            </div>

            {/* Copy Glass CSS Code */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 relative group">
              <pre className="whitespace-pre-wrap">{glassmorphismCss}</pre>
              <button
                onClick={() => handleCopy(glassmorphismCss, 'glass-css')}
                className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] flex items-center gap-1 transition-all"
              >
                {copiedKey === 'glass-css' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'glass-css' ? '已复制' : '复制 CSS'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
