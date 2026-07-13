import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, ArrowUpRight, Sparkles, Package, GraduationCap,
  Briefcase, Phone, Loader2, CheckCircle, Plus, History, Trash2, Mail,
  ShieldCheck, ChevronRight,
} from 'lucide-react';
import api from '../../utils/api';

/* ────────────────────────────────────────────────
   WorknAi Assistant — rule-based chat widget.
   • Email-OTP verification before chatting (reuses /api/otp).
   • Conversations saved per verified email (localStorage) with a
     History tab to reopen and continue old chats.
   • Answers from the live product/course catalog and captures
     leads into the existing /api/inquiries flow.
   ──────────────────────────────────────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IDENTITY_KEY = 'worknai_chat_identity';
const SESSIONS_KEY = 'worknai_chat_sessions_v1';
const MAX_SESSIONS = 15;
const MAX_MESSAGES = 150;

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/* Messages are fully serializable: option buttons carry {label, cmd, arg}
   instead of closures so old chats can be restored from storage. */
const botMsg = (text, extra = {}) => ({ id: uid(), from: 'bot', text, ...extra });
const userMsg = (text) => ({ id: uid(), from: 'user', text });

const truncate = (str = '', n = 180) => (str.length > n ? `${str.slice(0, n).trim()}…` : str);

const formatPrice = (course) => {
  if (!course.showPrice) return 'Contact us for pricing';
  const price = Number(course.price) || 0;
  const discount = Number(course.discountPrice) || 0;
  if (discount > 0 && discount < price) return `₹${discount.toLocaleString('en-IN')} (was ₹${price.toLocaleString('en-IN')})`;
  if (price > 0) return `₹${price.toLocaleString('en-IN')}`;
  return 'Free';
};

const scoreMatch = (query, target) => {
  const qWords = query.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
  const t = (target || '').toLowerCase();
  if (!qWords.length) return 0;
  return qWords.reduce((acc, w) => acc + (t.includes(w) ? 1 : 0), 0) / qWords.length;
};

const relTime = (ts) => {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

/* ── localStorage helpers ── */
const readJson = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const loadIdentity = () => {
  const id = readJson(IDENTITY_KEY, null);
  return id && EMAIL_RE.test(id.email || '') ? id : null;
};
const loadSessions = (email) =>
  readJson(SESSIONS_KEY, []).filter((s) => s.email === email).sort((a, b) => b.updatedAt - a.updatedAt);
const persistSession = (session) => {
  const all = readJson(SESSIONS_KEY, []);
  const idx = all.findIndex((s) => s.id === session.id);
  if (idx >= 0) all[idx] = session; else all.push(session);
  /* Keep storage bounded: newest sessions first, per full store */
  const trimmed = all.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_SESSIONS * 2);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(trimmed));
};
const removeSession = (id) => {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(readJson(SESSIONS_KEY, []).filter((s) => s.id !== id)));
};

