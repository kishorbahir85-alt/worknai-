import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Briefcase, IndianRupee, Clock, ArrowLeft,
  CheckCircle, AlertCircle, Loader2, X, Send,
  User, Mail, Phone, Star, KeyRound,
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const typeColor = {
  'full-time': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'part-time': 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  internship: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  freelance: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
};

const inp = 'w-full bg-white/5 border border-violet-500/20 rounded-xl py-2.5 px-4 text-sm text-white placeholder-ink-dim focus:outline-none focus:border-violet-400/60 transition-all';
const selInp = 'w-full bg-[#0d0d1a] border border-violet-500/20 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-violet-400/60 transition-all cursor-pointer';

const emptyForm = {
  applicantName: '',
  applicantEmail: '',
  phone: '',
  experience: '',
  currentRole: '',
  coverLetter: '',
};

export default function JobDetail() {
  const { slug } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${slug}`)
      .then((res) => setJob(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const f = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (k === 'applicantEmail') { setOtpSent(false); setOtpVerified(false); setOtpValue(''); }
  };

  const handleApplyClick = () => setShowModal(true);

  const sendOtp = async () => {
    if (!form.applicantEmail || !/\S+@\S+\.\S+/.test(form.applicantEmail)) return toast.error('Please enter a valid email first');
    setOtpLoading(true);
    try {
      await api.post('/otp/send', { email: form.applicantEmail });
      setOtpSent(true);
      toast.success(`OTP sent to ${form.applicantEmail}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otpValue || otpValue.length < 4) return toast.error('Enter the OTP sent to your email');
    setVerifyLoading(true);
    try {
      await api.post('/otp/verify', { email: form.applicantEmail, otp: otpValue });
      setOtpVerified(true);
      toast.success('Email verified successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!otpVerified) return toast.error('Please verify your email with OTP first');
    if (!form.applicantName || !form.applicantEmail || !form.experience) {
      return toast.error('Name, email and experience are required');
    }
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('jobId', job._id);
      formData.append('applicantName', form.applicantName);
      formData.append('applicantEmail', form.applicantEmail);
      formData.append('phone', form.phone);
      formData.append('experience', form.experience);
      formData.append('currentRole', form.currentRole);
      formData.append('coverLetter', form.coverLetter);
      if (resumeFile) formData.append('resume', resumeFile);
      if (coverLetterFile) formData.append('coverLetterFile', coverLetterFile);
      await api.post('/applications', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setApplied(true);
      setShowModal(false);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
    </div>
  );

  if (notFound || !job) return (
    <section className="py-20 text-center px-4">
      <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-ink mb-2">Job not found</h1>
      <p className="text-ink-dim mb-6">This job may have been closed or doesn't exist.</p>
      <Link to="/career" className="btn-primary"><ArrowLeft className="w-4 h-4" /> Back to Jobs</Link>
    </section>
  );

  return (
    <>
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <Link to="/career" className="inline-flex items-center gap-2 text-sm text-ink-dim hover:text-ink transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#0d0d1a]/80 border border-violet-500/20 rounded-2xl p-8 backdrop-blur-xl"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-ink-dim">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                {job.experience && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.experience}</span>}
                {job.salary && <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />{job.salary}</span>}
              </div>
            </div>
            <span className={`text-sm px-3 py-1.5 rounded-full font-medium capitalize border ${typeColor[job.type] || typeColor['full-time']}`}>
              {job.type}
            </span>
          </div>

          {job.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {job.skills.map((s) => (
                <span key={s} className="text-xs px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300">{s}</span>
              ))}
            </div>
          )}

          <div className="border-t border-violet-500/10 mb-6" />

          {job.description ? (
            <div className="text-ink-dim text-sm leading-relaxed whitespace-pre-line mb-8">{job.description}</div>
          ) : (
            <p className="text-ink-dim text-sm mb-8">No detailed description available. Apply to learn more.</p>
          )}

          <div className="flex items-center gap-4">
            {applied ? (
              <div className="flex items-center gap-2 text-green-400 font-medium">
                <CheckCircle className="w-5 h-5" /> Application submitted
              </div>
            ) : (
              <button onClick={handleApplyClick} className="btn-primary">
                <Briefcase className="w-4 h-4" /> Apply Now
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Apply Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-[#0d0d1a] border border-violet-500/20 rounded-2xl p-6 shadow-2xl shadow-violet-900/30 my-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Apply for {job.title}</h2>
                  <p className="text-sm text-ink-dim mt-0.5">{job.location} · <span className="capitalize">{job.type}</span></p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-ink-dim hover:text-ink hover:bg-violet-500/10 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {/* Name */}
                <div>
                  <label className="block text-xs text-ink-dim mb-1.5 flex items-center gap-1">
                    <User className="w-3 h-3" /> Full Name <span className="text-violet-400">*</span>
                  </label>
                  <input type="text" value={form.applicantName} onChange={f('applicantName')} placeholder="Your full name" className={inp} />
                </div>

                {/* Email + OTP */}
                <div>
                  <label className="block text-xs text-ink-dim mb-1.5 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email <span className="text-violet-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email" value={form.applicantEmail} onChange={f('applicantEmail')}
                      placeholder="your@email.com"
                      disabled={otpVerified}
                      className={inp + (otpVerified ? ' opacity-60 cursor-not-allowed' : '')}
                    />
                    {!otpVerified && (
                      <button
                        type="button"
                        onClick={sendOtp} disabled={otpLoading || !form.applicantEmail}
                        className="shrink-0 px-4 py-2.5 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium hover:bg-violet-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : otpSent ? 'Resend' : 'Send OTP'}
                      </button>
                    )}
                    {otpVerified && (
                      <span className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> Verified
                      </span>
                    )}
                  </div>
                </div>

                {otpSent && !otpVerified && (
                  <div>
                    <label className="block text-xs text-ink-dim mb-1.5 flex items-center gap-1">
                      <KeyRound className="w-3 h-3" /> Enter OTP <span className="text-violet-400">*</span> <span className="text-ink-faint ml-1">sent to {form.applicantEmail}</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text" value={otpValue} onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        className={inp + ' tracking-[0.5em] font-mono text-center text-lg'}
                      />
                      <button
                        type="button"
                        onClick={verifyOtp} disabled={verifyLoading || otpValue.length < 4}
                        className="shrink-0 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {verifyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Phone */}
                <div>
                  <label className="block text-xs text-ink-dim mb-1.5 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Phone Number <span className="text-ink-dim text-xs">(optional)</span>
                  </label>
                  <input type="tel" value={form.phone} onChange={f('phone')} placeholder="+91 99999 99999" className={inp} />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs text-ink-dim mb-1.5 flex items-center gap-1">
                    <Star className="w-3 h-3" /> Experience <span className="text-violet-400">*</span>
                  </label>
                  <select value={form.experience} onChange={f('experience')} className={selInp}>
                    <option value="" className="bg-[#0d0d1a] text-slate-400">-- Select experience --</option>
                    <option value="Fresher (0 years)" className="bg-[#0d0d1a] text-white">Fresher (0 years)</option>
                    <option value="Less than 1 year" className="bg-[#0d0d1a] text-white">Less than 1 year</option>
                    <option value="1 year" className="bg-[#0d0d1a] text-white">1 year</option>
                    <option value="2 years" className="bg-[#0d0d1a] text-white">2 years</option>
                    <option value="3 years" className="bg-[#0d0d1a] text-white">3 years</option>
                    <option value="4 years" className="bg-[#0d0d1a] text-white">4 years</option>
                    <option value="5 years" className="bg-[#0d0d1a] text-white">5 years</option>
                    <option value="6-8 years" className="bg-[#0d0d1a] text-white">6–8 years</option>
                    <option value="9-10 years" className="bg-[#0d0d1a] text-white">9–10 years</option>
                    <option value="10+ years" className="bg-[#0d0d1a] text-white">10+ years</option>
                  </select>
                </div>

                {/* Current Role */}
                <div>
                  <label className="block text-xs text-ink-dim mb-1.5 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> Current Role / Job Title <span className="text-ink-dim text-xs">(optional)</span>
                  </label>
                  <input type="text" value={form.currentRole} onChange={f('currentRole')} placeholder="e.g. Frontend Developer at XYZ" className={inp} />
                </div>

                {/* Resume */}
                <div>
                  <label className="block text-xs text-ink-dim mb-1.5">
                    Resume <span className="text-ink-dim text-xs">(PDF/DOC/DOCX, max 5MB — optional)</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0] || null)}
                    className="w-full bg-white/5 border border-violet-500/20 rounded-xl py-2.5 px-4 text-sm text-ink-dim file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-violet-600/30 file:text-violet-300 file:text-xs cursor-pointer hover:border-violet-400/40 transition-all"
                  />
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-xs text-ink-dim mb-1.5">
                    Cover Letter <span className="text-ink-dim text-xs">(optional)</span>
                  </label>
                  <textarea
                    value={form.coverLetter}
                    onChange={f('coverLetter')}
                    rows={3}
                    placeholder="Tell us why you're a great fit for this role..."
                    className={inp + ' resize-none'}
                  />
                </div>

                {/* Cover Letter PDF */}
                <div>
                  <label className="block text-xs text-ink-dim mb-1.5">
                    Or upload Cover Letter as PDF <span className="text-ink-dim text-xs">(PDF/DOC/DOCX, max 5MB — optional)</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setCoverLetterFile(e.target.files[0] || null)}
                    className="w-full bg-white/5 border border-violet-500/20 rounded-xl py-2.5 px-4 text-sm text-ink-dim file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-violet-600/30 file:text-violet-300 file:text-xs cursor-pointer hover:border-violet-400/40 transition-all"
                  />
                </div>
              </div>

              {!otpVerified && (
                <p className="text-xs text-amber-400 flex items-center gap-1.5 mt-4">
                  <KeyRound className="w-3.5 h-3.5" /> Please verify your email with OTP before submitting.
                </p>
              )}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleSubmit}
                  disabled={applying || !otpVerified}
                  className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {applying ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Submit Application</span>
                  )}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-sm text-ink-dim border border-violet-500/20 rounded-xl hover:bg-violet-500/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
