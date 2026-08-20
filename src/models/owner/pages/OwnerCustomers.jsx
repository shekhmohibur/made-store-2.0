import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Users, Search, MessageCircle, Crown, Star, Award,
    Plus, Mail, Phone, ShoppingBag, DollarSign, ChevronRight,
    Heart, Download
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

const initialSeedCustomers = [
    {
        id: 'CUST-101',
        name: 'Jessica Miller',
        email: 'jessica.m@example.com',
        phone: '+1 (555) 382-9912',
        tier: 'Platinum',
        ordersCount: 8,
        lifetimeSpend: 1420.00,
        lastOrder: 'Yesterday',
        city: 'New York, NY',
        favoriteCategory: 'Outerwear',
        notes: 'Loves oversized virgin wool coats and French tailoring. Always orders size M.',
    },
    {
        id: 'CUST-102',
        name: 'Alexander Wright',
        email: 'a.wright@fashionmail.com',
        phone: '+1 (555) 839-2104',
        tier: 'Gold',
        ordersCount: 5,
        lifetimeSpend: 840.00,
        lastOrder: '3 days ago',
        city: 'Los Angeles, CA',
        favoriteCategory: 'Streetwear',
        notes: 'Pre-ordered 2 viral denim jackets. Responsive to WhatsApp drop notifications.',
    },
    {
        id: 'CUST-103',
        name: 'Sophia Laurent',
        email: 'sophia@laurent.fr',
        phone: '+33 6 12 34 56 78',
        tier: 'Platinum',
        ordersCount: 11,
        lifetimeSpend: 2890.00,
        lastOrder: '1 week ago',
        city: 'Paris, France',
        favoriteCategory: 'Dresses',
        notes: 'VIP client since launch. Prefers silk charmeuse evening wear.',
    },
    {
        id: 'CUST-104',
        name: 'David Chen',
        email: 'david.chen@techglobal.io',
        phone: '+1 (555) 492-1188',
        tier: 'Silver',
        ordersCount: 3,
        lifetimeSpend: 420.00,
        lastOrder: '2 weeks ago',
        city: 'San Francisco, CA',
        favoriteCategory: 'Linen Collection',
        notes: 'Purchased linen resort shirts for holiday.',
    },
    {
        id: 'CUST-105',
        name: 'Elena Rostova',
        email: 'elena.rostova@atelier.de',
        phone: '+49 151 23456789',
        tier: 'Silver',
        ordersCount: 2,
        lifetimeSpend: 290.00,
        lastOrder: '3 weeks ago',
        city: 'Berlin, Germany',
        favoriteCategory: 'Knitwear',
        notes: 'First time buyer. Rated cashmere knit 5 stars.',
    },
    {
        id: 'CUST-106',
        name: 'Marcus Sterling',
        email: 'marcus@sterlingcorp.co.uk',
        phone: '+44 7700 900123',
        tier: 'Gold',
        ordersCount: 6,
        lifetimeSpend: 950.00,
        lastOrder: '1 month ago',
        city: 'London, UK',
        favoriteCategory: 'Suits & Tailoring',
        notes: 'Prefers expedited courier shipping.',
    },
];

