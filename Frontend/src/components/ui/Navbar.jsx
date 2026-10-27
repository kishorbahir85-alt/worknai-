import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ArrowUpRight, BookOpen, ChevronDown, Moon, Sun,
  FileText, Code2, ArrowRight, Briefcase, Sparkles, Bot, Cpu, Eye, Laptop, Calendar, CheckCircle2,
  FlaskConical, GraduationCap, Award, Mail, Users, TrendingUp
} from 'lucide-react';
import worknaiLogo from '../../assets/worknai_logo.png';
import { useTheme } from '../../context/ThemeContext';
import api from '../../utils/api';
import { productImage, productLogo } from '../../utils/productImage';

const BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
const resolveUrl = (url) => (url && !/^https?:\/\//.test(url) ? `${BASE}${url}` : url);

const resourcesItems = [
  { key: 'trending', to: '/trending-topics/overview', label: 'Trending Topics', icon: Sparkles },
  { key: 'courses', to: '/courses', label: 'Courses', icon: GraduationCap },
  { key: 'blog', to: '/blog', label: 'Blog', icon: FileText },
  { key: 'tutorials', to: '/tutorials', label: 'Tutorials', icon: BookOpen },
  { key: 'careers', to: '/career', label: 'Careers', icon: Briefcase },
];

const trendingSections = [
  {
    to: '/trending-topics/overview',
    label: 'Overview',
    badge: 'ECOSYSTEM',
    desc: 'How WorknAi transforms learning & software engineering through live production code and AI innovation.',
    icon: Sparkles,
  },
  {
    to: '/trending-topics/our-approach',
    label: 'Our Approach',
    badge: 'METHODOLOGY',
    desc: 'The Zero-Lag Architecture Principle — curriculum, mentorship, and real projects engineered together.',
    icon: Code2,
  },
  {
    to: '/trending-topics/success-stories',
    label: 'Success Stories',
    badge: 'CASE STUDIES',
    desc: 'Real outcomes: from student career transformations to enterprise SaaS and fleet telematics.',
    icon: Award,
  },
  {
    to: '/trending-topics/expert-voices',
    label: 'Expert Voices',
    badge: 'LEADERSHIP',
    desc: 'Perspectives on training, systems thinking, and technical careers from WorknAi founders and architects.',
    icon: Users,
  },
  {
    to: '/trending-topics/contact-us',
    label: 'Contact Us',
    badge: 'CONNECT',
    desc: 'Reach our team across Bangalore and Pune for corporate training, software builds, or partnerships.',
    icon: Mail,
  },
];

const formatBlogDate = (dateVal) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getShortCategory = (category = '') => {
  const cat = String(category || '').trim();
  if (!cat) return 'TECH';
  if (/robot/i.test(cat)) return 'ROBOTICS';
  if (/ai|artificial|intelligence|machine/i.test(cat)) return 'AI & ML';
  if (/software|engineer|code|dev|cloud/i.test(cat)) return 'SOFTWARE';
  if (/industry|logistic|market/i.test(cat)) return 'INDUSTRY';
  if (/tutorial|course|train/i.test(cat)) return 'TUTORIALS';
  if (/security/i.test(cat)) return 'SECURITY';
  return cat.toUpperCase();
};

const getCategoryBadgeColor = (category = '') => {
  const cat = String(category || '').toLowerCase();
  if (cat.includes('robot')) return 'bg-violet-500/20 text-violet-300 border-violet-500/40';
  if (cat.includes('ai') || cat.includes('intelligence')) return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
  if (cat.includes('software') || cat.includes('engineer') || cat.includes('code') || cat.includes('security')) return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
  if (cat.includes('industry') || cat.includes('logistic') || cat.includes('market')) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  if (cat.includes('tutorial') || cat.includes('train')) return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  return 'bg-violet-500/20 text-violet-300 border-violet-500/40';
};

const BLOG_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
];

const getBlogThumbnail = (post, idx = 0) => {
  if (post?.coverImage && !post.coverImage.includes('example.com')) {
    return resolveUrl(post.coverImage);
  }
  const cat = String(post?.category || '').toLowerCase();
  if (cat.includes('robot')) return BLOG_FALLBACK_IMAGES[0];
  if (cat.includes('ai') || cat.includes('intelligence')) return BLOG_FALLBACK_IMAGES[1];
  if (cat.includes('software') || cat.includes('engineer') || cat.includes('code') || cat.includes('security')) return BLOG_FALLBACK_IMAGES[2];
  if (cat.includes('logistic') || cat.includes('industry') || cat.includes('market')) return BLOG_FALLBACK_IMAGES[3];
  return BLOG_FALLBACK_IMAGES[idx % BLOG_FALLBACK_IMAGES.length];
};

