import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader2, Calendar, User, ArrowRight } from 'lucide-react';
import api from '../../utils/api';

const BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
const resolveUrl = (url) => (url && !/^https?:\/\//.test(url) ? `${BASE}${url}` : url);

function formatInline(str) {
  return str.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
}

function FormattedContent({ content }) {
  if (!content) return null;
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className="space-y-5 text-slate-300 leading-relaxed text-base sm:text-lg">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={i} className="font-display text-xl sm:text-2xl font-bold text-white mt-8 mb-3">
              {trimmed.replace(/^###\s+/, '')}
            </h3>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={i} className="font-display text-2xl sm:text-3xl font-bold text-white mt-10 mb-4">
              {trimmed.replace(/^##\s+/, '')}
            </h2>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split(/\n/).map(line => line.replace(/^[-*]\s+/, '').trim()).filter(Boolean);
          return (
            <ul key={i} className="list-disc list-inside space-y-2 my-4 pl-2 text-slate-300">
              {items.map((item, j) => (
                <li key={j} className="leading-relaxed">
                  <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
                </li>
              ))}
            </ul>
          );
        }

        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split(/\n/).map(line => line.replace(/^\d+\.\s+/, '').trim()).filter(Boolean);
          return (
            <ol key={i} className="list-decimal list-inside space-y-2.5 my-4 pl-2 text-slate-300">
              {items.map((item, j) => (
                <li key={j} className="leading-relaxed">
                  <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={i} className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
        );
      })}
    </div>
  );
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api.get(`/blog/${slug}`)
      .then((res) => setPost(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    api.get('/blog')
      .then((res) => {
        const list = (res.data.data || []).filter((b) => b.slug !== slug && b.title);
        setRelated(list.slice(0, 3));
      })
      .catch(() => {});

    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
    </div>
  );

  if (notFound || !post) return (
    <section className="py-20 text-center px-4">
      <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-white mb-2">Post not found</h1>
      <p className="text-slate-400 mb-6">This article may have been removed or doesn't exist.</p>
      <Link to="/blog" className="btn-primary"><ArrowLeft className="w-4 h-4" /> Back to Blog</Link>
    </section>
  );

  return (
    <article className="min-h-screen pb-20">
      <section className="section !pb-0 pt-10 sm:pt-14">
        <div className="container-x max-w-4xl mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <div className="flex items-center gap-4 mb-5 text-xs text-slate-400">
            {post.category && <span className="chip px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 font-semibold">{post.category}</span>}
            <span className="inline-flex items-center gap-1"><Calendar size={13} /> {new Date(post.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            {post.postedBy?.name && <span className="inline-flex items-center gap-1"><User size={13} /> {post.postedBy.name}</span>}
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>
          {post.excerpt && <p className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-8 font-light">{post.excerpt}</p>}
        </div>
      </section>

      {post.coverImage && (
        <div className="container-x max-w-4xl mx-auto px-4 mb-12">
          <div className="rounded-2xl overflow-hidden aspect-[16/9] border border-white/10 shadow-2xl bg-violet-950/30">
            <img src={resolveUrl(post.coverImage)} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <section className="section pt-0">
        <div className="container-x max-w-4xl mx-auto px-4">
          {post.content ? (
            <FormattedContent content={post.content} />
          ) : (
            <p className="text-slate-400 italic">No content available for this article.</p>
          )}

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-white/10">
              {post.tags.map((t) => (
                <span key={t} className="text-xs px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">#{t}</span>
              ))}
            </div>
          )}

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="mt-16 pt-12 border-t border-white/10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display text-2xl font-bold text-white">Related Insights</h3>
                <Link to="/blog" className="text-xs font-semibold text-violet-400 hover:text-violet-300 inline-flex items-center gap-1">
                  View all articles <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/blog/${item.slug}`}
                    className="group flex flex-col justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/40 transition-all"
                  >
                    <div>
                      {item.coverImage && (
                        <div className="aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-violet-950/40">
                          <img src={resolveUrl(item.coverImage)} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">{item.category}</span>
                      <h4 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors mt-1 line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs text-violet-400 mt-4 font-medium group-hover:translate-x-0.5 transition-transform">
                      Read insight <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
