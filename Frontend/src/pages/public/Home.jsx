import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Sparkles, GraduationCap, Rocket, Briefcase, Users,
  Code2, Brain, Cloud, Palette, ArrowUpRight, Star, Zap,
  Globe, Smartphone, Database, Layers, Plug, TrendingUp,
  Monitor, MapPin, Mail, ShieldCheck, BookOpen, Calendar, Building2,
} from 'lucide-react';
import SectionHeader from '../../components/ui/SectionHeader';
import api from '../../utils/api';
import { formatPrice } from '../../utils/utils';
import { useTheme } from '../../context/ThemeContext';
import { productLogo, getCategoryGradient } from '../../utils/productImage';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// Hero accent ke liye typewriter — type karta hai, rukta hai, delete karke repeat
function Typewriter({ text, className }) {
  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setCount(0);
    setDeleting(false);
  }, [text]);

  useEffect(() => {
    let t;
    if (!deleting && count < text.length) {
      t = setTimeout(() => setCount((c) => c + 1), 95);
    } else if (!deleting && count === text.length) {
      t = setTimeout(() => setDeleting(true), 2400);
    } else if (deleting && count > 0) {
      t = setTimeout(() => setCount((c) => c - 1), 45);
    } else {
      t = setTimeout(() => setDeleting(false), 400);
    }
    return () => clearTimeout(t);
  }, [count, deleting, text]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      <span className="typewriter-caret" aria-hidden="true" />
    </span>
  );
}

