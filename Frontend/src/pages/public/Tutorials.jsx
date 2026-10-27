import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, ListChecks } from 'lucide-react';
import api from '../../utils/api';

const BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
const resolveUrl = (url) => (url && !/^https?:\/\//.test(url) ? `${BASE}${url}` : url);

const difficultyStyle = {
  Beginner: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
  Intermediate: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
  Advanced: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
};

const TUTORIAL_FALLBACKS = {
  'getting-started-with-the-worknai-rest-api': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
  'building-a-high-performance-real-time-dashboard': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80',
  'fine-tuning-llm-embeddings-for-custom-knowledgebases': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&auto=format&fit=crop&q=80',
};

const getTutorialCover = (t, idx = 0) => {
  if (t?.coverImage) return resolveUrl(t.coverImage);
  if (t?.slug && TUTORIAL_FALLBACKS[t.slug]) return TUTORIAL_FALLBACKS[t.slug];
  const defaults = [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
  ];
  return defaults[idx % defaults.length];
};

export default function Tutorials() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tutorials').then(r => setTutorials(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="container-x">
        <div className="text-center mb-12">
          <span className="chip mb-4">Resources</span>
          <h1 className="display-h text-4xl md:text-5xl text-ink mb-4">Tutorials</h1>
          <p className="text-ink-dim max-w-xl mx-auto">Step-by-step guides to help you learn and build faster.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : tutorials.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-ink-dim">
            <BookOpen className="w-10 h-10 text-violet-400 opacity-60" />
            <p>No tutorials yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((t, idx) => (
              <Link
                to={`/tutorials/${t.slug}`}
                key={t._id}
                className="group glass rounded-2xl overflow-hidden flex flex-col hover:border-violet-400/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="relative aspect-[16/9] bg-violet-950/40 overflow-hidden">
                  <img
                    src={getTutorialCover(t, idx)}
                    alt={t.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080915]/60 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <div className="flex items-center gap-3 text-xs">
                    {t.difficulty && <span className={`text-xs font-medium border rounded-full px-2.5 py-0.5 ${difficultyStyle[t.difficulty] || difficultyStyle.Beginner}`}>{t.difficulty}</span>}
                    {t.steps?.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-ink-faint">
                        <ListChecks size={12} /> {t.steps.length} steps
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white leading-snug">{t.title}</h3>
                  {t.description && <p className="text-sm text-ink-dim line-clamp-3">{t.description}</p>}
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm text-violet-400 font-medium">
                    Start learning <ArrowRight size={14} />
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
