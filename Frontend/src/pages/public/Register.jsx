import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill in all fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to WorknAi');
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      toast.success('Welcome to WorknAi!');
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Google sign-up failed');
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

        <div className="bg-[#0d0d1a]/80 border border-violet-500/20 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-violet-900/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Create account</h1>
            <p className="text-ink-dim mt-2 text-sm">Join WorknAi and explore opportunities</p>
          </div>

          {/* Google OAuth */}
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => toast.error('Google sign-up failed')}
              theme={isDark ? 'filled_black' : 'outline'}
              shape="pill"
              text="signup_with"
              size="large"
            />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-violet-500/10" />
            <span className="text-xs text-ink-dim">or register with email</span>
            <div className="flex-1 h-px bg-violet-500/10" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dim" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full bg-white/5 border border-violet-500/20 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-ink-dim focus:outline-none focus:border-violet-400/60 transition-all"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dim" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full bg-white/5 border border-violet-500/20 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-ink-dim focus:outline-none focus:border-violet-400/60 transition-all"
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
                placeholder="Password (min 6 chars)"
                className="w-full bg-white/5 border border-violet-500/20 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-ink-dim focus:outline-none focus:border-violet-400/60 transition-all"
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

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dim" />
              <input
                type={showPass ? 'text' : 'password'}
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full bg-white/5 border border-violet-500/20 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-ink-dim focus:outline-none focus:border-violet-400/60 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary justify-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create account <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-ink-dim mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
