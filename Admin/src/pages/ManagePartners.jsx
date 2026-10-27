import { useEffect, useState } from 'react';
import api from '../utils/api';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, Pencil, Trash2, X, Check, Handshake, ExternalLink, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const empty = {
  name: '',
  website: '',
  logoText: '',
  category: 'Technology Partner',
  tier: 'featured',
  description: '',
  order: 0,
};

export default function ManagePartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/partners')
      .then((r) => setPartners(r.data.data || []))
      .catch(() => toast.error('Failed to load partners'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('website', form.website);
      formData.append('category', form.category);
      formData.append('tier', form.tier);
      formData.append('description', form.description);
      formData.append('order', form.order);
      if (logoFile) formData.append('logo', logoFile);
      if (form.logoText?.trim()) formData.append('logoText', form.logoText.trim());

      if (editing) {
        await api.put(`/partners/${editing}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Partner updated');
      } else {
        await api.post('/partners', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Partner added');
      }
      cancel();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving partner');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p) => {
    setForm({
      name: p.name || '',
      website: p.website || '',
      logoText: '',
      category: p.category || 'Technology Partner',
      tier: p.tier || 'featured',
      description: p.description || '',
      order: p.order || 0,
    });
    setLogoFile(null);
    setLogoPreview(p.logo || '');
    setEditing(p._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (target) => {
    const item = target || deleteTarget;
    if (!item) return;
    const id = typeof item === 'object' ? item._id : item;
    setDeleting(true);
    try {
      await api.delete(`/partners/${id}`);
      toast.success('Partner deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting partner');
    } finally {
      setDeleting(false);
    }
  };

  const cancel = () => {
    setForm(empty);
    setLogoFile(null);
    setLogoPreview('');
    setEditing(null);
    setShowForm(false);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Manage Partners & Clients</h1>
          <p className="mt-1 text-slate-400 text-sm">Enterprise logos and collaborators displayed across the website</p>
        </div>
        <button
          onClick={() => {
            cancel();
            setShowForm((v) => !v);
          }}
          className="btn-primary"
        >
          {showForm && !editing ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Partner</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="panel-card mb-6 grid sm:grid-cols-2 gap-4">
          <h2 className="sm:col-span-2 text-sm font-semibold text-slate-300">
            {editing ? 'Edit Partner' : 'New Partner'}
          </h2>

          <div className="sm:col-span-2 flex items-center gap-4">
            <div className="w-20 h-16 shrink-0 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain p-2" />
              ) : (
                <ImageIcon size={20} className="text-slate-500" />
              )}
            </div>
            <div className="flex-1">
              <label className="field-label">Logo Image</label>
              <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" onChange={handleLogoChange} className="text-sm text-slate-300" />
              <input className="field mt-2" value={form.logoText} onChange={f('logoText')} placeholder="or paste logo URL (https://...)" />
            </div>
          </div>

          <div>
            <label className="field-label">Partner / Company Name *</label>
            <input className="field" value={form.name} onChange={f('name')} placeholder="e.g. Google Cloud, AWS, Microsoft" required />
          </div>

          <div>
            <label className="field-label">Website URL</label>
            <input className="field" value={form.website} onChange={f('website')} placeholder="https://..." />
          </div>

          <div>
            <label className="field-label">Category</label>
            <select className="field" value={form.category} onChange={f('category')}>
              <option value="Technology Partner">Technology Partner</option>
              <option value="Cloud Infrastructure">Cloud Infrastructure</option>
              <option value="Academic & Research">Academic & Research</option>
              <option value="Enterprise Client">Enterprise Client</option>
              <option value="AI Ecosystem">AI Ecosystem</option>
            </select>
          </div>

          <div>
            <label className="field-label">Partnership Tier</label>
            <select className="field" value={form.tier} onChange={f('tier')}>
              <option value="strategic">Strategic Partner</option>
              <option value="featured">Featured Partner</option>
              <option value="general">General Partner</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Description / Collaboration Summary</label>
            <textarea className="field" rows={2} value={form.description} onChange={f('description')} placeholder="Brief info on partnership scope" />
          </div>

          <div className="sm:col-span-2 flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              <Check size={15} /> {editing ? 'Update Partner' : 'Create Partner'}
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
                <th className="text-left py-3 px-4">Partner Name</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Tier</th>
                <th className="text-left py-3 px-4">Website</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((p) => (
                <tr key={p._id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-slate-100 font-medium">
                    <div className="flex items-center gap-3">
                      {p.logo && (
                        <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center p-1">
                          <img src={p.logo} alt={p.name} className="max-w-full max-h-full object-contain" />
                        </div>
                      )}
                      <div>
                        <span className="font-semibold">{p.name}</span>
                        {p.description && <p className="text-xs text-slate-400 truncate max-w-xs">{p.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{p.category || 'Technology Partner'}</td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 font-medium capitalize">
                      {p.tier}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-xs">
                    {p.website ? (
                      <a href={p.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-violet-400 hover:underline">
                        Visit <ExternalLink size={11} />
                      </a>
                    ) : '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => startEdit(p)}
                        className="p-1.5 text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!partners.length && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No partners found. Click "Add Partner" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Partner"
        message={`Are you sure you want to delete "${deleteTarget?.name || 'this partner'}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </section>
  );
}
