import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ExternalLink, Code2, ArrowLeft, AlertCircle, Loader2, CheckCircle2,
  PlayCircle, X, Sparkles, Layers, ChevronDown, Rocket, Quote, Star,
  Zap, ShieldCheck, Globe2, TrendingUp, Send, User, Mail, Phone, Building2,
  MessageSquare, ShoppingCart,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { categoryImage, resolveUrl } from '../../utils/productImage';

function getEmbedUrl(videoUrl) {
  if (!videoUrl) return null;
  const yt = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = videoUrl.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

const FEATURE_ICONS = [Zap, ShieldCheck, Globe2, Sparkles, Rocket, Layers, CheckCircle2, Code2];

// Scroll pe fade-up reveal — har section isi se enter hota hai
const Reveal = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.55, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

// Left-aligned professional section header
const SectionHead = ({ eyebrow, title, sub }) => (
  <div className="max-w-2xl mb-10 md:mb-14">
    <p className="text-sm font-medium text-violet-400 mb-3">{eyebrow}</p>
    <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">{title}</h2>
    {sub && <p className="text-ink-dim mt-3 leading-relaxed">{sub}</p>}
  </div>
);

const TESTIMONIAL_NAMES = [
  { name: 'Aarav Mehta', role: 'Product Manager' },
  { name: 'Priya Sharma', role: 'Operations Lead' },
  { name: 'Rohan Verma', role: 'CTO' },
];

const enquiryInp = 'w-full bg-white/5 border border-violet-500/20 rounded-xl py-3 px-4 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-violet-400/60 transition-all';
const enquiryLbl = 'block text-xs font-semibold text-ink-dim mb-1.5 uppercase tracking-wider';

const PRODUCT_ENQUIRY_TYPES = [
  {
    key: 'product',
    type: 'Product Inquiry',
    source: 'product-inquiry',
    label: 'Product Inquiry',
    shortDescription: 'Features, demo, integration, or support questions',
    heading: (title) => `Ask about ${title}`,
    description: (title) => `Tell us what you would like to know about ${title} and our product team will help you.`,
    placeholder: (title) => `What would you like to know about ${title}?`,
    submitLabel: 'Send Product Inquiry',
    success: 'Your product inquiry has been sent to our team.',
    icon: MessageSquare,
  },
  {
    key: 'purchase',
    type: 'Purchase Inquiry',
    source: 'product-purchase-inquiry',
    label: 'Purchase Inquiry',
    shortDescription: 'Pricing, plans, licenses, and purchase assistance',
    heading: (title) => `Purchase ${title}`,
    description: (title) => `Share your requirements and our sales team will help you purchase the right ${title} plan.`,
    placeholder: (title) => `Tell us how you plan to use ${title}, expected users, or any pricing questions...`,
    submitLabel: 'Send Purchase Inquiry',
    success: 'Your purchase inquiry has been sent to our sales team.',
    icon: ShoppingCart,
  },
  {
    key: 'investor',
    type: 'Investor Interest',
    source: 'investor-enquiry',
    label: 'Investor Inquiry',
    shortDescription: 'Investment, partnership, and growth opportunities',
    heading: (title) => `Invest in ${title}`,
    description: (title) => `Interested in investing in ${title}? Share your details and our team will connect with you.`,
    placeholder: (title) => `Tell us about your investment interest in ${title}...`,
    submitLabel: 'Send Investment Interest',
    success: 'Your investment interest has been sent to our team.',
    icon: TrendingUp,
  },
];

function ProductEnquirySection({ product }) {
  const [activeType, setActiveType] = useState('product');
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sentType, setSentType] = useState('');
  const enquiry = PRODUCT_ENQUIRY_TYPES.find((item) => item.key === activeType) || PRODUCT_ENQUIRY_TYPES[0];
  const ActiveIcon = enquiry.icon;

  const f = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const selectType = (key) => {
    setActiveType(key);
    setSentType('');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Name, email and message are required');
      return;
    }
    setLoading(true);
    try {
      await api.post('/inquiries', {
        ...form,
        type: enquiry.type,
        source: enquiry.source,
        product: product._id,
      });
      setSentType(enquiry.key);
      setForm({ name: '', email: '', phone: '', company: '', message: '' });
      toast.success(enquiry.success);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not send your enquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid sm:grid-cols-3 gap-3 mb-5" role="tablist" aria-label="Product inquiry type">
        {PRODUCT_ENQUIRY_TYPES.map((item) => {
          const Icon = item.icon;
          const selected = activeType === item.key;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => selectType(item.key)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                selected
                  ? 'bg-violet-500/15 border-violet-400/60 shadow-[0_12px_35px_-18px_rgba(139,92,246,0.9)]'
                  : 'bg-white/[0.03] border-white/10 hover:border-violet-400/35 hover:bg-white/[0.05]'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                selected ? 'bg-violet-500/25 text-violet-300' : 'bg-white/5 text-ink-dim'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-ink">{item.label}</div>
              <div className="text-xs text-ink-faint leading-relaxed mt-1">{item.shortDescription}</div>
            </button>
          );
        })}
      </div>

      <form onSubmit={submit} className="glass-strong rounded-2xl p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold">{enquiry.label}</p>
            <h2 className="text-2xl font-bold text-ink mt-1">{enquiry.heading(product.title)}</h2>
            <p className="text-sm text-ink-dim mt-2 max-w-xl">{enquiry.description(product.title)}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-400/30 flex items-center justify-center shrink-0">
            <ActiveIcon className="w-5 h-5 text-violet-400" />
          </div>
        </div>

        {sentType === enquiry.key && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>Thanks! {enquiry.success}</span>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={enquiryLbl}><User className="w-3.5 h-3.5 inline mr-1" />Name *</label>
            <input className={enquiryInp} value={form.name} onChange={f('name')} placeholder="Your full name" />
          </div>
          <div>
            <label className={enquiryLbl}><Mail className="w-3.5 h-3.5 inline mr-1" />Email *</label>
            <input type="email" className={enquiryInp} value={form.email} onChange={f('email')} placeholder="you@example.com" />
          </div>
          <div>
            <label className={enquiryLbl}><Phone className="w-3.5 h-3.5 inline mr-1" />Phone</label>
            <input className={enquiryInp} value={form.phone} onChange={f('phone')} placeholder="+91 99999 99999" />
          </div>
          <div>
            <label className={enquiryLbl}><Building2 className="w-3.5 h-3.5 inline mr-1" />{activeType === 'investor' ? 'Company / Fund' : 'Company / Organization'}</label>
            <input className={enquiryInp} value={form.company} onChange={f('company')} placeholder="Optional" />
          </div>
          <div className="sm:col-span-2">
            <label className={enquiryLbl}>Message *</label>
            <textarea className={`${enquiryInp} min-h-28 resize-y`} value={form.message} onChange={f('message')} placeholder={enquiry.placeholder(product.title)} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary justify-center w-full mt-6 disabled:opacity-60">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> {enquiry.submitLabel}</>}
        </button>
      </form>
    </div>
  );
}

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className={`glass rounded-xl overflow-hidden transition-colors ${isOpen ? 'border-violet-400/50' : ''}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-medium text-ink">{faq.question}</span>
        <ChevronDown className={`w-4 h-4 text-violet-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-ink-dim leading-relaxed text-sm">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api.get(`/products/${slug}`)
      .then((res) => setProduct(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
    </div>
  );

  if (notFound || !product) return (
    <section className="py-20 text-center px-4">
      <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-ink mb-2">Product not found</h1>
      <p className="text-ink-dim mb-6">This product may have been removed or doesn't exist.</p>
      <Link to="/products" className="btn-primary"><ArrowLeft className="w-4 h-4" /> Back to Products</Link>
    </section>
  );

  const embedUrl = getEmbedUrl(product.videoUrl);
  const seed = product.slug || product.title || 'product';

  const heroImage = product.heroImage
    ? resolveUrl(product.heroImage)
    : product.gallery?.[0]
    ? resolveUrl(product.gallery[0])
    : categoryImage(product, 'hero', 1600, 1000);
  const heroVideoSrc = product.heroVideo ? resolveUrl(product.heroVideo) : null;

  // Build a gallery: real screenshots first, padded with category-relevant images up to 4
  const galleryImages = [
    ...(product.gallery || []).map((g) => resolveUrl(g)),
  ];
  while (galleryImages.length < 4) {
    galleryImages.push(categoryImage(product, `shot-${galleryImages.length}`, 900, 600));
  }

  // Each panel prefers its OWN dedicated upload, then any other real product image,
  // and only falls back to a themed stock photo when nothing has been uploaded.
  const realImages = [product.heroImage, ...(product.gallery || [])].filter(Boolean).map((g) => resolveUrl(g));
  const overviewImage = product.overviewImage
    ? resolveUrl(product.overviewImage)
    : realImages[0] || categoryImage(product, 'overview', 900, 700);
  const benefitsImage = product.benefitsImage
    ? resolveUrl(product.benefitsImage)
    : realImages[1] || realImages[0] || categoryImage(product, 'benefits', 900, 700);

  const testimonialAvatar = (key) => `https://i.pravatar.cc/100?u=${encodeURIComponent(seed + key)}`;

  return (
    <div>
      {/* ===== Full-screen Hero ===== */}
      <section className="product-hero relative min-h-[100svh] sm:min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[#0d0d1a]">
          {heroVideoSrc ? (
            <video src={heroVideoSrc} autoPlay muted loop playsInline poster={heroImage} className="w-full h-full object-cover" />
          ) : (
            <img
              src={heroImage}
              alt={product.title}
              className="hero-media-zoom w-full h-full object-cover"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = categoryImage(product, 'hero', 1600, 1000); }}
            />
          )}
        </div>
        <div className="product-hero-wash absolute inset-0" />
        {/* Bottom cinematic fade — stats readable rahein */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

        <div className="w-full relative z-10 pt-20 pb-16 px-5 sm:px-8 lg:px-14">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to="/products" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-8 transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Products
            </Link>
          </motion.div>

          <div className="max-w-3xl">
            {/* Badge row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-violet-500/30 to-violet-700/30 border border-violet-400/30 backdrop-blur-md flex items-center justify-center overflow-hidden shadow-[0_10px_40px_-10px_rgba(122,59,255,0.6)]">
                {product.logoUrl ? (
                  <img src={resolveUrl(product.logoUrl)} alt={product.title} className="w-full h-full object-contain p-2" />
                ) : (
                  <Code2 size={24} className="text-violet-300" />
                )}
              </div>
              {product.category && <span className="chip backdrop-blur-md">{product.category}</span>}
              {product.url && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-emerald-500/15 border border-emerald-400/30 backdrop-blur-md text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                </span>
              )}
            </motion.div>

            {/* Title + tagline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16 }}
              className="display-h text-4xl sm:text-6xl lg:text-7xl text-white leading-[1.02] drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
            >
              {product.title}
            </motion.h1>
            {product.tagline && (
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.26 }}
                className="text-white/85 text-lg sm:text-2xl mt-5 max-w-2xl font-light leading-relaxed"
              >
                {product.tagline}
              </motion.p>
            )}

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.36 }}
              className="flex flex-wrap gap-3 mt-9"
            >
              {product.url && (
                <a href={product.url} target="_blank" rel="noreferrer" className="btn-primary shadow-[0_16px_40px_-12px_rgba(122,59,255,0.8)] hover:-translate-y-0.5 transition-transform">
                  Visit Product <ExternalLink size={15} />
                </a>
              )}
              {(embedUrl || product.videoUrl) ? (
                <a href="#demo" className="product-hero-ghost-btn hover:-translate-y-0.5 transition-transform">
                  <PlayCircle size={16} /> Watch Demo
                </a>
              ) : null}
              <Link to="/contact" className="product-hero-ghost-btn hover:-translate-y-0.5 transition-transform">Get Started</Link>
            </motion.div>

            {/* Quick stat strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.48 }}
              className="flex flex-wrap gap-y-4 mt-12 pt-7 border-t border-white/15 [&>div]:pr-8 sm:[&>div]:pr-10 [&>div+div]:pl-8 sm:[&>div+div]:pl-10 [&>div+div]:border-l [&>div+div]:border-white/15"
            >
              {(product.techStack?.length > 0) && (
                <div>
                  <div className="text-2xl sm:text-3xl font-display font-bold text-white">{product.techStack.length}+</div>
                  <div className="text-[11px] text-white/55 uppercase tracking-[0.18em] mt-1.5">Technologies</div>
                </div>
              )}
              {(product.features?.length > 0) && (
                <div>
                  <div className="text-2xl sm:text-3xl font-display font-bold text-white">{product.features.length}+</div>
                  <div className="text-[11px] text-white/55 uppercase tracking-[0.18em] mt-1.5">Key Features</div>
                </div>
              )}
              <div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-1.5">4.9 <Star className="w-4 h-4 fill-violet-400 text-violet-400" /></div>
                <div className="text-[11px] text-white/55 uppercase tracking-[0.18em] mt-1.5">Avg. Rating</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-white">24/7</div>
                <div className="text-[11px] text-white/55 uppercase tracking-[0.18em] mt-1.5">Support</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-1.5 text-white/60"
        >
          <span className="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      </section>

      {/* ===== Product Overview ===== */}
      {product.description && (
        <section className="section">
          <div className="container-x grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
            <Reveal>
              <p className="text-sm font-medium text-violet-400 mb-3">Overview</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-6">What is {product.title}?</h2>
              <p className="text-ink-dim leading-relaxed text-lg">{product.description}</p>
              {product.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8">
                  {product.techStack.map((t) => (
                    <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">{t}</span>
                  ))}
                </div>
              )}
            </Reveal>
            <Reveal delay={0.12} className="relative">
              <div className="glow-orb w-64 h-64 bg-violet-600/30 -top-10 -right-10" />
              <div className="rounded-2xl overflow-hidden aspect-[4/3] relative z-10 bg-[#0d0d1a] border border-line2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.65)]">
                <img
                  src={overviewImage}
                  alt={`${product.title} preview`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = categoryImage(product, 'overview', 900, 700); }}
                />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ===== Key Features ===== */}
      {product.features?.length > 0 && (
        <section className="section pt-0">
          <div className="container-x">
            <Reveal>
              <SectionHead
                eyebrow="Capabilities"
                title="Key features"
                sub={`Everything ${product.title} brings to the table — built for performance and ease of use.`}
              />
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {product.features.map((feat, idx) => {
                const Icon = FEATURE_ICONS[idx % FEATURE_ICONS.length];
                return (
                  <Reveal key={feat} delay={(idx % 3) * 0.08} className="h-full">
                    <div className="h-full glass rounded-2xl p-6 md:p-7 hover:border-violet-400/50 hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-400/30 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-violet-300" />
                        </div>
                        <span className="font-display text-sm font-semibold text-ink-faint">{String(idx + 1).padStart(2, '0')}</span>
                      </div>
                      <span className="text-ink leading-relaxed font-medium">{feat}</span>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== Screenshots / Dashboard Preview ===== */}
      <section className="section pt-0">
        <div className="container-x">
          <Reveal>
            <SectionHead
              eyebrow="Walkthrough"
              title="Screenshots & dashboard preview"
              sub={`A closer look at the ${product.title} interface and experience.`}
            />
          </Reveal>
          {/* Bento gallery — pehli image badi, baaki uske side me */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:auto-rows-[230px]">
            {galleryImages.slice(0, 4).map((img, idx) => (
              <Reveal key={img} delay={idx * 0.06} className={`h-full ${idx === 0 ? 'sm:col-span-2 lg:row-span-2' : ''}`}>
                <button
                  type="button"
                  onClick={() => setLightbox(img)}
                  className="w-full h-full rounded-2xl overflow-hidden group relative bg-[#0d0d1a] border border-line2 aspect-video lg:aspect-auto"
                >
                  <img
                    src={img}
                    alt={`${product.title} screenshot ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = categoryImage(product, `shot-${idx}`, 900, 600); }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to enlarge
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Video Demo ===== */}
      {product.videoUrl && (
        <section id="demo" className="section pt-0">
          <div className="container-x max-w-4xl">
            <Reveal>
              <SectionHead eyebrow="Demo" title="See it in action" />
            </Reveal>
            <div className="rounded-2xl overflow-hidden aspect-video border border-line2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.65)]">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`${product.title} demo video`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={product.videoUrl} controls className="w-full h-full object-contain bg-black" />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===== How It Works ===== */}
      {product.howItWorks?.length > 0 && (
        <section className="section pt-0">
          <div className="container-x">
            <Reveal>
              <SectionHead
                eyebrow="Process"
                title="How it works"
                sub={`Get up and running with ${product.title} in a few simple steps.`}
              />
            </Reveal>
            <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-violet-500/0 via-violet-500/40 to-violet-500/0" />
              {product.howItWorks.map((step, idx) => (
                <Reveal key={idx} delay={idx * 0.08} className="h-full">
                  <div className="h-full glass rounded-2xl p-6 md:p-7 relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center mb-5 relative z-10 shadow-[0_8px_24px_-6px_rgba(122,59,255,0.7)]">
                      <span className="text-white font-semibold text-sm">{idx + 1}</span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-ink mb-2">{step.title}</h3>
                    {step.description && <p className="text-ink-dim text-sm leading-relaxed">{step.description}</p>}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Benefits ===== */}
      {product.benefits?.length > 0 && (
        <section className="section pt-0">
          <div className="container-x grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center">
            <Reveal className="relative order-2 lg:order-1">
              <div className="glow-orb w-64 h-64 bg-violet-400/25 -bottom-10 -left-10" />
              <div className="rounded-2xl overflow-hidden aspect-[4/3] relative z-10 bg-[#0d0d1a] border border-line2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.65)]">
                <img
                  src={benefitsImage}
                  alt={`${product.title} benefits`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = categoryImage(product, 'benefits', 900, 700); }}
                />
              </div>
            </Reveal>
            <Reveal delay={0.12} className="order-1 lg:order-2">
              <p className="text-sm font-medium text-violet-400 mb-3">Why choose it</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-8">Benefits that compound</h2>
              <div className="flex flex-col divide-y divide-line2">
                {product.benefits.map((b) => (
                  <div key={b} className="flex items-start gap-3.5 py-4 first:pt-0 last:pb-0">
                    <div className="w-7 h-7 rounded-full bg-violet-500/15 border border-violet-400/30 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-violet-300" />
                    </div>
                    <span className="text-ink leading-relaxed font-medium">{b}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ===== Integrations / Tech Stack ===== */}
      {product.techStack?.length > 0 && (
        <section className="section pt-0">
          <div className="container-x">
            <Reveal>
              <SectionHead
                eyebrow="Stack"
                title="Built with modern technology"
                sub={`Reliable, battle-tested technologies powering ${product.title}.`}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-wrap gap-3">
                {product.techStack.map((t) => (
                  <span key={t} className="glass inline-flex items-center gap-2.5 px-5 py-3 text-sm text-ink font-medium hover:border-violet-400/40 transition-colors">
                    <Code2 className="w-4 h-4 text-violet-400" /> {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ===== Testimonials ===== */}
      <section className="section pt-0">
        <div className="container-x">
          <Reveal>
            <SectionHead eyebrow="Testimonials" title="What people are saying" />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIAL_NAMES.map((t, idx) => (
              <Reveal key={t.name} delay={idx * 0.08} className="h-full">
                <div className="h-full glass rounded-2xl p-7 flex flex-col gap-5">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-violet-400 text-violet-400" />
                    ))}
                  </div>
                  <p className="text-ink leading-relaxed flex-1">
                    "{product.title} completely streamlined how our team works. The experience is smooth, fast, and exactly what we needed."
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-line2">
                    <img src={testimonialAvatar(idx)} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-violet-400/30" />
                    <div>
                      <div className="text-sm font-semibold text-ink">{t.name}</div>
                      <div className="text-xs text-ink-faint">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      {product.faqs?.length > 0 && (
        <section className="section pt-0">
          <div className="container-x grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
            <Reveal>
              <div className="lg:sticky lg:top-24">
                <p className="text-sm font-medium text-violet-400 mb-3">FAQ</p>
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-4">Frequently asked questions</h2>
                <p className="text-ink-dim leading-relaxed">
                  Everything you need to know about {product.title}. Can't find your answer?{' '}
                  <Link to="/contact" className="text-violet-400 hover:underline">Talk to our team</Link>.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-col gap-3">
                {product.faqs.map((faq, idx) => (
                  <FaqItem
                    key={idx}
                    faq={faq}
                    isOpen={openFaq === idx}
                    onToggle={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ===== Product Inquiries ===== */}
      <section className="section pt-0">
        <div className="container-x max-w-5xl">
          <Reveal>
            <SectionHead
              eyebrow="Connect"
              title={`Connect about ${product.title}`}
              sub="Ask about the product, get purchase assistance, or discuss an investment opportunity."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ProductEnquirySection product={product} />
          </Reveal>
        </div>
      </section>

      {/* ===== Contact / Get Started CTA ===== */}
      <section className="section pt-0">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl bg-[#0c0a30]">
              <svg className="absolute inset-0 w-full h-full opacity-25" aria-hidden="true" preserveAspectRatio="none">
                <path d="M 60 200 L 340 -40" fill="none" stroke="#8b9dd6" strokeWidth="1" />
                <path d="M 420 240 Q 640 40 880 160 T 1300 120" fill="none" stroke="#4f6bd8" strokeWidth="1.5" />
                <path d="M 1380 220 L 1640 -30" fill="none" stroke="#8b9dd6" strokeWidth="1" />
              </svg>
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8 px-6 md:px-14 py-12 md:py-16">
                <div className="max-w-xl">
                  <p className="text-sm font-medium text-violet-300 mb-3">Get started</p>
                  <h2 className="display-h text-3xl md:text-4xl text-white mb-4">Ready to get started with {product.title}?</h2>
                  <p className="text-white/70 leading-relaxed">Reach out to the WorknAi team for a walkthrough, pricing, or to discuss your requirements.</p>
                </div>
                <div className="flex flex-wrap gap-3 shrink-0">
                  {product.url && (
                    <a
                      href={product.url} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0c0a30] text-sm font-semibold hover:bg-violet-50 transition-colors"
                    >
                      Visit Product <ExternalLink size={15} />
                    </a>
                  )}
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white"
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>
          <img src={lightbox} alt="Screenshot full view" className="max-w-full max-h-full rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
