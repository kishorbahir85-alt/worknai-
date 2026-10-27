import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { productLogo, getCategoryGradient, getFavicon } from '../../utils/productImage';

export default function Marquee() {
  const { isDark } = useTheme();
  const [products, setProducts] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    api.get('/products').then((r) => setProducts(r.data.data || [])).catch(() => {});
  }, []);

  const validProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.filter((p) => Boolean(productLogo(p) || p.url || p.title));
  }, [products]);

  if (validProducts.length === 0) return null;

  const marqueeItems = [...validProducts, ...validProducts, ...validProducts, ...validProducts];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative home-marquee-wrapper w-full overflow-hidden py-4 sm:py-6 select-none"
    >
      <style>{`
        @keyframes homeLogoScrollMarquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .home-marquee-track-ui {
          display: flex;
          width: max-content;
          animation: homeLogoScrollMarquee 36s linear infinite;
          will-change: transform;
        }
        .home-marquee-wrapper:hover .home-marquee-track-ui,
        .home-marquee-track-ui:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Fade masks */}
      <div className={`pointer-events-none absolute left-0 inset-y-0 w-16 sm:w-28 md:w-44 z-20 bg-gradient-to-r ${isDark ? 'from-[#06030f] via-[#06030f]/90 to-transparent' : 'from-[#fafaf9] via-[#fafaf9]/90 to-transparent'}`} />
      <div className={`pointer-events-none absolute right-0 inset-y-0 w-16 sm:w-28 md:w-44 z-20 bg-gradient-to-l ${isDark ? 'from-[#06030f] via-[#06030f]/90 to-transparent' : 'from-[#fafaf9] via-[#fafaf9]/90 to-transparent'}`} />

      {/* Track */}
      <div
        style={{ animationPlayState: isHovered ? 'paused' : 'running' }}
        className="home-marquee-track-ui gap-4 sm:gap-6 items-center px-4"
      >
        {marqueeItems.map((p, idx) => {
          const logo = productLogo(p) || (p.url && getFavicon(p.url));

          return (
            <Link
              key={`${p._id || idx}-${idx}`}
              to={`/products/${p.slug || ''}`}
              title={p.title}
              className={`group/logo relative shrink-0 flex items-center gap-3 px-3 py-2 sm:py-2.5 rounded-2xl transition-all duration-300 ${
                isDark
                  ? 'hover:bg-white/[0.04] hover:scale-105'
                  : 'hover:bg-slate-100/80 hover:scale-105'
              }`}
            >
              {/* Clean Logo without border */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 aspect-square rounded-xl flex items-center justify-center overflow-hidden">
                {logo ? (
                  <img
                    src={logo}
                    alt={p.title}
                    className="max-h-full max-w-full w-auto h-auto object-contain pointer-events-none transition-transform duration-300 group-hover/logo:scale-110"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-violet-600/80 flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider">
                    {p.title?.slice(0, 2) || 'PR'}
                  </div>
                )}
              </div>

              <div className="text-left pr-1 min-w-0">
                <div className={`text-xs sm:text-sm font-bold truncate max-w-[130px] sm:max-w-[160px] ${isDark ? 'text-white group-hover/logo:text-violet-300' : 'text-slate-900 group-hover/logo:text-violet-700'}`}>
                  {p.title}
                </div>
                {p.category && (
                  <div className={`text-[10px] font-medium truncate max-w-[130px] sm:max-w-[160px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {p.category}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}