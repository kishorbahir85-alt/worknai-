import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import TrendingTopicsLayout, { useTrendingStyles, uimg } from '../../../components/ui/TrendingTopicsLayout';

export default function TrendingContactUs() {
  const s = useTrendingStyles();

  return (
    <TrendingTopicsLayout
      heroTitle="How can we support your growth?"
      heroSubtitle="Training, products, or partnerships — let's talk."
      heroImage={uimg('photo-1497366811353-6870744d04b2', 1600)}
    >
      {/* Text + contact tiles left, photo right */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <p className={`${s.label} mb-3`}>Talk to Us</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-5">
            Reach the WorknAi team
          </h2>
          <p className="text-base md:text-lg text-ink-dim leading-relaxed mb-8">
            Whether it's training your team, building a product, or exploring a
            partnership — reach out and we will get back to you.
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            <a href="mailto:info@worknai.in" className={`p-6 hover:opacity-90 transition-opacity ${s.card}`}>
              <Mail className={`w-5 h-5 mb-4 ${s.isDark ? 'text-violet-400' : 'text-violet-600'}`} />
              <p className="font-medium text-ink">Email</p>
              <p className="text-sm text-ink-dim mt-1">info@worknai.in</p>
            </a>
            <div className={`p-6 transition-opacity ${s.card} sm:col-span-2`}>
              <MapPin className={`w-5 h-5 mb-4 ${s.isDark ? 'text-violet-400' : 'text-violet-600'}`} />
              <p className="font-medium text-ink">Office Locations</p>
              <p className="text-sm text-ink-dim mt-1 leading-relaxed">
                Registered Office: Unit 101, Oxford Towers, 139/88, Old Airport Road, Bangalore North, Karnataka – 560008<br />
                Corporate Office: Business Park, Sr. No. 199, Behind Jotiba Mandir, Jotiba Nagar, Talawade, Pune – 411062<br />
                Research &amp; Development: Waheguru Guru Nanak Mansarovar Ashram, Shree, Akurdi Railway Station Rd, Fitness18, Nigdi, Pimpri-Chinchwad, Maharashtra 411033
              </p>
            </div>
          </div>
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

      {/* Get in touch — Blog page jaisa centered block */}
      <div className="text-center mt-16 md:mt-24">
        <p className={`${s.label} mb-3`}>Get in touch</p>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-8">
          Stay up to date with all things WorknAi
        </h2>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors"
        >
          Contact us <Mail size={15} />
        </Link>
      </div>
    </TrendingTopicsLayout>
  );
}
