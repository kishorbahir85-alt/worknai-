import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Youtube, Facebook, Mail, Building2 } from 'lucide-react';
import api from '../../utils/api';
import worknaiLogo from '../../assets/worknai_logo.png';

export default function Footer() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    api.get('/company').then((r) => setInfo(r.data.data)).catch(() => {});
  }, []);

  const socials = info?.socials || info?.social || {};

  return (
    <footer className="site-footer w-full relative overflow-hidden bg-[#030208] border-t-2 border-violet-500/40">
      <div className="glow-orb w-[800px] h-[200px] bg-violet-600 top-0 left-1/2 -translate-x-1/2 opacity-15 pointer-events-none" />

      <div className="footer-inner w-full relative px-4 sm:px-8 md:px-12 lg:px-16 py-8 md:py-10">

        {/* Main layout */}
        <div className="footer-main flex flex-col xl:flex-row justify-between gap-8 xl:gap-12 w-full">

          {/* Col 1 — Brand */}
          <div className="footer-brand xl:max-w-[280px] shrink-0">
            <img src={worknaiLogo} alt="WorknAi" className="footer-logo h-10 sm:h-12 w-auto object-contain mb-3 filter drop-shadow-[0_2px_12px_rgba(139,92,246,0.3)]" />
            <p className="footer-desc text-xs text-slate-400 leading-relaxed mb-4 max-w-sm">
              {info?.name || 'WorknAi Technologies India Pvt Ltd'} — IT training, software R&amp;D and digital solutions from Pune.
            </p>

            {/* Company badges */}
            <div className="footer-badges flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Company
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-violet-500/10 border border-violet-500/20 text-violet-300">
                <Building2 className="w-3.5 h-3.5" /> Est. Oct 2025
              </span>
            </div>

            {/* Social icons */}
            <div className="footer-social flex flex-wrap gap-2" aria-label="WorknAi Social Profiles">
              {[
                { label: 'Instagram', href: socials.instagram || 'https://www.instagram.com/worknai_institute_center/', Icon: Instagram },
                { label: 'LinkedIn',  href: socials.linkedin  || 'https://in.linkedin.com/in/worknai-technology-8830973b6', Icon: Linkedin },
                { label: 'YouTube',   href: socials.youtube   || 'https://www.youtube.com/@Worknai-w5m', Icon: Youtube },
                { label: 'Facebook',  href: socials.facebook  || 'https://www.facebook.com/profile.php?id=61595453355907',  Icon: Facebook },
              ].filter(s => s.href).map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit WorknAi on ${label}`}
                  title={`WorknAi on ${label}`}
                  className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-slate-400 hover:text-white hover:border-violet-400/60 hover:bg-violet-500/10 transition-all focus:outline-none focus:ring-2 focus:ring-violet-400/50"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Links & Reach Us columns across full width */}
          <div className="flex-1 flex flex-col gap-8">
            
            {/* 5 Navigation Columns spreading across the width */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 lg:gap-8 w-full">
              {/* Explore */}
              <div className="footer-link-col">
                <h4 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">Explore</h4>
                <ul className="space-y-2 text-xs">
                  {[
                    { to: '/courses',  label: 'Courses'  },
                    { to: '/products', label: 'Products' },
                    { to: '/career',   label: 'Careers'  },
                    { to: '/partners', label: 'Partners' },
                    { to: '/about',    label: 'About'    },
                  ].map(({ to, label }) => (
                    <li key={to}>
                      <Link to={to} className="text-slate-400 hover:text-white transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Learn */}
              <div className="footer-link-col">
                <h4 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">Learn</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link to="/courses?mode=online"  className="text-slate-400 hover:text-white transition-colors">Online Courses</Link></li>
                  <li><Link to="/courses?mode=offline" className="text-slate-400 hover:text-white transition-colors">Offline Courses</Link></li>
                  <li><Link to="/courses"              className="text-slate-400 hover:text-white transition-colors">Internships</Link></li>
                  <li><Link to="/contact"              className="text-slate-400 hover:text-white transition-colors">Contact Us</Link></li>
                </ul>
              </div>

              {/* Development */}
              <div className="footer-link-col">
                <h4 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">Development</h4>
                <ul className="space-y-2 text-xs">
                  {[
                    { to: '/services/web3',       label: 'Web 3.0'    },
                    { to: '/services/ai-ml',      label: 'AI / ML'    },
                    { to: '/robotics',            label: 'Robotics'   },
                    { to: '/services/coding',     label: 'Coding'     },
                    { to: '/services/mobile-app', label: 'Mobile App' },
                    { to: '/services/software',   label: 'Software'   },
                  ].map(({ to, label }) => (
                    <li key={to}>
                      <Link to={to} className="text-slate-400 hover:text-violet-300 transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solutions */}
              <div className="footer-link-col">
                <h4 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">Solutions</h4>
                <ul className="space-y-2 text-xs">
                  {[
                    { to: '/services/fintech',    label: 'FinTech'            },
                    { to: '/services/e-learning', label: 'E-Learning'         },
                    { to: '/services/e-commerce', label: 'E-Commerce'         },
                    { to: '/services/e-health',   label: 'E-Health'           },
                    { to: '/services/realty',     label: 'Realty Management'  },
                    { to: '/services/vehicle',    label: 'Vehicle Management' },
                  ].map(({ to, label }) => (
                    <li key={to}>
                      <Link to={to} className="text-slate-400 hover:text-violet-300 transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resource Outsourcing */}
              <div className="footer-link-col">
                <h4 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">Resource Outsourcing</h4>
                <ul className="space-y-2 text-xs">
                  {[
                    { to: '/services/virtual-staff', label: 'Virtual Staff'      },
                    { to: '/services/offshore',      label: 'Offshore Employee'  },
                    { to: '/services/eor',           label: 'EOR Services'       },
                    { to: '/services/it-infra',      label: 'IT Infrastructure'  },
                    { to: '/services/workspaces',    label: 'Workspaces'         },
                  ].map(({ to, label }) => (
                    <li key={to}>
                      <Link to={to} className="text-slate-400 hover:text-violet-300 transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reach Us Section Spanning Across */}
            <div className="footer-reach border-t border-white/10 pt-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">Reach Us</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="space-y-1 text-slate-300 leading-relaxed">
                  <p className="font-bold text-white uppercase tracking-wider text-[11px]">Registered Office</p>
                  <p>Unit 101, Oxford Towers<br />139/88, Old Airport Road<br />Bangalore North, Karnataka – 560008</p>
                </div>
                <div className="space-y-1 text-slate-300 leading-relaxed">
                  <p className="font-bold text-white uppercase tracking-wider text-[11px]">Corporate Office</p>
                  <p>Business Park<br />Sr. No. 199, Behind Jotiba Mandir<br />Jotiba Nagar, Talawade<br />Pune – 411062</p>
                </div>
                <div className="space-y-1 text-slate-300 leading-relaxed">
                  <p className="font-bold text-white uppercase tracking-wider text-[11px]">R &amp; D Center</p>
                  <p>Waheguru Guru Nanak Mansarovar Ashram, Shree, Akurdi Railway Station Rd, Nigdi, Pune 411033</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-slate-300 text-xs">
                <Mail className="w-4 h-4 text-violet-400 shrink-0" />
                <a href={`mailto:${info?.email || 'info@worknai.in'}`} className="hover:text-white break-all font-medium">
                  {info?.email || 'info@worknai.in'}
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom border-t border-white/10 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 w-full">
          <p>© {new Date().getFullYear()} {info?.name || 'WorknAi Technologies India Pvt Ltd'}. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
