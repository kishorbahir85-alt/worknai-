import { useState } from 'react';
import {
  Briefcase, Building2, User, Mail, Phone, FileText,
  Send, Loader2, CheckCircle, Upload, KeyRound,
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const inp = 'w-full bg-white/5 border border-violet-500/20 rounded-xl py-3 px-4 text-sm text-white placeholder-ink-dim focus:outline-none focus:border-violet-400/60 transition-all';
const selInp = 'w-full bg-[#0d0d1a] border border-violet-500/20 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-violet-400/60 transition-all cursor-pointer';
const lbl = 'block text-xs font-medium text-ink-dim mb-1.5';

const emptyJob = { applicantName: '', applicantEmail: '', phone: '', position: '', experience: '', coverLetter: '' };
const emptyBiz = { companyName: '', contactName: '', email: '', phone: '', businessType: '', message: '' };

function OtpGate({ email, onChangeEmail, otpSent, otpValue, setOtpValue, otpVerified, otpLoading, verifyLoading, sendOtp, verifyOtp }) {
  return (
    <>
      <div className="sm:col-span-2">
        <label className={lbl}><Mail className="w-3 h-3 inline mr-1" />Email <span className="text-red-400">*</span></label>
        <div className="flex gap-2">
          <input
            type="email" value={email} onChange={onChangeEmail}
            placeholder="you@email.com"
            disabled={otpVerified}
            className={inp + (otpVerified ? ' opacity-60 cursor-not-allowed' : '')}
          />
          {!otpVerified && (
            <button
              type="button"
              onClick={sendOtp} disabled={otpLoading || !email}
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

      {otpSent && !otpVerified && (
        <div className="sm:col-span-2">
          <label className={lbl}><KeyRound className="w-3 h-3 inline mr-1" />Enter OTP <span className="text-red-400">*</span> <span className="text-ink-faint ml-1">sent to {email}</span></label>
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
    </>
  );
}

export default function JoinUs() {
  const [tab, setTab] = useState('job');

  /* ── Job form state ── */
  const [jobForm, setJobForm] = useState(emptyJob);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobLoading, setJobLoading] = useState(false);
  const [jobDone, setJobDone] = useState(false);
  const [jobOtpSent, setJobOtpSent] = useState(false);
  const [jobOtpValue, setJobOtpValue] = useState('');
  const [jobOtpVerified, setJobOtpVerified] = useState(false);
  const [jobOtpLoading, setJobOtpLoading] = useState(false);
  const [jobVerifyLoading, setJobVerifyLoading] = useState(false);

  /* ── Business form state ── */
  const [bizForm, setBizForm] = useState(emptyBiz);
  const [bizLoading, setBizLoading] = useState(false);
  const [bizDone, setBizDone] = useState(false);
  const [bizOtpSent, setBizOtpSent] = useState(false);
  const [bizOtpValue, setBizOtpValue] = useState('');
  const [bizOtpVerified, setBizOtpVerified] = useState(false);
  const [bizOtpLoading, setBizOtpLoading] = useState(false);
  const [bizVerifyLoading, setBizVerifyLoading] = useState(false);

  const fJob = (k) => (e) => {
    setJobForm((p) => ({ ...p, [k]: e.target.value }));
    if (k === 'applicantEmail') { setJobOtpSent(false); setJobOtpVerified(false); setJobOtpValue(''); }
  };
  const fBiz = (k) => (e) => {
    setBizForm((p) => ({ ...p, [k]: e.target.value }));
    if (k === 'email') { setBizOtpSent(false); setBizOtpVerified(false); setBizOtpValue(''); }
  };

  const sendOtpFor = async (email, setSent, setLoading) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) return toast.error('Please enter a valid email first');
    setLoading(true);
    try {
      await api.post('/otp/send', { email });
      setSent(true);
      toast.success(`OTP sent to ${email}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpFor = async (email, otpValue, setVerified, setLoading) => {
    if (!otpValue || otpValue.length < 4) return toast.error('Enter the OTP sent to your email');
    setLoading(true);
    try {
      await api.post('/otp/verify', { email, otp: otpValue });
      setVerified(true);
      toast.success('Email verified successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  /* ── Submit Job Inquiry (email-OTP verified) ── */
  const submitJob = async () => {
    if (!jobOtpVerified) return toast.error('Please verify your email with OTP first');
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
    if (!bizOtpVerified) return toast.error('Please verify your email with OTP first');
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
          {jobDone ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Inquiry Submitted!</h2>
              <p className="text-ink-dim mb-6">Our HR team will review your profile and reach out soon.</p>
              <button onClick={() => { setJobDone(false); setJobForm(emptyJob); setResumeFile(null); setJobOtpSent(false); setJobOtpVerified(false); setJobOtpValue(''); }} className="btn-ghost">
                Submit Another
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-violet-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Job / Career Inquiry</h2>
                  <p className="text-xs text-ink-dim">Email verification required · Goes directly to our HR team</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}><User className="w-3 h-3 inline mr-1" />Full Name <span className="text-red-400">*</span></label>
                  <input type="text" value={jobForm.applicantName} onChange={fJob('applicantName')} placeholder="Your full name" className={inp} />
                </div>
                <div>
                  <label className={lbl}><Phone className="w-3 h-3 inline mr-1" />Phone</label>
                  <input type="tel" value={jobForm.phone} onChange={fJob('phone')} placeholder="+91 99999 99999" className={inp} />
                </div>

                <OtpGate
                  email={jobForm.applicantEmail}
                  onChangeEmail={fJob('applicantEmail')}
                  otpSent={jobOtpSent}
                  otpValue={jobOtpValue}
                  setOtpValue={setJobOtpValue}
                  otpVerified={jobOtpVerified}
                  otpLoading={jobOtpLoading}
                  verifyLoading={jobVerifyLoading}
                  sendOtp={() => sendOtpFor(jobForm.applicantEmail, setJobOtpSent, setJobOtpLoading)}
                  verifyOtp={() => verifyOtpFor(jobForm.applicantEmail, jobOtpValue, setJobOtpVerified, setJobVerifyLoading)}
                />

                <div>
                  <label className={lbl}><Briefcase className="w-3 h-3 inline mr-1" />Position / Role <span className="text-red-400">*</span></label>
                  <input type="text" value={jobForm.position} onChange={fJob('position')} placeholder="e.g. React Developer" className={inp} />
                </div>
                <div>
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

              {!jobOtpVerified && (
                <p className="text-xs text-amber-400 flex items-center gap-1.5 mt-4">
                  <KeyRound className="w-3.5 h-3.5" /> Please verify your email with OTP before submitting.
                </p>
              )}
              <button onClick={submitJob} disabled={jobLoading || !jobOtpVerified} className="btn-primary w-full justify-center mt-4 disabled:opacity-40 disabled:cursor-not-allowed">
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
              <button onClick={() => { setBizDone(false); setBizForm(emptyBiz); setBizOtpSent(false); setBizOtpVerified(false); setBizOtpValue(''); }} className="btn-ghost">
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

                <OtpGate
                  email={bizForm.email}
                  onChangeEmail={fBiz('email')}
                  otpSent={bizOtpSent}
                  otpValue={bizOtpValue}
                  setOtpValue={setBizOtpValue}
                  otpVerified={bizOtpVerified}
                  otpLoading={bizOtpLoading}
                  verifyLoading={bizVerifyLoading}
                  sendOtp={() => sendOtpFor(bizForm.email, setBizOtpSent, setBizOtpLoading)}
                  verifyOtp={() => verifyOtpFor(bizForm.email, bizOtpValue, setBizOtpVerified, setBizVerifyLoading)}
                />

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

              <div className="mt-6">
                {!bizOtpVerified && (
                  <p className="text-xs text-amber-400 flex items-center gap-1.5 mb-3">
                    <KeyRound className="w-3.5 h-3.5" /> Please verify your email with OTP before submitting.
                  </p>
                )}
                <button
                  onClick={submitBiz} disabled={bizLoading || !bizOtpVerified}
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
