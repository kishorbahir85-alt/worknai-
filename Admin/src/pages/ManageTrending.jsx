import { useEffect, useState } from 'react';
import api from '../utils/api';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, Pencil, Trash2, X, Check, Star, TrendingUp, Award, Lightbulb, Compass } from 'lucide-react';
import toast from 'react-hot-toast';

const empty = {
  title: '',
  slug: '',
  type: 'success-story',
  category: '',
  summary: '',
  clientName: '',
  challenge: '',
  solution: '',
  results: '',
  stat1Label: '',
  stat1Val: '',
  stat2Label: '',
  stat2Val: '',
  stat3Label: '',
  stat3Val: '',
  tags: '',
  isFeatured: false,
};

export default function ManageTrending() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/trending')
      .then((r) => setItems(r.data.data || []))
      .catch(() => toast.error('Failed to load trending items'))
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
        title: form.title,
        slug: form.slug,
        type: form.type,
        category: form.category,
        summary: form.summary,
        clientName: form.clientName,
        challenge: form.challenge,
        solution: form.solution,
        results: typeof form.results === 'string' ? form.results.split('\n').map(s => s.trim()).filter(Boolean) : form.results,
        tags: typeof form.tags === 'string' ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : form.tags,
        metrics: {
          stat1: { label: form.stat1Label, value: form.stat1Val },
          stat2: { label: form.stat2Label, value: form.stat2Val },
          stat3: { label: form.stat3Label, value: form.stat3Val },
        },
        isFeatured: form.isFeatured,
      };

      if (editing) {
        await api.put(`/trending/${editing}`, payload);
        toast.success('Case study / topic updated');
      } else {
        await api.post('/trending', payload);
        toast.success('Case study / topic created');
      }
      cancel();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving topic');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (tr) => {
    setForm({
      title: tr.title || '',
      slug: tr.slug || '',
      type: tr.type || 'success-story',
      category: tr.category || '',
      summary: tr.summary || '',
      clientName: tr.clientName || '',
      challenge: tr.challenge || '',
      solution: tr.solution || '',
      results: Array.isArray(tr.results) ? tr.results.join('\n') : '',
      stat1Label: tr.metrics?.stat1?.label || '',
      stat1Val: tr.metrics?.stat1?.value || '',
      stat2Label: tr.metrics?.stat2?.label || '',
      stat2Val: tr.metrics?.stat2?.value || '',
      stat3Label: tr.metrics?.stat3?.label || '',
      stat3Val: tr.metrics?.stat3?.value || '',
      tags: Array.isArray(tr.tags) ? tr.tags.join(', ') : '',
      isFeatured: tr.isFeatured || false,
    });
    setEditing(tr._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (target) => {
    const item = target || deleteTarget;
    if (!item) return;
    const id = typeof item === 'object' ? item._id : item;
    setDeleting(true);
    try {
      await api.delete(`/trending/${id}`);
      toast.success('Topic deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting topic');
    } finally {
      setDeleting(false);
    }
  };

  const cancel = () => {
    setForm(empty);
    setEditing(null);
    setShowForm(false);
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'success-story':
        return <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium">Success Story</span>;
      case 'case-study':
        return <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 font-medium">Case Study</span>;
      case 'innovation':
        return <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-medium">Innovation</span>;
      case 'our-approach':
        return <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium">Our Approach</span>;
      default:
        return <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{type}</span>;
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Manage Trending Topics & Case Studies</h1>
          <p className="mt-1 text-slate-400 text-sm">Case studies, enterprise client success stories, innovation spotlights, and methodology</p>
        </div>
        <button
          onClick={() => {
            cancel();
            setShowForm((v) => !v);
          }}
          className="btn-primary"
        >
          {showForm && !editing ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Topic / Case Study</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="panel-card mb-6 grid sm:grid-cols-2 gap-4">
          <h2 className="sm:col-span-2 text-sm font-semibold text-slate-300">
            {editing ? 'Edit Topic / Case Study' : 'New Topic / Case Study'}
          </h2>

          <div className="sm:col-span-2">
            <label className="field-label">Title *</label>
            <input className="field" value={form.title} onChange={f('title')} placeholder="e.g. Reducing Fleet Idle Time by 42% for TransGlobal Freight" required />
          </div>

          <div>
            <label className="field-label">Content Type *</label>
            <select className="field" value={form.type} onChange={f('type')}>
              <option value="success-story">Success Story</option>
              <option value="case-study">Case Study</option>
              <option value="innovation">Innovation Spotlight</option>
              <option value="our-approach">Our Engineering Approach</option>
            </select>
          </div>

          <div>
            <label className="field-label">Category</label>
            <input className="field" value={form.category} onChange={f('category')} placeholder="Logistics Optimization, Computer Vision, Cloud" />
          </div>

          <div>
            <label className="field-label">Client / Partner Name</label>
            <input className="field" value={form.clientName} onChange={f('clientName')} placeholder="e.g. TransGlobal Freight Corp" />
          </div>

          <div>
            <label className="field-label">Tags (comma separated)</label>
            <input className="field" value={form.tags} onChange={f('tags')} placeholder="ai, logistics, casestudy, optimization" />
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Executive Summary</label>
            <textarea className="field" rows={2} value={form.summary} onChange={f('summary')} placeholder="High-level narrative overview of results achieved" />
          </div>

          <div>
            <label className="field-label">Business Challenge</label>
            <textarea className="field" rows={3} value={form.challenge} onChange={f('challenge')} placeholder="What bottlenecks or issues did the client face?" />
          </div>

          <div>
            <label className="field-label">Engineered Solution</label>
            <textarea className="field" rows={3} value={form.solution} onChange={f('solution')} placeholder="How WorknAi solved it with custom tech" />
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Measurable Results (One per line)</label>
            <textarea className="field" rows={3} value={form.results} onChange={f('results')} placeholder="42% reduction in gate wait times&#10;$1.2M saved in first year&#10;99.4% on-time dispatch rate" />
          </div>

          <div className="sm:col-span-2">
            <label className="field-label font-medium text-slate-200">Key Performance Metric Badges</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1.5">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 block mb-1">Metric 1</span>
                <input className="field mb-2" value={form.stat1Label} onChange={f('stat1Label')} placeholder="Label (e.g. Fuel Savings)" />
                <input className="field" value={form.stat1Val} onChange={f('stat1Val')} placeholder="Value (e.g. 28%)" />
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 block mb-1">Metric 2</span>
                <input className="field mb-2" value={form.stat2Label} onChange={f('stat2Label')} placeholder="Label (e.g. Idle Reduction)" />
                <input className="field" value={form.stat2Val} onChange={f('stat2Val')} placeholder="Value (e.g. 42%)" />
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 block mb-1">Metric 3</span>
                <input className="field mb-2" value={form.stat3Label} onChange={f('stat3Label')} placeholder="Label (e.g. ROI Payback)" />
                <input className="field" value={form.stat3Val} onChange={f('stat3Val')} placeholder="Value (e.g. 4.5 Months)" />
              </div>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-center gap-2 pt-2">
            <input
              id="isFeatured"
              type="checkbox"
              checked={form.isFeatured}
              onChange={toggleFeatured}
              className="w-4 h-4 rounded border-slate-600 accent-violet-500"
            />
            <label htmlFor="isFeatured" className="text-sm text-slate-300 cursor-pointer">
              Feature in Homepage Hero & Trending Spotlight
            </label>
          </div>

          <div className="sm:col-span-2 flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              <Check size={15} /> {editing ? 'Update Item' : 'Create Item'}
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
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Category / Client</th>
                <th className="text-left py-3 px-4">Key Metrics</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((tr) => (
                <tr key={tr._id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-slate-100 font-medium max-w-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{tr.title}</span>
                      {tr.isFeatured && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border uppercase font-medium text-amber-300 bg-amber-500/10 border-amber-500/30">
                          <Star size={9} className="fill-amber-300" /> Featured
                        </span>
                      )}
                    </div>
                    {tr.summary && <p className="text-xs text-slate-400 mt-0.5 truncate">{tr.summary}</p>}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getTypeBadge(tr.type)}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    <div>{tr.category || 'General'}</div>
                    {tr.clientName && <div className="text-xs text-slate-500">{tr.clientName}</div>}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {tr.metrics?.stat1?.value && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded font-mono">
                          {tr.metrics.stat1.value} {tr.metrics.stat1.label}
                        </span>
                      )}
                      {tr.metrics?.stat2?.value && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded font-mono">
                          {tr.metrics.stat2.value} {tr.metrics.stat2.label}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => startEdit(tr)}
                        className="p-1.5 text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(tr)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No trending case studies found. Click "Add Topic / Case Study" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Topic"
        message={`Are you sure you want to delete "${deleteTarget?.title || 'this item'}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </section>
  );
}