const formatCourseStartDate = (value) => {
  if (!value) return '';
  const text = String(value).trim();
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(text)
    ? text
    : text.replace(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/, (_, day, month, year) => `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
  const date = new Date(`${normalized}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getFavicon = (url) => {
  if (!url) return null;
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return null;
  }
};

function HomeProductLogoMarquee({ products, isDark }) {
  const [isHovered, setIsHovered] = useState(false);

  const validProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.filter((p) => Boolean(productLogo(p) || (p.url && getFavicon(p.url)) || p.title));
  }, [products]);

  if (validProducts.length === 0) return null;

  // Duplicate 4 times to ensure seamless infinite looping
  const marqueeItems = [...validProducts, ...validProducts, ...validProducts, ...validProducts];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative home-marquee-wrapper w-full overflow-hidden py-4 sm:py-6 select-none"
    >
      <style>{`
        @keyframes homeLogoScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .home-marquee-track {
          display: flex;
          width: max-content;
          animation: homeLogoScroll 36s linear infinite;
          will-change: transform;
        }
        .home-marquee-wrapper:hover .home-marquee-track,
        .home-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Left Edge Fade Mask */}
      <div
        className={`pointer-events-none absolute left-0 inset-y-0 w-16 sm:w-28 md:w-44 z-20 bg-gradient-to-r ${
          isDark ? 'from-[#06030f] via-[#06030f]/90 to-transparent' : 'from-[#fafaf9] via-[#fafaf9]/90 to-transparent'
        }`}
      />

      {/* Right Edge Fade Mask */}
      <div
        className={`pointer-events-none absolute right-0 inset-y-0 w-16 sm:w-28 md:w-44 z-20 bg-gradient-to-l ${
          isDark ? 'from-[#06030f] via-[#06030f]/90 to-transparent' : 'from-[#fafaf9] via-[#fafaf9]/90 to-transparent'
        }`}
      />

      {/* Continuous Marquee Track */}
      <div
        style={{ animationPlayState: isHovered ? 'paused' : 'running' }}
        className="home-marquee-track gap-4 sm:gap-6 items-center px-4"
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
                    className="w-full h-full max-w-full max-h-full aspect-square object-contain pointer-events-none transition-transform duration-300 group-hover/logo:scale-110"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-violet-600/80 flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider">
                    {p.title?.slice(0, 2) || 'PR'}
                  </div>
                )}
              </div>

              {/* Title & Category Label */}
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

const darkHeroVideo = 'https://res.cloudinary.com/dqmg9yp6r/video/upload/only-us/hero.mp4';
const lightHeroVideo = '/hero.mp4';

export default function Home() {
  const { isDark } = useTheme();
  const [info, setInfo] = useState(null);
  const [courses, setCourses] = useState([]);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [jobs, setJobs] = useState([]);

  const heroCopy = isDark
    ? {
        eyebrow: 'Pune · Software · AI · Training',
        title: 'Where Builders Create the',
        accent: 'Future.',
        subtitle: info?.heroSubtitle ||
          'WorknAi is an IT training, software R&D and product engineering company building careers and cutting-edge SaaS from Pune.',
        primary: 'Explore Courses',
        secondary: 'Our Products',
      }
    : {
        eyebrow: 'AI Skills · Live Projects · Career Growth',
        title: 'Learn Tech.',
        accent: 'Build Careers.',
        subtitle: 'Learn modern tech, work on live projects, and grow with a Pune-based product studio building AI, software, and career-ready training.',
        primary: 'Start Learning',
        secondary: 'View Products',
      };

  useEffect(() => {
    Promise.all([
      api.get('/company').then((r) => setInfo(r.data.data)),
      api.get('/courses?featured=true').then((r) => setCourses(r.data.data.slice(0, 3))),
      api.get('/products?featured=true').then((r) => setProducts(r.data.data.slice(0, 4))),
      api.get('/products').then((r) => setAllProducts(r.data.data || [])),
      api.get('/jobs?featured=true').then((r) => setJobs(r.data.data.slice(0, 3))),
    ]).catch(() => {});
  }, []);

  const popularProducts = useMemo(() => {
    const sourceList = allProducts.length ? allProducts : products;
    if (!sourceList.length) return [];

    // Exact requested popular apps in order:
    // 1. pg info
    // 2. AiTourism
    // 3. Online Go
    // 4. OnlineGoLogistics
    const matchers = [
      (p) => /pg\s*info/i.test(p.title) || /pginfo/i.test(p.url || ''),
      (p) => /aitourism/i.test(p.title) || /aitourism/i.test(p.url || ''),
      (p) => (/online\s*go/i.test(p.title) || /onlinego\.in/i.test(p.url || '')) && !/logistics/i.test(p.title) && !/logistics/i.test(p.url || ''),
      (p) => /logistics/i.test(p.title) || /onlinegologistics/i.test(p.url || ''),
    ];

    const picked = [];
    const usedIds = new Set();

    matchers.forEach((m) => {
      const match = sourceList.find((p) => !usedIds.has(p._id) && m(p));
      if (match) {
        picked.push(match);
        usedIds.add(match._id);
      }
    });

    for (const p of sourceList) {
      if (picked.length >= 4) break;
      if (!usedIds.has(p._id)) {
        picked.push(p);
        usedIds.add(p._id);
      }
    }

    return picked;
  }, [allProducts, products]);

  return (
    <div className={isDark ? '' : 'reference-home'}>

      {/* ============= HERO ============= */}
      <section className={`relative flex min-h-[calc(100svh-65px)] items-center px-4 sm:px-6 py-10 md:py-16 overflow-hidden ${isDark ? 'bg-[#06030f]' : 'reference-hero'}`}>
        {isDark ? (
          <>
            {/* Mobile: full bg video */}
            <div className="absolute inset-0 z-0 md:hidden overflow-hidden" aria-hidden="true">
              <video className="h-full w-full object-cover object-center" autoPlay muted loop playsInline preload="none">
                <source src={darkHeroVideo} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-[#06030f]/70" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#06030f]/40 via-transparent to-[#06030f]/80" />
            </div>

            {/* Desktop: right side video */}
            <div className="absolute inset-y-0 right-0 z-0 hidden md:block w-[55%] overflow-hidden" aria-hidden="true">
              <video className="h-full w-full object-cover object-center" autoPlay muted loop playsInline preload="none">
                <source src={darkHeroVideo} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-r from-[#06030f] via-transparent to-transparent" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
            <video
              key="light-hero-video"
              className="h-full w-full object-cover object-center"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
            >
              <source src={lightHeroVideo} type="video/mp4" />
            </video>
          </div>
        )}

        {isDark ? (
          <>
            {/* Glow orb */}
            <div className="glow-orb w-[200px] h-[200px] md:w-[500px] md:h-[500px] bg-violet-700 top-20 -left-20 md:-left-40 animate-pulse-slow" />

            <div className="container-x relative z-10 w-full">
              <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-12">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                  className="lg:col-span-7 w-full"
                >
                  <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
                    <span className="chip">
                      <Sparkles className="w-3 h-3" /> {heroCopy.eyebrow}
                    </span>
                  </motion.div>

                  <motion.h1
                    variants={fadeUp}
                    transition={{ duration: 0.7 }}
                    className="display-h text-[clamp(2.35rem,6.4vw,5rem)] mt-7"
                  >
                    <span className="text-gradient block">{heroCopy.title}</span>
                    <Typewriter text={heroCopy.accent} className="block text-violet-300" />
                  </motion.h1>

                  <motion.p
                    variants={fadeUp}
                    transition={{ duration: 0.7 }}
                    className="text-base md:text-lg text-ink-dim mt-6 max-w-xl leading-relaxed"
                  >
                    {heroCopy.subtitle}
                  </motion.p>

                  <motion.div
                    variants={fadeUp}
                    transition={{ duration: 0.7 }}
                    className="flex flex-wrap items-center gap-4 mt-8"
                  >
                    <Link to="/courses" className="btn-primary">
                      {heroCopy.primary} <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/products" className="btn-ghost">
                      {heroCopy.secondary} <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </motion.div>

                <div className="hidden lg:block lg:col-span-5" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="container-x relative z-10 w-full pt-2 md:pt-8">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75 }}
                className="reference-hero-copy max-w-3xl"
              >
                <h1 className="mt-4 font-display text-[2.25rem] font-bold leading-[0.94] text-white sm:text-[2.8rem] md:mt-5 md:text-[3.6rem] lg:text-[4.35rem] xl:text-[4.85rem]">
                  {heroCopy.title}
                  <Typewriter text={heroCopy.accent} className="block text-[#8b5cf6]" />
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/86 md:mt-6 md:text-lg">
                  {heroCopy.subtitle}
                </p>
                <span className="reference-hero-kicker mt-5">
                  <Sparkles className="h-4 w-4" /> {heroCopy.eyebrow}
                </span>
                <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-8">
                  <Link to="/courses" className="reference-hero-primary">
                    {heroCopy.primary} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/products" className="reference-hero-secondary">
                    {heroCopy.secondary} <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="reference-hero-proof">
                  <span>Live Projects</span>
                  <span>AI + Full Stack</span>
                  <span>Career Mentoring</span>
                </div>
              </motion.div>

            </div>
          </>
        )}
      </section>

      {!isDark && (
        <section className="reference-highlights px-4 sm:px-6">
          <div className="container-x grid gap-10 py-14 md:grid-cols-3 md:py-20">
            {[
              { icon: ShieldCheck, title: 'Career Focused', desc: 'Training, internships and mentoring built around real production skills.' },
              { icon: Rocket, title: 'Product Studio', desc: 'Our team ships SaaS, AI tools and business platforms from the same ecosystem.' },
              { icon: Star, title: 'Premium Support', desc: 'From course selection to career growth, WorknAi keeps the path clear and practical.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <Icon className="mx-auto mb-5 h-12 w-12 stroke-[1.4] text-white" />
                <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-white">{title}</h2>
                <p className="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-white/78">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}


      {/* ============= OVERVIEW ============= */}
      <section className="section">
        <div className="container-x">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Welcome to WorknAi</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-3 leading-tight">Overview</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-violet-300 rounded-full mb-6" />
              <p className="text-ink-dim leading-relaxed mb-4">
                Whether the challenge is to establish a business, market it, or maintain it — we believe in understanding every challenge head-on and offering solutions that are bang-on. Boost your business technologically, digitally, and with expertise.
              </p>
              <p className="text-ink-dim leading-relaxed mb-8">
                We know the vitality of technological advancements and digital footprint in the present world. With a team of highly motivated and innovatively creative individuals, WorknAi is the best technical associate to help your business reach new heights.
              </p>
              <Link to="/about" className="btn-ghost inline-flex items-center gap-2 mb-12">
                Read More <ArrowRight className="w-4 h-4" />
              </Link>

              {/* 3 feature mini-cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: GraduationCap, label: 'Training' },
                  { icon: Rocket,        label: 'Products' },
                  { icon: Briefcase,     label: 'Careers' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="glass rounded-xl p-4 flex flex-col items-center gap-3 hover:border-violet-400/40 transition-all group">
                    <Icon className="w-7 h-7 text-violet-400 group-hover:text-violet-300 transition-colors" />
                    <span className="text-sm text-ink-dim group-hover:text-white transition-colors font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — 3 stacked cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col gap-0 rounded-2xl overflow-hidden"
            >
              {[
                {
                  label: 'Courses',
                  desc: 'Industry-ready tech courses taught by engineers who actually ship software.',
                  to: '/courses',
                  overlay: 'from-violet-900/60 to-violet-700/50',
                  img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
                },
                {
                  label: 'Products',
                  desc: 'HRMS, CRM, booking platforms and AI tooling — shipped from our R&D lab.',
                  to: '/products',
                  overlay: 'from-sky-900/60 to-sky-700/50',
                  img: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
                },
                {
                  label: 'Careers',
                  desc: "Experience tomorrow's workplace — join the WorknAi team today.",
                  to: '/career',
                  overlay: 'from-slate-900/60 to-slate-700/50',
                  img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
                },
              ].map(({ label, desc, to, overlay, img }) => (
                <Link key={label} to={to} className="group block px-8 py-10 relative overflow-hidden">
                  <img src={img} alt={label} className="media-clean-img absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                  <div className={`media-clean-overlay absolute inset-0 bg-gradient-to-r ${overlay} group-hover:opacity-90 transition-opacity`} />
                  <div className="relative">
                    <h3 className="font-display text-2xl font-bold text-white mb-2">{label}</h3>
                    <div className="w-8 h-0.5 bg-white/60 rounded-full mb-3" />
                    <p className="text-sm text-white/80 leading-relaxed max-w-xs">{desc}</p>
                    <ArrowUpRight className="absolute right-0 top-0 w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                </Link>
              ))}
            </motion.div>

          </div>
        </div>
      </section>


      {/* ============= PRODUCT LOGOS MARQUEE ============= */}
      <HomeProductLogoMarquee
        products={allProducts.length > 0 ? allProducts : products}
        isDark={isDark}
      />


      {/* ============= SERVICES ============= */}
      <section className="section bg-violet-900/10">
        <div className="container-x">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">What We Do</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-3">Services</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-violet-300 rounded-full mb-5" />
            <p className="text-ink-dim max-w-xl">End-to-end technology services that enhance your business reach and help you achieve your goals.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { icon: Monitor,       label: 'Web Development',   img: 'photo-1498050108023-c5249f4df085', slug: 'coding'        },
              { icon: Brain,         label: 'AI / ML',           img: 'photo-1677442135703-1787eea5ce01', slug: 'ai-ml'         },
              { icon: Smartphone,    label: 'Mobile Apps',       img: 'photo-1512941937669-90a1b58e7e9c', slug: 'mobile-app'    },
              { icon: Code2,         label: 'Software Dev',      img: 'photo-1461749280684-dccba630e2f6', slug: 'software'      },
              { icon: Database,      label: 'CRM / ERP',         img: 'photo-1553877522-43269d4ea984',    slug: 'software'      },
              { icon: GraduationCap, label: 'E-Learning',        img: 'photo-1456513080510-7bf3a84b82f8', slug: 'e-learning'    },
              { icon: Users,         label: 'HRMS',              img: 'photo-1552664730-d307ca884978', slug: 'virtual-staff' },
              { icon: Cloud,         label: 'Cloud & DevOps',    img: 'photo-1558494949-ef010cbdcc31',    slug: 'it-infra'      },
              { icon: Plug,          label: 'API Integration',   img: 'photo-1518770660439-4636190af475', slug: 'coding'        },
              { icon: Palette,       label: 'UI/UX Design',      img: 'photo-1561736778-92e52a7769ef',    slug: 'software'      },
              { icon: TrendingUp,    label: 'Digital Marketing', img: 'photo-1611974789855-9c2a0a7236a3', slug: 'software'      },
              { icon: Layers,        label: 'SaaS Products',     img: 'photo-1460925895917-afdab827c52f', slug: 'software'      },
            ].map(({ icon: Icon, label, img, slug }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/services/${slug}`}
                  className="relative group rounded-xl overflow-hidden flex flex-col items-center justify-center gap-3 py-10 border border-violet-500/10 hover:border-violet-500/40 transition-all block"
                >
                  <img
                    src={`https://images.unsplash.com/${img}?w=400&q=80`}
                    alt={label}
                    className="media-clean-img absolute inset-0 w-full h-full object-cover object-center opacity-55 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="media-clean-overlay absolute inset-0 bg-[#06030f]/45" />
                  <div className="relative w-14 h-14 rounded-2xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center group-hover:bg-violet-500/40 transition-colors">
                    <Icon className="w-7 h-7 text-violet-300 group-hover:text-white transition-colors" />
                  </div>
                  <span className="relative text-sm font-bold text-white tracking-wide group-hover:text-violet-200 transition-colors">{label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ============= COURSES PREVIEW ============= */}
      <section className="section">
        <div className="container-x">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <SectionHeader
              eyebrow="Industry-ready courses"
              title="Become the engineer"
              accent="you wished existed."
              subtitle="Job-oriented tech modules — taught by people who actually ship software for clients."
              align="left"
            />
            <Link to="/courses" className="btn-ghost shrink-0">
              All courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((c, i) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/courses/${c.slug}`}
                  className="glass-strong p-6 block group h-full hover:border-violet-400/50 transition-all relative overflow-hidden"
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-500/30 rounded-full blur-3xl group-hover:bg-violet-500/50 transition-colors" />
                  <div className="relative">
                    <div className="text-5xl mb-4">{c.icon}</div>
                    <div className="flex items-center gap-2 mb-2 text-xs">
                      <span className="chip !text-[10px]">{c.mode}</span>
                      <span className="text-ink-faint">· {c.duration}</span>
                    </div>
                    {c.startDate && (
                      <p className="mb-2 inline-flex items-center gap-1 text-xs text-ink-dim">
                        <Calendar className="h-3 w-3" /> Starts {formatCourseStartDate(c.startDate)}
                      </p>
                    )}
                    <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-violet-300 transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-sm text-ink-dim mb-6 line-clamp-2">{c.shortDescription}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-line2">
                      <span className="text-sm font-medium text-violet-300 group-hover:text-white transition-colors">
                        View Course
                      </span>
                      <ArrowUpRight className="w-5 h-5 text-ink-faint group-hover:text-violet-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ============= PRODUCTS ============= */}
      <section className="section bg-violet-900/10">
        <div className="container-x">
          <SectionHeader
            eyebrow="Our products"
            title="SaaS we build for"
            accent="real Indian businesses."
            subtitle="HRMS, CRM, booking platforms and AI tooling — shipped from our R&D lab."
          />

          <div className="grid md:grid-cols-2 gap-6">
            {popularProducts.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-strong p-4 md:p-8 group hover:border-violet-400/50 transition-all relative overflow-hidden"
              >
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/30 transition-colors" />
                <div className="relative flex flex-col sm:flex-row gap-4 md:gap-6">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 aspect-square rounded-[18px] sm:rounded-[22px] p-[3px] bg-gradient-to-br ${getCategoryGradient(p.category)} border border-white/25 shadow-lg flex items-center justify-center overflow-hidden`}>
                    <div className="w-full h-full rounded-[15px] sm:rounded-[19px] bg-slate-950/30 backdrop-blur-[2px] flex items-center justify-center p-2 overflow-hidden">
                      {productLogo(p) || (p.url && getFavicon(p.url)) ? (
                        <img
                          src={productLogo(p) || getFavicon(p.url)}
                          alt={p.title}
                          className="w-full h-full max-w-full max-h-full object-contain drop-shadow-md"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <span className="text-white font-bold text-lg sm:text-xl uppercase tracking-wider">{p.title?.slice(0, 2) || 'PR'}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                        p.isActive
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}>
                        {p.isActive ? 'Live' : 'Inactive'}
                      </span>
                      {p.category && <span className="text-xs text-ink-faint">{p.category}</span>}
                    </div>
                    <h3 className="font-display text-2xl font-semibold mb-1">{p.title}</h3>
                    <p className="text-sm text-ink-dim line-clamp-2 mb-4">{p.description}</p>
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-violet-300 hover:text-white font-medium"
                      >
                        Visit site <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products" className="btn-ghost">
              See all products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>


      {/* ============= FEATURES STRIP ============= */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="What we do"
            title="Four pillars,"
            accent="one mission."
          />
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: GraduationCap, title: 'Training',       desc: 'MERN, Python, .NET, PHP — taught for actual jobs.',       img: 'photo-1456513080510-7bf3a84b82f8' },
              { icon: Brain,         title: 'Software R&D',   desc: 'HRMS, CRM and AI products in active development.',        img: 'photo-1531297484001-80022131f5a1' },
              { icon: Cloud,         title: 'Cloud & DevOps', desc: 'Docker, VPS, CI/CD — we live in production.',             img: 'photo-1558494949-ef010cbdcc31' },
              { icon: Palette,       title: 'Digital Growth', desc: 'SEO, brand campaigns and automated web systems.',         img: 'photo-1611974789855-9c2a0a7236a3' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group rounded-2xl overflow-hidden border border-violet-500/10 hover:border-violet-400/40 transition-all"
              >
                <img
                  src={`https://images.unsplash.com/${f.img}?w=500&q=80`}
                  alt={f.title}
                  className="media-clean-img absolute inset-0 w-full h-full object-cover object-center opacity-55 group-hover:opacity-65 group-hover:scale-105 transition-all duration-500"
                />
                <div className="media-clean-overlay absolute inset-0 bg-[#06030f]/50" />
                <div className="relative p-6">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center mb-4 group-hover:bg-violet-500/30 transition-colors">
                    <f.icon className="w-6 h-6 text-violet-300" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2 text-white">{f.title}</h3>
                  <p className="text-sm text-ink-dim leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ============= CAREER STRIP ============= */}
      <section className="section bg-violet-900/10">
        <div className="container-x">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <SectionHeader
              eyebrow="Join the studio"
              title="Build alongside"
              accent="builders."
              subtitle="We're hiring engineers, designers and HR folk who like to ship."
              align="left"
            />
            <Link to="/career" className="btn-ghost shrink-0">
              All openings <Briefcase className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {jobs.map((j, i) => (
              <motion.div
                key={j._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/career/${j.slug}`} className="glass p-6 block group h-full hover:border-violet-400/50 transition-all">
                  <div className="flex items-center gap-2 mb-3 text-xs">
                    <span className="chip !text-[10px]">{j.type}</span>
                    <span className="text-ink-faint">· {j.workMode}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-violet-300 transition-colors">{j.title}</h3>
                  <p className="text-sm text-ink-dim mb-4 line-clamp-2">{j.description}</p>
                  <div className="flex items-center justify-between text-xs text-ink-faint pt-4 border-t border-line2">
                    <span>{j.location}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:text-violet-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ============= WORK WITH US ============= */}
      <section className={`relative py-20 md:py-28 px-4 overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#06030f]' : 'bg-[#f8fafc] border-y border-slate-200/80'
      }`}>
        {/* Ambient Gradient Glow Orbs */}
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[120px] pointer-events-none ${
          isDark
            ? 'bg-gradient-to-tr from-violet-600/20 via-purple-600/10 to-transparent'
            : 'bg-gradient-to-tr from-violet-400/15 via-indigo-300/15 to-transparent'
        }`} />
        <div className={`absolute -bottom-20 right-10 w-[500px] h-[300px] rounded-full blur-[100px] pointer-events-none ${
          isDark ? 'bg-indigo-600/15' : 'bg-violet-300/20'
        }`} />

        {/* Subtle Tech Grid Texture overlay */}
        <div 
          className={`absolute inset-0 pointer-events-none ${isDark ? 'opacity-[0.03]' : 'opacity-[0.06]'}`}
          style={{ backgroundImage: `radial-gradient(${isDark ? '#ffffff' : '#6366f1'} 1px, transparent 1px)`, backgroundSize: '32px 32px' }}
        />

        <div className="container-x relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 backdrop-blur-md border ${
                isDark
                  ? 'bg-violet-500/10 border-violet-500/25 text-violet-300'
                  : 'bg-violet-100/80 border-violet-300/60 text-violet-800'
              }`}>
                <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
                <span>Join With Us</span>
              </div>
              <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Work with us.{' '}
                <span className={`bg-clip-text text-transparent ${
                  isDark
                    ? 'bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300'
                    : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600'
                }`}>
                  Scale what matters.
                </span>
              </h2>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm sm:text-base mt-3 leading-relaxed`}>
                From our Pune R&amp;D lab to enterprise deployments, we engineer modern tech, train future engineers, and ship intelligent digital products.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <Link
                to="/career"
                className="btn-primary text-xs sm:text-sm px-5 py-2.5 inline-flex items-center gap-2 shadow-lg shadow-violet-600/25"
              >
                <span>View Open Positions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Bento-style Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { n: '01', stat: '5+',   label: 'Years Experience',      sub: 'Consistent software & AI delivery', icon: TrendingUp,     color: 'from-violet-500 to-indigo-500' },
              { n: '02', stat: '200+', label: 'Students Trained',      sub: 'Industry-ready engineers placed',   icon: GraduationCap,  color: 'from-blue-500 to-cyan-500' },
              { n: '03', stat: '2',    label: 'Development Centers',   sub: 'Pune R&D & Bangalore hub',          icon: Building2,      color: 'from-emerald-500 to-teal-500' },
              { n: '04', stat: '15+',  label: 'Products Built',        sub: 'Live scalable platforms shipped',   icon: Rocket,         color: 'from-fuchsia-500 to-pink-500' },
              { n: '05', stat: '50+',  label: 'Happy Clients',         sub: 'Trusting enterprise businesses',    icon: Users,          color: 'from-amber-500 to-orange-500' },
              { n: '06', stat: '5+',   label: 'Countries Served',      sub: 'Global software outreach',          icon: Globe,          color: 'from-sky-500 to-blue-600' },
              { n: '07', stat: '10+',  label: 'Tech Stacks',           sub: 'React, Node, Python, Cloud & AI',   icon: Layers,         color: 'from-purple-500 to-violet-600' },
              { n: '08', stat: '100+', label: 'Developments',          sub: 'Modules, tools & APIs shipped',     icon: Code2,          color: 'from-rose-500 to-red-500' },
              { n: '09', stat: '10+',  label: 'SaaS Products',         sub: 'Proprietary production systems',    icon: Zap,            color: 'from-yellow-400 to-amber-500' },
            ].map(({ n, stat, label, sub, icon: Icon, color }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden border ${
                  isDark
                    ? 'bg-gradient-to-b from-white/[0.05] to-white/[0.02] border-white/10 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-950/50'
                    : 'bg-white border-slate-200/90 shadow-sm hover:border-violet-400 hover:shadow-xl hover:shadow-violet-500/10'
                }`}
              >
                {/* Ambient Card Hover Glow */}
                <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full blur-2xl transition-colors pointer-events-none ${
                  isDark
                    ? 'bg-violet-500/10 group-hover:bg-violet-500/25'
                    : 'bg-violet-500/5 group-hover:bg-violet-500/15'
                }`} />

                {/* Top Row: Icon + Badge Index */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} p-0.5 shadow-md flex items-center justify-center`}>
                    <div className={`w-full h-full rounded-[10px] backdrop-blur-xs flex items-center justify-center ${
                      isDark ? 'bg-slate-950/60 text-white' : 'bg-white/95 text-slate-800 shadow-xs'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <span className={`font-mono text-xs font-semibold transition-colors ${
                    isDark
                      ? 'text-slate-500 group-hover:text-violet-400'
                      : 'text-slate-400 group-hover:text-violet-600'
                  }`}>
                    #{n}
                  </span>
                </div>

                {/* Stat Number */}
                <div className="mb-1">
                  <span className={`font-display text-4xl sm:text-5xl font-extrabold tracking-tight transition-all ${
                    isDark
                      ? 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-violet-200 group-hover:to-violet-400'
                      : 'text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-700 group-hover:via-indigo-700 group-hover:to-purple-700'
                  }`}>
                    {stat}
                  </span>
                </div>

                {/* Label & Description */}
                <h3 className={`font-display text-base font-bold transition-colors ${
                  isDark
                    ? 'text-slate-200 group-hover:text-white'
                    : 'text-slate-800 group-hover:text-violet-900'
                }`}>
                  {label}
                </h3>
                <p className={`text-xs mt-1 line-clamp-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {sub}
                </p>

                {/* Sleek bottom accent line */}
                <div className={`absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent to-transparent transition-all duration-500 ${
                  isDark
                    ? 'via-violet-500/0 group-hover:via-violet-500/60'
                    : 'via-violet-500/0 group-hover:via-violet-600'
                }`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ============= CONTACT STRIP ============= */}
      <section className="reference-contact-strip border-y border-violet-500/20 bg-[#0d0d1a]">
        <div className="container-x py-0">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-violet-500/20">
            {[
              {
                icon: MapPin,
                label: 'Office Locations',
                sub: 'Bangalore • Pune • Pimpri-Chinchwad',
                href: 'https://www.google.com/maps/search/?api=1&query=WorknAi%20Technologies%20Pune',
              },
              {
                icon: Mail,
                label: info?.email || 'info@worknai.com',
                sub: 'Online Support',
                href: `mailto:${info?.email || 'info@worknai.com'}`,
              },
              {
                icon: Globe,
                label: 'worknai.com',
                sub: 'For Discussion',
                href: 'https://worknai.com',
              },
            ].map(({ icon: Icon, label, sub, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="flex items-center gap-4 px-8 py-7 hover:bg-violet-500/10 transition-colors group"
              >
                <div className="w-11 h-11 rounded-full bg-violet-500/20 border border-violet-400/30 flex items-center justify-center shrink-0 group-hover:bg-violet-500/30 transition-colors">
                  <Icon className="w-5 h-5 text-violet-400 group-hover:text-violet-300 transition-colors" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{label}</p>
                  <p className="text-ink-dim text-xs">{sub}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
