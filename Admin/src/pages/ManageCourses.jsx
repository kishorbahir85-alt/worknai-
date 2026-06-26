import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const empty = { title: '', description: '', category: '', duration: '', startDate: '', price: '', level: 'beginner', mode: 'offline' };
const toDateInputValue = (value) => {
  if (!value) return '';
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const match = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (match) return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
  return '';
};
const formatDate = (value) => {
  const normalized = toDateInputValue(value);
  if (!normalized) return '—';
  return new Date(`${normalized}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () => {
    setLoading(true);
    api.get('/courses/manage').then(r => setCourses(r.data.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/courses/${editing}`, form);
        toast.success('Course updated');
      } else {
        await api.post('/courses', form);
        toast.success('Course created');
      }
      setForm(empty); setEditing(null); setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const startEdit = (c) => {
    setForm({ title: c.title, description: c.description, category: c.category, duration: c.duration, startDate: toDateInputValue(c.startDate), price: c.price, level: c.level, mode: c.mode });
    setEditing(c._id); setShowForm(true); window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this course?')) return;
    try { await api.delete(`/courses/${id}`); toast.success('Deleted'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const cancel = () => { setForm(empty); setEditing(null); setShowForm(false); };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Manage Courses</h1>
          <p className="mt-1 text-slate-400 text-sm">All courses — posted by any user</p>
        </div>
        <button onClick={() => { cancel(); setShowForm(v => !v); }} className="btn-primary">
          {showForm && !editing ? <><X size={15} /> Cancel</> : <><Plus size={15} /> New Course</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="panel-card mb-6 grid sm:grid-cols-2 gap-4">
          <h2 className="sm:col-span-2 text-sm font-semibold text-slate-300">{editing ? 'Edit Course' : 'New Course'}</h2>
          <div className="sm:col-span-2">
            <label className="field-label">Title *</label>
            <input className="field" value={form.title} onChange={f('title')} placeholder="React & Node Full Stack" required />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Description</label>
            <textarea className="field" rows={3} value={form.description} onChange={f('description')} placeholder="Course overview..." />
          </div>
          <div>
            <label className="field-label">Category</label>
            <input className="field" value={form.category} onChange={f('category')} placeholder="Web Development" />
          </div>
          <div>
            <label className="field-label">Duration</label>
            <input className="field" value={form.duration} onChange={f('duration')} placeholder="3 Months" />
          </div>
          <div>
            <label className="field-label">Start Date</label>
            <input type="date" className="field" value={form.startDate} onChange={f('startDate')} />
          </div>
          <div>
            <label className="field-label">Price (₹)</label>
            <input type="number" className="field" value={form.price} onChange={f('price')} placeholder="0" min={0} />
          </div>
          <div>
            <label className="field-label">Level</label>
            <select className="field" value={form.level} onChange={f('level')}>
              {['beginner','intermediate','advanced'].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Mode</label>
            <select className="field" value={form.mode} onChange={f('mode')}>
              {['online','offline','hybrid'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" className="btn-primary"><Check size={15} /> {editing ? 'Update' : 'Create'}</button>
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
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Level</th>
                <th className="text-left py-3 px-4">Mode</th>
                <th className="text-left py-3 px-4">Posted By</th>
                <th className="text-left py-3 px-4">Start Date</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c._id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-slate-100 font-medium max-w-[200px] truncate">{c.title}</td>
                  <td className="py-3 px-4 text-slate-400">{c.category || '—'}</td>
                  <td className="py-3 px-4 text-slate-400 capitalize">{c.level}</td>
                  <td className="py-3 px-4 text-slate-400 capitalize">{c.mode}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-slate-300">{c.postedBy?.name}</span>
                    <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full border uppercase font-medium ${c.postedBy?.role === 'hr' ? 'text-sky-300 bg-sky-500/10 border-sky-500/30' : c.postedBy?.role === 'manager' ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' : 'text-violet-300 bg-violet-500/10 border-violet-500/30'}`}>{c.postedBy?.role}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{formatDate(c.startDate)}</td>
                  <td className="py-3 px-4 text-slate-400">{c.price ? `₹${c.price}` : 'Free'}</td>
                  <td className="py-3 px-4 text-right flex gap-1 justify-end">
                    <button onClick={() => startEdit(c)} className="p-1.5 text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(c._id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {!courses.length && <tr><td colSpan={8} className="py-12 text-center text-slate-500">No courses found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
