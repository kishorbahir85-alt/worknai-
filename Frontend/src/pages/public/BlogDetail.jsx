import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader2, Calendar, User } from 'lucide-react';
import api from '../../utils/api';

const BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
const resolveUrl = (url) => (url && !/^https?:\/\//.test(url) ? `${BASE}${url}` : url);

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api.get(`/blog/${slug}`)
      .then((res) => setPost(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
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
      <h1 className="text-2xl font-bold text-ink mb-2">Post not found</h1>
      <p className="text-ink-dim mb-6">This article may have been removed or doesn't exist.</p>
      <Link to="/blog" className="btn-primary"><ArrowLeft className="w-4 h-4" /> Back to Blog</Link>
    </section>
  );

  return (
    <article>
      <section className="section !pb-0">
        <div className="container-x max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-ink-dim hover:text-ink mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <div className="flex items-center gap-4 mb-5 text-xs text-ink-faint">
            {post.category && <span className="chip">{post.category}</span>}
            <span className="inline-flex items-center gap-1"><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            {post.postedBy?.name && <span className="inline-flex items-center gap-1"><User size={12} /> {post.postedBy.name}</span>}
          </div>

          <h1 className="display-h text-3xl sm:text-5xl text-ink mb-6 leading-[1.1]">{post.title}</h1>
          {post.excerpt && <p className="text-ink-dim text-lg leading-relaxed mb-8">{post.excerpt}</p>}
        </div>
      </section>

      {post.coverImage && (
        <div className="container-x max-w-4xl mb-12">
          <div className="glass-strong rounded-2xl overflow-hidden aspect-[16/9]">
            <img src={resolveUrl(post.coverImage)} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <section className="section pt-0">
        <div className="container-x max-w-3xl">
          {post.content && (
            <div className="text-ink-dim leading-relaxed text-base whitespace-pre-wrap">{post.content}</div>
          )}

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-line2">
              {post.tags.map((t) => (
                <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">#{t}</span>
              ))}
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
