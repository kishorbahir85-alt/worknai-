import { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  BookOpen, Users, IndianRupee, Check, Loader2,
  ChevronDown, ChevronUp, Phone, GraduationCap, MapPin,
  Key, Calendar, RefreshCw, User, Mail, Receipt,
  ClipboardList, CheckCircle, XCircle, BadgeCheck,
} from 'lucide-react';

const paymentStyle = {
  free:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  paid:    'bg-green-500/15 text-green-400 border-green-500/30',
};

const appStatusStyle = {
  pending:   'bg-amber-500/15 text-amber-400 border-amber-500/30',
  approved:  'bg-blue-500/15 text-blue-400 border-blue-500/30',
  confirmed: 'bg-green-500/15 text-green-400 border-green-500/30',
  rejected:  'bg-red-500/15 text-red-400 border-red-500/30',
};

const appStatusLabel = {
  pending:   'Pending Review',
  approved:  'Approved',
  confirmed: 'Confirmed',
  rejected:  'Rejected',
};

function DetailItem({ icon: Icon, label, value, mono }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={13} className="text-slate-500 shrink-0 mt-0.5"/>
      <div>
        <p className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</p>
        <p className={`text-sm text-slate-200 ${mono ? 'font-mono font-bold tracking-widest' : ''}`}>{value || '—'}</p>
      </div>
    </div>
  );
}