const fallbackBlogs = [
  {
    slug: 'how-robotic-arms-are-transforming-small-scale-manufacturing',
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    category: 'Robotics',
    title: 'How Robotic Arms Are Transforming Small-Scale Manufacturing',
    createdAt: '2026-10-24T10:00:00.000Z'
  },
  {
    slug: 'building-rag-applications-with-openai-and-langchain',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&auto=format&fit=crop&q=80',
    category: 'AI & ML',
    title: 'Building RAG Applications with OpenAI and LangChain',
    createdAt: '2026-10-22T10:00:00.000Z'
  },
  {
    slug: 'a-complete-guide-to-deploying-nextjs-apps-on-vps',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80',
    category: 'Software',
    title: 'A Complete Guide to Deploying Next.js Apps on VPS',
    createdAt: '2026-10-20T10:00:00.000Z'
  },
  {
    slug: 'the-future-of-warehouse-robotics-in-india',
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80',
    category: 'Industry',
    title: 'The Future of Warehouse Robotics in India',
    createdAt: '2026-10-18T10:00:00.000Z'
  },
  {
    slug: 'setting-up-a-full-stack-development-environment-in-2026',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
    category: 'Tutorials',
    title: 'Setting Up a Full-Stack Development Environment in 2026',
    createdAt: '2026-10-16T10:00:00.000Z'
  }
];

