export function Input({ label, className = "", ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-white border border-stone-200 rounded-md px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/5 transition ${className}`}
        {...props}
      />
    </div>
  );
}

export function Textarea({ label, className = "", ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        rows={3}
        className={`w-full bg-white border border-stone-200 rounded-md px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/5 transition ${className}`}
        {...props}
      />
    </div>
  );
}

export function Select({ label, children, className = "", ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-white border border-stone-200 rounded-md px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/5 transition ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}