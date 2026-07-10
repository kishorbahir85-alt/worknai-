import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Clock, Tag, CheckCircle, AlertCircle,
  Loader2, User, Phone, GraduationCap, MapPin,
  X, Calendar, Users, Mail, Send,
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

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

const emptyForm = { name: '', email: '', phone: '', qualification: '', address: '', message: '' };

export default function CourseDetail() {
  const { slug } = useParams();

  const [course, setCourse]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [notFound, setNotFound]     = useState(false);
  const [sent, setSent]             = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [batchId, setBatchId]       = useState('');

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
    setShowModal(true);
  };

  const isOffline = course && (course.mode === 'offline' || course.mode === 'hybrid');
  const hasBatches = course?.batches?.length > 0;
  const price = course ? (course.discountPrice > 0 ? course.discountPrice : course.price) : 0;
  const courseStartDate = formatStartDate(getCourseStartDate(course));

  const submitInquiry = async () => {
    if (!form.name || !form.email || !form.phone) return toast.error('Name, email, and phone are required');
    if (isOffline && hasBatches && !batchId) return toast.error('Please select a batch');
    setSubmitting(true);
    try {
      const selectedBatch = course.batches?.find((b) => b._id === batchId);
      const batchNote = selectedBatch ? `Preferred batch: ${selectedBatch.name}` : '';
      await api.post('/inquiries', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        qualification: form.qualification,
        address: form.address,
        message: [form.message, batchNote].filter(Boolean).join(' — ') || `Interested in enrolling in ${course.title}.`,
        type: 'Course Enrollment',
        source: 'course-enrollment',
        course: course._id,
      });
      setSent(true);
      setShowModal(false);
      toast.success('Enrollment inquiry submitted! Our team will reach out soon.');
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
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <Link to="/courses" className="inline-flex items-center gap-2 text-sm text-ink-dim hover:text-ink transition-colors mb-8">
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
            <div className="text-right">
              {course.discountPrice > 0 ? (
                <><p className="text-2xl font-bold text-white">₹{course.discountPrice.toLocaleString()}</p><p className="text-sm text-ink-dim line-through">₹{course.price.toLocaleString()}</p></>
              ) : (
                <p className="text-2xl font-bold text-white">{course.price > 0 ? `₹${course.price.toLocaleString()}` : <span className="text-emerald-400">Free</span>}</p>
              )}
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
            <div className="flex items-center gap-2 text-green-400 font-medium">
              <CheckCircle className="w-5 h-5" /> Enrollment inquiry submitted — our team will reach out soon
            </div>
          ) : (
            <button onClick={openModal} className="btn-primary">
              <BookOpen className="w-4 h-4"/>
              {course.mode === 'offline' ? 'Apply Now' : price > 0 ? `Enroll for ₹${price.toLocaleString()}` : 'Enroll for Free'}
            </button>
          )}
        </div>
      </section>

      {/* ══ Modal ══ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="w-full max-w-md bg-[#0d0d1a] border border-violet-500/20 rounded-2xl p-6 shadow-2xl my-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">Enrollment Inquiry</h2>
                <p className="text-xs text-ink-dim mt-0.5">{course.title}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-ink-dim hover:text-ink hover:bg-violet-500/10 transition-colors"><X className="w-4 h-4"/></button>
            </div>

            <div className="flex flex-col gap-4">
              <div><label className={lbl}><User className="w-3 h-3 inline mr-1"/>Full Name <span className="text-violet-400">*</span></label>
                <input type="text" value={form.name} onChange={f('name')} placeholder="Your full name" className={inp}/></div>
              <div><label className={lbl}><Mail className="w-3 h-3 inline mr-1"/>Email <span className="text-violet-400">*</span></label>
                <input type="email" value={form.email} onChange={f('email')} placeholder="you@example.com" className={inp}/></div>
              <div><label className={lbl}><Phone className="w-3 h-3 inline mr-1"/>Phone Number <span className="text-violet-400">*</span></label>
                <input type="tel" value={form.phone} onChange={f('phone')} placeholder="+91 99999 99999" className={inp}/></div>
              <div><label className={lbl}><GraduationCap className="w-3 h-3 inline mr-1"/>Highest Qualification</label>
                <input type="text" value={form.qualification} onChange={f('qualification')} placeholder="e.g. B.Tech, 12th, BCA" className={inp}/></div>
              {isOffline && (
                <div><label className={lbl}><MapPin className="w-3 h-3 inline mr-1"/>Address</label>
                  <input type="text" value={form.address} onChange={f('address')} placeholder="Your address" className={inp}/></div>
              )}

              {/* Batch selection */}
              {isOffline && hasBatches && (
                <div>
                  <label className={lbl}><Calendar className="w-3 h-3 inline mr-1"/>Select Batch <span className="text-violet-400">*</span></label>
                  <div className="flex flex-col gap-2">
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

              <div>
                <label className={lbl}>Message <span className="text-ink-dim text-xs">(optional)</span></label>
                <textarea value={form.message} onChange={f('message')} rows={3} placeholder="Any questions or details you'd like to share..." className={inp + ' resize-none'} />
              </div>

              <button onClick={submitInquiry} disabled={submitting} className="btn-primary justify-center mt-1 disabled:opacity-50">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin"/>Submitting...</> : <><Send className="w-4 h-4"/>Submit Enrollment Inquiry</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
