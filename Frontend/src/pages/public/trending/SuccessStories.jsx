import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TrendingTopicsLayout from '../../../components/ui/TrendingTopicsLayout';

const stories = [
  { tag: 'Training', title: 'How a first-time coder landed a full-stack role in 6 months', date: 'June 2026' },
  { tag: 'Product', title: 'Building WorknAi HRMS: from idea to 500+ clients', date: 'May 2026' },
  { tag: 'Partnership', title: 'Scaling IT training across Pune with new center launches', date: 'April 2026' },
  { tag: 'Product', title: 'AI-powered face attendance: 99.9% accuracy in production', date: 'March 2026' },
];

export default function TrendingSuccessStories() {
  return (
    <TrendingTopicsLayout
      heroTitle="Success stories from the WorknAi community."
      heroSubtitle="Real students, real products, real outcomes."
    >
      <div>
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="chip mb-4">Ahead of the curve</span>
            <h2 className="display-h text-3xl sm:text-4xl text-ink">Success stories</h2>
          </div>
          <Link to="/blog" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-violet-400 font-medium">
            Explore more <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stories.map((s) => (
            <div key={s.title} className="glass rounded-2xl p-5 hover:border-violet-400/50 hover:-translate-y-1 transition-all duration-300">
              <span className="text-xs text-violet-400 font-medium uppercase tracking-wide">{s.tag}</span>
              <h3 className="font-display text-base font-semibold text-ink mt-2 mb-3 leading-snug">{s.title}</h3>
              <span className="text-xs text-ink-faint">{s.date}</span>
            </div>
          ))}
        </div>
      </div>
    </TrendingTopicsLayout>
  );
}
