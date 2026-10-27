import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Clock, Tag, CheckCircle, AlertCircle,
  Loader2, User, Phone, GraduationCap, MapPin,
  X, Calendar, Users, Mail, Send, QrCode, Copy, Smartphone, ArrowRight,
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const UPI_ID   = import.meta.env.VITE_UPI_ID   || '7225962334@axl';
const UPI_NAME = import.meta.env.VITE_UPI_NAME || 'WorknAi Technologies';

const levelColor = { beginner: 'text-emerald-400 bg-emerald-500/10', intermediate: 'text-amber-300 bg-amber-500/10', advanced: 'text-rose-300 bg-rose-500/10' };
const modeColor  = { online: 'text-sky-400 bg-sky-500/10', offline: 'text-violet-400 bg-violet-500/10', hybrid: 'text-pink-400 bg-pink-500/10' };
const inp = 'w-full bg-white/5 border border-violet-500/20 rounded-xl py-2.5 px-4 text-sm text-white placeholder-ink-dim focus:outline-none focus:border-violet-400/60 transition-all';
const lbl = 'block text-xs font-medium text-ink-dim mb-1.5';
const formatStartDate = (value) => {
  if (!value) return '';
  const text = String(value).trim();
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(text)
    ? text
    : text.replace(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/, (_, day, month, year) => `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
  const date = new Date(`${normalized}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

const getCourseStartDate = (course) => {
  if (!course) return '';
  if (course.startDate) return course.startDate;

  const batchDates = (course.batches || [])
    .map((batch) => batch.startDate)
    .filter(Boolean)
    .sort((a, b) => new Date(`${a}T00:00:00`) - new Date(`${b}T00:00:00`));

  return batchDates[0] || '';
};

const emptyForm = { name: '', email: '', phone: '', qualification: '', address: '', message: '', transactionRef: '' };

export default function CourseDetail() {
  const { slug } = useParams();

  const [course, setCourse]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [notFound, setNotFound]     = useState(false);
  const [sent, setSent]             = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [modalStep, setModalStep]   = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [batchId, setBatchId]       = useState('');
  const [copiedUpi, setCopiedUpi]   = useState(false);

  const [form, setForm] = useState(emptyForm);
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    api.get(`/courses/${slug}`)
      .then(r => setCourse(r.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const openModal = () => {
    setForm(emptyForm);
    setBatchId('');
    setModalStep(1);
    setShowModal(true);
  };

  const isOffline = course && (course.mode === 'offline' || course.mode === 'hybrid');
  const hasBatches = course?.batches?.length > 0;
  const price = course ? (course.discountPrice > 0 ? course.discountPrice : course.price) : 0;
  const courseStartDate = formatStartDate(getCourseStartDate(course));

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}${price > 0 ? `&am=${price}` : ''}&cu=INR&tn=${encodeURIComponent('Course: ' + (course?.title || ''))}`;
  const qrUrl   = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiLink)}&margin=10`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
    toast.success('UPI ID copied: ' + UPI_ID);
  };

  const proceedToQrStep = () => {
    if (!form.name?.trim()) return toast.error('Full Name is required');
    if (!form.email?.trim()) return toast.error('Email is required');
    if (!form.phone?.trim()) return toast.error('Phone number is required');
    if (isOffline && hasBatches && !batchId) return toast.error('Please select a batch');
    setModalStep(2);
  };

  const submitEnquiry = async () => {
    if (!form.name?.trim() || !form.email?.trim() || !form.phone?.trim()) {
      return toast.error('Name, email, and phone are required');
    }
    if (isOffline && hasBatches && !batchId) return toast.error('Please select a batch');
    setSubmitting(true);
    try {
      const selectedBatch = course.batches?.find((b) => b._id === batchId);
      const batchNote = selectedBatch ? `Preferred batch: ${selectedBatch.name}` : '';
      const utrNote = form.transactionRef?.trim() ? `UPI Ref/UTR: ${form.transactionRef.trim()}` : '';
      await api.post('/inquiries', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        qualification: form.qualification || '',
        address: form.address || '',
        message: [form.message, batchNote, utrNote].filter(Boolean).join(' — ') || `Interested in enrolling in ${course.title}.`,
        type: 'Course Enrollment',
        source: 'course-enrollment',
        course: course._id,
      });
      setSent(true);
      setShowModal(false);
      toast.success('Enrollment application submitted successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-violet-400 animate-spin" /></div>;
  if (notFound || !course) return (
    <section className="py-20 text-center px-4">
      <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-ink mb-2">Course not found</h1>
      <Link to="/courses" className="btn-primary mt-4"><ArrowLeft className="w-4 h-4" /> Back to Courses</Link>
    </section>
  );

  return (
    <>
      <section className="section py-8 md:py-14">
        <div className="container-x max-w-5xl">
          <Link to="/courses" className="inline-flex items-center gap-2 text-sm text-ink-dim hover:text-ink transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </Link>

        <div className="bg-[#0d0d1a]/80 border border-violet-500/20 rounded-2xl p-8 backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              {course.icon && <span className="text-5xl">{course.icon}</span>}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{course.title}</h1>
                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${levelColor[course.level]}`}>{course.level}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${modeColor[course.mode]}`}>{course.mode}</span>
                  {course.category && <span className="inline-flex items-center gap-1 text-xs text-ink-dim px-2.5 py-1 bg-white/5 rounded-full"><Tag size={10}/>{course.category}</span>}
                  {course.duration && <span className="inline-flex items-center gap-1 text-xs text-ink-dim px-2.5 py-1 bg-white/5 rounded-full"><Clock size={10}/>{course.duration}</span>}
                  <span className="inline-flex items-center gap-1 text-xs text-ink-dim px-2.5 py-1 bg-white/5 rounded-full">
                    <Calendar size={10}/>{courseStartDate ? `Starts ${courseStartDate}` : 'Start date TBA'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 grid sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-violet-300 font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5"/>Course Starts
              </p>
              <p className="text-white font-semibold mt-1">{courseStartDate || 'Date to be announced'}</p>
            </div>
            {course.duration && (
              <div className="rounded-xl border border-violet-500/20 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-ink-dim font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5"/>Duration
                </p>
                <p className="text-white font-semibold mt-1">{course.duration}</p>
              </div>
            )}
            {course.mode && (
              <div className="rounded-xl border border-violet-500/20 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-ink-dim font-semibold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5"/>Mode
                </p>
                <p className="text-white font-semibold mt-1 capitalize">{course.mode}</p>
              </div>
            )}
          </div>

          {/* Batches display */}
          {isOffline && hasBatches && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-violet-400"/>Available Batches</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {course.batches.map((b) => {
                  const full = b.totalSeats > 0 && b.enrolledCount >= b.totalSeats;
                  return (
                    <div key={b._id} className={`border rounded-xl p-4 ${full ? 'border-rose-500/20 bg-rose-500/5 opacity-60' : 'border-violet-500/20 bg-violet-500/5'}`}>
                      <p className="text-white font-semibold text-sm">{b.name}</p>
                      {b.timing && <p className="text-ink-dim text-xs mt-1"><Clock size={10} className="inline mr-1"/>{b.timing}</p>}
                      {b.days   && <p className="text-ink-dim text-xs"><Calendar size={10} className="inline mr-1"/>{b.days}</p>}
                      {b.startDate && <p className="text-ink-dim text-xs">Starts: {formatStartDate(b.startDate)}</p>}
                      {b.totalSeats > 0 && <p className={`text-xs mt-1 font-medium ${full ? 'text-rose-300' : 'text-emerald-400'}`}><Users size={10} className="inline mr-1"/>{full ? 'Batch Full' : `${b.totalSeats - b.enrolledCount} seats left`}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="border-t border-violet-500/10 mb-6"/>
          {course.description && <div className="text-ink-dim text-sm leading-relaxed whitespace-pre-line mb-8">{course.description}</div>}

          {sent ? (
            <div className="bg-violet-500/10 border border-violet-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold text-sm">Enrollment Application Submitted!</h3>
                  <p className="text-ink-dim text-xs mt-1">
                    {form.transactionRef
                      ? `We received your application with UPI Reference: ${form.transactionRef}. Our admissions team will verify and contact you shortly.`
                      : 'Our team has received your application and will contact you shortly with confirmation and schedule details.'}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-violet-500/20">
                <button
                  type="button"
                  onClick={() => { setModalStep(2); setShowModal(true); }}
                  className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5 text-violet-400" /> View Payment QR Code
                </button>
                <button
                  type="button"
                  onClick={openModal}
                  className="text-xs text-ink-dim hover:text-white transition-colors"
                >
                  Submit another application
                </button>
              </div>
            </div>
          ) : (
            <button onClick={openModal} className="btn-primary">
              <BookOpen className="w-4 h-4"/>
              {course.mode === 'offline' ? 'Apply Now' : 'Enroll Now'}
            </button>
          )}
          </div>
        </div>
      </section>

      {/* ══ Modal ══ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="w-full max-w-xl bg-[#0d0d1a] border border-violet-500/25 rounded-2xl p-6 sm:p-8 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-violet-500/10">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {modalStep === 2 ? 'Payment via QR Code' : 'Enrollment Application'}
                </h2>
                <p className="text-xs text-ink-dim mt-0.5">{course.title}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-ink-dim hover:text-ink hover:bg-violet-500/10 transition-colors"><X className="w-5 h-5"/></button>
            </div>

            {modalStep === 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}><User className="w-3 h-3 inline mr-1"/>Full Name <span className="text-violet-400">*</span></label>
                  <input type="text" value={form.name} onChange={f('name')} placeholder="Your full name" className={inp}/>
                </div>
                <div>
                  <label className={lbl}><Mail className="w-3 h-3 inline mr-1"/>Email <span className="text-violet-400">*</span></label>
                  <input type="email" value={form.email} onChange={f('email')} placeholder="you@example.com" className={inp}/>
                </div>
                <div>
                  <label className={lbl}><Phone className="w-3 h-3 inline mr-1"/>Phone Number <span className="text-violet-400">*</span></label>
                  <input type="tel" value={form.phone} onChange={f('phone')} placeholder="+91 99999 99999" className={inp}/>
                </div>
                <div>
                  <label className={lbl}><GraduationCap className="w-3 h-3 inline mr-1"/>Highest Qualification</label>
                  <input type="text" value={form.qualification} onChange={f('qualification')} placeholder="e.g. B.Tech, 12th, BCA" className={inp}/>
                </div>
                {isOffline && (
                  <div className="sm:col-span-2">
                    <label className={lbl}><MapPin className="w-3 h-3 inline mr-1"/>Address</label>
                    <input type="text" value={form.address} onChange={f('address')} placeholder="Your address" className={inp}/>
                  </div>
                )}

                {/* Batch selection */}
                {isOffline && hasBatches && (
                  <div className="sm:col-span-2">
                    <label className={lbl}><Calendar className="w-3 h-3 inline mr-1"/>Select Batch <span className="text-violet-400">*</span></label>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {course.batches.map((b) => {
                        const full = b.totalSeats > 0 && b.enrolledCount >= b.totalSeats;
                        return (
                          <label key={b._id} className={`flex items-start gap-3 border rounded-xl p-3 transition-all ${full ? 'opacity-40 cursor-not-allowed border-slate-700' : batchId === b._id ? 'border-violet-500/60 bg-violet-500/10 cursor-pointer' : 'border-violet-500/20 hover:border-violet-500/40 cursor-pointer'}`}>
                            <input type="radio" name="batch" value={b._id} disabled={full} checked={batchId === b._id} onChange={() => !full && setBatchId(b._id)} className="mt-0.5"/>
                            <div>
                              <p className="text-white text-sm font-medium">{b.name}</p>
                              {b.timing && <p className="text-ink-dim text-xs">{b.timing}{b.days ? ` · ${b.days}` : ''}</p>}
                              {b.startDate && <p className="text-ink-dim text-xs">Starts: {formatStartDate(b.startDate)}</p>}
                              {b.totalSeats > 0 && <p className={`text-xs font-medium ${full ? 'text-rose-300' : 'text-emerald-400'}`}>{full ? 'Full' : `${b.totalSeats - b.enrolledCount} seats left`}</p>}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className={lbl}>Message <span className="text-ink-dim text-xs">(optional)</span></label>
                  <textarea value={form.message} onChange={f('message')} rows={2} placeholder="Any questions or details you'd like to share..." className={inp + ' resize-none'} />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button type="button" onClick={proceedToQrStep} className="btn-primary w-full justify-center">
                    Proceed to Payment QR Code <ArrowRight className="w-4 h-4 ml-1.5"/>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white">Scan QR Code with any UPI App</h3>
                  <p className="text-xs text-ink-dim mt-0.5">Google Pay · PhonePe · Paytm · BHIM · Cred</p>
                </div>

                {price > 0 && (
                  <div className="flex items-center justify-between bg-violet-500/10 border border-violet-500/25 rounded-xl px-4 py-2.5">
                    <span className="text-ink-dim text-xs">Course Fee</span>
                    <span className="text-lg font-bold text-white">₹{price.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex flex-col items-center gap-2 py-1">
                  <div className="bg-white p-3 rounded-2xl shadow-2xl border-2 border-violet-500/40 inline-block">
                    <img src={qrUrl} alt="UPI Payment QR" className="w-52 h-52 block object-contain" />
                  </div>
                  <p className="text-xs text-ink-dim text-center">Scan with any UPI app to pay directly</p>
                </div>

                <div className="flex items-center justify-between bg-white/5 border border-violet-500/20 rounded-xl px-3.5 py-2.5">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Smartphone className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="text-xs text-ink-dim">UPI ID:</span>
                    <span className="font-mono text-sm text-white font-medium truncate">{UPI_ID}</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyUpiId}
                    className="text-xs text-violet-300 hover:text-white bg-violet-500/20 hover:bg-violet-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors shrink-0"
                  >
                    <Copy className="w-3 h-3" /> {copiedUpi ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div>
                  <label className={lbl}>
                    UPI Transaction ID / UTR Number <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.transactionRef}
                    onChange={f('transactionRef')}
                    placeholder="e.g. 12-digit UTR from payment app"
                    className={inp}
                  />
                  <p className="text-[11px] text-ink-dim mt-1">
                    Enter the 12-digit UTR or Reference number after paying via UPI.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={submitEnquiry}
                    disabled={submitting}
                    className="btn-primary w-full justify-center disabled:opacity-50"
                  >
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin"/>Submitting...</>
                    ) : (
                      <><CheckCircle className="w-4 h-4"/>I've Paid — Submit Application</>
                    )}
                  </button>
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setModalStep(1)}
                      className="text-ink-dim hover:text-white transition-colors"
                    >
                      ← Back to Details
                    </button>
                    <button
                      type="button"
                      onClick={submitEnquiry}
                      disabled={submitting}
                      className="text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      Submit & Pay Later →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
