import { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  Code2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  ArrowRight,
  Eye,
  Maximize2,
  X,
  Globe,
  Layers,
  Clock,
} from 'lucide-react';
import api from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { productLogo, productImage, productAllImages, categoryImage, ensureAbsoluteUrl, getCategoryGradient } from '../../utils/productImage';

export const isProductLive = (p) => {
  if (!p) return false;
  if (p.status === 'in-development') return false;
  if (p.status === 'live') return true;
  return Boolean(p.url && !/in-development/i.test(p.status || ''));
};

// ─── Image Lightbox Modal ───────────────────────────────────────────────────

function ImageLightbox({ images, currentIndex, onNavigate, onClose }) {
  // Lock body scroll while lightbox is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && images.length > 1) {
        onNavigate((currentIndex - 1 + images.length) % images.length);
      }
      if (e.key === 'ArrowRight' && images.length > 1) {
        onNavigate((currentIndex + 1) % images.length);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, images.length, onNavigate, onClose]);

  const currentSrc = images[currentIndex];
  if (!currentSrc) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image Preview Lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="relative max-w-[1560px] w-full flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/95 border border-white/10 text-xs text-white shadow-lg">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wide">Preview</span>
            {images.length > 1 && (
              <span className="text-slate-400 font-mono">
                ({currentIndex + 1} of {images.length})
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close image preview"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Image Stage with Nav Arrows */}
        <div className="relative w-full max-h-[88vh] flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 shadow-2xl">
          <img
            src={currentSrc}
            alt="Product Preview Fullscreen"
            className="max-h-[85vh] w-auto max-w-full object-contain"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/85 border border-white/15 text-white flex items-center justify-center hover:bg-violet-600 hover:border-violet-500 transition-all shadow-lg"
                title="Previous Image (←)"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => onNavigate((currentIndex + 1) % images.length)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/85 border border-white/15 text-white flex items-center justify-center hover:bg-violet-600 hover:border-violet-500 transition-all shadow-lg"
                title="Next Image (→)"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductLogoIcon({ product, size = 'sm', className = '' }) {
  const [failed, setFailed] = useState(false);
  const logo = productLogo(product);
  const gradient = getCategoryGradient(product?.category || '');

  useEffect(() => {
    setFailed(false);
  }, [product?._id, logo]);

  const sizeClasses = {
    xs: 'w-6 h-6 rounded-[8px] text-[10px]',
    sm: 'w-8 h-8 rounded-[10px] text-xs',
    md: 'w-10 h-10 rounded-[12px] text-sm',
    lg: 'w-12 h-12 rounded-[15px] text-base',
    xl: 'w-16 h-16 rounded-[20px] text-xl',
  };
  const sizeClass = sizeClasses[size] || sizeClasses.sm;

  if (logo && !failed) {
    return (
      <div className={`relative shrink-0 aspect-square ${sizeClass} flex items-center justify-center overflow-hidden select-none transition-transform duration-200 group-hover:scale-105 ${className}`}>
        <img
          src={logo}
          alt={product?.title || ''}
          className="w-full h-full max-w-full max-h-full aspect-square object-contain pointer-events-none drop-shadow-sm"
          onError={() => setFailed(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`relative shrink-0 aspect-square ${sizeClass} bg-gradient-to-br ${gradient} shadow-md flex items-center justify-center font-bold uppercase select-none text-white overflow-hidden transition-transform duration-200 group-hover:scale-105 ${className}`}>
      <span className="drop-shadow-sm">{product?.title?.slice(0, 2) || 'PR'}</span>
    </div>
  );
}

// ─── Product Logo Coin Component (Clean & Borderless) ───────────────────────

function ProductLogoTile({ product, isSelected, onClick, isDark }) {
  const [failed, setFailed] = useState(false);
  const logo = productLogo(product);

  useEffect(() => {
    setFailed(false);
  }, [product?._id, logo]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.currentTarget.blur();
        onClick?.();
      }}
      aria-label={`Select ${product.title}`}
      title={product.title}
      className={`group/tile relative shrink-0 aspect-square w-[54px] h-[54px] sm:w-[64px] sm:h-[64px] md:w-[74px] md:h-[74px] p-2 rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer flex items-center justify-center select-none ${
        isSelected
          ? isDark
            ? 'bg-white/10 shadow-[0_0_20px_rgba(139,92,246,0.35)] scale-110 -translate-y-0.5 z-10'
            : 'bg-slate-200/80 shadow-[0_0_18px_rgba(139,92,246,0.25)] scale-110 -translate-y-0.5 z-10'
          : isDark
            ? 'hover:bg-white/[0.06] hover:scale-105'
            : 'hover:bg-slate-100/80 hover:scale-105'
      }`}
    >
      {logo && !failed ? (
        <img
          src={logo}
          alt={product.title}
          onError={() => setFailed(true)}
          className="w-full h-full max-w-full max-h-full aspect-square object-contain transition-transform duration-300 group-hover/tile:scale-110 pointer-events-none drop-shadow-md"
          loading="lazy"
        />
      ) : (
        <div className={`w-full h-full rounded-lg bg-gradient-to-br ${getCategoryGradient(product?.category)} flex items-center justify-center text-white font-bold text-xs uppercase shadow-xs`}>
          {product.title?.slice(0, 2) || 'PR'}
        </div>
      )}
    </button>
  );
}

// ─── Automatic Sliding Logo Marquee Component ───────────────────────────────

function ProductLogoMarquee({ products, selectedProductId, onSelectProduct, isDark }) {
  const [isHovered, setIsHovered] = useState(false);

  // Include all products with smooth loop
  const validProducts = useMemo(() => {
    return products && products.length > 0 ? products : [];
  }, [products]);

  if (validProducts.length === 0) return null;

  // Duplicate sequence 3 times to create a 100% seamless, mathematically infinite loop
  const marqueeItems = [...validProducts, ...validProducts, ...validProducts];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative marquee-wrapper w-full max-w-full overflow-hidden py-1 select-none"
    >
      {/* CSS Keyframes for infinite marquee */}
      <style>{`
        @keyframes worknaiLogoMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333333%, 0, 0);
          }
        }
        .animate-logo-track {
          display: flex;
          width: max-content;
          animation: worknaiLogoMarquee 48s linear infinite;
          will-change: transform;
        }
        .marquee-wrapper:hover .animate-logo-track,
        .animate-logo-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Left Edge Fade Mask */}
      <div
        className={`pointer-events-none absolute left-0 inset-y-0 w-12 sm:w-24 md:w-40 lg:w-56 z-20 bg-gradient-to-r ${
          isDark ? 'from-[#07070D] via-[#07070D]/90 to-transparent' : 'from-slate-50 via-slate-50/90 to-transparent'
        }`}
      />

      {/* Right Edge Fade Mask */}
      <div
        className={`pointer-events-none absolute right-0 inset-y-0 w-12 sm:w-24 md:w-40 lg:w-56 z-20 bg-gradient-to-l ${
          isDark ? 'from-[#07070D] via-[#07070D]/90 to-transparent' : 'from-slate-50 via-slate-50/90 to-transparent'
        }`}
      />

      {/* Continuous Linear Marquee Track */}
      <div
        style={{ animationPlayState: isHovered ? 'paused' : 'running' }}
        className="animate-logo-track gap-3.5 sm:gap-4 md:gap-5 py-2.5"
      >
        {marqueeItems.map((p, idx) => {
          const isSelected = p._id === selectedProductId;
          return (
            <ProductLogoTile
              key={`${p._id}-${idx}`}
              product={p}
              isSelected={isSelected}
              onClick={() => onSelectProduct(p, true)}
              isDark={isDark}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Image-Dominant Product Card (~70% Image, 30% Clean Info) ───────────────

function VisualProductCard({ p, onSelectSpotlight, isSelected, isDark }) {
  const displayImg = productImage(p);
  const shortDesc = p.tagline || (p.description ? p.description.split('.')[0] + '.' : '');
  const isLive = isProductLive(p);

  return (
    <div
      className={`group rounded-2xl overflow-hidden flex flex-col transition-all duration-300 border ${
        isSelected
          ? isDark
            ? 'bg-slate-900/90 border-violet-500 ring-2 ring-violet-500/40 shadow-xl shadow-violet-950/50 -translate-y-1'
            : 'bg-white border-violet-500 ring-2 ring-violet-400/40 shadow-xl shadow-slate-300/40 -translate-y-1'
          : isDark
            ? 'bg-slate-900/40 border-white/10 hover:border-violet-400/40 hover:-translate-y-1 hover:bg-slate-900/70 hover:shadow-xl'
            : 'bg-white border-slate-200 hover:border-violet-400/60 hover:-translate-y-1 hover:shadow-xl shadow-xs'
      }`}
    >
      {/* Visual Container (~70% Area: Image-First, links to Case Study) */}
      <Link
        to={`/products/${p.slug}`}
        className="relative w-full aspect-[16/10] overflow-hidden bg-slate-950 cursor-pointer group/img block"
        aria-label={`View ${p.title} case study`}
      >
        <img
          src={displayImg}
          alt={p.title}
          className="w-full h-full object-cover group-hover/img:scale-[1.03] transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Subtle Ambient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />

        {/* Floating Mini Logo Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md border border-white/10 p-1 pr-2.5 rounded-xl shadow-md">
          <ProductLogoIcon product={p} size="xs" />
          <span className="text-xs font-semibold text-white truncate max-w-[120px]">
            {p.title}
          </span>
        </div>

        {/* Category Pill / Live Indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {isLive ? (
            <span className="text-[9px] font-bold bg-emerald-500/15 backdrop-blur-md text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          ) : (
            <span className="text-[9px] font-bold bg-amber-500/15 backdrop-blur-md text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              IN DEV
            </span>
          )}
          {p.category && (
            <span className="text-[10px] font-medium bg-black/60 backdrop-blur-md text-slate-300 border border-white/10 px-2 py-0.5 rounded-full">
              {p.category}
            </span>
          )}
        </div>

        {/* Hover Case Study Indication */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 bg-black/35 backdrop-blur-[1px]">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-slate-900 text-xs font-semibold shadow-lg">
            <span>Explore Case Study</span> <ArrowUpRight size={12} />
          </span>
        </div>
      </Link>

      {/* Card Information (~30% Area: Spacious & Premium Portfolio Feel) */}
      <div className="p-5 sm:p-5.5 flex flex-col flex-1 justify-between gap-3.5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <Link
              to={`/products/${p.slug}`}
              className={`font-display text-base sm:text-[17px] font-bold tracking-tight truncate transition-colors ${
                isDark ? 'text-white group-hover:text-violet-300' : 'text-slate-900 group-hover:text-violet-600'
              }`}
            >
              {p.title}
            </Link>
            {p.category && (
              <span className={`text-[10.5px] font-medium px-2.5 py-0.5 rounded-full border shrink-0 ${
                isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}>
                {p.category}
              </span>
            )}
          </div>
          {shortDesc && (
            <p className={`text-xs sm:text-[13px] leading-relaxed line-clamp-2 mt-2 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {shortDesc}
            </p>
          )}
        </div>

        {/* Primary Action Trigger: Spotlight View */}
        <div className={`pt-3.5 border-t mt-1 ${
          isDark ? 'border-white/5' : 'border-slate-100'
        }`}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelectSpotlight(p);
            }}
            className={`text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer py-0.5 ${
              isDark ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-800'
            }`}
          >
            <span>Spotlight View</span> <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Hero Information Panel Component (Tall Full-Height Dedicated Column) ───

function ProductInfoPanel({ product, isDark, onStepSpotlight }) {
  if (!product) return null;
  const isLive = isProductLive(product);

  // Extract up to 3-4 real capabilities from existing product features or benefits
  const rawCapabilities = product.features?.length
    ? product.features
    : product.benefits || [];
  const capabilities = rawCapabilities.slice(0, 4).map((f) => {
    const trimmed = String(f).replace(/[.,;]+$/, '').trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  });

  const categoryLabel = product.category
    ? (product.category.toLowerCase().includes('platform')
        ? product.category
        : `${product.category} Platform`)
    : 'Digital Platform';

  return (
    <div
      className={`h-full flex flex-col justify-between p-4 sm:p-5 lg:p-5 rounded-2xl border transition-all ${
        isDark
          ? 'bg-slate-950/85 border-white/10 text-white shadow-2xl shadow-violet-950/25'
          : 'bg-white border-slate-200 text-slate-900 shadow-xl'
      }`}
    >
      <div>
        {/* 1. TOP CONTROLS & Status Bar */}
        <div className="flex items-center justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.category && (
              <span
                className={`text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
                    : 'bg-violet-50 text-violet-700 border-violet-200'
                }`}
              >
                {product.category}
              </span>
            )}
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 text-[9.5px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live System
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[9.5px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Under Development
              </span>
            )}
          </div>

          {onStepSpotlight && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onStepSpotlight(-1)}
                title="Previous spotlight product"
                aria-label="Previous spotlight product"
                className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  isDark
                    ? 'border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
                    : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900'
                }`}
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => onStepSpotlight(1)}
                title="Next spotlight product"
                aria-label="Next spotlight product"
                className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  isDark
                    ? 'border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
                    : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900'
                }`}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* 2. PRODUCT HEADER: Logo, Name, Category subtitle */}
        <div className="flex items-center gap-3 mb-2.5">
          <ProductLogoIcon product={product} size="md" />
          <div className="min-w-0">
            <h2
              className={`font-display text-lg sm:text-xl font-bold tracking-tight truncate ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {product.title}
            </h2>
            <p
              className={`text-[11.5px] font-medium truncate ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {categoryLabel}
            </p>
          </div>
        </div>

        {/* 3. DESCRIPTION */}
        <p
          className={`text-[12px] sm:text-[12.5px] leading-relaxed line-clamp-2 mb-3 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {product.tagline ||
            (product.description
              ? product.description.split('.')[0] + '.'
              : 'Enterprise digital platform engineered for high performance.')}
        </p>

        {/* 4. KEY CAPABILITIES */}
        {capabilities.length > 0 && (
          <div className="mb-3">
            <h4
              className={`text-[10px] font-bold tracking-wider uppercase mb-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Key Capabilities
            </h4>
            <div className="flex flex-col gap-1.5">
              {capabilities.map((cap, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    isDark
                      ? 'border-white/10 bg-white/[0.03] text-slate-200'
                      : 'border-slate-200 bg-slate-50 text-slate-800'
                  }`}
                >
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span className="truncate">{cap}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 7. CTA AREA */}
      <div className="flex flex-col gap-2 pt-3 mt-auto">
        <Link
          to={`/products/${product.slug}`}
          className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-950/40 hover:shadow-violet-900/60 cursor-pointer"
        >
          <span>Explore Case Study</span>
          <ArrowRight size={14} className="shrink-0" />
        </Link>

        {isLive && product.url ? (
          <a
            href={ensureAbsoluteUrl(product.url)}
            target="_blank"
            rel="noopener noreferrer"
            title={`Visit ${product.title} live site`}
            aria-label={`Visit ${product.title} live site`}
            className={`w-full py-2 px-4 rounded-xl border text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isDark
                ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white shadow-xs'
                : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-xs'
            }`}
          >
            <span>Visit Live Site</span>
            <ArrowUpRight size={14} className="shrink-0" />
          </a>
        ) : (
          <div
            className={`w-full py-2 px-4 rounded-xl border text-xs sm:text-[12.5px] font-medium flex items-center justify-center gap-1.5 transition-all select-none ${
              isDark
                ? 'border-amber-500/20 bg-amber-500/5 text-amber-300/80'
                : 'border-amber-300 bg-amber-50 text-amber-800'
            }`}
          >
            <Clock size={12} className="text-amber-400" />
            <span>Under Active Development</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Products Component ────────────────────────────────────────────────

const POPULAR_ORDER_MATCHERS = [
  (p) => /pg\s*info/i.test(p.title) || /pginfo/i.test(p.url || ''),
  (p) => /aitourism/i.test(p.title) || /aitourism/i.test(p.url || ''),
  (p) => (/online\s*go/i.test(p.title) || /onlinego\.in/i.test(p.url || '')) && !/logistics/i.test(p.title) && !/logistics/i.test(p.url || ''),
  (p) => /logistics/i.test(p.title) || /onlinegologistics/i.test(p.url || ''),
];

function sortPopularFirst(list = []) {
  if (!Array.isArray(list) || list.length === 0) return [];
  const popular = [];
  const used = new Set();

  POPULAR_ORDER_MATCHERS.forEach((m) => {
    const item = list.find((p) => !used.has(p._id) && m(p));
    if (item) {
      popular.push(item);
      used.add(item._id);
    }
  });

  const remaining = list.filter((p) => !used.has(p._id));
  return [...popular, ...remaining];
}

export default function Products() {
  const { isDark } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Pagination & Filtering for catalog grid
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const itemsPerPage = 6;

  const spotlightRef = useRef(null);
  const catalogRef = useRef(null);

  useEffect(() => {
    api
      .get('/products')
      .then((r) => {
        const raw = r.data.data || [];
        const sorted = sortPopularFirst(raw);
        setProducts(sorted);
        if (sorted.length > 0) {
          setSelectedProductId(sorted[0]._id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const selectedProduct =
    products.find((p) => p._id === selectedProductId) || products[0] || null;

  // Track images that fail to load so they are cleanly removed from views
  const [failedImages, setFailedImages] = useState({});

  const handleImageError = (productId, url) => {
    if (!productId || !url) return;
    setFailedImages((prev) => {
      const set = prev[productId] ? new Set(prev[productId]) : new Set();
      set.add(url);
      return { ...prev, [productId]: set };
    });
  };

  // Visual images for the active product (automatically filtered to remove broken URLs)
  const currentImagesRaw = selectedProduct ? productAllImages(selectedProduct) : [];
  const currentFailed = failedImages[selectedProduct?._id] || new Set();
  const filteredImages = currentImagesRaw.filter((u) => !currentFailed.has(u));
  const currentImages = filteredImages.length > 0
    ? filteredImages
    : [categoryImage(selectedProduct, 'primary', 1600, 1000)];

  const safeImageIndex = activeImageIndex < currentImages.length ? activeImageIndex : 0;
  const activeImage =
    currentImages[safeImageIndex] ||
    currentImages[0] ||
    (selectedProduct ? productImage(selectedProduct) : '');

  // Views auto-loop state & refs
  const [isHoveredViews, setIsHoveredViews] = useState(false);
  const [showViews, setShowViews] = useState(false);
  const viewsTrackRef = useRef(null);

  // Auto-loop through Spotlight views in a continuous cycle
  useEffect(() => {
    if (currentImages.length <= 1 || isHoveredViews || lightboxIndex !== null) return;
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % currentImages.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [selectedProductId, currentImages.length, isHoveredViews, lightboxIndex]);

  // Keep active thumbnail centered in Views strip
  useEffect(() => {
    if (viewsTrackRef.current) {
      const thumb = document.getElementById(`view-thumb-${safeImageIndex}`);
      if (thumb) {
        const track = viewsTrackRef.current;
        const trackRect = track.getBoundingClientRect();
        const thumbRect = thumb.getBoundingClientRect();
        const relLeft = thumbRect.left - trackRect.left;
        const targetLeft = track.scrollLeft + relLeft - (track.clientWidth / 2) + (thumbRect.width / 2);
        track.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
      }
    }
  }, [safeImageIndex]);

  // Select a product, scroll smoothly into spotlight view if requested
  const handleSelectProduct = (p, shouldScrollToSpotlight = false) => {
    if (!p) return;
    setSelectedProductId(p._id);
    setActiveImageIndex(0);
    setIsHoveredViews(false); // Reset hover lock so new website immediately cycles
    if (shouldScrollToSpotlight && spotlightRef.current) {
      const navOffset = 70;
      const rect = spotlightRef.current.getBoundingClientRect();
      const targetY = window.pageYOffset + rect.top - navOffset;
      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth',
      });
    }
  };

  // Step Spotlight to previous / next product
  const handleStepSpotlight = (direction) => {
    if (!products.length || !selectedProduct) return;
    const currentIndex = products.findIndex((p) => p._id === selectedProduct._id);
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = products.length - 1;
    if (nextIndex >= products.length) nextIndex = 0;
    handleSelectProduct(products[nextIndex]);
  };

  // Dynamic categories & status filter tabs
  const categories = [
    'All',
    'Live Systems',
    'In Development',
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];

  // Category & status filtered products
  const filteredCatalogProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    if (selectedCategory === 'Live Systems') return products.filter(isProductLive);
    if (selectedCategory === 'In Development') return products.filter((p) => !isProductLive(p));
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  // Smooth pagination page change (in place, without scrolling window)
  const handlePageChange = (newPage) => {
    let target = newPage;
    if (target < 1) target = totalPages;
    if (target > totalPages) target = 1;
    if (target === currentPage) return;
    setCurrentPage(target);
  };

  const handleCategoryFilter = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredCatalogProducts.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGridProducts = filteredCatalogProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <section className={`min-h-screen pt-2 md:pt-4 pb-14 overflow-x-hidden transition-colors duration-200 ${
      isDark ? 'bg-[#07070D] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* ════════════════════════════════════════════════════════════════
          1. COMPACT PAGE HEADER (Contained & Tight)
          ════════════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-[1640px] 2xl:max-w-[1760px] px-3 sm:px-6 lg:px-8 xl:px-10 mx-auto">
        <div className="text-center mb-3 sm:mb-4">
          <span className={`text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-1 inline-block ${
            isDark ? 'text-violet-400' : 'text-violet-600'
          }`}>
            WorknAi Suite
          </span>
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-1 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Enterprise{' '}
            <span className={`text-transparent bg-clip-text ${
              isDark
                ? 'bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400'
                : 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600'
            }`}>
              Product Ecosystem
            </span>
          </h1>
          <p className={`text-xs sm:text-[13px] max-w-lg mx-auto ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Explore live production systems, intelligent SaaS architectures, and enterprise platforms engineered for scale.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className={`text-xs tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Loading product showcase…
          </span>
        </div>
      ) : products.length === 0 ? (
        <div className={`text-center py-16 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Products coming soon!
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* ════════════════════════════════════════════════════════════════
              2. FULL-SCREEN PRODUCT LOGO MARQUEE (Compact & Borderless)
              ════════════════════════════════════════════════════════════════ */}
          <div className="w-full overflow-hidden py-0.5">
            <ProductLogoMarquee
              products={products}
              selectedProductId={selectedProduct?._id}
              onSelectProduct={handleSelectProduct}
              isDark={isDark}
            />
          </div>

          {/* ════════════════════════════════════════════════════════════════
              MAIN CONTENT CONTAINER (Spotlight + Catalog)
              ════════════════════════════════════════════════════════════════ */}
          <div className="w-full max-w-[1640px] 2xl:max-w-[1760px] px-3 sm:px-6 lg:px-8 xl:px-10 mx-auto flex flex-col gap-8 sm:gap-10">
            {/* ════════════════════════════════════════════════════════════════
                3. CINEMATIC SPOTLIGHT SHOWCASE (Balanced & Fits 1 Window)
                ════════════════════════════════════════════════════════════════ */}
            {selectedProduct && (
              <div
                id="spotlight-section"
                ref={spotlightRef}
                className={`rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-5 border shadow-xl relative scroll-mt-20 transition-all ${
                  isDark
                    ? 'bg-slate-900/40 border-white/10 shadow-2xl shadow-violet-950/25 ring-1 ring-violet-500/15'
                    : 'bg-white border-slate-200 shadow-xl shadow-slate-200/70'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
                  {/* LEFT COLUMN: Device Browser Preview + Interactive Value Ribbon */}
                  <div className="lg:col-span-7 xl:col-span-7 2xl:col-span-8 flex flex-col justify-between gap-2.5 min-w-0">
                    {/* Device Browser Frame */}
                    <div
                      onMouseEnter={() => setIsHoveredViews(true)}
                      onMouseLeave={() => setIsHoveredViews(false)}
                      className={`relative rounded-xl sm:rounded-2xl border shadow-xl overflow-hidden group/device w-full flex flex-col ${
                        isDark ? 'border-white/15 bg-slate-950 shadow-2xl shadow-black/50' : 'border-slate-300 bg-slate-900 shadow-lg'
                      }`}
                    >
                      {/* Chrome Top Bar */}
                      <div className={`flex items-center justify-between px-3.5 py-1.5 border-b select-none shrink-0 ${
                        isDark ? 'border-white/10 bg-slate-900/95 text-slate-400' : 'border-slate-200 bg-slate-100 text-slate-600'
                      }`}>
                        {/* Traffic Lights */}
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                        </div>

                        {/* URL Bar */}
                        <div className={`flex items-center gap-1.5 px-3 py-0.5 rounded-lg border text-[10.5px] max-w-[280px] w-full justify-center truncate shadow-inner ${
                          isDark ? 'bg-black/50 border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-xs'
                        }`}>
                          <Globe size={11} className="text-violet-400 shrink-0" />
                          <span className="truncate font-mono tracking-tight text-[10px]">
                            {isProductLive(selectedProduct) && selectedProduct.url
                              ? selectedProduct.url.replace(/^https?:\/\//, '').replace(/\/$/, '')
                              : `worknai.online/products/${selectedProduct.slug} · (In Dev)`}
                          </span>
                        </div>

                        {/* Expand & Popout Actions */}
                        <div className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {currentImages.length > 1 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-violet-300 font-semibold">
                              {safeImageIndex + 1}/{currentImages.length}
                            </span>
                          )}
                          <button
                            onClick={() => setLightboxIndex(safeImageIndex)}
                            title="Fullscreen Preview"
                            aria-label="Open Fullscreen Preview"
                            className={`p-1 rounded-md transition-colors ${
                              isDark ? 'hover:text-white hover:bg-white/10' : 'hover:text-slate-900 hover:bg-slate-200'
                            }`}
                          >
                            <Maximize2 size={12} />
                          </button>
                          {isProductLive(selectedProduct) && selectedProduct.url && (
                            <a
                              href={ensureAbsoluteUrl(selectedProduct.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Visit ${selectedProduct.title} live site`}
                              aria-label={`Visit ${selectedProduct.title} live site`}
                              className={`p-1 rounded-md transition-colors ${
                                isDark ? 'hover:text-white hover:bg-white/10' : 'hover:text-slate-900 hover:bg-slate-200'
                              }`}
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Main Cinematic Image Stage - Fixed Height for 1-Window Fit */}
                      <div
                        className="relative w-full aspect-[16/9.5] max-h-[360px] sm:max-h-[390px] min-h-[220px] sm:min-h-[260px] bg-slate-950 overflow-hidden cursor-zoom-in group/stage shrink-0"
                        onClick={() => setLightboxIndex(safeImageIndex)}
                      >
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={`${selectedProduct?._id}-${safeImageIndex}-${activeImage}`}
                            src={activeImage}
                            alt={selectedProduct?.title || 'Preview'}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="w-full h-full object-cover group-hover/device:scale-[1.015] transition-transform duration-700 ease-out"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              handleImageError(selectedProduct?._id, activeImage);
                              e.currentTarget.src = categoryImage(selectedProduct, 'fallback', 1600, 1000);
                            }}
                          />
                        </AnimatePresence>

                        {/* Subtle Ambient Vignette & Reflection */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
                        <div className="absolute inset-x-0 top-0 h-10 pointer-events-none bg-gradient-to-b from-black/20 to-transparent" />

                        {/* Quick View Nav Arrows on Stage Hover */}
                        {currentImages.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
                              }}
                              aria-label="Previous view"
                              title="Previous View"
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/75 hover:bg-violet-600 text-white flex items-center justify-center opacity-0 group-hover/stage:opacity-100 transition-all backdrop-blur-md border border-white/20 shadow-xl z-20"
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveImageIndex((prev) => (prev + 1) % currentImages.length);
                              }}
                              aria-label="Next view"
                              title="Next View"
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/75 hover:bg-violet-600 text-white flex items-center justify-center opacity-0 group-hover/stage:opacity-100 transition-all backdrop-blur-md border border-white/20 shadow-xl z-20"
                            >
                              <ChevronRight size={16} />
                            </button>
                          </>
                        )}

                        {/* Interactive Zoom Badge */}
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-[10px] font-medium flex items-center gap-1.5 opacity-0 group-hover/stage:opacity-90 transition-opacity pointer-events-none z-10">
                          <Maximize2 size={10} /> Click to expand
                        </div>
                      </div>
                    </div>

                    {/* FILL THE BLANK SPACE: Multi-View Thumbnails & Platform Metrics Ribbon */}
                    <div className="flex flex-col gap-2 pt-0.5">
                      {/* Interactive Views Rail (If multiple views exist) */}
                      {currentImages.length > 1 && (
                        <div className={`p-1.5 rounded-xl border flex items-center justify-between gap-2.5 ${
                          isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-100/80 border-slate-200'
                        }`}>
                          <div
                            onMouseEnter={() => setIsHoveredViews(true)}
                            onMouseLeave={() => setIsHoveredViews(false)}
                            ref={viewsTrackRef}
                            className="flex items-center gap-1.5 overflow-x-auto py-0.5 px-0.5 scrollbar-none scroll-smooth flex-1 min-w-0"
                          >
                            {currentImages.map((img, idx) => (
                              <button
                                key={`${selectedProduct?._id}-${img}-${idx}`}
                                id={`view-thumb-${idx}`}
                                onClick={() => setActiveImageIndex(idx)}
                                aria-label={`View screenshot ${idx + 1}`}
                                className={`relative w-14 h-9 sm:w-16 sm:h-10 rounded-md sm:rounded-lg overflow-hidden border transition-all duration-200 shrink-0 cursor-pointer ${
                                  safeImageIndex === idx
                                    ? 'border-violet-500 ring-2 ring-violet-500/60 scale-105 opacity-100 shadow-md shadow-violet-950/40'
                                    : isDark
                                      ? 'border-white/10 opacity-50 hover:opacity-90'
                                      : 'border-slate-300 opacity-60 hover:opacity-100'
                                }`}
                              >
                                <img
                                  src={img}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    handleImageError(selectedProduct?._id, img);
                                  }}
                                />
                                {safeImageIndex === idx && (
                                  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-violet-500" />
                                )}
                              </button>
                            ))}
                          </div>

                          <div className={`text-[10px] font-medium shrink-0 flex items-center gap-1.5 pl-2 border-l ${
                            isDark ? 'text-slate-400 border-white/10' : 'text-slate-500 border-slate-300'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="hidden sm:inline">Views ({safeImageIndex + 1}/{currentImages.length})</span>
                            <span className="sm:hidden">{safeImageIndex + 1}/{currentImages.length}</span>
                          </div>
                        </div>
                      )}

                      {/* Performance & Architecture Metrics Ribbon */}
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                        <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                          isDark ? 'bg-white/[0.02] border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
                        }`}>
                          <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10.5px] sm:text-[11px] font-bold truncate">Production Live</div>
                            <div className={`text-[9px] sm:text-[9.5px] truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>99.9% Uptime</div>
                          </div>
                        </div>

                        <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                          isDark ? 'bg-white/[0.02] border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
                        }`}>
                          <div className="w-6 h-6 rounded-lg bg-violet-500/15 text-violet-400 flex items-center justify-center shrink-0">
                            <Sparkles size={12} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10.5px] sm:text-[11px] font-bold truncate">Scalable SaaS</div>
                            <div className={`text-[9px] sm:text-[9.5px] truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Cloud Native</div>
                          </div>
                        </div>

                        <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                          isDark ? 'bg-white/[0.02] border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
                        }`}>
                          <div className="w-6 h-6 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                            <ShieldCheck size={12} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10.5px] sm:text-[11px] font-bold truncate">Enterprise Grade</div>
                            <div className={`text-[9px] sm:text-[9.5px] truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Security First</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Dedicated Vertical Information Panel */}
                  <div className="lg:col-span-5 xl:col-span-5 2xl:col-span-4 flex flex-col min-w-0 h-full">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedProduct._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="h-full"
                      >
                        <ProductInfoPanel
                          product={selectedProduct}
                          isDark={isDark}
                          onStepSpotlight={handleStepSpotlight}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                4. EXPLORE OUR PRODUCTS CATALOG (Image-First Grid)
                ════════════════════════════════════════════════════════════════ */}
            <div ref={catalogRef} className="flex flex-col gap-6 pt-4 scroll-mt-24">
              <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4 ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <div>
                  <h2 className={`font-display text-xl sm:text-2xl font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    Explore Our Products
                  </h2>
                  <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    A collection of digital platforms solving real-world challenges across industries.
                  </p>
                </div>

                {/* Sleek Side Navigation with Page Indicator */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <span className={`text-xs font-mono font-medium ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        aria-label="Previous Page"
                        title="Previous Page"
                        disabled={currentPage === 1}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-2xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                          isDark
                            ? 'bg-slate-800/90 hover:bg-violet-600 hover:border-violet-500 border-white/15 text-slate-200 hover:text-white'
                            : 'bg-white hover:bg-violet-600 hover:text-white hover:border-violet-600 border-slate-200 text-slate-700 shadow-slate-200/50'
                        }`}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        aria-label="Next Page"
                        title="Next Page"
                        disabled={currentPage === totalPages}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-2xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                          isDark
                            ? 'bg-slate-800/90 hover:bg-violet-600 hover:border-violet-500 border-white/15 text-slate-200 hover:text-white'
                            : 'bg-white hover:bg-violet-600 hover:text-white hover:border-violet-600 border-slate-200 text-slate-700 shadow-slate-200/50'
                        }`}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Subtle Clean Category Filter Strip (Horizontally scrollable with right fade) */}
              {categories.length > 2 && (
                <div className="relative w-full max-w-full overflow-hidden">
                  {/* Left Edge Fade Mask */}
                  <div className={`pointer-events-none absolute left-0 inset-y-0 w-6 z-10 bg-gradient-to-r ${
                    isDark ? 'from-[#07070D] to-transparent' : 'from-slate-50 to-transparent'
                  }`} />

                  {/* Right Edge Subtle Fade Mask */}
                  <div className={`pointer-events-none absolute right-0 inset-y-0 w-16 sm:w-24 z-10 bg-gradient-to-l ${
                    isDark ? 'from-[#07070D] to-transparent' : 'from-slate-50 to-transparent'
                  }`} />

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none scroll-smooth pl-1 pr-16 sm:pr-24">
                    {categories.map((cat) => {
                      const isCatActive = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategoryFilter(cat)}
                          className={`px-3.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                            isCatActive
                              ? 'bg-violet-600 text-white shadow-xs'
                              : isDark
                                ? 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Grid of Visual Cards with smooth sliding transition */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentPage}-${selectedCategory}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[380px]"
                >
                  {currentGridProducts.map((p) => (
                    <VisualProductCard
                      key={p._id}
                      p={p}
                      onSelectSpotlight={(prod) => handleSelectProduct(prod, true)}
                      isSelected={p._id === selectedProduct?._id}
                      isDark={isDark}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Interactive Lightbox Modal */}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={currentImages}
          currentIndex={lightboxIndex}
          onNavigate={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
