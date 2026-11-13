const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PROCESSING: "bg-sky-50 text-sky-700 border-sky-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
  SOLD_OUT: "bg-stone-900 text-white border-stone-900",
  FEATURED: "bg-white/95 text-stone-900 border-stone-200/80 shadow-xs",
};

export function Badge({ status, children, className = "" }) {
  const style = STATUS_STYLES[status] || "bg-stone-100 text-stone-700 border-stone-200";
  return (
    <span
      className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${style} ${className}`}
    >
      {children || status}
    </span>
  );
}