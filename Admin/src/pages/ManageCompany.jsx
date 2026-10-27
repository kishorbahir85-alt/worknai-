import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Check, Plus, Trash2, Building2, Target, Phone, BarChart2, Users, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageCompany() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('brand');

  const [form, setForm] = useState({
    name: 'WorknAi',
    legalName: 'WorknAi Technologies Private Limited',
    tagline: 'Intelligent Enterprise Solutions, Autonomous Robotics & Engineering Studio',
    headline: 'Engineering Autonomous Intelligence for Next-Gen Enterprises',
    subheadline: 'WorknAi crafts full-stack enterprise platforms, autonomous robotics pipelines, and bespoke AI applications built for speed, precision, and global scale.',
    aboutStory: '',
    mission: '',
    vision: '',
    email: 'contact@worknai.com',
    phone: '+91 (020) 8492-4920',
    address: 'WorknAi Innovation Tower, Cyber City, Pune, Maharashtra 411028, India',
    foundedYear: 2024,
    metrics: [
      { label: 'Active Enterprise Clients', value: '120+', description: 'Global corporate deployments' },
      { label: 'AI Accuracy Benchmark', value: '99.8%', description: 'Precision rate across production vision models' },
      { label: 'Average Response Latency', value: '< 180ms', description: 'Real-time inference & edge processing' },
      { label: 'Countries Supported', value: '35+', description: 'Cross-border deployments and integrations' },
    ],
    team: [],
    socialLinks: {
      linkedin: 'https://in.linkedin.com/in/worknai-technology-8830973b6',
      facebook: 'https://www.facebook.com/profile.php?id=61595453355907',
      youtube: 'https://www.youtube.com/@Worknai-w5m',
      instagram: 'https://www.instagram.com/worknai_institute_center/',
      twitter: '',
      github: '',
    },
    brandSettings: {
      logoUrl: '',
      primaryColor: '#7c3aed',
      accentColor: '#06b6d4',
    },
  });

  const load = () => {
    setLoading(true);
    api.get('/company')
      .then((r) => {
        if (r.data.data) {
          const d = r.data.data;
          setForm({
            ...d,
            metrics: d.metrics && d.metrics.length ? d.metrics : form.metrics,
            team: d.team || [],
            socialLinks: d.socialLinks || d.socials || form.socialLinks,
            socials: d.socials || d.socialLinks || form.socialLinks,
            brandSettings: d.brandSettings || form.brandSettings,
          });
        }
      })
      .catch(() => toast.error('Failed to load company profile'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const fSocial = (k) => (e) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, [k]: e.target.value } }));
  const fBrand = (k) => (e) => setForm((p) => ({ ...p, brandSettings: { ...p.brandSettings, [k]: e.target.value } }));

  // Metric handlers
  const handleMetricChange = (idx, field, val) => {
    setForm((p) => {
      const updated = [...p.metrics];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...p, metrics: updated };
    });
  };

  const addMetric = () => {
    setForm((p) => ({
      ...p,
      metrics: [...p.metrics, { label: 'New Metric', value: '100+', description: 'Description' }],
    }));
  };

  const removeMetric = (idx) => {
    setForm((p) => ({
      ...p,
      metrics: p.metrics.filter((_, i) => i !== idx),
    }));
  };

  // Team handlers
  const handleTeamChange = (idx, field, val) => {
    setForm((p) => {
      const updated = [...p.team];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...p, team: updated };
    });
  };

  const addTeamMember = () => {
    setForm((p) => ({
      ...p,
      team: [...p.team, { name: '', role: '', bio: '', linkedin: '', github: '' }],
    }));
  };

  const removeTeamMember = (idx) => {
    setForm((p) => ({
      ...p,
      team: p.team.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/company', form);
      toast.success('Company settings saved successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Company & Site Settings</h1>
          <p className="mt-1 text-slate-400 text-sm">Manage global brand identity, site copy, metrics, and leadership</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving || loading}
          className="btn-primary disabled:opacity-60"
        >
          <Check size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('brand')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'brand'
              ? 'border-violet-500 text-violet-400 bg-violet-500/10 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 size={16} /> Brand & Headlines
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'about'
              ? 'border-violet-500 text-violet-400 bg-violet-500/10 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target size={16} /> About & Mission
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'metrics'
              ? 'border-violet-500 text-violet-400 bg-violet-500/10 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart2 size={16} /> Metrics Counters
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'team'
              ? 'border-violet-500 text-violet-400 bg-violet-500/10 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users size={16} /> Leadership & Team
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'contact'
              ? 'border-violet-500 text-violet-400 bg-violet-500/10 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Phone size={16} /> Contact & Socials
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TAB 1: BRAND */}
          {activeTab === 'brand' && (
            <div className="panel-card grid sm:grid-cols-2 gap-4">
              <h2 className="sm:col-span-2 text-base font-semibold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-violet-400" /> Brand Identity & Hero Copy
              </h2>

              <div>
                <label className="field-label">Company Brand Name</label>
                <input className="field" value={form.name} onChange={f('name')} placeholder="WorknAi" required />
              </div>

              <div>
                <label className="field-label">Legal Registered Name</label>
                <input className="field" value={form.legalName} onChange={f('legalName')} placeholder="WorknAi Technologies Pvt Ltd" />
              </div>

              <div className="sm:col-span-2">
                <label className="field-label">Tagline / Brand Philosophy</label>
                <input className="field" value={form.tagline} onChange={f('tagline')} placeholder="Short memorable tagline" />
              </div>

              <div className="sm:col-span-2">
                <label className="field-label">Homepage Main Headline</label>
                <input className="field" value={form.headline} onChange={f('headline')} placeholder="Engineering Autonomous Intelligence for Next-Gen Enterprises" />
              </div>

              <div className="sm:col-span-2">
                <label className="field-label">Homepage Subheadline / Elevator Pitch</label>
                <textarea className="field" rows={3} value={form.subheadline} onChange={f('subheadline')} placeholder="Detailed descriptive subtext shown below hero headline" />
              </div>

              <div>
                <label className="field-label">Logo Image URL</label>
                <input className="field" value={form.brandSettings?.logoUrl || ''} onChange={fBrand('logoUrl')} placeholder="https://..." />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="field-label">Primary Brand Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.brandSettings?.primaryColor || '#7c3aed'} onChange={fBrand('primaryColor')} className="w-9 h-9 rounded cursor-pointer bg-transparent border-0" />
                    <input className="field font-mono text-xs uppercase" value={form.brandSettings?.primaryColor || '#7c3aed'} onChange={fBrand('primaryColor')} />
                  </div>
                </div>
                <div>
                  <label className="field-label">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.brandSettings?.accentColor || '#06b6d4'} onChange={fBrand('accentColor')} className="w-9 h-9 rounded cursor-pointer bg-transparent border-0" />
                    <input className="field font-mono text-xs uppercase" value={form.brandSettings?.accentColor || '#06b6d4'} onChange={fBrand('accentColor')} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT */}
          {activeTab === 'about' && (
            <div className="panel-card space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Target size={18} className="text-violet-400" /> Story, Mission & Vision
              </h2>

              <div>
                <label className="field-label">About Story</label>
                <textarea className="field" rows={5} value={form.aboutStory} onChange={f('aboutStory')} placeholder="The origin, evolution, and core philosophy of WorknAi..." />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Company Mission</label>
                  <textarea className="field" rows={3} value={form.mission} onChange={f('mission')} placeholder="Our day-to-day commitment to engineering excellence..." />
                </div>
                <div>
                  <label className="field-label">Long-Term Vision</label>
                  <textarea className="field" rows={3} value={form.vision} onChange={f('vision')} placeholder="Where we are taking enterprise automation over the next decade..." />
                </div>
              </div>

              <div className="w-48">
                <label className="field-label">Founded Year</label>
                <input type="number" className="field" value={form.foundedYear} onChange={f('foundedYear')} placeholder="2024" />
              </div>
            </div>
          )}

          {/* TAB 3: METRICS */}
          {activeTab === 'metrics' && (
            <div className="panel-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <BarChart2 size={18} className="text-violet-400" /> Impact Metrics & Key Stats
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">These numbers appear in the hero counter and proof bars across the site</p>
                </div>
                <button type="button" onClick={addMetric} className="btn-secondary text-xs">
                  <Plus size={14} /> Add Metric
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {form.metrics?.map((m, idx) => (
                  <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl relative group">
                    <button
                      type="button"
                      onClick={() => removeMetric(idx)}
                      className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition-colors"
                      title="Remove Metric"
                    >
                      <Trash2 size={15} />
                    </button>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="field-label text-xs">Value / Number</label>
                        <input className="field font-bold text-violet-400" value={m.value} onChange={(e) => handleMetricChange(idx, 'value', e.target.value)} placeholder="120+" />
                      </div>
                      <div>
                        <label className="field-label text-xs">Metric Label</label>
                        <input className="field" value={m.label} onChange={(e) => handleMetricChange(idx, 'label', e.target.value)} placeholder="Active Clients" />
                      </div>
                    </div>
                    <div>
                      <label className="field-label text-xs">Short Description</label>
                      <input className="field text-xs text-slate-300" value={m.description || ''} onChange={(e) => handleMetricChange(idx, 'description', e.target.value)} placeholder="Global corporate deployments" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TEAM */}
          {activeTab === 'team' && (
            <div className="panel-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Users size={18} className="text-violet-400" /> Executive Leadership & Core Team
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Founders, department leads, and key innovators</p>
                </div>
                <button type="button" onClick={addTeamMember} className="btn-secondary text-xs">
                  <Plus size={14} /> Add Team Member
                </button>
              </div>

              <div className="space-y-4">
                {form.team?.map((member, idx) => (
                  <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl relative grid sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => removeTeamMember(idx)}
                      className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 size={15} />
                    </button>

                    <div>
                      <label className="field-label text-xs">Full Name</label>
                      <input className="field" value={member.name} onChange={(e) => handleTeamChange(idx, 'name', e.target.value)} placeholder="Akshay Sharma" />
                    </div>

                    <div>
                      <label className="field-label text-xs">Title / Role</label>
                      <input className="field" value={member.role} onChange={(e) => handleTeamChange(idx, 'role', e.target.value)} placeholder="Chief Executive Officer" />
                    </div>

                    <div>
                      <label className="field-label text-xs">LinkedIn Profile</label>
                      <input className="field" value={member.linkedin || ''} onChange={(e) => handleTeamChange(idx, 'linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="field-label text-xs">Short Bio</label>
                      <textarea className="field" rows={2} value={member.bio || ''} onChange={(e) => handleTeamChange(idx, 'bio', e.target.value)} placeholder="12+ years building enterprise systems..." />
                    </div>
                  </div>
                ))}
                {!form.team?.length && (
                  <p className="text-sm text-slate-500 py-6 text-center">No team members added. Click "Add Team Member" above.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT & SOCIALS */}
          {activeTab === 'contact' && (
            <div className="panel-card grid sm:grid-cols-2 gap-4">
              <h2 className="sm:col-span-2 text-base font-semibold text-white flex items-center gap-2">
                <Phone size={18} className="text-violet-400" /> Contact Details & Social Media Links
              </h2>

              <div>
                <label className="field-label">Official Contact Email</label>
                <input type="email" className="field" value={form.email} onChange={f('email')} placeholder="contact@worknai.com" />
              </div>

              <div>
                <label className="field-label">Support / Inquiry Phone</label>
                <input className="field" value={form.phone} onChange={f('phone')} placeholder="+91 (020) 8492-4920" />
              </div>

              <div className="sm:col-span-2">
                <label className="field-label">Physical Office Headquarters Address</label>
                <input className="field" value={form.address} onChange={f('address')} placeholder="Innovation Tower, Cyber City, Pune..." />
              </div>

              <div>
                <label className="field-label">LinkedIn URL</label>
                <input className="field" value={form.socialLinks?.linkedin || ''} onChange={fSocial('linkedin')} placeholder="https://linkedin.com/company/worknai" />
              </div>

              <div>
                <label className="field-label">Instagram URL</label>
                <input className="field" value={form.socialLinks?.instagram || ''} onChange={fSocial('instagram')} placeholder="https://instagram.com/worknai_institute_center" />
              </div>

              <div>
                <label className="field-label">YouTube Channel URL</label>
                <input className="field" value={form.socialLinks?.youtube || ''} onChange={fSocial('youtube')} placeholder="https://www.youtube.com/@Worknai-w5m" />
              </div>

              <div>
                <label className="field-label">Facebook Page URL</label>
                <input className="field" value={form.socialLinks?.facebook || ''} onChange={fSocial('facebook')} placeholder="https://www.facebook.com/profile.php?id=61595453355907" />
              </div>

              <div>
                <label className="field-label">Twitter / X URL</label>
                <input className="field" value={form.socialLinks?.twitter || ''} onChange={fSocial('twitter')} placeholder="https://twitter.com/worknai" />
              </div>

              <div>
                <label className="field-label">GitHub URL</label>
                <input className="field" value={form.socialLinks?.github || ''} onChange={fSocial('github')} placeholder="https://github.com/worknai" />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:opacity-60"
            >
              <Check size={16} /> {saving ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
