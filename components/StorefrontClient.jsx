"use client";

import { useState } from "react";
import { Search, ArrowDownRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/shop/Navbar";
import { ProductCard } from "@/components/shop/ProductCard";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { Footer } from "@/components/shop/Footer";

export default function StorefrontClient({ session, settings, categories, products }) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("NEWEST");

  const filteredProducts = products
    .filter((p) => (selectedCategory === "ALL" ? true : p.categoryId === selectedCategory))
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "PRICE_ASC") return a.price - b.price;
      if (sortBy === "PRICE_DESC") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        session={session}
        settings={settings}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Editorial Split Light Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs">
          <div className="lg:col-span-6 p-8 sm:p-14 flex flex-col justify-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400 mb-4">
              New Season Lookbook
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-stone-900 leading-[1.08] mb-5">
              {settings?.heroTitle || "Essential Form. Timeless Wear."}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-md mb-8">
              {settings?.heroSubtitle ||
                "Architectural outerwear, heavyweight tees, and tailored silhouettes crafted for everyday longevity."}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider px-7 py-3.5 rounded-md hover:bg-stone-800 transition"
              >
                {settings?.heroCtaText || "Explore Collection"}
                <ArrowDownRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 relative min-h-[360px] lg:min-h-[500px] bg-stone-100">
            <img
              src={
                settings?.heroImageUrl ||
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600"
              }
              alt="Collection Hero"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Subtle Value Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {[
            { icon: Truck, title: "Complimentary Shipping", desc: "Express delivery on orders over \$120" },
            { icon: RefreshCw, title: "30-Day Returns", desc: "Effortless size exchanges & refunds" },
            { icon: ShieldCheck, title: "Organic Heavyweight Cotton", desc: "Ethically milled 300+ GSM textiles" },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white/80 border border-stone-200/70 rounded-xl px-5 py-3.5 flex items-center gap-3.5"
            >
              <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-900">{title}</p>
                <p className="text-[11px] text-stone-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Catalog Section */}
      <main id="catalog" className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-200/80">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-stone-900">Curated Catalog</h2>
            <p className="text-xs text-stone-500 mt-1">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search pieces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-stone-200 rounded-full pl-9 pr-4 py-2 text-xs w-52 focus:w-64 focus:outline-none focus:border-stone-900 transition-all"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-stone-200 rounded-full px-4 py-2 text-xs font-medium text-stone-700 focus:outline-none focus:border-stone-900"
            >
              <option value="NEWEST">Sort: Featured</option>
              <option value="PRICE_ASC">Price: Low to High</option>
              <option value="PRICE_DESC">Price: High to Low</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200/80 p-16 text-center">
            <p className="font-serif text-xl text-stone-800 mb-1">No garments found</p>
            <p className="text-xs text-stone-500">Try clearing your search or switching categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer settings={settings} />
      <CartDrawer session={session} storeName={settings?.storeName} />
    </div>
  );
}