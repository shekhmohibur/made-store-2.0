import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';

const LOOKS = [
    {
        id: 'LK-1',
        title: 'The Modern Tailored Flared Silhouette',
        season: 'Autumn / Winter Capsule',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80',
        featuredProductId: 'UT-6',
        productName: 'Handmade Flared Wool Jacket',
        price: '$129.90 USD',
        description: 'Structured wool tailoring paired with relaxed trousers and minimalist leather accessories.',
    },
    {
        id: 'LK-2',
        title: 'Architectural Shawl Wool Overcoat',
        season: 'Winter Runway Drop',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80',
        featuredProductId: 'UT-7',
        productName: 'Coat With Wool Wraparound Collar',
        price: '$105.89 USD',
        description: 'Monochromatic warm taupe wool overcoat with dropped shoulder framing.',
    },
    {
        id: 'LK-3',
        title: 'Mulberry Silk Bias Cut Evening Grace',
        season: 'Haute Couture Evening Wear',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&auto=format&fit=crop&q=80',
        featuredProductId: 'UT-5',
        productName: 'Mulberry Silk Bias Cut Slip Dress',
        price: '$98.00 USD',
        description: 'Pure 19mm Grade 6A silk tailored on the bias for fluid evening movement.',
    },
    {
        id: 'LK-4',
        title: 'Tactical Utility Workwear & Raw Denim',
        season: 'Contemporary Streetwear',
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=1200&auto=format&fit=crop&q=80',
        featuredProductId: 'UT-1',
        productName: 'Vintage Washed Denim Jacket',
        price: '$89.00 USD',
        description: 'Heavyweight Japanese denim layered over minimalist graphic tees.',
    },
];

const Lookbook = () => {
    const { shop } = useOutletContext();
    const [selectedLook, setSelectedLook] = useState(LOOKS[0]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12 bg-white text-slate-900 font-sans">
            
            {/* Header */}
            <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-[11px] font-bold tracking-[0.25em] text-slate-400 uppercase">
                    EDITORIAL LOOKBOOK · {shop.name}
                </span>
                <h1 className="text-3xl sm:text-5xl font-serif tracking-[0.15em] uppercase text-slate-950 font-normal">
                    Season Runway Looks
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Explore curated full-body styling spreads crafted by our atelier designers. Click any piece to shop the look instantly.
                </p>
            </div>

            {/* Featured Hero Look Spread */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 text-white min-h-[500px] flex flex-col justify-end p-8 sm:p-14">
                <img
                    src={selectedLook.image}
                    alt={selectedLook.title}
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="relative z-10 max-w-xl space-y-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/20 backdrop-blur border border-white/20">
                        {selectedLook.season}
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-serif uppercase tracking-wider text-white">
                        {selectedLook.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {selectedLook.description}
                    </p>

                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-between gap-4 max-w-md">
                        <div>
                            <p className="font-bold text-white text-xs">{selectedLook.productName}</p>
                            <p className="font-black text-amber-300 text-sm">{selectedLook.price}</p>
                        </div>
                        <Link
                            to={`/shop/${shop.slug}/product/${selectedLook.featuredProductId}`}
                            className="px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition"
                        >
                            Shop Look →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Grid of All Looks */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="font-serif text-slate-950 text-lg uppercase tracking-wider">All Lookbook Spreads</h3>
                    <span className="text-xs font-mono text-slate-400">{LOOKS.length} Outfits</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {LOOKS.map((look) => (
                        <div
                            key={look.id}
                            onClick={() => setSelectedLook(look)}
                            className={`group cursor-pointer rounded-2xl overflow-hidden border-2 transition ${
                                selectedLook.id === look.id ? 'border-slate-950 ring-2 ring-slate-950/10' : 'border-slate-200 hover:border-slate-400'
                            }`}
                        >
                            <div className="aspect-[3/4] bg-slate-100 overflow-hidden relative">
                                <img
                                    src={look.image}
                                    alt={look.title}
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-xs p-3 rounded-xl text-white text-xs">
                                    <p className="font-bold truncate">{look.title}</p>
                                    <p className="text-[11px] text-slate-300 font-mono mt-0.5">{look.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Lookbook;
