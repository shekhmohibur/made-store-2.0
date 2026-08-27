import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ShoppingBag, MessageCircle, BadgeCheck,
    Flame, Clock, Star, Send, X, ChevronRight, Sparkles
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import ToastContainer from '../../components/common/ToastContainer';
import GlobalSearchModal from '../../components/common/GlobalSearchModal';

const OCCASIONS = ['All Silhouettes', 'Wedding Guest', 'Cocktail & Party', 'Boho Chic', 'Evening Gala'];

const RECENT_BUYERS = [
    { name: 'Sarah M.', city: 'Miami, FL', item: 'Enchanted Floral Chiffon Maxi', time: '2 mins ago' },
    { name: 'Chloe T.', city: 'Atlanta, GA', item: 'Glamour Ruched Satin Bodycon', time: '5 mins ago' },
    { name: 'Jessica R.', city: 'Austin, TX', item: 'Regal Off-Shoulder Velvet Gown', time: '8 mins ago' },
    { name: 'Brittany L.', city: 'New York, NY', item: 'Sun-Drenched Boho Sundress', time: '11 mins ago' },
];

const DressShop = () => {
    const { shops } = useStore();
    const shop = shops.find((s) => s.slug === 'fb-dress-store') || shops[0];

    const [activeOccasion, setActiveOccasion] = useState('All Silhouettes');
    const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });
    const [currentBuyerIdx, setCurrentBuyerIdx] = useState(0);
    const [isBuyerToastVisible, setIsBuyerToastVisible] = useState(true);

    // Chat Drawer simulation
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { sender: 'Grace (VIP Stylist)', text: 'Hello darling! ✨ Welcome to FB Dress Store. Looking for a wedding guest dress, gala gown, or custom size advice? Drop a message here!' },
    ]);
    const [chatInput, setChatInput] = useState('');

    // Flash sale countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 6, minutes: 0, seconds: 0 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Social proof rotation
    useEffect(() => {
        const buyerTimer = setInterval(() => {
            setIsBuyerToastVisible(false);
            setTimeout(() => {
                setCurrentBuyerIdx((prev) => (prev + 1) % RECENT_BUYERS.length);
                setIsBuyerToastVisible(true);
            }, 500);
        }, 8000);
        return () => clearInterval(buyerTimer);
    }, []);

    if (!shop) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 text-center">
                <p className="text-zinc-500 font-bold">Dress store not available.</p>
            </div>
        );
    }

    const accent = shop.accent || '#be185d';
    const products = shop.products || [];
    const activeBuyer = RECENT_BUYERS[currentBuyerIdx];

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
                    sender: 'Grace (VIP Stylist)',
                    text: `Thank you for your interest! We have noted your request for "${userMsg}". You can click 'Order Dress' below or WhatsApp us directly at +1 (555) 492-3310! 💃✨`,
                },
            ]);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-pink-600 selection:text-white">
            <GlobalSearchModal />
            <ToastContainer />

            {/* Top Flash Sale Strip */}
            <div className="bg-zinc-950 text-white text-xs sm:text-sm py-2.5 px-4 font-bold text-center tracking-wide flex items-center justify-center gap-3 border-b border-zinc-800">
                <div className="flex items-center gap-1.5">
                    <Flame size={16} className="text-pink-400" />
                    <span>VIRAL DRESS POP-UP — 20% DISCOUNT WITH CODE <span className="underline font-mono text-pink-300">SUMMER20</span></span>
                </div>
                <div className="hidden sm:flex items-center gap-1 font-mono text-xs bg-zinc-800 px-3 py-0.5 rounded-full border border-zinc-700">
                    <Clock size={12} className="text-zinc-400" />
                    <span>
                        {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                    </span>
                </div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
                    <Link to="/dress-shop" className="flex items-center gap-3 group">
                        <span
                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-105 transition-transform"
                            style={{ backgroundColor: accent }}
                        >
                            FB
                        </span>
                        <div>
                            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-zinc-900">
                                FB Dress Store
                            </span>
                            <p className="text-[10px] text-pink-600 font-bold uppercase tracking-wider flex items-center gap-1">
                                <BadgeCheck size={12} /> Viral Social Pop-Up Boutique
                            </p>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => setIsChatOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition border border-zinc-200"
                        >
                            <MessageCircle size={14} className="text-pink-600" /> <span className="hidden sm:inline">Ask Stylist</span>
                        </button>
                        <Link
                            to="/shop/fb-dress-store"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-extrabold text-xs shadow transition active:scale-95"
                            style={{ backgroundColor: accent }}
                        >
                            <ShoppingBag size={14} /> <span>Shop Full Collection</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div
                    className="rounded-3xl overflow-hidden text-white shadow-xl p-8 sm:p-14 text-center relative border border-pink-900/20"
                    style={{ background: `linear-gradient(135deg, ${accent}, #1e1b4b)` }}
                >
                    <div className="max-w-2xl mx-auto space-y-4 relative z-10">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/10 backdrop-blur-md rounded-full px-3.5 py-1 text-white border border-white/20">
                            <Sparkles size={13} className="text-pink-300" /> Viral Social Boutique Experience
                        </span>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
                            Bespoke Dresses,<br />Styled for the Spotlight ✨
                        </h1>
                        <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed max-w-lg mx-auto">
                            Wedding guest gowns, satin bodycons, and airy boho maxis. Handcrafted textiles with express nationwide courier.
                        </p>
                        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                to="/shop/fb-dress-store"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-zinc-900 font-extrabold text-xs shadow-lg hover:bg-zinc-100 transition active:scale-95"
                            >
                                <ShoppingBag size={15} /> Browse Full Catalog
                            </Link>
                            <button
                                onClick={() => setIsChatOpen(true)}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur border border-white/20 transition"
                            >
                                <MessageCircle size={15} /> DM & Reserve Your Size
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Occasion Filter Tabs */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                    {OCCASIONS.map((occ) => {
                        const isSel = activeOccasion === occ;
                        return (
                            <button
                                key={occ}
                                onClick={() => setActiveOccasion(occ)}
                                className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${isSel ? 'bg-zinc-900 text-white shadow-sm' : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100'}`}
                            >
                                {occ}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Trending Dresses Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-zinc-900">Trending Viral Dresses</h2>
                        <p className="text-xs text-zinc-500">Handcrafted bestseller silhouettes ready to dispatch</p>
                    </div>
                    <Link
                        to="/shop/fb-dress-store"
                        className="text-xs font-bold text-zinc-900 hover:underline flex items-center gap-1"
                    >
                        View all styles <ChevronRight size={13} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                    {products.map((p) => (
                        <div
                            key={p.id}
                            className="luxury-card overflow-hidden flex flex-col group"
                        >
                            <Link to={`/shop/fb-dress-store/product/${p.id}`} className="relative aspect-[3/4] bg-zinc-100 overflow-hidden block">
                                {p.image ? (
                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-7xl">
                                        {p.emoji}
                                    </div>
                                )}
                                {p.badge && (
                                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-zinc-900 text-white shadow">
                                        {p.badge}
                                    </span>
                                )}
                            </Link>

                            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                <div>
                                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-1">
                                        <Star size={11} className="fill-amber-400 text-amber-400" />
                                        <span>4.9</span>
                                        <span className="text-zinc-400 font-normal text-[11px]">({p.reviewCount || 30})</span>
                                    </div>
                                    <Link
                                        to={`/shop/fb-dress-store/product/${p.id}`}
                                        className="font-bold text-zinc-900 text-xs leading-snug line-clamp-1 hover:text-pink-600 transition"
                                    >
                                        {p.name}
                                    </Link>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-base font-black text-zinc-900">${p.price}</span>
                                        {p.originalPrice > p.price && (
                                            <span className="text-xs text-zinc-400 line-through">${p.originalPrice}</span>
                                        )}
                                    </div>
                                </div>

                                <Link
                                    to={`/shop/fb-dress-store/product/${p.id}`}
                                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-sm transition active:scale-95"
                                    style={{ backgroundColor: accent }}
                                >
                                    <ShoppingBag size={13} /> Order Dress
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Live Social Proof Floating Toast */}
            {isBuyerToastVisible && activeBuyer && (
                <div className="fixed bottom-6 left-6 z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200 shadow-xl p-3 flex items-center gap-3 animate-in slide-in-from-left max-w-sm">
                    <span className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-sm shrink-0 border border-pink-100">
                        👗
                    </span>
                    <div className="min-w-0 flex-1 text-xs">
                        <p className="font-bold text-zinc-900 truncate">
                            {activeBuyer.name} from {activeBuyer.city}
                        </p>
                        <p className="text-[11px] text-pink-600 font-semibold truncate">
                            Purchased {activeBuyer.item}
                        </p>
                        <p className="text-[10px] text-zinc-400">{activeBuyer.time}</p>
                    </div>
                </div>
            )}

            {/* Stylist Chat Drawer */}
            {isChatOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={() => setIsChatOpen(false)} />
                    
                    <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right">
                        <div className="p-4 bg-zinc-900 text-white flex items-center justify-between shrink-0 border-b border-zinc-800">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-white text-zinc-900 font-black text-xs flex items-center justify-center shadow">
                                    GM
                                </div>
                                <div>
                                    <p className="font-extrabold text-xs text-white">Grace Mensah · Boutique Stylist</p>
                                    <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online Now
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="p-1 text-zinc-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50 text-xs">
                            {chatMessages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}
                                >
                                    <span className="text-[10px] font-bold text-zinc-400 mb-0.5">{msg.sender}</span>
                                    <div
                                        className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                                            msg.sender === 'You'
                                                ? 'bg-zinc-900 text-white rounded-br-none shadow-sm'
                                                : 'bg-white text-zinc-800 border border-zinc-200 rounded-bl-none shadow-xs'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chat Input */}
                        <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-200 bg-white flex gap-2">
                            <input
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Type your dress or sizing question..."
                                className="flex-1 px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center gap-1 shadow"
                            >
                                <Send size={13} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DressShop;