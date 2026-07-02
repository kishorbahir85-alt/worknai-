import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Plus, Pencil, Trash2, X, Check, Image as ImageIcon, Code2 } from 'lucide-react';
import toast from 'react-hot-toast';

const BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
const empty = { title: '', description: '', category: '', url: '', techStack: '', videoUrl: '', features: '' };

export default function HRManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);
  const [removeGallery, setRemoveGallery] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); api.get('/products/manage').then(r => setProducts(r.data.data)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setGalleryFiles((p) => [...p, ...files]);
    setGalleryPreviews((p) => [...p, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const removeNewGalleryFile = (idx) => {
    setGalleryFiles((p) => p.filter((_, i) => i !== idx));
    setGalleryPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const toggleRemoveExisting = (url) => {
    setRemoveGallery((p) => (p.includes(url) ? p.filter((u) => u !== url) : [...p, url]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('url', form.url);
      formData.append('techStack', form.techStack);
      formData.append('videoUrl', form.videoUrl);
      formData.append('features', form.features);
      if (logoFile) formData.append('logo', logoFile);
      galleryFiles.forEach((file) => formData.append('gallery', file));
      if (editing && removeGallery.length) formData.append('removeGallery', removeGallery.join(','));

      if (editing) { await api.put(`/products/${editing}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }); toast.success('Updated'); }
      else { await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); toast.success('Product added'); }
      cancel(); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const startEdit = (p) => {
    setForm({
      title: p.title, description: p.description, category: p.category, url: p.url,
      techStack: p.techStack?.join(', ') || '', videoUrl: p.videoUrl || '', features: p.features?.join(', ') || '',
    });
    setLogoFile(null);
    setLogoPreview(p.logoUrl ? `${BASE}${p.logoUrl}` : '');
    setGalleryFiles([]); setGalleryPreviews([]); setRemoveGallery([]);
    setExistingGallery(p.gallery || []);
    setEditing(p._id); setShowForm(true); window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); toast.success('Deleted'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const cancel = () => {
    setForm(empty); setLogoFile(null); setLogoPreview('');
    setGalleryFiles([]); setGalleryPreviews([]); setExistingGallery([]); setRemoveGallery([]);
    setEditing(null); setShowForm(false);
  };
  const cls = 'w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-100 outline-none focus:border-sky-500 transition-colors text-sm';
  const lbl = 'block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider';

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-3xl font-bold text-white">Manage Products</h1><p className="mt-1 text-slate-400 text-sm">Products shown in the navbar dropdown and /products page</p></div>
        <button onClick={() => { cancel(); setShowForm(v => !v); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-colors">
          {showForm && !editing ? <><X size={15} /> Cancel</> : <><Plus size={15} /> New Product</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 mb-6 grid sm:grid-cols-2 gap-4">
          <h2 className="sm:col-span-2 text-sm font-semibold text-slate-300">{editing ? 'Edit Product' : 'New Product'}</h2>

          <div className="sm:col-span-2 flex items-center gap-4">
            <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
              {logoPreview ? <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" /> : <ImageIcon size={20} className="text-slate-500" />}
            </div>
            <div>
              <label className={lbl}>Logo</label>
              <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" onChange={handleLogoChange} className="text-sm text-slate-300" />
            </div>
          </div>

          <div className="sm:col-span-2"><label className={lbl}>Product Name *</label><input className={cls} value={form.title} onChange={f('title')} required placeholder="GoAirClass" /></div>
          <div className="sm:col-span-2"><label className={lbl}>Description</label><textarea className={cls} rows={3} value={form.description} onChange={f('description')} /></div>
          <div><label className={lbl}>Category</label><input className={cls} value={form.category} onChange={f('category')} placeholder="EdTech" /></div>
          <div><label className={lbl}>Website URL</label><input className={cls} value={form.url} onChange={f('url')} placeholder="https://goairclass.com" /></div>
          <div className="sm:col-span-2"><label className={lbl}>Tech Stack (comma separated)</label><input className={cls} value={form.techStack} onChange={f('techStack')} placeholder="React, Node.js" /></div>
          <div className="sm:col-span-2"><label className={lbl}>Key Features (comma separated)</label><input className={cls} value={form.features} onChange={f('features')} placeholder="Real-time booking, Secure payments, 24/7 support" /></div>
          <div className="sm:col-span-2"><label className={lbl}>Video URL (YouTube, Vimeo or direct mp4 link)</label><input className={cls} value={form.videoUrl} onChange={f('videoUrl')} placeholder="https://www.youtube.com/watch?v=..." /></div>

          <div className="sm:col-span-2">
            <label className={lbl}>Gallery / Screenshots</label>
            <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" multiple onChange={handleGalleryChange} className="text-sm text-slate-300" />
            {(existingGallery.length > 0 || galleryPreviews.length > 0) && (
              <div className="flex flex-wrap gap-3 mt-3">
                {existingGallery.map((url) => (
                  <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700">
                    <img src={`${BASE}${url}`} alt="Gallery" className={`w-full h-full object-cover ${removeGallery.includes(url) ? 'opacity-30' : ''}`} />
                    <button type="button" onClick={() => toggleRemoveExisting(url)} className="absolute top-0.5 right-0.5 bg-slate-900/80 rounded-full p-0.5 text-slate-200 hover:text-red-400">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {galleryPreviews.map((src, idx) => (
                  <div key={src} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700">
                    <img src={src} alt="New upload" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewGalleryFile(idx)} className="absolute top-0.5 right-0.5 bg-slate-900/80 rounded-full p-0.5 text-slate-200 hover:text-red-400">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-white font-medium text-sm transition-colors"><Check size={15} />{editing ? 'Update' : 'Add Product'}</button>
            <button type="button" onClick={cancel} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white font-medium text-sm transition-colors"><X size={15} />Cancel</button>
          </div>
        </form>
      )}

      {loading ? <div className="flex justify-center py-16"><div className="w-7 h-7 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider"><th className="text-left py-3 px-4">Logo</th><th className="text-left py-3 px-4">Name</th><th className="text-left py-3 px-4">Category</th><th className="text-left py-3 px-4">URL</th><th className="py-3 px-4" /></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                      {p.logoUrl ? <img src={`${BASE}${p.logoUrl}`} alt={p.title} className="w-full h-full object-contain" /> : <Code2 size={15} className="text-slate-500" />}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-100 font-medium">{p.title}</td>
                  <td className="py-3 px-4 text-slate-400">{p.category || '—'}</td>
                  <td className="py-3 px-4 text-slate-400 max-w-[200px] truncate">{p.url || '—'}</td>
                  <td className="py-3 px-4 text-right flex gap-1 justify-end">
                    <button onClick={() => startEdit(p)} className="p-1.5 text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {!products.length && <tr><td colSpan={5} className="py-12 text-center text-slate-500">No products yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
