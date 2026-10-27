import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, BookOpen, Briefcase, Package, ShoppingBag, Sparkles,
  Handshake, Building2, MessageSquare, FileText, ClipboardList,
  UserCircle, LogOut, Newspaper, GraduationCap, Layers, Code2, TrendingUp
} from 'lucide-react';

const navGroups = [
  {
    title: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/users', label: 'Users', icon: Users },
    ]
  },
  {
    title: 'Content & Catalog',
    items: [
      { to: '/products', label: 'WorknAi Software', icon: Package },
      { to: '/marketplace', label: 'Hardware AI Innovation', icon: ShoppingBag },
      { to: '/ai-market-cms', label: 'AI Innovation CMS', icon: Sparkles },
      { to: '/courses', label: 'Courses & Robotics', icon: BookOpen },
      { to: '/jobs', label: 'Career Openings', icon: Briefcase },
      { to: '/tutorials', label: 'Tutorials', icon: GraduationCap },
      { to: '/blog', label: 'Blog Posts', icon: Newspaper },
    ]
  },
  {
    title: 'Solutions & CMS',
    items: [
      { to: '/services', label: 'Services', icon: Layers },
      { to: '/templates', label: 'Developer Templates', icon: Code2 },
      { to: '/trending', label: 'Trending & Case Studies', icon: TrendingUp },
      { to: '/partners', label: 'Partners & Clients', icon: Handshake },
      { to: '/company', label: 'Company & Site Info', icon: Building2 },
    ]
  },
  {
    title: 'Inbound & Operations',
    items: [
      { to: '/inquiries', label: 'Client Inquiries', icon: MessageSquare },
      { to: '/applications', label: 'Job Applications', icon: FileText },
      { to: '/enrollments', label: 'Course Enrollments', icon: ClipboardList },
      { to: '/profile', label: 'My Profile', icon: UserCircle },
    ]
  }
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-900 flex flex-col h-screen sticky top-0">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-white tracking-tight">WorknAi</span>
            <span className="text-[10px] font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto custom-scrollbar">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                {group.title}
              </p>
              {group.items.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="truncate">{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-800 bg-slate-900/80">
          <div className="px-3 py-1 mb-2">
            <p className="text-[11px] text-slate-500">Logged in as</p>
            <p className="text-sm text-slate-200 font-medium truncate">{user?.name || 'Administrator'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container-x py-8 px-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
