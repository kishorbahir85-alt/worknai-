import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, BookOpen, Package, ShoppingBag, Handshake,
  Building2, MessageSquare, UserCircle, LogOut, Users, GraduationCap,
  Newspaper, ListChecks
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',   label: 'Dashboard',         icon: LayoutDashboard },
  { to: '/users',       label: 'HR Accounts',       icon: Users },
  { to: '/courses',     label: 'Courses',           icon: BookOpen },
  { to: '/enrollments', label: 'Enrollments',       icon: GraduationCap },
  { to: '/products',    label: 'WorknAi Software',  icon: Package },
  { to: '/marketplace', label: 'Hardware E-Market', icon: ShoppingBag },
  { to: '/blog',        label: 'Blog',              icon: Newspaper },
  { to: '/tutorials',   label: 'Tutorials',         icon: ListChecks },
  { to: '/partners',    label: 'Partners',          icon: Handshake },
  { to: '/company',     label: 'Company',           icon: Building2 },
  { to: '/inquiries',   label: 'Inquiries',         icon: MessageSquare },
  { to: '/profile',     label: 'Profile',           icon: UserCircle },
];

export default function ManagerLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-slate-800 bg-slate-900 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-800">
          <span className="font-display text-xl font-bold text-white">WorknAi</span>
          <span className="ml-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Manager</span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-800">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-slate-500">Logged in as</p>
            <p className="text-sm text-slate-200 font-medium truncate">{user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container-x py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
