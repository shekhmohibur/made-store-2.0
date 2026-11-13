export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium tracking-wider uppercase transition-all duration-200 rounded-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]";

  const variants = {
    primary: "bg-stone-900 text-white hover:bg-stone-800 shadow-xs",
    secondary: "bg-white text-stone-800 border border-stone-200 hover:border-stone-900 hover:bg-stone-50",
    subtle: "bg-stone-100 text-stone-800 hover:bg-stone-200/80",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white",
  };

  const sizes = {
    sm: "text-[11px] px-3 py-1.5",
    md: "text-xs px-5 py-2.5",
    lg: "text-xs px-8 py-3.5",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}