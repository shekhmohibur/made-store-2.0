import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-950 text-zinc-400">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <span className="text-xl font-black tracking-tighter text-white">
            ATELIER<span className="text-zinc-500">.</span>
          </span>
          <p className="mt-3 text-sm leading-relaxed">
            Contemporary everyday essentials crafted with precision fabrics and timeless silhouettes.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/shop?sort=newest" className="hover:text-white">New Arrivals</Link></li>
            <li><Link href="/shop?category=men" className="hover:text-white">Men</Link></li>
            <li><Link href="/shop?category=women" className="hover:text-white">Women</Link></li>
            <li><Link href="/shop?sale=true" className="hover:text-white">Sale</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Account</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/profile" className="hover:text-white">Profile & Linked Logins</Link></li>
            <li><Link href="/profile/orders" className="hover:text-white">Order History</Link></li>
            <li><Link href="/login" className="hover:text-white">Sign In</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Support</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Shipping & Returns</li>
            <li>Size Guide</li>
            <li>Contact Us</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}