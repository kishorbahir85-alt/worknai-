import { useEffect, useState } from 'react';
import {
  ArrowRight, Building2, CheckCircle, Clock, Loader2,
  Mail, MapPin, MessageSquare, Phone, Send, User,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const fallbackInfo = {
  email: 'info@worknai.in',
  phone: '+91 9923400442',
  address: 'Talwade & Punawale Centers, Pune, Maharashtra',
  workingHours: 'Monday to Saturday, 10:00 AM - 7:00 PM',
};

const locations = [
  {
    name: 'Registered Office',
    address: 'Unit 101, Oxford Towers\n139/88, Old Airport Road\nBangalore North, Karnataka – 560008',
  },
  {
    name: 'Corporate Office',
    address: 'Business Park\nSr. No. 199, Behind Jotiba Mandir\nJotiba Nagar, Talawade\nPune – 411062',
  },
  {
    name: 'Research & Development',
    address: 'Waheguru Guru Nanak Mansarovar Ashram, Shree, Akurdi Railway Station Rd, Fitness18, Nigdi, Pimpri-Chinchwad, Maharashtra 411033',
  },
];

const  EnquiryTypes = ['Course  Enquiry', 'Software Project', 'Partnership', 'Hiring / Careers', 'General'];
const inp = 'w-full bg-white/5 border border-violet-500/20 rounded-xl py-3 px-4 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-violet-400/60 transition-all';
const lbl = 'block text-xs font-semibold text-ink-dim mb-1.5 uppercase tracking-wider';

export default function Contact() {
  const [info, setInfo] = useState(fallbackInfo);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    type:  EnquiryTypes[0],
    message: '',
  });

  useEffect(() => {
    api.get('/company')
      .then((r) => setInfo((prev) => ({ ...prev, ...r.data.data })))
      .catch(() => {});
  }, []);

  const f = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Name, email and message are required');
      return;
    }

    setLoading(true);
    try {
      await api.post('/inquiries', { ...form, source: 'contact-page' });
      setSent(true);
      setForm({ name: '', email: '', phone: '', company: '', type:  EnquiryTypes[0], message: '' });
      toast.success('Message sent. Our team will contact you soon.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page text-ink">
      <section className="section !pt-12 md:!pt-20">
        <div className="container-x">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-start">
            <div>
              <span className="chip mb-5">Contact Us</span>
              <h1 className="display-h text-4xl md:text-6xl text-ink mb-5">
                Let&apos;s build something useful.
              </h1>
              <p className="text-ink-dim text-base md:text-lg leading-relaxed max-w-xl">
                Talk to us about courses, internships, software projects, partnerships, or hiring.
                Share a few details and the WorknAi team will get back to you.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                <a href={`mailto:${info.email || fallbackInfo.email}`} className="glass rounded-2xl p-5 group transition-all hover:border-violet-400/40">
                  <Mail className="w-5 h-5 text-violet-400 mb-4" />
                  <p className="font-semibold text-ink">Email</p>
                  <p className="text-sm text-ink-dim break-all mt-1 group-hover:text-violet-300 transition-colors">{info.email || fallbackInfo.email}</p>
                </a>
                <div className="glass rounded-2xl p-5 sm:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-5 h-5 text-violet-400" />
                    <p className="text-lg font-semibold text-ink">Office Locations</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {locations.map((loc) => (
                      <div key={loc.name} className="rounded-3xl border border-violet-500/10 bg-white/5 p-5 shadow-sm ring-1 ring-white/5 transition hover:border-violet-400/30 hover:bg-violet-500/5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-300 flex items-center justify-center">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <p className="font-semibold text-ink">{loc.name}</p>
                        </div>
                        <p className="text-sm text-ink-dim leading-relaxed whitespace-pre-line">{loc.address}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass rounded-2xl p-5 sm:col-span-2">
                  <Clock className="w-5 h-5 text-violet-400 mb-4" />
                  <p className="font-semibold text-ink">Working Hours</p>
                  <p className="text-sm text-ink-dim mt-1">{info.workingHours || fallbackInfo.workingHours}</p>
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="glass-strong rounded-2xl p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold">Send a message</p>
                  <h2 className="text-2xl font-bold text-ink mt-1">Tell us what you need</h2>
                </div>
                <div className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-400/30 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-violet-400" />
                </div>
              </div>

              {sent && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                  <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Your message has been sent successfully.</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}><User className="w-3.5 h-3.5 inline mr-1" />Name *</label>
                  <input className={inp} value={form.name} onChange={f('name')} placeholder="Your full name" />
                </div>
                <div>
                  <label className={lbl}><Mail className="w-3.5 h-3.5 inline mr-1" />Email *</label>
                  <input type="email" className={inp} value={form.email} onChange={f('email')} placeholder="you@example.com" />
                </div>
                <div>
                  <label className={lbl}><Phone className="w-3.5 h-3.5 inline mr-1" />Phone</label>
                  <input className={inp} value={form.phone} onChange={f('phone')} placeholder="+91 99999 99999" />
                </div>
                <div>
                  <label className={lbl}><Building2 className="w-3.5 h-3.5 inline mr-1" />Company</label>
                  <input className={inp} value={form.company} onChange={f('company')} placeholder="Optional" />
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl}> Enquiry Type</label>
                  <select className={inp} value={form.type} onChange={f('type')}>
                    { EnquiryTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl}>Message *</label>
                  <textarea className={`${inp} min-h-32 resize-y`} value={form.message} onChange={f('message')} placeholder="Write your message..." />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary justify-center w-full mt-6 disabled:opacity-60">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="section bg-violet-900/10">
        <div className="container-x">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Visit Us</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">Our Locations</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {locations.map((loc) => (
              <div key={loc.name} className="glass rounded-2xl p-6 md:p-7">
                <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-400/30 flex items-center justify-center mb-5">
                  <MapPin className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="font-display text-xl font-semibold text-ink mb-2">{loc.name}</h3>
                <p className="text-sm text-ink-dim leading-relaxed whitespace-pre-line">{loc.address}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 glass rounded-2xl overflow-hidden">
            <div className="aspect-[16/7] min-h-[260px] bg-violet-500/10 flex items-center justify-center p-6 text-center">
              <div>
                <MapPin className="w-10 h-10 text-violet-400 mx-auto mb-3" />
                <p className="font-semibold text-ink">WorknAi Technologies, Pune</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=WorknAi%20Technologies%20Pune"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 mt-3"
                >
                  Open in Google Maps <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
