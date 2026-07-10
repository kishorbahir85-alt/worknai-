import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Mail } from 'lucide-react';
import api from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';

const BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
const resolveUrl = (url) => (url && !/^https?:\/\//.test(url) ? `${BASE}${url}` : url);

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const exploreMoreLinks = [
  { to: '/courses', label: 'Courses' },
  { to: '/products', label: 'Products' },
  { to: '/tutorials', label: 'Tutorials' },
  { to: '/career', label: 'Careers' },
  { to: '/templates', label: 'Templates' },
];

export default function Blog() {
  const { isDark } = useTheme();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState(null);

  useEffect(() => {
    api.get('/blog').then(r => setPosts(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const topics = useMemo(
    () => [...new Set(posts.map(p => p.category).filter(Boolean))],
    [posts]
  );

  const visible = useMemo(
    () => (activeTopic ? posts.filter(p => p.category === activeTopic) : posts),
    [posts, activeTopic]
  );

  const featured = visible[0];
  const rest = visible.slice(1);

  // Amadeus-style flat surfaces
  const card = isDark ? 'bg-white/[0.045]' : 'bg-[#f8fafc]';
  const chipCls = `px-4 py-1.5 rounded-full text-sm border transition-colors ${
    isDark
      ? 'border-white/15 bg-white/[0.03] text-ink-dim hover:border-violet-400/60 hover:text-ink'
      : 'border-slate-200 bg-[#f8fafc] text-slate-700 hover:border-violet-400 hover:text-slate-900'
  }`;
  const chipActive = isDark
    ? 'px-4 py-1.5 rounded-full text-sm border border-violet-400 bg-violet-500/25 text-ink transition-colors'
    : 'px-4 py-1.5 rounded-full text-sm border border-violet-500 bg-violet-600 text-white transition-colors';
  const label = `text-sm font-medium ${isDark ? 'text-violet-400' : 'text-violet-600'}`;

  const heroBand = (
    <section className="relative overflow-hidden bg-[#0c0a30]">
      <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden="true" preserveAspectRatio="none">
        <path d="M 620 -40 Q 520 260 300 520" fill="none" stroke="#8b9dd6" strokeWidth="1" />
        <path d="M 1150 -60 Q 1120 240 1010 540" fill="none" stroke="#8b9dd6" strokeWidth="1" />
        <path d="M 1620 -40 Q 1560 220 1300 560" fill="none" stroke="#8b9dd6" strokeWidth="1" />
      </svg>
      <div className="container-x relative px-4 sm:px-6 py-16 md:py-24">
        <h1 className="display-h text-5xl md:text-7xl text-white mb-6">Welcome to our blog</h1>
        <p className="text-base md:text-xl text-white/85 max-w-4xl leading-relaxed">
          Hear from our team, students and partners on topics that shape careers and modern software —
          with a focus on AI, engineering and tech education. Follow us on{' '}
          <a href="https://in.linkedin.com/in/worknai-technology-8830973b6" target="_blank" rel="noreferrer" className="underline hover:text-white">LinkedIn</a>{' '}
          and{' '}
          <a href="https://www.instagram.com/worknai_institute_center/" target="_blank" rel="noreferrer" className="underline hover:text-white">Instagram</a>{' '}
          for our latest news and blogs.
        </p>
      </div>
    </section>
  );

  const verticalCard = (p) => (
    <Link key={p._id} to={`/blog/${p.slug}`} className={`group flex flex-col ${card}`}>
      <div className="aspect-[16/10] overflow-hidden bg-violet-900/20">
        {p.coverImage ? (
          <img src={resolveUrl(p.coverImage)} alt={p.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><FileText className="w-8 h-8 text-violet-400 opacity-50" /></div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-2.5 flex-1">
        <span className={label}>{p.category || 'Blog'}</span>
        <h3 className="text-base md:text-lg font-medium text-ink leading-snug group-hover:underline">{p.title}</h3>
        <span className="mt-auto pt-6 text-sm text-ink-faint">{formatDate(p.createdAt)}</span>
      </div>
    </Link>
  );

  const horizontalCard = (p) => (
    <Link key={p._id} to={`/blog/${p.slug}`} className={`group grid sm:grid-cols-2 lg:col-span-2 ${card}`}>
      <div className="aspect-[16/10] sm:aspect-auto sm:min-h-full overflow-hidden bg-violet-900/20">
        {p.coverImage ? (
          <img src={resolveUrl(p.coverImage)} alt={p.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><FileText className="w-8 h-8 text-violet-400 opacity-50" /></div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-2.5">
        <span className={label}>{p.category || 'Blog'}</span>
        <h3 className="text-base md:text-lg font-medium text-ink leading-snug group-hover:underline">{p.title}</h3>
        <span className="mt-auto pt-6 text-sm text-ink-faint">{formatDate(p.createdAt)}</span>
      </div>
    </Link>
  );

  // Rows of 3 posts on lg: one wide (2 cols) + two vertical, wide side alternating
  const gridItems = [];
  for (let i = 0; i < rest.length; i += 3) {
    const chunk = rest.slice(i, i + 3);
    const rowIndex = i / 3;
    if (chunk.length === 3) {
      if (rowIndex % 2 === 0) gridItems.push(horizontalCard(chunk[0]), verticalCard(chunk[1]), verticalCard(chunk[2]));
      else gridItems.push(verticalCard(chunk[0]), verticalCard(chunk[1]), horizontalCard(chunk[2]));
    } else {
      chunk.forEach(p => gridItems.push(verticalCard(p)));
    }
  }

  return (
    <div className="text-ink">

      {/* Breadcrumb */}
      <div className="container-x px-4 sm:px-6 py-5 text-sm">
        <Link to="/" className={`${isDark ? 'text-violet-400' : 'text-violet-600'} hover:underline`}>Home</Link>
        <span className="mx-2 text-ink-faint">/</span>
        <span className="text-ink-dim">Blog</span>
      </div>

      {heroBand}

      <section className="container-x px-4 sm:px-6 py-14 md:py-20">

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-ink-dim">
            <FileText className="w-10 h-10 text-violet-400 opacity-60" />
            <p>No articles yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Explore by Topic */}
            {topics.length > 0 && (
              <div className="mb-14 md:mb-20">
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-8">Explore by Topic</h2>
                <div className="flex flex-wrap gap-2.5">
                  {topics.map(t => (
                    <button
                      key={t}
                      onClick={() => setActiveTopic(activeTopic === t ? null : t)}
                      className={activeTopic === t ? chipActive : chipCls}
                    >
                      {t}
                    </button>
                  ))}
                  <button onClick={() => setActiveTopic(null)} className={`${chipCls} inline-flex items-center gap-2`}>
                    See all blogs <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {visible.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-ink-dim">
                <FileText className="w-10 h-10 text-violet-400 opacity-60" />
                <p>No articles in this topic yet.</p>
              </div>
            ) : (
              <>
                {/* Featured post */}
                {featured && (
                  <Link to={`/blog/${featured.slug}`} className={`group grid md:grid-cols-2 mb-6 ${card}`}>
                    <div className="aspect-[16/10] md:aspect-auto md:min-h-[380px] overflow-hidden bg-violet-900/20">
                      {featured.coverImage ? (
                        <img src={resolveUrl(featured.coverImage)} alt={featured.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><FileText className="w-10 h-10 text-violet-400 opacity-50" /></div>
                      )}
                    </div>
                    <div className="p-6 md:p-10 flex flex-col">
                      <span className={`${label} mb-5`}>{featured.category || 'Blog'}</span>
                      <h3 className="font-display text-2xl md:text-4xl font-semibold text-ink leading-tight mb-5 group-hover:underline">
                        {featured.title}
                      </h3>
                      {featured.excerpt && (
                        <p className="text-base text-ink-dim leading-relaxed line-clamp-4">{featured.excerpt}</p>
                      )}
                      <span className="mt-auto pt-8 text-sm text-ink-faint">{formatDate(featured.createdAt)}</span>
                    </div>
                  </Link>
                )}

                {/* Post grid */}
                {gridItems.length > 0 && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {gridItems}
                  </div>
                )}
              </>
            )}

            {/* Explore more across WorknAi */}
            <div className="mt-16 md:mt-24">
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-8">Explore WorknAi</h2>
              <div className="flex flex-wrap gap-2.5">
                {exploreMoreLinks.map(l => (
                  <Link key={l.to} to={l.to} className={chipCls}>{l.label}</Link>
                ))}
                <button onClick={() => setActiveTopic(null)} className={`${chipCls} inline-flex items-center gap-2`}>
                  See all blogs <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Tutorials CTA band */}
            <div className="relative overflow-hidden bg-[#0c0a30] mt-16 md:mt-24">
              <svg className="absolute inset-0 w-full h-full opacity-25" aria-hidden="true" preserveAspectRatio="none">
                <path d="M 60 130 L 260 -30" fill="none" stroke="#8b9dd6" strokeWidth="1" />
                <path d="M 340 160 Q 520 20 700 120 T 1060 90" fill="none" stroke="#4f6bd8" strokeWidth="1.5" />
                <path d="M 1150 150 L 1350 -20" fill="none" stroke="#8b9dd6" strokeWidth="1" />
              </svg>
              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5 px-6 md:px-10 py-8 md:py-9">
                <div>
                  <h3 className="font-display text-lg md:text-xl font-semibold text-white mb-1">Explore our tutorials</h3>
                  <p className="text-sm text-white/70">Discover hands-on guides and walkthroughs from the WorknAi team.</p>
                </div>
                <Link
                  to="/tutorials"
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded bg-white text-[#0c0a30] text-sm font-semibold hover:bg-violet-50 transition-colors"
                >
                  Go to Tutorials <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Get in touch */}
            <div className="text-center mt-16 md:mt-24">
              <p className={`${label} mb-3`}>Get in touch</p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-8">
                Stay up to date with all things WorknAi
              </h2>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors"
              >
                Contact us <Mail size={15} />
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
