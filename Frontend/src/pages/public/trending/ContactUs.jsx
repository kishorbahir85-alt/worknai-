import { Link } from 'react-router-dom';
import { Mail, Phone, ArrowRight } from 'lucide-react';
import TrendingTopicsLayout from '../../../components/ui/TrendingTopicsLayout';

export default function TrendingContactUs() {
  return (
    <TrendingTopicsLayout
      heroTitle="How can we support your growth?"
      heroSubtitle="Training, products, or partnerships — let's talk."
    >
      <div className="max-w-xl">
        <span className="chip mb-4">Talk to Us</span>
        <h2 className="display-h text-3xl sm:text-4xl text-ink mb-5">How can we support your growth?</h2>
        <p className="text-ink-dim leading-relaxed mb-8">
          Whether it's training your team, building a product, or exploring a partnership —
          reach out and the WorknAi team will get back to you.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <a href="mailto:info@worknai.in" className="glass rounded-2xl p-5 hover:border-violet-400/40 transition-all">
            <Mail className="w-5 h-5 text-violet-400 mb-3" />
            <p className="font-semibold text-ink text-sm">Email</p>
            <p className="text-sm text-ink-dim mt-1">info@worknai.in</p>
          </a>
          <a href="tel:+919923400442" className="glass rounded-2xl p-5 hover:border-violet-400/40 transition-all">
            <Phone className="w-5 h-5 text-violet-400 mb-3" />
            <p className="font-semibold text-ink text-sm">Phone</p>
            <p className="text-sm text-ink-dim mt-1">+91 9923400442</p>
          </a>
        </div>
        <Link to="/contact" className="btn-primary">Talk to our team <ArrowRight size={15} /></Link>
      </div>
    </TrendingTopicsLayout>
  );
}
