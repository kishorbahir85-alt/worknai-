import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase, Building2, User, Mail, Phone, FileText,
  Send, Loader2, CheckCircle, Upload, Lock, KeyRound, ArrowRight,
} from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const inp = 'w-full bg-white/5 border border-violet-500/20 rounded-xl py-3 px-4 text-sm text-white placeholder-ink-dim focus:outline-none focus:border-violet-400/60 transition-all';
const selInp = 'w-full bg-[#0d0d1a] border border-violet-500/20 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-violet-400/60 transition-all cursor-pointer';
const lbl = 'block text-xs font-medium text-ink-dim mb-1.5';

const emptyJob = { applicantName: '', applicantEmail: '', phone: '', position: '', experience: '', coverLetter: '' };
const emptyBiz = { companyName: '', contactName: '', email: '', phone: '', businessType: '', message: '' };

export default function JoinUs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('job');

  /* ── Job form state ── */
  const [jobForm, setJobForm] = useState(emptyJob);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobLoading, setJobLoading] = useState(false);
  const [jobDone, setJobDone] = useState(false);

  /* ── Business form state ── */
  const [bizForm, setBizForm] = useState(emptyBiz);
  const [bizLoading, setBizLoading] = useState(false);
  const [bizDone, setBizDone] = useState(false);

  /* OTP state */
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const fJob = (k) => (e) => setJobForm((p) => ({ ...p, [k]: e.target.value }));
  const fBiz = (k) => (e) => {
    setBizForm((p) => ({ ...p, [k]: e.target.value }));
    if (k === 'email') { setOtpSent(false); setOtpVerified(false); setOtpValue(''); }
  };

  /* ── Send OTP ── */
  const sendOtp = async () => {
    if (!bizForm.email || !/\S+@\S+\.\S+/.test(bizForm.email)) return toast.error('Please enter a valid email first');
    setOtpLoading(true);
    try {
      await api.post('/otp/send', { email: bizForm.email });
      setOtpSent(true);
      toast.success(`OTP sent to ${bizForm.email}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  /* ── Verify OTP ── */
  const verifyOtp = async () => {
    if (!otpValue || otpValue.length < 4) return toast.error('Enter the OTP sent to your email');
    setVerifyLoading(true);
    try {
      await api.post('/otp/verify', { email: bizForm.email, otp: otpValue });
      setOtpVerified(true);
      toast.success('Email verified successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setVerifyLoading(false);
    }
  };

  /* ── Submit Job Inquiry (login required) ── */
  const submitJob = async () => {
    if (!user) return toast.error('Please login to submit a job inquiry');
    if (!jobForm.applicantName || !jobForm.applicantEmail || !jobForm.position || !jobForm.experience)
      return toast.error('Name, email, position and experience are required');
    if (!resumeFile) return toast.error('Please upload your resume');
    setJobLoading(true);
    try {
      const fd = new FormData();
      fd.append('applicantName', jobForm.applicantName);
      fd.append('applicantEmail', jobForm.applicantEmail);
      fd.append('phone', jobForm.phone);
      fd.append('currentRole', jobForm.position);
      fd.append('experience', jobForm.experience);
      fd.append('coverLetter', jobForm.coverLetter);
      fd.append('source', 'join-us');
      fd.append('resume', resumeFile);
      await api.post('/applications', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setJobDone(true);
      toast.success('Job inquiry submitted! HR team will contact you.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setJobLoading(false);
    }
  };

  /* ── Submit Business Inquiry (OTP required) ── */
  const submitBiz = async () => {
    if (!otpVerified) return toast.error('Please verify your email with OTP first');
    if (!bizForm.companyName || !bizForm.contactName || !bizForm.email || !bizForm.businessType || !bizForm.message)
      return toast.error('All fields except phone are required');
    setBizLoading(true);
    try {
      await api.post('/inquiries', {
        name: bizForm.contactName,
        company: bizForm.companyName,
        email: bizForm.email,
        phone: bizForm.phone,
        type: bizForm.businessType,
        message: bizForm.message,
        source: 'join-us',
      });
      setBizDone(true);
      toast.success('Business inquiry submitted! Our team will reach out soon.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setBizLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Connect With Us</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">Join WorknAi</h1>
        <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-violet-300 rounded-full mx-auto mb-5" />
        <p className="text-ink-dim text-base leading-relaxed max-w-xl mx-auto">
          Whether you're looking for a career opportunity or want to partner with us — we'd love to hear from you.
        </p>
      </div>

      {/* Tab toggle */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex gap-2 p-1.5 bg-white/5 border border-violet-500/15 rounded-2xl">
          <button
            onClick={() => setTab('job')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              tab === 'job' ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40' : 'text-ink-dim hover:text-ink'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Job Inquiry
          </button>
          <button
            onClick={() => setTab('business')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              tab === 'business' ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40' : 'text-ink-dim hover:text-ink'
            }`}
          >
            <Building2 className="w-4 h-4" /> Business Inquiry
          </button>
        </div>
      </div>

      {/* ═══════════ JOB FORM ═══════════ */}
      {tab === 'job' && (
        <div className="max-w-3xl mx-auto glass rounded-2xl p-8">

          {/* Not logged in — block the form */}
          {!user ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-violet-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Login Required</h2>
              <p className="text-ink-dim mb-6 max-w-sm mx-auto">
                You need to be logged in to submit a job inquiry. Your application will be tracked in your dashboard.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/login" state={{ from: { pathname: '/join-us' } }} className="btn-primary">
                  Login <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/register" className="btn-ghost">Create Account</Link>
              </div>
            </div>
          ) : jobDone ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Inquiry Submitted!</h2>
              <p className="text-ink-dim mb-6">Our HR team will review your profile and reach out soon. You can track the status in your dashboard.</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/user/dashboard" className="btn-primary">View Dashboard <ArrowRight className="w-4 h-4" /></Link>
                <button onClick={() => { setJobDone(false); setJobForm(emptyJob); setResumeFile(null); }} className="btn-ghost">
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-violet-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Job / Career Inquiry</h2>
                  <p className="text-xs text-ink-dim">Goes directly to our HR team · Visible in your dashboard</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}><User className="w-3 h-3 inline mr-1" />Full Name <span className="text-red-400">*</span></label>
                  <input type="text" value={jobForm.applicantName} onChange={fJob('applicantName')} placeholder="Your full name" className={inp} />
                </div>
                <div>
                  <label className={lbl}><Mail className="w-3 h-3 inline mr-1" />Email <span className="text-red-400">*</span></label>
                  <input type="email" value={jobForm.applicantEmail} onChange={fJob('applicantEmail')} placeholder="your@email.com" className={inp} />
                </div>
                <div>
                  <label className={lbl}><Phone className="w-3 h-3 inline mr-1" />Phone</label>
                  <input type="tel" value={jobForm.phone} onChange={fJob('phone')} placeholder="+91 99999 99999" className={inp} />
                </div>
                <div>
                  <label className={lbl}><Briefcase className="w-3 h-3 inline mr-1" />Position / Role <span className="text-red-400">*</span></label>
                  <input type="text" value={jobForm.position} onChange={fJob('position')} placeholder="e.g. React Developer" className={inp} />
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl}>Experience <span className="text-red-400">*</span></label>
                  <select value={jobForm.experience} onChange={fJob('experience')} className={selInp}>
                    <option value="" className="bg-[#0d0d1a] text-slate-400">-- Select experience --</option>
                    {['Fresher (0 years)', 'Less than 1 year', '1 year', '2 years', '3 years', '4 years', '5 years', '6-8 years', '9-10 years', '10+ years'].map(v => (
                      <option key={v} value={v} className="bg-[#0d0d1a]">{v}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl}><FileText className="w-3 h-3 inline mr-1" />Cover Letter / Message</label>
                  <textarea value={jobForm.coverLetter} onChange={fJob('coverLetter')} rows={4} placeholder="Tell us about yourself and why you want to join WorknAi..." className={inp + ' resize-none'} />
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl}><Upload className="w-3 h-3 inline mr-1" />Resume <span className="text-red-400">*</span> <span className="text-ink-faint ml-1">(PDF / DOC / DOCX, max 5MB)</span></label>
                  <input
                    type="file" accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0] || null)}
                    className="w-full bg-white/5 border border-violet-500/20 rounded-xl py-3 px-4 text-sm text-ink-dim file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-violet-600/30 file:text-violet-300 file:text-xs file:font-medium cursor-pointer hover:border-violet-400/40 transition-all"
                  />
                  {resumeFile && <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1"><CheckCircle className="w-3 h-3" />{resumeFile.name}</p>}
                </div>
              </div>

              <button onClick={submitJob} disabled={jobLoading} className="btn-primary w-full justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
                {jobLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Submit Job Inquiry</>}
              </button>
            </>
          )}
        </div>
      )}

      {/* ═══════════ BUSINESS FORM ═══════════ */}
      {tab === 'business' && (
        <div className="max-w-3xl mx-auto glass rounded-2xl p-8">
          {bizDone ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Inquiry Submitted!</h2>
              <p className="text-ink-dim mb-6">Our business team will review your inquiry and get back to you shortly.</p>
              <button onClick={() => { setBizDone(false); setBizForm(emptyBiz); setOtpSent(false); setOtpVerified(false); setOtpValue(''); }} className="btn-ghost">
                Submit Another
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-violet-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Business / Partnership Inquiry</h2>
                  <p className="text-xs text-ink-dim">Email verification required · Goes to our Manager</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}><Building2 className="w-3 h-3 inline mr-1" />Company Name <span className="text-red-400">*</span></label>
                  <input type="text" value={bizForm.companyName} onChange={fBiz('companyName')} placeholder="Your company name" className={inp} />
                </div>
                <div>
                  <label className={lbl}><User className="w-3 h-3 inline mr-1" />Contact Person <span className="text-red-400">*</span></label>
                  <input type="text" value={bizForm.contactName} onChange={fBiz('contactName')} placeholder="Your full name" className={inp} />
                </div>

                {/* Email + OTP */}
                <div className="sm:col-span-2">
                  <label className={lbl}><Mail className="w-3 h-3 inline mr-1" />Email <span className="text-red-400">*</span></label>
                  <div className="flex gap-2">
                    <input
                      type="email" value={bizForm.email} onChange={fBiz('email')}
                      placeholder="business@company.com"
                      disabled={otpVerified}
                      className={inp + (otpVerified ? ' opacity-60 cursor-not-allowed' : '')}
                    />
                    {!otpVerified && (
                      <button
                        onClick={sendOtp} disabled={otpLoading || !bizForm.email}
                        className="shrink-0 px-4 py-2.5 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium hover:bg-violet-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : otpSent ? 'Resend OTP' : 'Send OTP'}
                      </button>
                    )}
                    {otpVerified && (
                      <span className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* OTP Input */}
                {otpSent && !otpVerified && (
                  <div className="sm:col-span-2">
                    <label className={lbl}><KeyRound className="w-3 h-3 inline mr-1" />Enter OTP <span className="text-red-400">*</span> <span className="text-ink-faint ml-1">sent to {bizForm.email}</span></label>
                    <div className="flex gap-2">
                      <input
                        type="text" value={otpValue} onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        className={inp + ' tracking-[0.5em] font-mono text-center text-lg'}
                      />
                      <button
                        onClick={verifyOtp} disabled={verifyLoading || otpValue.length < 4}
                        className="shrink-0 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {verifyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className={lbl}><Phone className="w-3 h-3 inline mr-1" />Phone</label>
                  <input type="tel" value={bizForm.phone} onChange={fBiz('phone')} placeholder="+91 99999 99999" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Inquiry Type <span className="text-red-400">*</span></label>
                  <select value={bizForm.businessType} onChange={fBiz('businessType')} className={selInp}>
                    <option value="" className="bg-[#0d0d1a] text-slate-400">-- Select type --</option>
                    {['Business Partnership', 'Become a Client', 'Investment Opportunity', 'Reseller / Affiliate', 'Other'].map(v => (
                      <option key={v} value={v} className="bg-[#0d0d1a]">{v}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl}><FileText className="w-3 h-3 inline mr-1" />Message / Proposal <span className="text-red-400">*</span></label>
                  <textarea value={bizForm.message} onChange={fBiz('message')} rows={5} placeholder="Describe your business proposal, requirements, or how you'd like to collaborate..." className={inp + ' resize-none'} />
                </div>
              </div>

              {/* Submit — only enabled after OTP verified */}
              <div className="mt-6">
                {!otpVerified && (
                  <p className="text-xs text-amber-400 flex items-center gap-1.5 mb-3">
                    <KeyRound className="w-3.5 h-3.5" /> Please verify your email with OTP before submitting.
                  </p>
                )}
                <button
                  onClick={submitBiz} disabled={bizLoading || !otpVerified}
                  className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {bizLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Submit Business Inquiry</>}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
