import { useOutletContext, Link } from 'react-router-dom';
import {
    Sparkles, Truck, MapPin,
    Scissors, Leaf
} from 'lucide-react';

const AboutAtelier = () => {
    const { shop } = useOutletContext();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-16 bg-white text-slate-900 font-sans">
            
            {/* Hero Brand Story */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                        <Sparkles size={13} /> The Atelier Story
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-slate-950 uppercase leading-tight font-normal">
                        Crafting Timeless Silhouettes & Modern Elegance
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Founded with a mission to bridge architectural minimalism and artisanal garment construction, {shop.name} curates wardrobe essentials engineered for enduring wear.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Every coat, jacket, and dress is meticulously tailored using premium sustainable natural textiles—ranging from double-faced virgin wools to 19mm pure Grade 6A mulberry silks.
                    </p>

                    <div className="pt-2 flex items-center gap-4">
                        <Link
                            to={`/shop/${shop.slug}`}
                            className="px-8 py-3.5 bg-slate-950 text-white font-bold text-xs tracking-widest uppercase hover:bg-slate-800 transition shadow"
                        >
                            Explore Collections →
                        </Link>
                    </div>
                </div>

                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80"
                        alt="Atelier workspace"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Core Values Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-b border-slate-100">
                <div className="space-y-3 p-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900">
                        <Scissors size={22} />
                    </div>
                    <h3 className="font-serif text-base uppercase text-slate-950 font-bold">Artisanal Tailoring</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Precision French seams, reinforced stress points, and customized fits tailored by seasoned patternmakers.
                    </p>
                </div>

                <div className="space-y-3 p-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900">
                        <Leaf size={22} />
                    </div>
                    <h3 className="font-serif text-base uppercase text-slate-950 font-bold">Sustainable Fibers</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Ethically sourced organic cottons, recycled virgin wool blends, and biodegradable packaging materials.
                    </p>
                </div>

                <div className="space-y-3 p-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900">
                        <Truck size={22} />
                    </div>
                    <h3 className="font-serif text-base uppercase text-slate-950 font-bold">Global Express Delivery</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Nationwide and international insured express courier with real-time package tracking.
                    </p>
                </div>
            </div>

            {/* Physical Location Spotlight */}
            <div className="bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-3 max-w-lg">
                    <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                        <MapPin size={16} /> Physical Flagship Boutique
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif uppercase text-slate-950">Visit Our Flagship Store</h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Experience our complete catalog in person, try bespoke fitting sessions, and consult our private fashion stylists.
                    </p>
                    <div className="text-xs font-bold text-slate-800 space-y-1 pt-1">
                        <p>📍 {shop.location?.address || '742 Fashion Boulevard, Suite 500'}</p>
                        <p>🏙️ {shop.location?.city || 'New York, NY'} · {shop.location?.country || 'United States'}</p>
                        <p>🕒 Mon - Sat: 10:00 AM – 8:00 PM EST</p>
                    </div>
                </div>

                <Link
                    to={`/shop/${shop.slug}/contact`}
                    className="px-8 py-3.5 bg-slate-950 text-white font-bold text-xs tracking-widest uppercase hover:bg-slate-800 transition shadow shrink-0"
                >
                    Contact Concierge →
                </Link>
            </div>
        </div>
    );
};

export default AboutAtelier;
