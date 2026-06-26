import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Clock, Tag, CheckCircle, AlertCircle,
  Loader2, PlayCircle, User, Phone, GraduationCap, MapPin,
  Copy, Key, X, Calendar, Users, IndianRupee, Smartphone, Mail,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const UPI_ID   = import.meta.env.VITE_UPI_ID   || 'worknai@upi';
const UPI_NAME = import.meta.env.VITE_UPI_NAME || 'WorknAi Technologies';

const levelColor = { beginner: 'text-emerald-400 bg-emerald-500/10', intermediate: 'text-amber-400 bg-amber-500/10', advanced: 'text-red-400 bg-red-500/10' };
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

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate  = useNavigate();
  const { user }  = useAuth();

  const [course, setCourse]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [notFound, setNotFound]     = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [showModal, setShowModal]   = useState(false);
  const [step, setStep]             = useState(1); // 1=details form, 2=payment (online only)
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied]         = useState(false);

  const [form, setForm] = useState({ name: '', email: '', phone: '', qualification: '', address: '', batchId: '', transactionRef: '' });
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    api.get(`/courses/${slug}`)
      .then(r => setCourse(r.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!user || !course) return;
    api.get(`/enrollments/check/${course._id}`)
      .then(r => { if (r.data.data.enrolled) setEnrollment(r.data.data.enrollment); })
      .catch(() => {});
  }, [user, course]);

  const openModal = () => {
    if (!user) { navigate('/login', { state: { from: { pathname: `/courses/${slug}` } } }); return; }
    setForm({ name: user.name || '', email: user.email || '', phone: '', qualification: '', address: '', batchId: '', transactionRef: '' });
    setStep(1);
    setShowModal(true);
  };

  const price  = course ? (course.discountPrice > 0 ? course.discountPrice : course.price) : 0;
  const isOnline  = course && (course.mode === 'online' || course.mode === 'hybrid');
  const isOffline = course && (course.mode === 'offline' || course.mode === 'hybrid');
  const hasBatches = course?.batches?.length > 0;
  const isPaid = price > 0;
  const courseStartDate = formatStartDate(getCourseStartDate(course));

  // Step 1 → proceed to payment (online+paid) or submit directly (offline or free)
  const proceedFromStep1 = () => {
    if (!form.name || !form.email || !form.phone) return toast.error('Name, email, and phone are required');
    if (isOffline && hasBatches && !form.batchId) return toast.error('Please select a batch');
    if (isOnline && isPaid) { setStep(2); return; }
    submitEnrollment();
  };

  const submitEnrollment = async () => {
    if (isOnline && isPaid && !form.transactionRef.trim()) return toast.error('Please enter the UPI Transaction ID / UTR number');
    setSubmitting(true);
    try {
      const res = await api.post('/enrollments', {
        courseId: course._id,
        batchId: form.batchId || undefined,
        transactionRef: form.transactionRef || '',
        studentDetails: { name: form.name, email: form.email, phone: form.phone, qualification: form.qualification, address: form.address },
      });
      setEnrollment(res.data.data);
      setShowModal(false);
      toast.success(isOffline && !isOnline ? 'Application submitted! Our team will contact you.' : 'Enrolled! Payment will be verified shortly.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Enrollment failed');
    } finally {
      setSubmitting(false);
    }
  };

  const copyUpi = () => { navigator.clipboard.writeText(UPI_ID); setCopied(true); setTimeout(() => setCopied(false), 2000); toast.success('UPI ID copied!'); };
  const copyCode = (code) => { navigator.clipboard.writeText(code); toast.success('Access code copied!'); };

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${price}&cu=INR&tn=${encodeURIComponent('Course: ' + (course?.title || ''))}`;
  const qrUrl   = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

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
                    <div key={b._id} className={`border rounded-xl p-4 ${full ? 'border-red-500/20 bg-red-500/5 opacity-60' : 'border-violet-500/20 bg-violet-500/5'}`}>
                      <p className="text-white font-semibold text-sm">{b.name}</p>
                      {b.timing && <p className="text-ink-dim text-xs mt-1"><Clock size={10} className="inline mr-1"/>{b.timing}</p>}
                      {b.days   && <p className="text-ink-dim text-xs"><Calendar size={10} className="inline mr-1"/>{b.days}</p>}
                      {b.startDate && <p className="text-ink-dim text-xs">Starts: {formatStartDate(b.startDate)}</p>}
                      {b.totalSeats > 0 && <p className={`text-xs mt-1 font-medium ${full ? 'text-red-400' : 'text-emerald-400'}`}><Users size={10} className="inline mr-1"/>{full ? 'Batch Full' : `${b.totalSeats - b.enrolledCount} seats left`}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="border-t border-violet-500/10 mb-6"/>
          {course.description && <div className="text-ink-dim text-sm leading-relaxed whitespace-pre-line mb-8">{course.description}</div>}

          {enrollment ? (
            <EnrolledState enrollment={enrollment} course={course} slug={slug} copyCode={copyCode}/>
          ) : (
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={openModal} className="btn-primary">
                <BookOpen className="w-4 h-4"/>
                {course.mode === 'offline' ? 'Apply Now' : price > 0 ? `Enroll for ₹${price.toLocaleString()}` : 'Enroll for Free'}
              </button>
              {!user && <p className="text-sm text-ink-dim"><Link to="/login" className="text-violet-400 hover:text-violet-300">Login</Link> to apply</p>}
            </div>
          )}
        </div>
      </section>

      {/* ══ Modal ══ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="w-full max-w-md bg-[#0d0d1a] border border-violet-500/20 rounded-2xl p-6 shadow-2xl my-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {step === 1 ? 'Student Details' : 'Complete Payment'}
                </h2>
                <p className="text-xs text-ink-dim mt-0.5">{course.title}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-ink-dim hover:text-ink hover:bg-violet-500/10 transition-colors"><X className="w-4 h-4"/></button>
            </div>

            {step === 1 && (
              <div className="flex flex-col gap-4">
                <div><label className={lbl}><User className="w-3 h-3 inline mr-1"/>Full Name <span className="text-red-400">*</span></label>
                  <input type="text" value={form.name} onChange={f('name')} placeholder="Your full name" className={inp}/></div>
                <div><label className={lbl}><Mail className="w-3 h-3 inline mr-1"/>Email <span className="text-red-400">*</span></label>
                  <input type="email" value={form.email} onChange={f('email')} placeholder="you@example.com" className={inp}/></div>
                <div><label className={lbl}><Phone className="w-3 h-3 inline mr-1"/>Phone Number <span className="text-red-400">*</span></label>
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
                    <label className={lbl}><Calendar className="w-3 h-3 inline mr-1"/>Select Batch <span className="text-red-400">*</span></label>
                    <div className="flex flex-col gap-2">
                      {course.batches.map((b) => {
                        const full = b.totalSeats > 0 && b.enrolledCount >= b.totalSeats;
                        return (
                          <label key={b._id} className={`flex items-start gap-3 border rounded-xl p-3 transition-all ${full ? 'opacity-40 cursor-not-allowed border-slate-700' : form.batchId === b._id ? 'border-violet-500/60 bg-violet-500/10 cursor-pointer' : 'border-violet-500/20 hover:border-violet-500/40 cursor-pointer'}`}>
                            <input type="radio" name="batch" value={b._id} disabled={full} checked={form.batchId === b._id} onChange={() => !full && setForm(p => ({...p, batchId: b._id}))} className="mt-0.5"/>
                            <div>
                              <p className="text-white text-sm font-medium">{b.name}</p>
                              {b.timing && <p className="text-ink-dim text-xs">{b.timing}{b.days ? ` · ${b.days}` : ''}</p>}
                              {b.startDate && <p className="text-ink-dim text-xs">Starts: {formatStartDate(b.startDate)}</p>}
                              {b.totalSeats > 0 && <p className={`text-xs font-medium ${full ? 'text-red-400' : 'text-emerald-400'}`}>{full ? 'Full' : `${b.totalSeats - b.enrolledCount} seats left`}</p>}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button onClick={proceedFromStep1} className="btn-primary justify-center mt-1">
                  {isOnline && isPaid ? <><IndianRupee className="w-4 h-4"/>Proceed to Payment</> : <><CheckCircle className="w-4 h-4"/>Submit Application</>}
                </button>
              </div>
            )}

            {step === 2 && (
              /* Payment step — online only */
              <div className="flex flex-col gap-5">
                {/* Amount */}
                <div className="flex items-center justify-between bg-violet-500/10 border border-violet-500/20 rounded-xl px-5 py-3">
                  <span className="text-ink-dim text-sm">Amount to Pay</span>
                  <span className="text-2xl font-bold text-white">₹{price.toLocaleString()}</span>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center gap-3">
                  <p className="text-sm text-ink-dim text-center">Scan QR code with any UPI app</p>
                  <div className="bg-white p-3 rounded-2xl">
                    <img src={qrUrl} alt="UPI QR" width={180} height={180} className="rounded-xl"/>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-violet-500/20 rounded-xl px-4 py-2.5 w-full">
                    <Smartphone className="w-4 h-4 text-violet-400 shrink-0"/>
                    <span className="text-white font-mono text-sm flex-1">{UPI_ID}</span>
                    <button onClick={copyUpi} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 shrink-0">
                      <Copy className="w-3 h-3"/>{copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-ink-dim text-center">Or open your UPI app and pay to: <strong className="text-white">{UPI_ID}</strong></p>
                </div>

                {/* Transaction Reference */}
                <div>
                  <label className={lbl}>UPI Transaction ID / UTR Number <span className="text-red-400">*</span></label>
                  <input type="text" value={form.transactionRef} onChange={f('transactionRef')} placeholder="e.g. 123456789012" className={inp}/>
                  <p className="text-xs text-ink-dim mt-1">Enter the 12-digit UTR or Transaction ID from your payment app after paying.</p>
                </div>

                <button onClick={submitEnrollment} disabled={submitting} className="btn-primary justify-center disabled:opacity-50">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin"/>Submitting...</> : <><CheckCircle className="w-4 h-4"/>I've Paid — Submit</>}
                </button>
                <button onClick={() => setStep(1)} className="text-xs text-ink-dim hover:text-ink text-center transition-colors">← Back to details</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const appStatusConfig = {
  pending:   { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Application Pending', icon: Loader2, spin: true },
  approved:  { color: 'text-blue-400',  bg: 'bg-blue-500/10 border-blue-500/20',  label: 'Application Approved', icon: CheckCircle, spin: false },
  confirmed: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', label: 'Enrollment Confirmed', icon: CheckCircle, spin: false },
  rejected:  { color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/20',    label: 'Application Rejected', icon: AlertCircle, spin: false },
};

function EnrolledState({ enrollment, course, slug, copyCode }) {
  const isOnline  = enrollment.enrollmentType === 'online' || enrollment.enrollmentType === 'hybrid';
  const isOffline = enrollment.enrollmentType === 'offline';

  // Offline course — show application status flow (no payment)
  if (isOffline) {
    const cfg = appStatusConfig[enrollment.applicationStatus] || appStatusConfig.pending;
    const Icon = cfg.icon;
    return (
      <div className="flex flex-col gap-4">
        <div className={`flex items-start gap-3 border rounded-xl p-4 ${cfg.bg}`}>
          <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${cfg.color} ${cfg.spin ? 'animate-spin' : ''}`}/>
          <div>
            <p className={`font-semibold ${cfg.color}`}>{cfg.label}</p>
            <p className="text-ink-dim text-sm mt-0.5">
              {enrollment.applicationStatus === 'pending'   && 'Our team will review your application and contact you shortly.'}
              {enrollment.applicationStatus === 'approved'  && 'Your application has been approved. HR/Manager will contact you with batch details.'}
              {enrollment.applicationStatus === 'confirmed' && 'Your enrollment is confirmed. Welcome to the course!'}
              {enrollment.applicationStatus === 'rejected'  && 'Your application was not accepted at this time.'}
            </p>
            {enrollment.statusNote && (
              <p className="text-xs text-ink-dim mt-2 italic">Note: {enrollment.statusNote}</p>
            )}
          </div>
        </div>
        {enrollment.batchName && enrollment.applicationStatus !== 'rejected' && (
          <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4">
            <p className="text-xs text-violet-400 font-semibold uppercase tracking-wide mb-1">Selected Batch</p>
            <p className="text-white font-medium">{enrollment.batchName}</p>
          </div>
        )}
        <p className="text-xs text-ink-dim">
          Applied on: {new Date(enrollment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    );
  }

  if (enrollment.paymentStatus === 'pending') {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-amber-400 font-medium"><Loader2 className="w-5 h-5 animate-spin"/>Payment Under Verification</div>
        <p className="text-ink-dim text-sm">Our team is verifying your payment. Once confirmed, your access code will be activated.</p>
        {enrollment.transactionRef && <p className="text-xs text-ink-dim">Transaction Ref: <span className="text-white font-mono">{enrollment.transactionRef}</span></p>}
      </div>
    );
  }

  if (enrollment.paymentStatus === 'paid' || enrollment.paymentStatus === 'free') {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-green-400 font-medium"><CheckCircle className="w-5 h-5"/>You're enrolled!</div>
        {isOnline && enrollment.accessCode && (
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-5">
            <p className="text-xs text-violet-400 font-semibold uppercase tracking-wide mb-3 flex items-center gap-1"><Key className="w-3.5 h-3.5"/>Your App Access Code</p>
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-bold text-white tracking-widest">{enrollment.accessCode}</span>
              <button onClick={() => copyCode(enrollment.accessCode)} className="p-2 rounded-lg border border-violet-500/30 hover:bg-violet-500/20 transition-colors"><Copy className="w-4 h-4 text-violet-400"/></button>
            </div>
            <p className="text-ink-dim text-xs mt-3">Enter this code in the WorknAi app to access your live course and sessions.</p>
          </div>
        )}
        {enrollment.batchName && (
          <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4">
            <p className="text-xs text-violet-400 font-semibold uppercase tracking-wide mb-1">Your Batch</p>
            <p className="text-white font-medium">{enrollment.batchName}</p>
          </div>
        )}
        {isOnline && <Link to={`/courses/${slug}/content`} className="btn-primary"><PlayCircle className="w-4 h-4"/>Go to Course</Link>}
      </div>
    );
  }
  return null;
}
