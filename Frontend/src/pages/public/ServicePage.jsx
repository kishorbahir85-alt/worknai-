import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronDown, ChevronUp, ArrowLeft, ArrowRight,
  CheckCircle, AlertCircle,
} from 'lucide-react';
import { servicesData } from '../../data/servicesData';

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-violet-500/20 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-violet-500/5 transition-colors"
      >
        <span className="text-ink font-medium text-sm">{q}</span>
        {open ? <ChevronUp size={16} className="text-violet-400 shrink-0" /> : <ChevronDown size={16} className="text-violet-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-ink-dim text-sm leading-relaxed border-t border-violet-500/10">
          <p className="pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function ServicePage() {
  const { slug } = useParams();
  const svc = servicesData[slug];

  if (!svc) {
    return (
      <section className="py-24 text-center px-4">
        <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-ink mb-2">Service Not Found</h1>
        <p className="text-ink-dim mb-6">This service page doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary"><ArrowLeft className="w-4 h-4" /> Go Home</Link>
      </section>
    );
  }

  return (
    <div className="service-page">
      {/* ===== HERO ===== */}
      <section className="service-hero relative overflow-hidden min-h-[400px] flex items-center">
        <img
          src={svc.hero}
          alt={svc.title}
          className="media-clean-img absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="media-clean-overlay absolute inset-0" />
        <div className="service-hero-copy relative container-x px-4 py-20">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={13} /> Home / {svc.category} / {svc.title}
          </Link>
          <p className="text-xs uppercase tracking-widest text-violet-300 font-semibold mb-3">{svc.category}</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 max-w-2xl leading-tight">
            {svc.title}
          </h1>
          <div className="w-14 h-1 bg-gradient-to-r from-violet-500 to-violet-300 rounded-full mb-5" />
          <p className="text-white/86 text-lg max-w-xl leading-relaxed">{svc.subtitle}</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/contact" className="btn-primary">
              Get a Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/career" className="btn-ghost service-hero-secondary">
              Join Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section">
        <div className="container-x">
          <div className="flex flex-col gap-16 md:gap-24">
            {svc.features.map((f, i) => (
              <div
                key={f.title}
                className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? 'md:grid-flow-dense' : ''}`}
              >
                <div className={i % 2 === 1 ? 'md:col-start-2' : ''}>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-3">{f.title}</h2>
                  <div className="w-10 h-0.5 bg-violet-500 rounded-full mb-5" />
                  <p className="text-ink-dim leading-relaxed">{f.desc}</p>
                  <div className="flex items-center gap-2 mt-6 text-sm text-violet-300">
                    <CheckCircle size={16} />
                    <span>Industry-grade solution</span>
                  </div>
                </div>
                <div className={`rounded-2xl overflow-hidden ${i % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                  <img
                    src={f.image}
                    alt={f.title}
                    className="media-clean-img w-full h-64 md:h-80 object-cover rounded-2xl border border-violet-500/10"
                    onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INDUSTRIES ===== */}
      <section className="section bg-violet-900/10">
        <div className="container-x">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">{svc.title} & Industries</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3">Industries We Serve</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-violet-300 rounded-full mx-auto mb-4" />
            <p className="text-ink-dim max-w-xl mx-auto">Our solutions extend across a wide array of industries, delivering tailored outcomes for every sector.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {svc.industries.map((ind) => (
              <div
                key={ind.title}
                className="glass rounded-xl p-6 hover:border-violet-400/40 transition-all"
              >
                <h3 className="font-display text-lg font-semibold text-ink mb-2">{ind.title}</h3>
                <div className="w-8 h-0.5 bg-violet-500/60 rounded-full mb-3" />
                <p className="text-ink-dim text-sm leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CHALLENGES ===== */}
      <section className="section">
        <div className="container-x">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">What We Address</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3">Addressing Challenges</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-violet-300 rounded-full mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {svc.challenges.map((c) => (
              <div
                key={c.title}
                className="glass-strong rounded-2xl p-8 text-center hover:border-violet-400/40 transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-violet-500/20 border border-violet-400/30 flex items-center justify-center mx-auto mb-5 group-hover:bg-violet-500/30 transition-colors">
                  <CheckCircle className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="font-display text-xl font-semibold text-ink mb-3">{c.title}</h3>
                <p className="text-ink-dim text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section bg-violet-900/10">
        <div className="container-x max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Got Questions?</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3">FAQs</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-violet-300 rounded-full mx-auto" />
          </div>
          <div className="flex flex-col gap-3">
            {svc.faqs.map((faq) => (
              <FAQ key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section">
        <div className="container-x">
          <div className="glass-strong rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3">
                Ready to get started with <span className="text-violet-300">{svc.title}?</span>
              </h2>
              <p className="text-ink-dim max-w-xl mx-auto mb-8">
                Let's discuss your requirements and build a solution that drives real results for your business.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/contact" className="btn-primary">
                  Talk to an Expert <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/career" className="btn-ghost">
                  Join Our Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
