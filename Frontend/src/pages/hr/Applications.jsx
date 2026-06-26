import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  Users, Briefcase, FileText, Download, ChevronDown, ChevronUp,
  Calendar, Clock, MessageSquare, Check, X, Loader2, Phone, Star,
} from 'lucide-react';

const STATUS_OPTIONS = ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'];

const statusStyle = {
  pending:     'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  reviewing:   'bg-blue-500/15 text-blue-400 border-blue-500/30',
  shortlisted: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  rejected:    'bg-red-500/15 text-red-400 border-red-500/30',
  hired:       'bg-green-500/15 text-green-400 border-green-500/30',
};

const BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';

function ApplicantRow({ app, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    status: app.status,
    interviewDate: app.interview?.date || '',
    interviewTime: app.interview?.time || '',
    interviewNote: app.interview?.note || '',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/applications/${app._id}/status`, form);
      toast.success('Updated');
      onUpdate(app._id, form);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const inp = 'w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm outline-none focus:border-sky-500 transition-colors';

  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      {/* Row header */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-slate-900/60 cursor-pointer hover:bg-slate-800/50 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-sm font-bold shrink-0 overflow-hidden">
          {app.user?.avatar ? (
            <img src={app.user.avatar} alt={app.user.name} className="w-full h-full object-cover" />
          ) : (
            app.user?.name?.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-100 font-medium text-sm">{app.user?.name}</p>
          <p className="text-slate-500 text-xs truncate">{app.user?.email}</p>
        </div>
        <span className={`text-xs font-medium border rounded-full px-2.5 py-0.5 capitalize ${statusStyle[app.status]}`}>
          {app.status}
        </span>
        <p className="text-slate-500 text-xs hidden sm:block">
          {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        {open ? <ChevronUp size={15} className="text-slate-500 shrink-0" /> : <ChevronDown size={15} className="text-slate-500 shrink-0" />}
      </div>

      {/* Expanded details */}
      {open && (
        <div className="bg-slate-900/30 px-4 py-4 border-t border-slate-800 grid sm:grid-cols-2 gap-4">

          {/* Applicant info */}
          <div className="sm:col-span-2 grid sm:grid-cols-3 gap-3 bg-slate-800/40 rounded-xl p-3">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Email</p>
              <p className="text-slate-200 text-sm break-all">{app.applicantEmail || app.user?.email || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5 flex items-center gap-1"><Phone size={10} /> Phone</p>
              <p className="text-slate-200 text-sm">{app.phone || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5 flex items-center gap-1"><Star size={10} /> Experience</p>
              <p className="text-slate-200 text-sm font-medium text-sky-300">{app.experience || '—'}</p>
            </div>
            {app.currentRole && (
              <div className="sm:col-span-3">
                <p className="text-xs text-slate-500 mb-0.5">Current Role</p>
                <p className="text-slate-200 text-sm">{app.currentRole}</p>
              </div>
            )}
          </div>

          {/* Cover letter */}
          {app.coverLetter && (
            <div className="sm:col-span-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MessageSquare size={11} /> Cover Letter
              </p>
              <p className="text-slate-300 text-sm bg-slate-800/50 rounded-lg px-3 py-2 italic">
                "{app.coverLetter}"
              </p>
            </div>
          )}

          {/* Resume + Cover Letter PDF */}
          <div className="sm:col-span-2 flex flex-wrap gap-3">
            {app.resumeUrl ? (
              <a
                href={`${BASE}${app.resumeUrl}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600/20 border border-sky-500/30 text-sky-400 hover:bg-sky-600/30 text-sm transition-colors"
              >
                <Download size={14} /> Download Resume
              </a>
            ) : (
              <p className="text-slate-500 text-sm italic">No resume uploaded</p>
            )}
            {app.coverLetterUrl && (
              <a
                href={`${BASE}${app.coverLetterUrl}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400 hover:bg-violet-600/30 text-sm transition-colors"
              >
                <Download size={14} /> Download Cover Letter
              </a>
            )}
          </div>

          {/* Status update */}
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Update Status</label>
            <select value={form.status} onChange={f('status')} className={inp}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Interview date */}
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">
              <Calendar size={11} className="inline mr-1" />Interview Date
            </label>
            <input type="date" value={form.interviewDate} onChange={f('interviewDate')} className={inp} />
          </div>

          {/* Interview time */}
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">
              <Clock size={11} className="inline mr-1" />Interview Time
            </label>
            <input type="time" value={form.interviewTime} onChange={f('interviewTime')} className={inp} />
          </div>

          {/* Interview note */}
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">
              <MessageSquare size={11} className="inline mr-1" />Note / Instructions
            </label>
            <input
              type="text"
              value={form.interviewNote}
              onChange={f('interviewNote')}
              placeholder="Zoom link, venue, etc."
              className={inp}
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function JobCard({ job, applications, onUpdate }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
      {/* Job header */}
      <div
        className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center">
            <Briefcase size={16} className="text-sky-400" />
          </div>
          <div>
            <p className="text-slate-100 font-semibold">{job.title}</p>
            <p className="text-slate-500 text-xs capitalize">{job.type} · {job.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-800 rounded-full px-3 py-1">
            <Users size={13} className="text-sky-400" />
            <span className="text-slate-200 text-sm font-medium">{applications.length}</span>
            <span className="text-slate-500 text-xs">applied</span>
          </div>
          {open ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </div>
      </div>

      {/* Applications list */}
      {open && (
        <div className="border-t border-slate-800 px-4 py-4 flex flex-col gap-3">
          {applications.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">No applications yet</p>
          ) : (
            applications.map((app) => (
              <ApplicantRow key={app._id} app={app} onUpdate={onUpdate} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function HRApplications() {
  const [jobs, setJobs] = useState([]);
  const [appsByJob, setAppsByJob] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.get('/jobs/manage'),
          api.get('/applications'),
        ]);
        setJobs(jobsRes.data.data);
        // Group applications by job ID
        const grouped = {};
        appsRes.data.data.forEach((app) => {
          const jid = app.job?._id || app.job;
          if (!grouped[jid]) grouped[jid] = [];
          grouped[jid].push(app);
        });
        setAppsByJob(grouped);
      } catch {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const handleUpdate = (appId, updated) => {
    setAppsByJob((prev) => {
      const next = { ...prev };
      for (const jid in next) {
        next[jid] = next[jid].map((a) =>
          a._id === appId
            ? {
                ...a,
                status: updated.status,
                interview: {
                  date: updated.interviewDate,
                  time: updated.interviewTime,
                  note: updated.interviewNote,
                },
              }
            : a
        );
      }
      return next;
    });
  };

  const totalApps = Object.values(appsByJob).reduce((s, arr) => s + arr.length, 0);

  return (
    <section>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-white">Applications</h1>
        <p className="mt-1 text-slate-400 text-sm">
          {totalApps} total application{totalApps !== 1 ? 's' : ''} across {jobs.length} job{jobs.length !== 1 ? 's' : ''}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <FileText size={40} className="mx-auto mb-3 opacity-30" />
          No jobs posted yet
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              applications={appsByJob[job._id] || []}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </section>
  );
}
