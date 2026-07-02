import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Plus, Pencil, Trash2, X, Check, Image as ImageIcon, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
const resolveUrl = (url) => (url && !/^https?:\/\//.test(url) ? `${BASE}${url}` : url);
const empty = { title: '', excerpt: '', content: '', category: '', tags: '', isFeatured: false, coverImageText: '' };

export default function ManageBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/blog/manage').then(r => setPosts(r.data.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const toggleFeatured = (e) => setForm(p => ({ ...p, isFeatured: e.target.checked }));

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('excerpt', form.excerpt);
      formData.append('content', form.content);
      formData.append('category', form.category);
      formData.append('tags', form.tags);
      formData.append('isFeatured', form.isFeatured);
      if (coverFile) formData.append('coverImage', coverFile);
      if (form.coverImageText.trim()) formData.append('coverImageText', form.coverImageText.trim());

      if (editing) { await api.put(`/blog/${editing}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }); toast.success('Blog post updated'); }
      else { await api.post('/blog', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); toast.success('Blog post added'); }
      cancel(); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const startEdit = (p) => {
    setForm({
      title: p.title, excerpt: p.excerpt || '', content: p.content || '',
      category: p.category || '', tags: p.tags?.join(', ') || '',
      isFeatured: p.isFeatured || false, coverImageText: '',
    });
    setCoverFile(null);
    setCoverPreview(p.coverImage ? resolveUrl(p.coverImage) : '');
    setEditing(p._id); setShowForm(true); window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog post?')) return;
    try { await api.delete(`/blog/${id}`); toast.success('Deleted'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const cancel = () => {
    setForm(empty); setCoverFile(null); setCoverPreview('');
    setEditing(null); setShowForm(false);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Manage Blog</h1>
          <p className="mt-1 text-slate-400 text-sm">Articles shown on the public Blog page</p>
        </div>
        <button onClick={() => { cancel(); setShowForm(v => !v); }} className="btn-primary">
          {showForm && !editing ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Post</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="panel-card mb-6 grid sm:grid-cols-2 gap-4">
          <h2 className="sm:col-span-2 text-sm font-semibold text-slate-300">{editing ? 'Edit Post' : 'New Post'}</h2>

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
            <input className="field" value={form.title} onChange={f('title')} placeholder="How we built our new dashboard" required />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Excerpt</label>
            <input className="field" value={form.excerpt} onChange={f('excerpt')} placeholder="Short summary shown in the blog list" />
          </div>
          <div>
            <label className="field-label">Category</label>
            <input className="field" value={form.category} onChange={f('category')} placeholder="Engineering / Product / News" />
          </div>
          <div>
            <label className="field-label">Tags (comma separated)</label>
            <input className="field" value={form.tags} onChange={f('tags')} placeholder="react, nodejs, design" />
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <input id="isFeatured" type="checkbox" checked={form.isFeatured} onChange={toggleFeatured} className="w-4 h-4 rounded border-slate-600 accent-emerald-500" />
            <label htmlFor="isFeatured" className="text-sm text-slate-300 cursor-pointer">Feature in Resources menu</label>
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Content</label>
            <textarea className="field" rows={10} value={form.content} onChange={f('content')} placeholder="Write the full article..." />
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
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Posted By</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p._id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-slate-100 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      {p.title}
                      {p.isFeatured && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border uppercase font-medium text-amber-300 bg-amber-500/10 border-amber-500/30">
                          <Star size={9} className="fill-amber-300" /> Featured
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{p.category || '—'}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-slate-300">{p.postedBy?.name}</span>
                    <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full border uppercase font-medium text-emerald-300 bg-emerald-500/10 border-emerald-500/30">{p.postedBy?.role}</span>
                  </td>
                  <td className="py-3 px-4 text-right flex gap-1 justify-end">
                    <button onClick={() => startEdit(p)} className="p-1.5 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {!posts.length && <tr><td colSpan={4} className="py-12 text-center text-slate-500">No blog posts found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
