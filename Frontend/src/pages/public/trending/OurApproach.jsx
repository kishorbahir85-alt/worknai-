import { Sparkles, Code2, Users, Rocket } from 'lucide-react';
import TrendingTopicsLayout, { useTrendingStyles, uimg } from '../../../components/ui/TrendingTopicsLayout';

const approaches = [
  { title: 'Transformational Thinking', desc: 'Spark innovation with curiosity and the courage to reimagine what\'s possible.', icon: Sparkles, image: uimg('photo-1531403009284-440f080d1e12', 800) },
  { title: 'Transformational Technology', desc: 'Implement smart solutions that personalize training and simplify operations.', icon: Code2, image: uimg('photo-1461749280684-dccba630e2f6', 800) },
  { title: 'Transformational Partnerships', desc: 'Unlock new opportunities in an ecosystem of best-in-class companies.', icon: Users, image: uimg('photo-1556761175-b413da4baf72', 800) },
  { title: 'Transformational Impact', desc: 'Create lasting value that benefits our students, clients, and community.', icon: Rocket, image: uimg('photo-1521737604893-d14cc237f11d', 800) },
];

export default function TrendingOurApproach() {
  const s = useTrendingStyles();

  return (
    <TrendingTopicsLayout
      heroTitle="Our approach to building better engineers and better software."
      heroSubtitle="Curriculum, mentorship, and real projects — designed to work together."
      heroImage={uimg('photo-1531403009284-440f080d1e12', 1600)}
    >
      <div className="max-w-3xl mb-12 md:mb-16">
        <p className={`${s.label} mb-3`}>Our Approach</p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">
          Explore bold ideas, lead with cutting-edge tech, build powerful partnerships
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {approaches.map((a, i) => (
          <div key={a.title} className={`flex flex-col ${s.card}`}>
            <div className="aspect-[16/10] overflow-hidden">
              <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className={`font-display font-bold text-2xl mb-3 ${s.isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="text-lg font-medium text-ink leading-snug mb-2">{a.title}</h3>
              <p className="text-sm text-ink-dim leading-relaxed">{a.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </TrendingTopicsLayout>
  );
}
