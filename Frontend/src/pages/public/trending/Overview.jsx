import { Users, Briefcase, Code2, Award } from 'lucide-react';
import TrendingTopicsLayout from '../../../components/ui/TrendingTopicsLayout';

const stats = [
  { label: 'Engineers & Staff', value: '50+', icon: Users },
  { label: 'Global Clients', value: '500+', icon: Briefcase },
  { label: 'Courses Offered', value: '10+', icon: Code2 },
  { label: 'Founded', value: '2025', icon: Award },
];

export default function TrendingOverview() {
  return (
    <TrendingTopicsLayout
      heroTitle="How do you transform the experience of learning & building software?"
      heroSubtitle="WorknAi. Where AI meets your work."
    >
      <div className="flex flex-col gap-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-6 text-center">
              <s.icon className="w-6 h-6 text-violet-400 mx-auto mb-3" />
              <div className="text-2xl font-display font-bold text-ink">{s.value}</div>
              <div className="text-xs text-ink-faint mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="max-w-3xl">
          <span className="chip mb-4">Who we are</span>
          <h2 className="display-h text-3xl sm:text-4xl text-ink mb-5">Building the future of tech &amp; talent</h2>
          <p className="text-ink-dim leading-relaxed text-lg">
            WorknAi Technologies bridges the gap between digital corporate solutions and IT academic
            training — empowering businesses and individuals across Pune and beyond with hands-on
            courses, custom software, and AI-powered products. From our first cohort in 2025 to
            training hundreds of engineers today, our mission stays the same: turn curiosity into
            capability, and capability into careers.
          </p>
        </div>
      </div>
    </TrendingTopicsLayout>
  );
}
