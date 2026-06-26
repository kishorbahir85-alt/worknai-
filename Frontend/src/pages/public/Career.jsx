import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, Clock, ArrowRight, Search, X } from 'lucide-react';
import api from '../../utils/api';

const typeColor = {
  'full-time':  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'part-time':  'text-sky-400 bg-sky-500/10 border-sky-500/20',
  internship:   'text-amber-400 bg-amber-500/10 border-amber-500/20',
  freelance:    'text-violet-400 bg-violet-500/10 border-violet-500/20',
};

export default function Career() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    api.get('/jobs').then(r => setJobs(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? jobs.filter(j =>
        j.title?.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        j.type?.toLowerCase().includes(q) ||
        j.skills?.some(s => s.toLowerCase().includes(q))
      )
    : jobs;

  const visible = showAll || q ? filtered : filtered.slice(0, 4);
  const hasMore = !q && !showAll && filtered.length > 4;

  return (
    <section className="pt-8 pb-16 px-4">
      <div className="container-x">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="chip mb-4">We're Hiring</span>
          <h1 className="display-h text-4xl md:text-5xl text-ink mb-4">Career Opportunities</h1>
          <p className="text-ink-dim max-w-xl mx-auto">Join the WorknAi team. We're looking for passionate people to build the future with us.</p>
        </div>

        {/* Search bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-dim pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by role, skill, location…"
              className="w-full bg-white/5 border border-violet-500/20 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-ink-dim focus:outline-none focus:border-violet-400/60 transition-all"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-dim hover:text-white transition-colors">
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-ink-dim">No open positions right now. Follow us on LinkedIn for updates!</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search size={40} className="mx-auto mb-4 text-ink-faint opacity-40" />
            <p className="text-ink font-semibold text-lg mb-1">No results found</p>
            <p className="text-ink-dim text-sm">No job openings match "<span className="text-violet-300">{query}</span>"</p>
            <button onClick={() => setQuery('')} className="mt-4 text-sm text-violet-400 hover:text-violet-300 underline underline-offset-2">
              Clear search
            </button>
          </div>
        ) : (
          <>
          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {visible.map(j => (
              <div key={j._id} className="glass rounded-2xl p-6 hover:border-violet-400/40 transition-colors flex flex-col">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <h3 className="font-display text-xl font-semibold text-white leading-snug">{j.title}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize border ${typeColor[j.type] || typeColor['full-time']}`}>
                    {j.type}
                  </span>
                </div>
                {j.description && <p className="text-sm text-ink-dim mb-4 line-clamp-2">{j.description}</p>}
                <div className="flex flex-wrap gap-4 text-xs text-ink-dim mb-4">
                  <span className="flex items-center gap-1"><MapPin size={12} />{j.location}</span>
                  {j.experience && <span className="flex items-center gap-1"><Clock size={12} />{j.experience}</span>}
                  {j.salary && <span className="flex items-center gap-1"><IndianRupee size={12} />{j.salary}</span>}
                </div>
                {j.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {j.skills.map(s => (
                      <span key={s} className={`text-xs px-2 py-0.5 rounded-full border ${
                        q && s.toLowerCase().includes(q)
                          ? 'bg-violet-500/30 border-violet-400/50 text-violet-200 font-medium'
                          : 'bg-violet-500/10 border-violet-500/20 text-violet-300'
                      }`}>{s}</span>
                    ))}
                  </div>
                )}
                <div className="mt-auto">
                  <Link to={`/career/${j.slug}`} className="btn-primary text-sm px-4 py-2 inline-flex">
                    View & Apply <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAll(true)}
                className="btn-ghost px-8 py-2.5 inline-flex items-center gap-2"
              >
                View More Openings <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-ink-dim text-xs mt-2">{filtered.length - 4} more position{filtered.length - 4 !== 1 ? 's' : ''} available</p>
            </div>
          )}

          {showAll && filtered.length > 4 && !q && (
            <div className="text-center mt-8">
              <button
                onClick={() => { setShowAll(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-sm text-ink-dim hover:text-violet-300 underline underline-offset-2 transition-colors"
              >
                Show less
              </button>
            </div>
          )}
          </>
        )}
      </div>
    </section>
  );
}
