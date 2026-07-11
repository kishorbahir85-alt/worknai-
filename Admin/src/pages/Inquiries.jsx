import { useEffect, useState } from 'react';
import api from '../utils/api';
import {
  MessageSquare, Building2, Mail, Phone, Tag,
  Clock, ChevronDown, ChevronUp, RefreshCw, Loader2, TrendingUp, Package, GraduationCap, ShoppingCart,
} from 'lucide-react';

const statusStyle = {
  new:     'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  read:    'bg-blue-500/15 text-blue-400 border-blue-500/30',
  replied: 'bg-green-500/15 text-green-400 border-green-500/30',
};
const statusLabel = { new: 'New', read: 'Read', replied: 'Replied' };

const getProductEnquiryKind = (enquiry) => {
  if (!enquiry.product) return null;
  const value = `${enquiry.source || ''} ${enquiry.type || ''}`.toLowerCase();
  if (value.includes('purchase')) return 'purchase';
  if (value.includes('invest')) return 'investor';
  return 'product';
};

const productKindMeta = {
  product: {
    label: 'Product',
    Icon: Package,
    iconBox: 'bg-violet-500/10 border-violet-500/20',
    text: 'text-violet-400',
    badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  },
  purchase: {
    label: 'Purchase',
    Icon: ShoppingCart,
    iconBox: 'bg-emerald-500/10 border-emerald-500/20',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
  investor: {
    label: 'Investor',
    Icon: TrendingUp,
    iconBox: 'bg-fuchsia-500/10 border-fuchsia-500/20',
    text: 'text-fuchsia-400',
    badge: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
  },
};

function  EnquiryCard({ inq, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(inq.status);
  const productKind = getProduct EnquiryKind(inq);
  const productMeta = productKind ? productKindMeta[productKind] : null;
  const ProductIcon = productMeta?.Icon;

  const handleStatus = async (newStatus) => {
    setSaving(true);
    try {
      await api.put(`/inquiries/${inq._id}`, { status: newStatus });
      setStatus(newStatus);
      onStatusChange(inq._id, newStatus);
    } catch {}
    setSaving(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${productMeta ? productMeta.iconBox : inq.course ? 'bg-sky-500/10 border-sky-500/20' : 'bg-violet-500/10 border-violet-500/20'}`}>
            {ProductIcon ? <ProductIcon size={16} className={productMeta.text} /> : inq.course ? <GraduationCap size={16} className="text-sky-400" /> : <Building2 size={16} className="text-violet-400" />}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{inq.company || inq.name}</p>
            <p className="text-slate-400 text-xs truncate">{inq.name} · {inq.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {inq.product && (
            <span className={`hidden sm:flex items-center gap-1 text-xs font-medium border rounded-full px-2.5 py-0.5 ${productMeta.badge}`}>
              <ProductIcon size={11} /> {productMeta.label}: {inq.product.title}
            </span>
          )}
          {inq.course && (
            <span className="hidden sm:flex items-center gap-1 text-xs font-medium border rounded-full px-2.5 py-0.5 bg-sky-500/15 text-sky-300 border-sky-500/30">
              <GraduationCap size={11} /> {inq.course.title}
            </span>
          )}
          <span className={`text-xs font-medium border rounded-full px-2.5 py-0.5 ${statusStyle[status]}`}>
            {statusLabel[status]}
          </span>
          <span className="text-xs text-slate-500">
            {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          {open ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-slate-800">
          <div className="grid sm:grid-cols-2 gap-3 mt-4 mb-4">
            {inq.product && (
              <div className="flex items-center gap-2 text-sm text-slate-300 sm:col-span-2">
                <ProductIcon size={13} className={`${productMeta.text} shrink-0`} />
                <span>{productMeta.label}  Enquiry for: <span className="text-white font-medium">{inq.product.title}</span></span>
              </div>
            )}
            {inq.course && (
              <div className="flex items-center gap-2 text-sm text-slate-300 sm:col-span-2">
                <GraduationCap size={13} className="text-sky-400 shrink-0" />
                <span>Regarding course: <span className="text-sky-300 font-medium">{inq.course.title}</span></span>
              </div>
            )}
            {inq.qualification && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Tag size={13} className="text-slate-500 shrink-0" />
                <span>Qualification: {inq.qualification}</span>
              </div>
            )}
            {inq.address && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Building2 size={13} className="text-slate-500 shrink-0" />
                <span>{inq.address}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Mail size={13} className="text-slate-500 shrink-0" />
              <a href={`mailto:${inq.email}`} className="hover:text-white transition-colors">{inq.email}</a>
            </div>
            {inq.phone && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Phone size={13} className="text-slate-500 shrink-0" />
                <a href={`tel:${inq.phone}`} className="hover:text-white transition-colors">{inq.phone}</a>
              </div>
            )}
            {inq.type && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Tag size={13} className="text-slate-500 shrink-0" />
                <span>{inq.type}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock size={13} className="text-slate-500 shrink-0" />
              <span>{new Date(inq.createdAt).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-lg p-4 mb-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Message</p>
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{inq.message}</p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-xs text-slate-500 shrink-0">Update status:</p>
            {['new', 'read', 'replied'].map((s) => (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                disabled={saving || status === s}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  status === s ? statusStyle[s] : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                }`}
              >
                {statusLabel[s]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchInquiries = () => {
    setLoading(true);
    api.get('/inquiries')
      .then((r) => setInquiries(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInquiries(); }, []);

  const handleStatusChange = (id, newStatus) => {
    setInquiries((prev) => prev.map((i) => i._id === id ? { ...i, status: newStatus } : i));
  };

  const filtered = filter === 'all' ? inquiries
    : ['product', 'purchase', 'investor'].includes(filter) ? inquiries.filter((i) => getProduct EnquiryKind(i) === filter)
    : filter === 'courses' ? inquiries.filter((i) => i.course)
    : inquiries.filter((i) => i.status === filter);

  const counts = {
    all:      inquiries.length,
    new:      inquiries.filter((i) => i.status === 'new').length,
    read:     inquiries.filter((i) => i.status === 'read').length,
    replied:  inquiries.filter((i) => i.status === 'replied').length,
    product:  inquiries.filter((i) => getProduct EnquiryKind(i) === 'product').length,
    purchase: inquiries.filter((i) => getProduct EnquiryKind(i) === 'purchase').length,
    investor: inquiries.filter((i) => getProduct EnquiryKind(i) === 'investor').length,
    courses:  inquiries.filter((i) => i.course).length,
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-white">Business Inquiries</h1>
          <p className="mt-1 text-slate-400 text-sm">Product, purchase, investor, course, and business inquiries.</p>
        </div>
        <button onClick={fetchInquiries} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors text-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3 mb-6">
        {[
          { key: 'all',      label: 'Total',     color: 'text-white' },
          { key: 'new',      label: 'New',       color: 'text-yellow-400' },
          { key: 'read',     label: 'Read',      color: 'text-blue-400' },
          { key: 'replied',  label: 'Replied',   color: 'text-green-400' },
          { key: 'product',  label: 'Products',  color: 'text-violet-400' },
          { key: 'purchase', label: 'Purchases', color: 'text-emerald-400' },
          { key: 'investor', label: 'Investors', color: 'text-fuchsia-400' },
          { key: 'courses',  label: 'Courses',   color: 'text-sky-400' },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`bg-slate-900 border rounded-xl p-4 text-left transition-all ${
              filter === key ? 'border-violet-500/50 bg-violet-500/5' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <p className={`text-2xl font-bold ${color}`}>{counts[key]}</p>
            <p className="text-slate-400 text-xs mt-0.5">{label}</p>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-xl">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-white font-medium">No inquiries found</p>
          <p className="text-slate-400 text-sm mt-1">New website inquiries will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((inq) => (
            < EnquiryCard key={inq._id} inq={inq} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </section>
  );
}
