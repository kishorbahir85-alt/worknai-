import { useEffect, useState } from 'react';
import api from '../utils/api';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, Pencil, Trash2, X, Check, Star, Layers, Cpu, Globe, Shield, Zap, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const empty = {
  title: '',
  slug: '',
  icon: 'Layers',
  tagline: '',
  summary: '',
  description: '',
  category: 'Artificial Intelligence',
  features: '',
  deliverables: '',
  techStack: '',
  isFeatured: false,
  order: 0,
};

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/services')
      .then((r) => setServices(r.data.data || []))
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const toggleFeatured = (e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        order: Number(form.order) || 0,
        features: typeof form.features === 'string' ? form.features.split('\n').map(s => s.trim()).filter(Boolean) : form.features,
        deliverables: typeof form.deliverables === 'string' ? form.deliverables.split('\n').map(s => s.trim()).filter(Boolean) : form.deliverables,
        techStack: typeof form.techStack === 'string' ? form.techStack.split(',').map(s => s.trim()).filter(Boolean) : form.techStack,
      };

      if (editing) {
        await api.put(`/services/${editing}`, payload);
        toast.success('Service updated');
      } else {
        await api.post('/services', payload);
        toast.success('Service added');
      }
      cancel();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving service');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (s) => {
    setForm({
      title: s.title || '',
      slug: s.slug || '',
      icon: s.icon || 'Layers',
      tagline: s.tagline || '',
      summary: s.summary || '',
      description: s.description || '',
      category: s.category || 'Artificial Intelligence',
      features: Array.isArray(s.features) ? s.features.join('\n') : '',
      deliverables: Array.isArray(s.deliverables) ? s.deliverables.join('\n') : '',
      techStack: Array.isArray(s.techStack) ? s.techStack.join(', ') : '',
      isFeatured: s.isFeatured || false,
      order: s.order || 0,
    });
    setEditing(s._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (target) => {
    const item = target || deleteTarget;
    if (!item) return;
    const id = typeof item === 'object' ? item._id : item;
    setDeleting(true);
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting service');
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
          <h1 className="font-display text-3xl font-bold text-white">Manage Services</h1>
          <p className="mt-1 text-slate-400 text-sm">Services and enterprise solutions offered across the website</p>
        </div>
        <button
          onClick={() => {
            cancel();
            setShowForm((v) => !v);
          }}
          className="btn-primary"
        >
          {showForm && !editing ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Service</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="panel-card mb-6 grid sm:grid-cols-2 gap-4">
          <h2 className="sm:col-span-2 text-sm font-semibold text-slate-300">
            {editing ? 'Edit Service' : 'New Service'}
          </h2>

          <div>
            <label className="field-label">Service Title *</label>
            <input className="field" value={form.title} onChange={f('title')} placeholder="e.g. AI & Machine Learning Solutions" required />
          </div>
          <div>
            <label className="field-label">Category</label>
            <input className="field" value={form.category} onChange={f('category')} placeholder="e.g. Artificial Intelligence, Web Development" />
          </div>

          <div>
            <label className="field-label">Icon Name (Lucide Icon)</label>
            <input className="field" value={form.icon} onChange={f('icon')} placeholder="Brain, Globe, Cpu, Shield, Zap, Layers" />
          </div>
          <div>
            <label className="field-label">Display Order</label>
            <input type="number" className="field" value={form.order} onChange={f('order')} placeholder="0" />
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Tagline / Short Pitch</label>
            <input className="field" value={form.tagline} onChange={f('tagline')} placeholder="High-impact one liner for service cards" />
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Summary</label>
            <textarea className="field" rows={2} value={form.summary} onChange={f('summary')} placeholder="Short 2-3 sentence overview" />
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Full Detailed Description</label>
            <textarea className="field" rows={4} value={form.description} onChange={f('description')} placeholder="In-depth breakdown of service offering" />
          </div>

          <div>
            <label className="field-label">Key Features (One per line)</label>
            <textarea className="field" rows={4} value={form.features} onChange={f('features')} placeholder="Custom LLM Fine-Tuning&#10;Retrieval-Augmented Generation (RAG)&#10;Predictive Analytics" />
          </div>

          <div>
            <label className="field-label">Deliverables (One per line)</label>
            <textarea className="field" rows={4} value={form.deliverables} onChange={f('deliverables')} placeholder="Production-ready AI APIs&#10;Model Monitoring Dashboard&#10;Full Source Code" />
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Tech Stack (comma separated)</label>
            <input className="field" value={form.techStack} onChange={f('techStack')} placeholder="Python, PyTorch, LangChain, FastAPI, Docker" />
          </div>

          <div className="sm:col-span-2 flex items-center gap-2">
            <input
              id="isFeatured"
              type="checkbox"
              checked={form.isFeatured}
              onChange={toggleFeatured}
              className="w-4 h-4 rounded border-slate-600 accent-violet-500"
            />
            <label htmlFor="isFeatured" className="text-sm text-slate-300 cursor-pointer">
              Feature prominently on Homepage & Navigation
            </label>
          </div>

          <div className="sm:col-span-2 flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              <Check size={15} /> {editing ? 'Update Service' : 'Create Service'}
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
                <th className="text-left py-3 px-4">Service</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Tech Stack</th>
                <th className="text-left py-3 px-4">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s._id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-slate-100 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{s.title}</span>
                      {s.isFeatured && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border uppercase font-medium text-amber-300 bg-amber-500/10 border-amber-500/30">
                          <Star size={9} className="fill-amber-300" /> Featured
                        </span>
                      )}
                    </div>
                    {s.tagline && <p className="text-xs text-slate-400 mt-0.5 max-w-md truncate">{s.tagline}</p>}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{s.category || '—'}</td>
                  <td className="py-3 px-4 text-slate-300">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {s.techStack?.slice(0, 3).map((tech, i) => (
                        <span key={i} className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                          {tech}
                        </span>
                      ))}
                      {(s.techStack?.length || 0) > 3 && (
                        <span className="text-[11px] text-slate-500">+{s.techStack.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-xs">{s.order ?? 0}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => startEdit(s)}
                        className="p-1.5 text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!services.length && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No services found. Click "Add Service" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteTarget?.title || 'this service'}"?`}
        confirmText="Delete Service"
        cancelText="Cancel"
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </section>
  );
}
