import { useEffect, useState } from 'react';
import api from '../../utils/api';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { Plus, Pencil, Trash2, X, Check, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const inp = 'w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-100 outline-none focus:border-sky-500 transition-colors text-sm';
const lbl = 'block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider';

const emptyBatch = { name: '', timing: '', days: '', startDate: '', totalSeats: '' };
const empty = { title: '', shortDescription: '', description: '', icon: '📚', category: '', duration: '', startDate: '', price: '', discountPrice: '', level: 'beginner', mode: 'offline', videoUrl: '', batches: [] };
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

export default function HRManageCourses() {
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(empty);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/courses/manage').then(r => setCourses(r.data.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  /* ── Batch helpers ── */
  const addBatch = () => setForm(p => ({ ...p, batches: [...p.batches, { ...emptyBatch }] }));
  const removeBatch = (i) => setForm(p => ({ ...p, batches: p.batches.filter((_, idx) => idx !== i) }));
  const batchField = (i, k) => (e) => setForm(p => {
    const batches = [...p.batches];
    batches[i] = { ...batches[i], [k]: e.target.value };
    return { ...p, batches };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        discountPrice: Number(form.discountPrice) || 0,
        batches: (form.mode === 'offline' || form.mode === 'hybrid') ? form.batches : [],
      };
      if (editing) { await api.put(`/courses/${editing}`, payload); toast.success('Course updated'); }
      else { await api.post('/courses', payload); toast.success('Course created'); }
      setForm(empty); setEditing(null); setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const startEdit = (c) => {
    setForm({
      title: c.title, shortDescription: c.shortDescription || '', description: c.description,
      icon: c.icon || '📚', category: c.category, duration: c.duration,
      startDate: toDateInputValue(c.startDate),
      price: c.price, discountPrice: c.discountPrice || '',
      level: c.level, mode: c.mode, videoUrl: c.videoUrl || '',
      batches: (c.batches || []).map((batch) => ({ ...batch, startDate: toDateInputValue(batch.startDate) })),
    });
    setEditing(c._id); setShowForm(true); window.scrollTo(0, 0);
  };

  const handleDelete = async (target) => {
    const item = target || deleteTarget;
    if (!item) return;
    const id = typeof item === 'object' ? item._id : item;
    setDeleting(true);
    try {
      await api.delete(`/courses/${id}`);
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
  const isOffline = form.mode === 'offline' || form.mode === 'hybrid';

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Manage Courses</h1>
          <p className="mt-1 text-slate-400 text-sm">Courses you have posted</p>
        </div>
        <button onClick={() => { cancel(); setShowForm(v => !v); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-colors">
          {showForm && !editing ? <><X size={15} /> Cancel</> : <><Plus size={15} /> New Course</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 mb-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">{editing ? 'Edit Course' : 'New Course'}</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={lbl}>Title *</label>
              <input className={inp} value={form.title} onChange={f('title')} required placeholder="Course title" />
            </div>
            <div>
              <label className={lbl}>Icon (emoji)</label>
              <input className={inp} value={form.icon} onChange={f('icon')} placeholder="📚" />
            </div>
            <div>
              <label className={lbl}>Category</label>
              <input className={inp} value={form.category} onChange={f('category')} placeholder="Web Development" />
            </div>
            <div className="sm:col-span-2">
              <label className={lbl}>Short Description</label>
              <input className={inp} value={form.shortDescription} onChange={f('shortDescription')} placeholder="One-line summary shown on cards" />
            </div>
            <div className="sm:col-span-2">
              <label className={lbl}>Full Description</label>
              <textarea className={inp} rows={3} value={form.description} onChange={f('description')} />
            </div>
            <div>
              <label className={lbl}>Duration</label>
              <input className={inp} value={form.duration} onChange={f('duration')} placeholder="3 Months" />
            </div>
            <div>
              <label className={lbl}>Start Date</label>
              <input type="date" className={inp} value={form.startDate} onChange={f('startDate')} />
            </div>
            <div>
              <label className={lbl}>Level</label>
              <select className={inp} value={form.level} onChange={f('level')}>
                {['beginner', 'intermediate', 'advanced'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Price (₹)</label>
              <input type="number" className={inp} value={form.price} onChange={f('price')} min={0} placeholder="0 = Free" />
            </div>
            <div>
              <label className={lbl}>Discount Price (₹) <span className="text-slate-500 normal-case">(optional)</span></label>
              <input type="number" className={inp} value={form.discountPrice} onChange={f('discountPrice')} min={0} placeholder="Leave empty if no discount" />
            </div>
            <div>
              <label className={lbl}>Mode</label>
              <select className={inp} value={form.mode} onChange={f('mode')}>
                {['online', 'offline', 'hybrid'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Video URL <span className="text-slate-500 normal-case">(online only)</span></label>
              <input className={inp} value={form.videoUrl} onChange={f('videoUrl')} placeholder="https://www.youtube.com/embed/..." />
            </div>
          </div>

          {/* Batch section — only for offline/hybrid */}
          {isOffline && (
            <div className="border-t border-slate-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-300 flex items-center gap-2"><Calendar size={14} /> Batches</p>
                <button type="button" onClick={addBatch} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600/20 border border-sky-500/30 text-sky-400 text-xs font-medium hover:bg-sky-600/30 transition-colors">
                  <Plus size={12} /> Add Batch
                </button>
              </div>

              {form.batches.length === 0 && (
                <p className="text-slate-500 text-xs py-3 text-center border border-dashed border-slate-700 rounded-xl">No batches added yet. Click "Add Batch" to add one.</p>
              )}

              <div className="space-y-3">
                {form.batches.map((b, i) => (
                  <div key={i} className="border border-slate-700 rounded-xl p-4 bg-slate-800/40">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-slate-300">Batch {i + 1}</p>
                      <button type="button" onClick={() => removeBatch(i)} className="p-1 text-slate-500 hover:text-red-400 transition-colors"><X size={13} /></button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Batch Name *</label>
                        <input className={inp} value={b.name} onChange={batchField(i, 'name')} placeholder="Morning Batch" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider flex items-center gap-1"><Clock size={9} />Timing</label>
                        <input className={inp} value={b.timing} onChange={batchField(i, 'timing')} placeholder="9:00 AM – 11:00 AM" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Days</label>
                        <input className={inp} value={b.days} onChange={batchField(i, 'days')} placeholder="Mon, Wed, Fri" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Start Date</label>
                        <input type="date" className={inp} value={b.startDate} onChange={batchField(i, 'startDate')} />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Total Seats (0 = unlimited)</label>
                        <input type="number" className={inp} value={b.totalSeats} onChange={batchField(i, 'totalSeats')} min={0} placeholder="0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-colors">
              <Check size={15} />{editing ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={cancel} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white font-medium text-sm transition-colors">
              <X size={15} />Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-7 h-7 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Level</th>
                <th className="text-left py-3 px-4">Mode</th>
                <th className="text-left py-3 px-4">Start Date</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Batches</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c._id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-slate-100 font-medium">{c.icon} {c.title}</td>
                  <td className="py-3 px-4 text-slate-400">{c.category || '—'}</td>
                  <td className="py-3 px-4 text-slate-400 capitalize">{c.level}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${c.mode === 'online' ? 'text-sky-400 bg-sky-500/10' : c.mode === 'offline' ? 'text-violet-400 bg-violet-500/10' : 'text-pink-400 bg-pink-500/10'}`}>
                      {c.mode}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{formatDate(c.startDate)}</td>
                  <td className="py-3 px-4 text-slate-400">
                    {c.discountPrice > 0 ? (
                      <><span className="text-white font-medium">₹{c.discountPrice}</span> <span className="line-through text-xs">₹{c.price}</span></>
                    ) : c.price ? `₹${c.price}` : 'Free'}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {c.batches?.length > 0 ? <span className="text-xs text-sky-400">{c.batches.length} batch{c.batches.length > 1 ? 'es' : ''}</span> : '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => startEdit(c)} className="p-1.5 text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteTarget(c)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!courses.length && <tr><td colSpan={8} className="py-12 text-center text-slate-500">No courses yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Course"
        message={`Are you sure you want to delete "${deleteTarget?.title || 'this course'}"? This action cannot be undone.`}
        confirmText="Delete Course"
        cancelText="Cancel"
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </section>
  );
}
