import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Sparkles, GraduationCap, Rocket, Briefcase, Users,
  Code2, Brain, Cloud, Palette, ArrowUpRight, Star, Zap,
  Globe, Smartphone, Database, Layers, Plug, TrendingUp,
  Monitor, Phone, Mail, ShieldCheck, BookOpen, Calendar,
} from 'lucide-react';
import SectionHeader from '../../components/ui/SectionHeader';
import api from '../../utils/api';
import { formatPrice } from '../../utils/utils';
import { useTheme } from '../../context/ThemeContext';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

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

const MARQUEE_NAMES = [
  'GoAirClass', 'Punarmilan', 'Namastey India', 'OnlineGo',
  'Learning Hub', 'Car Rentals', 'Tour Hub',
];
const MARQUEE_ROW = [...MARQUEE_NAMES, ...MARQUEE_NAMES, ...MARQUEE_NAMES, ...MARQUEE_NAMES];
const darkHeroVideo = 'https://res.cloudinary.com/dqmg9yp6r/video/upload/only-us/hero.mp4';
const lightHeroVideo = '/hero2.mp4';

export default function Home() {
  const { isDark } = useTheme();
  const [info, setInfo] = useState(null);
  const [courses, setCourses] = useState([]);
  const [products, setProducts] = useState([]);
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
      api.get('/jobs?featured=true').then((r) => setJobs(r.data.data.slice(0, 3))),
    ]).catch(() => {});
  }, []);

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
                    <span className="block text-violet-300">{heroCopy.accent}</span>
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
            <div className="reference-hero-wash absolute inset-0 z-[1]" />
            <div className="reference-hero-bottom absolute inset-x-0 bottom-0 z-[1] h-[24%]" />

            <div className="container-x relative z-10 w-full pt-2 md:pt-8">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75 }}
                className="reference-hero-copy max-w-3xl"
              >
                <h1 className="mt-4 font-display text-[2.25rem] font-bold leading-[0.94] text-white sm:text-[2.8rem] md:mt-5 md:text-[3.6rem] lg:text-[4.35rem] xl:text-[4.85rem]">
                  {heroCopy.title}
                  <span className="block text-[#ff314f]">{heroCopy.accent}</span>
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


      {/* ============= MARQUEE ============= */}
      <div className="marquee-section">
        {/* Row 1 — scrolls RIGHT — violet text */}
        <div className="marquee-wrap">
          <div className="marquee-track marquee-right marquee-row-1">
            {MARQUEE_ROW.map((name, i) => (
              <span key={i} className="marquee-item">
                {name}
                <span className="marquee-sep">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* thin divider between rows */}
        <div className="marquee-divider" />

        {/* Row 2 — scrolls LEFT — lavender text */}
        <div className="marquee-wrap">
          <div className="marquee-track marquee-left marquee-row-2">
            {MARQUEE_ROW.map((name, i) => (
              <span key={i} className="marquee-item">
                {name}
                <span className="marquee-sep">◇</span>
              </span>
            ))}
          </div>
        </div>
      </div>


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
                    <div className="flex items-end justify-between">
                      <div>
                        {c.discountPrice ? (
                          <>
                            <span className="text-2xl font-display font-bold text-violet-gradient">
                              {formatPrice(c.discountPrice)}
                            </span>
                            <span className="text-xs text-ink-faint line-through ml-2">
                              {formatPrice(c.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-display font-bold text-violet-gradient">
                            {formatPrice(c.price)}
                          </span>
                        )}
                      </div>
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
            {products.map((p, i) => (
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
                  <div className="w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br from-violet-500/30 to-violet-700/30 border border-violet-400/30 flex items-center justify-center overflow-hidden">
                    {p.url && getFavicon(p.url) ? (
                      <img
                        src={getFavicon(p.url)}
                        alt={p.title}
                        className="w-10 h-10 object-contain"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <Code2 className="w-8 h-8 text-violet-400 opacity-60" />
                    )}
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
      <section className="work-with-us-section relative py-20 px-4 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Work with us"
          className="media-clean-img absolute inset-0 w-full h-full object-cover object-center opacity-30"
        />
        <div className="media-clean-overlay absolute inset-0 bg-[#06030f]/70" />
        <div className="container-x relative">
          <div className="work-with-us-heading mb-12">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Join With Us</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">Work with us</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-violet-300 rounded-full" />
          </div>

          <div className="work-stats-grid grid grid-cols-3 gap-x-12 gap-y-0">
            {[
              { n: '01', stat: '5+',   label: 'Years Experience' },
              { n: '02', stat: '200+', label: 'Students Trained' },
              { n: '03', stat: '2',    label: 'Development Centers' },
              { n: '04', stat: '15+',  label: 'Products Built' },
              { n: '05', stat: '50+',  label: 'Happy Clients' },
              { n: '06', stat: '5+',   label: 'Countries Served' },
              { n: '07', stat: '10+',  label: 'Tech Stacks' },
              { n: '08', stat: '100+', label: 'Developments' },
              { n: '09', stat: '10+',  label: 'SaaS Products' },
            ].map(({ n, stat, label }, i) => (
              <div
                key={n}
                className="work-stat-item flex items-center gap-5 border-b border-violet-400/40 py-7 group"
              >
                <span className="work-stat-number text-lg font-bold text-violet-400 font-display w-8 shrink-0">{n}</span>
                <div className="work-stat-divider w-px h-12 bg-violet-400/60 shrink-0" />
                <div className="work-stat-copy">
                  <p className="work-stat-value text-3xl font-bold text-white font-display leading-none mb-1 group-hover:text-violet-300 transition-colors">{stat}</p>
                  <p className="work-stat-label text-sm font-medium text-white/70">{label}</p>
                </div>
              </div>
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
                icon: Phone,
                label: info?.phone || '+91 99234 00442',
                sub: 'Mon–Sat 10am–7pm',
                href: `tel:${(info?.phone || '+919923400442').replace(/\s/g, '')}`,
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
