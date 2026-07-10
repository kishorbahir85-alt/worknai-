import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const subNavItems = [
  { to: '/trending-topics/overview', label: 'Overview' },
  { to: '/trending-topics/our-approach', label: 'Our Approach' },
  { to: '/trending-topics/success-stories', label: 'Success Stories' },
  { to: '/trending-topics/expert-voices', label: 'Expert Voices' },
  { to: '/trending-topics/contact-us', label: 'Contact Us' },
];

// Unsplash image URL helper — har page isko import karke use kar sakta hai
export const uimg = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=60`;

// Custom hook — Blog page jaisi flat, theme-aware styles ek jagah
export function useTrendingStyles() {
  const { isDark } = useTheme();
  return {
    isDark,
    card: isDark ? 'bg-white/[0.045]' : 'bg-[#f8fafc]',
    label: `text-sm font-medium ${isDark ? 'text-violet-400' : 'text-violet-600'}`,
    chip: `px-4 py-1.5 rounded-full text-sm border transition-colors ${
      isDark
        ? 'border-white/15 bg-white/[0.03] text-ink-dim hover:border-violet-400/60 hover:text-ink'
        : 'border-slate-200 bg-[#f8fafc] text-slate-700 hover:border-violet-400 hover:text-slate-900'
    }`,
  };
}

export default function TrendingTopicsLayout({ heroTitle, heroSubtitle, heroImage, children }) {
  const { isDark } = useTheme();

  return (
    <div className="text-ink">

      {/* Breadcrumb */}
      <div className="container-x px-4 sm:px-6 py-5 text-sm">
        <Link to="/" className={`${isDark ? 'text-violet-400' : 'text-violet-600'} hover:underline`}>
          Home
        </Link>
        <span className="mx-2 text-ink-faint">/</span>
        <span className="text-ink-dim">Trending Topics</span>
      </div>

      {/* Navy hero band — Blog page jaisa, right side me photo */}
      <section className="relative overflow-hidden bg-[#0c0a30]">
        {/* Decorative lines — photo ke peeche, sirf texture ke liye */}
        <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden="true" preserveAspectRatio="none">
          <path d="M 620 -40 Q 520 260 300 520" fill="none" stroke="#8b9dd6" strokeWidth="1" />
          <path d="M 1150 -60 Q 1120 240 1010 540" fill="none" stroke="#8b9dd6" strokeWidth="1" />
          <path d="M 1620 -40 Q 1560 220 1300 560" fill="none" stroke="#8b9dd6" strokeWidth="1" />
        </svg>
        {heroImage && (
          <>
            {/* Mobile: puri band ke peeche halki dim photo */}
            <div className="absolute inset-0 md:hidden" aria-hidden="true">
              <img src={heroImage} alt="" className="w-full h-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a30] via-transparent to-[#0c0a30]/60" />
            </div>
            {/* Desktop: right half photo — sirf left edge pe navy fade, baaki photo saaf */}
            <div className="absolute inset-y-0 right-0 w-[55%] hidden md:block" aria-hidden="true">
              <img src={heroImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-y-0 left-0 w-[45%] bg-gradient-to-r from-[#0c0a30] to-transparent" />
            </div>
          </>
        )}
        <div className="container-x relative z-10 px-4 sm:px-6 py-16 md:py-24">
          <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">
            Trending Topics
          </p>
          <h1 className="display-h text-4xl md:text-6xl text-white mb-6 max-w-3xl">
            {heroTitle}
          </h1>
          {heroSubtitle && (
            <p className="text-base md:text-xl text-white/85 max-w-2xl leading-relaxed">
              {heroSubtitle}
            </p>
          )}
        </div>
      </section>

      {/* Sticky tab bar */}
      <div className="sticky top-0 z-30 bg-[#0d0d1a]/95 backdrop-blur-xl border-b border-violet-500/20">
        <div className="container-x px-4 sm:px-6 flex gap-2 overflow-x-auto">
          {subNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative shrink-0 px-4 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive ? 'text-violet-300' : 'text-ink-dim hover:text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-violet-400 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Page content */}
      <section className="container-x px-4 sm:px-6 py-14 md:py-20">
        {children}
      </section>
    </div>
  );
}
