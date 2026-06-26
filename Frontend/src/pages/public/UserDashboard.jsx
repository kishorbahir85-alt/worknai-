import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase, MapPin, Clock, ChevronRight, User, BookOpen,
  AlertCircle, Loader2, Calendar, MessageSquare, PlayCircle, Send, Key, Copy,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const statusColors = {
  pending:     'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  reviewing:   'bg-blue-500/15 text-blue-400 border-blue-500/30',
  shortlisted: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  rejected:    'bg-red-500/15 text-red-400 border-red-500/30',
  hired:       'bg-green-500/15 text-green-400 border-green-500/30',
};

const statusLabel = {
  pending:     'Pending Review',
  reviewing:   'Under Review',
  shortlisted: 'Shortlisted',
  rejected:    'Rejected',
  hired:       'Hired 🎉',
};

const paymentBadge = {
  free:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  paid:    'bg-green-500/15 text-green-400 border-green-500/30',
};

const appStatusBadge = {
  pending:   'bg-amber-500/15 text-amber-400 border-amber-500/30',
  approved:  'bg-blue-500/15 text-blue-400 border-blue-500/30',
  confirmed: 'bg-green-500/15 text-green-400 border-green-500/30',
  rejected:  'bg-red-500/15 text-red-400 border-red-500/30',
};

