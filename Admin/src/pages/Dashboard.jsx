import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  Package, BookOpen, Briefcase, GraduationCap, Newspaper,
  Layers, Code2, TrendingUp, Handshake, Building2,
  MessageSquare, FileText, ClipboardList, Users, ArrowUpRight, Sparkles, Activity
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    courses: 0,
    jobs: 0,
    blogs: 0,
    tutorials: 0,
    services: 0,
    templates: 0,
    trending: 0,
    partners: 0,
    inquiries: 0,
    applications: 0,
    enrollments: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          prodRes, courseRes, jobRes, blogRes, tutRes,
          servRes, tempRes, trendRes, partRes, inqRes,
          appRes, enrRes, userRes
        ] = await Promise.allSettled([
          api.get('/products'),
          api.get('/courses'),
          api.get('/jobs'),
          api.get('/blog/manage'),
          api.get('/tutorials'),
          api.get('/services'),
          api.get('/templates'),
          api.get('/trending'),
          api.get('/partners'),
          api.get('/inquiries'),
          api.get('/applications'),
          api.get('/enrollments'),
          api.get('/users'),
        ]);

        const getCount = (res) => {
          if (res.status === 'fulfilled' && res.value?.data) {
            const d = res.value.data;
            if (Array.isArray(d.data)) return d.data.length;
            if (Array.isArray(d)) return d.length;
            if (d.count !== undefined) return d.count;
            if (d.products?.length) return d.products.length;
            if (d.users?.length) return d.users.length;
          }
          return 0;
        };

        setStats({
          products: getCount(prodRes),
          courses: getCount(courseRes),
          jobs: getCount(jobRes),
          blogs: getCount(blogRes),
          tutorials: getCount(tutRes),
          services: getCount(servRes),
          templates: getCount(tempRes),
          trending: getCount(trendRes),
          partners: getCount(partRes),
          inquiries: getCount(inqRes),
          applications: getCount(appRes),
          enrollments: getCount(enrRes),
          users: getCount(userRes),
        });
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cardSections = [
    {
      title: 'Catalog & Educational Content',
      cards: [
        { label: 'E-Market Products', count: stats.products, icon: Package, to: '/products', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
        { label: 'Courses & Robotics', count: stats.courses, icon: BookOpen, to: '/courses', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
        { label: 'Career Openings', count: stats.jobs, icon: Briefcase, to: '/jobs', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
        { label: 'Tutorials & Guides', count: stats.tutorials, icon: GraduationCap, to: '/tutorials', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
        { label: 'Blog Posts', count: stats.blogs, icon: Newspaper, to: '/blog', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
      ]
    },
    {
      title: 'Enterprise CMS & Solutions',
      cards: [
        { label: 'Core Services', count: stats.services, icon: Layers, to: '/services', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
        { label: 'Developer Templates', count: stats.templates, icon: Code2, to: '/templates', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
        { label: 'Trending & Case Studies', count: stats.trending, icon: TrendingUp, to: '/trending', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
        { label: 'Partners & Clients', count: stats.partners, icon: Handshake, to: '/partners', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
        { label: 'Company Settings', count: 'Config', icon: Building2, to: '/company', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
      ]
    },
    {
      title: 'Operations & Community',
      cards: [
        { label: 'Client Inquiries', count: stats.inquiries, icon: MessageSquare, to: '/inquiries', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
        { label: 'Job Applications', count: stats.applications, icon: FileText, to: '/applications', color: 'text-lime-400 bg-lime-500/10 border-lime-500/20' },
        { label: 'Course Enrollments', count: stats.enrollments, icon: ClipboardList, to: '/enrollments', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
        { label: 'Registered Users', count: stats.users, icon: Users, to: '/users', color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20' },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-900/30 via-slate-900 to-slate-900 border border-violet-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles size={14} /> Full Website Control Center
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Welcome back, {user?.name || 'Administrator'}
            </h1>
            <p className="mt-1 text-slate-400 text-sm max-w-2xl">
              All website content across Services, Products, Courses, Robotics, Blog, Case Studies, and Site Settings is fully centralized and dynamic.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/company" className="btn-primary text-sm py-2 px-4">
              <Building2 size={15} /> Edit Site Info
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Sections */}
      {cardSections.map((section, sIdx) => (
        <div key={sIdx} className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Activity size={15} className="text-violet-400" /> {section.title}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {section.cards.map((c, cIdx) => {
              const Icon = c.icon;
              return (
                <Link
                  key={cIdx}
                  to={c.to}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all duration-200 group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${c.color}`}>
                      <Icon size={16} />
                    </div>
                    <ArrowUpRight size={14} className="text-slate-600 group-hover:text-violet-400 transition-colors" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {loading ? '...' : c.count}
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5 group-hover:text-slate-200 transition-colors">
                      {c.label}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
