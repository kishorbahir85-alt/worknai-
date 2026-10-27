import { useEffect, useState, useMemo } from 'react';
import api from '../../utils/api';
import ConfirmModal from '../../components/ui/ConfirmModal';
import {
  Plus, Pencil, Trash2, X, Check, Image as ImageIcon, Film, Upload,
  ExternalLink, Search, LayoutGrid, List, Layers, HelpCircle,
  Sparkles, Globe, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

const BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
const resolveUrl = (url) => (url && !/^https?:\/\//.test(url) ? `${BASE}${url}` : url);

const empty = {
  title: '',
  tagline: '',
  description: '',
  category: '',
  url: '',
  techStack: '',
  videoUrl: '',
  features: '',
  benefits: '',
  logoUrlText: '',
  heroImageText: '',
  heroVideoText: '',
  overviewImageText: '',
  benefitsImageText: '',
};
const emptyStep = { title: '', description: '' };
const CATEGORY_GRADIENTS = {
  'blood donation': 'from-rose-500 via-red-500 to-red-600 shadow-red-500/25 text-white',
  'health': 'from-rose-500 via-red-500 to-pink-600 shadow-rose-500/25 text-white',
  'medical': 'from-rose-500 via-red-500 to-red-600 shadow-red-500/25 text-white',
  'automobile': 'from-amber-500 via-orange-500 to-red-500 shadow-orange-500/25 text-white',
  'car rental': 'from-amber-500 via-orange-500 to-amber-600 shadow-amber-500/25 text-white',
  'travel': 'from-sky-400 via-blue-500 to-indigo-600 shadow-sky-500/25 text-white',
  'flight': 'from-sky-400 via-blue-500 to-indigo-600 shadow-sky-500/25 text-white',
  'logistics': 'from-blue-500 via-indigo-600 to-violet-700 shadow-indigo-500/25 text-white',
  'fintech': 'from-emerald-400 via-teal-500 to-emerald-700 shadow-emerald-500/25 text-white',
  'finance': 'from-emerald-400 via-teal-500 to-emerald-700 shadow-emerald-500/25 text-white',
  'saas': 'from-violet-500 via-indigo-600 to-purple-700 shadow-violet-500/25 text-white',
  'crm': 'from-indigo-500 via-blue-600 to-cyan-600 shadow-indigo-500/25 text-white',
  'e-commerce': 'from-amber-400 via-orange-500 to-rose-500 shadow-orange-500/25 text-white',
  'shopping': 'from-amber-400 via-orange-500 to-rose-500 shadow-orange-500/25 text-white',
  'real estate': 'from-purple-500 via-violet-600 to-indigo-700 shadow-purple-500/25 text-white',
  'property': 'from-purple-500 via-violet-600 to-indigo-700 shadow-purple-500/25 text-white',
  'matrimonial': 'from-pink-500 via-rose-500 to-red-500 shadow-pink-500/25 text-white',
  'wedding': 'from-pink-500 via-rose-500 to-red-500 shadow-pink-500/25 text-white',
  'social': 'from-pink-400 via-fuchsia-500 to-purple-600 shadow-fuchsia-500/25 text-white',
  'hrms': 'from-blue-600 via-indigo-600 to-violet-600 shadow-blue-500/25 text-white',
  'hr': 'from-blue-600 via-indigo-600 to-violet-600 shadow-blue-500/25 text-white',
  'consulting': 'from-cyan-500 via-blue-600 to-indigo-700 shadow-cyan-500/25 text-white',
  'education': 'from-blue-500 via-indigo-600 to-violet-600 shadow-blue-500/25 text-white',
  'food': 'from-orange-400 via-amber-500 to-red-500 shadow-orange-500/25 text-white',
};

function getCategoryGradient(category = '') {
  const cat = String(category || '').toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_GRADIENTS)) {
    if (cat.includes(key)) return val;
  }
  return 'from-violet-600 via-indigo-600 to-purple-700 shadow-violet-500/25 text-white';
}

