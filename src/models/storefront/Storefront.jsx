import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
    ShoppingBag, Star, Heart,
    Eye, X, Gift,
    Diamond, Share2, Flame, Clock, Sparkles, MessageCircle, Send
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { findThemeById } from '../../themes/themeCatalog';

const BLOG_POSTS = [
    {
        id: 1,
        title: 'The Art of Minimalist Capsule Wardrobes: 10 Essential Pieces',
        date: 'FEB 12, 2025',
        author: 'Evelyn Vane',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
        excerpt: 'Discover how curated double-faced wool coats and relaxed linen tailoring simplify your daily fashion rotation.',
    },
    {
        id: 2,
        title: 'Autumn / Winter Runway Trends & Monochromatic Palettes',
        date: 'FEB 08, 2025',
        author: 'Marc Dubois',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
        excerpt: 'From oversized dropped shoulders to tailored wraparound shawls, explore this season’s defining silhouettes.',
    },
    {
        id: 3,
        title: 'Sustainable Grade 6A Mulberry Silks & Artisanal Weaves',
        date: 'JAN 28, 2025',
        author: 'Sophia Chen',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
        excerpt: 'Inside our Milan atelier: the craftsmanship, French seams, and sustainable natural fibers behind every piece.',
    },
];

const BRANDS = ['ZARA', 'MANGO', 'PULL&BEAR', 'H&M', 'BERSHKA', 'MASSIMO DUTTI'];

const RECENT_BUYERS = [
    { name: 'Sarah M.', city: 'Miami, FL', item: 'Handmade Flared Wool Jacket', time: '2 mins ago' },
    { name: 'Chloe T.', city: 'Atlanta, GA', item: 'Coat With Wraparound Collar', time: '4 mins ago' },
    { name: 'Jessica R.', city: 'Austin, TX', item: 'Mulberry Silk Slip Dress', time: '7 mins ago' },
];

