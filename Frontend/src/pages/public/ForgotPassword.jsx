import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import api from '../../utils/api';

export default function ForgotPassword() {
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#0d0d1a]/80 border border-violet-500/20 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-violet-900/20">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-3">Check Your Email</h1>
              <p className="text-ink-dim text-sm leading-relaxed mb-6">
                If <span className="text-white font-medium">{email}</span> is registered with WorknAi,
                you'll receive a password reset link shortly.
              </p>
              <p className="text-xs text-ink-dim mb-6">
                Didn't receive it? Check your spam folder or try again.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Try a different email
                </button>
                <Link to="/login" className="text-sm text-ink-dim hover:text-ink transition-colors flex items-center justify-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white">Forgot Password?</h1>
                <p className="text-ink-dim mt-2 text-sm">
                  Enter your registered email and we'll send you a reset link.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dim" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your registered email"
                    className="w-full bg-white/5 border border-violet-500/20 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-ink-dim focus:outline-none focus:border-violet-400/60 transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary justify-center mt-1 disabled:opacity-50"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    : <><Mail className="w-4 h-4" /> Send Reset Link</>
                  }
                </button>
              </form>

              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 text-sm text-ink-dim hover:text-ink transition-colors mt-6"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}
