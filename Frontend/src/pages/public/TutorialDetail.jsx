import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader2, PlayCircle } from 'lucide-react';
import api from '../../utils/api';

const BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
const resolveUrl = (url) => (url && !/^https?:\/\//.test(url) ? `${BASE}${url}` : url);

const difficultyStyle = {
  Beginner: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
  Intermediate: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
  Advanced: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
};

function getEmbedUrl(videoUrl) {
  if (!videoUrl) return null;
  const yt = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = videoUrl.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export default function TutorialDetail() {
  const { slug } = useParams();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api.get(`/tutorials/${slug}`)
      .then((res) => setTutorial(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
    </div>
  );

  if (notFound || !tutorial) return (
    <section className="py-20 text-center px-4">
      <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-ink mb-2">Tutorial not found</h1>
      <p className="text-ink-dim mb-6">This tutorial may have been removed or doesn't exist.</p>
      <Link to="/tutorials" className="btn-primary"><ArrowLeft className="w-4 h-4" /> Back to Tutorials</Link>
    </section>
  );

  const embedUrl = getEmbedUrl(tutorial.videoUrl);

  return (
    <article>
      <section className="section !pb-0">
        <div className="container-x max-w-3xl">
          <Link to="/tutorials" className="inline-flex items-center gap-2 text-sm text-ink-dim hover:text-ink mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Tutorials
          </Link>

          <div className="flex items-center gap-3 mb-5">
            {tutorial.difficulty && <span className={`text-xs font-medium border rounded-full px-3 py-1 ${difficultyStyle[tutorial.difficulty] || difficultyStyle.Beginner}`}>{tutorial.difficulty}</span>}
          </div>

          <h1 className="display-h text-3xl sm:text-5xl text-ink mb-6 leading-[1.1]">{tutorial.title}</h1>
          {tutorial.description && <p className="text-ink-dim text-lg leading-relaxed mb-8">{tutorial.description}</p>}
        </div>
      </section>

      {tutorial.coverImage && (
        <div className="container-x max-w-4xl mb-12">
          <div className="glass-strong rounded-2xl overflow-hidden aspect-[16/9]">
            <img src={resolveUrl(tutorial.coverImage)} alt={tutorial.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {tutorial.videoUrl && (
        <section className="section pt-0">
          <div className="container-x max-w-4xl">
            <div className="glass-strong rounded-2xl overflow-hidden aspect-video">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`${tutorial.title} video`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={tutorial.videoUrl} controls className="w-full h-full object-contain bg-black" />
              )}
            </div>
          </div>
        </section>
      )}

      {tutorial.steps?.length > 0 && (
        <section className="section pt-0">
          <div className="container-x max-w-3xl">
            <h2 className="display-h text-2xl sm:text-3xl text-ink mb-8">Steps</h2>
            <div className="flex flex-col gap-4">
              {tutorial.steps.map((step, idx) => (
                <div key={idx} className="glass rounded-2xl p-6 flex gap-4">
                  <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-[0_8px_24px_-6px_rgba(122,59,255,0.7)]">
                    <span className="text-white font-semibold text-sm">{idx + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink mb-1.5">{step.title}</h3>
                    {step.description && <p className="text-ink-dim text-sm leading-relaxed">{step.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {tutorial.tags?.length > 0 && (
        <section className="section pt-0">
          <div className="container-x max-w-3xl">
            <div className="flex flex-wrap gap-2 pt-8 border-t border-line2">
              {tutorial.tags.map((t) => (
                <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">#{t}</span>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