function OfflineApplicationRow({ enrollment, onStatusUpdate }) {
  const [open, setOpen]     = useState(false);
  const [saving, setSaving] = useState(false);
  const [note, setNote]     = useState('');
  const sd = enrollment.studentDetails || {};

  const updateStatus = async (status) => {
    setSaving(true);
    try {
      await api.put(`/enrollments/${enrollment._id}/status`, { applicationStatus: status, statusNote: note });
      onStatusUpdate(enrollment._id, status, note);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const current = enrollment.applicationStatus || 'pending';

  return (
    <div className="border-b border-slate-800/60 last:border-0">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-4 px-5 py-3 hover:bg-slate-800/30 transition-colors text-left">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0 overflow-hidden">
          {enrollment.user?.avatar
            ? <img src={enrollment.user.avatar} alt="" className="w-full h-full object-cover"/>
            : enrollment.user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-200 font-medium text-sm truncate">{sd.name || enrollment.user?.name}</p>
          <p className="text-slate-500 text-xs truncate">{enrollment.user?.email}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {enrollment.batchName && (
            <span className="hidden sm:block text-xs text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">{enrollment.batchName}</span>
          )}
          <span className={`text-xs font-medium border rounded-full px-2.5 py-0.5 ${appStatusStyle[current]}`}>
            {appStatusLabel[current]}
          </span>
          {open ? <ChevronUp size={14} className="text-slate-500"/> : <ChevronDown size={14} className="text-slate-500"/>}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-4 bg-slate-800/20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 pt-3">
            <DetailItem icon={User}          label="Full Name"     value={sd.name || enrollment.user?.name}/>
            <DetailItem icon={Mail}          label="Email"         value={enrollment.user?.email}/>
            <DetailItem icon={Phone}         label="Phone"         value={sd.phone}/>
            <DetailItem icon={GraduationCap} label="Qualification" value={sd.qualification}/>
            <DetailItem icon={MapPin}        label="Address"       value={sd.address}/>
            <DetailItem icon={Calendar}      label="Applied On"    value={new Date(enrollment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}/>
            {enrollment.batchName && <DetailItem icon={Calendar} label="Batch" value={enrollment.batchName}/>}
          </div>

          <div className="mb-3">
            <label className="text-[10px] text-slate-500 uppercase tracking-wide mb-1 block">Note for Student (optional)</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Please bring your documents on the first day"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {current !== 'approved' && current !== 'confirmed' && (
              <button
                onClick={() => updateStatus('approved')}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 text-xs font-medium transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 size={12} className="animate-spin"/> : <CheckCircle size={12}/>}
                Approve
              </button>
            )}
            {current !== 'confirmed' && (
              <button
                onClick={() => updateStatus('confirmed')}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 text-xs font-medium transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 size={12} className="animate-spin"/> : <BadgeCheck size={12}/>}
                Confirm Enrollment
              </button>
            )}
            {current !== 'rejected' && (
              <button
                onClick={() => updateStatus('rejected')}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 text-xs font-medium transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 size={12} className="animate-spin"/> : <XCircle size={12}/>}
                Reject
              </button>
            )}
            {current === 'rejected' && (
              <button
                onClick={() => updateStatus('pending')}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-600/20 border border-slate-500/30 text-slate-400 hover:bg-slate-600/30 text-xs font-medium transition-colors disabled:opacity-50"
              >
                Reset to Pending
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function EnrollmentRow({ enrollment, onUpdate }) {
  const [open, setOpen]     = useState(false);
  const [saving, setSaving] = useState(false);
  const sd = enrollment.studentDetails || {};

  const markPaid = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/enrollments/${enrollment._id}/payment`, { paymentStatus: 'paid' });
      const code = res.data.data.accessCode;
      toast.success(code ? `Payment confirmed! Access Code: ${code}` : 'Payment confirmed!', { duration: 6000 });
      onUpdate(enrollment._id, 'paid', code);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-b border-slate-800/60 last:border-0">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-4 px-5 py-3 hover:bg-slate-800/30 transition-colors text-left">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0 overflow-hidden">
          {enrollment.user?.avatar
            ? <img src={enrollment.user.avatar} alt="" className="w-full h-full object-cover"/>
            : enrollment.user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-200 font-medium text-sm truncate">{sd.name || enrollment.user?.name}</p>
          <p className="text-slate-500 text-xs truncate">{enrollment.user?.email}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {enrollment.batchName && <span className="hidden sm:block text-xs text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">{enrollment.batchName}</span>}
          <span className="text-slate-400 text-xs hidden sm:block">{enrollment.amount ? `₹${enrollment.amount}` : 'Free'}</span>
          <span className={`text-xs font-medium border rounded-full px-2.5 py-0.5 capitalize ${paymentStyle[enrollment.paymentStatus]}`}>
            {enrollment.paymentStatus}
          </span>
          {open ? <ChevronUp size={14} className="text-slate-500"/> : <ChevronDown size={14} className="text-slate-500"/>}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-4 bg-slate-800/20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 pt-3">
            <DetailItem icon={User}          label="Full Name"       value={sd.name || enrollment.user?.name}/>
            <DetailItem icon={Mail}          label="Email"           value={enrollment.user?.email}/>
            <DetailItem icon={Phone}         label="Phone"           value={sd.phone}/>
            <DetailItem icon={GraduationCap} label="Qualification"   value={sd.qualification}/>
            <DetailItem icon={MapPin}        label="Address"         value={sd.address}/>
            <DetailItem icon={Calendar}      label="Enrolled On"     value={new Date(enrollment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}/>
            {enrollment.batchName      && <DetailItem icon={Calendar} label="Batch"           value={enrollment.batchName}/>}
            {enrollment.transactionRef && <DetailItem icon={Receipt}  label="Transaction Ref" value={enrollment.transactionRef}/>}
            {enrollment.accessCode     && <DetailItem icon={Key}      label="Access Code"     value={enrollment.accessCode} mono/>}
          </div>

          {enrollment.paymentStatus === 'pending' && (
            <button onClick={markPaid} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 text-xs font-medium transition-colors disabled:opacity-50">
              {saving ? <Loader2 size={12} className="animate-spin"/> : <Check size={12}/>}
              Confirm Payment & Generate Access Code
            </button>
          )}
          {enrollment.paymentStatus === 'paid' && enrollment.accessCode && (
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-lg px-3 py-2 mt-2">
              <Key size={12} className="text-violet-400"/>
              <span className="text-xs text-slate-400">Access Code:</span>
              <span className="font-mono text-sm font-bold text-white tracking-widest">{enrollment.accessCode}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, enrollments, onUpdate, onStatusUpdate }) {
  const [open, setOpen] = useState(false);
  const isOffline = course.mode === 'offline';

  const offlineApps  = enrollments.filter(e => e.enrollmentType === 'offline');
  const onlineEnroll = enrollments.filter(e => e.enrollmentType !== 'offline');

  const pendingApps    = offlineApps.filter(e => e.applicationStatus === 'pending').length;
  const pendingPayment = onlineEnroll.filter(e => e.paymentStatus === 'pending').length;
  const revenue        = onlineEnroll.filter(e => e.paymentStatus === 'paid').reduce((s, e) => s + (e.amount || 0), 0);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-800/40 transition-colors text-left">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            {isOffline ? <ClipboardList size={16} className="text-emerald-400"/> : <BookOpen size={16} className="text-emerald-400"/>}
          </div>
          <div>
            <p className="text-slate-100 font-semibold">{course.icon} {course.title}</p>
            <p className="text-slate-500 text-xs capitalize">{course.level} · {course.mode} · {course.price ? `₹${course.price}` : 'Free'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-800 rounded-full px-3 py-1">
            <Users size={13} className="text-emerald-400"/>
            <span className="text-slate-200 text-sm font-medium">{enrollments.length}</span>
          </div>
          {pendingApps > 0 && <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-0.5">{pendingApps} new request{pendingApps > 1 ? 's' : ''}</span>}
          {pendingPayment > 0 && <span className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-2.5 py-0.5">{pendingPayment} pending</span>}
          {revenue > 0 && <span className="hidden sm:flex items-center gap-1 text-emerald-400 text-sm font-medium"><IndianRupee size={13}/>{revenue.toLocaleString()}</span>}
          {open ? <ChevronUp size={16} className="text-slate-500"/> : <ChevronDown size={16} className="text-slate-500"/>}
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-800">
          {enrollments.length === 0 ? (
            <p className="text-center text-slate-500 text-sm py-6">No applications yet</p>
          ) : (
            <>
              {offlineApps.length > 0 && (
                <div>
                  <p className="px-5 py-2 text-[10px] text-amber-400 uppercase tracking-wider font-semibold bg-amber-500/5 border-b border-slate-800/60">
                    Offline Course Applications ({offlineApps.length})
                  </p>
                  {offlineApps.map(e => (
                    <OfflineApplicationRow key={e._id} enrollment={e} onStatusUpdate={onStatusUpdate}/>
                  ))}
                </div>
              )}
              {onlineEnroll.length > 0 && (
                <div>
                  {offlineApps.length > 0 && (
                    <p className="px-5 py-2 text-[10px] text-violet-400 uppercase tracking-wider font-semibold bg-violet-500/5 border-b border-slate-800/60">
                      Online Enrollments ({onlineEnroll.length})
                    </p>
                  )}
                  {onlineEnroll.map(e => (
                    <EnrollmentRow key={e._id} enrollment={e} onUpdate={onUpdate}/>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function ManagerEnrollments() {
  const [courses, setCourses]                         = useState([]);
  const [enrollmentsByCourse, setEnrollmentsByCourse] = useState({});
  const [loading, setLoading]                         = useState(true);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [coursesRes, enrollRes] = await Promise.all([
        api.get('/courses'),
        api.get('/enrollments'),
      ]);
      setCourses(coursesRes.data.data);
      const grouped = {};
      enrollRes.data.data.forEach(e => {
        const cid = e.course?._id || e.course;
        if (!grouped[cid]) grouped[cid] = [];
        grouped[cid].push(e);
      });
      setEnrollmentsByCourse(grouped);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, []);

  const handleUpdate = (enrollId, newStatus, accessCode) => {
    setEnrollmentsByCourse(prev => {
      const next = { ...prev };
      for (const cid in next) {
        next[cid] = next[cid].map(e =>
          e._id === enrollId ? { ...e, paymentStatus: newStatus, accessCode: accessCode || e.accessCode } : e
        );
      }
      return next;
    });
  };

  const handleStatusUpdate = (enrollId, newAppStatus, note) => {
    setEnrollmentsByCourse(prev => {
      const next = { ...prev };
      for (const cid in next) {
        next[cid] = next[cid].map(e =>
          e._id === enrollId ? { ...e, applicationStatus: newAppStatus, statusNote: note || e.statusNote } : e
        );
      }
      return next;
    });
  };

  const allEnrollments  = Object.values(enrollmentsByCourse).flat();
  const pendingRequests = allEnrollments.filter(e => e.enrollmentType === 'offline' && e.applicationStatus === 'pending').length;
  const totalPending    = allEnrollments.filter(e => e.enrollmentType !== 'offline' && e.paymentStatus === 'pending').length;
  const totalRevenue    = allEnrollments.filter(e => e.paymentStatus === 'paid').reduce((s, e) => s + (e.amount || 0), 0);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Enrollments & Applications</h1>
          <p className="mt-1 text-slate-400 text-sm">
            {allEnrollments.length} total
            {pendingRequests > 0 && <> · <span className="text-amber-400">{pendingRequests} offline request{pendingRequests > 1 ? 's' : ''} pending</span></>}
            {totalPending > 0 && <> · <span className="text-yellow-400">{totalPending} pending payment</span></>}
            {totalRevenue > 0 && <> · <span className="text-emerald-400">₹{totalRevenue.toLocaleString()} collected</span></>}
          </p>
        </div>
        <button onClick={loadAll} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white text-sm transition-colors">
          <RefreshCw size={14}/> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin"/></div>
      ) : (
        <div className="flex flex-col gap-4">
          {courses.filter(c => enrollmentsByCourse[c._id]?.length > 0).map(c => (
            <CourseCard
              key={c._id}
              course={c}
              enrollments={enrollmentsByCourse[c._id] || []}
              onUpdate={handleUpdate}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
          {courses.every(c => !enrollmentsByCourse[c._id]?.length) && (
            <div className="text-center py-16 text-slate-500"><BookOpen size={40} className="mx-auto mb-3 opacity-30"/>No enrollments yet</div>
          )}
        </div>
      )}
    </section>
  );
}
