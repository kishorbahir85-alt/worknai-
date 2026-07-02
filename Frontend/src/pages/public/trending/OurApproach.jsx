import { Sparkles, Code2, Users, Rocket } from 'lucide-react';
import TrendingTopicsLayout from '../../../components/ui/TrendingTopicsLayout';

const approaches = [
  { title: 'Transformational Thinking', desc: 'Spark innovation with curiosity and the courage to reimagine what\'s possible.', icon: Sparkles },
  { title: 'Transformational Technology', desc: 'Implement smart solutions that personalize training and simplify operations.', icon: Code2 },
  { title: 'Transformational Partnerships', desc: 'Unlock new opportunities in an ecosystem of best-in-class companies.', icon: Users },
  { title: 'Transformational Impact', desc: 'Create lasting value that benefits our students, clients, and community.', icon: Rocket },
];

export default function TrendingOurApproach() {
  return (
    <TrendingTopicsLayout
      heroTitle="Our approach to building better engineers and better software."
      heroSubtitle="Curriculum, mentorship, and real projects — designed to work together."
    >
      <div>
        <div className="text-center mb-10">
          <p className="text-sm text-ink-faint mb-2">As the industry evolves, so do the ways we deliver value.</p>
          <h2 className="display-h text-3xl sm:text-4xl text-ink max-w-2xl mx-auto">
            Explore bold ideas, lead with cutting-edge tech, build powerful partnerships
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {approaches.map((a) => (
            <div key={a.title} className="glass rounded-2xl p-6 hover:border-violet-400/50 hover:-translate-y-1 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-400/30 flex items-center justify-center mb-4">
                <a.icon className="w-5 h-5 text-violet-300" />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink mb-2">{a.title}</h3>
              <p className="text-ink-dim text-sm leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </TrendingTopicsLayout>
  );
}
