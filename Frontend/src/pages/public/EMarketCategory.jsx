import { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, ChevronLeft, Search, X,
  ShoppingBag, Grid3x3, Cpu, ExternalLink, Clock, Filter, Tag, Box
} from 'lucide-react';
import api from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { EMARKET_CATEGORIES, MarketProductCard } from './EMarket';

const stagger = { animate: { transition: { staggerChildren: 0.04 } } };

export default function EMarketCategory() {
  const { category: rawCategory } = useParams();
  const categoryName = decodeURIComponent(rawCategory || '');
  const { isDark } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categoryInfo = EMARKET_CATEGORIES.find(
    (c) => c.key.toLowerCase() === categoryName.toLowerCase() || c.label.toLowerCase() === categoryName.toLowerCase()
  );

  useEffect(() => {
    setLoading(true);
    const isAiHwDev = categoryName.toLowerCase().includes('ai hardware') || categoryName.toLowerCase().includes('development boards');
    api.get(`/emarket${isAiHwDev ? '' : `?category=${encodeURIComponent(categoryName)}`}`)
      .then((r) => {
        let data = r.data.data || [];
        if (isAiHwDev) {
          data = data.filter(
            (p) =>
              p.category === 'AI Hardware' ||
              p.category === 'Development Boards' ||
              p.category === 'AI Hardware & Development Boards'
          );
        }
        setProducts(data);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [categoryName]);

  // Extract unique brands for this category
  const availableBrands = useMemo(() => {
    const set = new Set();
    products.forEach((p) => { if (p.brand) set.add(p.brand); });
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (selectedBrand !== 'all') {
      list = list.filter((p) => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.title?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.tagline?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'newest') list.sort((a, b) => new Date(b.releaseDate || b.createdAt) - new Date(a.releaseDate || a.createdAt));
    if (sortBy === 'price_asc') list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === 'price_desc') list.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortBy === 'az') list.sort((a, b) => a.title?.localeCompare(b.title));

    return list;
  }, [products, selectedBrand, search, sortBy]);

  const Icon = categoryInfo?.icon || Cpu;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#09090b] text-slate-100' : 'bg-[#f8fafc] text-zinc-900'}`}>

      {/* ── Sub-Header ───────────────────────────────────────────────────── */}
      <div className={`sticky top-[65px] z-30 border-b backdrop-blur-xl ${isDark ? 'bg-zinc-950/95 border-zinc-800' : 'bg-white/95 border-slate-200'}`}>
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 h-14">
            <Link to="/emarket" className="flex items-center gap-2 pr-4 border-r border-current/10 mr-2 shrink-0 font-display font-black text-sm text-violet-500 uppercase">
              <ShoppingBag size={18} /> AI Innovation
            </Link>

            <nav className="flex items-center gap-1.5 flex-1 overflow-x-auto custom-scrollbar py-1 text-xs">
              <Link
                to="/emarket"
                className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                  isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-600 hover:text-zinc-900 hover:bg-slate-100'
                }`}
              >
                <Grid3x3 size={12} className="inline mr-1" /> All
              </Link>
              {EMARKET_CATEGORIES.map((cat) => {
                const isActive = cat.key.toLowerCase() === categoryName.toLowerCase() || cat.label.toLowerCase() === categoryName.toLowerCase();
                return (
                  <Link
                    key={cat.key}
                    to={`/emarket/${encodeURIComponent(cat.key)}`}
                    className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors ${
                      isActive
                        ? isDark ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'bg-violet-50 text-violet-700 border border-violet-200'
                        : isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-600 hover:text-zinc-900 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* ── Category Hero Header ───────────────────────────────────────────── */}
      <div className={`py-8 border-b ${isDark ? 'bg-zinc-950/80 border-zinc-850' : 'bg-white border-slate-200'}`}>
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/emarket" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-violet-400 mb-3 transition-colors">
            <ChevronLeft size={14} /> Back to AI Innovation Discovery
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-violet-600/15 text-violet-400 border border-violet-500/30 flex items-center justify-center shrink-0">
              <Icon size={28} />
            </div>
            <div>
              <h1 className={`font-display text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {categoryInfo?.label || categoryName}
              </h1>
              <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {categoryInfo?.desc || `Verified real ${categoryName} physical technology and hardware.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ────────────────────────────────────────── */}
      <div className={`border-b py-3 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-zinc-900/40 border-zinc-850' : 'bg-slate-50 border-slate-200'}`}>
        <div className="max-w-[1480px] mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-slate-200'}`}>
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by keyword..."
                className="bg-transparent outline-none w-36 sm:w-48 text-xs"
              />
              {search && <button onClick={() => setSearch('')}><X size={12} /></button>}
            </div>

            {/* Brand Filter */}
            {availableBrands.length > 0 && (
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className={`px-3 py-1.5 rounded-xl border text-xs outline-none ${
                  isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-300' : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <option value="all">All Brands ({products.length})</option>
                {availableBrands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            )}

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-3 py-1.5 rounded-xl border text-xs outline-none ${
                isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-300' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <option value="newest">Newest Releases</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="az">Product Name A-Z</option>
            </select>
          </div>

          <span className="text-xs text-slate-500">
            Showing <strong className={isDark ? 'text-white' : 'text-zinc-900'}>{filtered.length}</strong> verified product{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── Product Grid ─────────────────────────────────────────────────── */}
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Box size={36} className="mx-auto mb-3 text-slate-500 opacity-50" />
            <h3 className="font-bold text-lg mb-1">No products match this filter</h3>
            <p className="text-sm text-slate-500 mb-5">Try resetting search keywords or brand selection.</p>
            <button
              onClick={() => { setSearch(''); setSelectedBrand('all'); }}
              className="btn-primary !px-4 !py-2 !text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filtered.map((p) => (
              <MarketProductCard key={p._id} product={p} isDark={isDark} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
