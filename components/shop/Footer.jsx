export function Footer({ settings }) {
  return (
    <footer className="bg-white border-t border-stone-200/80 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <span className="font-serif font-bold tracking-[0.18em] text-sm text-stone-900">
          {settings?.storeName || "ATELIER THREADS"}
        </span>
        <div className="flex items-center gap-6">
          <span>Organic Heavyweight Textiles</span>
          <span>•</span>
          <a href={`mailto:${settings?.contactEmail}`} className="hover:text-stone-900 transition">
            {settings?.contactEmail || "support@atelierthreads.com"}
          </a>
        </div>
        <span>© {new Date().getFullYear()} All rights reserved.</span>
      </div>
    </footer>
  );
}