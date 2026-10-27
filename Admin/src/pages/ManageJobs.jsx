import { useEffect, useState } from 'react';
import api from '../utils/api';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const empty = { title: '', description: '', location: 'Pune', type: 'full-time', experience: '', salary: '', skills: '' };

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/jobs/manage').then(r => setJobs(r.data.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/jobs/${editing}`, form); toast.success('Job updated'); }
      else { await api.post('/jobs', form); toast.success('Job posted'); }
      setForm(empty); setEditing(null); setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const startEdit = (j) => {
    setForm({ title: j.title, description: j.description, location: j.location, type: j.type, experience: j.experience, salary: j.salary, skills: j.skills?.join(', ') || '' });
    setEditing(j._id); setShowForm(true); window.scrollTo(0, 0);
  };

  const handleDelete = async (target) => {
    const item = target || deleteTarget;
    if (!item) return;
    const id = typeof item === 'object' ? item._id : item;
    setDeleting(true);
    try {
      await api.delete(`/jobs/${id}`);
      toast.success('Deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setDeleting(false);
    }
  };

  const cancel = () => { setForm(empty); setEditing(null); setShowForm(false); };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Manage Jobs</h1>
          <p className="mt-1 text-slate-400 text-sm">All job listings — posted by any user</p>
        </div>
        <button onClick={() => { cancel(); setShowForm(v => !v); }} className="btn-primary">
          {showForm && !editing ? <><X size={15} /> Cancel</> : <><Plus size={15} /> New Job</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="panel-card mb-6 grid sm:grid-cols-2 gap-4">
          <h2 className="sm:col-span-2 text-sm font-semibold text-slate-300">{editing ? 'Edit Job' : 'New Job'}</h2>
          <div className="sm:col-span-2">
            <label className="field-label">Job Title *</label>
            <input className="field" value={form.title} onChange={f('title')} placeholder="Frontend Developer" required />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Description</label>
            <textarea className="field" rows={3} value={form.description} onChange={f('description')} placeholder="Job responsibilities..." />
          </div>
          <div>
            <label className="field-label">Location</label>
            <input className="field" value={form.location} onChange={f('location')} placeholder="Pune" />
          </div>
          <div>
            <label className="field-label">Type</label>
            <select className="field" value={form.type} onChange={f('type')}>
              {['full-time','part-time','internship','freelance'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Experience</label>
            <input className="field" value={form.experience} onChange={f('experience')} placeholder="0-2 years" />
          </div>
          <div>
            <label className="field-label">Salary</label>
            <input className="field" value={form.salary} onChange={f('salary')} placeholder="₹3-5 LPA" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Skills (comma separated)</label>
            <input className="field" value={form.skills} onChange={f('skills')} placeholder="React, Node.js, MongoDB" />
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" className="btn-primary"><Check size={15} /> {editing ? 'Update' : 'Post Job'}</button>
            <button type="button" onClick={cancel} className="btn-ghost"><X size={15} /> Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="panel-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Location</th>
                <th className="text-left py-3 px-4">Posted By</th>
                <th className="text-left py-3 px-4">Salary</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j._id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-slate-100 font-medium">{j.title}</td>
                  <td className="py-3 px-4 text-slate-400 capitalize">{j.type}</td>
                  <td className="py-3 px-4 text-slate-400">{j.location}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-slate-300">{j.postedBy?.name}</span>
                    <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full border uppercase font-medium ${j.postedBy?.role === 'hr' ? 'text-sky-300 bg-sky-500/10 border-sky-500/30' : 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'}`}>{j.postedBy?.role}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{j.salary || '—'}</td>
                  <td className="py-3 px-4 text-right flex gap-1 justify-end">
                    <button onClick={() => startEdit(j)} className="p-1.5 text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteTarget(j)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {!jobs.length && <tr><td colSpan={6} className="py-12 text-center text-slate-500">No jobs found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Job"
        message={`Are you sure you want to delete "${deleteTarget?.title || 'this job'}"? This action cannot be undone.`}
        confirmText="Delete Job"
        cancelText="Cancel"
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </section>
  );
}
