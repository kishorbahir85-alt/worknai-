import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Code2 } from 'lucide-react';
import api from '../../utils/api';

const BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
const resolveUrl = (url) => (url && !/^https?:\/\//.test(url) ? `${BASE}${url}` : url);

const getFavicon = (url) => {
  if (!url) return null;
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return null;
  }
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="container-x">
        <div className="text-center mb-12">
          <span className="chip mb-4">What We Build</span>
          <h1 className="display-h text-4xl md:text-5xl text-ink mb-4">Our Products</h1>
          <p className="text-ink-dim max-w-xl mx-auto">Software solutions, HRMS, CRM and digital products built by the WorknAi team.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-ink-dim">Products coming soon!</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => {
              const logoSrc = p.logoUrl ? resolveUrl(p.logoUrl) : (p.url ? getFavicon(p.url) : null);
              return (
                <Link
                  to={`/products/${p.slug}`}
                  key={p._id}
                  className="glass rounded-2xl p-6 flex flex-col gap-4 hover:border-violet-400/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br from-violet-500/30 to-violet-700/30 border border-violet-400/20 flex items-center justify-center overflow-hidden">
                      {logoSrc ? (
                        <img
                          src={logoSrc}
                          alt={p.title}
                          className="w-8 h-8 object-contain"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <Code2 size={20} className="text-violet-400 opacity-60" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                        <h3 className="font-display text-lg font-semibold text-white leading-snug break-words">{p.title}</h3>
                        {p.category && <span className="text-xs text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full max-w-full truncate">{p.category}</span>}
                      </div>
                    </div>
                  </div>
                  {p.description && <p className="text-sm text-ink-dim line-clamp-3">{p.description}</p>}
                  {p.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      <Code2 size={12} className="text-ink-faint mt-0.5 shrink-0" />
                      {p.techStack.map(t => (
                        <span key={t} className="text-xs text-ink-faint">{t}</span>
                      ))}
                    </div>
                  )}
                  {p.url && (
                    <span
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(p.url, '_blank', 'noopener,noreferrer'); }}
                      className="btn-ghost text-sm px-4 py-2 inline-flex items-center gap-2 w-fit"
                    >
                      Visit Product <ExternalLink size={13} />
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