function ProductAvatar({ product, size = 'md', className = '' }) {
  const [imgFailed, setImgFailed] = useState(false);
  const domain = product?.url ? (() => { try { return new URL(product.url).hostname; } catch { return null; } })() : null;
  const logoSrc = !imgFailed && (product?.logoUrl || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null));
  const gradientClass = getCategoryGradient(product?.category || '');

  // Uniform squircle sizing (1:1 aspect ratio, consistent rounded squircle corners)
  const sizeMap = {
    xs: 'w-7 h-7 rounded-[8px] text-[10px]',
    sm: 'w-9 h-9 rounded-[10px] text-xs',
    md: 'w-11 h-11 rounded-[14px] text-sm',
    lg: 'w-14 h-14 rounded-[18px] text-base',
    xl: 'w-16 h-16 rounded-[20px] text-lg',
  };
  const sizeClass = sizeMap[size] || sizeMap.md;

  if (logoSrc) {
    return (
      <div className={`relative shrink-0 aspect-square ${sizeClass} flex items-center justify-center overflow-hidden select-none transition-transform duration-200 group-hover:scale-105 ${className}`}>
        <img
          src={resolveUrl(logoSrc)}
          alt={product?.title || 'Product'}
          className="w-full h-full max-w-full max-h-full object-contain pointer-events-none"
          onError={() => setImgFailed(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`relative shrink-0 aspect-square ${sizeClass} bg-gradient-to-br ${gradientClass} shadow-md flex items-center justify-center font-bold tracking-wider select-none overflow-hidden transition-transform duration-200 group-hover:scale-105 ${className}`}>
      <span className="drop-shadow-sm uppercase">
        {product?.title?.slice(0, 2) || 'PR'}
      </span>
    </div>
  );
}

const CATEGORY_STYLES = {
  'automobile': 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  'fintech': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  'saas': 'bg-violet-500/10 text-violet-300 border-violet-500/30',
  'crm': 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
  'travel': 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  'health': 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  'e-commerce': 'bg-teal-500/10 text-teal-300 border-teal-500/30',
  'consulting': 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  'social': 'bg-pink-500/10 text-pink-300 border-pink-500/30',
  'real estate': 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  'blood donation': 'bg-red-500/10 text-red-300 border-red-500/30',
};

function getCategoryBadgeClass(category = '') {
  const cat = category.toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_STYLES)) {
    if (cat.includes(key)) return val;
  }
  return 'bg-slate-800 text-slate-300 border-slate-700';
}

