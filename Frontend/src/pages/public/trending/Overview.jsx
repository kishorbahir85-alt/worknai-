import { Link } from 'react-router-dom';
import { ArrowRight, Users, Briefcase, Code2, Award } from 'lucide-react';
import TrendingTopicsLayout, { useTrendingStyles, uimg } from '../../../components/ui/TrendingTopicsLayout';

const stats = [
  { label: 'Engineers & Staff', value: '50+', icon: Users },
  { label: 'Global Clients', value: '500+', icon: Briefcase },
  { label: 'Courses Offered', value: '10+', icon: Code2 },
  { label: 'Founded', value: '2025', icon: Award },
];

const pillars = [
  { tag: 'Training', title: 'IT courses built around live projects', desc: 'Students write production code from week one — with AI-assisted reviews and industry mentors.', image: uimg('photo-1524178232363-1fb2b075b655', 800) },
  { tag: 'Products', title: 'SaaS from our own R&D studio', desc: 'We design, build and operate our own products — the same codebases our students learn on.', image: uimg('photo-1555066931-4365d14bab8c', 800) },
  { tag: 'Careers', title: 'From learning to placement', desc: 'Portfolio reviews, mock interviews and hiring-partner referrals across Pune and beyond.', image: uimg('photo-1531482615713-2afd69097998', 800) },
];

export default function TrendingOverview() {
  const s = useTrendingStyles();

  return (
    <TrendingTopicsLayout
      heroTitle="How do you transform the experience of learning & building software?"
      heroSubtitle="WorknAi. Where AI meets your work."
      heroImage={uimg('photo-1522071820081-009f0129c71c', 1600)}
    >
      {/* Stats row — flat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16 md:mb-24">
        {stats.map((item) => (
          <div key={item.label} className={`p-6 text-center ${s.card}`}>
            <item.icon className={`w-6 h-6 mx-auto mb-3 ${s.isDark ? 'text-violet-400' : 'text-violet-600'}`} />
            <div className="text-3xl font-display font-bold text-ink">{item.value}</div>
            <div className="text-sm text-ink-faint mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Who we are — text left, photo right */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16 md:mb-24">
        <div>
          <p className={`${s.label} mb-3`}>Who we are</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-6">
            Building the future of tech &amp; talent
          </h2>
          <p className="text-base md:text-lg text-ink-dim leading-relaxed">
            WorknAi Technologies bridges the gap between digital corporate solutions and IT
            academic training — empowering businesses and individuals across Pune and beyond
            with hands-on courses, custom software, and AI-powered products.
          </p>
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-lg">
          <img
            src={uimg('photo-1497366216548-37526070297c', 1000)}
            alt="WorknAi office"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Pillars — image-top flat cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {pillars.map((p) => (
          <div key={p.tag} className={`flex flex-col ${s.card}`}>
            <div className="aspect-[16/10] overflow-hidden">
              <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 md:p-8 flex flex-col flex-1">
              <span className={`${s.label} mb-3`}>{p.tag}</span>
              <h3 className="text-lg md:text-xl font-medium text-ink leading-snug mb-3">{p.title}</h3>
              <p className="text-sm text-ink-dim leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA band */}
      <div className="relative overflow-hidden bg-[#0c0a30] mt-16 md:mt-24">
        <svg className="absolute inset-0 w-full h-full opacity-25" aria-hidden="true" preserveAspectRatio="none">
          <path d="M 60 130 L 260 -30" fill="none" stroke="#8b9dd6" strokeWidth="1" />
          <path d="M 340 160 Q 520 20 700 120 T 1060 90" fill="none" stroke="#4f6bd8" strokeWidth="1.5" />
          <path d="M 1150 150 L 1350 -20" fill="none" stroke="#8b9dd6" strokeWidth="1" />
        </svg>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5 px-6 md:px-10 py-8 md:py-9">
          <div>
            <h3 className="font-display text-lg md:text-xl font-semibold text-white mb-1">Explore our courses</h3>
            <p className="text-sm text-white/70">AI, full-stack development, data and more — taught the WorknAi way.</p>
          </div>
          <Link
            to="/courses"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded bg-white text-[#0c0a30] text-sm font-semibold hover:bg-violet-50 transition-colors"
          >
            Go to Courses <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </TrendingTopicsLayout>
  );
}
