import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ExternalLink, Code2, ArrowLeft, AlertCircle, Loader2, CheckCircle2,
  PlayCircle, X, Sparkles, Layers, ChevronDown, Rocket, Quote, Star,
  Zap, ShieldCheck, Globe2, TrendingUp, Send, User, Mail, Phone, Building2,
} from 'lucide-react';
import toast from 'react-hot-toast';
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

const TESTIMONIAL_NAMES = [
  { name: 'Aarav Mehta', role: 'Product Manager' },
  { name: 'Priya Sharma', role: 'Operations Lead' },
  { name: 'Rohan Verma', role: 'CTO' },
];

const investorInp = 'w-full bg-white/5 border border-violet-500/20 rounded-xl py-3 px-4 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-violet-400/60 transition-all';
const investorLbl = 'block text-xs font-semibold text-ink-dim mb-1.5 uppercase tracking-wider';

function InvestorEnquiryForm({ product }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const f = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

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
        type: 'Investor Interest',
        source: 'investor-enquiry',
        product: product._id,
      });
      setSent(true);
      setForm({ name: '', email: '', phone: '', company: '', message: '' });
      toast.success('Your interest has been sent to our team.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not send your enquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="glass-strong rounded-2xl p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold">Investor Interest</p>
          <h2 className="text-2xl font-bold text-ink mt-1">Interested in investing in {product.title}?</h2>
        </div>
        <div className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-400/30 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-violet-400" />
        </div>
      </div>

      {sent && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span>Thanks! Our team will reach out to you shortly.</span>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={investorLbl}><User className="w-3.5 h-3.5 inline mr-1" />Name *</label>
          <input className={investorInp} value={form.name} onChange={f('name')} placeholder="Your full name" />
        </div>
        <div>
          <label className={investorLbl}><Mail className="w-3.5 h-3.5 inline mr-1" />Email *</label>
          <input type="email" className={investorInp} value={form.email} onChange={f('email')} placeholder="you@example.com" />
        </div>
        <div>
          <label className={investorLbl}><Phone className="w-3.5 h-3.5 inline mr-1" />Phone</label>
          <input className={investorInp} value={form.phone} onChange={f('phone')} placeholder="+91 99999 99999" />
        </div>
        <div>
          <label className={investorLbl}><Building2 className="w-3.5 h-3.5 inline mr-1" />Company / Fund</label>
          <input className={investorInp} value={form.company} onChange={f('company')} placeholder="Optional" />
        </div>
        <div className="sm:col-span-2">
          <label className={investorLbl}>Message *</label>
          <textarea className={`${investorInp} min-h-28 resize-y`} value={form.message} onChange={f('message')} placeholder={`Tell us about your investment interest in ${product.title}...`} />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary justify-center w-full mt-6 disabled:opacity-60">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Investment Interest</>}
      </button>
    </form>
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
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = categoryImage(product, 'hero', 1600, 1000); }}
            />
          )}
        </div>
        <div className="product-hero-wash absolute inset-0" />

        <div className="container-x relative z-10 pt-20 pb-12 px-4">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-violet-500/30 to-violet-700/30 border border-violet-400/30 backdrop-blur-md flex items-center justify-center overflow-hidden shadow-[0_10px_40px_-10px_rgba(122,59,255,0.6)]">
                {product.logoUrl ? (
                  <img src={resolveUrl(product.logoUrl)} alt={product.title} className="w-full h-full object-contain p-2" />
                ) : (
                  <Code2 size={24} className="text-violet-300" />
                )}
              </div>
              {product.category && <span className="chip">{product.category}</span>}
            </div>

            <h1 className="display-h text-4xl sm:text-6xl lg:text-7xl text-white leading-[1.02]">{product.title}</h1>
            {product.tagline && <p className="text-white/85 text-lg sm:text-xl mt-4 max-w-2xl">{product.tagline}</p>}

            <div className="flex flex-wrap gap-3 mt-9">
              {product.url && (
                <a href={product.url} target="_blank" rel="noreferrer" className="btn-primary">
                  Visit Product <ExternalLink size={15} />
                </a>
              )}
              {(embedUrl || product.videoUrl) ? (
                <a href="#demo" className="product-hero-ghost-btn">
                  <PlayCircle size={16} /> Watch Demo
                </a>
              ) : null}
              <Link to="/contact" className="product-hero-ghost-btn">Get Started</Link>
            </div>

            {/* Quick stat strip */}
            <div className="flex flex-wrap gap-x-10 gap-y-3 mt-12 pt-8 border-t border-white/20">
              {(product.techStack?.length > 0) && (
                <div>
                  <div className="text-2xl font-display font-bold text-white">{product.techStack.length}+</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider mt-1">Technologies</div>
                </div>
              )}
              {(product.features?.length > 0) && (
                <div>
                  <div className="text-2xl font-display font-bold text-white">{product.features.length}+</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider mt-1">Key Features</div>
                </div>
              )}
              <div>
                <div className="text-2xl font-display font-bold text-white flex items-center gap-1">4.9 <Star className="w-4 h-4 fill-violet-400 text-violet-400" /></div>
                <div className="text-xs text-white/60 uppercase tracking-wider mt-1">Avg. Rating</div>
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-white">24/7</div>
                <div className="text-xs text-white/60 uppercase tracking-wider mt-1">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Product Overview ===== */}
      {product.description && (
        <section className="section">
          <div className="container-x grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <span className="chip mb-4"><Sparkles size={12} /> Overview</span>
              <h2 className="display-h text-3xl sm:text-4xl text-ink mb-5">What is {product.title}?</h2>
              <p className="text-ink-dim leading-relaxed text-lg">{product.description}</p>
              {product.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-7">
                  {product.techStack.map((t) => (
                    <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">{t}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <div className="glow-orb w-64 h-64 bg-violet-600/30 -top-10 -right-10" />
              <div className="glass-strong rounded-2xl overflow-hidden aspect-[4/3] relative z-10 bg-[#0d0d1a]">
                <img
                  src={overviewImage}
                  alt={`${product.title} preview`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = categoryImage(product, 'overview', 900, 700); }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== Key Features ===== */}
      {product.features?.length > 0 && (
        <section className="section pt-0">
          <div className="container-x">
            <div className="text-center mb-14">
              <span className="chip mb-4">Capabilities</span>
              <h2 className="display-h text-3xl sm:text-4xl text-ink">Key Features</h2>
              <p className="text-ink-dim max-w-xl mx-auto mt-3">Everything {product.title} brings to the table, built for performance and ease of use.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {product.features.map((feat, idx) => {
                const Icon = FEATURE_ICONS[idx % FEATURE_ICONS.length];
                return (
                  <div key={feat} className="glass rounded-2xl p-6 hover:border-violet-400/50 hover:-translate-y-1 transition-all duration-300">
                    <div className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-400/30 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-violet-300" />
                    </div>
                    <span className="text-ink leading-relaxed font-medium">{feat}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== Screenshots / Dashboard Preview ===== */}
      <section className="section pt-0">
        <div className="container-x">
          <div className="text-center mb-14">
            <span className="chip mb-4">Walkthrough</span>
            <h2 className="display-h text-3xl sm:text-4xl text-ink">Screenshots &amp; Dashboard Preview</h2>
            <p className="text-ink-dim max-w-xl mx-auto mt-3">A closer look at the {product.title} interface and experience.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {galleryImages.slice(0, 4).map((img, idx) => (
              <button
                key={img}
                type="button"
                onClick={() => setLightbox(img)}
                className={`glass rounded-2xl overflow-hidden group relative bg-[#0d0d1a] ${idx === 0 ? 'sm:col-span-2 aspect-[16/8]' : 'aspect-video'}`}
              >
                <img
                  src={img}
                  alt={`${product.title} screenshot ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = categoryImage(product, `shot-${idx}`, 900, 600); }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Video Demo ===== */}
      {product.videoUrl && (
        <section id="demo" className="section pt-0">
          <div className="container-x max-w-4xl">
            <div className="text-center mb-10">
              <span className="chip mb-4"><PlayCircle size={12} /> Demo</span>
              <h2 className="display-h text-3xl sm:text-4xl text-ink">See It In Action</h2>
            </div>
            <div className="glass-strong rounded-2xl overflow-hidden aspect-video">
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
            <div className="text-center mb-14">
              <span className="chip mb-4">Process</span>
              <h2 className="display-h text-3xl sm:text-4xl text-ink">How It Works</h2>
              <p className="text-ink-dim max-w-xl mx-auto mt-3">Get up and running with {product.title} in a few simple steps.</p>
            </div>
            <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="hidden lg:block absolute top-9 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-violet-500/0 via-violet-500/40 to-violet-500/0" />
              {product.howItWorks.map((step, idx) => (
                <div key={idx} className="glass rounded-2xl p-6 relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center mb-4 relative z-10 shadow-[0_8px_24px_-6px_rgba(122,59,255,0.7)]">
                    <span className="text-white font-semibold text-sm">{idx + 1}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">{step.title}</h3>
                  {step.description && <p className="text-ink-dim text-sm leading-relaxed">{step.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Benefits ===== */}
      {product.benefits?.length > 0 && (
        <section className="section pt-0">
          <div className="container-x grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="glow-orb w-64 h-64 bg-violet-400/25 -bottom-10 -left-10" />
              <div className="glass-strong rounded-2xl overflow-hidden aspect-[4/3] relative z-10 bg-[#0d0d1a]">
                <img
                  src={benefitsImage}
                  alt={`${product.title} benefits`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = categoryImage(product, 'benefits', 900, 700); }}
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="chip mb-4"><Rocket size={12} /> Why Choose It</span>
              <h2 className="display-h text-3xl sm:text-4xl text-ink mb-6">Benefits</h2>
              <div className="flex flex-col gap-4">
                {product.benefits.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-violet-500/15 border border-violet-400/30 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-violet-300" />
                    </div>
                    <span className="text-ink leading-relaxed font-medium">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== Integrations / Tech Stack ===== */}
      {product.techStack?.length > 0 && (
        <section className="section pt-0">
          <div className="container-x">
            <div className="text-center mb-14">
              <span className="chip mb-4"><Layers size={12} /> Stack</span>
              <h2 className="display-h text-3xl sm:text-4xl text-ink">Built With</h2>
              <p className="text-ink-dim max-w-xl mx-auto mt-3">Modern, reliable technologies powering {product.title}.</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {product.techStack.map((t) => (
                <div key={t} className="glass rounded-xl flex items-center gap-3 px-4 py-4 hover:border-violet-400/40 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-violet-500/15 border border-violet-400/30 flex items-center justify-center shrink-0">
                    <Code2 className="w-4 h-4 text-violet-300" />
                  </div>
                  <span className="text-sm text-ink font-medium truncate">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Testimonials ===== */}
      <section className="section pt-0">
        <div className="container-x">
          <div className="text-center mb-14">
            <span className="chip mb-4"><Quote size={12} /> Testimonials</span>
            <h2 className="display-h text-3xl sm:text-4xl text-ink">What People Are Saying</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIAL_NAMES.map((t, idx) => (
              <div key={t.name} className="glass rounded-2xl p-6 flex flex-col gap-4">
                <Quote className="w-6 h-6 text-violet-400/50" />
                <p className="text-ink-dim leading-relaxed text-sm flex-1">
                  "{product.title} completely streamlined how our team works. The experience is smooth, fast, and exactly what we needed."
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-line2">
                  <img src={testimonialAvatar(idx)} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-violet-400/30" />
                  <div>
                    <div className="text-sm font-semibold text-ink">{t.name}</div>
                    <div className="text-xs text-ink-faint">{t.role}</div>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-violet-400 text-violet-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      {product.faqs?.length > 0 && (
        <section className="section pt-0">
          <div className="container-x max-w-3xl">
            <div className="text-center mb-12">
              <span className="chip mb-4">FAQ</span>
              <h2 className="display-h text-3xl sm:text-4xl text-ink">Frequently Asked Questions</h2>
            </div>
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
          </div>
        </section>
      )}

      {/* ===== Investor Interest ===== */}
      <section className="section pt-0">
        <div className="container-x max-w-2xl">
          <div className="text-center mb-8">
            <span className="chip mb-4"><TrendingUp size={12} /> Invest</span>
            <h2 className="display-h text-3xl sm:text-4xl text-ink">Back {product.title}</h2>
            <p className="text-ink-dim max-w-xl mx-auto mt-3">Interested in investing in this product? Share your details and our team will connect with you.</p>
          </div>
          <InvestorEnquiryForm product={product} />
        </div>
      </section>

      {/* ===== Contact / Get Started CTA ===== */}
      <section className="section pt-0">
        <div className="container-x">
          <div className="glass-strong rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="glow-orb w-80 h-80 bg-violet-600/30 -top-24 -left-24" />
            <div className="glow-orb w-80 h-80 bg-violet-400/20 -bottom-24 -right-24" />
            <div className="relative z-10">
              <span className="chip mb-5">Get Started</span>
              <h2 className="display-h text-3xl sm:text-5xl text-ink mb-4">Ready to get started with {product.title}?</h2>
              <p className="text-ink-dim max-w-xl mx-auto mb-9 text-lg">Reach out to the WorknAi team for a walkthrough, pricing, or to discuss your requirements.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {product.url && (
                  <a href={product.url} target="_blank" rel="noreferrer" className="btn-primary">
                    Visit Product <ExternalLink size={15} />
                  </a>
                )}
                <Link to="/contact" className="btn-ghost">Contact Us</Link>
              </div>
            </div>
          </div>
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
