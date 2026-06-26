import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Loader2, AlertCircle, PlayCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function getEmbedUrl(url) {
  if (!url) return '';
  // Convert YouTube watch URLs to embed
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return url;
}

export default function CourseContent() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/courses/${slug}/content` } } });
      return;
    }
    api.get(`/courses/${slug}/content`)
      .then((res) => setCourse(res.data.data))
      .catch((err) => setError(err?.response?.data?.message || 'Access denied'))
      .finally(() => setLoading(false));
  }, [slug, user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
    </div>
  );

  if (error) return (
    <section className="py-20 text-center px-4 max-w-lg mx-auto">
      <div className="bg-[#0d0d1a]/80 border border-red-500/20 rounded-2xl p-8">
        <Lock className="w-14 h-14 text-red-400 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-ink-dim text-sm mb-6">{error}</p>
        <Link to="/courses" className="btn-primary">
          <ArrowLeft className="w-4 h-4" /> Browse Courses
        </Link>
      </div>
    </section>
  );

  const embedUrl = getEmbedUrl(course?.videoUrl);

  return (
    <section className="py-10 px-4 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Link to={`/courses/${slug}`} className="inline-flex items-center gap-2 text-sm text-ink-dim hover:text-ink transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Course
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <PlayCircle className="w-5 h-5 text-violet-400" />
            <h1 className="text-2xl font-bold text-ink">{course?.title}</h1>
          </div>
          <p className="text-ink-dim text-sm">Course Content — Only visible to enrolled students</p>
        </div>

        {/* Video player */}
        {embedUrl ? (
          <div className="bg-[#0d0d1a]/80 border border-violet-500/20 rounded-2xl overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={embedUrl}
                title={course?.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <div className="bg-[#0d0d1a]/80 border border-violet-500/20 rounded-2xl p-16 text-center">
            <AlertCircle className="w-12 h-12 text-violet-500/40 mx-auto mb-4" />
            <p className="text-white font-medium mb-1">Video not uploaded yet</p>
            <p className="text-ink-dim text-sm">Our team is preparing the course content. Check back soon!</p>
          </div>
        )}

        {/* Description */}
        {course?.description && (
          <div className="mt-6 bg-[#0d0d1a]/60 border border-violet-500/10 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-3">About this Course</h2>
            <p className="text-ink-dim text-sm leading-relaxed whitespace-pre-line">{course.description}</p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
