import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TrendingTopicsLayout, { useTrendingStyles, uimg } from '../../../components/ui/TrendingTopicsLayout';

const stories = [
  { tag: 'Training', title: 'How a first-time coder landed a full-stack role in 6 months', date: 'June 2026', image: uimg('photo-1523240795612-9a054b0db644', 800) },
  { tag: 'Product', title: 'Building WorknAi HRMS: from idea to 500+ clients', date: 'May 2026', image: uimg('photo-1551288049-bebda4e38f71', 800) },
  { tag: 'Partnership', title: 'Scaling IT training across Pune with new center launches', date: 'April 2026', image: uimg('photo-1486406146926-c627a92ad1ab', 800) },
  { tag: 'Product', title: 'AI-powered face attendance: 99.9% accuracy in production', date: 'March 2026', image: uimg('photo-1573164713988-8665fc963095', 800) },
];

export default function TrendingSuccessStories() {
  const s = useTrendingStyles();

  return (
    <TrendingTopicsLayout
      heroTitle="Success stories from the WorknAi community."
      heroSubtitle="Real students, real products, real outcomes."
      heroImage={uimg('photo-1521737604893-d14cc237f11d', 1600)}
    >
      <div className="flex items-end justify-between gap-4 mb-12 md:mb-16">
        <div className="max-w-3xl">
          <p className={`${s.label} mb-3`}>Ahead of the curve</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">
            Success stories
          </h2>
        </div>
        <Link
          to="/blog"
          className={`hidden sm:inline-flex items-center gap-1.5 text-sm font-medium ${s.isDark ? 'text-violet-400' : 'text-violet-600'} hover:underline`}
        >
          Explore more <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stories.map((story) => (
          <div key={story.title} className={`flex flex-col ${s.card}`}>
            <div className="aspect-[16/10] overflow-hidden">
              <img src={story.image} alt={story.title} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <span className={`${s.label} mb-2`}>{story.tag}</span>
              <h3 className="text-base font-medium text-ink leading-snug mb-6">{story.title}</h3>
              <span className="mt-auto text-sm text-ink-faint">{story.date}</span>
            </div>
          </div>
        ))}
      </div>
    </TrendingTopicsLayout>
  );
}