const Storefront = () => {
    const { shop, addToCart, formatPrice = (p) => `$${Number(p).toFixed(2)}` } = useOutletContext();
    const { toggleWishlist, isWishlisted, showToast } = useStore();

    const currentTheme = findThemeById(shop.activeTheme);
    const isLuxuryTheme = shop.activeTheme === 'theme-luxury';
    const isResortTheme = shop.activeTheme === 'theme-resort';
    const isViralTheme = shop.activeTheme === 'theme-viral';

    const [activeTab, setActiveTab] = useState('FEATURED');
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 5, minutes: 24, seconds: 18 });
    const [currentBuyerIdx, setCurrentBuyerIdx] = useState(0);
    const [isBuyerToastVisible, setIsBuyerToastVisible] = useState(true);

    // Chat Drawer simulation for viral theme
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { sender: 'VIP Stylist', text: `Welcome to ${shop.name}! Need sizing or custom lookbook styling advice? Message us anytime!` },
    ]);
    const [chatInput, setChatInput] = useState('');

    // Quick view modal
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [qvSize, setQvSize] = useState('M');
    const [qvColor, setQvColor] = useState('Standard');
    const [qvQty, setQvQty] = useState(1);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { days: 0, hours: 6, minutes: 0, seconds: 0 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Social proof toast timer
    useEffect(() => {
        if (!isViralTheme) return;
        const buyerTimer = setInterval(() => {
            setIsBuyerToastVisible(false);
            setTimeout(() => {
                setCurrentBuyerIdx((prev) => (prev + 1) % RECENT_BUYERS.length);
                setIsBuyerToastVisible(true);
            }, 600);
        }, 9000);
        return () => clearInterval(buyerTimer);
    }, [isViralTheme]);

    const allProducts = shop.products || [];

    // Demographic tabs dynamically configured by the store owner
    const storeDemographics = shop.demographics || ['Men', 'Women', 'Accessories'];
    const dynamicTabs = ['FEATURED', ...storeDemographics.map((d) => (d.toUpperCase().endsWith('STYLE') ? d.toUpperCase() : `${d.toUpperCase()} STYLE`))];

    // Filter by tab
    const filteredProducts = allProducts.filter((p) => {
        if (activeTab === 'FEATURED') return true;
        const norm = activeTab.replace(' STYLE', '').toLowerCase();
        if (norm === 'men') return p.category?.toLowerCase() === 'men';
        if (norm === 'women') return p.category?.toLowerCase() === 'women' || p.category?.toLowerCase() === 'dresses';
        if (norm === 'children' || norm === 'kids') return p.category?.toLowerCase() === 'children' || p.category?.toLowerCase() === 'kids';
        if (norm === 'accessories') return p.category?.toLowerCase() === 'accessories';
        return p.category?.toLowerCase() === norm;
    });

    const openQuickView = (prod, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setQuickViewProduct(prod);
        setQvSize(prod.sizes?.[0] || 'M');
        setQvColor(typeof prod.colors?.[0] === 'object' ? prod.colors[0].name : prod.colors?.[0] || 'Standard');
        setQvQty(1);
    };

    const handleShare = (p, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.origin + `/shop/${shop.slug}/product/${p.id}`);
            showToast('Product link copied to clipboard!', 'info');
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        const userMsg = chatInput;
        setChatMessages((prev) => [...prev, { sender: 'You', text: userMsg }]);
        setChatInput('');

        setTimeout(() => {
            setChatMessages((prev) => [
                ...prev,
                {
                    sender: 'VIP Stylist',
                    text: `Thank you for your message! Our styling concierge has noted your inquiry about "${userMsg}". We are preparing your personalized sizing recommendations! ✨`,
                },
            ]);
        }, 1000);
    };

    // Sub collections for 3-column lists
    const topRated = [...allProducts].sort((a, b) => (b.rating || 5) - (a.rating || 5)).slice(0, 3);
    const bestSelling = [...allProducts].slice(0, 3);
    const onSale = [...allProducts].filter((p) => p.originalPrice > p.price).slice(0, 3);

    return (
        <div className="bg-white text-slate-900 font-sans space-y-16 pb-16">
            
            {/* Top Flash Banner for Viral Theme */}
            {isViralTheme && (
                <div className="bg-pink-700 text-white text-xs sm:text-sm py-2.5 px-4 font-bold text-center tracking-wide flex items-center justify-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <Flame size={16} className="text-yellow-300" />
                        <span>FLASH SALE ACTIVE — 20% OFF WITH PROMO CODE <span className="underline font-mono text-yellow-200">SUMMER20</span></span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 font-mono text-xs bg-black/20 px-2.5 py-0.5 rounded-full border border-white/20">
                        <Clock size={12} />
                        <span>{String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s</span>
                    </div>
                </div>
            )}

            {/* 1. HERO SHOWCASE SECTION (Customized per Active Template) */}
            <section
                className={`relative overflow-hidden ${
                    isLuxuryTheme
                        ? 'bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white'
                        : isResortTheme
                        ? 'bg-[#e7e0d8]'
                        : 'bg-[#dce5eb]'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 min-h-[580px]">
                    
                    {/* Left: Fashion Models Photoshoot */}
                    <div className="relative flex justify-center items-center order-2 lg:order-1">
                        <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60">
                            <img
                                src={
                                    isLuxuryTheme
                                        ? 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&auto=format&fit=crop&q=80'
                                        : isResortTheme
                                        ? 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&auto=format&fit=crop&q=80'
                                        : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80'
                                }
                                alt="High fashion editorial model"
                                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                        </div>
                    </div>

                    {/* Right: Editorial Geometric SALE OFF Frame Box */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 order-1 lg:order-2">
                        
                        {/* The Iconic Geometric Border Box */}
                        <div
                            className={`border-4 p-8 sm:p-12 text-center max-w-lg shadow-sm ${
                                isLuxuryTheme
                                    ? 'border-amber-300/80 bg-black/40 text-white'
                                    : isResortTheme
                                    ? 'border-teal-900 bg-white/60 text-slate-900'
                                    : 'border-slate-900 bg-white/40 text-slate-950'
                            }`}
                        >
                            <p className="text-[10px] tracking-[0.4em] uppercase font-mono font-bold opacity-80 mb-2">
                                {currentTheme.name}
                            </p>
                            <h2 className="text-4xl sm:text-6xl font-serif tracking-[0.2em] font-normal uppercase leading-none">
                                SALE OFF
                            </h2>
                            <div
                                className={`w-16 h-0.5 mx-auto my-4 ${
                                    isLuxuryTheme ? 'bg-amber-300' : 'bg-slate-900'
                                }`}
                            />
                            <p className="text-xs sm:text-sm tracking-[0.25em] font-bold uppercase">
                                {isLuxuryTheme ? 'HAUTE COUTURE · UP TO 40% OFF' : 'JAN 15 TO FEB 15 · UP TO 50%'}
                            </p>
                        </div>

                        <p
                            className={`text-xs sm:text-sm max-w-md leading-relaxed tracking-wide ${
                                isLuxuryTheme ? 'text-rose-100/80' : 'text-slate-600'
                            }`}
                        >
                            {shop.description || 'Explore our latest handcrafted tailoring, double-faced wool coats, minimalist flared jackets, and silk silhouettes.'}
                        </p>

                        <div className="flex items-center gap-4 pt-2">
                            <a
                                href="#trendy-clothing"
                                className={`px-8 py-3.5 text-xs font-bold tracking-[0.2em] uppercase transition shadow-md ${
                                    isLuxuryTheme
                                        ? 'bg-amber-300 text-slate-950 hover:bg-amber-200'
                                        : 'bg-slate-950 text-white hover:bg-slate-800'
                                }`}
                            >
                                Discover Collection →
                            </a>
                            {isViralTheme && (
                                <button
                                    onClick={() => setIsChatOpen(true)}
                                    className="px-6 py-3.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold tracking-wider uppercase transition shadow flex items-center gap-1.5"
                                >
                                    <MessageCircle size={14} /> Ask Stylist
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. TRIPLE PROMO HIGHLIGHT BANNERS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    {/* Banner 1: Free Shipping Worldwide */}
                    <div
                        className="text-white p-6 sm:p-7 flex items-center justify-between shadow-sm group hover:opacity-95 transition"
                        style={{ backgroundColor: isLuxuryTheme ? '#881337' : isResortTheme ? '#0f766e' : '#b86868' }}
                    >
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold tracking-[0.15em] uppercase leading-snug">
                                FREE SHIPPING WORLDWIDE
                            </h3>
                            <p className="text-[11px] text-white/80 mt-1 font-medium">On all orders above $100</p>
                        </div>
                        <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition">
                            <ShoppingBag size={20} />
                        </div>
                    </div>

                    {/* Banner 2: Giveaway Every Week */}
                    <div
                        className="text-white p-6 sm:p-7 flex items-center justify-between shadow-sm group hover:opacity-95 transition"
                        style={{ backgroundColor: isLuxuryTheme ? '#9d174d' : isResortTheme ? '#d97706' : '#b39274' }}
                    >
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold tracking-[0.15em] uppercase leading-snug">
                                GIVEAWAY EVERY WEEK
                            </h3>
                            <p className="text-[11px] text-white/80 mt-1 font-medium">Exclusive VIP members rewards</p>
                        </div>
                        <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition">
                            <Gift size={20} />
                        </div>
                    </div>

                    {/* Banner 3: Sale Up to 70% Off */}
                    <div
                        className="text-white p-6 sm:p-7 flex items-center justify-between shadow-sm group hover:opacity-95 transition"
                        style={{ backgroundColor: isLuxuryTheme ? '#4c0519' : isResortTheme ? '#042f2e' : '#5c7c8a' }}
                    >
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold tracking-[0.15em] uppercase leading-snug">
                                SALE UP TO 70% OFF ON TUESDAY
                            </h3>
                            <p className="text-[11px] text-white/80 mt-1 font-medium">Limited flash drops every Tuesday</p>
                        </div>
                        <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition">
                            <Diamond size={20} />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. TRENDY CLOTHING SECTION (4-Column Product Grid) */}
            <section id="trendy-clothing" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
                
                {/* Section Title */}
                <div className="text-center space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-normal font-serif tracking-[0.2em] text-slate-950 uppercase">
                        TRENDY CLOTHING
                    </h2>
                    <p className="text-xs font-serif italic text-slate-400">
                        Trending & New Arrivals
                    </p>
                </div>

                {/* Category Filter Tabs */}
                <div className="flex items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold tracking-[0.18em] text-slate-400 uppercase border-b border-slate-100 pb-3 flex-wrap">
                    {dynamicTabs.map((tab) => {
                        const isSel = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-2 transition relative ${isSel ? 'text-slate-900 font-black' : 'hover:text-slate-900'}`}
                            >
                                {tab}
                                {isSel && (
                                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-slate-950" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* 4-Column Product Grid with Model Photoshoots */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {filteredProducts.slice(0, 8).map((p) => {
                        const wishlisted = isWishlisted(p.id);
                        const discountPct = p.originalPrice > p.price
                            ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                            : 0;

                        return (
                            <div
                                key={p.id}
                                className="group flex flex-col bg-white text-center"
                            >
                                {/* Photo Container */}
                                <div className="relative aspect-[3/4] bg-[#f8fafc] overflow-hidden mb-4 border border-slate-100">
                                    <Link to={`/shop/${shop.slug}/product/${p.id}`} className="block w-full h-full">
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>

                                    {/* Flash Sale Circular Countdown Timer Pill */}
                                    {p.isFlashSale && (
                                        <div className="absolute bottom-3 inset-x-3 flex justify-center items-center gap-1 bg-slate-950/80 backdrop-blur-xs py-1.5 px-3 rounded-full text-white font-mono text-[9px] font-bold shadow-md">
                                            <span className="text-slate-400">00D</span>
                                            <span>:</span>
                                            <span>{String(timeLeft.hours).padStart(2, '0')}H</span>
                                            <span>:</span>
                                            <span>{String(timeLeft.minutes).padStart(2, '0')}M</span>
                                            <span>:</span>
                                            <span className="text-amber-300">{String(timeLeft.seconds).padStart(2, '0')}S</span>
                                        </div>
                                    )}

                                    {/* Discount Badge */}
                                    {discountPct > 0 && (
                                        <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#b86868] text-white flex items-center justify-center text-[10px] font-black shadow-sm">
                                            -{discountPct}%
                                        </div>
                                    )}

                                    {/* Hover Quick Action Toolbar */}
                                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleWishlist(p.id);
                                            }}
                                            className="w-8 h-8 rounded-full bg-white text-slate-700 shadow flex items-center justify-center hover:bg-slate-900 hover:text-white transition"
                                            title="Save to Wishlist"
                                        >
                                            <Heart size={13} className={wishlisted ? 'text-rose-500 fill-rose-500' : ''} />
                                        </button>
                                        <button
                                            onClick={(e) => openQuickView(p, e)}
                                            className="w-8 h-8 rounded-full bg-white text-slate-700 shadow flex items-center justify-center hover:bg-slate-900 hover:text-white transition"
                                            title="Quick View"
                                        >
                                            <Eye size={13} />
                                        </button>
                                        <button
                                            onClick={(e) => handleShare(p, e)}
                                            className="w-8 h-8 rounded-full bg-white text-slate-700 shadow flex items-center justify-center hover:bg-slate-900 hover:text-white transition"
                                            title="Share"
                                        >
                                            <Share2 size={13} />
                                        </button>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="space-y-1">
                                    <Link
                                        to={`/shop/${shop.slug}/product/${p.id}`}
                                        className="text-[12px] font-bold tracking-[0.1em] text-slate-800 uppercase hover:text-slate-600 transition line-clamp-1 block"
                                    >
                                        {p.name}
                                    </Link>

                                    {/* Price */}
                                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-900">
                                        <span>{formatPrice(p.price)}</span>
                                        {p.originalPrice > p.price && (
                                            <span className="text-slate-400 line-through text-[11px]">
                                                {formatPrice(p.originalPrice)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Bar */}
                                    <div className="pt-2 flex items-center justify-center gap-3 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                        <button
                                            onClick={() => addToCart(p, 1, p.sizes?.[0] || 'M', typeof p.colors?.[0] === 'object' ? p.colors[0].name : 'Standard')}
                                            className="text-slate-800 hover:text-slate-950 transition underline underline-offset-4"
                                        >
                                            ADD TO CART
                                        </button>
                                        <span>·</span>
                                        <button
                                            onClick={(e) => openQuickView(p, e)}
                                            className="hover:text-slate-900 transition"
                                        >
                                            DETAILS
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 4. DUAL EDITORIAL PROMO BANNERS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Left Banner: Fashion Store */}
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-sm group">
                        <img
                            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80"
                            alt="Fashion store lookbook"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 flex flex-col justify-center items-center text-center p-6 text-white space-y-3">
                            <h3 className="text-2xl sm:text-3xl font-serif tracking-[0.2em] uppercase font-normal">
                                {shop.name} FASHION STORE
                            </h3>
                            <p className="text-xs text-white/80 tracking-widest uppercase font-semibold">
                                New Autumn / Winter Capsule Drop
                            </p>
                            <a
                                href="#trendy-clothing"
                                className="px-6 py-2.5 bg-white text-slate-950 font-bold text-xs tracking-[0.2em] uppercase hover:bg-slate-200 transition"
                            >
                                Explore Now
                            </a>
                        </div>
                    </div>

                    {/* Right Banner: 50% Off Every Tuesday */}
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-sm group">
                        <img
                            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80"
                            alt="50% off Tuesday"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 flex flex-col justify-center items-center text-center p-6 text-white">
                            <div className="border-2 border-white/80 p-5 max-w-xs space-y-1">
                                <p className="text-[10px] tracking-[0.3em] uppercase">LIMITED PROMO</p>
                                <h3 className="text-2xl sm:text-3xl font-serif tracking-[0.15em] uppercase font-normal">
                                    50% OFF
                                </h3>
                                <p className="text-[10px] tracking-[0.25em] uppercase">EVERY TUESDAY</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. 3-COLUMN PRODUCT SHOWCASE (Top Rated / Best Selling / On Sale) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-slate-100">
                    
                    {/* Column 1: Top Rated */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-slate-950 border-b border-slate-200 pb-2">
                            TOP RATED
                        </h3>
                        <div className="space-y-3 divide-y divide-slate-100">
                            {topRated.map((p) => (
                                <div key={p.id} className="pt-3 first:pt-0 flex items-center gap-3 group">
                                    <Link to={`/shop/${shop.slug}/product/${p.id}`} className="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                    </Link>
                                    <div className="min-w-0 flex-1 text-xs">
                                        <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                        <Link to={`/shop/${shop.slug}/product/${p.id}`} className="font-bold text-slate-800 line-clamp-1 hover:text-slate-950 transition">
                                            {p.name}
                                        </Link>
                                        <p className="font-black text-slate-900 mt-1">{formatPrice(p.price)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Best Selling */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-slate-950 border-b border-slate-200 pb-2">
                            BEST SELLING
                        </h3>
                        <div className="space-y-3 divide-y divide-slate-100">
                            {bestSelling.map((p) => (
                                <div key={p.id} className="pt-3 first:pt-0 flex items-center gap-3 group">
                                    <Link to={`/shop/${shop.slug}/product/${p.id}`} className="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                    </Link>
                                    <div className="min-w-0 flex-1 text-xs">
                                        <Link to={`/shop/${shop.slug}/product/${p.id}`} className="font-bold text-slate-800 line-clamp-1 hover:text-slate-950 transition">
                                            {p.name}
                                        </Link>
                                        <p className="font-black text-slate-900 mt-1">{formatPrice(p.price)}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">{p.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: On Sale */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-slate-950 border-b border-slate-200 pb-2">
                            ON SALE
                        </h3>
                        <div className="space-y-3 divide-y divide-slate-100">
                            {onSale.map((p) => (
                                <div key={p.id} className="pt-3 first:pt-0 flex items-center gap-3 group">
                                    <Link to={`/shop/${shop.slug}/product/${p.id}`} className="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                    </Link>
                                    <div className="min-w-0 flex-1 text-xs">
                                        <Link to={`/shop/${shop.slug}/product/${p.id}`} className="font-bold text-slate-800 line-clamp-1 hover:text-slate-950 transition">
                                            {p.name}
                                        </Link>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="font-black text-slate-900">{formatPrice(p.price)}</span>
                                            <span className="text-slate-400 line-through text-[10px]">{formatPrice(p.originalPrice)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. BLOG UPDATES */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
                <div className="text-center space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-serif tracking-[0.2em] text-slate-950 uppercase font-normal">
                        BLOG UPDATES
                    </h2>
                    <p className="text-xs font-serif italic text-slate-400">
                        Fashion Editorial & Styling Journal
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {BLOG_POSTS.map((post) => (
                        <div key={post.id} className="bg-white border border-slate-100 overflow-hidden group shadow-xs">
                            <div className="aspect-[16/10] overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-5 space-y-2">
                                <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                                    {post.date} · BY {post.author}
                                </p>
                                <h4 className="font-serif text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-slate-600 transition">
                                    {post.title}
                                </h4>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                    {post.excerpt}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 7. FULL-WIDTH NEWSLETTER BANNER */}
            <section
                className="relative bg-slate-950 text-white py-20 px-4 sm:px-8 bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80')`,
                }}
            >
                <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
                    <h3 className="text-2xl sm:text-4xl font-serif tracking-[0.2em] font-normal uppercase">
                        SUBSCRIBE TO OUR NEWSLETTER
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                        Join our exclusive fashion circle to receive lookbook previews, private sale invitations, and 15% off your next boutique order.
                    </p>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            showToast('Welcome to the VIP Fashion Circle! Check your inbox for your 15% voucher.', 'success');
                        }}
                        className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2"
                    >
                        <input
                            type="email"
                            required
                            placeholder="Enter your email address..."
                            className="flex-1 px-4 py-3 bg-white/10 text-white placeholder:text-slate-400 border border-white/20 text-xs focus:outline-none focus:bg-white/20"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-white text-slate-950 font-bold text-xs tracking-[0.15em] uppercase hover:bg-slate-200 transition"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>

            {/* 8. BRAND PARTNERS MONOCHROME LOGO STRIP */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="py-8 border-b border-slate-100 flex items-center justify-between gap-6 overflow-x-auto text-slate-400 font-serif text-lg tracking-[0.25em] font-bold opacity-60">
                    {BRANDS.map((b) => (
                        <span key={b} className="whitespace-nowrap hover:opacity-100 hover:text-slate-900 transition cursor-pointer">
                            {b}
                        </span>
                    ))}
                </div>
            </section>

            {/* Live Social Proof Floating Toast for Viral Theme */}
            {isViralTheme && isBuyerToastVisible && RECENT_BUYERS[currentBuyerIdx] && (
                <div className="fixed bottom-6 left-6 z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-3 flex items-center gap-3 animate-in slide-in-from-left max-w-sm">
                    <span className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-sm shrink-0 border border-pink-100">
                        👗
                    </span>
                    <div className="min-w-0 flex-1 text-xs">
                        <p className="font-bold text-slate-900 truncate">
                            {RECENT_BUYERS[currentBuyerIdx].name} from {RECENT_BUYERS[currentBuyerIdx].city}
                        </p>
                        <p className="text-[11px] text-pink-600 font-semibold truncate">
                            Purchased {RECENT_BUYERS[currentBuyerIdx].item}
                        </p>
                        <p className="text-[10px] text-slate-400">{RECENT_BUYERS[currentBuyerIdx].time}</p>
                    </div>
                </div>
            )}

            {/* Quick View Modal */}
            {quickViewProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)} />
                    
                    <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2 aspect-[3/4] bg-slate-100 overflow-hidden relative">
                            <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
                            <button
                                onClick={() => setQuickViewProduct(null)}
                                className="md:hidden absolute top-3 right-3 p-1.5 rounded-xl bg-white/90 text-slate-700 shadow"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4 overflow-y-auto">
                            <div>
                                <div className="hidden md:flex items-center justify-between text-xs text-slate-400 mb-1">
                                    <span className="font-bold uppercase tracking-wider">{quickViewProduct.category}</span>
                                    <button onClick={() => setQuickViewProduct(null)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                                        <X size={16} />
                                    </button>
                                </div>
                                <h3 className="text-xl font-serif text-slate-900 uppercase font-bold">{quickViewProduct.name}</h3>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-xl font-black text-slate-900">{formatPrice(quickViewProduct.price)}</span>
                                    {quickViewProduct.originalPrice > quickViewProduct.price && (
                                        <span className="text-xs text-slate-400 line-through">{formatPrice(quickViewProduct.originalPrice)}</span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                                    {quickViewProduct.description}
                                </p>
                            </div>

                            {/* Size selector */}
                            <div>
                                <p className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Select Size:</p>
                                <div className="flex flex-wrap gap-2">
                                    {(quickViewProduct.sizes || ['S', 'M', 'L', 'XL']).map((sz) => (
                                        <button
                                            key={sz}
                                            onClick={() => setQvSize(sz)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${qvSize === sz ? 'bg-slate-950 text-white border-slate-950' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                                        >
                                            {sz}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color selector */}
                            <div>
                                <p className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Select Color:</p>
                                <div className="flex flex-wrap gap-2">
                                    {(quickViewProduct.colors || [{ name: 'Standard' }]).map((c, idx) => {
                                        const cName = typeof c === 'object' ? c.name : c;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setQvColor(cName)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${qvColor === cName ? 'border-slate-950 bg-slate-950 text-white' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                                            >
                                                {cName}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        addToCart(quickViewProduct, qvQty, qvSize, qvColor);
                                        setQuickViewProduct(null);
                                    }}
                                    className="flex-1 py-3 rounded-xl bg-slate-950 text-white font-bold text-xs uppercase tracking-wider shadow hover:bg-slate-800 transition"
                                >
                                    Add to Bag · ${(quickViewProduct.price * qvQty).toFixed(2)}
                                </button>
                                <Link
                                    to={`/shop/${shop.slug}/product/${quickViewProduct.id}`}
                                    className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                                >
                                    Full Details
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stylist Chat Drawer for Viral Theme */}
            {isChatOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsChatOpen(false)} />
                    <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right">
                        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-pink-400" />
                                <span className="font-bold text-sm">VIP Stylist Concierge</span>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="p-1 text-slate-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 text-xs">
                            {chatMessages.map((m, i) => (
                                <div key={i} className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}>
                                    <span className="text-[10px] font-bold text-slate-400 mb-0.5">{m.sender}</span>
                                    <div className={`p-3 rounded-2xl max-w-[85%] ${m.sender === 'You' ? 'bg-slate-950 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'}`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
                            <input
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Type sizing or style question..."
                                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                            />
                            <button type="submit" className="px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-bold">
                                <Send size={13} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Storefront;