const appStatusLabel = {
  pending:   'Pending Review',
  approved:  'Approved',
  confirmed: 'Confirmed',
  rejected:  'Rejected',
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingEnroll, setLoadingEnroll] = useState(true);
  const [appsError, setAppsError] = useState('');

  const jobInquiries = applications.filter((a) => a.source === 'join-us' || (!a.job && a.currentRole));
  const regularApps  = applications.filter((a) => a.source !== 'join-us' && a.job);

  useEffect(() => {
    api.get('/applications/my')
      .then((res) => setApplications(res.data.data))
      .catch(() => setAppsError('Failed to load applications'))
      .finally(() => setLoadingApps(false));
    api.get('/enrollments/my')
      .then((res) => setEnrollments(res.data.data))
      .catch(() => {})
      .finally(() => setLoadingEnroll(false));
  }, []);

  return (
    <section className="py-12 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-7 h-7 text-violet-400" />
            )}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink">Hello, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-ink-dim text-sm">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Applied', value: regularApps.length },
          { label: 'Shortlisted', value: regularApps.filter((a) => a.status === 'shortlisted').length },
          { label: 'Inquiries', value: jobInquiries.length },
          { label: 'Courses', value: enrollments.length },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0d0d1a]/80 border border-violet-500/20 rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-ink-dim mt-0.5">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* My Applied Jobs */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-ink flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-violet-400" /> My Applied Jobs
          </h2>
          <Link to="/career" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
            Browse jobs <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingApps ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 text-violet-400 animate-spin" /></div>
        ) : appsError ? (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />{appsError}
          </div>
        ) : regularApps.length === 0 ? (
          <div className="text-center py-12 bg-[#0d0d1a]/50 border border-violet-500/10 rounded-2xl">
            <Briefcase className="w-12 h-12 text-violet-500/40 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">No applications yet</p>
            <p className="text-ink-dim text-sm mb-6">Start exploring jobs and apply to ones that interest you.</p>
            <Link to="/career" className="btn-primary text-sm">Browse Jobs <ChevronRight className="w-4 h-4" /></Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {regularApps.map((app, i) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-[#0d0d1a]/80 border border-violet-500/15 rounded-2xl p-5 backdrop-blur-sm hover:border-violet-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Link to={`/career/${app.job?.slug}`} className="text-white font-semibold hover:text-violet-300 transition-colors">
                        {app.job?.title || 'Job removed'}
                      </Link>
                      {!app.job?.isActive && (
                        <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2 py-0.5">Closed</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-ink-dim">
                      {app.job?.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{app.job.location}</span>}
                      {app.job?.type && <span className="flex items-center gap-1 capitalize"><Briefcase className="w-3.5 h-3.5" />{app.job.type}</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <span className={`shrink-0 text-xs font-medium border rounded-full px-3 py-1 ${statusColors[app.status] || statusColors.pending}`}>
                    {statusLabel[app.status] || app.status}
                  </span>
                </div>

                {/* Interview schedule */}
                {(app.interview?.date || app.interview?.note) && (
                  <div className="mt-3 bg-violet-500/8 border border-violet-500/20 rounded-xl px-4 py-3">
                    <p className="text-xs text-violet-400 font-medium uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Interview Scheduled
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {app.interview?.date && (
                        <span className="flex items-center gap-1.5 text-white">
                          <Calendar className="w-3.5 h-3.5 text-violet-400" />
                          {new Date(app.interview.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      )}
                      {app.interview?.time && (
                        <span className="flex items-center gap-1.5 text-white">
                          <Clock className="w-3.5 h-3.5 text-violet-400" />
                          {app.interview.time}
                        </span>
                      )}
                    </div>
                    {app.interview?.note && (
                      <p className="mt-2 text-sm text-ink-dim flex items-start gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-violet-400 mt-0.5 shrink-0" />
                        {app.interview.note}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* My Job Inquiries */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="mt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-ink flex items-center gap-2">
            <Send className="w-5 h-5 text-violet-400" /> My Job Inquiries
          </h2>
          <Link to="/join-us" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
            New inquiry <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingApps ? (
          <div className="flex items-center justify-center py-8"><Loader2 className="w-7 h-7 text-violet-400 animate-spin" /></div>
        ) : jobInquiries.length === 0 ? (
          <div className="text-center py-10 bg-[#0d0d1a]/50 border border-violet-500/10 rounded-2xl">
            <Send className="w-10 h-10 text-violet-500/40 mx-auto mb-3" />
            <p className="text-white font-medium mb-1">No job inquiries yet</p>
            <p className="text-ink-dim text-sm mb-5">Submit a job inquiry from the Join Us page.</p>
            <Link to="/join-us" className="btn-primary text-sm">Go to Join Us <ChevronRight className="w-4 h-4" /></Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {jobInquiries.map((app) => (
              <div key={app._id} className="bg-[#0d0d1a]/80 border border-violet-500/15 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-semibold">{app.currentRole || 'General Inquiry'}</p>
                    <p className="text-ink-dim text-xs mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Submitted {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    {app.experience && <p className="text-ink-dim text-xs mt-0.5">Experience: {app.experience}</p>}
                  </div>
                  <span className={`shrink-0 text-xs font-medium border rounded-full px-3 py-1 ${statusColors[app.status] || statusColors.pending}`}>
                    {statusLabel[app.status] || 'Pending Review'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* My Courses */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-ink flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-violet-400" /> My Courses
          </h2>
          <Link to="/courses" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
            Browse courses <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingEnroll ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 text-violet-400 animate-spin" /></div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-12 bg-[#0d0d1a]/50 border border-violet-500/10 rounded-2xl">
            <BookOpen className="w-12 h-12 text-violet-500/40 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">No enrolled courses yet</p>
            <p className="text-ink-dim text-sm mb-6">Explore our courses and upskill yourself.</p>
            <Link to="/courses" className="btn-primary text-sm">Browse Courses <ChevronRight className="w-4 h-4" /></Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {enrollments.map((e, i) => (
              <motion.div
                key={e._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-[#0d0d1a]/80 border border-violet-500/15 rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-white font-semibold">{e.course?.title}</p>
                    <p className="text-ink-dim text-xs capitalize mt-0.5">{e.course?.level} · {e.course?.mode}</p>
                  </div>
                  {e.enrollmentType === 'offline' ? (
                    <span className={`shrink-0 text-xs font-medium border rounded-full px-2.5 py-0.5 ${appStatusBadge[e.applicationStatus] || appStatusBadge.pending}`}>
                      {appStatusLabel[e.applicationStatus] || 'Pending Review'}
                    </span>
                  ) : (
                    <span className={`shrink-0 text-xs font-medium border rounded-full px-2.5 py-0.5 capitalize ${paymentBadge[e.paymentStatus]}`}>
                      {e.paymentStatus === 'pending' ? 'Payment Pending' : e.paymentStatus === 'paid' ? 'Paid' : 'Free'}
                    </span>
                  )}
                </div>
                {e.enrollmentType === 'offline' ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-ink-dim">
                      {e.applicationStatus === 'pending'   && 'Our team will review your application and contact you shortly.'}
                      {e.applicationStatus === 'approved'  && 'Your application is approved. Our team will contact you with batch details.'}
                      {e.applicationStatus === 'confirmed' && 'Your enrollment is confirmed. Welcome to the course!'}
                      {e.applicationStatus === 'rejected'  && 'Your application was not accepted at this time.'}
                    </p>
                    {e.statusNote && <p className="text-xs text-ink-dim italic">Note: {e.statusNote}</p>}
                    {e.batchName && e.applicationStatus !== 'rejected' && (
                      <p className="text-xs text-ink-dim">Batch: <span className="text-violet-300 font-medium">{e.batchName}</span></p>
                    )}
                  </div>
                ) : (e.paymentStatus === 'paid' || e.paymentStatus === 'free') ? (
                  <div className="flex flex-col gap-2">
                    {e.accessCode && (
                      <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-lg px-3 py-2">
                        <Key className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <span className="font-mono text-sm font-bold text-white tracking-widest">{e.accessCode}</span>
                        <button onClick={() => { navigator.clipboard.writeText(e.accessCode); toast.success('Copied!'); }} className="ml-auto p-1 hover:bg-violet-500/20 rounded transition-colors">
                          <Copy className="w-3 h-3 text-violet-400" />
                        </button>
                      </div>
                    )}
                    {e.batchName && (
                      <p className="text-xs text-ink-dim">Batch: <span className="text-violet-300 font-medium">{e.batchName}</span></p>
                    )}
                    {(e.enrollmentType === 'online' || e.enrollmentType === 'hybrid') && (
                      <Link to={`/courses/${e.course?.slug}/content`} className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors">
                        <PlayCircle className="w-4 h-4" /> Go to Course
                      </Link>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-ink-dim italic">
                    Access will be available once payment is confirmed.
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
