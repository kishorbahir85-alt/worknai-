import { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, ArrowRight, ArrowUpRight,
  Cpu, Wifi, Zap, Box, Layers, Sparkles,
  Bot, CircuitBoard, ShoppingBag, Grid3x3,
  Glasses, Home, ExternalLink, ShieldCheck, Filter,
  TrendingUp, Compass, SlidersHorizontal, CheckCircle2,
  Flame, Award, ChevronLeft, ChevronRight, Lock, Users,
  Globe2, Check
} from 'lucide-react';
import api from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { getBrandLogo } from '../../components/emarket/BrandLogos';

export function formatInrPrice(price) {
  if (price === null || price === undefined || price <= 0) return null;
  return `₹${Number(price).toLocaleString('en-IN')}`;
}

export const EMARKET_CATEGORIES = [
  { key: 'all', label: 'All Products', icon: Grid3x3 },
  { key: 'Everyday AI', label: 'Everyday AI & Wearables', icon: Glasses },
  { key: 'Smart Home', label: 'IoT & Smart Home', icon: Home },
  { key: 'Robotics', label: 'Robots & Autonomous Systems', icon: Bot },
  { key: 'AI Hardware & Development Boards', label: 'AI Hardware & Dev Boards', icon: Cpu },
  { key: 'Electronics & Components', label: 'Sensors & Components', icon: Zap },
];

// ─── Visual Category Strip Configuration (Flow: Everyday AI, Smart Home, Robotics, AI Hardware & Dev Boards) ────
export const VISUAL_CATEGORIES = [
  {
    id: 'everyday-ai',
    key: 'Everyday AI',
    label: 'Everyday AI',
    subtitle: 'Smart Wearables, Glasses & AI Devices',
    image: '/emarket/products/ray-ban-meta-smart-glasses-gen-2.jpg',
    match: (p) =>
      p.category === 'Everyday AI' ||
      /glasses|wearable|ring|smartwatch|fit 3|meta ray-ban|watch|rabbit r1|spatial/i.test(
        p.title + p.subcategory + p.description + p.category
      ),
  },
  {
    id: 'smart-home',
    key: 'Smart Home',
    label: 'Smart Home',
    subtitle: 'Smarter Homes, Automation & IoT Hubs',
    image: '/emarket/products/home-assistant-green.jpg',
    match: (p) =>
      p.category === 'Smart Home' ||
      /home assistant|smart hub|automation|thermostat|nest|green|vacuum|roborock|deebot/i.test(
        p.title + p.subcategory + p.description + p.category
      ),
  },
  {
    id: 'robotics',
    key: 'Robotics',
    label: 'Robotic Innovation',
    subtitle: 'Humanoids, Quadrupeds & AI Drones',
    image: '/emarket/products/unitree-go2-quadruped-robot.jpg',
    match: (p) =>
      p.category === 'Robotics' ||
      /robot|drone|quadruped|humanoid|go2|g1|mini 4/i.test(
        p.title + p.subcategory + p.description + p.category
      ),
  },
  {
    id: 'ai-hw-dev-boards',
    key: 'AI Hardware & Development Boards',
    label: 'AI Hardware & Dev Boards',
    subtitle: 'Edge AI Compute & Single Board Computers',
    image: '/emarket/products/nvidia-jetson-orin-nano-developer-kit.jpg',
    match: (p) =>
      p.category === 'AI Hardware' ||
      p.category === 'Development Boards' ||
      p.category === 'AI Hardware & Development Boards' ||
      /jetson|orin|raspberry|npu|tpu|sbc|workstation|mini pc|edge/i.test(
        p.title + p.subcategory + p.description + p.category
      ),
  },
];

// ─── Hero Slider Trending Products (Auto-Advancing Showcase) ───────────────────
const HERO_SLIDES = [
  {
    title: 'Unitree Go2',
    subtitle: 'Quadruped Robot',
    slug: 'unitree-go2',
    image: '/emarket/products/unitree-go2-quadruped-robot.jpg',
    bgImage: '/emarket/unitree_go2_panoramic_hero.jpg?v=4',
    price: 160000,
    specs: [
      { icon: '🤖', text: 'AI-Powered Mobility' },
      { icon: '⚡', text: '4D LiDAR Perception' },
      { icon: '🦾', text: '12 DoF Joint Motors' },
      { icon: '🎓', text: 'For Research & Education' },
    ],
  },
  {
    title: 'Apple Vision Pro',
    subtitle: 'Spatial Computer 256GB',
    slug: 'apple-vision-pro-spatial-computer',
    image: '/emarket/products/apple-vision-pro-spatial-computer.jpg?v=10',
    bgImage: '/emarket/apple_vision_pro_panoramic_hero.jpg?v=10',
    bgPosition: '53% 18%',
    price: 349900,
    specs: [
      { icon: '🥽', text: '23 Million Pixel 3D Display' },
      { icon: '⚡', text: 'Dual M2 + R1 Spatial Chips' },
      { icon: '👁️', text: 'Eye & Gesture Tracking' },
      { icon: '🌐', text: 'visionOS Spatial Ecosystem' },
    ],
  },
];

