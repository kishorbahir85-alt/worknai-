import { useState, useEffect } from 'react';
import {
  Sparkles, Save, RefreshCw, Image as ImageIcon, Type, Layout,
  Layers, Check, Zap, Eye, Sliders, Globe, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const DEFAULT_CONFIG = {
  heroTitle: 'Real Technology for a Smarter Tomorrow.',
  heroSubtitle: 'Explore and buy genuine robotics, AI hardware, smart devices, development boards and electronics from trusted global brands — now easily accessible in India.',
  badgeText: 'Verified Real-World Technology Marketplace',
  searchPlaceholder: 'Search products, brands, or categories...',
  trendingKeywords: ['Unitree Go2', 'Apple Vision Pro', 'NVIDIA Jetson', 'Raspberry Pi 5', 'DJI Mini 4'],
  categories: [
    {
      id: 'Everyday AI',
      label: 'Everyday AI',
      subtitle: 'Smart Wearables, Glasses & AI Devices',
      image: '/emarket/products/apple-vision-pro-spatial-computer.jpg',
    },
    {
      id: 'Smart Home',
      label: 'Smart Home',
      subtitle: 'Smarter Homes, Automation & IoT Hubs',
      image: '/emarket/products/home-assistant-green-smart-home-hub.jpg',
    },
    {
      id: 'Robotics',
      label: 'Robotics',
      subtitle: 'Humanoids, Quadrupeds & AI Drones',
      image: '/emarket/products/unitree-go2-quadruped-robot.jpg',
    },
    {
      id: 'AI Hardware & Dev Boards',
      label: 'AI Hardware & Dev Boards',
      subtitle: 'Edge AI Compute & Single Board Computers',
      image: '/emarket/products/nvidia-jetson-orin-nano-developer-kit.jpg',
    },
  ],
  valueProps: [
    { label: '500+', desc: 'Verified Products' },
    { label: '50+', desc: 'Global Brands' },
    { label: '100%', desc: 'Authentic Sources' },
    { label: 'Fast', desc: 'India Delivery Info' },
  ],
  featuredTitle: 'Featured Products',
  featuredSubtitle: "Handpicked innovations from the world's leading technology brands.",
};

export default function ManageAIMarketPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState('hero');
  const [newKeyword, setNewKeyword] = useState('');

  const loadConfig = () => {
    setLoading(true);
    api.get('/emarket/page-config')
      .then((r) => {
        if (r.data?.data) {
          const fetched = r.data.data;
          setConfig({
            ...DEFAULT_CONFIG,
            ...fetched,
            categories: (fetched.categories && fetched.categories.length > 0) ? fetched.categories : DEFAULT_CONFIG.categories,
            valueProps: (fetched.valueProps && fetched.valueProps.length > 0) ? fetched.valueProps : DEFAULT_CONFIG.valueProps,
            trendingKeywords: (fetched.trendingKeywords && fetched.trendingKeywords.length > 0) ? fetched.trendingKeywords : DEFAULT_CONFIG.trendingKeywords,
          });
        }
      })
      .catch(() => {
        // Fallback to local storage if API route not present
        const saved = localStorage.getItem('AIMARKET_PAGE_CONFIG');
        if (saved) {
          try { setConfig((prev) => ({ ...prev, ...JSON.parse(saved) })); } catch {}
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/emarket/page-config', config);
      localStorage.setItem('AIMARKET_PAGE_CONFIG', JSON.stringify(config));
      toast.success('AI Market page content & image-to-text config updated successfully!');
    } catch {
      localStorage.setItem('AIMARKET_PAGE_CONFIG', JSON.stringify(config));
      toast.success('Saved to AI Market configuration profile!');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    localStorage.removeItem('AIMARKET_PAGE_CONFIG');
    toast.success('Reset page configuration to default values');
  };

  const updateCategory = (idx, key, val) => {
    setConfig((prev) => {
      const currentCats = (prev.categories && prev.categories.length > 0) ? prev.categories : DEFAULT_CONFIG.categories;
      const updated = [...currentCats];
      updated[idx] = { ...updated[idx], [key]: val };
      return { ...prev, categories: updated };
    });
  };

  const updateValueProp = (idx, key, val) => {
    setConfig((prev) => {
      const currentProps = (prev.valueProps && prev.valueProps.length > 0) ? prev.valueProps : DEFAULT_CONFIG.valueProps;
      const updated = [...currentProps];
      updated[idx] = { ...updated[idx], [key]: val };
      return { ...prev, valueProps: updated };
    });
  };

  const addTrendingKeyword = () => {
    if (!newKeyword.trim()) return;
    if (config.trendingKeywords.includes(newKeyword.trim())) {
      toast.error('Keyword already exists');
      return;
    }
    setConfig((prev) => ({
      ...prev,
      trendingKeywords: [...prev.trendingKeywords, newKeyword.trim()],
    }));
    setNewKeyword('');
  };

  const removeTrendingKeyword = (kw) => {
    setConfig((prev) => ({
      ...prev,
      trendingKeywords: prev.trendingKeywords.filter((k) => k !== kw),
    }));
  };

  return (
    <section className="space-y-6">
      {/* Top Header & Controller Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#111322] via-[#0f111e] to-[#161329] border border-violet-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                AI Innovation Page CMS
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Full Page Image-to-Text Control
                </span>
              </h1>
              <p className="mt-0.5 text-zinc-400 text-xs sm:text-sm">
                Control public AI Innovation page titles, hero headlines, image paths, category subtitles & text content in real-time.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-all flex items-center gap-1.5"
          >
            <RefreshCw size={14} /> Reset
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-600/30 border border-violet-500 flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={15} /> {saving ? 'Saving Changes...' : 'Save Full Page CMS'}
          </button>
        </div>
      </div>

      {/* Tabs for Sections */}
      <div className="flex items-center gap-2 p-1.5 bg-[#0f111e] border border-zinc-800 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'hero'
              ? 'bg-violet-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Type size={14} /> Hero Section & Search
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'categories'
              ? 'bg-violet-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <ImageIcon size={14} /> Popular Category Cards & Images
        </button>
        <button
          onClick={() => setActiveTab('valueprops')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'valueprops'
              ? 'bg-violet-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <ShieldCheck size={14} /> Value Proposition Pills
        </button>
        <button
          onClick={() => setActiveTab('featured')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'featured'
              ? 'bg-violet-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Sliders size={14} /> Featured Section Headings
        </button>
      </div>

      {/* Tab Content 1: Hero Section & Search */}
      {activeTab === 'hero' && (
        <div className="p-6 rounded-2xl bg-[#0e101a] border border-zinc-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Type className="text-violet-400" size={18} /> Hero Section Copy & Badges
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">Top Pill Badge Text</label>
              <input
                type="text"
                value={config.badgeText}
                onChange={(e) => setConfig({ ...config, badgeText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-700 text-sm text-slate-100 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">Search Bar Placeholder Text</label>
              <input
                type="text"
                value={config.searchPlaceholder}
                onChange={(e) => setConfig({ ...config, searchPlaceholder: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-700 text-sm text-slate-100 outline-none focus:border-violet-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">Main Hero Title</label>
              <input
                type="text"
                value={config.heroTitle}
                onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-700 text-sm text-slate-100 font-bold outline-none focus:border-violet-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">Hero Subtitle Paragraph</label>
              <textarea
                rows={3}
                value={config.heroSubtitle}
                onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-700 text-sm text-slate-100 outline-none focus:border-violet-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Trending Search Chips Controller */}
          <div className="pt-4 border-t border-zinc-800/80 space-y-3">
            <label className="block text-xs font-bold uppercase text-zinc-400">Trending Search Quick Chips</label>
            <div className="flex flex-wrap items-center gap-2">
              {config.trendingKeywords.map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1.5 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30 text-xs font-bold flex items-center gap-2"
                >
                  {kw}
                  <button
                    onClick={() => removeTrendingKeyword(kw)}
                    className="hover:text-red-400 font-bold text-xs"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 max-w-md pt-1">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addTrendingKeyword(); }}
                placeholder="Add new trending search keyword..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-950/80 border border-zinc-700 text-xs text-slate-100 outline-none focus:border-violet-500"
              />
              <button
                onClick={addTrendingKeyword}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs"
              >
                Add Chip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Popular Category Cards & Images */}
      {activeTab === 'categories' && (
        <div className="p-6 rounded-2xl bg-[#0e101a] border border-zinc-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ImageIcon className="text-violet-400" size={18} /> Popular Category Cards (4-Card Strip Image-to-Text)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-violet-400 tracking-wider">
                    Category {idx + 1}: {cat.id}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                    ID: {cat.id}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Display Label</label>
                  <input
                    type="text"
                    value={cat.label}
                    onChange={(e) => updateCategory(idx, 'label', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-slate-100 font-bold outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Subtext / Description</label>
                  <input
                    type="text"
                    value={cat.subtitle}
                    onChange={(e) => updateCategory(idx, 'subtitle', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-slate-100 outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Card Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cat.image}
                      onChange={(e) => updateCategory(idx, 'image', e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-slate-100 font-mono outline-none focus:border-violet-500"
                    />
                    <div className="w-10 h-10 rounded-xl bg-white p-1 border border-zinc-700 shrink-0 flex items-center justify-center overflow-hidden">
                      <img src={cat.image} alt={cat.label} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: Value Proposition Pills */}
      {activeTab === 'valueprops' && (
        <div className="p-6 rounded-2xl bg-[#0e101a] border border-zinc-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-violet-400" size={18} /> Hero Value Proposition Stat Pills
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {config.valueProps.map((vp, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
                <span className="text-[10px] font-bold uppercase text-violet-400">Pill {idx + 1}</span>
                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 mb-1">Stat Value</label>
                  <input
                    type="text"
                    value={vp.label}
                    onChange={(e) => updateValueProp(idx, 'label', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-bold text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 mb-1">Stat Label</label>
                  <input
                    type="text"
                    value={vp.desc}
                    onChange={(e) => updateValueProp(idx, 'desc', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-slate-100 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 4: Featured Section Headings */}
      {activeTab === 'featured' && (
        <div className="p-6 rounded-2xl bg-[#0e101a] border border-zinc-800 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="text-violet-400" size={18} /> Featured Products Section Copy
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">Section Title</label>
            <input
              type="text"
              value={config.featuredTitle}
              onChange={(e) => setConfig({ ...config, featuredTitle: e.target.value })}
              className="w-full max-w-xl px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-700 text-sm text-slate-100 font-bold outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">Section Subtitle</label>
            <input
              type="text"
              value={config.featuredSubtitle}
              onChange={(e) => setConfig({ ...config, featuredSubtitle: e.target.value })}
              className="w-full max-w-xl px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-700 text-sm text-slate-100 outline-none focus:border-violet-500"
            />
          </div>
        </div>
      )}
    </section>
  );
}
