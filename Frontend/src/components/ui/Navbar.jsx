import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ArrowUpRight, BookOpen, ChevronDown, Moon, Sun,
  FileText, Code2, ArrowRight, Briefcase, Sparkles,
} from 'lucide-react';
import worknaiLogo from '../../assets/worknai_logo.png';
import { useTheme } from '../../context/ThemeContext';
import api from '../../utils/api';
import { productImage } from '../../utils/productImage';

const BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
const resolveUrl = (url) => (url && !/^https?:\/\//.test(url) ? `${BASE}${url}` : url);

const resourcesItems = [
  { key: 'trending', to: '/trending-topics/overview', label: 'Trending Topics', icon: Sparkles },
  { key: 'blog', to: '/blog', label: 'Blog', icon: FileText },
  { key: 'tutorials', to: '/tutorials', label: 'Tutorials', icon: BookOpen },
  { key: 'careers', to: '/career', label: 'Careers', icon: Briefcase },
];

const trendingTabLinks = [
  { to: '/trending-topics/overview', label: 'Overview' },
  { to: '/trending-topics/our-approach', label: 'Our Approach' },
  { to: '/trending-topics/success-stories', label: 'Success Stories' },
  { to: '/trending-topics/expert-voices', label: 'Expert Voices' },
  { to: '/trending-topics/contact-us', label: 'Contact Us' },
];

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/courses', label: 'Courses' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [latestTutorials, setLatestTutorials] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const resourcesRef = useRef(null);
  const productsRef = useRef(null);

  useEffect(() => {
    api.get('/products').then((r) => setProducts(r.data.data)).catch(() => {});
    api.get('/blog').then((r) => setLatestBlogs(r.data.data.slice(0, 2))).catch(() => {});
    api.get('/tutorials').then((r) => setLatestTutorials(r.data.data.slice(0, 2))).catch(() => {});
    api.get('/jobs').then((r) => setLatestJobs(r.data.data.slice(0, 2))).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMobileResourcesOpen(false);
    setMobileProductsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target)) {
        setResourcesOpen(false);
        setActiveCategory(null);
      }
      if (productsRef.current && !productsRef.current.contains(e.target)) {
        setProductsOpen(false);
        setActiveProduct(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') { closeResources(); closeProducts(); }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Lock page scroll while any overlay menu (desktop dropdowns or mobile menu) is open
  useEffect(() => {
    const anyMenuOpen = productsOpen || resourcesOpen || open;
    const { style } = document.body;
    if (anyMenuOpen) {
      style.overflow = 'hidden';
    } else {
      style.overflow = '';
    }
    return () => { style.overflow = ''; };
  }, [productsOpen, resourcesOpen, open]);

  const closeResources = () => { setResourcesOpen(false); setActiveCategory(null); };
  const closeProducts = () => { setProductsOpen(false); setActiveProduct(null); };

  const toggleResources = () => {
    closeProducts();
    setResourcesOpen((o) => {
      if (o) setActiveCategory(null);
      return !o;
    });
  };

  const toggleProducts = () => {
    closeResources();
    setProductsOpen((o) => {
      if (o) setActiveProduct(null);
      return !o;
    });
  };

  const themeLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  const ThemeIcon = isDark ? Sun : Moon;

  const renderThemeToggle = () => (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle inline-flex h-10 w-10 items-center justify-center rounded-full border border-line2 bg-violet-500/10 text-ink transition-colors hover:border-violet-400/50 hover:bg-violet-500/20"
      aria-label={themeLabel}
      title={themeLabel}
    >
      <ThemeIcon className="h-4 w-4" />
    </button>
  );

  const renderNavLink = (item) => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        `site-nav-link relative flex items-center h-10 px-3.5 text-sm font-medium transition-colors rounded-full whitespace-nowrap ${
          isActive ? 'text-ink' : 'text-ink-dim hover:text-ink'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {item.label}
          {isActive && (
            <motion.span
              layoutId="nav-pill"
              className="site-nav-pill absolute inset-0 -z-10 bg-violet-500/20 border border-violet-400/30 rounded-full"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </>
      )}
    </NavLink>
  );

  const resourcesSplitIndex = navItems.findIndex((item) => item.to === '/courses') + 1;
  const beforeResources = navItems.slice(0, resourcesSplitIndex);
  const afterResources = navItems.slice(resourcesSplitIndex);

  const renderTextLink = (to, primary, secondary) => (
    <Link
      key={to}
      to={to}
      role="menuitem"
      onClick={closeResources}
      className="flex items-center justify-between gap-3 px-5 py-3.5 rounded-lg text-ink-dim hover:text-ink hover:bg-violet-500/10 transition-colors group"
    >
      <span className="flex flex-col min-w-0">
        <span className="text-base font-medium text-ink truncate">{primary}</span>
        {secondary && <span className="text-sm text-ink-faint truncate">{secondary}</span>}
      </span>
      <ArrowRight className="w-4 h-4 shrink-0 text-ink-faint group-hover:text-violet-400 transition-colors" />
    </Link>
  );

  // Big Amadeus-style media card for the dropdown's right panel
  const renderMediaCard = (to, image, category, title, description, cta, FallbackIcon) => (
    <Link
      key={to}
      to={to}
      role="menuitem"
      onClick={closeResources}
      className="group flex flex-col gap-4"
    >
      <div className="aspect-[16/9] rounded-xl overflow-hidden bg-violet-900/30 shrink-0">
        {image ? (
          <img src={resolveUrl(image)} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><FallbackIcon className="w-10 h-10 text-violet-400 opacity-50" /></div>
        )}
      </div>
      {category && <span className="chip w-fit">{category}</span>}
      <h4 className="text-lg font-semibold text-ink leading-snug line-clamp-2">{title}</h4>
      {description && <p className="text-sm text-ink-dim line-clamp-2">{description}</p>}
      <span className="inline-flex items-center gap-1.5 text-sm text-violet-400 font-medium">
        {cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </span>
    </Link>
  );

  // Slide-in-from-left wrapper for the right panel content (keyed on category so
  // it re-animates each time the selection changes — PowerPoint-style)
  const slideContent = (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategory || 'empty'}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="h-full"
      >
        {!activeCategory && (
          <div className="h-full flex items-center justify-center text-center">
            <p className="text-ink-faint text-lg max-w-sm">Select a category on the left to explore.</p>
          </div>
        )}

        {activeCategory === 'trending' && (
          <div className="flex flex-col gap-1 max-w-lg">
            <p className="text-xs uppercase tracking-wider text-ink-faint px-5 mb-3">Explore Trending Topics</p>
            {trendingTabLinks.map((t) => renderTextLink(t.to, t.label))}
          </div>
        )}

        {activeCategory === 'blog' && (
          latestBlogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl">
              {latestBlogs.map((post) => renderMediaCard(`/blog/${post.slug}`, post.coverImage, post.category, post.title, post.excerpt, 'Read more', FileText))}
            </div>
          ) : <p className="text-sm text-ink-faint px-2">No blog posts yet.</p>
        )}

        {activeCategory === 'tutorials' && (
          latestTutorials.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl">
              {latestTutorials.map((tut) => renderMediaCard(`/tutorials/${tut.slug}`, tut.coverImage, tut.difficulty, tut.title, tut.description, 'Start learning', BookOpen))}
            </div>
          ) : <p className="text-sm text-ink-faint px-2">No tutorials yet.</p>
        )}

        {activeCategory === 'careers' && (
          latestJobs.length > 0 ? (
            <div className="flex flex-col gap-1 max-w-lg">
              <p className="text-xs uppercase tracking-wider text-ink-faint px-5 mb-3">Open Roles</p>
              {latestJobs.map((job) => renderTextLink(`/career/${job.slug}`, job.title, `${job.location} · ${job.type}`))}
            </div>
          ) : <p className="text-sm text-ink-faint px-2">No open roles right now.</p>
        )}
      </motion.div>
    </AnimatePresence>
  );

  const renderResourcesDropdown = () => (
    <div className="relative" ref={resourcesRef}>
      <button
        type="button"
        onClick={toggleResources}
        aria-haspopup="true"
        aria-expanded={resourcesOpen}
        className={`site-nav-link relative flex items-center h-10 gap-1 px-3.5 text-sm font-medium transition-colors rounded-full whitespace-nowrap ${
          resourcesOpen ? 'text-ink' : 'text-ink-dim hover:text-ink'
        }`}
      >
        Resources
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${resourcesOpen ? 'rotate-180' : ''}`} />
        {resourcesOpen && (
          <motion.span
            layoutId="nav-pill"
            className="site-nav-pill absolute inset-0 -z-10 bg-violet-500/20 border border-violet-400/30 rounded-full"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
      </button>

      <AnimatePresence>
        {resourcesOpen && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="menu"
            className="site-menu-surface fixed left-4 sm:left-6 md:left-10 top-20 w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-5rem)] max-w-[1360px] h-[80vh] bg-[#0d0d1a] border border-violet-500/20 rounded-2xl shadow-2xl shadow-violet-900/20 z-50 overflow-hidden grid grid-cols-[300px_1fr]"
          >
            <div className="py-4 border-r border-violet-500/10 overflow-y-auto">
              {resourcesItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveCategory(key)}
                  className={`w-full flex items-center justify-between gap-3 px-6 py-4 text-base transition-colors border-l-2 ${
                    activeCategory === key
                      ? 'bg-violet-500/20 text-ink border-violet-400'
                      : 'text-ink-dim hover:text-ink hover:bg-violet-500/10 border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {label}
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              ))}
            </div>

            <div className="p-8 overflow-y-auto">
              {slideContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderProductsDropdown = () => (
    <div className="relative" ref={productsRef}>
      <button
        type="button"
        onClick={toggleProducts}
        aria-haspopup="true"
        aria-expanded={productsOpen}
        className={`site-nav-link relative flex items-center h-10 gap-1 px-3.5 text-sm font-medium transition-colors rounded-full whitespace-nowrap ${
          productsOpen ? 'text-ink' : 'text-ink-dim hover:text-ink'
        }`}
      >
        Products
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} />
        {productsOpen && (
          <motion.span
            layoutId="nav-pill"
            className="site-nav-pill absolute inset-0 -z-10 bg-violet-500/20 border border-violet-400/30 rounded-full"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
      </button>

      <AnimatePresence>
        {productsOpen && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="menu"
            className="site-menu-surface fixed left-4 sm:left-6 md:left-10 top-20 w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-5rem)] max-w-[1360px] h-[80vh] bg-[#0d0d1a] border border-violet-500/20 rounded-2xl shadow-2xl shadow-violet-900/20 z-50 overflow-hidden grid grid-cols-[300px_1fr]"
          >
            <div className="py-4 border-r border-violet-500/10 overflow-y-auto">
              {products.map((p) => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => setActiveProduct(p._id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-base transition-colors border-l-2 ${
                    activeProduct === p._id
                      ? 'bg-violet-500/20 text-ink border-violet-400'
                      : 'text-ink-dim hover:text-ink hover:bg-violet-500/10 border-transparent'
                  }`}
                >
                  <span className="w-8 h-8 shrink-0 rounded-md bg-violet-500/10 border border-violet-400/20 flex items-center justify-center overflow-hidden p-1">
                    {p.logoUrl ? (
                      <img src={resolveUrl(p.logoUrl)} alt={p.title} className="w-full h-full object-contain" />
                    ) : (
                      <Code2 className="w-4 h-4 text-violet-400" />
                    )}
                  </span>
                  <span className="truncate text-left">{p.title}</span>
                </button>
              ))}
              {!products.length && (
                <div className="px-6 py-3 text-sm text-ink-faint">No products yet</div>
              )}
              <div className="border-t border-violet-500/10 my-2 mx-6" />
              <Link
                to="/products"
                role="menuitem"
                onClick={closeProducts}
                className="flex items-center justify-between gap-2.5 px-6 py-4 text-base text-violet-300 hover:text-ink hover:bg-violet-500/10 transition-colors"
              >
                View all products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-8 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProduct || 'empty'}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className={activeProduct ? '' : 'h-full'}
                >
                  {!activeProduct && (
                    <div className="h-full flex flex-col items-center justify-center text-center gap-6">
                      {products.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4 w-full max-w-md">
                          {products.slice(0, 6).map((p) => (
                            <button
                              key={p._id}
                              type="button"
                              onClick={() => setActiveProduct(p._id)}
                              className="h-20 rounded-xl overflow-hidden hover:opacity-80 transition-opacity"
                            >
                              {p.logoUrl ? (
                                <img src={resolveUrl(p.logoUrl)} alt={p.title} className="h-full w-auto object-contain" />
                              ) : (
                                <span className="h-full aspect-square rounded-xl bg-violet-900/20 border border-violet-400/20 flex items-center justify-center">
                                  <Code2 className="w-6 h-6 text-violet-400 opacity-50" />
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                      <p className="text-ink-faint text-lg max-w-sm">Select a product on the left to see details.</p>
                    </div>
                  )}
                  {activeProduct && (() => {
                    const p = products.find((prod) => prod._id === activeProduct);
                    if (!p) return null;
                    return (
                      <Link
                        to={`/products/${p.slug}`}
                        role="menuitem"
                        onClick={closeProducts}
                        className="group flex flex-col gap-6"
                      >
                        <div className="w-full rounded-xl overflow-hidden bg-[#0d0d1a] shrink-0">
                          <img
                            src={productImage(p, 'overview', 1200, 800)}
                            alt={p.title}
                            style={{ height: '384px' }}
                            className="block w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = productImage({ ...p, overviewImage: '', heroImage: '', gallery: [] }, 'overview', 1200, 800); }}
                          />
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-violet-900/20 border border-violet-400/20 flex items-center justify-center overflow-hidden shrink-0">
                            {p.logoUrl ? (
                              <img src={resolveUrl(p.logoUrl)} alt={p.title} className="w-10 h-10 object-contain" />
                            ) : (
                              <Code2 size={20} className="text-violet-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            {p.category && <span className="chip w-fit mb-3">{p.category}</span>}
                            <h4 className="text-2xl font-semibold text-ink leading-snug">{p.title}</h4>
                            {p.description && <p className="text-sm text-ink-dim mt-3 leading-relaxed">{p.description}</p>}
                          </div>
                        </div>
                        {(p.features?.length > 0 || p.techStack?.length > 0) ? (
                          <div className="grid gap-3">
                            {p.features?.slice(0, 3).map((feat) => (
                              <div key={feat} className="flex items-start gap-3 text-sm text-ink-dim">
                                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-400 shrink-0" />
                                <span>{feat}</span>
                              </div>
                            ))}
                            {!p.features?.length && p.techStack?.length > 0 && (
                              <div className="flex items-start gap-3 text-sm text-ink-dim">
                                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-400 shrink-0" />
                                <span>{p.techStack.slice(0, 3).join(', ')}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-ink-dim">Select the product to see a quick summary and open the full page for details.</p>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-sm text-violet-400 font-medium">
                          View product <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`site-navbar fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#0d0d1a]/90 backdrop-blur-xl border-b border-violet-500/20 shadow-lg shadow-violet-900/10'
            : 'bg-[#0d0d1a]/70 backdrop-blur-md border-b border-white/5'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-2 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0 self-center">
            <img src={worknaiLogo} alt="WorknAi" className="h-16 w-auto object-contain" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-5 flex-1 justify-center self-center">
            {beforeResources.map(renderNavLink)}
            {renderProductsDropdown()}
            {renderResourcesDropdown()}
            {afterResources.map(renderNavLink)}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 self-center">
            {renderThemeToggle()}
            <Link to="/join-us" className="btn-primary h-10 text-sm !px-4 !py-0">
              Join Us
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="lg:hidden flex items-center gap-2">
            {renderThemeToggle()}
            <button
              onClick={() => setOpen((o) => !o)}
              className="p-2 rounded-lg border border-line2 text-ink"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-[65px] left-0 right-0 z-50 lg:hidden"
          >
            <div className="site-menu-surface bg-[#0d0d1a] border-b border-violet-500/20 px-6 py-4 flex flex-col gap-1">
              {beforeResources.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-3 text-base font-medium rounded-xl ${
                      isActive
                        ? 'bg-violet-500/20 text-ink border border-violet-400/30'
                        : 'text-ink-dim hover:text-ink hover:bg-violet-500/10'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              {/* Products accordion (mobile) */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileProductsOpen((o) => !o)}
                  aria-haspopup="true"
                  aria-expanded={mobileProductsOpen}
                  className="w-full flex items-center justify-between px-4 py-3 text-base font-medium rounded-xl text-ink-dim hover:text-ink hover:bg-violet-500/10 transition-colors"
                >
                  Products
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileProductsOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileProductsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      role="menu"
                      className="overflow-hidden flex flex-col gap-1 pl-4"
                    >
                      {products.map((p) => (
                        <NavLink
                          key={p._id}
                          to={`/products/${p.slug}`}
                          role="menuitem"
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 px-4 py-2.5 text-sm rounded-xl ${
                              isActive
                                ? 'bg-violet-500/20 text-ink border border-violet-400/30'
                                : 'text-ink-dim hover:text-ink hover:bg-violet-500/10'
                            }`
                          }
                        >
                          <span className="w-5 h-5 shrink-0 rounded-md bg-violet-500/10 border border-violet-400/20 flex items-center justify-center overflow-hidden p-0.5">
                            {p.logoUrl ? (
                              <img src={resolveUrl(p.logoUrl)} alt={p.title} className="w-full h-full object-contain" />
                            ) : (
                              <Code2 className="w-3 h-3 text-violet-400" />
                            )}
                          </span>
                          <span className="truncate">{p.title}</span>
                        </NavLink>
                      ))}
                      {!products.length && (
                        <div className="px-4 py-2.5 text-sm text-ink-faint">No products yet</div>
                      )}
                      <NavLink
                        to="/products"
                        role="menuitem"
                        className="flex items-center justify-between gap-2.5 px-4 py-2.5 text-sm text-violet-300 hover:text-ink hover:bg-violet-500/10 rounded-xl transition-colors"
                      >
                        More
                        <ArrowRight className="w-3.5 h-3.5" />
                      </NavLink>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Resources accordion (mobile) */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileResourcesOpen((o) => !o)}
                  aria-haspopup="true"
                  aria-expanded={mobileResourcesOpen}
                  className="w-full flex items-center justify-between px-4 py-3 text-base font-medium rounded-xl text-ink-dim hover:text-ink hover:bg-violet-500/10 transition-colors"
                >
                  Resources
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileResourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileResourcesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      role="menu"
                      className="overflow-hidden flex flex-col gap-1 pl-4"
                    >
                      {resourcesItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                          key={to}
                          to={to}
                          role="menuitem"
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 px-4 py-2.5 text-sm rounded-xl ${
                              isActive
                                ? 'bg-violet-500/20 text-ink border border-violet-400/30'
                                : 'text-ink-dim hover:text-ink hover:bg-violet-500/10'
                            }`
                          }
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {afterResources.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-3 text-base font-medium rounded-xl ${
                      isActive
                        ? 'bg-violet-500/20 text-ink border border-violet-400/30'
                        : 'text-ink-dim hover:text-ink hover:bg-violet-500/10'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="border-t border-violet-500/10 mt-2 pt-2">
                <Link to="/join-us" className="btn-primary justify-center">
                  Join Us
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