// ─── Trusted Global Brands List ────────────────────────────────────────────────
const TRUSTED_BRANDS = [
  { name: 'Apple', query: 'Apple' },
  { name: 'NVIDIA', query: 'NVIDIA' },
  { name: 'DJI', query: 'DJI' },
  { name: 'Unitree', query: 'Unitree' },
  { name: 'Raspberry Pi', query: 'Raspberry Pi' },
  { name: 'Arduino', query: 'Arduino' },
  { name: 'Meta', query: 'Meta' },
  { name: 'PLAUD', query: 'PLAUD' },
  { name: 'Sony', query: 'Sony' },
  { name: 'ECOVACS', query: 'ECOVACS' },
  { name: 'Huawei', query: 'Huawei' },
];

// ─── Image-First Premium Commerce Product Card (70% Visual, 30% Info) ──────────
export function MarketProductCard({ product, isDark }) {
  const [imgErr, setImgErr] = useState(false);
  const priceDisplay = formatInrPrice(product.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{ y: -6, scale: 1.018 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative h-[380px] sm:h-[395px] w-full rounded-2xl border p-2.5 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-[#121422] via-[#0e101a] to-[#090a12] border-zinc-800/80 hover:border-violet-500/60 shadow-lg hover:shadow-[0_12px_40px_rgba(139,92,246,0.22)]'
          : 'bg-white border-slate-200/90 hover:border-violet-400/60 shadow-sm hover:shadow-xl hover:shadow-violet-100'
      }`}
    >
      {/* Animated Glowing Ambient Glow Orb on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* 1. Large 75% Height Hardware Canvas Frame */}
      <Link
        to={`/emarket/product/${product.slug}`}
        className={`block relative h-60 sm:h-64 shrink-0 w-full rounded-xl p-3 flex items-center justify-center overflow-hidden border transition-all ${
          isDark
            ? 'bg-gradient-to-b from-[#181a28] via-[#121420] to-[#0c0d16] border-zinc-800/80 group-hover:border-violet-500/40'
            : 'bg-slate-50/90 border-slate-200/80 group-hover:bg-slate-100/60'
        }`}
      >
        {/* Soft Center Radial Glow */}
        <div className="absolute w-40 h-40 bg-violet-500/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

        {/* Floating Brand Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border shadow-sm ${
            isDark
              ? 'bg-zinc-950/85 border-violet-500/30 text-violet-300'
              : 'bg-white/95 border-slate-200 text-violet-700 shadow-slate-200'
          }`}>
            {product.brand}
          </span>
        </div>

        {/* Floating Quick Action Arrow Button */}
        <div className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
          <div className="w-7 h-7 rounded-full flex items-center justify-center bg-violet-600 text-white shadow-lg backdrop-blur-md">
            <ArrowUpRight size={13} />
          </div>
        </div>

        {!imgErr && product.image ? (
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            onError={() => setImgErr(true)}
            className="w-full h-full object-contain filter drop-shadow-md rounded-lg transition-transform duration-500 ease-out group-hover:scale-108 mix-blend-multiply dark:mix-blend-screen relative z-0"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <Cpu size={40} />
            <span className="text-xs mt-1 font-mono text-slate-500">{product.brand}</span>
          </div>
        )}
      </Link>

      {/* 2. Minimal High-Impact Product Info (Title + Price + CTA) */}
      <div className="pt-2 px-1 pb-1 flex-1 flex flex-col justify-between relative z-10">
        <Link
          to={`/emarket/product/${product.slug}`}
          className={`font-black text-sm sm:text-base leading-snug line-clamp-1 transition-colors ${
            isDark ? 'text-white group-hover:text-violet-300' : 'text-zinc-900 group-hover:text-violet-700'
          }`}
          title={product.title}
        >
          {product.title}
        </Link>

        {/* Price & Action Footer */}
        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-black tracking-tight font-mono text-emerald-500 dark:text-[#00e599] drop-shadow-sm">
              {priceDisplay || <span className="text-xs text-slate-500 font-normal">View Price</span>}
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-bold mt-0.5 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
              <span className="truncate max-w-[110px]">{product.source || `${product.brand} Official`}</span>
            </div>
          </div>

          <Link
            to={`/emarket/product/${product.slug}`}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1 text-xs font-bold transition-all shrink-0 shadow-md ${
              isDark
                ? 'bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/30'
                : 'bg-violet-50 hover:bg-violet-600 text-violet-700 hover:text-white border border-violet-200'
            }`}
          >
            Details <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main E-Market Page Component ──────────────────────────────────────────
export default function EMarket() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [pageConfig, setPageConfig] = useState(null);

  // Filter States
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-Suggest Dropdown Ref & Focus State
  const searchContainerRef = useRef(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/emarket')
      .then((res) => {
        setProducts(res.data.data || []);
      })
      .catch((err) => console.error('Error loading e-market catalog:', err))
      .finally(() => setLoading(false));

    api.get('/emarket/page-config')
      .then((res) => {
        if (res.data?.data) {
          setPageConfig(res.data.data);
        }
      })
      .catch(() => {
        const saved = localStorage.getItem('AIMARKET_PAGE_CONFIG');
        if (saved) {
          try { setPageConfig(JSON.parse(saved)); } catch {}
        }
      });
  }, []);

  // Dynamic Visual Categories merged with CMS Config
  const visualCategories = useMemo(() => {
    if (!pageConfig?.categories || !Array.isArray(pageConfig.categories)) {
      return VISUAL_CATEGORIES;
    }
    return VISUAL_CATEGORIES.map((cat) => {
      const cmsCat = pageConfig.categories.find(
        (c) => c.id === cat.id || c.id === cat.key || c.label === cat.label
      );
      if (cmsCat) {
        return {
          ...cat,
          label: cmsCat.label || cat.label,
          subtitle: cmsCat.subtitle || cat.subtitle,
          image: cmsCat.image || cat.image,
        };
      }
      return cat;
    });
  }, [pageConfig]);

  // Dynamic Trending Search Quick Chips
  const trendingKeywords = useMemo(() => {
    if (pageConfig?.trendingKeywords && Array.isArray(pageConfig.trendingKeywords) && pageConfig.trendingKeywords.length > 0) {
      return pageConfig.trendingKeywords;
    }
    return ['Unitree Go2', 'Apple Vision Pro', 'NVIDIA Jetson', 'Raspberry Pi 5', 'DJI Mini 4'];
  }, [pageConfig]);

  // Dynamic Stat Pills
  const valueProps = useMemo(() => {
    if (pageConfig?.valueProps && Array.isArray(pageConfig.valueProps) && pageConfig.valueProps.length >= 4) {
      return pageConfig.valueProps;
    }
    return [
      { label: '500+', desc: 'Verified Products' },
      { label: '50+', desc: 'Global Brands' },
      { label: '100%', desc: 'Authentic Sources' },
      { label: 'Fast', desc: 'India Delivery Info' },
    ];
  }, [pageConfig]);

  // Matching Categories for Search Suggestion Dropdown
  const matchedCategories = useMemo(() => {
    if (!searchQuery.trim()) return visualCategories;
    const q = searchQuery.toLowerCase().trim();
    return visualCategories.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.key.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q)
    );
  }, [searchQuery, visualCategories]);

  // Matching Product Suggestions for Search Suggestion Dropdown
  const matchedProductsSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return products
      .filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      )
      .slice(0, 4);
  }, [products, searchQuery]);

  // Trusted Brands Logo Slider State (Hover to pause, leave to start)
  const [isBrandHovered, setIsBrandHovered] = useState(false);
  const [brandScrollDirection, setBrandScrollDirection] = useState('normal');
  const brandSliderItems = useMemo(() => [
    ...TRUSTED_BRANDS,
    ...TRUSTED_BRANDS,
    ...TRUSTED_BRANDS,
    ...TRUSTED_BRANDS,
  ], []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (activeCategory !== 'all') {
      const catObj = visualCategories.find(
        (c) => c.id === activeCategory || c.key.toLowerCase() === activeCategory.toLowerCase()
      );
      if (catObj && catObj.match) {
        list = list.filter(catObj.match);
      } else if (
        activeCategory === 'AI Hardware & Development Boards' ||
        activeCategory.toLowerCase().includes('ai hardware')
      ) {
        list = list.filter(
          (p) =>
            p.category === 'AI Hardware' ||
            p.category === 'Development Boards' ||
            p.category === 'AI Hardware & Development Boards'
        );
      } else {
        list = list.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
      }
    }

    if (selectedBrand !== 'all') {
      list = list.filter((p) => p.brand.toLowerCase().includes(selectedBrand.toLowerCase()));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q) ||
          p.tagline?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [products, activeCategory, selectedBrand, searchQuery]);

  // Featured Carousel List
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.isFeatured).slice(0, 10);
  }, [products]);

  // Robotics Collection
  const roboticsProducts = useMemo(() => {
    return products.filter((p) => p.category === 'Robotics');
  }, [products]);

  // Current Active Hero Slide
  const currentHero = HERO_SLIDES[activeSlide] || HERO_SLIDES[0];

  // Auto-advance hero slides for trending products every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#08080b] text-slate-100' : 'bg-[#f7f8fc] text-zinc-900'}`}>

      {/* ── 1. Hero Section: Panoramic Cinematic Launch Stage ──────────────────── */}
      <section className={`relative overflow-hidden border-b min-h-[540px] lg:min-h-[580px] flex items-center transition-colors duration-300 ${isDark ? 'border-slate-800/50 bg-[#08080b]' : 'border-slate-200/90 bg-gradient-to-br from-white via-slate-50 to-indigo-50/40'}`}>
        {/* Full-width Panoramic Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          
          {/* 1. Cinematic Ambient Tech Grid Pattern Overlay */}
          <div className={`absolute inset-0 z-0 pointer-events-none opacity-[0.15] dark:opacity-[0.25] ${
            isDark
              ? '[background-image:linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] [background-size:4rem_4rem]'
              : '[background-image:linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] [background-size:4rem_4rem]'
          }`} />

          {/* 2. Cinematic Glowing Ambient Aura Lights */}
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-violet-600/25 via-indigo-600/15 to-cyan-500/20 rounded-full blur-[110px] pointer-events-none animate-pulse" />
          <div className="absolute -bottom-24 right-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />

          <AnimatePresence mode="wait">
            {currentHero.heroMode === 'contain' ? (
              <motion.div
                key={currentHero.title}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-end pr-8 sm:pr-16 md:pr-36 lg:pr-48 pointer-events-none"
              >
                <div className="h-[360px] sm:h-[400px] lg:h-[440px] max-w-[420px] sm:max-w-[460px] lg:max-w-[500px] relative flex items-center justify-center">
                  <div className="absolute w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
                  <img
                    src={currentHero.bgImage || currentHero.image}
                    alt={currentHero.title}
                    className="max-h-[340px] sm:max-h-[380px] lg:max-h-[420px] max-w-full w-auto object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative z-10 mix-blend-multiply dark:mix-blend-screen"
                  />
                </div>
              </motion.div>
            ) : currentHero.bgImage ? (
              <motion.div
                key={currentHero.title}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-cover bg-no-repeat opacity-90 dark:opacity-100"
                style={{
                  backgroundImage: `url(${currentHero.bgImage})`,
                  backgroundPosition: currentHero.bgPosition || 'center center',
                }}
              />
            ) : (
              <motion.div
                key={currentHero.title}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-end pr-8 lg:pr-24"
              >
                <div className="w-[500px] h-[420px] relative flex items-center justify-center">
                  <div className="absolute w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
                  <img
                    src={currentHero.image}
                    alt={currentHero.title}
                    className="max-h-[380px] w-auto object-contain filter drop-shadow-2xl relative z-10"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Left Gradient Overlay to guarantee high contrast for left text */}
          <div className={`absolute inset-0 z-[1] w-full md:w-[48%] lg:w-[42%] ${
            isDark 
              ? 'bg-gradient-to-r from-[#08080b] via-[#08080b]/90 to-transparent' 
              : 'bg-gradient-to-r from-white via-white/80 to-transparent'
          }`} />
          
          {/* Subtle top & bottom edge vignettes */}
          <div className={`absolute inset-0 z-[1] bg-gradient-to-b ${
            isDark 
              ? 'from-[#08080b]/70 via-transparent to-[#08080b]/90' 
              : 'from-white/60 via-transparent to-slate-100/80'
          }`} />

          {/* 3. Bottom Cinematic Glowing Laser Accent Line */}
          <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent z-[2]" />
        </div>

        {/* Hero Interactive Content (Grid Overlay) */}
        <div className="relative z-10 max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 lg:pt-5 pb-8 sm:pb-10 lg:pb-12 w-full">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* Left Column: Headline, Search, Value Props */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-7 space-y-4"
            >
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${
                isDark 
                  ? 'bg-zinc-900/80 border-emerald-500/40 text-emerald-400' 
                  : 'bg-emerald-50 border-emerald-300 text-emerald-700'
              }`}>
                <ShieldCheck size={14} className={isDark ? "text-emerald-400 shrink-0" : "text-emerald-600 shrink-0"} />
                {pageConfig?.badgeText || 'Verified Real-World Technology Marketplace'}
              </div>

              <h1 className={`font-display text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-[1.08] ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {pageConfig?.heroTitle ? (
                  pageConfig.heroTitle
                ) : (
                  <>
                    Real Technology <br />
                    for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 dark:from-violet-400 dark:via-indigo-300 dark:to-cyan-400">Smarter Tomorrow.</span>
                  </>
                )}
              </h1>

              <p className={`text-sm sm:text-base max-w-xl leading-relaxed font-normal ${
                isDark ? 'text-zinc-300' : 'text-slate-600'
              }`}>
                {pageConfig?.heroSubtitle || 'Explore and buy genuine robotics, AI hardware, smart devices, development boards and electronics from trusted global brands — now easily accessible in India.'}
              </p>

              {/* Large Search Box with Violet Search Button & Interactive Auto-Suggest Dropdown */}
              <div ref={searchContainerRef} className="relative max-w-xl z-30">
                <div className={`flex items-center rounded-2xl border p-1.5 shadow-xl transition-all backdrop-blur-md ${
                  isDark
                    ? 'bg-zinc-900/90 border-zinc-700/80 focus-within:border-violet-500 text-white'
                    : 'bg-white/95 border-slate-300 focus-within:border-violet-600 text-slate-900 shadow-slate-200/50'
                }`}>
                  <Search size={18} className={isDark ? "text-slate-400 ml-3 shrink-0" : "text-slate-500 ml-3 shrink-0"} />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchFocused(true);
                    }}
                    placeholder={pageConfig?.searchPlaceholder || 'Search products, brands, or categories...'}
                    className={`w-full bg-transparent px-3 py-2 text-sm focus:outline-none placeholder-slate-400 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-lg text-slate-400 hover:text-white mr-1"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchFocused(false);
                      const el = document.getElementById('catalog-grid');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-md shrink-0"
                  >
                    Search
                  </button>
                </div>

                {/* Auto-Suggest Dropdown Menu (Categories & Products) */}
                <AnimatePresence>
                  {isSearchFocused && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className={`absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-2xl p-3 space-y-3 ${
                        isDark
                          ? 'bg-[#0b0d14]/98 border-zinc-700/80 shadow-violet-950/50 text-slate-100'
                          : 'bg-white/98 border-slate-300 shadow-slate-300/60 text-zinc-900'
                      }`}
                    >
                      {/* 1. Category Suggestions */}
                      {matchedCategories.length > 0 ? (
                        <div>
                          <div className="flex items-center justify-between px-2 py-1 mb-1.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">
                              Suggested Categories ({matchedCategories.length})
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">Click to select category</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {matchedCategories.map((cat) => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  setActiveCategory(cat.id);
                                  setIsSearchFocused(false);
                                  const el = document.getElementById('catalog-grid');
                                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all group ${
                                  activeCategory === cat.id
                                    ? 'bg-violet-600/20 border-violet-500'
                                    : isDark
                                    ? 'bg-zinc-900/70 border-zinc-800/80 hover:border-violet-500/50 hover:bg-zinc-800/90'
                                    : 'bg-slate-50 border-slate-200/90 hover:border-violet-300 hover:bg-violet-50/60'
                                }`}
                              >
                                <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-white p-1 flex items-center justify-center border border-slate-200 shadow-sm">
                                  <img
                                    src={cat.image}
                                    alt={cat.label}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="font-bold text-xs group-hover:text-violet-400 transition-colors flex items-center justify-between">
                                    <span className="truncate">{cat.label}</span>
                                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-violet-600/20 text-violet-300 shrink-0 ml-1">
                                      Category
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{cat.subtitle}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-2 text-xs text-slate-400 text-center">No categories matching "{searchQuery}"</div>
                      )}

                      {/* 2. Product Suggestions */}
                      {matchedProductsSuggestions.length > 0 && (
                        <div className="pt-2 border-t border-zinc-800/60">
                          <div className="px-2 py-1 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                              Matching Products
                            </span>
                          </div>

                          <div className="space-y-1">
                            {matchedProductsSuggestions.map((p) => (
                              <Link
                                key={p._id}
                                to={`/emarket/product/${p.slug}`}
                                onClick={() => setIsSearchFocused(false)}
                                className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                                  isDark ? 'hover:bg-zinc-900 text-white' : 'hover:bg-slate-100 text-slate-900'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 bg-white p-1 border border-slate-200 flex items-center justify-center shadow-sm">
                                    <img src={p.image} alt={p.title} className="w-full h-full object-contain mix-blend-multiply" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold truncate">{p.title}</div>
                                    <div className="text-[10px] text-slate-400 truncate">{p.brand} · {p.category}</div>
                                  </div>
                                </div>
                                <div className="text-xs font-mono font-bold text-emerald-400 shrink-0 ml-2">
                                  {formatInrPrice(p.price)}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Trending Quick Chips */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs max-w-xl">
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Trending:</span>
                {trendingKeywords.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className={`px-2.5 py-1 rounded-lg border transition-colors text-xs font-medium backdrop-blur-sm ${
                      isDark 
                        ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-violet-500/50 hover:text-white' 
                        : 'bg-white border-slate-200 text-slate-700 hover:border-violet-400 hover:text-violet-700 shadow-sm'
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>

              {/* 4 Value Proposition Pills & Navigation */}
              <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t ${
                isDark ? 'border-slate-800/80' : 'border-slate-200'
              }`}>
                {valueProps.slice(0, 4).map((vp, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    {idx === 0 && <ShieldCheck size={16} className="text-emerald-500 shrink-0" />}
                    {idx === 1 && <Globe2 size={16} className="text-cyan-500 shrink-0" />}
                    {idx === 2 && <Award size={16} className="text-amber-500 shrink-0" />}
                    {idx === 3 && <Zap size={16} className="text-violet-500 shrink-0" />}
                    <div>
                      <div className={`font-bold leading-tight text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{vp.label}</div>
                      <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{vp.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Floating Product Details */}
            <motion.div
              key={currentHero.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center lg:text-right space-y-4 pt-2 lg:pt-0"
            >
              <div>
                <h2 className={`font-display font-black text-3xl sm:text-4xl tracking-tight ${
                  isDark 
                    ? 'text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]' 
                    : 'text-slate-900 drop-shadow-sm'
                }`}>
                  {currentHero.title}
                </h2>
                <p className={`text-sm sm:text-base font-semibold mt-0.5 ${
                  isDark 
                    ? 'text-slate-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]' 
                    : 'text-slate-600'
                }`}>
                  {currentHero.subtitle}
                </p>
              </div>

              {/* Specs List */}
              <div className={`space-y-2 text-xs sm:text-sm text-left inline-block ${
                isDark 
                  ? 'text-slate-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]' 
                  : 'text-slate-700'
              }`}>
                {currentHero.specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-base shrink-0">{spec.icon}</span>
                    <span className="font-medium tracking-wide text-xs sm:text-sm">{spec.text}</span>
                  </div>
                ))}
              </div>

              {/* Price Tag */}
              <div className="text-3xl sm:text-4xl font-black text-emerald-500 dark:text-[#00e599] font-mono drop-shadow-sm">
                {formatInrPrice(currentHero.price)}
              </div>

              {/* Action Button */}
              <div className="pt-1 flex items-center gap-3">
                <Link
                  to={`/emarket/product/${currentHero.slug}`}
                  className={`px-7 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 shadow-xl hover:scale-105 ${
                    isDark
                      ? 'bg-white text-zinc-950 hover:bg-slate-200'
                      : 'bg-violet-600 text-white hover:bg-violet-700'
                  }`}
                >
                  View Details <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 2. Visual Category Strip (Popular Categories - Single Line Grid) ────── */}
      <section className={`py-6 border-b overflow-hidden ${isDark ? 'border-slate-800/40 bg-[#06080d]' : 'border-slate-200/80 bg-white'}`}>
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className={`font-display text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Popular Categories
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Explore top technology categories.
              </p>
            </div>
            {activeCategory !== 'all' && (
              <button
                onClick={() => setActiveCategory('all')}
                className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline self-start sm:self-auto"
              >
                Clear Filter ({VISUAL_CATEGORIES.find((c) => c.id === activeCategory)?.label || activeCategory})
              </button>
            )}
          </div>

          {/* 4-Card Single Line Responsive Grid (Flow: Everyday AI -> Smart Home -> Robotics -> AI Hardware & Dev Boards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visualCategories.map((cat, idx) => {
              const isSelected = activeCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => {
                    setActiveCategory(isSelected ? 'all' : cat.id);
                    const el = document.getElementById('catalog-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left w-full overflow-hidden ${
                    isSelected
                      ? isDark
                        ? 'bg-gradient-to-br from-violet-950/70 via-indigo-950/50 to-zinc-900 border-violet-500 shadow-xl shadow-violet-950/50 ring-2 ring-violet-500/80'
                        : 'bg-gradient-to-br from-violet-100 via-indigo-50 to-white border-violet-500 shadow-md shadow-violet-200 ring-2 ring-violet-400'
                      : isDark
                      ? 'bg-gradient-to-br from-[#121422] via-[#0e0f1a] to-[#0a0b12] border-zinc-800/90 hover:border-violet-500/60 hover:shadow-xl hover:shadow-violet-950/30'
                      : 'bg-white border-slate-200 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-100'
                  }`}
                >
                  {/* Glowing Ambient Backdrop Orb on Hover */}
                  <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-violet-600/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

                  {/* Compact Hardware Photography Canvas */}
                  <div className={`w-20 h-20 sm:w-22 sm:h-22 flex items-center justify-center shrink-0 overflow-hidden p-2 rounded-xl border transition-all duration-300 ${
                    isDark
                      ? 'bg-gradient-to-b from-[#1a1c2e] to-[#121320] border-zinc-800/80 group-hover:border-violet-500/40'
                      : 'bg-white border-slate-200'
                  }`}>
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="max-h-16 w-auto object-contain filter drop-shadow-md transition-transform duration-500 ease-out group-hover:scale-110 mix-blend-multiply dark:mix-blend-screen"
                    />
                  </div>

                  {/* Title & Subtext */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className={`text-sm sm:text-base font-black truncate leading-tight transition-colors ${
                        isSelected 
                          ? 'text-violet-400' 
                          : isDark ? 'text-white group-hover:text-violet-300' : 'text-zinc-900 group-hover:text-violet-700'
                      }`}>
                        {cat.label}
                      </h3>

                      {/* Circle Arrow Icon */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                        isSelected
                          ? 'bg-violet-600 border-violet-500 text-white'
                          : isDark
                          ? 'bg-zinc-800/80 border-zinc-700/60 text-slate-400 group-hover:bg-violet-600 group-hover:border-violet-500 group-hover:text-white group-hover:scale-110'
                          : 'bg-slate-100 border-slate-300 text-slate-600 group-hover:bg-violet-600 group-hover:border-violet-500 group-hover:text-white group-hover:scale-110'
                      }`}>
                        <ArrowRight size={12} />
                      </div>
                    </div>

                    <p className={`text-xs font-normal leading-tight line-clamp-2 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {cat.subtitle}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>




      {/* ── 5. Main Catalog Grid (Grouped by Category for Clear Separation) ────── */}
      <section id="catalog-grid" className={`py-8 sm:py-10 ${isDark ? 'bg-[#08080b]' : 'bg-[#f7f8fc]'}`}>
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {(activeCategory !== 'all' || selectedBrand !== 'all' || searchQuery) && (
            <div className="flex justify-between items-center mb-6">
              <h2 className={`font-display text-xl font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {activeCategory}
              </h2>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSelectedBrand('all');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
              >
                Reset all filters
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProducts.length > 0 ? (
            activeCategory === 'all' && !searchQuery && selectedBrand === 'all' ? (
              /* CATEGORY-SEPARATED VIEW WHEN ALL IS SELECTED */
              <div className="space-y-10">
                {[
                  { name: 'Everyday AI', icon: '🕶️', desc: 'Smart Devices, AI Wearables & Spatial Computing' },
                  { name: 'Smart Home', icon: '🏠', desc: 'IoT Hubs, Smart Automation & Ecosystem Controllers' },
                  { name: 'Robotics', label: 'Robotic Innovation', icon: '🤖', desc: 'Quadrupeds, Humanoids, Robotic Arms & Drones' },
                  { name: 'AI Hardware & Development Boards', icon: '⚡', desc: 'Edge AI Accelerators, Neural Compute & Single Board Computers', isMixed: true },
                  { name: 'Electronics & Components', icon: '🔌', desc: 'Sensors, Modules & Hardware Components' },
                ].map((catGroup) => {
                  const groupProducts = filteredProducts.filter((p) => {
                    if (catGroup.isMixed) {
                      return (
                        p.category?.toLowerCase() === 'ai hardware' ||
                        p.category?.toLowerCase() === 'development boards' ||
                        p.category?.toLowerCase() === 'ai hardware & development boards'
                      );
                    }
                    return p.category?.toLowerCase() === catGroup.name.toLowerCase();
                  });
                  if (groupProducts.length === 0) return null;
                  return (
                    <div key={catGroup.name} className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{catGroup.icon}</span>
                          <div>
                            <h3 className={`font-display text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {catGroup.label || catGroup.name}
                            </h3>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{catGroup.desc}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveCategory(catGroup.name)}
                          className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
                        >
                          View all {catGroup.label || catGroup.name} ({groupProducts.length}) <ArrowRight size={14} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {groupProducts.map((p) => (
                          <MarketProductCard key={p._id} product={p} isDark={isDark} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* SINGLE GRID FOR FILTERED VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((p) => (
                  <MarketProductCard key={p._id} product={p} isDark={isDark} />
                ))}
              </div>
            )
          ) : (
            <div className={`text-center py-16 rounded-2xl border p-8 ${
              isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-slate-200 bg-white'
            }`}>
              <Box size={40} className="mx-auto text-slate-400 mb-3 opacity-50" />
              <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                No matching hardware products
              </h3>
              <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Try clearing filters or search terms.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSelectedBrand('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-700 transition-colors"
              >
                View All Products
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ── 6. Featured Products Showcase ──────────────────────────────────────── */}
      <section className={`py-8 sm:py-10 border-b ${isDark ? 'border-slate-800/40' : 'border-slate-200/80 bg-slate-50/50'}`}>
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className={`font-display text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {pageConfig?.featuredTitle || 'Featured Products'}
              </h2>
              <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {pageConfig?.featuredSubtitle || "Handpicked innovations from the world's leading technology brands."}
              </p>
            </div>

            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedBrand('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          {/* 5-Column Responsive Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {featuredProducts.slice(0, 5).map((p) => (
              <MarketProductCard key={p._id} product={p} isDark={isDark} />
            ))}
          </div>

        </div>
      </section>

      {/* ── 7. Trusted Global Brands (Interactive Logo Slider with Hover Pause) ── */}
      <section className={`py-12 border-t overflow-hidden select-none ${isDark ? 'border-slate-800/40 bg-zinc-950/40' : 'border-slate-200/80 bg-slate-50/80'}`}>
        <style>{`
          @keyframes brandMarqueeScroll {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          .brand-marquee-track {
            display: flex;
            width: max-content;
            animation: brandMarqueeScroll 32s linear infinite;
            will-change: transform;
          }
          .brand-marquee-wrapper:hover .brand-marquee-track,
          .brand-marquee-track:hover {
            animation-play-state: paused !important;
          }
        `}</style>

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
          <h3 className={`font-display text-xl sm:text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Trusted Global Brands
          </h3>
          <p className={`text-xs max-w-lg mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Authentic products from verified manufacturers and official partners.
          </p>
        </div>

        {/* Outer Slider Container with Hover Pause */}
        <div
          onMouseEnter={() => setIsBrandHovered(true)}
          onMouseLeave={() => setIsBrandHovered(false)}
          className="brand-marquee-wrapper relative w-full overflow-hidden py-3"
        >
          {/* Left Edge Gradient Fade Mask */}
          <div
            className={`pointer-events-none absolute left-0 inset-y-0 w-16 sm:w-28 md:w-36 z-20 bg-gradient-to-r ${
              isDark ? 'from-[#08080b] via-[#08080b]/90 to-transparent' : 'from-[#f7f8fc] via-[#f7f8fc]/90 to-transparent'
            }`}
          />

          {/* Right Edge Gradient Fade Mask */}
          <div
            className={`pointer-events-none absolute right-0 inset-y-0 w-16 sm:w-28 md:w-36 z-20 bg-gradient-to-l ${
              isDark ? 'from-[#08080b] via-[#08080b]/90 to-transparent' : 'from-[#f7f8fc] via-[#f7f8fc]/90 to-transparent'
            }`}
          />

          {/* Infinite Marquee Track */}
          <div
            style={{
              animationPlayState: isBrandHovered ? 'paused' : 'running',
              animationDirection: brandScrollDirection,
            }}
            className="brand-marquee-track items-center gap-5 sm:gap-7 px-4"
          >
            {brandSliderItems.map((b, idx) => {
              const isSelected = selectedBrand.toLowerCase() === b.query.toLowerCase();
              return (
                <button
                  key={`${b.name}-${idx}`}
                  type="button"
                  onClick={() => {
                    setSelectedBrand(isSelected ? 'all' : b.query);
                    const el = document.getElementById('catalog-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`group/item shrink-0 flex items-center gap-3 px-5 sm:px-6 py-3 rounded-2xl transition-all duration-300 ${
                    isSelected
                      ? isDark
                        ? 'bg-violet-950/60 shadow-lg shadow-violet-950/30 ring-2 ring-violet-500'
                        : 'bg-violet-50 shadow-lg shadow-violet-200/40 ring-2 ring-violet-500'
                      : isDark
                      ? 'bg-transparent hover:bg-zinc-900/50 hover:scale-105'
                      : 'bg-transparent hover:bg-white hover:shadow-md hover:scale-105'
                  }`}
                  title={`Filter products by ${b.name}`}
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/item:scale-110">
                    {getBrandLogo(b.name)}
                  </div>
                  <span
                    className={`font-bold text-xs sm:text-sm tracking-wide transition-colors ${
                      isSelected
                        ? isDark ? 'text-violet-300' : 'text-violet-700'
                        : isDark
                        ? 'text-slate-300 group-hover/item:text-white'
                        : 'text-zinc-700 group-hover/item:text-violet-700'
                    }`}
                  >
                    {b.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 8. Trust & Verification Badges Strip ───────────────────────────────── */}
      <section className={`py-10 border-t ${isDark ? 'border-slate-800/40 bg-[#060608]' : 'border-slate-200/80 bg-slate-50'}`}>
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-start gap-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-violet-600/10 border border-violet-500/20 text-violet-400' : 'bg-violet-50 border border-violet-200 text-violet-600'}`}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>100% Authentic Products</h4>
                <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Sourced from verified manufacturers and trusted distributors.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-cyan-600/10 border border-cyan-500/20 text-cyan-400' : 'bg-cyan-50 border border-cyan-200 text-cyan-600'}`}>
                <Lock size={20} />
              </div>
              <div>
                <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>Secure &amp; Transparent</h4>
                <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Safe links to official sources and direct stores only.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-amber-600/10 border border-amber-500/20 text-amber-400' : 'bg-amber-50 border border-amber-200 text-amber-600'}`}>
                <Users size={20} />
              </div>
              <div>
                <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>Built for Innovators</h4>
                <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  From hobbyists to professionals, we support your vision.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-emerald-600/10 border border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border border-emerald-200 text-emerald-600'}`}>
                <Globe2 size={20} />
              </div>
              <div>
                <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>India Focused</h4>
                <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Curated for the Indian maker, research and developer community.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