export default function HRManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

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
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/products/manage')
      .then((r) => setProducts(r.data.data))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;
      const matchesSearch =
        p.title?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.tagline?.toLowerCase().includes(query) ||
        p.techStack?.some((t) => t.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

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
    const raw = galleryUrlInput.trim();
    if (!raw) {
      toast.error('Please enter an image URL first');
      return;
    }
    const splitUrls = raw
      .split(/[\s,]+/)
      .map((u) => u.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);

    if (!splitUrls.length) {
      toast.error('Please enter a valid image URL');
      return;
    }

    let addedCount = 0;
    setGalleryUrlList((prev) => {
      const newUrls = [...prev];
      for (const u of splitUrls) {
        if (!newUrls.includes(u)) {
          newUrls.push(u);
          addedCount++;
        }
      }
      return newUrls;
    });

    setGalleryUrlInput('');
    if (addedCount > 0) {
      toast.success(addedCount === 1 ? 'Image URL added to gallery' : `${addedCount} image URLs added`);
    } else {
      toast('URL already in gallery');
    }
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
  const updateStep = (idx, key, value) =>
    setHowItWorks((p) => p.map((s, i) => (i === idx ? { ...s, [key]: value } : s)));
  const removeStep = (idx) => setHowItWorks((p) => p.filter((_, i) => i !== idx));

  const addFaq = () => setFaqs((p) => [...p, { ...emptyFaq }]);
  const updateFaq = (idx, key, value) =>
    setFaqs((p) => p.map((s, i) => (i === idx ? { ...s, [key]: value } : s)));
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
      const pendingUrl = galleryUrlInput.trim();
      const allGalleryUrls = pendingUrl && !galleryUrlList.includes(pendingUrl)
        ? [...galleryUrlList, pendingUrl]
        : galleryUrlList;
      if (allGalleryUrls.length) formData.append('galleryUrls', allGalleryUrls.join(','));
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
        const response = await api.put(`/products/${editing}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setProducts((current) =>
          current.map((product) =>
            product._id === editing
              ? { ...product, ...response.data.data, postedBy: product.postedBy }
              : product
          )
        );
        toast.success('Product updated successfully');
        cancel();
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product added successfully');
        cancel();
        load();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p) => {
    setForm({
      title: p.title,
      tagline: p.tagline || '',
      description: p.description || '',
      category: p.category || '',
      url: p.url || '',
      techStack: p.techStack?.join(', ') || '',
      videoUrl: p.videoUrl || '',
      features: p.features?.join(', ') || '',
      benefits: p.benefits?.join(', ') || '',
      logoUrlText: '',
      heroImageText: '',
      heroVideoText: '',
      overviewImageText: '',
      benefitsImageText: '',
    });
    setLogoFile(null);
    setLogoPreview(p.logoUrl ? resolveUrl(p.logoUrl) : '');
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setRemoveGallery([]);
    setGalleryUrlList([]);
    setGalleryUrlInput('');
    setExistingGallery(p.gallery || []);
    setHeroImageFile(null);
    setHeroImagePreview(p.heroImage ? resolveUrl(p.heroImage) : '');
    setHeroVideoFile(null);
    setHeroVideoPreview(p.heroVideo ? resolveUrl(p.heroVideo) : '');
    setOverviewImageFile(null);
    setOverviewImagePreview(p.overviewImage ? resolveUrl(p.overviewImage) : '');
    setBenefitsImageFile(null);
    setBenefitsImagePreview(p.benefitsImage ? resolveUrl(p.benefitsImage) : '');
    setHowItWorks(p.howItWorks?.length ? p.howItWorks : []);
    setFaqs(p.faqs?.length ? p.faqs : []);
    setEditing(p._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (target) => {
    const item = target || deleteTarget;
    if (!item) return;
    const id = typeof item === 'object' ? item._id : item;
    setDeletingId(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts((current) => current.filter((product) => product._id !== id));
      toast.success('Product deleted');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting product');
    } finally {
      setDeletingId(null);
    }
  };

  const cancel = () => {
    setForm(empty);
    setLogoFile(null);
    setLogoPreview('');
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setExistingGallery([]);
    setRemoveGallery([]);
    setGalleryUrlList([]);
    setGalleryUrlInput('');
    setHeroImageFile(null);
    setHeroImagePreview('');
    setHeroVideoFile(null);
    setHeroVideoPreview('');
    setOverviewImageFile(null);
    setOverviewImagePreview('');
    setBenefitsImageFile(null);
    setBenefitsImagePreview('');
    setHowItWorks([]);
    setFaqs([]);
    setEditing(null);
    setShowForm(false);
  };

  const cls = 'w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-100 outline-none focus:border-sky-500 transition-colors text-sm';
  const lbl = 'block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider';

  return (
    <section className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-3xl font-bold text-white tracking-tight">Manage Products</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              {products.length} Active
            </span>
          </div>
          <p className="mt-1 text-slate-400 text-sm">
            Live catalog of enterprise websites, SaaS systems, and software platforms
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm) cancel();
            else {
              cancel();
              setShowForm(true);
            }
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-colors shadow-lg shadow-sky-600/20"
        >
          {showForm && !editing ? (
            <>
              <X size={16} /> Cancel
            </>
          ) : (
            <>
              <Plus size={16} /> Add Product
            </>
          )}
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Products</div>
          <div className="text-2xl font-bold text-white mt-1 font-display">{products.length}</div>
          <div className="text-xs text-sky-400 mt-1 flex items-center gap-1">
            <CheckCircle2 size={12} /> All 100% configured
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Live Websites</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 font-display">
            {products.filter((p) => p.url).length}
          </div>
          <div className="text-xs text-emerald-400/80 mt-1 flex items-center gap-1">
            <Globe size={12} /> Active domains online
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Categories</div>
          <div className="text-2xl font-bold text-sky-400 mt-1 font-display">
            {new Set(products.map((p) => p.category).filter(Boolean)).size}
          </div>
          <div className="text-xs text-sky-400/80 mt-1 flex items-center gap-1">
            <Layers size={12} /> Industry verticals
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Visual Assets</div>
          <div className="text-2xl font-bold text-amber-400 mt-1 font-display">
            {products.reduce((sum, p) => sum + (p.gallery?.length || 0), 0)}
          </div>
          <div className="text-xs text-amber-400/80 mt-1 flex items-center gap-1">
            <Sparkles size={12} /> Gallery & Hero images
          </div>
        </div>
      </div>

      {/* Product Form (Create / Edit) */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-sm p-6 mb-8 grid sm:grid-cols-2 gap-5 shadow-2xl">
          <div className="sm:col-span-2 pb-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                {editing ? 'Edit Product Content' : 'Create New Product'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">All updates immediately sync with the public products page</p>
            </div>
            <button type="button" onClick={cancel} className="p-1 text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Logo Section */}
          <div className="sm:col-span-2 flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className={`w-16 h-16 shrink-0 aspect-square rounded-[20px] p-[3px] bg-gradient-to-br ${getCategoryGradient(form.category)} shadow-lg border border-white/20 flex items-center justify-center overflow-hidden`}>
              <div className="w-full h-full rounded-[17px] bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center p-1.5 overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="w-full h-full max-w-full max-h-full object-contain drop-shadow-sm" />
                ) : (
                  <span className="text-white font-bold text-lg uppercase tracking-wider">{form.title?.slice(0, 2) || 'PR'}</span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <label className={lbl}>Product Logo</label>
              <p className="text-xs text-slate-400 mb-2">Shown in navbar, showcase spotlight, and product header.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" onChange={handleLogoChange} className="text-xs text-slate-300" />
                <input className={cls} value={form.logoUrlText} onChange={f('logoUrlText')} placeholder="or paste logo URL (https://...)" />
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="sm:col-span-2 rounded-xl border border-slate-700/60 bg-slate-800/30 p-4">
            <label className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Upload size={14} /> Hero Visual Banner
            </label>
            <p className="text-xs text-slate-400 mb-3">Top visual banner shown on the product detail page. Video takes priority over image if provided.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="w-full aspect-video rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden mb-2">
                  {heroImagePreview ? (
                    <img src={heroImagePreview} alt="Hero preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={22} className="text-slate-500" />
                  )}
                </div>
                <span className="text-xs text-slate-300 block mb-1">Hero Image</span>
                <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" onChange={handleHeroImageChange} className="text-xs text-slate-300 mb-2" />
                <input className={cls} value={form.heroImageText} onChange={f('heroImageText')} placeholder="or paste hero image URL" />
              </div>
              <div>
                <div className="w-full aspect-video rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden mb-2">
                  {heroVideoPreview ? (
                    <video src={heroVideoPreview} controls className="w-full h-full object-cover" />
                  ) : (
                    <Film size={22} className="text-slate-500" />
                  )}
                </div>
                <span className="text-xs text-slate-300 block mb-1">Hero Video</span>
                <input type="file" accept=".mp4,.mov,.webm,.mkv" onChange={handleHeroVideoChange} className="text-xs text-slate-300 mb-2" />
                <input className={cls} value={form.heroVideoText} onChange={f('heroVideoText')} placeholder="or paste video URL" />
              </div>
            </div>
          </div>

          {/* Section Images */}
          <div className="sm:col-span-2 rounded-xl border border-slate-700/60 bg-slate-800/30 p-4">
            <label className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <ImageIcon size={14} /> Section Showcase Images
            </label>
            <p className="text-xs text-slate-400 mb-3">Custom images for the "What is Product?" and "Why Choose It" sections.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="w-full aspect-video rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden mb-2">
                  {overviewImagePreview ? (
                    <img src={overviewImagePreview} alt="Overview preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={22} className="text-slate-500" />
                  )}
                </div>
                <span className="text-xs text-slate-300 block mb-1">Overview Image ("What is {form.title || 'Product'}?")</span>
                <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" onChange={handleOverviewImageChange} className="text-xs text-slate-300 mb-2" />
                <input className={cls} value={form.overviewImageText} onChange={f('overviewImageText')} placeholder="or paste overview image URL" />
              </div>
              <div>
                <div className="w-full aspect-video rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden mb-2">
                  {benefitsImagePreview ? (
                    <img src={benefitsImagePreview} alt="Benefits preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={22} className="text-slate-500" />
                  )}
                </div>
                <span className="text-xs text-slate-300 block mb-1">Benefits Image ("Why Choose It")</span>
                <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" onChange={handleBenefitsImageChange} className="text-xs text-slate-300 mb-2" />
                <input className={cls} value={form.benefitsImageText} onChange={f('benefitsImageText')} placeholder="or paste benefits image URL" />
              </div>
            </div>
          </div>

          <div>
            <label className={lbl}>Product Name *</label>
            <input className={cls} value={form.title} onChange={f('title')} placeholder="WorknAi HRMS" required />
          </div>
          <div>
            <label className={lbl}>Category</label>
            <input className={cls} value={form.category} onChange={f('category')} placeholder="HRMS / CRM / Website" />
          </div>

          <div className="sm:col-span-2">
            <label className={lbl}>Tagline</label>
            <input className={cls} value={form.tagline} onChange={f('tagline')} placeholder="Short one-line hook shown in the hero" />
          </div>

          <div className="sm:col-span-2">
            <label className={lbl}>Description</label>
            <textarea className={cls} rows={3} value={form.description} onChange={f('description')} placeholder="What does this product do..." />
          </div>

          <div>
            <label className={lbl}>Website URL</label>
            <input type="url" className={cls} value={form.url} onChange={f('url')} placeholder="https://..." />
          </div>
          <div>
            <label className={lbl}>Video URL (YouTube, Vimeo, mp4)</label>
            <input className={cls} value={form.videoUrl} onChange={f('videoUrl')} placeholder="https://www.youtube.com/watch?v=..." />
          </div>

          <div className="sm:col-span-2">
            <label className={lbl}>Tech Stack (comma separated)</label>
            <input className={cls} value={form.techStack} onChange={f('techStack')} placeholder="React, Node.js, MongoDB" />
          </div>

          <div className="sm:col-span-2">
            <label className={lbl}>Key Features (comma separated)</label>
            <input className={cls} value={form.features} onChange={f('features')} placeholder="Real-time booking, Secure payments, 24/7 support" />
          </div>

          <div className="sm:col-span-2">
            <label className={lbl}>Benefits (comma separated)</label>
            <input className={cls} value={form.benefits} onChange={f('benefits')} placeholder="Saves time, Reduces cost, Scales with your team" />
          </div>

          {/* How It Works */}
          <div className="sm:col-span-2 p-4 rounded-xl border border-slate-700/60 bg-slate-800/30">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={14} /> How It Works (steps)
              </label>
              <button type="button" onClick={addStep} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-sky-600/20 text-sky-300 border border-sky-500/30 hover:bg-sky-600/30 text-xs">
                <Plus size={12} /> Add Step
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {howItWorks.map((step, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="mt-3 text-xs text-sky-400 font-bold w-6 shrink-0 text-center">{idx + 1}.</span>
                  <div className="flex-1 grid sm:grid-cols-2 gap-2">
                    <input className={cls} value={step.title} onChange={(e) => updateStep(idx, 'title', e.target.value)} placeholder="Step title" />
                    <input className={cls} value={step.description} onChange={(e) => updateStep(idx, 'description', e.target.value)} placeholder="Step description" />
                  </div>
                  <button type="button" onClick={() => removeStep(idx)} className="mt-2.5 p-1.5 text-slate-500 hover:text-red-400 shrink-0">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="sm:col-span-2 p-4 rounded-xl border border-slate-700/60 bg-slate-800/30">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle size={14} /> FAQs
              </label>
              <button type="button" onClick={addFaq} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-sky-600/20 text-sky-300 border border-sky-500/30 hover:bg-sky-600/30 text-xs">
                <Plus size={12} /> Add FAQ
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <div className="flex-1 flex flex-col gap-2">
                    <input className={cls} value={faq.question} onChange={(e) => updateFaq(idx, 'question', e.target.value)} placeholder="Question" />
                    <textarea className={cls} rows={2} value={faq.answer} onChange={(e) => updateFaq(idx, 'answer', e.target.value)} placeholder="Answer" />
                  </div>
                  <button type="button" onClick={() => removeFaq(idx)} className="mt-2.5 p-1.5 text-slate-500 hover:text-red-400 shrink-0">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery */}
          <div className="sm:col-span-2 p-4 rounded-xl border border-slate-700/60 bg-slate-800/30">
            <label className={lbl}>Gallery / Screenshots</label>
            <p className="text-xs text-slate-400 mb-2">High-resolution showcase images displayed on the product page.</p>
            <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" multiple onChange={handleGalleryChange} className="text-sm text-slate-300" />
            <div className="flex gap-2 mt-3">
              <input
                className={cls}
                value={galleryUrlInput}
                onChange={(e) => setGalleryUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addGalleryUrl();
                  }
                }}
                placeholder="Paste an image URL (e.g. https://... or /uploads/...) and click Add"
              />
              <button
                type="button"
                onClick={addGalleryUrl}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-medium text-xs transition-all shrink-0 cursor-pointer shadow-md shadow-sky-900/20"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {(existingGallery.length > 0 || galleryPreviews.length > 0 || galleryUrlList.length > 0) && (
              <div className="flex flex-wrap gap-3 mt-3">
                {existingGallery.map((url) => (
                  <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center">
                    <img src={resolveUrl(url)} alt="Gallery" className={`w-full h-full object-cover ${removeGallery.includes(url) ? 'opacity-30' : ''}`} />
                    <button type="button" onClick={() => toggleRemoveExisting(url)} className="absolute top-0.5 right-0.5 bg-slate-900/80 rounded-full p-0.5 text-slate-200 hover:text-red-400 cursor-pointer">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {galleryPreviews.map((src, idx) => (
                  <div key={src} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center">
                    <img src={src} alt="New upload" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewGalleryFile(idx)} className="absolute top-0.5 right-0.5 bg-slate-900/80 rounded-full p-0.5 text-slate-200 hover:text-red-400 cursor-pointer">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {galleryUrlList.map((url, idx) => (
                  <div key={url + idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center">
                    <img
                      src={resolveUrl(url)}
                      alt="New URL"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.parentElement.querySelector('.gallery-fallback');
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="gallery-fallback hidden absolute inset-0 text-[10px] text-slate-400 p-1 text-center items-center justify-center bg-slate-850 break-all leading-tight">
                      URL preview
                    </div>
                    <button type="button" onClick={() => removeGalleryUrl(idx)} className="absolute top-0.5 right-0.5 bg-slate-900/80 rounded-full p-0.5 text-slate-200 hover:text-red-400 cursor-pointer">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sm:col-span-2 flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-white font-medium text-sm transition-colors shadow-lg shadow-sky-600/20">
              <Check size={15} /> {editing ? 'Update Product' : 'Add Product'}
            </button>
            <button type="button" onClick={cancel} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white font-medium text-sm transition-colors">
              <X size={15} /> Cancel
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title, tagline, category, tech..."
            className="w-full pl-10 pr-8 py-2 rounded-xl bg-slate-800/60 border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Pills & View Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
            {categories.length > 5 && (
              <select
                value={categories.slice(0, 5).includes(selectedCategory) ? '' : selectedCategory}
                onChange={(e) => e.target.value && setSelectedCategory(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 text-slate-400 border border-slate-700 outline-none"
              >
                <option value="">More...</option>
                {categories.slice(5).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="h-6 w-px bg-slate-800 shrink-0 mx-1" />

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-800/80 border border-slate-700/80 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid Cards View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Rendering (Grid or Table) */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 text-center py-16">
          <p className="text-slate-400 text-sm">No products found matching your search</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-3 text-xs text-sky-400 hover:underline font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* ============ GRID CARDS VIEW ============ */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProducts.map((p) => {
            const previewImg = p.heroImage || p.overviewImage || (p.gallery && p.gallery[0]) || '';
            return (
              <div
                key={p._id}
                className="group relative rounded-2xl border border-slate-800/80 bg-slate-900/70 hover:border-sky-500/50 hover:bg-slate-900 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-sky-950/20"
              >
                {/* Card Banner */}
                <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden border-b border-slate-800/80">
                  {previewImg ? (
                    <img
                      src={resolveUrl(previewImg)}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900">
                      <ImageIcon size={32} className="text-slate-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                  {/* Category Chip in Top Left */}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border backdrop-blur-md whitespace-nowrap shadow-sm ${getCategoryBadgeClass(
                      p.category
                    )}`}
                  >
                    {p.category || 'Platform'}
                  </span>

                  {/* Live Status Badge in Top Right */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-medium backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </div>

                  {/* Floating Logo Avatar */}
                  <div className="absolute -bottom-3 left-4">
                    <ProductAvatar product={p} size="md" />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 pt-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-display text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                        {p.title}
                      </h3>
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          title="Open live website"
                          className="text-slate-400 hover:text-sky-400 p-1 transition-colors"
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {p.tagline || p.description}
                    </p>

                    {/* Tech Stack Chips */}
                    {p.techStack && p.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.techStack.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
                          >
                            {t}
                          </span>
                        ))}
                        {p.techStack.length > 3 && (
                          <span className="text-[10px] text-slate-500 self-center">
                            +{p.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content Health & Action Footer */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{p.gallery?.length || 0} pics</span>
                      <span className="text-slate-600">•</span>
                      <span>{p.faqs?.length || 0} FAQs</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-600/20 text-sky-300 hover:bg-sky-600/30 border border-sky-500/30 text-xs font-medium transition-colors"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(p)}
                        disabled={deletingId === p._id}
                        className="p-1.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                        title="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ============ TABLE VIEW ============ */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-x-auto shadow-xl">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider bg-slate-950/60">
                <th className="py-3.5 px-4 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Tech Stack</th>
                <th className="py-3.5 px-4 font-semibold">Content</th>
                <th className="py-3.5 px-4 font-semibold">Live URL</th>
                <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Product Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <ProductAvatar product={p} size="md" />
                      <div className="min-w-0">
                        <div className="text-slate-100 font-semibold text-sm">{p.title}</div>
                        {p.tagline && (
                          <div className="text-slate-400 text-xs truncate max-w-xs">{p.tagline}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getCategoryBadgeClass(
                        p.category
                      )}`}
                    >
                      {p.category || 'General'}
                    </span>
                  </td>

                  {/* Tech Stack */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {p.techStack && p.techStack.length > 0 ? (
                        p.techStack.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                          >
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 text-xs">—</span>
                      )}
                      {p.techStack && p.techStack.length > 3 && (
                        <span className="text-[10px] text-slate-500">+{p.techStack.length - 3}</span>
                      )}
                    </div>
                  </td>

                  {/* Content Health */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <span className={`w-2 h-2 rounded-full ${p.heroImage ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <span>{p.gallery?.length || 0} pics</span>
                      <span className="text-slate-600">•</span>
                      <span>{p.faqs?.length || 0} FAQs</span>
                    </div>
                  </td>

                  {/* URL */}
                  <td className="py-3 px-4">
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 text-xs font-medium"
                      >
                        Visit <ExternalLink size={11} />
                      </a>
                    ) : (
                      <span className="text-slate-500 text-xs">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        title={`Edit ${p.title}`}
                        className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(p)}
                        disabled={deletingId === p._id}
                        title={`Delete ${p.title}`}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-40"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.title || 'this product'}"? This action cannot be undone.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        loading={deletingId === deleteTarget?._id}
      />
    </section>
  );
}
