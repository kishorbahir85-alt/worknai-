import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Plus, Pencil, Trash2, X, Check, Image as ImageIcon, Film, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
const resolveUrl = (url) => (url && !/^https?:\/\//.test(url) ? `${BASE}${url}` : url);
const empty = { title: '', tagline: '', description: '', category: '', url: '', techStack: '', videoUrl: '', features: '', benefits: '', logoUrlText: '', heroImageText: '', heroVideoText: '', overviewImageText: '', benefitsImageText: '' };
const emptyStep = { title: '', description: '' };
const emptyFaq = { question: '', answer: '' };

export default function ManageProducts() {
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
  const [galleryUrlList, setGalleryUrlList] = useState([]);
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState('');
  const [heroVideoFile, setHeroVideoFile] = useState(null);
  const [heroVideoPreview, setHeroVideoPreview] = useState('');
  const [overviewImageFile, setOverviewImageFile] = useState(null);
  const [overviewImagePreview, setOverviewImagePreview] = useState('');
  const [benefitsImageFile, setBenefitsImageFile] = useState(null);
  const [benefitsImagePreview, setBenefitsImagePreview] = useState('');
  const [howItWorks, setHowItWorks] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/products/manage').then(r => setProducts(r.data.data)).finally(() => setLoading(false));
  };
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

  const addGalleryUrl = () => {
    const url = galleryUrlInput.trim();
    if (!url) return;
    setGalleryUrlList((p) => [...p, url]);
    setGalleryUrlInput('');
  };

  const removeGalleryUrl = (idx) => {
    setGalleryUrlList((p) => p.filter((_, i) => i !== idx));
  };

  const handleHeroImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroImageFile(file);
    setHeroImagePreview(URL.createObjectURL(file));
  };

  const handleHeroVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroVideoFile(file);
    setHeroVideoPreview(URL.createObjectURL(file));
  };

  const handleOverviewImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOverviewImageFile(file);
    setOverviewImagePreview(URL.createObjectURL(file));
  };

  const handleBenefitsImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBenefitsImageFile(file);
    setBenefitsImagePreview(URL.createObjectURL(file));
  };

  const addStep = () => setHowItWorks((p) => [...p, { ...emptyStep }]);
  const updateStep = (idx, key, value) => setHowItWorks((p) => p.map((s, i) => (i === idx ? { ...s, [key]: value } : s)));
  const removeStep = (idx) => setHowItWorks((p) => p.filter((_, i) => i !== idx));

  const addFaq = () => setFaqs((p) => [...p, { ...emptyFaq }]);
  const updateFaq = (idx, key, value) => setFaqs((p) => p.map((s, i) => (i === idx ? { ...s, [key]: value } : s)));
  const removeFaq = (idx) => setFaqs((p) => p.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('tagline', form.tagline);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('url', form.url);
      formData.append('techStack', form.techStack);
      formData.append('videoUrl', form.videoUrl);
      formData.append('features', form.features);
      formData.append('benefits', form.benefits);
      formData.append('howItWorks', JSON.stringify(howItWorks.filter((s) => s.title || s.description)));
      formData.append('faqs', JSON.stringify(faqs.filter((f) => f.question || f.answer)));
      if (logoFile) formData.append('logo', logoFile);
      if (form.logoUrlText.trim()) formData.append('logoUrlText', form.logoUrlText.trim());
      galleryFiles.forEach((file) => formData.append('gallery', file));
      if (galleryUrlList.length) formData.append('galleryUrls', galleryUrlList.join(','));
      if (editing && removeGallery.length) formData.append('removeGallery', removeGallery.join(','));
      if (heroImageFile) formData.append('heroImage', heroImageFile);
      if (form.heroImageText.trim()) formData.append('heroImageText', form.heroImageText.trim());
      if (heroVideoFile) formData.append('heroVideo', heroVideoFile);
      if (form.heroVideoText.trim()) formData.append('heroVideoText', form.heroVideoText.trim());
      if (overviewImageFile) formData.append('overviewImage', overviewImageFile);
      if (form.overviewImageText.trim()) formData.append('overviewImageText', form.overviewImageText.trim());
      if (benefitsImageFile) formData.append('benefitsImage', benefitsImageFile);
      if (form.benefitsImageText.trim()) formData.append('benefitsImageText', form.benefitsImageText.trim());

      if (editing) {
        const response = await api.put(`/products/${editing}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setProducts((current) => current.map((product) => (
          product._id === editing
            ? { ...product, ...response.data.data, postedBy: product.postedBy }
            : product
        )));
        toast.success('Product updated');
        cancel();
      } else {
        await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product added');
        cancel();
        load();
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const startEdit = (p) => {
    setForm({
      title: p.title, tagline: p.tagline || '', description: p.description, category: p.category, url: p.url,
      techStack: p.techStack?.join(', ') || '', videoUrl: p.videoUrl || '', features: p.features?.join(', ') || '',
      benefits: p.benefits?.join(', ') || '',
      logoUrlText: '', heroImageText: '', heroVideoText: '', overviewImageText: '', benefitsImageText: '',
    });
    setLogoFile(null);
    setLogoPreview(p.logoUrl ? resolveUrl(p.logoUrl) : '');
    setGalleryFiles([]); setGalleryPreviews([]); setRemoveGallery([]);
    setGalleryUrlList([]); setGalleryUrlInput('');
    setExistingGallery(p.gallery || []);
    setHeroImageFile(null); setHeroImagePreview(p.heroImage ? resolveUrl(p.heroImage) : '');
    setHeroVideoFile(null); setHeroVideoPreview(p.heroVideo ? resolveUrl(p.heroVideo) : '');
    setOverviewImageFile(null); setOverviewImagePreview(p.overviewImage ? resolveUrl(p.overviewImage) : '');
    setBenefitsImageFile(null); setBenefitsImagePreview(p.benefitsImage ? resolveUrl(p.benefitsImage) : '');
    setHowItWorks(p.howItWorks?.length ? p.howItWorks : []);
    setFaqs(p.faqs?.length ? p.faqs : []);
    setEditing(p._id); setShowForm(true); window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts((current) => current.filter((product) => product._id !== id));
      toast.success('Product deleted');
    }
    catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setDeletingId(null); }
  };

  const cancel = () => {
    setForm(empty); setLogoFile(null); setLogoPreview('');
    setGalleryFiles([]); setGalleryPreviews([]); setExistingGallery([]); setRemoveGallery([]);
    setGalleryUrlList([]); setGalleryUrlInput('');
    setHeroImageFile(null); setHeroImagePreview(''); setHeroVideoFile(null); setHeroVideoPreview('');
    setOverviewImageFile(null); setOverviewImagePreview(''); setBenefitsImageFile(null); setBenefitsImagePreview('');
    setHowItWorks([]); setFaqs([]);
    setEditing(null); setShowForm(false);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Manage Products</h1>
          <p className="mt-1 text-slate-400 text-sm">Websites & software products</p>
        </div>
        <button onClick={() => { cancel(); setShowForm(v => !v); }} className="btn-primary">
          {showForm && !editing ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Product</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="panel-card mb-6 grid sm:grid-cols-2 gap-4">
          <h2 className="sm:col-span-2 text-sm font-semibold text-slate-300">{editing ? 'Edit Product' : 'New Product'}</h2>

          <div className="sm:col-span-2 flex items-center gap-4">
            <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
              {logoPreview ? <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" /> : <ImageIcon size={20} className="text-slate-500" />}
            </div>
            <div className="flex-1">
              <label className="field-label">Logo</label>
              <p className="text-xs text-slate-500 mb-2">Shown in the products menu, listings, and beside the product name on the detail page.</p>
              <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" onChange={handleLogoChange} className="text-sm text-slate-300" />
              <input className="field mt-2" value={form.logoUrlText} onChange={f('logoUrlText')} placeholder="or paste image URL (https://...)" />
            </div>
          </div>

          <div className="sm:col-span-2 rounded-xl border border-slate-700 bg-slate-800/40 p-4">
            <label className="field-label flex items-center gap-1.5"><Upload size={13} /> Hero Section</label>
            <p className="text-xs text-slate-500 mb-2">Big banner at the very top of the product's detail page. Video takes priority over image if both are set.</p>
            <div className="grid sm:grid-cols-2 gap-4 mt-2">
              <div>
                <div className="w-full aspect-video rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden mb-2">
                  {heroImagePreview ? <img src={heroImagePreview} alt="Hero image preview" className="w-full h-full object-cover" /> : <ImageIcon size={22} className="text-slate-500" />}
                </div>
                <span className="text-xs text-slate-400 block mb-1">Hero Image</span>
                <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" onChange={handleHeroImageChange} className="text-xs text-slate-300" />
                <input className="field mt-2 !py-2 text-xs" value={form.heroImageText} onChange={f('heroImageText')} placeholder="or paste image URL" />
              </div>
              <div>
                <div className="w-full aspect-video rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden mb-2">
                  {heroVideoPreview ? <video src={heroVideoPreview} controls className="w-full h-full object-cover" /> : <Film size={22} className="text-slate-500" />}
                </div>
                <span className="text-xs text-slate-400 block mb-1">Hero Video</span>
                <input type="file" accept=".mp4,.mov,.webm,.mkv" onChange={handleHeroVideoChange} className="text-xs text-slate-300" />
                <input className="field mt-2 !py-2 text-xs" value={form.heroVideoText} onChange={f('heroVideoText')} placeholder="or paste video URL" />
              </div>
            </div>
          </div>

          <div className="sm:col-span-2 rounded-xl border border-slate-700 bg-slate-800/40 p-4">
            <label className="field-label flex items-center gap-1.5"><ImageIcon size={13} /> Section Images</label>
            <p className="text-xs text-slate-500 mb-2">Images shown beside specific sections on the detail page. Leave blank to auto-use a category-based image.</p>
            <div className="grid sm:grid-cols-2 gap-4 mt-2">
              <div>
                <div className="w-full aspect-video rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden mb-2">
                  {overviewImagePreview ? <img src={overviewImagePreview} alt="Overview image preview" className="w-full h-full object-cover" /> : <ImageIcon size={22} className="text-slate-500" />}
                </div>
                <span className="text-xs text-slate-400 block mb-1">Overview Image <span className="text-slate-500">("What is {'{'}Product{'}'}?" section)</span></span>
                <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" onChange={handleOverviewImageChange} className="text-xs text-slate-300" />
                <input className="field mt-2 !py-2 text-xs" value={form.overviewImageText} onChange={f('overviewImageText')} placeholder="or paste image URL" />
              </div>
              <div>
                <div className="w-full aspect-video rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden mb-2">
                  {benefitsImagePreview ? <img src={benefitsImagePreview} alt="Benefits image preview" className="w-full h-full object-cover" /> : <ImageIcon size={22} className="text-slate-500" />}
                </div>
                <span className="text-xs text-slate-400 block mb-1">Benefits Image <span className="text-slate-500">("Why Choose It" section)</span></span>
                <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" onChange={handleBenefitsImageChange} className="text-xs text-slate-300" />
                <input className="field mt-2 !py-2 text-xs" value={form.benefitsImageText} onChange={f('benefitsImageText')} placeholder="or paste image URL" />
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Product Name *</label>
            <input className="field" value={form.title} onChange={f('title')} placeholder="WorknAi HRMS" required />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Tagline</label>
            <input className="field" value={form.tagline} onChange={f('tagline')} placeholder="Short one-line hook shown in the hero" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Description</label>
            <textarea className="field" rows={3} value={form.description} onChange={f('description')} placeholder="What does this product do..." />
          </div>
          <div>
            <label className="field-label">Category</label>
            <input className="field" value={form.category} onChange={f('category')} placeholder="HRMS / CRM / Website" />
          </div>
          <div>
            <label className="field-label">Website URL</label>
            <input type="url" className="field" value={form.url} onChange={f('url')} placeholder="https://..." />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Tech Stack (comma separated)</label>
            <input className="field" value={form.techStack} onChange={f('techStack')} placeholder="React, Node.js, MongoDB" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Key Features (comma separated)</label>
            <input className="field" value={form.features} onChange={f('features')} placeholder="Real-time booking, Secure payments, 24/7 support" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Benefits (comma separated)</label>
            <input className="field" value={form.benefits} onChange={f('benefits')} placeholder="Saves time, Reduces cost, Scales with your team" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Video URL (YouTube, Vimeo or direct mp4 link)</label>
            <p className="text-xs text-slate-500 mb-2">Shown in the "See It In Action" demo section on the detail page.</p>
            <input className="field" value={form.videoUrl} onChange={f('videoUrl')} placeholder="https://www.youtube.com/watch?v=..." />
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="field-label !mb-0">How It Works (steps)</label>
              <button type="button" onClick={addStep} className="btn-ghost text-xs px-3 py-1.5"><Plus size={12} /> Add Step</button>
            </div>
            <div className="flex flex-col gap-3">
              {howItWorks.map((step, idx) => (
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

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="field-label !mb-0">FAQs</label>
              <button type="button" onClick={addFaq} className="btn-ghost text-xs px-3 py-1.5"><Plus size={12} /> Add FAQ</button>
            </div>
            <div className="flex flex-col gap-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <div className="flex-1 flex flex-col gap-2">
                    <input className="field" value={faq.question} onChange={(e) => updateFaq(idx, 'question', e.target.value)} placeholder="Question" />
                    <textarea className="field" rows={2} value={faq.answer} onChange={(e) => updateFaq(idx, 'answer', e.target.value)} placeholder="Answer" />
                  </div>
                  <button type="button" onClick={() => removeFaq(idx)} className="mt-2.5 p-1.5 text-slate-500 hover:text-red-400 shrink-0"><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Gallery / Screenshots</label>
            <p className="text-xs text-slate-500 mb-2">Shown in the "Screenshots &amp; Dashboard Preview" grid on the detail page. Add up to 8; missing slots auto-fill with category images.</p>
            <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" multiple onChange={handleGalleryChange} className="text-sm text-slate-300" />
            <div className="flex gap-2 mt-2">
              <input
                className="field flex-1"
                value={galleryUrlInput}
                onChange={(e) => setGalleryUrlInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addGalleryUrl(); } }}
                placeholder="Paste an image URL"
              />
              <button type="button" onClick={addGalleryUrl} className="btn-ghost shrink-0"><Plus size={15} /> Add</button>
            </div>
            {(existingGallery.length > 0 || galleryPreviews.length > 0 || galleryUrlList.length > 0) && (
              <div className="flex flex-wrap gap-3 mt-3">
                {existingGallery.map((url) => (
                  <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700">
                    <img src={resolveUrl(url)} alt="Gallery" className={`w-full h-full object-cover ${removeGallery.includes(url) ? 'opacity-30' : ''}`} />
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
                {galleryUrlList.map((url, idx) => (
                  <div key={url + idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700">
                    <img src={resolveUrl(url)} alt="New URL" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeGalleryUrl(idx)} className="absolute top-0.5 right-0.5 bg-slate-900/80 rounded-full p-0.5 text-slate-200 hover:text-red-400">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60"><Check size={15} /> {editing ? 'Update' : 'Add'}</button>
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
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Tech Stack</th>
                <th className="text-left py-3 px-4">Posted By</th>
                <th className="text-left py-3 px-4">URL</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-slate-100 font-medium">{p.title}</td>
                  <td className="py-3 px-4 text-slate-400">{p.category || '—'}</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">{p.techStack?.slice(0,3).join(', ') || '—'}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-slate-300">{p.postedBy?.name}</span>
                    <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full border uppercase font-medium text-emerald-300 bg-emerald-500/10 border-emerald-500/30">{p.postedBy?.role}</span>
                  </td>
                  <td className="py-3 px-4">
                    {p.url ? <a href={p.url} target="_blank" rel="noreferrer" className="text-violet-400 hover:text-violet-300 text-xs truncate max-w-[120px] block">Visit ↗</a> : <span className="text-slate-500">—</span>}
                  </td>
                  <td className="py-3 px-4 text-right flex gap-1 justify-end">
                    <button type="button" onClick={() => startEdit(p)} title={`Edit ${p.title}`} aria-label={`Edit ${p.title}`} className="p-1.5 text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors"><Pencil size={14} /></button>
                    <button type="button" onClick={() => handleDelete(p._id)} disabled={deletingId === p._id} title={`Delete ${p.title}`} aria-label={`Delete ${p.title}`} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {!products.length && <tr><td colSpan={6} className="py-12 text-center text-slate-500">No products found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
