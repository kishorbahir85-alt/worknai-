import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = true,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isDestructive
                ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                : 'bg-violet-500/15 text-violet-400 border border-violet-500/20'
            }`}
          >
            {isDestructive ? <Trash2 size={20} /> : <AlertTriangle size={20} />}
          </div>
          <div className="pr-6">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 mt-6 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700/80 text-slate-300 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-white text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer flex items-center gap-2 ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-500 shadow-red-950/40'
                : 'bg-violet-600 hover:bg-violet-500 shadow-violet-950/40'
            } disabled:opacity-50`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
