import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Plus, Pencil, Trash2, X, Check, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
const resolveUrl = (url) => (url && !/^https?:\/\//.test(url) ? `${BASE}${url}` : url);
const empty = { title: '', description: '', difficulty: 'Beginner', videoUrl: '', tags: '', coverImageText: '' };
const emptyStep = { title: '', description: '' };
const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

export default function ManageTutorials() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [steps, setSteps] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/tutorials/manage').then(r => setTutorials(r.data.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const addStep = () => setSteps((p) => [...p, { ...emptyStep }]);
  const updateStep = (idx, key, value) => setSteps((p) => p.map((s, i) => (i === idx ? { ...s, [key]: value } : s)));
  const removeStep = (idx) => setSteps((p) => p.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('difficulty', form.difficulty);
      formData.append('videoUrl', form.videoUrl);
      formData.append('tags', form.tags);
      formData.append('steps', JSON.stringify(steps.filter((s) => s.title || s.description)));
      if (coverFile) formData.append('coverImage', coverFile);
      if (form.coverImageText.trim()) formData.append('coverImageText', form.coverImageText.trim());

      if (editing) { await api.put(`/tutorials/${editing}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }); toast.success('Tutorial updated'); }
      else { await api.post('/tutorials', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); toast.success('Tutorial added'); }
      cancel(); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const startEdit = (t) => {
    setForm({
      title: t.title, description: t.description || '', difficulty: t.difficulty || 'Beginner',
      videoUrl: t.videoUrl || '', tags: t.tags?.join(', ') || '', coverImageText: '',
    });
    setCoverFile(null);
    setCoverPreview(t.coverImage ? resolveUrl(t.coverImage) : '');
    setSteps(t.steps?.length ? t.steps : []);
    setEditing(t._id); setShowForm(true); window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this tutorial?')) return;
    try { await api.delete(`/tutorials/${id}`); toast.success('Deleted'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const cancel = () => {
    setForm(empty); setCoverFile(null); setCoverPreview(''); setSteps([]);
    setEditing(null); setShowForm(false);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Manage Tutorials</h1>
          <p className="mt-1 text-slate-400 text-sm">Step-by-step guides shown on the public Tutorials page</p>
        </div>
        <button onClick={() => { cancel(); setShowForm(v => !v); }} className="btn-primary">
          {showForm && !editing ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Tutorial</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="panel-card mb-6 grid sm:grid-cols-2 gap-4">
          <h2 className="sm:col-span-2 text-sm font-semibold text-slate-300">{editing ? 'Edit Tutorial' : 'New Tutorial'}</h2>

          <div className="sm:col-span-2 flex items-center gap-4">
            <div className="w-24 h-16 shrink-0 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
              {coverPreview ? <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-slate-500" />}
            </div>
            <div className="flex-1">
              <label className="field-label">Cover Image</label>
              <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" onChange={handleCoverChange} className="text-sm text-slate-300" />
              <input className="field mt-2" value={form.coverImageText} onChange={f('coverImageText')} placeholder="or paste image URL (https://...)" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Title *</label>
            <input className="field" value={form.title} onChange={f('title')} placeholder="Getting started with our API" required />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Description</label>
            <textarea className="field" rows={3} value={form.description} onChange={f('description')} placeholder="What will the reader learn..." />
          </div>
          <div>
            <label className="field-label">Difficulty</label>
            <select className="field" value={form.difficulty} onChange={f('difficulty')}>
              {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Tags (comma separated)</label>
            <input className="field" value={form.tags} onChange={f('tags')} placeholder="api, setup, beginner" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Video URL (YouTube, Vimeo or direct mp4 link)</label>
            <input className="field" value={form.videoUrl} onChange={f('videoUrl')} placeholder="https://www.youtube.com/watch?v=..." />
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="field-label !mb-0">Steps</label>
              <button type="button" onClick={addStep} className="btn-ghost text-xs px-3 py-1.5"><Plus size={12} /> Add Step</button>
            </div>
            <div className="flex flex-col gap-3">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="mt-3 text-xs text-slate-500 w-5 shrink-0">{idx + 1}.</span>
                  <div className="flex-1 grid sm:grid-cols-2 gap-2">
                    <input className="field" value={step.title} onChange={(e) => updateStep(idx, 'title', e.target.value)} placeholder="Step title" />
                    <input className="field" value={step.description} onChange={(e) => updateStep(idx, 'description', e.target.value)} placeholder="Step description" />
                  </div>
                  <button type="button" onClick={() => removeStep(idx)} className="mt-2.5 p-1.5 text-slate-500 hover:text-red-400 shrink-0"><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60"><Check size={15} /> {editing ? 'Update' : 'Add'}</button>
            <button type="button" onClick={cancel} className="btn-ghost"><X size={15} /> Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="panel-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Difficulty</th>
                <th className="text-left py-3 px-4">Posted By</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {tutorials.map(t => (
                <tr key={t._id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-slate-100 font-medium">{t.title}</td>
                  <td className="py-3 px-4 text-slate-400">{t.difficulty || '—'}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-slate-300">{t.postedBy?.name}</span>
                    <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full border uppercase font-medium text-emerald-300 bg-emerald-500/10 border-emerald-500/30">{t.postedBy?.role}</span>
                  </td>
                  <td className="py-3 px-4 text-right flex gap-1 justify-end">
                    <button onClick={() => startEdit(t)} className="p-1.5 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(t._id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {!tutorials.length && <tr><td colSpan={4} className="py-12 text-center text-slate-500">No tutorials found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