const fallbackTutorials = [
  { slug: 'getting-started-with-ros2', coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80', difficulty: 'Intermediate', title: 'Mastering ROS 2 Navigation & SLAM', description: 'Step-by-step guide to deploying Nav2 costmaps and LiDAR mapping on physical robot rovers.' },
  { slug: 'isaac-sim-reinforcement-learning', coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80', difficulty: 'Advanced', title: 'Isaac Sim GPU Reinforcement Learning', description: 'Train robot manipulation policies at 10,000x real time and transfer zero-shot to Jetson.' }
];

const fallbackJobs = [
  { slug: 'robotics-software-engineer', title: 'Robotics Software Engineer (ROS 2 / C++)', location: 'Bengaluru / Remote', type: 'Full-time' },
  { slug: 'ai-computer-vision-engineer', title: 'Edge AI & Computer Vision Engineer', location: 'Hyderabad / Hybrid', type: 'Full-time' },
  { slug: 'embedded-hardware-architect', title: 'Embedded Hardware & PCB Architect', location: 'Bengaluru', type: 'Full-time' }
];

const fallbackCourses = [
  { slug: 'it-professionals-career-excellence-mvkm0ru2', title: 'IT Professionals Career Excellence', mode: 'hybrid', level: 'intermediate', duration: '3 Months' },
  { slug: 'business-growth-leadership-excellence-mvklzjun', title: 'Business Growth & Leadership Excellence', mode: 'offline', level: 'advanced', duration: '4 Months' },
  { slug: 'live-projects-ai-automation-training-mvkluy3c', title: 'Live Projects AI Automation Training', mode: 'hybrid', level: 'intermediate', duration: '3 Months' }
];

const roboticsItems = [
  {
    key: 'solutions',
    to: '/robotics#solutions',
    label: 'Solutions',
    icon: Bot,
    badge: 'ROBOTIC SYSTEMS',
    category: 'System Capabilities',
    title: 'Autonomous AMRs & Precision Kinematics',
    desc: 'Autonomous LiDAR SLAM rovers, 6-DOF industrial cobots, and physics-accurate digital twin simulations.',
    cta: 'Explore Solutions',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80',
    sublinks: [
      { label: 'Autonomous Mobile Robots (AMRs)', to: '/robotics#solutions' },
      { label: '6-DOF Cobots & Precision Kinematics', to: '/robotics#solutions' },
      { label: 'ROS 2 & Digital Twin Simulation', to: '/robotics#solutions' },
      { label: 'Embedded Micro-ROS Sensor Fusion', to: '/robotics#solutions' },
    ],
  },
  {
    key: 'industries',
    to: '/robotics#industries',
    label: 'Industries',
    icon: Cpu,
    badge: 'DEPLOYMENT VERTICALS',
    category: 'Deployment Verticals',
    title: 'Smart Manufacturing & Autonomous Logistics',
    desc: 'Adaptive pick-and-place, automated optical inspection, and SCADA-connected smart factory cells.',
    cta: 'View Verticals',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    sublinks: [
      { label: 'Industrial Automation & Assembly', to: '/robotics#industries' },
      { label: 'Warehouse & Logistics AMRs', to: '/robotics#industries' },
      { label: 'Automotive & High-Throughput Cells', to: '/robotics#industries' },
      { label: 'Electronics & Micro-Assembly', to: '/robotics#industries' },
    ],
  },
  {
    key: 'ai-vision',
    to: '/robotics#ai-vision',
    label: 'AI Vision',
    icon: Eye,
    badge: 'EDGE AI & VISION',
    category: 'Edge Intelligence',
    title: 'Real-Time Edge AI Vision & Spatial Intelligence',
    desc: 'Low-power high-throughput neural inference on NVIDIA Jetson for 3D depth perception and defect detection.',
    cta: 'Discover AI Vision',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
    sublinks: [
      { label: 'Automated Optical Inspection (AOI)', to: '/robotics#ai-vision' },
      { label: 'Stereo Depth & 3D Spatial Perception', to: '/robotics#ai-vision' },
      { label: 'NVIDIA Jetson & TensorRT Deployments', to: '/robotics#ai-vision' },
      { label: 'Micro-Surface Defect Classification', to: '/robotics#ai-vision' },
    ],
  },
  {
    key: 'research',
    to: '/research',
    label: 'Research',
    icon: FlaskConical,
    badge: 'ROBOTICS R&D',
    category: 'R&D & Engineering',
    title: 'From Robot Concept to Real-World Deployment',
    desc: 'End-to-end R&D lifecycle: CAD modeling, cleanroom SMT, Isaac Sim RL training, and factory edge deployment.',
    cta: 'Explore Research Pathways',
    image: '/research/research_rd_overview.png',
    sublinks: [
      { label: '01 · Design (CAD, Kinematics & Circuits)', to: '/research' },
      { label: '02 · Build (CNC Machining & SMT Assembly)', to: '/research' },
      { label: '03 · Train (Isaac Sim, Gym & RL Policies)', to: '/research' },
      { label: '04 · Deploy (ROS 2, Edge AI & Fleet Ops)', to: '/research' },
    ],
  },
  {
    key: 'training',
    to: '/robotics#training',
    label: 'Robotics Training',
    icon: Laptop,
    badge: 'HANDS-ON LABS',
    category: 'Hands-on R&D Labs',
    title: 'ROS 2 Hands-on Training & Engineering Kits',
    desc: '24+ module curriculum with LiDAR hardware kits and direct mentorship from robotics engineers.',
    cta: 'Explore Robotics Training',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
    sublinks: [
      { label: 'ROS 2 & MoveIt 2 Masterclass', to: '/robotics#training' },
      { label: 'Hardware Kits (LiDAR + 4WD AMR) Included', to: '/robotics#training' },
      { label: '6-Month Live Industry Internship', to: '/robotics#training' },
      { label: 'Robotics Engineer Certification', to: '/robotics#training' },
    ],
  },
  {
    key: 'demo',
    to: '/robotics#contact',
    label: 'Contact + Book Demo',
    icon: Sparkles,
    badge: 'LAB CONSULTATION',
    category: 'Consultation & Demo',
    title: 'Book a Live Robotics Lab Demo & Consultation',
    desc: 'Live hardware demonstrations, prototype inspection, and tailored technical feasibility analysis.',
    cta: 'Book Live Demo',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
    sublinks: [
      { label: 'Live Hardware & Rover Demonstrations', to: '/robotics#contact' },
      { label: 'Technical Feasibility & ROI Report', to: '/robotics#contact' },
      { label: 'Custom Enterprise Automation Scopes', to: '/robotics#contact' },
      { label: 'Consult a Robotics Architect', to: '/contact' },
    ],
  },
];

const navItems = [
  { key: 'overview', to: '/', label: 'Overview' },
  { key: 'products', to: '/products', label: 'Products' },
  { key: 'emarket', to: '/emarket', label: 'AI Innovation' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [roboticsOpen, setRoboticsOpen] = useState(false);
  const [mobileRoboticsOpen, setMobileRoboticsOpen] = useState(false);

  const [latestBlogs, setLatestBlogs] = useState([]);
  const [latestTutorials, setLatestTutorials] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [latestCourses, setLatestCourses] = useState([]);
  const [latestTrending, setLatestTrending] = useState([]);
  const [activeCategory, setActiveCategory] = useState('trending');
  const [activeRoboticsCategory, setActiveRoboticsCategory] = useState('solutions');
  const [resourceTopicFilter, setResourceTopicFilter] = useState('all');

  const [hoveredNav, setHoveredNav] = useState(null);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const resourcesRef = useRef(null);
  const roboticsRef = useRef(null);

  const getActiveNav = () => {
    const p = location.pathname;
    if (p === '/') return 'overview';
    if (p.startsWith('/emarket')) return 'emarket';
    if (p.startsWith('/products')) return 'products';
    if (
      p.startsWith('/courses') ||
      p.startsWith('/blog') ||
      p.startsWith('/tutorials') ||
      p.startsWith('/career') ||
      p.startsWith('/trending-topics')
    ) return 'resources';
    if (p.startsWith('/robotics')) return 'robotics';
    return null;
  };

  const activeNav = getActiveNav();
  const currentPill = resourcesOpen
    ? 'resources'
    : roboticsOpen
      ? 'robotics'
      : (hoveredNav || activeNav);

  useEffect(() => {
    api.get('/blog').then((r) => setLatestBlogs(r.data.data || [])).catch(() => { });
    api.get('/tutorials').then((r) => setLatestTutorials((r.data.data || []).slice(0, 2))).catch(() => { });
    api.get('/jobs').then((r) => setLatestJobs((r.data.data || []).slice(0, 2))).catch(() => { });
    api.get('/courses').then((r) => setLatestCourses((r.data.data || []).slice(0, 3))).catch(() => { });
    api.get('/trending').then((r) => setLatestTrending(r.data.data || [])).catch(() => { });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMobileResourcesOpen(false);
    setMobileRoboticsOpen(false);
    setResourcesOpen(false);
    setRoboticsOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target)) {
        setResourcesOpen(false);
      }
      if (roboticsRef.current && !roboticsRef.current.contains(e.target)) {
        setRoboticsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeResources();
        closeRobotics();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Lock page scroll while any overlay menu is open
  useEffect(() => {
    const anyMenuOpen = resourcesOpen || roboticsOpen || open;
    const { style } = document.body;
    if (anyMenuOpen) {
      style.overflow = 'hidden';
    } else {
      style.overflow = '';
    }
    return () => { style.overflow = ''; };
  }, [resourcesOpen, roboticsOpen, open]);

  const closeResources = () => { setResourcesOpen(false); };
  const closeRobotics = () => { setRoboticsOpen(false); };

  const toggleResources = () => {
    closeRobotics();
    setResourcesOpen((o) => {
      const willOpen = !o;
      if (willOpen) {
        const p = location.pathname;
        if (p.startsWith('/courses')) setActiveCategory('courses');
        else if (p.startsWith('/blog')) setActiveCategory('blog');
        else if (p.startsWith('/tutorials')) setActiveCategory('tutorials');
        else if (p.startsWith('/career')) setActiveCategory('careers');
        else if (p.startsWith('/trending-topics')) setActiveCategory('trending');
        else if (!activeCategory) setActiveCategory('trending');
      }
      return willOpen;
    });
  };

  const toggleRobotics = () => {
    closeResources();
    setRoboticsOpen((o) => {
      if (!o && !activeRoboticsCategory) setActiveRoboticsCategory('solutions');
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

  const renderNavLink = (item) => {
    const key = item.key || (item.to === '/' ? 'overview' : 'emarket');
    const isPill = currentPill === key;
    const isTextActive = isPill || activeNav === key;

    if (item.external || item.to.startsWith('http')) {
      return (
        <a
          key={key}
          href={item.to}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredNav(key)}
          className={`site-nav-link relative flex items-center h-10 px-4 text-sm font-medium transition-colors rounded-full whitespace-nowrap ${isTextActive ? 'text-ink font-medium' : 'text-ink-dim hover:text-ink'
            }`}
        >
          {item.label}
          {isPill && (
            <motion.span
              layoutId="site-nav-active-pill"
              className="site-nav-pill absolute inset-0 -z-10 rounded-full"
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            />
          )}
        </a>
      );
    }

    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.to === '/'}
        onMouseEnter={() => setHoveredNav(key)}
        className={`site-nav-link relative flex items-center h-10 px-4 text-sm font-medium transition-colors rounded-full whitespace-nowrap ${isTextActive ? 'text-ink font-medium' : 'text-ink-dim hover:text-ink'
          }`}
      >
        {item.label}
        {isPill && (
          <motion.span
            layoutId="site-nav-active-pill"
            className="site-nav-pill absolute inset-0 -z-10 rounded-full"
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          />
        )}
      </NavLink>
    );
  };

  const renderTextLink = (to, primary, secondary) => (
    <Link
      key={to}
      to={to}
      role="menuitem"
      onClick={() => { closeResources(); closeRobotics(); }}
      className="flex items-center justify-between gap-3 px-5 py-3.5 rounded-lg text-ink-dim hover:text-ink hover:bg-violet-500/10 transition-colors group"
    >
      <span className="flex flex-col min-w-0">
        <span className="text-base font-medium text-ink truncate">{primary}</span>
        {secondary && <span className="text-sm text-ink-faint truncate">{secondary}</span>}
      </span>
      <ArrowRight className="w-4 h-4 shrink-0 text-ink-faint group-hover:text-violet-400 transition-colors" />
    </Link>
  );

  // Big media card for the dropdown's right panel
  const renderMediaCard = (to, image, category, title, description, cta, FallbackIcon) => (
    <Link
      key={to}
      to={to}
      role="menuitem"
      onClick={() => { closeResources(); closeRobotics(); }}
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

  // Compute real featured case study & verified latest blog list
  const featuredStory = (latestTrending && latestTrending.length > 0)
    ? (latestTrending.find((t) => t.isFeatured) || latestTrending[0])
    : null;

  const displayedBlogs = (latestBlogs && latestBlogs.length > 0
    ? latestBlogs.filter((b) => b.title && b.slug)
    : fallbackBlogs
  ).slice(0, 5);

  const realAiCount = latestBlogs.filter((b) => /ai|artificial|intelligence|machine/i.test(b.category || '')).length || 3;
  const realSoftwareCount = latestBlogs.filter((b) => /software|engineer|cloud|microservice|security/i.test(b.category || '')).length || 4;
  const realRoboticsCount = latestBlogs.filter((b) => /robot/i.test(b.category || '')).length || 2;
  const realIndustryCount = latestBlogs.filter((b) => /industry|logistic|market/i.test(b.category || '')).length || 2;

  const topicFilterPills = [
    { id: 'all', label: 'All' },
    { id: 'ai', label: 'AI & ML' },
    { id: 'robotics', label: 'Robotics' },
    { id: 'software', label: 'Software Development' },
    { id: 'industry', label: 'Industry Insights' },
    { id: 'career', label: 'Career Growth' },
  ];

  const topicCards = [
    {
      id: 'ai',
      filterKey: 'ai',
      title: 'AI & Machine Learning',
      desc: 'Practical guides, research insights and real-world applications from our team.',
      countLabel: `${realAiCount} articles`,
      to: '/blog',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80',
      badgeBg: 'bg-indigo-600',
      icon: Cpu,
    },
    {
      id: 'robotics',
      filterKey: 'robotics',
      title: 'Robotics & Automation',
      desc: 'Latest advancements, projects and implementation insights.',
      countLabel: `${realRoboticsCount} articles`,
      to: '/robotics',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      badgeBg: 'bg-sky-500',
      icon: Bot,
    },
    {
      id: 'software',
      filterKey: 'software',
      title: 'Software Development',
      desc: 'Full-stack development, tools and best practices from our team.',
      countLabel: `${realSoftwareCount} articles`,
      to: '/blog',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      badgeBg: 'bg-violet-600',
      icon: Code2,
    },
    {
      id: 'industry',
      filterKey: 'industry',
      title: 'Industry Insights',
      desc: 'Trends, market analysis and real-world use cases from the industry.',
      countLabel: `${realIndustryCount} articles`,
      to: '/trending-topics/overview',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
      badgeBg: 'bg-amber-500',
      icon: TrendingUp,
    },
    {
      id: 'courses',
      filterKey: 'career',
      title: 'Courses & Learning',
      desc: 'Structured courses and learning materials to build your skills.',
      countLabel: `${latestCourses.length || 7} courses`,
      to: '/courses',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
      badgeBg: 'bg-emerald-500',
      icon: GraduationCap,
    },
    {
      id: 'careers',
      filterKey: 'career',
      title: 'Careers & Opportunities',
      desc: 'Career guidance, company updates and hiring insights.',
      countLabel: `${latestJobs.length || 13} articles`,
      to: '/career',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
      badgeBg: 'bg-blue-500',
      icon: Users,
    },
  ];

  const filteredTopicCards = topicCards.filter((card) => {
    if (resourceTopicFilter === 'all') return true;
    return card.filterKey === resourceTopicFilter;
  });

  // Slide-in-from-left wrapper for Resources right panel content
  const slideContent = (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategory || 'trending'}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="h-full"
      >
        {activeCategory === 'trending' && (
          <div className="flex flex-col gap-2 sm:gap-2.5">
            {/* Header: Eyebrow, Title and View all link */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                  TRENDING TOPICS
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight leading-snug">
                  Explore Real Insights from <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-sky-400 bg-clip-text text-transparent">AI, Robotics &amp; Tech</span>
                </h3>
                <Link
                  to="/trending-topics/overview"
                  onClick={closeResources}
                  className="text-xs font-semibold text-violet-400 hover:text-violet-300 inline-flex items-center gap-1 shrink-0 group transition-colors"
                >
                  View all topics <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                Articles, courses, tutorials and case studies from our team and community.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 my-1 overflow-x-auto pb-0.5 scrollbar-none">
              {topicFilterPills.map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setResourceTopicFilter(pill.id)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                    resourceTopicFilter === pill.id
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                      : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/5'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* 3x2 Grid of Topic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
              {filteredTopicCards.map((card) => {
                const CardIcon = card.icon;
                return (
                  <Link
                    key={card.id}
                    to={card.to}
                    role="menuitem"
                    onClick={closeResources}
                    className="group relative rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-violet-500/40 transition-all p-2 sm:p-2.5 flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* Image with Floating Icon */}
                      <div className="relative h-20 sm:h-22 md:h-24 w-full rounded-lg overflow-hidden mb-1.5 bg-violet-950/40">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                        <div className={`absolute bottom-1.5 left-1.5 w-6 h-6 rounded-md ${card.badgeBg} text-white flex items-center justify-center shadow-md`}>
                          <CardIcon className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <h4 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-violet-200 transition-colors leading-snug truncate">
                        {card.title}
                      </h4>
                      <p className="text-[10.5px] text-slate-400 mt-0.5 line-clamp-1 leading-normal">
                        {card.desc}
                      </p>
                    </div>

                    {/* Bottom Footer */}
                    <div className="mt-1.5 pt-1.5 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <FileText className="w-3 h-3 text-slate-500" />
                        <span>{card.countLabel}</span>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-violet-500/15 text-violet-300 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all">
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
              {filteredTopicCards.length === 0 && (
                <div className="col-span-3 py-6 text-center text-slate-400 text-xs">
                  No resources found for this topic filter.
                </div>
              )}
            </div>
          </div>
        )}

        {activeCategory === 'blog' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl">
            {(latestBlogs && latestBlogs.length > 0 ? latestBlogs : fallbackBlogs).map((post) =>
              renderMediaCard(
                `/blog/${post.slug}`,
                post.coverImage,
                post.category,
                post.title,
                post.excerpt || post.summary || 'Read our latest in-depth technical analysis and research notes.',
                'Read more',
                FileText
              )
            )}
          </div>
        )}

        {activeCategory === 'tutorials' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl">
            {(latestTutorials && latestTutorials.length > 0 ? latestTutorials : fallbackTutorials).map((tut) =>
              renderMediaCard(
                `/tutorials/${tut.slug}`,
                tut.coverImage,
                tut.difficulty || tut.category,
                tut.title,
                tut.description || 'Comprehensive step-by-step robotics engineering guides.',
                'Start learning',
                BookOpen
              )
            )}
          </div>
        )}

        {activeCategory === 'courses' && (
          <div className="flex flex-col gap-1 max-w-lg">
            <div className="flex items-center justify-between px-5 mb-3">
              <p className="text-xs uppercase tracking-wider text-ink-faint font-semibold">Our Programs</p>
              <Link
                to="/courses"
                onClick={() => { closeResources(); closeRobotics(); }}
                className="text-xs text-violet-400 hover:text-violet-300 font-medium inline-flex items-center gap-1"
              >
                View all courses <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {(latestCourses && latestCourses.length > 0 ? latestCourses : fallbackCourses).map((course) =>
              renderTextLink(
                `/courses/${course.slug || course._id}`,
                course.title,
                [
                  course.mode ? course.mode.charAt(0).toUpperCase() + course.mode.slice(1) : null,
                  course.level ? course.level.charAt(0).toUpperCase() + course.level.slice(1) : null,
                  course.duration
                ].filter(Boolean).join(' · ')
              )
            )}
          </div>
        )}

        {activeCategory === 'careers' && (
          <div className="flex flex-col gap-1 max-w-lg">
            <p className="text-xs uppercase tracking-wider text-ink-faint px-5 mb-3 font-semibold">Open Roles</p>
            {(latestJobs && latestJobs.length > 0 ? latestJobs : fallbackJobs).map((job) =>
              renderTextLink(`/career/${job.slug || job._id}`, job.title, `${job.location} · ${job.type}`)
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );

  // Slide-in right panel content for Robotics mega-dropdown
  const roboticsSlideContent = (
    <AnimatePresence mode="wait">
      {(() => {
        const item = roboticsItems.find((r) => r.key === activeRoboticsCategory) || roboticsItems[0];
        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="grid lg:grid-cols-12 gap-8 items-center h-full"
          >
            <div className="lg:col-span-5 flex flex-col justify-between h-full py-1">
              <div>
                <span className="chip w-fit mb-2.5 text-xs">{item.category}</span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-ink mb-2 leading-snug">{item.title}</h3>
                <p className="text-xs sm:text-sm text-ink-dim leading-relaxed mb-5">{item.desc}</p>

                <div className="mb-6">
                  <p className="text-[11px] uppercase tracking-wider text-ink-faint font-bold mb-2.5">Key Highlights</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                    {item.sublinks.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.to}
                        onClick={closeRobotics}
                        className="flex items-center gap-2 text-xs font-medium text-ink-dim hover:text-ink hover:text-violet-300 transition-colors group py-0.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="truncate">{sub.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                to={item.to}
                onClick={closeRobotics}
                className="btn-primary w-fit text-xs sm:text-sm font-semibold !px-5 !py-2.5"
              >
                {item.cta} <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="lg:col-span-7 h-full flex items-center justify-center">
              <Link
                to={item.to}
                onClick={closeRobotics}
                className="group relative w-full h-[280px] sm:h-[330px] md:h-[360px] rounded-2xl overflow-hidden border border-violet-500/40 shadow-2xl shadow-violet-600/30 ring-1 ring-violet-400/25 bg-violet-950/30 block"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-md bg-black/80 backdrop-blur-md border border-violet-400/40 text-[10px] uppercase font-bold tracking-widest text-violet-200 shadow-xl flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  {item.badge || 'ROBOTICS R&D'}
                </div>
              </Link>
            </div>
          </motion.div>
        );
      })()}
    </AnimatePresence>
  );

  const renderRoboticsDropdown = () => {
    const isPill = currentPill === 'robotics';
    const isTextActive = isPill || activeNav === 'robotics' || roboticsOpen;

    return (
      <div className="relative" ref={roboticsRef}>
        <button
          type="button"
          onClick={toggleRobotics}
          onMouseEnter={() => setHoveredNav('robotics')}
          aria-haspopup="true"
          aria-expanded={roboticsOpen}
          className={`site-nav-link relative flex items-center h-10 gap-1 px-4 text-sm font-medium transition-colors rounded-full whitespace-nowrap ${isTextActive ? 'text-ink font-medium' : 'text-ink-dim hover:text-ink'
            }`}
        >
          Robotic Innovation
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${roboticsOpen ? 'rotate-180' : ''}`} />
          {isPill && (
            <motion.span
              layoutId="site-nav-active-pill"
              className="site-nav-pill absolute inset-0 -z-10 rounded-full"
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            />
          )}
        </button>

        <AnimatePresence>
          {roboticsOpen && (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              role="menu"
              className={`site-menu-surface fixed left-4 sm:left-6 md:left-10 top-20 w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-5rem)] max-w-[1360px] h-[80vh] border rounded-2xl shadow-2xl z-50 overflow-hidden grid grid-cols-[300px_1fr] ${
                isDark
                  ? 'bg-[#0d0d1a] border-violet-500/20 shadow-violet-900/20'
                  : 'bg-white border-slate-200/80 shadow-slate-200/30'
              }`}
            >
              <div className="py-4 border-r border-violet-500/10 overflow-y-auto">
                <div className="px-6 py-2 mb-2">
                  <span className="text-xs uppercase tracking-widest text-violet-400 font-semibold">Robotic Innovation Navigation</span>
                </div>
                {roboticsItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.key}
                      to={item.to}
                      role="menuitem"
                      onClick={closeRobotics}
                      onMouseEnter={() => setActiveRoboticsCategory(item.key)}
                      className={`w-full flex items-center justify-between gap-3 px-6 py-4 text-base transition-colors border-l-2 ${activeRoboticsCategory === item.key
                        ? 'bg-violet-500/20 text-ink border-violet-400'
                        : 'text-ink-dim hover:text-ink hover:bg-violet-500/10 border-transparent'
                        }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-violet-400" />
                        {item.label}
                      </span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </Link>
                  );
                })}
                <div className="border-t border-violet-500/10 my-3 mx-6" />
                <Link
                  to="/robotics"
                  role="menuitem"
                  onClick={closeRobotics}
                  className="flex items-center justify-between gap-2.5 px-6 py-3 text-sm text-violet-300 hover:text-ink hover:bg-violet-500/10 transition-colors"
                >
                  Full Robotics Overview
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="p-8 overflow-y-auto">
                {roboticsSlideContent}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderResourcesDropdown = () => {
    const isPill = currentPill === 'resources';
    const isTextActive = isPill || activeNav === 'resources' || resourcesOpen;

    return (
      <div className="relative" ref={resourcesRef}>
        <button
          type="button"
          onClick={toggleResources}
          onMouseEnter={() => setHoveredNav('resources')}
          aria-haspopup="true"
          aria-expanded={resourcesOpen}
          className={`site-nav-link relative flex items-center h-10 gap-1 px-4 text-sm font-medium transition-colors rounded-full whitespace-nowrap ${isTextActive ? 'text-ink font-medium' : 'text-ink-dim hover:text-ink'
            }`}
        >
          Resources
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${resourcesOpen ? 'rotate-180' : ''}`} />
          {isPill && (
            <motion.span
              layoutId="site-nav-active-pill"
              className="site-nav-pill absolute inset-0 -z-10 rounded-full"
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
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
              className={`site-menu-surface fixed left-2 sm:left-4 md:left-6 lg:left-8 top-16 sm:top-16 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] md:w-[calc(100%-3rem)] max-w-[1380px] h-auto border rounded-2xl sm:rounded-3xl shadow-2xl z-50 overflow-hidden grid grid-cols-1 lg:grid-cols-[190px_1fr_310px] ${
                isDark
                  ? 'bg-[#080915] border-violet-500/25 shadow-violet-950/60'
                  : 'bg-white border-slate-200 shadow-slate-200/40'
              }`}
            >
              {/* Column 1: Left Navigation Links */}
              <div className="p-3 border-r border-violet-500/10 flex flex-col gap-1 overflow-y-auto lg:overflow-visible">
                {resourcesItems.map(({ key, to, label, icon: Icon }) => {
                  const isActive = activeCategory === key;
                  return (
                    <Link
                      key={key}
                      to={to}
                      role="menuitem"
                      onClick={closeResources}
                      onMouseEnter={() => setActiveCategory(key)}
                      className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-violet-300'}`} />
                        {label}
                      </span>
                      <ArrowRight className={`w-3 h-3 shrink-0 transition-transform ${isActive ? 'text-white translate-x-0.5' : 'text-slate-500 group-hover:text-white group-hover:translate-x-0.5'}`} />
                    </Link>
                  );
                })}
              </div>

              {/* Column 2: Center Main Content */}
              <div className="p-3 sm:p-3.5 md:p-4 border-r border-violet-500/10 overflow-y-auto lg:overflow-visible">
                {slideContent}
              </div>

              {/* Column 3: Right Sidebar - Latest Resources */}
              <div className="p-3 sm:p-3.5 md:p-4 flex flex-col gap-2 overflow-y-auto lg:overflow-visible">
                <div className="flex items-center justify-between pb-1.5 border-b border-violet-500/10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                    Latest Resources
                  </span>
                  <Link
                    to="/blog"
                    onClick={closeResources}
                    className="text-[11px] text-violet-400 hover:text-violet-300 font-medium inline-flex items-center gap-1 group transition-colors"
                  >
                    View all articles <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                <div className="flex flex-col gap-1.5">
                  {displayedBlogs.slice(0, 5).map((post, idx) => {
                    const thumb = getBlogThumbnail(post, idx);
                    const cat = getShortCategory(post.category);
                    const dateStr = formatBlogDate(post.createdAt);
                    return (
                      <Link
                        key={post.slug || post._id || idx}
                        to={`/blog/${post.slug}`}
                        role="menuitem"
                        onClick={closeResources}
                        className="group p-1.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-violet-500/25 transition-all flex items-center gap-2.5"
                      >
                        <div className="w-[44px] h-[44px] rounded-lg overflow-hidden bg-violet-950/40 shrink-0 border border-white/10">
                          <img
                            src={thumb}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-[8.5px] font-bold uppercase px-1 py-0.2 rounded bg-violet-500/20 text-violet-300 tracking-wider">
                                {cat}
                              </span>
                              {dateStr && (
                                <span className="text-[9.5px] text-slate-400 truncate">
                                  {dateStr}
                                </span>
                              )}
                            </div>
                            <ArrowRight className="w-2.5 h-2.5 text-violet-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                          <h5 className="text-[11px] font-semibold text-white leading-tight line-clamp-1 group-hover:text-violet-200 transition-colors">
                            {post.title}
                          </h5>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };



  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`site-navbar fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${scrolled
          ? isDark
            ? 'bg-[#0d0d1a]/90 backdrop-blur-xl border-b border-violet-500/20 shadow-lg shadow-violet-900/10'
            : 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-lg shadow-slate-200/20'
          : isDark
            ? 'bg-[#0d0d1a]/70 backdrop-blur-md border-b border-white/5'
            : 'bg-white/80 backdrop-blur-md border-b border-slate-100'
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-2 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0 self-center">
            <img src={worknaiLogo} alt="WorknAi" className="site-logo-img h-8 sm:h-9 md:h-9 w-auto max-w-[150px] sm:max-w-[165px] object-contain filter drop-shadow-[0_2px_10px_rgba(139,92,246,0.3)] transition-transform duration-300 group-hover:scale-105" />
          </Link>

          {/* Desktop nav */}
          <div
            className="hidden lg:flex items-center gap-2 flex-1 justify-center self-center"
            onMouseLeave={() => setHoveredNav(null)}
          >
            {navItems.map(renderNavLink)}
            {renderResourcesDropdown()}
            {renderRoboticsDropdown()}
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
            <div className={`site-menu-surface border-b px-6 py-4 flex flex-col gap-1 max-h-[85vh] overflow-y-auto ${
              isDark ? 'bg-[#0d0d1a] border-violet-500/20' : 'bg-white border-slate-200/80'
            }`}>
              {navItems.map((item) =>
                item.external || item.to.startsWith('http') ? (
                  <a
                    key={item.key || item.to}
                    href={item.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-4 py-3 text-base font-medium rounded-xl text-ink-dim hover:text-ink hover:bg-violet-500/10 transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-violet-400" />
                  </a>
                ) : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-3 text-base font-medium rounded-xl ${isActive
                        ? 'bg-violet-500/20 text-ink border border-violet-400/30'
                        : 'text-ink-dim hover:text-ink hover:bg-violet-500/10'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                )
              )}



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
                            `flex items-center gap-2.5 px-4 py-2.5 text-sm rounded-xl ${isActive
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

              {/* Robotics accordion (mobile) */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileRoboticsOpen((o) => !o)}
                  aria-haspopup="true"
                  aria-expanded={mobileRoboticsOpen}
                  className="w-full flex items-center justify-between px-4 py-3 text-base font-medium rounded-xl text-ink-dim hover:text-ink hover:bg-violet-500/10 transition-colors"
                >
                  Robotic Innovation
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileRoboticsOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileRoboticsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      role="menu"
                      className="overflow-hidden flex flex-col gap-1 pl-4"
                    >
                      {roboticsItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                          key={to}
                          to={to}
                          role="menuitem"
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 px-4 py-2.5 text-sm rounded-xl ${isActive
                              ? 'bg-violet-500/20 text-ink border border-violet-400/30'
                              : 'text-ink-dim hover:text-ink hover:bg-violet-500/10'
                            }`
                          }
                        >
                          <Icon className="w-4 h-4 text-violet-400" />
                          {label}
                        </NavLink>
                      ))}
                      <NavLink
                        to="/robotics"
                        role="menuitem"
                        className="flex items-center justify-between gap-2.5 px-4 py-2.5 text-sm text-violet-300 hover:text-ink hover:bg-violet-500/10 rounded-xl transition-colors"
                      >
                        All Robotics Content
                        <ArrowRight className="w-3.5 h-3.5" />
                      </NavLink>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
