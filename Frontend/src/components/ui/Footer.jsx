import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Twitter, Github, Mail, MapPin, ArrowUpRight, Building2 } from 'lucide-react';
import api from '../../utils/api';
import worknaiLogo from '../../assets/worknai_logo.png';

export default function Footer() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    api.get('/company').then((r) => setInfo(r.data.data)).catch(() => {});
  }, []);

  return (
    <footer className="site-footer relative overflow-hidden bg-[#030208] border-t-2 border-violet-500/40">
      <div className="glow-orb w-[600px] h-[300px] bg-violet-600 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      <div className="footer-inner container-x relative px-4 sm:px-6 py-12 md:py-16">

        {/* Main grid */}
        <div className="footer-main flex flex-col lg:flex-row justify-between gap-10 md:gap-12">

          {/* Col 1 — Brand */}
          <div className="footer-brand lg:max-w-[240px] shrink-0">
            <img src={worknaiLogo} alt="WorknAi" className="footer-logo h-28 w-auto object-contain mb-3" />
            <p className="footer-desc text-sm text-ink-dim leading-relaxed mb-3 max-w-xs">
              {info?.name || 'WorknAi Technologies India Pvt Ltd'} — IT training, software R&D and digital solutions from Pune.
            </p>

            {/* Company badges */}
            <div className="footer-badges flex flex-wrap gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Company
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-violet-500/10 border border-violet-500/20 text-violet-300">
                <Building2 className="w-3 h-3" /> Est. Oct 2025
              </span>
            </div>

            {/* Social icons */}
            <div className="footer-social flex flex-wrap gap-2">
              {[
                { href: info?.social?.instagram || 'https://www.instagram.com/worknai_institute_center/', Icon: Instagram },
                { href: info?.social?.linkedin  || 'https://in.linkedin.com/in/worknai-technology-8830973b6', Icon: Linkedin },
                { href: info?.social?.twitter,   Icon: Twitter },
                { href: info?.social?.github,    Icon: Github  },
              ].filter(s => s.href).map(({ href, Icon }) => (
                <a key={href} href={href} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-line2 flex items-center justify-center text-ink-dim hover:text-white hover:border-violet-400/60 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links group */}
          <div className="footer-links flex flex-wrap gap-10 md:gap-12 lg:gap-14">

            {/* Col 2 — Explore */}
            <div className="footer-link-col">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-5">Explore</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { to: '/courses',  label: 'Courses'  },
                  { to: '/products', label: 'Products' },
                  { to: '/career',   label: 'Careers'  },
                  { to: '/partners', label: 'Partners' },
                  { to: '/about',    label: 'About'    },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-ink-dim hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Learn */}
            <div className="footer-link-col">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-5">Learn</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/courses?mode=online"  className="text-ink-dim hover:text-white transition-colors">Online Courses</Link></li>
                <li><Link to="/courses?mode=offline" className="text-ink-dim hover:text-white transition-colors">Offline Courses</Link></li>
                <li><Link to="/courses"              className="text-ink-dim hover:text-white transition-colors">Internships</Link></li>
                <li><Link to="/contact"              className="text-ink-dim hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Col — Development */}
            <div className="footer-link-col">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-5">Development</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { to: '/services/web3',       label: 'Web 3.0'    },
                  { to: '/services/ai-ml',      label: 'AI / ML'    },
                  { to: '/services/coding',     label: 'Coding'     },
                  { to: '/services/mobile-app', label: 'Mobile App' },
                  { to: '/services/software',   label: 'Software'   },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-ink-dim hover:text-violet-300 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col — Solutions */}
            <div className="footer-link-col">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-5">Solutions</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { to: '/services/fintech',    label: 'FinTech'            },
                  { to: '/services/e-learning', label: 'E-Learning'         },
                  { to: '/services/e-commerce', label: 'E-Commerce'         },
                  { to: '/services/e-health',   label: 'E-Health'           },
                  { to: '/services/realty',     label: 'Realty Management'  },
                  { to: '/services/vehicle',    label: 'Vehicle Management' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-ink-dim hover:text-violet-300 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col — Resource Outsourcing */}
            <div className="footer-link-col">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-5">Resource Outsourcing</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { to: '/services/virtual-staff', label: 'Virtual Staff'      },
                  { to: '/services/offshore',      label: 'Offshore Employee'  },
                  { to: '/services/eor',           label: 'EOR Services'       },
                  { to: '/services/it-infra',      label: 'IT Infrastructure'  },
                  { to: '/services/workspaces',    label: 'Workspaces'         },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-ink-dim hover:text-violet-300 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Reach Us */}
            <div className="footer-link-col footer-reach">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-5">Reach Us</h4>
              <div className="grid gap-4 text-sm md:grid-cols-3">
                <div className="space-y-2 text-xs leading-relaxed text-white/75">
                  <p className="font-semibold text-white uppercase tracking-[0.18em]">Registered Office</p>
                  <p>Unit 101, Oxford Towers<br />139/88, Old Airport Road<br />Bangalore North, Karnataka – 560008</p>
                </div>
                <div className="space-y-2 text-xs leading-relaxed text-white/75">
                  <p className="font-semibold text-white uppercase tracking-[0.18em]">Corporate Office</p>
                  <p>Business Park<br />Sr. No. 199, Behind Jotiba Mandir<br />Jotiba Nagar, Talawade<br />Pune – 411062</p>
                </div>
                <div className="space-y-2 text-xs leading-relaxed text-white/75">
                  <p className="font-semibold text-white uppercase tracking-[0.18em]">Research &amp; Development</p>
                  <p>Waheguru Guru Nanak Mansarovar Ashram, Shree, Akurdi Railway Station Rd, Fitness18, Nigdi, Pimpri-Chinchwad, Maharashtra 411033</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 text-white/75">
                <Mail className="w-4 h-4 text-violet-400" />
                <a href={`mailto:${info?.email || 'info@worknai.in'}`} className="hover:text-white break-all text-sm">
                  {info?.email || 'info@worknai.in'}
                </a>
              </div>
              {info?.workingHours && (
                <p className="mt-4 text-ink-faint text-xs">{info.workingHours}</p>
              )}
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom border-t border-line2 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-faint">
          <p>© {new Date().getFullYear()} {info?.name || 'WorknAi Technologies India Pvt Ltd'}. All rights reserved.</p>
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
            <Link to="/hr/login" className="hover:text-sky-300 transition-colors flex items-center gap-1">
              HR Login <ArrowUpRight className="w-3 h-3" />
            </Link>
           
            <span className="font-mono">v1.0.0 · built with ❤ in Pune</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
