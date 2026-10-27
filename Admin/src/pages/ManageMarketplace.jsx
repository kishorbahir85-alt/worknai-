import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ConfirmModal from '../components/ConfirmModal';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Star,
  ExternalLink,
  Cpu,
  ShoppingBag,
  ShieldCheck,
  AlertCircle,
  Layers,
  Sparkles,
  Link2,
  Zap,
  Loader2,
  ArrowRight,
  RefreshCw,
  Image as ImageIcon,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';

const BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
const resolveUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//.test(url)) return url;
  if (url.startsWith('/emarket/')) return `${BASE}${url}`;
  return `${BASE}${url}`;
};

const empty = {
  title: '',
  slug: '',
  brand: '',
  category: 'Robotics',
  subcategory: '',
  tagline: '',
  description: '',
  image: '',
  price: '',
  currency: 'INR',
  source: 'Manufacturer Official',
  sourceType: 'manufacturer',
  sourceProductUrl: '',
  buyUrl: '',
  releaseDate: '',
  verificationStatus: 'verified',
  specificationsText: '',
  featuresText: '',
  isFeatured: true,
};

export default function ManageMarketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAutoImportModal, setShowAutoImportModal] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importProgress, setImportProgress] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const load = () => {
    setLoading(true);
    api.get('/emarket/admin/all')
      .then((r) => setProducts(r.data.data || []))
      .catch(() => {
        // Fallback if admin/all fails
        api.get('/emarket')
          .then((r) => setProducts(r.data.data || []))
          .catch(() => toast.error('Failed to load marketplace products'));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter((p) => (p.category || '').toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.brand || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q) ||
          (p.subcategory || '').toLowerCase().includes(q) ||
          (p.tagline || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [products, selectedCategory, searchQuery]);

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const toggleBool = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.checked }));

  // Automated 1-Click Instant URL Import
  const handleInstantAutoImport = async (targetUrl = importUrl) => {
    const url = (targetUrl || '').trim();
    if (!url || !/^https?:\/\//i.test(url)) {
      toast.error('Please enter a valid HTTP or HTTPS product URL');
      return;
    }

    setImportLoading(true);
    setImportProgress('🌐 Connecting to official manufacturer page...');
    try {
      setTimeout(() => setImportProgress('📸 Extracting specs & downloading official high-res media...'), 1200);
      setTimeout(() => setImportProgress('💰 Converting price to INR (₹) & categorizing...'), 2400);

      const res = await api.post('/emarket/auto-import', { url });
      if (res.data.success) {
        toast.success(res.data.message || `Imported ${res.data.data?.title || 'Product'} successfully!`, {
          duration: 6000,
          icon: '🚀',
        });
        setImportUrl('');
        setShowAutoImportModal(false);
        await load();
        setTimeout(() => window.scrollTo({ top: 350, behavior: 'smooth' }), 300);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to auto-import product from URL');
    } finally {
      setImportLoading(false);
      setImportProgress('');
    }
  };

  // Scrape URL & Open in Edit Form for Review
  const handlePreviewScrape = async () => {
    const url = (importUrl || '').trim();
    if (!url || !/^https?:\/\//i.test(url)) {
      toast.error('Please enter a valid HTTP or HTTPS product URL');
      return;
    }

    setImportLoading(true);
    setImportProgress('🔍 Scraping official metadata & images...');
    try {
      const res = await api.post('/emarket/scrape-url', { url });
      if (res.data.success && res.data.data) {
        const p = res.data.data;
        setForm({
          title: p.title || '',
          slug: p.slug || '',
          brand: p.brand || '',
          category: p.category || 'Robotics',
          subcategory: p.subcategory || '',
          tagline: p.tagline || '',
          description: p.description || '',
          image: p.image || '',
          price: p.price !== null && p.price !== undefined ? p.price : '',
          currency: p.currency || 'INR',
          source: p.source || 'Manufacturer Official',
          sourceType: p.sourceType || 'manufacturer',
          sourceProductUrl: p.sourceProductUrl || url,
          buyUrl: p.buyUrl || url,
          releaseDate: p.releaseDate ? new Date(p.releaseDate).toISOString().split('T')[0] : '',
          verificationStatus: p.verificationStatus || 'verified',
          specificationsText: p.specifications?.map((s) => `${s.key}: ${s.value}`).join('\n') || '',
          featuresText: p.features?.join('\n') || '',
          isFeatured: p.isFeatured ?? true,
        });
        setEditing(null);
        setShowAutoImportModal(false);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.success('Extracted official product data! Review and click Save.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to extract product data from URL');
    } finally {
      setImportLoading(false);
      setImportProgress('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Parse specifications from multiline text "Key: Value"
      const specs = form.specificationsText
        ? form.specificationsText
            .split('\n')
            .map((line) => {
              const parts = line.split(':');
              if (parts.length >= 2) {
                return { key: parts[0].trim(), value: parts.slice(1).join(':').trim() };
              }
              return null;
            })
            .filter(Boolean)
        : [];

      // Parse features from lines
      const features = form.featuresText
        ? form.featuresText.split('\n').map((l) => l.trim()).filter(Boolean)
        : [];

      const payload = {
        title: form.title,
        slug: form.slug,
        brand: form.brand,
        category: form.category,
        subcategory: form.subcategory,
        tagline: form.tagline,
        description: form.description,
        image: form.image,
        price: form.price !== '' ? Number(form.price) : null,
        currency: form.currency,
        source: form.source,
        sourceType: form.sourceType,
        sourceProductUrl: form.sourceProductUrl || form.buyUrl || 'https://example.com',
        buyUrl: form.buyUrl,
        releaseDate: form.releaseDate ? new Date(form.releaseDate) : null,
        verificationStatus: form.verificationStatus,
        specifications: specs,
        features: features,
        isFeatured: form.isFeatured,
      };

      if (editing) {
        await api.put(`/emarket/${editing}`, payload);
        toast.success('Marketplace product updated');
      } else {
        await api.post('/emarket', payload);
        toast.success('Marketplace product added');
      }
      cancel();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p) => {
    setForm({
      title: p.title || '',
      slug: p.slug || '',
      brand: p.brand || '',
      category: p.category || 'Robotics',
      subcategory: p.subcategory || '',
      tagline: p.tagline || '',
      description: p.description || '',
      image: p.image || '',
      price: p.price !== null && p.price !== undefined ? p.price : '',
      currency: p.currency || 'INR',
      source: p.source || 'Manufacturer Official',
      sourceType: p.sourceType || 'manufacturer',
      sourceProductUrl: p.sourceProductUrl || '',
      buyUrl: p.buyUrl || '',
      releaseDate: p.releaseDate ? new Date(p.releaseDate).toISOString().split('T')[0] : '',
      verificationStatus: p.verificationStatus || 'verified',
      specificationsText: p.specifications?.map((s) => `${s.key}: ${s.value}`).join('\n') || '',
      featuresText: p.features?.join('\n') || '',
      isFeatured: p.isFeatured || false,
    });
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
      await api.delete(`/emarket/${id}`);
      toast.success('Marketplace product deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting product');
    } finally {
      setDeleting(false);
    }
  };

  const toggleVerificationStatus = async (product) => {
    const nextStatus = product.verificationStatus === 'verified' ? 'needs_review' : 'verified';
    try {
      await api.put(`/emarket/${product._id}`, { verificationStatus: nextStatus });
      toast.success(`Product marked as ${nextStatus}`);
      load();
    } catch {
      toast.error('Failed to update verification status');
    }
  };

  const cancel = () => {
    setForm(empty);
    setEditing(null);
    setShowForm(false);
  };

  return (
    <section className="space-y-6">
      {/* Catalog Category Switcher Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-[#0f111e] border border-zinc-800/80 rounded-2xl w-fit shadow-md">
        <Link
          to="/products"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all"
        >
          <Layers size={14} /> WorknAi Software Catalog
        </Link>
        <Link
          to="/marketplace"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white shadow-lg shadow-violet-600/30 border border-violet-500"
        >
          <ShoppingBag size={14} /> Hardware Marketplace
        </Link>
      </div>

      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white flex items-center gap-3 tracking-tight">
            Manage Hardware Marketplace
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
              {filteredProducts.length} Products {searchQuery || selectedCategory !== 'all' ? `(of ${products.length})` : ''}
            </span>
          </h1>
          <p className="mt-1 text-zinc-400 text-xs sm:text-sm font-normal">
            Real physical technology products, verified hardware, robotics, and edge AI compute
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Automatic URL Ingestion Button */}
          <button
            onClick={() => setShowAutoImportModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500/20 via-violet-600/25 to-purple-600/25 text-amber-300 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/30 transition-all shadow-lg shadow-amber-500/10"
          >
            <Zap size={15} className="text-amber-400 fill-amber-400" />
            <span>Auto-Import from URL</span>
          </button>

          <button
            onClick={() => {
              cancel();
              setShowForm((v) => !v);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-600/30 border border-violet-500"
          >
            {showForm && !editing ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Hardware</>}
          </button>
        </div>
      </div>

      {/* Auto-Import by URL Quick Bar / Modal */}
      {showAutoImportModal && (
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-amber-500/30 shadow-2xl relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Zap size={20} className="fill-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Auto-Import Product from Any URL</h2>
                <p className="text-xs text-slate-400">
                  Paste official product link (Unitree, Apple, DJI, Raspberry Pi, NVIDIA, Meta, Robu, etc.). We'll extract details, official images, and INR price automatically!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAutoImportModal(false)}
              className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Link2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="url"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleInstantAutoImport();
                  }}
                  placeholder="Paste product URL (e.g. https://www.unitree.com/g1 or https://www.raspberrypi.com/products/ai-camera/)"
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-500/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all font-mono"
                  disabled={importLoading}
                />
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleInstantAutoImport()}
                  disabled={importLoading || !importUrl.trim()}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-50 transition-all shadow-md shadow-amber-500/20"
                >
                  {importLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={16} className="fill-slate-950" />
                      <span>Instant 1-Click Import</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePreviewScrape}
                  disabled={importLoading || !importUrl.trim()}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-50 transition-colors"
                >
                  <span>Preview & Edit</span>
                </button>
              </div>
            </div>

            {/* Live Progress feedback */}
            {importLoading && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-xs text-amber-300 animate-pulse">
                <Loader2 size={15} className="animate-spin text-amber-400 shrink-0" />
                <span>{importProgress || 'Scraping and analyzing official product metadata...'}</span>
              </div>
            )}

            {/* Quick Example Links */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Quick Test URLs:</span>
              <button
                type="button"
                onClick={() => {
                  setImportUrl('https://www.unitree.com/g1');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                Unitree G1 Robot
              </button>
              <button
                type="button"
                onClick={() => {
                  setImportUrl('https://www.raspberrypi.com/products/ai-camera/');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                Raspberry Pi AI Camera
              </button>
              <button
                type="button"
                onClick={() => {
                  setImportUrl('https://www.apple.com/apple-vision-pro/');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                Apple Vision Pro
              </button>
              <button
                type="button"
                onClick={() => {
                  setImportUrl('https://www.meta.com/quest/quest-3/');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                Meta Quest 3
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hardware Product Manual / Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="panel-card mb-6 grid sm:grid-cols-2 gap-4">
          <h2 className="sm:col-span-2 text-sm font-semibold text-slate-300 flex items-center justify-between">
            <span>{editing ? 'Edit Hardware Product' : 'Add / Review Hardware Product'}</span>
            {form.image && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-normal">
                <Check size={14} /> Official Image Attached
              </span>
            )}
          </h2>

          <div>
            <label className="field-label">Product Name *</label>
            <input className="field" value={form.title} onChange={f('title')} placeholder="e.g. NVIDIA Jetson Orin Nano Developer Kit" required />
          </div>

          <div>
            <label className="field-label">Manufacturer Brand *</label>
            <input className="field" value={form.brand} onChange={f('brand')} placeholder="e.g. NVIDIA, Raspberry Pi, Arduino, Unitree" required />
          </div>

          <div>
            <label className="field-label">Hardware Category *</label>
            <select className="field" value={form.category} onChange={f('category')}>
              <option value="Robotics">Robotics</option>
              <option value="AI Hardware">AI Hardware</option>
              <option value="Development Boards">Development Boards</option>
              <option value="Everyday AI">Everyday AI</option>
              <option value="Smart Home">Smart Home</option>
              <option value="IoT & Wireless">IoT & Wireless</option>
              <option value="Electronics & Components">Electronics & Components</option>
              <option value="Computing">Computing</option>
              <option value="Maker / DIY">Maker / DIY</option>
              <option value="Tools & Lab">Tools & Lab</option>
            </select>
          </div>

          <div>
            <label className="field-label">Subcategory</label>
            <input className="field" value={form.subcategory} onChange={f('subcategory')} placeholder="e.g. Edge AI Compute, Quadruped Robots" />
          </div>

          <div>
            <label className="field-label">Verification Status *</label>
            <select className="field" value={form.verificationStatus} onChange={f('verificationStatus')}>
              <option value="verified">Verified (Visible Publicly on E-Market)</option>
              <option value="needs_review">Needs Review (Hidden)</option>
              <option value="unavailable">Unavailable (Discontinued)</option>
            </select>
          </div>

          <div>
            <label className="field-label">Official Release Date (YYYY-MM-DD)</label>
            <input type="date" className="field" value={form.releaseDate} onChange={f('releaseDate')} />
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Tagline</label>
            <input className="field" value={form.tagline} onChange={f('tagline')} placeholder="Short memorable hardware pitch" />
          </div>

          <div className="sm:col-span-2">
            <label className="field-label flex items-center justify-between">
              <span>Exact Official Product Photo Path / URL *</span>
              {form.image && (
                <a href={resolveUrl(form.image)} target="_blank" rel="noreferrer" className="text-xs text-violet-400 hover:underline inline-flex items-center gap-1">
                  Preview Image <ExternalLink size={11} />
                </a>
              )}
            </label>
            <div className="flex gap-3 items-center">
              {form.image && (
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={resolveUrl(form.image)}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <input className="field font-mono text-xs flex-1" value={form.image} onChange={f('image')} placeholder="/emarket/products/unitree-g1.jpg or https://..." required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Price (in INR ₹)</label>
              <input type="number" className="field font-mono font-bold" value={form.price} onChange={f('price')} placeholder="e.g. 14999" />
            </div>
            <div>
              <label className="field-label">Currency</label>
              <select className="field" value={form.currency} onChange={f('currency')}>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="field-label">Source Type</label>
            <select className="field" value={form.sourceType} onChange={f('sourceType')}>
              <option value="manufacturer">Manufacturer Direct</option>
              <option value="official_store">Official Store</option>
              <option value="authorized_distributor">Authorized Distributor</option>
              <option value="retailer">Retailer</option>
            </select>
          </div>

          <div>
            <label className="field-label">Source / Store Name</label>
            <input className="field" value={form.source} onChange={f('source')} placeholder="e.g. Unitree Robotics Official" />
          </div>

          <div>
            <label className="field-label">Canonical Official Product Page URL *</label>
            <input className="field font-mono text-xs" value={form.sourceProductUrl} onChange={f('sourceProductUrl')} placeholder="https://..." />
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Direct Buy / Store Link</label>
            <input className="field font-mono text-xs" value={form.buyUrl} onChange={f('buyUrl')} placeholder="https://..." />
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Description</label>
            <textarea className="field" rows={3} value={form.description} onChange={f('description')} placeholder="Detailed hardware overview" />
          </div>

          <div>
            <label className="field-label">Specifications (Format: "Key: Value" per line)</label>
            <textarea className="field font-mono text-xs" rows={4} value={form.specificationsText} onChange={f('specificationsText')} placeholder="AI Compute: 40 TOPS&#10;RAM: 8GB LPDDR5&#10;Power: 7W - 15W" />
          </div>

          <div>
            <label className="field-label">Key Features (One per line)</label>
            <textarea className="field" rows={4} value={form.featuresText} onChange={f('featuresText')} placeholder="Runs YOLOv8 real-time&#10;Dual CSI camera ports&#10;PCIe NVMe support" />
          </div>

          <div className="sm:col-span-2 flex items-center gap-2 pt-2">
            <input
              id="isFeatured"
              type="checkbox"
              checked={form.isFeatured}
              onChange={toggleBool('isFeatured')}
              className="w-4 h-4 rounded border-slate-600 accent-violet-500"
            />
            <label htmlFor="isFeatured" className="text-sm text-slate-300 cursor-pointer">
              Feature in E-Market Spotlight Showcase
            </label>
          </div>

          <div className="sm:col-span-2 flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              <Check size={15} /> {editing ? 'Update Hardware' : 'Add Hardware to E-Market'}
            </button>
            <button type="button" onClick={cancel} className="btn-ghost">
              <X size={15} /> Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#0f111e] border border-zinc-800">
        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title, brand, or tag..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-zinc-950/80 border border-zinc-700 text-xs text-slate-100 placeholder-zinc-500 outline-none focus:border-violet-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs">
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-zinc-950/80 border border-zinc-700 text-xs text-slate-200 outline-none focus:border-violet-500 font-medium"
          >
            <option value="all">All Categories ({products.length})</option>
            <option value="Everyday AI">Everyday AI</option>
            <option value="Smart Home">Smart Home</option>
            <option value="Robotics">Robotics</option>
            <option value="AI Hardware & Development Boards">AI Hardware & Dev Boards</option>
          </select>
          
          <button
            onClick={load}
            className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Refresh product list"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-zinc-800/80 bg-[#0e101a]/90 text-zinc-400 space-y-3">
          <ShoppingBag size={32} className="mx-auto text-zinc-600" />
          <p className="text-sm font-bold text-slate-200">No hardware products found</p>
          <p className="text-xs text-zinc-500">Try clearing search filter keywords or selecting another category.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0e101a]/90 backdrop-blur-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs sm:text-sm table-fixed">
            <thead>
              <tr className="border-b border-zinc-800/90 text-zinc-400 text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-zinc-950/80">
                <th className="py-3 px-2.5 w-[28%]">Product</th>
                <th className="py-3 px-2 w-[11%]">Brand</th>
                <th className="py-3 px-2 w-[13%]">Category</th>
                <th className="py-3 px-2 w-[12%]">Price</th>
                <th className="py-3 px-2 w-[11%]">Status</th>
                <th className="py-3 px-2 w-[11%]">Source</th>
                <th className="py-3 px-2.5 w-[14%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-violet-950/20 transition-all duration-200 group">
                  <td className="py-2.5 px-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-white p-1 border border-zinc-700/60 shadow-sm shrink-0 flex items-center justify-center group-hover:border-violet-500/50 transition-colors">
                        <img
                          src={resolveUrl(p.image)}
                          alt={p.title}
                          className="w-full h-full object-contain mix-blend-multiply"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<span class="text-[8px] text-zinc-500 font-mono font-bold">IMG</span>';
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-100 text-xs group-hover:text-violet-300 transition-colors flex items-center gap-1 min-w-0">
                          <span className="truncate">{p.title}</span>
                          {p.isFeatured && (
                            <span className="shrink-0 inline-flex items-center gap-0.5 text-[8px] px-1 py-0.2 rounded-full border uppercase font-extrabold text-amber-300 bg-amber-500/15 border-amber-500/40 shadow-sm">
                              <Star size={8} className="fill-amber-300" />
                            </span>
                          )}
                        </div>
                        {p.tagline && (
                          <div className="text-zinc-400 text-[10px] truncate mt-0.5">{p.tagline}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="inline-block text-[10px] font-extrabold px-1.5 py-0.5 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-300 truncate max-w-full">
                      {p.brand}
                    </span>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="text-xs font-semibold text-zinc-300 truncate block">{p.category}</span>
                  </td>
                  <td className="py-2.5 px-2 font-mono text-xs font-black whitespace-nowrap">
                    {p.price !== null && p.price !== undefined && p.price > 0 ? (
                      <span className="text-[#00e599] drop-shadow-sm">
                        {p.currency === 'INR' || !p.currency ? '₹' : '$'}{Number(p.price).toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span className="text-zinc-500 text-xs italic font-normal">Unpriced</span>
                    )}
                  </td>
                  <td className="py-2.5 px-2">
                    <button
                      onClick={() => toggleVerificationStatus(p)}
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border font-bold text-[9px] uppercase tracking-wider transition-all shadow-sm whitespace-nowrap ${
                        p.verificationStatus === 'verified'
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                          : p.verificationStatus === 'needs_review'
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                          : 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25'
                      }`}
                    >
                      {p.verificationStatus === 'verified' ? <ShieldCheck size={10} /> : <AlertCircle size={10} />}
                      {p.verificationStatus === 'verified' ? 'Verified' : 'Review'}
                    </button>
                  </td>
                  <td className="py-2.5 px-2 text-xs text-zinc-400">
                    {p.buyUrl || p.sourceProductUrl ? (
                      <a
                        href={p.buyUrl || p.sourceProductUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-violet-400 hover:text-violet-300 hover:underline inline-flex items-center gap-0.5 font-medium truncate max-w-full"
                      >
                        <span className="truncate">{p.source || 'Official'}</span> <ExternalLink size={10} className="shrink-0" />
                      </a>
                    ) : (
                      <span className="text-zinc-500 truncate block">{p.source || '—'}</span>
                    )}
                  </td>
                  <td className="py-2.5 px-2.5 text-right">
                    <div className="flex gap-1.5 justify-end shrink-0">
                      <button
                        onClick={() => startEdit(p)}
                        className="p-1.5 text-violet-300 bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/40 rounded-lg transition-all shadow-sm flex items-center justify-center"
                        title="Edit hardware product"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-1.5 text-rose-300 bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/40 rounded-lg transition-all shadow-sm flex items-center justify-center"
                        title="Delete product from catalog"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!products.length && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-zinc-500">
                    No physical marketplace hardware products found. Use Auto-Import to add products!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Hardware Product"
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
