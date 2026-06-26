import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import api from '../../utils/api';

const inp = 'w-full bg-white/5 border border-violet-500/20 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-ink-dim focus:outline-none focus:border-violet-400/60 transition-all';
const lbl = 'block text-xs font-medium text-ink-dim mb-1.5 uppercase tracking-wider';

const roleLoginLinks = {
  hr:      { label: 'HR Login',      href: '/hr/login',    color: 'text-sky-400' },
  manager: { label: 'Manager Login', href: null,            color: 'text-emerald-400' },
  admin:   { label: 'Admin Login',   href: null,            color: 'text-violet-400' },
  user:    { label: 'User Login',    href: '/login',        color: 'text-violet-400' },
};

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token    = params.get('token') || '';

  const [form, setForm]         = useState({ newEmail: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(null); // { role }

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) { setError('Invalid reset link. Please request a new one.'); return; }
    if (!form.newEmail && !form.newPassword) { setError('Please provide a new email or new password.'); return; }
    if (form.newPassword && form.newPassword !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.newPassword && form.newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        token,
        newEmail:    form.newEmail.trim() || undefined,
        newPassword: form.newPassword     || undefined,
      });
      setSuccess({ role: res.data.role });
    } catch (err) {
      setError(err?.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-ink mb-2">Invalid Link</h1>
          <p className="text-ink-dim text-sm mb-6">This reset link is missing a token. Please request a new one.</p>
          <Link to="/forgot-password" className="btn-primary">Request New Link</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#0d0d1a]/80 border border-violet-500/20 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-violet-900/20">

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-3">Credentials Updated!</h1>
              <p className="text-ink-dim text-sm leading-relaxed mb-8">
                Your account credentials have been updated successfully. Please login with your new details.
              </p>
              <div className="flex flex-col gap-3">
                {/* Show appropriate login link based on role */}
                {success.role === 'user' && (
                  <Link to="/login" className="btn-primary justify-center">Go to Login</Link>
                )}
                {success.role === 'hr' && (
                  <Link to="/hr/login" className="btn-primary justify-center">Go to HR Login</Link>
                )}
                {(success.role === 'manager' || success.role === 'admin') && (
                  <div className="text-sm text-ink-dim bg-white/5 border border-violet-500/10 rounded-xl p-4">
                    Please open your <span className="text-ink font-medium capitalize">{success.role}</span> panel and login with your new credentials.
                  </div>
                )}
                <Link to="/" className="text-sm text-ink-dim hover:text-ink transition-colors">
                  Go to Homepage
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white">Reset Credentials</h1>
                <p className="text-ink-dim mt-2 text-sm">
                  Update your email and/or password. Leave a field blank to keep it unchanged.
                </p>
              </div>

              {error && (
                <div className="mb-5 flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* New Email */}
                <div>
                  <label className={lbl}>New Email (optional)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dim" />
                    <input
                      type="email"
                      value={form.newEmail}
                      onChange={f('newEmail')}
                      placeholder="Leave blank to keep current email"
                      className={inp}
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className={lbl}>New Password (optional)</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dim" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form.newPassword}
                      onChange={f('newPassword')}
                      placeholder="Leave blank to keep current password"
                      className={`${inp} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-dim hover:text-ink transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                {form.newPassword && (
                  <div>
                    <label className={lbl}>Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dim" />
                      <input
                        type={showConf ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={f('confirmPassword')}
                        placeholder="Re-enter new password"
                        className={`${inp} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConf(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-dim hover:text-ink transition-colors"
                      >
                        {showConf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary justify-center mt-1 disabled:opacity-50"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
                    : <><CheckCircle className="w-4 h-4" /> Update Credentials</>
                  }
                </button>
              </form>

              <Link
                to="/forgot-password"
                className="flex items-center justify-center gap-1.5 text-sm text-ink-dim hover:text-ink transition-colors mt-6"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Request a new link
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}