export default function ChatWidget() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('chat'); // 'chat' | 'history'
  const [identity, setIdentity] = useState(loadIdentity);

  /* Verification gate state */
  const [gate, setGate] = useState({ step: 'details', name: '', email: '', otp: '', busy: false, error: '' });

  /* Conversation state */
  const [sessionId, setSessionId] = useState(uid);
  const [messages, setMessages] = useState([]);
  const [flow, setFlow] = useState(null); // { step: 'phone'|'message', data: {type, productSlug?, courseSlug?, phone?} }
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [historyList, setHistoryList] = useState([]);

  const [products, setProducts] = useState(null);
  const [courses, setCourses] = useState(null);
  const bodyRef = useRef(null);
  const loadedRef = useRef(false);

  /* Load catalog once, on first open */
  useEffect(() => {
    if (!open || loadedRef.current) return;
    loadedRef.current = true;
    api.get('/products')
      .then((r) => setProducts((r.data?.data || []).filter((p) => p.isActive !== false)))
      .catch(() => setProducts([]));
    api.get('/courses')
      .then((r) => setCourses(r.data?.data || []))
      .catch(() => setCourses([]));
  }, [open]);

  /* Auto-scroll on new messages */
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, open, tab, gate.step]);

  /* Persist the current conversation whenever it changes */
  useEffect(() => {
    if (!identity || messages.length === 0) return;
    const firstUser = messages.find((m) => m.from === 'user');
    persistSession({
      id: sessionId,
      email: identity.email,
      title: truncate(firstUser?.text || 'New conversation', 42),
      createdAt: messages[0]?.at || Date.now(),
      updatedAt: Date.now(),
      messages: messages.slice(-MAX_MESSAGES),
      flow,
    });
  }, [messages, flow]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tab === 'history' && identity) setHistoryList(loadSessions(identity.email));
  }, [tab, identity]);

  const push = (...msgs) => setMessages((prev) => [...prev, ...msgs]);
  const goTo = (to) => { setOpen(false); navigate(to); };

  const findProduct = (slug) => (products || []).find((p) => p.slug === slug);
  const findCourse = (slug) => (courses || []).find((c) => c.slug === slug);
  const firstName = identity?.name?.trim().split(/\s+/)[0] || '';

  /* ── OTP verification gate ── */

  const sendOtp = async () => {
    const name = gate.name.trim();
    const email = gate.email.trim().toLowerCase();
    if (name.length < 2) { setGate((g) => ({ ...g, error: 'Please enter your name' })); return; }
    if (!EMAIL_RE.test(email)) { setGate((g) => ({ ...g, error: 'Please enter a valid email address' })); return; }
    setGate((g) => ({ ...g, busy: true, error: '' }));
    try {
      await api.post('/otp/send', { email });
      setGate((g) => ({ ...g, step: 'otp', busy: false, error: '', otp: '' }));
    } catch (err) {
      setGate((g) => ({ ...g, busy: false, error: err?.response?.data?.message || 'Could not send OTP. Please try again.' }));
    }
  };

  const verifyOtp = async () => {
    const email = gate.email.trim().toLowerCase();
    const otp = gate.otp.trim();
    if (otp.length !== 6) { setGate((g) => ({ ...g, error: 'Enter the 6-digit OTP from your email' })); return; }
    setGate((g) => ({ ...g, busy: true, error: '' }));
    try {
      await api.post('/otp/verify', { email, otp });
      const id = { name: gate.name.trim(), email, verifiedAt: Date.now() };
      localStorage.setItem(IDENTITY_KEY, JSON.stringify(id));
      setIdentity(id);
      setGate({ step: 'details', name: '', email: '', otp: '', busy: false, error: '' });
    } catch (err) {
      setGate((g) => ({ ...g, busy: false, error: err?.response?.data?.message || 'Invalid OTP. Please try again.' }));
    }
  };

  const changeIdentity = () => {
    localStorage.removeItem(IDENTITY_KEY);
    setIdentity(null);
    setMessages([]); setFlow(null); setSessionId(uid()); setTab('chat');
    setGate({ step: 'details', name: '', email: '', otp: '', busy: false, error: '' });
  };

  /* ── Session management ── */

  const newChat = () => { setMessages([]); setFlow(null); setSessionId(uid()); setTab('chat'); };

  const openSession = (s) => {
    setSessionId(s.id);
    setMessages(s.messages || []);
    setFlow(s.flow || null);
    setTab('chat');
  };

  const deleteSession = (e, s) => {
    e.stopPropagation();
    removeSession(s.id);
    setHistoryList(loadSessions(identity.email));
    if (s.id === sessionId) { setMessages([]); setFlow(null); setSessionId(uid()); }
  };

  /* ── Catalog answers (options carry serializable cmds) ── */

  const showProductList = () => {
    if (!products || products.length === 0) {
      push(botMsg('Our product catalog is loading — you can also browse it directly.', {
        links: [{ label: 'Open Products page', to: '/products' }],
      }));
      return;
    }
    push(botMsg('Here are our products. Tap one to know more:', {
      options: products.slice(0, 8).map((p) => ({ label: p.title, cmd: 'showProduct', arg: p.slug })),
    }));
  };

  const showProduct = (p) => {
    push(userMsg(p.title));
    const features = (p.features || []).slice(0, 4);
    const lines = [
      p.tagline || truncate(p.description),
      features.length ? `Key features:\n${features.map((f) => `• ${f}`).join('\n')}` : '',
    ].filter(Boolean).join('\n\n');
    push(botMsg(lines || `${p.title} — one of our flagship products.`, {
      links: [{ label: `View ${p.title}`, to: `/products/${p.slug}` }],
      options: [
        { label: '📩 Send inquiry about this product', cmd: 'enquiry', arg: { type: 'Product Inquiry', productSlug: p.slug } },
        { label: '❓ Ask a question about it', cmd: 'faqs', arg: p.slug },
      ],
    }));
  };

  const promptFaq = (p) => {
    push(userMsg('I have a question'));
    const faqs = (p.faqs || []).slice(0, 4);
    if (faqs.length) {
      push(botMsg(`Common questions about ${p.title}:`, {
        options: faqs.map((f) => ({ label: f.question, cmd: 'faqAnswer', arg: { q: f.question, a: f.answer } })),
      }));
    } else {
      push(botMsg(`Type your question about ${p.title} below, or send us an inquiry and our team will answer personally.`, {
        options: [{ label: '📩 Send inquiry', cmd: 'enquiry', arg: { type: 'Product Inquiry', productSlug: p.slug } }],
      }));
    }
  };

  const showCourseList = () => {
    if (!courses || courses.length === 0) {
      push(botMsg('Our course list is loading — you can also browse it directly.', {
        links: [{ label: 'Open Courses page', to: '/courses' }],
      }));
      return;
    }
    push(botMsg('Here are our courses. Tap one for details:', {
      options: courses.slice(0, 8).map((c) => ({ label: `${c.icon || '📚'} ${c.title}`, cmd: 'showCourse', arg: c.slug })),
    }));
  };

  const showCourse = (c) => {
    push(userMsg(c.title));
    const lines = [
      c.shortDescription || truncate(c.description),
      `• Duration: ${c.duration || 'Flexible'}`,
      `• Mode: ${c.mode || 'offline'} · Level: ${c.level || 'beginner'}`,
      `• Fees: ${formatPrice(c)}`,
    ].filter(Boolean).join('\n');
    push(botMsg(lines, {
      links: [{ label: `View ${c.title}`, to: `/courses/${c.slug}` }],
      options: [
        { label: '🎓 Enroll / get a callback', cmd: 'enquiry', arg: { type: 'Course Enrollment', courseSlug: c.slug } },
      ],
    }));
  };

  const showContact = () => {
    push(botMsg('You can reach the WorknAi team directly, or leave your details here and we will call you back.', {
      links: [{ label: 'Open Contact page', to: '/contact' }],
      options: [{ label: '📞 Request a callback', cmd: 'enquiry', arg: { type: 'General' } }],
    }));
  };

  const showJobs = () => {
    push(botMsg('We are always looking for talent! Check open positions or send a job inquiry.', {
      links: [
        { label: 'Open Careers page', to: '/career' },
        { label: 'Join Us — job / business inquiry', to: '/join-us' },
      ],
    }));
  };

  /* ── Command dispatcher (restored option buttons route through here) ── */

  const runCmd = (cmd, arg) => {
    switch (cmd) {
      case 'products': showProductList(); break;
      case 'courses': showCourseList(); break;
      case 'jobs': showJobs(); break;
      case 'contact': showContact(); break;
      case 'showProduct': { const p = findProduct(arg); if (p) showProduct(p); else showProductList(); break; }
      case 'showCourse': { const c = findCourse(arg); if (c) showCourse(c); else showCourseList(); break; }
      case 'faqs': { const p = findProduct(arg); if (p) promptFaq(p); else showProductList(); break; }
      case 'faqAnswer': push(userMsg(arg.q), botMsg(arg.a)); break;
      case 'enquiry': startEnquiry(arg); break;
      case 'skipPhone': skipStep('phone'); break;
      case 'skipMessage': skipStep('message'); break;
      default: break;
    }
  };

  /* ── Enquiry capture flow (email already verified → phone → message) ── */

  const enquiryAbout = (data) => findProduct(data.productSlug)?.title || findCourse(data.courseSlug)?.title || '';

  const startEnquiry = (ctx = {}) => {
    const about = enquiryAbout(ctx);
    push(userMsg(about ? `I want to inquire about ${about}` : 'I want to talk to the team'));
    push(botMsg(`Sure${firstName ? `, ${firstName}` : ''}! Your email ${identity.email} is already verified ✅\n\nWhat is your phone number? (or tap Skip)`, {
      options: [{ label: 'Skip', cmd: 'skipPhone' }],
    }));
    setFlow({ step: 'phone', data: { ...ctx } });
  };

  const askMessage = (data) => {
    const about = enquiryAbout(data);
    push(botMsg(`Almost done! Any message for our team?${about ? ` (e.g. what you'd like to know about ${about})` : ''}`, {
      options: [{ label: 'Skip — just contact me', cmd: 'skipMessage' }],
    }));
  };

  const advanceFlow = async (text) => {
    const { step, data } = flow;

    if (step === 'phone') {
      const phone = text.trim();
      if (phone && !/^[+\d][\d\s-]{6,15}$/.test(phone)) {
        push(botMsg('That phone number looks off — type it again, or tap Skip.', {
          options: [{ label: 'Skip', cmd: 'skipPhone' }],
        }));
        return;
      }
      askMessage(data);
      setFlow({ step: 'message', data: { ...data, phone } });
      return;
    }

    if (step === 'message') {
      await submitEnquiry({ ...data, message: text.trim() });
    }
  };

  const skipStep = (fromStep) => {
    setFlow((current) => {
      if (!current || current.step !== fromStep) return current;
      if (fromStep === 'phone') {
        push(userMsg('Skip'));
        askMessage(current.data);
        return { step: 'message', data: { ...current.data, phone: '' } };
      }
      if (fromStep === 'message') {
        push(userMsg('Skip'));
        submitEnquiry({ ...current.data, message: '' });
        return null;
      }
      return current;
    });
  };

  const submitEnquiry = async (data) => {
    setSending(true);
    setFlow(null);
    const product = findProduct(data.productSlug);
    const course = findCourse(data.courseSlug);
    const about = product?.title || course?.title;
    const fallbackMsg = about
      ? `Interested in ${about} — please reach out with more details.`
      : 'Chatbot lead — please reach out with more details.';
    try {
      await api.post('/inquiries', {
        name: identity.name,
        email: identity.email,
        phone: data.phone || '',
        type: data.type || 'General',
        source: 'chatbot',
        message: data.message || fallbackMsg,
        product: product?._id || null,
        course: course?._id || null,
      });
      push(botMsg(`✅ Done${firstName ? `, ${firstName}` : ''}! Your inquiry has been submitted — our team will contact you at ${identity.email} soon.\n\nAnything else I can help with?`, {
        options: [
          { label: '🛍️ Explore products', cmd: 'products' },
          { label: '📚 Browse courses', cmd: 'courses' },
        ],
      }));
    } catch (err) {
      push(botMsg(`Sorry, something went wrong while submitting (${err?.response?.data?.message || 'network error'}). Please try again or use the Contact page.`, {
        links: [{ label: 'Open Contact page', to: '/contact' }],
      }));
    } finally {
      setSending(false);
    }
  };

  /* ── Free-text understanding (keyword rules + catalog search) ── */

  const handleFreeText = (text) => {
    const q = text.toLowerCase();

    if (/^(hi|hii+|hello|hey|namaste|namaskar)\b/.test(q)) {
      push(botMsg(`Hello${firstName ? ` ${firstName}` : ''}! 👋 I can tell you about our products and courses, or connect you with the team. What would you like to do?`, {
        options: [
          { label: '🛍️ Explore products', cmd: 'products' },
          { label: '📚 Browse courses', cmd: 'courses' },
          { label: '📞 Talk to the team', cmd: 'enquiry', arg: { type: 'General' } },
        ],
      }));
      return;
    }
    if (/thank|dhanyavad|shukriya/.test(q)) { push(botMsg('You are welcome! 😊 Anything else I can help with?')); return; }

    const prodHit = (products || []).map((p) => ({ p, s: scoreMatch(q, `${p.title} ${p.category} ${p.tagline}`) }))
      .sort((a, b) => b.s - a.s)[0];
    const courseHit = (courses || []).map((c) => ({ c, s: scoreMatch(q, `${c.title} ${c.category} ${c.shortDescription}`) }))
      .sort((a, b) => b.s - a.s)[0];

    let faqHit = null;
    (products || []).forEach((p) => (p.faqs || []).forEach((f) => {
      const s = scoreMatch(q, f.question);
      if (!faqHit || s > faqHit.s) faqHit = { f, p, s };
    }));

    if (faqHit && faqHit.s >= 0.6) {
      push(botMsg(`${faqHit.f.answer}\n\n(From ${faqHit.p.title} FAQs)`, {
        links: [{ label: `View ${faqHit.p.title}`, to: `/products/${faqHit.p.slug}` }],
      }));
      return;
    }
    if (prodHit && prodHit.s >= 0.5 && prodHit.s >= (courseHit?.s || 0)) { showProduct(prodHit.p); return; }
    if (courseHit && courseHit.s >= 0.5) { showCourse(courseHit.c); return; }

    if (/price|pricing|cost|fee|fees|charge|kitna/.test(q)) {
      push(botMsg('Course fees are listed on each course card, and product pricing depends on your requirements — our team shares a custom quote.', {
        options: [
          { label: '📚 See course fees', cmd: 'courses' },
          { label: '💰 Get a product quote', cmd: 'enquiry', arg: { type: 'Purchase Inquiry' } },
        ],
      }));
      return;
    }
    if (/product|software|app|solution|tool/.test(q)) { showProductList(); return; }
    if (/course|training|class|learn|coaching|internship/.test(q)) { showCourseList(); return; }
    if (/job|career|hiring|vacancy|naukri|opening/.test(q)) { showJobs(); return; }
    if (/contact|call|phone|email|address|office|location|baat/.test(q)) { showContact(); return; }
    if (/demo|buy|purchase|quote|enquir|inquir|interest/.test(q)) { startEnquiry({ type: 'General' }); return; }

    push(botMsg("I'm not fully sure about that one — but our team definitely is! Meanwhile, here's what I can help with:", {
      options: [
        { label: '🛍️ Explore products', cmd: 'products' },
        { label: '📚 Browse courses', cmd: 'courses' },
        { label: '📞 Ask the team directly', cmd: 'enquiry', arg: { type: 'General' } },
      ],
    }));
  };

  const send = () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    push(userMsg(text));
    if (flow) advanceFlow(text);
    else handleFreeText(text);
  };

  const quickActions = [
    { label: 'Explore our Products', cmd: 'products' },
    { label: 'Browse our Courses', cmd: 'courses' },
    { label: 'Request a Callback', cmd: 'enquiry', arg: { type: 'General' } },
  ];

  const chips = [
    { label: 'Products', icon: Package, cmd: 'products' },
    { label: 'Courses', icon: GraduationCap, cmd: 'courses' },
    { label: 'Careers', icon: Briefcase, cmd: 'jobs' },
    { label: 'Contact', icon: Phone, cmd: 'contact' },
  ];

  const empty = messages.length === 0;
  const inputCls = 'w-full bg-white/5 border border-violet-500/25 rounded-xl py-2.5 px-3.5 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-violet-400/60 transition-colors';

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Chat with WorknAi'}
        className="fixed bottom-5 right-5 z-[70] w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-500/40 flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="fixed z-[70] bottom-24 right-5 left-5 sm:left-auto sm:w-[380px] max-h-[calc(100dvh-130px)] h-[560px] glass-strong rounded-2xl border border-violet-500/25 shadow-2xl shadow-violet-950/40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-violet-500/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink leading-tight">WorknAi Assistant</p>
                  <p className="text-[11px] text-emerald-400 leading-tight">● Online — instant answers</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-ink-dim hover:text-ink transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ══ Verification gate ══ */}
            {!identity ? (
              <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-ink">Verify your email to chat</h3>
                  <p className="text-sm text-ink-dim mt-1.5">
                    {gate.step === 'details'
                      ? 'We will send a 6-digit OTP to your email. Your chat history stays linked to it.'
                      : <>Enter the 6-digit code sent to <span className="text-ink font-medium">{gate.email.trim()}</span></>}
                  </p>
                </div>

                {gate.step === 'details' ? (
                  <div className="space-y-3">
                    <input
                      className={inputCls}
                      placeholder="Your name"
                      value={gate.name}
                      onChange={(e) => setGate((g) => ({ ...g, name: e.target.value, error: '' }))}
                    />
                    <input
                      className={inputCls}
                      type="email"
                      placeholder="Email address"
                      value={gate.email}
                      onChange={(e) => setGate((g) => ({ ...g, email: e.target.value, error: '' }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') sendOtp(); }}
                    />
                    {gate.error && <p className="text-xs text-red-400">{gate.error}</p>}
                    <button
                      onClick={sendOtp}
                      disabled={gate.busy}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white text-sm font-semibold disabled:opacity-50 transition-opacity"
                    >
                      {gate.busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                      {gate.busy ? 'Sending OTP…' : 'Send OTP'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      className={`${inputCls} text-center text-xl tracking-[0.5em] font-semibold`}
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="••••••"
                      value={gate.otp}
                      onChange={(e) => setGate((g) => ({ ...g, otp: e.target.value.replace(/\D/g, ''), error: '' }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') verifyOtp(); }}
                      autoFocus
                    />
                    {gate.error && <p className="text-xs text-red-400 text-center">{gate.error}</p>}
                    <button
                      onClick={verifyOtp}
                      disabled={gate.busy}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white text-sm font-semibold disabled:opacity-50 transition-opacity"
                    >
                      {gate.busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                      {gate.busy ? 'Verifying…' : 'Verify & Start Chat'}
                    </button>
                    <div className="flex justify-center gap-4 text-xs text-ink-dim">
                      <button onClick={sendOtp} disabled={gate.busy} className="hover:text-violet-300 transition-colors">Resend OTP</button>
                      <span>·</span>
                      <button onClick={() => setGate((g) => ({ ...g, step: 'details', otp: '', error: '' }))} className="hover:text-violet-300 transition-colors">Change email</button>
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-ink-faint text-center mt-auto pt-6 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Instant answers from the WorknAi catalog
                </p>
              </div>
            ) : (
              <>
                {/* ══ Tabs: Chat | History + New ══ */}
                <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
                  <div className="flex items-center gap-1 p-0.5 rounded-full border border-violet-500/20 bg-white/5">
                    <button
                      onClick={() => setTab('chat')}
                      className={`px-3.5 py-1 rounded-full text-[12px] font-medium transition-all ${tab === 'chat' ? 'bg-violet-500/25 text-ink' : 'text-ink-dim hover:text-ink'}`}
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => setTab('history')}
                      className={`flex items-center gap-1 px-3.5 py-1 rounded-full text-[12px] font-medium transition-all ${tab === 'history' ? 'bg-violet-500/25 text-ink' : 'text-ink-dim hover:text-ink'}`}
                    >
                      <History className="w-3 h-3" /> History
                    </button>
                  </div>
                  <button
                    onClick={newChat}
                    title="Start a new chat"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] text-ink-dim border border-violet-500/20 hover:text-ink hover:border-violet-400/50 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> New
                  </button>
                </div>

                {tab === 'history' ? (
                  /* ══ History tab ══ */
                  <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                    {historyList.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center px-6">
                        <History className="w-8 h-8 text-ink-faint mb-3" />
                        <p className="text-sm text-ink-dim">No conversations yet.</p>
                        <p className="text-xs text-ink-faint mt-1">Your chats will be saved here so you can continue them anytime.</p>
                      </div>
                    ) : (
                      historyList.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => openSession(s)}
                          className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all group ${s.id === sessionId ? 'border-violet-400/50 bg-violet-500/10' : 'border-violet-500/15 hover:border-violet-400/40 hover:bg-violet-500/5'}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm text-ink font-medium truncate">{s.title}</p>
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => deleteSession(e, s)}
                              onKeyDown={(e) => { if (e.key === 'Enter') deleteSession(e, s); }}
                              aria-label="Delete conversation"
                              className="shrink-0 text-ink-faint hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-[11px] text-ink-faint">{(s.messages || []).length} messages · {relTime(s.updatedAt)}</p>
                            <span className="flex items-center gap-0.5 text-[11px] text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity">
                              Continue <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                    <div className="pt-2 text-center">
                      <p className="text-[11px] text-ink-faint">
                        Verified as <span className="text-ink-dim">{identity.email}</span>{' '}
                        · <button onClick={changeIdentity} className="text-violet-300 hover:text-violet-200 transition-colors">Change</button>
                      </p>
                    </div>
                  </div>
                ) : (
                  /* ══ Chat tab ══ */
                  <div ref={bodyRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                    {empty ? (
                      <div className="h-full flex flex-col justify-between">
                        <div className="text-center pt-8">
                          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center mb-4">
                            <Sparkles className="w-7 h-7 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-ink">Hello {firstName || 'there'} 👋</h3>
                          <p className="text-sm text-ink-dim mt-1">How can I help you today?</p>
                        </div>
                        <div className="space-y-1">
                          {quickActions.map((qa) => (
                            <button
                              key={qa.label}
                              onClick={() => runCmd(qa.cmd, qa.arg)}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm text-ink hover:bg-violet-500/10 transition-colors"
                            >
                              <ArrowUpRight className="w-4 h-4 text-violet-400 shrink-0" />
                              {qa.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      messages.map((m) => (
                        <div key={m.id} className={m.from === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                          <div className={
                            m.from === 'user'
                              ? 'max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white px-3.5 py-2.5 text-sm whitespace-pre-line'
                              : 'max-w-[85%] rounded-2xl rounded-bl-md glass border border-violet-500/15 text-ink px-3.5 py-2.5 text-sm whitespace-pre-line'
                          }>
                            {m.text}
                            {m.links?.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {m.links.map((l) => (
                                  <button
                                    key={l.label}
                                    onClick={() => goTo(l.to)}
                                    className="flex items-center gap-1.5 text-violet-300 hover:text-violet-200 text-[13px] font-medium transition-colors"
                                  >
                                    <ArrowUpRight className="w-3.5 h-3.5" /> {l.label}
                                  </button>
                                ))}
                              </div>
                            )}
                            {m.options?.length > 0 && (
                              <div className="mt-2.5 flex flex-wrap gap-1.5">
                                {m.options.map((o) => (
                                  <button
                                    key={o.label}
                                    onClick={() => runCmd(o.cmd, o.arg)}
                                    className="px-3 py-1.5 rounded-full text-[13px] border border-violet-400/40 text-ink hover:bg-violet-500/15 transition-colors"
                                  >
                                    {o.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    {sending && (
                      <div className="flex items-center gap-2 text-ink-dim text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting your inquiry…
                      </div>
                    )}
                  </div>
                )}

                {/* Category chips + input (chat tab only) */}
                {tab === 'chat' && (
                  <>
                    <div className="px-3 pt-2 flex gap-1.5 flex-wrap">
                      {chips.map((c) => (
                        <button
                          key={c.label}
                          onClick={() => runCmd(c.cmd)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] border border-violet-500/25 text-ink-dim hover:text-ink hover:border-violet-400/50 hover:bg-violet-500/10 transition-all"
                        >
                          <c.icon className="w-3 h-3" /> {c.label}
                        </button>
                      ))}
                    </div>
                    <div className="p-3">
                      <div className="flex items-end gap-2 rounded-2xl border border-violet-500/25 bg-white/5 px-3 py-2 focus-within:border-violet-400/60 transition-colors">
                        <input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                          placeholder={flow ? 'Type your answer…' : 'Ask about our products, courses…'}
                          className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none py-1"
                        />
                        <button
                          onClick={send}
                          disabled={!input.trim() || sending}
                          aria-label="Send"
                          className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white flex items-center justify-center disabled:opacity-40 transition-opacity"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] text-ink-faint text-center mt-1.5 flex items-center justify-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Instant answers from the WorknAi catalog
                      </p>
                    </div>
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
