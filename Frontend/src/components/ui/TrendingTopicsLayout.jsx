import { NavLink } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const subNavItems = [
  { to: '/trending-topics/overview', label: 'Overview' },
  { to: '/trending-topics/our-approach', label: 'Our Approach' },
  { to: '/trending-topics/success-stories', label: 'Success Stories' },
  { to: '/trending-topics/expert-voices', label: 'Expert Voices' },
  { to: '/trending-topics/contact-us', label: 'Contact Us' },
];

export default function TrendingTopicsLayout({ heroTitle, heroSubtitle, children }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&auto=format&fit=crop&q=80"
            alt="WorknAi team"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="product-hero-wash absolute inset-0" />
        <div className="container-x relative z-10 pt-24 pb-16 px-4">
          <span className="chip mb-5"><Sparkles size={12} /> Trending Topics</span>
          <h1 className="display-h text-4xl sm:text-6xl text-white leading-[1.05] max-w-3xl">{heroTitle}</h1>
          {heroSubtitle && <p className="text-white/85 text-lg mt-5 max-w-xl">{heroSubtitle}</p>}
        </div>
      </section>

      {/* Sub-nav */}
      <div className="sticky top-0 z-30 bg-[#0d0d1a]/95 backdrop-blur-xl border-b border-violet-500/20">
        <div className="container-x px-4 flex gap-2 overflow-x-auto">
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
                  {isActive && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-violet-400 rounded-full" />}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Page content */}
      <section className="section">
        <div className="container-x">
          {children}
        </div>
      </section>
    </div>
  );
}
