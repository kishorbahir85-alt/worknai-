import { Quote, Star } from 'lucide-react';
import TrendingTopicsLayout from '../../../components/ui/TrendingTopicsLayout';

const experts = [
  { quote: 'You can\'t transform careers through training alone — you need real projects, real mentors, and a real community behind you.', name: 'Aman Salim Patel', role: 'Co-Founder & Director' },
  { quote: 'The best software gets built by people who were taught to think in systems, not just syntax.', name: 'Sahil Salim Patel', role: 'Co-Founder & Director' },
];

export default function TrendingExpertVoices() {
  return (
    <TrendingTopicsLayout
      heroTitle="Expert voices from the people building WorknAi."
      heroSubtitle="Perspectives on training, technology, and what it takes to grow a career in tech."
    >
      <div>
        <span className="chip mb-4"><Quote size={12} /> Expert Voices</span>
        <div className="grid sm:grid-cols-2 gap-6">
          {experts.map((e) => (
            <div key={e.name} className="glass-strong rounded-2xl p-7 flex flex-col gap-4">
              <Quote className="w-7 h-7 text-violet-400/50" />
              <p className="text-ink-dim leading-relaxed">&ldquo;{e.quote}&rdquo;</p>
              <div className="flex items-center gap-2 pt-3 border-t border-line2">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-ink">{e.name}</div>
                  <div className="text-xs text-ink-faint">{e.role}</div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-violet-400 text-violet-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TrendingTopicsLayout>
  );
}