const OwnerCustomers = () => {
    const { shop, accent } = useOutletContext();
    const { showToast } = useStore();

    const [customers, setCustomers] = useState(initialSeedCustomers);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTier, setSelectedTier] = useState('ALL');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // New Customer Form State
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        tier: 'Silver',
        city: '',
        favoriteCategory: 'Ready-to-Wear',
        notes: '',
    });

    // Filtered Customers
    const filteredCustomers = useMemo(() => {
        return customers.filter((c) => {
            const matchesSearch =
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.city.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTier = selectedTier === 'ALL' || c.tier === selectedTier;
            return matchesSearch && matchesTier;
        });
    }, [customers, searchQuery, selectedTier]);

    // KPI Metrics
    const totalCustomers = customers.length;
    const totalLTV = customers.reduce((sum, c) => sum + c.lifetimeSpend, 0);
    const avgLTV = totalCustomers > 0 ? totalLTV / totalCustomers : 0;
    const vipCount = customers.filter((c) => c.tier === 'Platinum' || c.tier === 'Gold').length;

    const handleAddCustomer = (e) => {
        e.preventDefault();
        if (!form.name || !form.email) {
            showToast('Please provide client name and email', 'error');
            return;
        }

        const newCust = {
            id: `CUST-${Date.now().toString().slice(-4)}`,
            ...form,
            ordersCount: 1,
            lifetimeSpend: 150.00,
            lastOrder: 'Today',
        };

        setCustomers([newCust, ...customers]);
        setIsAddModalOpen(false);
        setForm({
            name: '',
            email: '',
            phone: '',
            tier: 'Silver',
            city: '',
            favoriteCategory: 'Ready-to-Wear',
            notes: '',
        });
        showToast(`Client "${newCust.name}" added to VIP Directory!`, 'success');
    };

    const handleOpenWhatsApp = (customer) => {
        const cleanNum = (customer.phone || '').replace(/[^0-9]/g, '');
        if (!cleanNum) {
            showToast('No telephone number on file for this client', 'error');
            return;
        }
        const text = encodeURIComponent(
            `Hello ${customer.name}! Greetings from ${shop.name}. As one of our cherished ${customer.tier} VIP clients, we'd love to share an exclusive curated selection tailored for you.`
        );
        window.open(`https://wa.me/${cleanNum}?text=${text}`, '_blank');
    };

    const exportCSV = () => {
        const headers = ['ID,Name,Email,Phone,Tier,Orders,LTV,LastOrder,City,Category\n'];
        const rows = customers.map(
            (c) => `${c.id},"${c.name}",${c.email},"${c.phone}",${c.tier},${c.ordersCount},${c.lifetimeSpend},"${c.lastOrder}","${c.city}","${c.favoriteCategory}"\n`
        );
        const blob = new Blob([headers.concat(rows)], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${shop.slug}-vip-clients.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Client directory exported to CSV', 'success');
    };

    const getTierBadge = (tier) => {
        switch (tier) {
            case 'Platinum':
                return (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-amber-400/40 shadow-xs">
                        <Crown size={11} className="text-amber-400" /> Platinum VIP
                    </span>
                );
            case 'Gold':
                return (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        <Star size={11} className="text-amber-500 fill-amber-500" /> Gold VIP
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        <Award size={11} className="text-slate-500" /> Silver Client
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6 font-sans">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Users size={24} className="text-indigo-600" />
                        Customer CRM & VIP Concierge
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Manage client relationships, lifetime value (LTV), and private WhatsApp stylist outreach for <strong>{shop.name}</strong>.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={exportCSV}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-xs flex items-center gap-1.5"
                    >
                        <Download size={14} /> Export CSV
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition active:scale-95 flex items-center gap-1.5"
                        style={{ backgroundColor: accent }}
                    >
                        <Plus size={15} /> Add VIP Client
                    </button>
                </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold">Total Clients</span>
                        <Users size={18} className="text-indigo-600" />
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{totalCustomers}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">↑ +14% this month</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold">VIP Platinum & Gold</span>
                        <Crown size={18} className="text-amber-500" />
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{vipCount}</p>
                    <p className="text-[11px] text-slate-400 font-semibold mt-1">High-value repeat patrons</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold">Average LTV</span>
                        <DollarSign size={18} className="text-emerald-600" />
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">${avgLTV.toFixed(2)}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">Top 10% averages $2,100</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold">Total Client GMV</span>
                        <ShoppingBag size={18} className="text-purple-600" />
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">${totalLTV.toLocaleString()}</p>
                    <p className="text-[11px] text-slate-400 font-semibold mt-1">Direct retail & online</p>
                </div>
            </div>

            {/* Filters & Search Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search client by name, email, or city..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                    {['ALL', 'Platinum', 'Gold', 'Silver'].map((tier) => (
                        <button
                            key={tier}
                            onClick={() => setSelectedTier(tier)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${selectedTier === tier ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            {tier === 'ALL' ? 'All Tiers' : `${tier} VIP`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                            <tr>
                                <th className="py-3.5 px-4">Client Name & Email</th>
                                <th className="py-3.5 px-4">VIP Tier</th>
                                <th className="py-3.5 px-4">Orders</th>
                                <th className="py-3.5 px-4">Lifetime Spend (LTV)</th>
                                <th className="py-3.5 px-4">Location</th>
                                <th className="py-3.5 px-4">Last Order</th>
                                <th className="py-3.5 px-4 text-right">Concierge Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-400">
                                        No client records found matching criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((c) => (
                                    <tr
                                        key={c.id}
                                        onClick={() => setSelectedCustomer(c)}
                                        className="hover:bg-slate-50/80 transition cursor-pointer"
                                    >
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                                                    {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 truncate">{c.name}</p>
                                                    <p className="text-[11px] text-slate-400 truncate">{c.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4">{getTierBadge(c.tier)}</td>
                                        <td className="py-3.5 px-4 font-bold text-slate-800">{c.ordersCount} orders</td>
                                        <td className="py-3.5 px-4 font-black font-mono text-emerald-600">${c.lifetimeSpend.toFixed(2)}</td>
                                        <td className="py-3.5 px-4 text-slate-500">{c.city}</td>
                                        <td className="py-3.5 px-4 text-slate-500">{c.lastOrder}</td>
                                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => handleOpenWhatsApp(c)}
                                                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition border border-emerald-200"
                                                    title="Message via WhatsApp"
                                                >
                                                    <MessageCircle size={15} />
                                                </button>
                                                <button
                                                    onClick={() => setSelectedCustomer(c)}
                                                    className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                                                    title="View Profile"
                                                >
                                                    <ChevronRight size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Customer Detail Drawer Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
                        onClick={() => setSelectedCustomer(null)}
                    />
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-right overflow-y-auto">
                        <div className="space-y-6">
                            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                                        {selectedCustomer.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-extrabold text-slate-900">{selectedCustomer.name}</h3>
                                        <div className="mt-1">{getTierBadge(selectedCustomer.tier)}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCustomer(null)}
                                    className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Spend (LTV)</span>
                                    <span className="text-lg font-black font-mono text-emerald-600">${selectedCustomer.lifetimeSpend.toFixed(2)}</span>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Purchased Orders</span>
                                    <span className="text-lg font-black text-slate-900">{selectedCustomer.ordersCount} Completed</span>
                                </div>
                            </div>

                            <div className="space-y-3 text-xs">
                                <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Contact & Details</p>
                                <div className="flex items-center gap-2.5 text-slate-600">
                                    <Mail size={15} className="text-slate-400" />
                                    <span>{selectedCustomer.email}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-slate-600">
                                    <Phone size={15} className="text-slate-400" />
                                    <span>{selectedCustomer.phone}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-slate-600">
                                    <Heart size={15} className="text-rose-400" />
                                    <span>Favorite: <strong>{selectedCustomer.favoriteCategory}</strong></span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Stylist Notes & Sizing</p>
                                <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-2xl text-xs text-amber-900 leading-relaxed">
                                    {selectedCustomer.notes || 'No stylist notes added yet.'}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 space-y-2">
                            <button
                                onClick={() => handleOpenWhatsApp(selectedCustomer)}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={16} /> Open VIP Stylist WhatsApp Chat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add VIP Client Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
                        onClick={() => setIsAddModalOpen(false)}
                    />
                    <form
                        onSubmit={handleAddCustomer}
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 space-y-4 animate-in zoom-in-95"
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="font-extrabold text-base text-slate-900">Add New VIP Patron</h3>
                            <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400">✕</button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Client Full Name *</label>
                                <input
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                    placeholder="e.g. Charlotte Dubois"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                        placeholder="charlotte@paris.com"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">WhatsApp Phone *</label>
                                    <input
                                        required
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">VIP Tier</label>
                                    <select
                                        value={form.tier}
                                        onChange={(e) => setForm({ ...form, tier: e.target.value })}
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                                    >
                                        <option value="Platinum">Platinum VIP 👑</option>
                                        <option value="Gold">Gold VIP ⭐</option>
                                        <option value="Silver">Silver Client 💎</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">City / Region</label>
                                    <input
                                        value={form.city}
                                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                        placeholder="London, UK"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Stylist Notes & Sizing Preferences</label>
                                <textarea
                                    rows={2}
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                    placeholder="Prefers silk evening dresses, size S, custom hem adjustments..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md"
                            >
                                Save Client
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default OwnerCustomers;
