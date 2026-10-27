import { useEffect, useState } from 'react';
import api from '../utils/api';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, Pencil, Trash2, X, Check, Star, Download, ExternalLink, Code2, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

const empty = {
  title: '',
  slug: '',
  category: 'Full Stack Starter',
  description: '',
  features: '',
  techStack: '',
  previewUrl: '',
  githubUrl: '',
  downloadUrl: '',
  thumbnail: '',
  price: 0,
  isFree: true,
  downloadsCount: 0,
  isFeatured: false,
};

export default function ManageTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/templates')
      .then((r) => setTemplates(r.data.data || []))
      .catch(() => toast.error('Failed to load templates'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const toggleBool = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.checked }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        downloadsCount: Number(form.downloadsCount) || 0,
        features: typeof form.features === 'string' ? form.features.split('\n').map(s => s.trim()).filter(Boolean) : form.features,
        techStack: typeof form.techStack === 'string' ? form.techStack.split(',').map(s => s.trim()).filter(Boolean) : form.techStack,
      };

      if (editing) {
        await api.put(`/templates/${editing}`, payload);
        toast.success('Template updated');
      } else {
        await api.post('/templates', payload);
        toast.success('Template added');
      }
      cancel();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving template');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (t) => {
    setForm({
      title: t.title || '',
      slug: t.slug || '',
      category: t.category || 'Full Stack Starter',
      description: t.description || '',
      features: Array.isArray(t.features) ? t.features.join('\n') : '',
      techStack: Array.isArray(t.techStack) ? t.techStack.join(', ') : '',
      previewUrl: t.previewUrl || '',
      githubUrl: t.githubUrl || '',
      downloadUrl: t.downloadUrl || '',
      thumbnail: t.thumbnail || '',
      price: t.price ?? 0,
      isFree: t.isFree ?? true,
      downloadsCount: t.downloadsCount ?? 0,
      isFeatured: t.isFeatured || false,
    });
    setEditing(t._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (target) => {
    const item = target || deleteTarget;
    if (!item) return;
    const id = typeof item === 'object' ? item._id : item;
    setDeleting(true);
    try {
      await api.delete(`/templates/${id}`);
      toast.success('Template deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting template');
    } finally {
      setDeleting(false);
    }
  };

  const cancel = () => {
    setForm(empty);
    setEditing(null);
    setShowForm(false);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Manage Developer Templates</h1>
          <p className="mt-1 text-slate-400 text-sm">UI kits, full-stack boilerplate code, and starter templates</p>
        </div>
        <button
          onClick={() => {
            cancel();
            setShowForm((v) => !v);
          }}
          className="btn-primary"
        >
          {showForm && !editing ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Template</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="panel-card mb-6 grid sm:grid-cols-2 gap-4">
          <h2 className="sm:col-span-2 text-sm font-semibold text-slate-300">
            {editing ? 'Edit Template' : 'New Template'}
          </h2>

          <div>
            <label className="field-label">Template Title *</label>
            <input className="field" value={form.title} onChange={f('title')} placeholder="e.g. SaaS Admin Dashboard Starter Kit" required />
          </div>

          <div>
            <label className="field-label">Category</label>
            <input className="field" value={form.category} onChange={f('category')} placeholder="React & Tailwind, Full Stack, AI & Automation" />
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Description</label>
            <textarea className="field" rows={3} value={form.description} onChange={f('description')} placeholder="Detailed summary of boilerplate features and architecture" />
          </div>

          <div>
            <label className="field-label">Key Features (One per line)</label>
            <textarea className="field" rows={4} value={form.features} onChange={f('features')} placeholder="Role-based Access Control&#10;Dark/Light Mode Ready&#10;Chart.js Widgets" />
          </div>

          <div>
            <label className="field-label">Tech Stack (comma separated)</label>
            <textarea className="field" rows={4} value={form.techStack} onChange={f('techStack')} placeholder="React, Vite, TailwindCSS, Lucide Icons, Node.js" />
          </div>

          <div>
            <label className="field-label">Live Demo URL</label>
            <input className="field" value={form.previewUrl} onChange={f('previewUrl')} placeholder="https://preview.example.com" />
          </div>

          <div>
            <label className="field-label">GitHub Repository URL</label>
            <input className="field" value={form.githubUrl} onChange={f('githubUrl')} placeholder="https://github.com/..." />
          </div>

          <div>
            <label className="field-label">Direct Download ZIP URL</label>
            <input className="field" value={form.downloadUrl} onChange={f('downloadUrl')} placeholder="https://..." />
          </div>

          <div>
            <label className="field-label">Thumbnail Image URL</label>
            <input className="field" value={form.thumbnail} onChange={f('thumbnail')} placeholder="https://images.unsplash.com/..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Price (₹)</label>
              <input type="number" className="field" value={form.price} onChange={f('price')} placeholder="0" disabled={form.isFree} />
            </div>
            <div>
              <label className="field-label">Simulated Downloads</label>
              <input type="number" className="field" value={form.downloadsCount} onChange={f('downloadsCount')} placeholder="0" />
            </div>
          </div>

          <div className="flex flex-col justify-center gap-2 pt-2">
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input type="checkbox" checked={form.isFree} onChange={toggleBool('isFree')} className="w-4 h-4 rounded border-slate-600 accent-violet-500" />
              Free Template (₹0)
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={toggleBool('isFeatured')} className="w-4 h-4 rounded border-slate-600 accent-violet-500" />
              Feature in Template Showcase
            </label>
          </div>

          <div className="sm:col-span-2 flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              <Check size={15} /> {editing ? 'Update Template' : 'Create Template'}
            </button>
            <button type="button" onClick={cancel} className="btn-ghost">
              <X size={15} /> Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="panel-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="text-left py-3 px-4">Template</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Downloads</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t._id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-slate-100 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{t.title}</span>
                      {t.isFeatured && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border uppercase font-medium text-amber-300 bg-amber-500/10 border-amber-500/30">
                          <Star size={9} className="fill-amber-300" /> Featured
                        </span>
                      )}
                    </div>
                    {t.description && <p className="text-xs text-slate-400 mt-0.5 max-w-md truncate">{t.description}</p>}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{t.category || '—'}</td>
                  <td className="py-3 px-4">
                    {t.isFree ? (
                      <span className="inline-flex text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium">Free</span>
                    ) : (
                      <span className="text-slate-200 font-semibold">₹{t.price}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-xs font-mono">
                    <span className="inline-flex items-center gap-1">
                      <Download size={12} /> {t.downloadsCount || 0}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => startEdit(t)}
                        className="p-1.5 text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(t)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!templates.length && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No templates found. Click "Add Template" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Template"
        message={`Are you sure you want to delete "${deleteTarget?.title || 'this template'}"?`}
        confirmText="Delete Template"
        cancelText="Cancel"
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </section>
  );
}
