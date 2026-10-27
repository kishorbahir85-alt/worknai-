import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Tag, ArrowRight, Calendar, ArrowUpRight } from 'lucide-react';
import api from '../../utils/api';

const levelColor = { beginner: 'text-emerald-400 bg-emerald-500/10', intermediate: 'text-amber-300 bg-amber-500/10', advanced: 'text-rose-300 bg-rose-500/10' };
const modeColor  = { online: 'text-sky-400 bg-sky-500/10', offline: 'text-violet-400 bg-violet-500/10', hybrid: 'text-pink-400 bg-pink-500/10' };
const formatStartDate = (value) => {
  if (!value) return '';
  const text = String(value).trim();
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(text)
    ? text
    : text.replace(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/, (_, day, month, year) => `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
  const date = new Date(`${normalized}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses').then(r => setCourses(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="container-x">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="chip">Our Programs</span>
            <a
              href="http://localhost:5174/courses"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-violet-300 hover:text-white font-medium inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-400/30 bg-violet-500/10 hover:bg-violet-500/20 transition-all shadow-sm"
            >
              Admin Panel <ArrowUpRight className="w-3.5 h-3.5 text-violet-400" />
            </a>
          </div>
          <h1 className="display-h text-4xl md:text-5xl text-ink mb-4">Training Courses</h1>
          <p className="text-ink-dim max-w-xl mx-auto">Industry-ready career, leadership, communication, and AI automation programmes.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-ink-dim">No courses available yet. Check back soon!</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(c => (
              <div key={c._id} className="glass rounded-2xl p-6 flex flex-col gap-4 hover:border-violet-400/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold text-white leading-snug">{c.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize shrink-0 ${modeColor[c.mode]}`}>{c.mode}</span>
                </div>
                {c.description && <p className="text-sm text-ink-dim line-clamp-2">{c.description}</p>}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {c.category && (
                    <span className="inline-flex items-center gap-1 text-xs text-ink-dim"><Tag size={11} />{c.category}</span>
                  )}
                  {c.duration && (
                    <span className="inline-flex items-center gap-1 text-xs text-ink-dim"><Clock size={11} />{c.duration}</span>
                  )}
                  {c.startDate && (
                    <span className="inline-flex items-center gap-1 text-xs text-ink-dim"><Calendar size={11} />Starts {formatStartDate(c.startDate)}</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${levelColor[c.level]}`}>{c.level}</span>
                </div>
                <div className="flex items-center justify-end pt-3 border-t border-line2">
                  <Link to={`/courses/${c.slug}`} className="btn-primary text-sm px-4 py-2">
                    View Course <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center pt-8 border-t border-violet-500/10 flex items-center justify-center gap-2 text-sm text-ink-dim flex-wrap">
          <span>Manage or add programmes from the</span>
          <a
            href="http://localhost:5174/courses"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:text-violet-300 font-medium inline-flex items-center gap-1 hover:underline"
          >
            Admin Panel <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
