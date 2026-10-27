import { useEffect, useState } from 'react';
import api from '../utils/api';
import ConfirmModal from '../components/ConfirmModal';
import { Trash2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = ['admin', 'manager', 'hr'];

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'hr' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/users').then(r => setUsers(r.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', form);
      toast.success(`${form.role} account created`);
      setForm({ name: '', email: '', password: '', role: 'hr' });
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDelete = async (target) => {
    const item = target || deleteTarget;
    if (!item) return;
    const id = typeof item === 'object' ? item._id : item;
    setDeleting(true);
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      setUsers(u => u.filter(x => x._id !== id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const roleBadge = (role) => ({
    admin: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    manager: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    hr: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  }[role] || '');

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Manage Users</h1>
          <p className="mt-1 text-slate-400 text-sm">Create and manage all accounts</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn-primary">
          {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> New User</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="panel-card mb-6 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Full Name</label>
            <input className="field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" required />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input type="email" className="field" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="user@worknai.com" required />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input type="password" className="field" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters" required minLength={6} />
          </div>
          <div>
            <label className="field-label">Role</label>
            <select className="field" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary">Create Account</button>
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
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Created</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 text-slate-100 font-medium">{u.name}</td>
                  <td className="py-3 px-4 text-slate-400">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium uppercase ${roleBadge(u.role)}`}>{u.role}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => setDeleteTarget(u)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {!users.length && <tr><td colSpan={5} className="py-12 text-center text-slate-500">No users found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete User"
        message={`Are you sure you want to delete user "${deleteTarget?.name || 'this user'}"? This action cannot be undone.`}
        confirmText="Delete User"
        cancelText="Cancel"
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </section>
  );
}
