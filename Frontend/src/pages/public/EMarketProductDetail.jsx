import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ArrowUpRight, ExternalLink, CheckCircle2,
  Cpu, ShieldCheck, Tag, ShoppingBag, Box, Clock, ArrowRight
} from 'lucide-react';
import api from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { MarketProductCard } from './EMarket';

function formatPrice(price, currency = 'INR') {
  if (price === null || price === undefined || price <= 0) return null;
  if (currency === 'INR') {
    return '₹' + Number(price).toLocaleString('en-IN');
  }
  if (currency === 'USD') {
    return '$' + Number(price).toLocaleString('en-US');
  }
  return `${currency} ${Number(price).toLocaleString()}`;
}

function formatRealDate(isoString) {
  if (!isoString) return null;
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return null;
  }
}

export default function EMarketProductDetail() {
  const { slug } = useParams();
  const { isDark } = useTheme();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    setLoading(true);
    setActiveImageIdx(0);
    setImgErr(false);
    api.get(`/emarket/${slug}`)
      .then((r) => {
        setProduct(r.data.data || null);
        setRelated(r.data.related || []);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#09090b]' : 'bg-[#f8fafc]'}`}>
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-4 ${isDark ? 'bg-[#09090b] text-white' : 'bg-[#f8fafc] text-zinc-900'}`}>
        <Box size={48} className="mb-4 text-slate-500 opacity-50" />
        <h1 className="font-display text-2xl font-bold mb-2">Technology Product Not Found</h1>
        <p className="text-sm text-slate-500 mb-6">The hardware device you are looking for does not exist in the marketplace catalog.</p>
        <Link to="/emarket" className="btn-primary !px-5 !py-2.5 !text-sm font-bold">
          Back to AI Innovation
        </Link>
      </div>
    );
  }

  const allImages = [product.image, ...(product.gallery || [])].filter(Boolean);
  const priceDisplay = formatPrice(product.price, product.currency);
  const verifiedRelease = formatRealDate(product.releaseDate || product.sourceUpdatedAt);
  const verifiedPriceDate = formatRealDate(product.priceLastVerifiedAt);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#09090b] text-slate-100' : 'bg-[#f8fafc] text-zinc-900'}`}>

      {/* ── Breadcrumb & Top Bar ─────────────────────────────────────────── */}
      <div className={`border-b py-3 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-zinc-950/80 border-zinc-850' : 'bg-white border-slate-200'}`}>
        <div className="max-w-[1480px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Link to="/emarket" className="text-slate-400 hover:text-violet-400 transition-colors flex items-center gap-1">
              <ChevronLeft size={14} /> AI Innovation
            </Link>
            <span className="text-slate-600">/</span>
            <Link to={`/emarket/${encodeURIComponent(product.category)}`} className="text-slate-400 hover:text-violet-400 transition-colors">
              {product.category}
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-semibold truncate max-w-[200px] sm:max-w-none">{product.title}</span>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-violet-500/10 border-violet-500/30 text-violet-400">
            {product.brand}
          </span>
        </div>
      </div>

      {/* ── Main Product Content ─────────────────────────────────────────── */}
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left Column: Visual Gallery ────────────────────────────────── */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Image Frame (Clean White Studio Canvas) */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white aspect-[4/3] p-8 flex items-center justify-center relative shadow-xl overflow-hidden">
              {!imgErr && allImages[activeImageIdx] ? (
                <img
                  src={allImages[activeImageIdx]}
                  alt={product.title}
                  onError={() => setImgErr(true)}
                  className="w-full h-full max-h-[380px] object-contain transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <Cpu size={48} />
                  <span className="text-xs mt-2 font-mono text-slate-500">{product.brand}</span>
                </div>
              )}

              {/* Verified Badge */}
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 shadow-sm backdrop-blur-md">
                <ShieldCheck size={14} /> Verified Hardware
              </span>

              {priceDisplay && (
                <span className="absolute top-4 right-4 text-sm font-black px-3.5 py-1 rounded-full bg-violet-600 text-white shadow-xl font-mono">
                  {priceDisplay}
                </span>
              )}
            </div>

            {/* Thumbnail switcher if multiple images */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-1">
                {allImages.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`w-20 h-16 rounded-xl border-2 p-1.5 transition-all shrink-0 flex items-center justify-center ${
                      activeImageIdx === i
                        ? 'border-violet-500 shadow-md scale-105 bg-zinc-900'
                        : isDark ? 'border-zinc-800 bg-zinc-950 opacity-60 hover:opacity-100' : 'border-slate-200 bg-slate-50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Manufacturer Guarantee Box */}
            <div className={`p-4.5 rounded-2xl border flex items-center gap-3.5 ${
              isDark ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
            }`}>
              <ShieldCheck size={22} className="text-emerald-400 shrink-0" />
              <div className="text-xs">
                <span className="font-bold block text-slate-200">Official Provenance Verification</span>
                <span className="text-slate-400">
                  Direct specifications provided by {product.brand}. Source verified at official product repository.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Purchase ─────────────────────────── */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-violet-500/10 border-violet-500/30 text-violet-300">
                  {product.brand}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 font-semibold">{product.category}</span>
                {product.subcategory && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">{product.subcategory}</span>
                  </>
                )}
              </div>

              <h1 className={`font-display text-3xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {product.title}
              </h1>

              {product.tagline && (
                <p className={`text-sm sm:text-base leading-relaxed mt-2 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  {product.tagline}
                </p>
              )}
            </div>

            {/* Price & Commercial CTA Card */}
            <div className={`p-6 rounded-3xl border ${isDark ? 'bg-zinc-900/90 border-zinc-800 shadow-xl' : 'bg-white border-slate-200 shadow-lg'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Retail Price (Verified)</span>
                  <div className="text-3xl font-black text-emerald-400 mt-0.5">
                    {priceDisplay || 'Market Pricing'}
                  </div>
                  {verifiedPriceDate && (
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Price verified on {verifiedPriceDate}
                    </span>
                  )}
                </div>
                {product.source && (
                  <span className="text-xs text-slate-300 font-medium bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-700">
                    Source: {product.source}
                  </span>
                )}
              </div>

              {product.buyUrl || product.sourceProductUrl ? (
                <a
                  href={product.buyUrl || product.sourceProductUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !w-full !py-3.5 !text-sm !font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  Buy / View on {product.source || 'Official Store'} <ExternalLink size={15} />
                </a>
              ) : (
                <Link
                  to="/contact"
                  className="btn-primary !w-full !py-3.5 !text-sm !font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  Inquire Hardware Availability <ArrowUpRight size={15} />
                </Link>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className={`font-bold text-xs uppercase tracking-wider mb-2 ${isDark ? 'text-slate-300' : 'text-zinc-800'}`}>
                  Product Overview
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Technical Specifications Table */}
            {product.specifications?.length > 0 && (
              <div>
                <h3 className={`font-bold text-xs uppercase tracking-wider mb-3 ${isDark ? 'text-slate-300' : 'text-zinc-800'}`}>
                  Verified Technical Specifications
                </h3>
                <div className={`rounded-2xl border overflow-hidden divide-y divide-current/5 ${
                  isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200'
                }`}>
                  {product.specifications.map((spec, sIdx) => (
                    <div key={sIdx} className="grid grid-cols-3 py-2.5 px-4 text-xs">
                      <span className="text-slate-500 font-medium">{spec.key}</span>
                      <span className={`col-span-2 font-mono font-semibold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features Bullet Points */}
            {product.features?.length > 0 && (
              <div>
                <h3 className={`font-bold text-xs uppercase tracking-wider mb-3 ${isDark ? 'text-slate-300' : 'text-zinc-800'}`}>
                  Key Capabilities
                </h3>
                <div className="space-y-2">
                  {product.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs">
                      <CheckCircle2 size={14} className="text-violet-400 shrink-0 mt-0.5" />
                      <span className={isDark ? 'text-zinc-300' : 'text-slate-700'}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Hardware in this Category ────────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-current/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`font-display text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                More in {product.category}
              </h2>
              <Link
                to={`/emarket/${encodeURIComponent(product.category)}`}
                className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
              >
                View all in {product.category} <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((rel) => (
                <MarketProductCard key={rel._id} product={rel} isDark={isDark} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
