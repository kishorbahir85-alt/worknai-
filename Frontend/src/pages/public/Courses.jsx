import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Tag, ArrowRight, Calendar } from 'lucide-react';
import api from '../../utils/api';

const levelColor = { beginner: 'text-emerald-400 bg-emerald-500/10', intermediate: 'text-amber-400 bg-amber-500/10', advanced: 'text-red-400 bg-red-500/10' };
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
          <span className="chip mb-4">Our Programs</span>
          <h1 className="display-h text-4xl md:text-5xl text-ink mb-4">Training Courses</h1>
          <p className="text-ink-dim max-w-xl mx-auto">Industry-ready courses in MERN, Python, .NET, PHP and more — online & offline in Pune.</p>
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
                <div className="flex items-center justify-between pt-3 border-t border-line2">
                  <span className="text-lg font-semibold text-white">{c.price ? `₹${c.price.toLocaleString()}` : <span className="text-emerald-400 text-sm font-medium">Free</span>}</span>
                  <Link to={`/courses/${c.slug}`} className="btn-primary text-sm px-4 py-2">
                    View Course <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
