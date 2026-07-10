import TrendingTopicsLayout, { useTrendingStyles, uimg } from '../../../components/ui/TrendingTopicsLayout';

const experts = [
  { quote: 'You can\'t transform careers through training alone — you need real projects, real mentors, and a real community behind you.', name: 'Aman Salim Patel', role: 'Co-Founder & Director' },
  { quote: 'The best software gets built by people who were taught to think in systems, not just syntax.', name: 'Sahil Salim Patel', role: 'Co-Founder & Director' },
];

export default function TrendingExpertVoices() {
  const s = useTrendingStyles();

  return (
    <TrendingTopicsLayout
      heroTitle="Expert voices from the people building WorknAi."
      heroSubtitle="Perspectives on training, technology, and what it takes to grow a career in tech."
      heroImage={uimg('photo-1475721027785-f74eccf877e2', 1600)}
    >
      <div className="max-w-3xl mb-12 md:mb-16">
        <p className={`${s.label} mb-3`}>Expert Voices</p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">
          Perspectives from the people who build &amp; teach
        </h2>
      </div>

      {/* Photo left + quote cards right */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="overflow-hidden rounded-lg hidden lg:block">
          <img
            src={uimg('photo-1556761175-b413da4baf72', 900)}
            alt="WorknAi team discussion"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        {experts.map((e) => (
          <div key={e.name} className={`p-6 md:p-8 flex flex-col ${s.card}`}>
            <span className={`${s.label} mb-4`}>{e.role}</span>
            <p className="text-base md:text-lg text-ink leading-relaxed mb-8">&ldquo;{e.quote}&rdquo;</p>
            <p className="mt-auto text-sm text-ink-faint">— {e.name}</p>
          </div>
        ))}
      </div>

      {/* Wide team photo strip */}
      <div className="mt-5 aspect-[21/7] overflow-hidden rounded-lg hidden md:block">
        <img
          src={uimg('photo-1522071820081-009f0129c71c', 1600)}
          alt="WorknAi team at work"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
    </TrendingTopicsLayout>
  );
}
