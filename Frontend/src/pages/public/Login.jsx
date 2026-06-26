import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      toast.success('Welcome!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <section className="flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-ink-dim hover:text-ink mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Card */}
        <div className="bg-[#0d0d1a]/80 border border-violet-500/20 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-violet-900/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Welcome back</h1>
            <p className="text-ink-dim mt-2 text-sm">Sign in to your WorknAi account</p>
          </div>

          {/* Google OAuth */}
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => toast.error('Google login failed')}
              theme={isDark ? 'filled_black' : 'outline'}
              shape="pill"
              text="signin_with"
              size="large"
            />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-violet-500/10" />
            <span className="text-xs text-ink-dim">or continue with email</span>
            <div className="flex-1 h-px bg-violet-500/10" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dim" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full bg-white/5 border border-violet-500/20 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-ink-dim focus:outline-none focus:border-violet-400/60 focus:bg-white/8 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dim" />
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-white/5 border border-violet-500/20 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-ink-dim focus:outline-none focus:border-violet-400/60 focus:bg-white/8 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-dim hover:text-ink transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-ink-dim hover:text-violet-400 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary justify-center mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-ink-dim mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
