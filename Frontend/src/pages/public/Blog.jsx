import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Calendar } from 'lucide-react';
import api from '../../utils/api';

const BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
const resolveUrl = (url) => (url && !/^https?:\/\//.test(url) ? `${BASE}${url}` : url);

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blog').then(r => setPosts(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="container-x">
        <div className="text-center mb-12">
          <span className="chip mb-4">Resources</span>
          <h1 className="display-h text-4xl md:text-5xl text-ink mb-4">Blog</h1>
          <p className="text-ink-dim max-w-xl mx-auto">Insights, tutorials and updates from the WorknAi team.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-ink-dim">
            <FileText className="w-10 h-10 text-violet-400 opacity-60" />
            <p>No articles yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(p => (
              <Link
                to={`/blog/${p.slug}`}
                key={p._id}
                className="glass rounded-2xl overflow-hidden flex flex-col hover:border-violet-400/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-[16/9] bg-violet-900/30 overflow-hidden">
                  {p.coverImage ? (
                    <img src={resolveUrl(p.coverImage)} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-violet-400 opacity-50" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <div className="flex items-center gap-3 text-xs text-ink-faint">
                    {p.category && <span className="chip !py-0.5">{p.category}</span>}
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} /> {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white leading-snug">{p.title}</h3>
                  {p.excerpt && <p className="text-sm text-ink-dim line-clamp-3">{p.excerpt}</p>}
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm text-violet-400 font-medium">
                    Read more <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
