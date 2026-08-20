import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
    Save, MapPin, Users, CreditCard, MessageCircle,
    ExternalLink, DollarSign, Shield
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

const DEMOGRAPHIC_OPTIONS = [
    { id: 'Men', label: "Men's Collection", desc: 'Tailored coats, jackets, graphic tees, trousers' },
    { id: 'Women', label: "Women's Collection", desc: 'Flared jackets, evening wear, silk dresses, blouses' },
    { id: 'Children', label: "Children & Kids Style", desc: 'Junior fashion, comfortable organic cottons' },
    { id: 'Accessories', label: 'Bags & Accessories', desc: 'Italian leather goods, belts, luxury jewelry' },
];

const OwnerSettings = () => {
    const { shop, accent } = useOutletContext();
    const { updateShop, showToast } = useStore();

    // Form state initialized with shop data
    const [name, setName] = useState(shop.name || '');
    const [tagline, setTagline] = useState(shop.tagline || '');
    const [description, setDescription] = useState(shop.description || '');
    const [phone, setPhone] = useState(shop.phone || '');
    const [email, setEmail] = useState(shop.email || '');
    const [whatsappNumber, setWhatsappNumber] = useState(shop.whatsappNumber || '+1 (800) 456-7890');

    // Location
    const [address, setAddress] = useState(shop.location?.address || '742 Fashion Boulevard, Suite 500');
    const [city, setCity] = useState(shop.location?.city || 'New York, NY');
    const [country, setCountry] = useState(shop.location?.country || 'United States');
    const [postalCode, setPostalCode] = useState(shop.location?.postalCode || '10001');

    // Demographics
    const [demographics, setDemographics] = useState(shop.demographics || ['Men', 'Women', 'Accessories']);

    // Payment Methods
    const [paymentMethods, setPaymentMethods] = useState(
        shop.paymentMethods || { card: true, cod: true, whatsapp: true, applePay: true }
    );

    // Feature Toggles
    const [features, setFeatures] = useState(
        shop.features || {
            enableWhatsAppChat: true,
            enableStylistChat: true,
            enableFlashCountdown: true,
            enableOrderTracking: true,
        }
    );

    // Shipping & Announcement
    const [freeShippingThreshold, setFreeShippingThreshold] = useState(
        shop.shipping?.freeShippingThreshold || 100
    );
    const [announcementText, setAnnouncementText] = useState(
        shop.announcement?.text || 'Complimentary Express Worldwide Courier on orders over $100 · Code SUMMER20'
    );
    const [announcementEnabled, setAnnouncementEnabled] = useState(
        shop.announcement?.enabled !== false
    );

    const toggleDemographic = (id) => {
        setDemographics((prev) =>
            prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
        );
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();
        updateShop(shop.id, {
            name,
            tagline,
            description,
            phone,
            email,
            whatsappNumber,
            location: { address, city, country, postalCode },
            demographics,
            paymentMethods,
            features,
            shipping: {
                ...shop.shipping,
                freeShippingThreshold: Number(freeShippingThreshold) || 100,
            },
            announcement: {
                enabled: announcementEnabled,
                text: announcementText,
            },
        });
        showToast('Boutique settings & features saved successfully!', 'success');
    };

    return (
        <form onSubmit={handleSaveSettings} className="space-y-8 max-w-5xl mx-auto font-sans pb-12">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Store Settings & Customizer
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Configure boutique location, target demographics, WhatsApp order channels, and payment systems for {shop.name}.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to={`/shop/${shop.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                    >
                        <ExternalLink size={14} /> Preview Storefront
                    </Link>
                    <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md transition active:scale-95 flex items-center gap-2"
                        style={{ backgroundColor: accent }}
                    >
                        <Save size={15} /> Save All Changes
                    </button>
                </div>
            </div>

            {/* 1. Brand Identity */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-900 text-base">Boutique Brand Identity</h3>
                        <p className="text-xs text-slate-400">Configure your storefront title, tagline, and contact channels.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Boutique Name *</label>
                        <input
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Urban Threads"
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Store Tagline</label>
                        <input
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            placeholder="Modern Streetwear & Contemporary Culture"
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Brand Pitch / Story</label>
                        <textarea
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Curated premium apparel tailored for modern fashion enthusiasts..."
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Customer Support Phone</label>
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 234-8901"
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 font-mono"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Official WhatsApp Hotline *</label>
                        <input
                            value={whatsappNumber}
                            onChange={(e) => setWhatsappNumber(e.target.value)}
                            placeholder="+1 (800) 456-7890"
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-slate-900"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Physical Location */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-900 text-base">Atelier Location</h3>
                        <p className="text-xs text-slate-400">Displayed in your storefront footer, invoices, and contact pages.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Physical Street Address *</label>
                        <input
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="742 Fashion Boulevard, Suite 500"
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">City / State *</label>
                        <input
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="New York, NY"
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Country / Postal Code</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder="United States"
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                            />
                            <input
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                placeholder="10001"
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Customer Support Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="support@boutique.com"
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Target Demographic / Category Focus */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                        <Users size={20} />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-900 text-base">Audience & Demographic Focus</h3>
                        <p className="text-xs text-slate-400">Select which customer segments your boutique caters to.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {DEMOGRAPHIC_OPTIONS.map((opt) => {
                        const isChecked = demographics.includes(opt.id);
                        return (
                            <label
                                key={opt.id}
                                onClick={() => toggleDemographic(opt.id)}
                                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 select-none ${
                                    isChecked
                                        ? 'border-slate-900 bg-slate-900/5'
                                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {}}
                                    className="w-4 h-4 mt-0.5 accent-slate-900 rounded cursor-pointer"
                                />
                                <div>
                                    <p className="font-bold text-slate-900 text-xs">{opt.label}</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* 3. Order & Payment Systems */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <CreditCard size={20} />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-900 text-base">Payment & Checkout Systems</h3>
                        <p className="text-xs text-slate-400">Enable or disable checkout channels available to customers.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Credit Card */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                <CreditCard size={14} className="text-indigo-600" /> Credit / Debit Card (Stripe Gateway)
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Secure 256-Bit SSL card payments</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={paymentMethods.card}
                            onChange={(e) => setPaymentMethods({ ...paymentMethods, card: e.target.checked })}
                            className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                        />
                    </div>

                    {/* Cash on Delivery (COD) */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                <DollarSign size={14} className="text-emerald-600" /> Cash on Delivery (COD)
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Customer pays courier upon package arrival</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={paymentMethods.cod}
                            onChange={(e) => setPaymentMethods({ ...paymentMethods, cod: e.target.checked })}
                            className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                        />
                    </div>

                    {/* 1-Click Order via WhatsApp */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                <MessageCircle size={14} className="text-emerald-500" /> 1-Click Order via WhatsApp
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Pre-fills order info directly to merchant WhatsApp</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={paymentMethods.whatsapp}
                            onChange={(e) => setPaymentMethods({ ...paymentMethods, whatsapp: e.target.checked })}
                            className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                        />
                    </div>

                    {/* Apple Pay */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                <Shield size={14} className="text-slate-900" /> Apple Pay & Google Wallet
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Instant mobile biometric checkout</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={paymentMethods.applePay}
                            onChange={(e) => setPaymentMethods({ ...paymentMethods, applePay: e.target.checked })}
                            className="w-5 h-5 accent-slate-900 rounded cursor-pointer"
                        />
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Free Shipping Spend Threshold ($)</label>
                    <input
                        type="number"
                        min="0"
                        value={freeShippingThreshold}
                        onChange={(e) => setFreeShippingThreshold(e.target.value)}
                        className="w-48 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                </div>
            </div>

            {/* 4. Interactive Quick Chat & Floating Widgets */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <MessageCircle size={20} />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-900 text-base">Quick Chat & Customer Engagement</h3>
                        <p className="text-xs text-slate-400">Enable real-time communication tools on your storefront.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
                        <div>
                            <p className="font-bold text-slate-900 text-xs">Floating WhatsApp Quick Chat Button</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Bottom corner WhatsApp bubble for immediate inquiries</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={features.enableWhatsAppChat}
                            onChange={(e) => setFeatures({ ...features, enableWhatsAppChat: e.target.checked })}
                            className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                        />
                    </label>

                    <label className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
                        <div>
                            <p className="font-bold text-slate-900 text-xs">VIP Stylist Concierge Chat Drawer</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">In-app interactive sizing and dress consultant</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={features.enableStylistChat}
                            onChange={(e) => setFeatures({ ...features, enableStylistChat: e.target.checked })}
                            className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                        />
                    </label>
                </div>
            </div>

            {/* 5. Top Announcement Banner */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-extrabold text-slate-900 text-base">Storefront Announcement Bar</h3>
                        <p className="text-xs text-slate-400">Top notification bar for flash sales and courier notices.</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                        <input
                            type="checkbox"
                            checked={announcementEnabled}
                            onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                            className="w-4 h-4 accent-slate-900 rounded"
                        />
                        Enable Banner
                    </label>
                </div>

                <input
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="e.g. Complimentary Express Worldwide Courier on orders over $100 · Code SUMMER20"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                />
            </div>

            {/* Save CTA */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="px-8 py-3.5 rounded-2xl text-white font-extrabold text-xs shadow-lg transition active:scale-95 flex items-center gap-2"
                    style={{ backgroundColor: accent }}
                >
                    <Save size={16} /> Save Boutique Settings & Features
                </button>
            </div>
        </form>
    );
};

export default OwnerSettings;
