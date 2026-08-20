import { useState } from 'react';
import { useParams, Link, Outlet, NavLink } from 'react-router-dom';
import {
    ShoppingBag, X, Plus, Minus, Trash2, CreditCard, CheckCircle2,
    Truck, Heart, Search, Phone, RefreshCw, MessageCircle,
    MapPin, DollarSign, Menu, Globe
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { CURRENCIES } from '../../utils/currency';
import ToastContainer from '../../components/common/ToastContainer';
import GlobalSearchModal from '../../components/common/GlobalSearchModal';
import DemoRoleBar from '../../components/common/DemoRoleBar';
import CustomPaymentForm from '../../components/storefront/CustomPaymentForm';

const StorefrontLayout = () => {
    const { slug } = useParams();
    const {
        shops = [],
        cart = [],
        setCart = () => {},
        wishlist = [],
        activeCurrency = 'USD',
        setActiveCurrency = () => {},
        formatPrice = (p) => `$${Number(p).toFixed(2)}`,
        placeOrder,
        validateCoupon,
        showToast,
        setIsGlobalSearchOpen,
    } = useStore();

    // Find active shop by slug or fallback to default
    const safeShops = Array.isArray(shops) ? shops : [];
    const shop = safeShops.find((s) => s.slug === slug) || safeShops[0];

    const safeCart = Array.isArray(cart) ? cart : [];

    const [cartOpen, setCartOpen] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    // Custom Payment Data & Validation State
    const [customPaymentData, setCustomPaymentData] = useState({
        trxId: '',
        senderNumber: '',
        receiptImage: '',
    });
    const [customPaymentErrors, setCustomPaymentErrors] = useState({});

    // Floating WhatsApp Popup
    const [whatsappPopupOpen, setWhatsappPopupOpen] = useState(false);

    // Checkout form state
    const [form, setForm] = useState({
        name: 'Jessica Miller',
        email: 'jessica@example.com',
        phone: '+1 (555) 382-9912',
        address: '840 Fifth Avenue, Apt 14B',
        city: 'New York',
        state: 'NY',
        zip: '10065',
        paymentMethod: 'card', // 'card', 'cod', 'whatsapp'
    });

    if (!shop) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
                <DemoRoleBar />
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md">
                    <h2 className="text-xl font-bold text-slate-800">Store Not Found</h2>
                    <p className="text-xs text-slate-500 mt-1 mb-6">The requested fashion store could not be located.</p>
                    <Link to="/" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    const accent = shop.accent || '#18181b';
    const freeShippingThreshold = shop.shipping?.freeShippingThreshold || 100;
    const whatsappNum = shop.whatsappNumber || '+1 (800) 456-7890';
    const cleanWhatsappNum = whatsappNum.replace(/[^0-9]/g, '');

    // Cart calculations
    const cartCount = safeCart.reduce((sum, it) => sum + (it.qty || 1), 0);
    const subtotal = safeCart.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 1), 0);
    const discount = appliedCoupon
        ? appliedCoupon.type === 'percentage'
            ? (subtotal * appliedCoupon.value) / 100
            : appliedCoupon.value
        : 0;
    const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 9.99;
    const total = Math.max(0, subtotal - discount + shipping);
    const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

    const addToCart = (product, qty = 1, size = 'M', color = 'Standard') => {
        setCart((prev) => {
            const existingIdx = prev.findIndex(
                (it) => it.productId === product.id && it.size === size && it.color === color
            );
            if (existingIdx > -1) {
                const copy = [...prev];
                copy[existingIdx].qty += qty;
                return copy;
            }
            return [
                ...prev,
                {
                    productId: product.id,
                    name: product.name,
                    emoji: product.emoji,
                    image: product.image || '',
                    price: product.price,
                    qty,
                    size: size || product.sizes?.[0] || 'M',
                    color: color || (typeof product.colors?.[0] === 'object' ? product.colors[0].name : product.colors?.[0]) || 'Standard',
                },
            ];
        });
        showToast(`Added "${product.name}" to your shopping bag`, 'success');
        setCartOpen(true);
    };

    const updateQty = (index, delta) => {
        setCart((prev) =>
            prev.map((it, i) => (i === index ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
        );
    };

    const removeItem = (index) => {
        setCart((prev) => prev.filter((_, i) => i !== index));
        showToast('Item removed from bag', 'info');
    };

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        const res = validateCoupon(couponInput, subtotal);
        if (res.valid) {
            setAppliedCoupon(res.coupon);
            showToast(`Coupon "${res.coupon.code}" applied!`, 'success');
            setCouponInput('');
        } else {
            showToast(res.message, 'error');
        }
    };

    // 1-Click WhatsApp Ordering Action
    const handleWhatsAppOrder = (itemsToOrder, customerDetails = form) => {
        const orderSummaryText = itemsToOrder
            .map((it, i) => `${i + 1}. ${it.name} (Size: ${it.size || 'M'}, Color: ${it.color || 'Std'}, Qty: ${it.qty}) - $${it.price * it.qty}`)
            .join('\n');

        const messageText = `🛍️ *NEW ORDER FROM ${shop.name} STOREFRONT*\n\n` +
            `*Customer Name:* ${customerDetails.name}\n` +
            `*Phone:* ${customerDetails.phone}\n` +
            `*Delivery Address:* ${customerDetails.address}, ${customerDetails.city}, ${customerDetails.state} ${customerDetails.zip}\n\n` +
            `*Items Ordered:*\n${orderSummaryText}\n\n` +
            `*Total Amount:* $${total.toFixed(2)} USD\n` +
            `*Payment Mode:* WhatsApp Direct / Cash on Delivery\n\n` +
            `Please confirm my order and courier dispatch date! Thank you.`;

        const waUrl = `https://wa.me/${cleanWhatsappNum}?text=${encodeURIComponent(messageText)}`;
        window.open(waUrl, '_blank');

        // Also record in platform state
        const order = placeOrder(shop.id, itemsToOrder, { ...customerDetails, paymentMethod: 'WhatsApp' }, appliedCoupon?.code || '');
        setCart([]);
        setCheckoutOpen(false);
        setCartOpen(false);
        setAppliedCoupon(null);
        setOrderPlaced(order);
        showToast('WhatsApp order generated! Chat opened with the merchant.', 'success');
    };

    const handleSubmitCheckout = (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.address) {
            showToast('Please complete shipping details (Name, Email, Address)', 'warning');
            return;
        }

        if (form.paymentMethod === 'whatsapp') {
            handleWhatsAppOrder(cart, form);
            return;
        }

        // Custom Payment Method Validation
        let paymentDetailsPayload = null;
        if (form.paymentMethod && form.paymentMethod.startsWith('cpm-')) {
            const methodId = form.paymentMethod.replace('cpm-', '');
            const customMethods = shop.customPaymentMethods || [];
            const selectedMethod = customMethods.find((m) => String(m.id) === String(methodId)) || {
                id: methodId,
                name: 'Custom Payment Gateway',
                requireTrxId: true,
                requireSenderNumber: true
            };

            const errors = {};
            if (selectedMethod.requireTrxId !== false && (!customPaymentData.trxId || customPaymentData.trxId.length < 4)) {
                errors.trxId = 'Please enter a valid Transaction ID / Reference Number (min 4 chars)';
            }
            if (selectedMethod.requireSenderNumber !== false && (!customPaymentData.senderNumber || customPaymentData.senderNumber.trim().length < 3)) {
                errors.senderNumber = 'Please enter the phone / account number used to send payment';
            }

            if (Object.keys(errors).length > 0) {
                setCustomPaymentErrors(errors);
                showToast('Please complete all required payment verification fields below', 'warning');
                return;
            }

            setCustomPaymentErrors({});
            paymentDetailsPayload = {
                methodId: selectedMethod.id,
                methodName: selectedMethod.name,
                accountNumber: selectedMethod.accountNumber,
                trxId: customPaymentData.trxId,
                senderNumber: customPaymentData.senderNumber,
                receiptImage: customPaymentData.receiptImage,
            };
        }

        setIsSubmitting(true);
        setTimeout(() => {
            const order = placeOrder(shop.id, cart, form, appliedCoupon?.code || '', paymentDetailsPayload);
            setCart([]);
            setCheckoutOpen(false);
            setCartOpen(false);
            setAppliedCoupon(null);
            setOrderPlaced(order);
            setIsSubmitting(false);
        }, 750);
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
            <DemoRoleBar />
            <GlobalSearchModal />
            <ToastContainer />

            {/* Top Classic Bar */}
            <div className="bg-white border-b border-slate-100 text-[11px] text-slate-500 py-2.5 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                    {/* Left welcome text / Announcement */}
                    <div className="flex items-center gap-4 text-slate-500 font-medium">
                        <span>WELCOME VISITOR! CALL US: <strong className="text-slate-800">{whatsappNum}</strong></span>
                        <span className="hidden md:inline">·</span>
                        <span className="hidden md:inline">
                            {shop.announcement?.enabled !== false && shop.announcement?.text
                                ? shop.announcement.text
                                : `FREE WORLDWIDE SHIPPING ON ORDERS OVER $${freeShippingThreshold}`}
                        </span>
                    </div>

                    {/* Right utilities */}
                    <div className="flex items-center gap-4 font-semibold text-slate-600 text-[11px]">
                        <Link to={`/shop/${shop.slug}/track-order`} className="hover:text-slate-950 transition flex items-center gap-1">
                            <Truck size={12} /> TRACK ORDER
                        </Link>
                        <span>·</span>
                        
                        {/* Interactive Currency Switcher */}
                        <div className="flex items-center gap-1 hover:text-slate-950 transition">
                            <Globe size={11} className="text-slate-400" />
                            <select
                                value={activeCurrency}
                                onChange={(e) => setActiveCurrency(e.target.value)}
                                className="bg-transparent text-slate-800 font-bold cursor-pointer focus:outline-none pr-1"
                                title="Change Store Currency"
                            >
                                {Object.values(CURRENCIES).map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.flag} {c.code} ({c.symbol.trim()})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <span>·</span>
                        <button
                            onClick={() => setCartOpen(true)}
                            className="flex items-center gap-1.5 text-slate-900 font-bold hover:opacity-75 transition"
                        >
                            <ShoppingBag size={13} />
                            <span>BAG ({cartCount})</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Centered Luxury Header */}
            <header className="bg-white border-b border-slate-100 sticky top-10 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex flex-col items-center">
                    
                    {/* Center Brand Logo (Zorka Haute Couture Typography) */}
                    <Link to={`/shop/${shop.slug}`} className="text-center group mb-4">
                        <h1 className="text-3xl sm:text-4xl font-serif tracking-[0.18em] font-normal text-slate-950 uppercase group-hover:opacity-75 transition">
                            {shop.name || 'ZORKA'}
                        </h1>
                        <p className="text-[9px] tracking-[0.35em] text-slate-400 uppercase mt-0.5 font-sans font-semibold">
                            {shop.tagline || 'HAUTE COUTURE & READY-TO-WEAR'}
                        </p>
                    </Link>

                    {/* Navigation Menu Bar */}
                    <nav className="w-full flex items-center justify-between border-t border-slate-100 pt-3">
                        {/* Mobile Hamburger Toggle Button */}
                        <button
                            onClick={() => setIsMobileNavOpen(true)}
                            className="md:hidden p-1.5 text-slate-700 hover:text-slate-950 rounded-xl hover:bg-slate-100 transition"
                            title="Open menu"
                        >
                            <Menu size={20} />
                        </button>

                        <div className="w-12 hidden md:block" />

                        {/* Centered Navigation Links (Desktop) */}
                        <div className="hidden md:flex items-center justify-center gap-6 sm:gap-8 text-[12px] font-bold tracking-[0.15em] text-slate-700 uppercase mx-auto flex-wrap">
                            <NavLink
                                to={`/shop/${shop.slug}`}
                                end
                                className={({ isActive }) =>
                                    `py-1 transition ${isActive ? 'text-slate-950 border-b-2 border-slate-950' : 'hover:text-slate-950'}`
                                }
                            >
                                HOME
                            </NavLink>
                            <NavLink
                                to={`/shop/${shop.slug}/lookbook`}
                                className={({ isActive }) =>
                                    `py-1 transition ${isActive ? 'text-slate-950 border-b-2 border-slate-950' : 'hover:text-slate-950'}`
                                }
                            >
                                LOOKBOOK
                            </NavLink>
                            <NavLink
                                to={`/shop/${shop.slug}/about`}
                                className={({ isActive }) =>
                                    `py-1 transition ${isActive ? 'text-slate-950 border-b-2 border-slate-950' : 'hover:text-slate-950'}`
                                }
                            >
                                ABOUT ATELIER
                            </NavLink>
                            <NavLink
                                to={`/shop/${shop.slug}/contact`}
                                className={({ isActive }) =>
                                    `py-1 transition ${isActive ? 'text-slate-950 border-b-2 border-slate-950' : 'hover:text-slate-950'}`
                                }
                            >
                                CONTACT
                            </NavLink>
                            <NavLink
                                to={`/dress-shop`}
                                className="hover:text-rose-600 transition py-1 text-rose-500"
                            >
                                VIRAL DRESSES
                            </NavLink>
                            <Link
                                to={`/owner`}
                                className="hover:text-slate-950 transition py-1 text-slate-400 font-normal"
                            >
                                MERCHANT PANEL ↗
                            </Link>
                        </div>

                        {/* Right Quick Action Icons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsGlobalSearchOpen(true)}
                                className="p-1.5 text-slate-500 hover:text-slate-900 transition"
                                title="Search (⌘K)"
                            >
                                <Search size={16} />
                            </button>

                            {/* Wishlist */}
                            <div className="relative p-1.5 text-slate-600 hover:text-slate-900 transition">
                                <Heart size={16} className={wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''} />
                                {wishlist.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
                                        {wishlist.length}
                                    </span>
                                )}
                            </div>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            {isMobileNavOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
                        onClick={() => setIsMobileNavOpen(false)}
                    />
                    <aside className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <h3 className="font-serif text-lg uppercase font-bold text-slate-950">{shop.name}</h3>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Fashion Menu</p>
                                </div>
                                <button
                                    onClick={() => setIsMobileNavOpen(false)}
                                    className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <nav className="flex flex-col space-y-2 text-xs font-bold uppercase tracking-wider">
                                <NavLink
                                    to={`/shop/${shop.slug}`}
                                    end
                                    onClick={() => setIsMobileNavOpen(false)}
                                    className={({ isActive }) => `px-3 py-2.5 rounded-xl transition ${isActive ? 'bg-slate-950 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                                >
                                    Home
                                </NavLink>
                                <NavLink
                                    to={`/shop/${shop.slug}/lookbook`}
                                    onClick={() => setIsMobileNavOpen(false)}
                                    className={({ isActive }) => `px-3 py-2.5 rounded-xl transition ${isActive ? 'bg-slate-950 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                                >
                                    Lookbook
                                </NavLink>
                                <NavLink
                                    to={`/shop/${shop.slug}/about`}
                                    onClick={() => setIsMobileNavOpen(false)}
                                    className={({ isActive }) => `px-3 py-2.5 rounded-xl transition ${isActive ? 'bg-slate-950 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                                >
                                    About Atelier
                                </NavLink>
                                <NavLink
                                    to={`/shop/${shop.slug}/contact`}
                                    onClick={() => setIsMobileNavOpen(false)}
                                    className={({ isActive }) => `px-3 py-2.5 rounded-xl transition ${isActive ? 'bg-slate-950 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                                >
                                    Contact
                                </NavLink>
                                <NavLink
                                    to={`/shop/${shop.slug}/track-order`}
                                    onClick={() => setIsMobileNavOpen(false)}
                                    className={({ isActive }) => `px-3 py-2.5 rounded-xl transition ${isActive ? 'bg-slate-950 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                                >
                                    Track Order 🚚
                                </NavLink>
                                <NavLink
                                    to={`/dress-shop`}
                                    onClick={() => setIsMobileNavOpen(false)}
                                    className="px-3 py-2.5 rounded-xl text-pink-600 bg-pink-50 hover:bg-pink-100 transition"
                                >
                                    Viral Dresses 👗
                                </NavLink>
                            </nav>
                        </div>

                        <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                            <Link
                                to="/owner"
                                onClick={() => setIsMobileNavOpen(false)}
                                className="block w-full py-2.5 text-center rounded-xl bg-slate-100 font-bold text-slate-800 hover:bg-slate-200"
                            >
                                Merchant Panel ↗
                            </Link>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1">
                <Outlet context={{ shop, accent, addToCart, formatPrice, activeCurrency }} />
            </main>

            {/* Floating WhatsApp Quick Chat Button */}
            {shop.features?.enableWhatsAppChat !== false && (
                <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
                    {whatsappPopupOpen && (
                        <div className="mb-3 w-72 sm:w-80 bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 animate-in fade-in zoom-in-95 space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="font-bold text-slate-900 text-xs">{shop.name} Stylist</p>
                                </div>
                                <button onClick={() => setWhatsappPopupOpen(false)} className="text-slate-400 hover:text-slate-900">
                                    <X size={16} />
                                </button>
                            </div>
                            <p className="text-xs text-slate-600">
                                Hello! Need instant sizing advice, fabric details, or want to place an order directly on WhatsApp?
                            </p>
                            <a
                                href={`https://wa.me/${cleanWhatsappNum}?text=${encodeURIComponent(`Hello ${shop.name}! I would like to inquire about your apparel collection.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow"
                            >
                                <MessageCircle size={14} /> Open WhatsApp Chat
                            </a>
                        </div>
                    )}

                    <button
                        onClick={() => setWhatsappPopupOpen(!whatsappPopupOpen)}
                        className="w-14 h-14 rounded-full bg-emerald-600 text-white shadow-2xl flex items-center justify-center hover:scale-105 transition hover:bg-emerald-700 active:scale-95"
                        title="Chat on WhatsApp"
                    >
                        <MessageCircle size={26} />
                    </button>
                </div>
            )}

            {/* Value Proposition 3-Bar Strip */}
            <section className="bg-slate-50 border-t border-b border-slate-200 py-8 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-4 p-2">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-800 shrink-0">
                            <Truck size={22} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-slate-900">
                                FREE SHIPPING & RETURN
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">Complimentary express courier on orders over ${freeShippingThreshold}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-4 p-2">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-800 shrink-0">
                            <RefreshCw size={22} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-slate-900">
                                MONEY BACK GUARANTEE
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">30-day hassle-free returns & instant exchange</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-4 p-2">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-800 shrink-0">
                            <Phone size={22} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-slate-900">
                                ONLINE SUPPORT 24/7
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">Direct WhatsApp hotline: {whatsappNum}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mega Footer */}
            <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs py-14 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    
                    {/* Col 1: Brand Info */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-xl tracking-[0.15em] text-slate-900 uppercase font-bold">
                            {shop.name}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            {shop.description || 'Haute couture & ready-to-wear boutique creating timeless minimal silhouettes, tailored coats, and luxury silks.'}
                        </p>
                        <div className="text-xs space-y-1 text-slate-500">
                            <p className="flex items-center gap-2">
                                <MapPin size={13} className="text-slate-900" />
                                <span>{shop.location?.address || '742 Fashion Blvd, New York, NY'}</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <Phone size={13} className="text-slate-900" />
                                <span>{whatsappNum}</span>
                            </p>
                        </div>
                    </div>

                    {/* Col 2: Quick Links */}
                    <div className="space-y-3">
                        <h4 className="font-serif text-xs font-bold tracking-[0.2em] uppercase text-slate-900">
                            EXPLORE COLLECTIONS
                        </h4>
                        <ul className="space-y-2 text-slate-500">
                            <li><Link to={`/shop/${shop.slug}`} className="hover:text-slate-950 transition">New Season Drop</Link></li>
                            <li><Link to={`/shop/${shop.slug}/lookbook`} className="hover:text-slate-950 transition">Editorial Lookbook</Link></li>
                            <li><Link to={`/dress-shop`} className="hover:text-slate-950 transition">Viral Evening Dresses</Link></li>
                            <li><Link to={`/shop/${shop.slug}/about`} className="hover:text-slate-950 transition">Atelier Craftsmanship</Link></li>
                        </ul>
                    </div>

                    {/* Col 3: Customer Care & Order Tracking */}
                    <div className="space-y-3">
                        <h4 className="font-serif text-xs font-bold tracking-[0.2em] uppercase text-slate-900">
                            CLIENT SERVICES
                        </h4>
                        <ul className="space-y-2 text-slate-500">
                            <li><Link to={`/shop/${shop.slug}/track-order`} className="hover:text-slate-950 font-bold text-indigo-600 transition">Track Your Order 🚚</Link></li>
                            <li><Link to={`/shop/${shop.slug}/contact`} className="hover:text-slate-950 transition">Contact Styling Concierge</Link></li>
                            <li><a href={`https://wa.me/${cleanWhatsappNum}`} target="_blank" rel="noreferrer" className="hover:text-slate-950 transition">Order on WhatsApp</a></li>
                            <li><Link to="/panel" className="hover:text-slate-950 transition">Super Admin Cloud</Link></li>
                        </ul>
                    </div>

                    {/* Col 4: Newsletter */}
                    <div className="space-y-3">
                        <h4 className="font-serif text-xs font-bold tracking-[0.2em] uppercase text-slate-900">
                            VIP ACCESS
                        </h4>
                        <p className="text-xs text-slate-400">
                            Join our private circle for early lookbook previews and exclusive flash promotions.
                        </p>
                        <form onSubmit={(e) => { e.preventDefault(); showToast('Subscribed to VIP circle!', 'success'); }} className="space-y-2">
                            <input
                                type="email"
                                required
                                placeholder="Enter your email..."
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                            />
                            <button
                                type="submit"
                                className="w-full py-2.5 bg-slate-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition"
                            >
                                Join VIP Circle
                            </button>
                        </form>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
                    <p>© 2025 {shop.name}. Powered by Kaizer Multi-Tenant Commerce Engine.</p>
                    <div className="flex items-center gap-4">
                        <Link to={`/shop/${shop.slug}/about`} className="hover:underline">Privacy Policy</Link>
                        <span>·</span>
                        <Link to={`/shop/${shop.slug}/contact`} className="hover:underline">Terms of Service</Link>
                    </div>
                </div>
            </footer>

            {/* Shopping Bag Slide-Over Drawer */}
            {cartOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setCartOpen(false)}
                    />

                    <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
                        
                        {/* Drawer Header */}
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShoppingBag size={18} className="text-slate-900" />
                                <h3 className="font-serif text-slate-900 text-base uppercase font-bold">Shopping Bag</h3>
                                <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                                    {cartCount}
                                </span>
                            </div>
                            <button
                                onClick={() => setCartOpen(false)}
                                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Free Shipping Progress Indicator */}
                        <div className="p-4 bg-slate-50 border-b border-slate-100 space-y-1.5">
                            <div className="flex justify-between text-xs">
                                <span className="font-bold text-slate-700">
                                    {subtotal >= freeShippingThreshold ? (
                                        <span className="text-emerald-600 flex items-center gap-1 font-extrabold">
                                            <CheckCircle2 size={13} /> You unlocked Free Express Courier!
                                        </span>
                                    ) : (
                                        <span>Add <strong>${(freeShippingThreshold - subtotal).toFixed(2)}</strong> more for Free Courier</span>
                                    )}
                                </span>
                                <span className="font-mono text-slate-400">{freeShippingProgress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-slate-900 transition-all duration-500"
                                    style={{ width: `${freeShippingProgress}%` }}
                                />
                            </div>
                        </div>

                        {/* Cart Items List */}
                        <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100 space-y-3">
                            {safeCart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
                                    <ShoppingBag size={48} className="text-slate-200" />
                                    <p className="text-sm font-bold text-slate-600">Your bag is empty</p>
                                    <p className="text-xs text-slate-400">Browse our latest collection to add luxury garments.</p>
                                </div>
                            ) : (
                                safeCart.map((it, idx) => (
                                    <div key={`${it.productId}-${it.size}-${it.color}-${idx}`} className="pt-3 first:pt-0 flex gap-3">
                                        <div className="w-16 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                            {it.image ? (
                                                <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl">{it.emoji}</div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="text-xs font-bold text-slate-900 uppercase truncate">{it.name}</h4>
                                                    <button
                                                        onClick={() => removeItem(idx)}
                                                        className="text-slate-400 hover:text-rose-500 transition"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                                <p className="text-[11px] text-slate-500 mt-0.5">
                                                    Size: <strong className="text-slate-800">{it.size}</strong> · Color: <strong className="text-slate-800">{it.color}</strong>
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                                    <button onClick={() => updateQty(idx, -1)} className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200"><Minus size={11} /></button>
                                                    <span className="px-2 text-xs font-bold text-slate-900">{it.qty}</span>
                                                    <button onClick={() => updateQty(idx, 1)} className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200"><Plus size={11} /></button>
                                                </div>
                                                <span className="font-bold text-xs text-slate-900 font-mono">{formatPrice(it.price * it.qty)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Cart Drawer Footer */}
                        {safeCart.length > 0 && (
                            <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
                                
                                {/* Promo Code */}
                                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                    <input
                                        value={couponInput}
                                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                        placeholder="Promo Code (SUMMER20)"
                                        className="flex-1 px-3 py-1.5 text-xs uppercase bg-white border border-slate-200 rounded-xl font-mono focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
                                    >
                                        Apply
                                    </button>
                                </form>

                                {/* Price breakdown */}
                                <div className="space-y-1 text-xs">
                                    <div className="flex justify-between text-slate-500">
                                        <span>Subtotal</span>
                                        <span className="font-mono font-bold text-slate-800">{formatPrice(subtotal)}</span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="flex justify-between text-emerald-600 font-bold">
                                            <span>Discount ({appliedCoupon.code})</span>
                                            <span className="font-mono">-{formatPrice(discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-slate-500">
                                        <span>Shipping</span>
                                        <span className="font-mono">{shipping === 0 ? <strong className="text-emerald-600 uppercase">FREE</strong> : formatPrice(shipping)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-extrabold text-slate-950 pt-2 border-t border-slate-200">
                                        <span>Total</span>
                                        <span className="font-mono">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                {/* Dual Order Action Buttons */}
                                <div className="space-y-2 pt-1">
                                    <button
                                        onClick={() => {
                                            setCartOpen(false);
                                            setCheckoutOpen(true);
                                        }}
                                        className="w-full py-3.5 bg-slate-950 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-slate-800 transition shadow flex items-center justify-center gap-2"
                                    >
                                        <CreditCard size={15} /> Checkout Securely
                                    </button>

                                    {shop.paymentMethods?.whatsapp !== false && (
                                        <button
                                            onClick={() => handleWhatsAppOrder(cart)}
                                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow flex items-center justify-center gap-2"
                                        >
                                            <MessageCircle size={15} /> Order on WhatsApp
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Multi-Step Checkout Modal (Supports Card, COD & WhatsApp) */}
            {checkoutOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
                        onClick={() => setCheckoutOpen(false)}
                    />

                    <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
                        
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div>
                                <h3 className="font-serif text-slate-900 text-base uppercase font-bold">Checkout & Courier Dispatch</h3>
                                <p className="text-xs text-slate-400">Direct courier fulfillment for {shop.name}</p>
                            </div>
                            <button
                                onClick={() => setCheckoutOpen(false)}
                                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-200"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitCheckout} className="p-6 overflow-y-auto space-y-5">
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Shipping Information</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name *</label>
                                        <input
                                            required
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address *</label>
                                        <input
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number *</label>
                                        <input
                                            required
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Street Address *</label>
                                        <input
                                            required
                                            value={form.address}
                                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">City *</label>
                                        <input
                                            required
                                            value={form.city}
                                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 mb-1">State</label>
                                            <input
                                                value={form.state}
                                                onChange={(e) => setForm({ ...form, state: e.target.value })}
                                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Zip Code</label>
                                            <input
                                                value={form.zip}
                                                onChange={(e) => setForm({ ...form, zip: e.target.value })}
                                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Selector */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Select Payment Method</h4>
                                <div className="space-y-2">
                                    {shop.paymentMethods?.card !== false && (
                                        <label className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${form.paymentMethod === 'card' ? 'border-slate-950 bg-slate-50' : 'border-slate-200'}`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="card"
                                                    checked={form.paymentMethod === 'card'}
                                                    onChange={() => setForm({ ...form, paymentMethod: 'card' })}
                                                    className="w-4 h-4 accent-slate-950 cursor-pointer"
                                                />
                                                <div>
                                                    <p className="font-bold text-slate-900 text-xs flex items-center gap-1">
                                                        <CreditCard size={14} className="text-indigo-600" /> Credit / Debit Card (Stripe)
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">Encrypted 256-bit SSL transaction</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Instant</span>
                                        </label>
                                    )}

                                    {shop.paymentMethods?.cod !== false && (
                                        <label className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${form.paymentMethod === 'cod' ? 'border-slate-950 bg-slate-50' : 'border-slate-200'}`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="cod"
                                                    checked={form.paymentMethod === 'cod'}
                                                    onChange={() => setForm({ ...form, paymentMethod: 'cod' })}
                                                    className="w-4 h-4 accent-slate-950 cursor-pointer"
                                                />
                                                <div>
                                                    <p className="font-bold text-slate-900 text-xs flex items-center gap-1">
                                                        <DollarSign size={14} className="text-emerald-600" /> Cash on Delivery (COD)
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">Pay courier in cash upon package delivery</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase">Popular</span>
                                        </label>
                                    )}

                                    {shop.paymentMethods?.whatsapp !== false && (
                                        <label className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${form.paymentMethod === 'whatsapp' ? 'border-slate-950 bg-slate-50' : 'border-slate-200'}`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="whatsapp"
                                                    checked={form.paymentMethod === 'whatsapp'}
                                                    onChange={() => setForm({ ...form, paymentMethod: 'whatsapp' })}
                                                    className="w-4 h-4 accent-slate-950 cursor-pointer"
                                                />
                                                <div>
                                                    <p className="font-bold text-slate-900 text-xs flex items-center gap-1">
                                                        <MessageCircle size={14} className="text-emerald-500" /> 1-Click Order on WhatsApp
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">Send order directly to merchant WhatsApp</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase">Fast</span>
                                        </label>
                                    )}

                                    {/* Merchant Configured Custom Payment Methods */}
                                    {Array.isArray(shop.customPaymentMethods) && shop.customPaymentMethods.filter((c) => c.active !== false).map((cpm) => {
                                        const isSelected = form.paymentMethod === `cpm-${cpm.id}`;
                                        return (
                                            <div key={cpm.id} className="space-y-2">
                                                <label className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${isSelected ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="radio"
                                                            name="payment"
                                                            value={`cpm-${cpm.id}`}
                                                            checked={isSelected}
                                                            onChange={() => setForm({ ...form, paymentMethod: `cpm-${cpm.id}` })}
                                                            className="w-4 h-4 accent-indigo-600 cursor-pointer"
                                                        />
                                                        <div>
                                                            <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                                                <span className="w-2 h-2 rounded-full bg-indigo-600" /> {cpm.name}
                                                            </p>
                                                            <p className="text-[10px] text-slate-500 font-mono">
                                                                {cpm.accountNumber ? `Account: ${cpm.accountNumber}` : 'Direct Merchant Verification'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded uppercase">
                                                        Manual Verification
                                                    </span>
                                                </label>

                                                {isSelected && (
                                                    <CustomPaymentForm
                                                        method={cpm}
                                                        paymentData={customPaymentData}
                                                        onChange={(field, val) => setCustomPaymentData((prev) => ({ ...prev, [field]: val }))}
                                                        errors={customPaymentErrors}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Order Total & Submit */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                                <div className="flex justify-between text-xs text-slate-600">
                                    <span>Items ({cartCount})</span>
                                    <span className="font-mono">${subtotal.toFixed(2)} USD</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-600">
                                    <span>Delivery Courier</span>
                                    <span className="font-mono">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                                    <span>Total Payable</span>
                                    <span className="font-mono">${total.toFixed(2)} USD</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-slate-950 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 transition shadow disabled:opacity-50"
                            >
                                {isSubmitting ? 'Securing Courier Booking...' : `Confirm & Place Order · $${total.toFixed(2)} USD`}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Order Placed Success Modal */}
            {orderPlaced && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setOrderPlaced(null)} />
                    <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="font-serif text-xl uppercase font-bold text-slate-900">Order Confirmed!</h3>
                        <p className="text-xs text-slate-500">
                            Thank you for your order with <strong className="text-slate-800">{shop.name}</strong>. Your confirmation reference is:
                        </p>
                        <div className="p-3 bg-slate-50 rounded-xl font-mono text-sm font-bold text-slate-900 border border-slate-200">
                            {orderPlaced.id}
                        </div>
                        <p className="text-xs text-slate-500">
                            Payment Method: <strong className="text-slate-800">{orderPlaced.paymentMethod || 'Credit Card'}</strong>
                        </p>

                        <div className="pt-2 flex flex-col gap-2">
                            <Link
                                to={`/shop/${shop.slug}/track-order`}
                                onClick={() => setOrderPlaced(null)}
                                className="w-full py-3 bg-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition"
                            >
                                Track Package Status 🚚
                            </Link>
                            <button
                                onClick={() => setOrderPlaced(null)}
                                className="w-full py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StorefrontLayout;