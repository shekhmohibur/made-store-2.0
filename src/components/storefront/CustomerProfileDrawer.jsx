import {
    X, MapPin, Phone, Package,
    LogOut, ShoppingBag, Truck, ChevronRight
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Link } from 'react-router-dom';

/**
 * CustomerProfileDrawer:
 * Customer Storefront Account & Orders Drawer.
 */
const CustomerProfileDrawer = ({ isOpen, onClose, shop }) => {
    const { currentCustomer, customerLogout, orders = [], formatPrice } = useStore();

    if (!isOpen || !currentCustomer) return null;

    const accent = shop?.accent || '#18181b';
    const customerOrders = orders.filter((o) => o.email?.toLowerCase() === currentCustomer.email?.toLowerCase());

    const handleSignOut = () => {
        customerLogout();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
                onClick={onClose}
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                    
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                                style={{ backgroundColor: accent }}
                            >
                                {currentCustomer.name ? currentCustomer.name.slice(0, 2).toUpperCase() : 'CU'}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-slate-900 text-sm">{currentCustomer.name}</h3>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                        {currentCustomer.tier || 'VIP'} Member
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 font-medium">{currentCustomer.email}</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        
                        {/* Saved Contact & Address Card */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={14} className="text-slate-400" /> Default Shipping Address
                                </span>
                            </div>
                            <div className="text-xs text-slate-600 leading-relaxed pl-5 font-medium">
                                <p>{currentCustomer.address || 'No street address saved'}</p>
                                <p>
                                    {[currentCustomer.city, currentCustomer.state, currentCustomer.zip]
                                        .filter(Boolean)
                                        .join(', ') || 'City, State, ZIP'}
                                </p>
                                {currentCustomer.phone && (
                                    <p className="text-slate-500 mt-1 flex items-center gap-1.5">
                                        <Phone size={12} /> {currentCustomer.phone}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Recent Orders Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                                    <Package size={14} /> My Recent Orders ({customerOrders.length})
                                </h4>
                                <Link
                                    to={`/shop/${shop?.slug || ''}/track-order`}
                                    onClick={onClose}
                                    className="text-[11px] font-bold text-indigo-600 hover:underline"
                                >
                                    Track Live →
                                </Link>
                            </div>

                            {customerOrders.length === 0 ? (
                                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
                                    <ShoppingBag size={28} className="mx-auto text-slate-300" />
                                    <p className="text-xs font-bold text-slate-700">No Orders Yet</p>
                                    <p className="text-[11px] text-slate-400">
                                        Your completed purchases and trackable orders will appear here.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {customerOrders.map((ord) => (
                                        <div
                                            key={ord.id}
                                            className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-slate-300 transition"
                                        >
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-mono font-bold text-slate-800">#{ord.id}</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    ord.paymentStatus === 'Paid'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                }`}>
                                                    {ord.paymentStatus || 'Pending'}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                                                <span>{Array.isArray(ord.items) ? `${ord.items.length} items` : '1 package'}</span>
                                                <span className="font-bold text-slate-900">{formatPrice(ord.total)}</span>
                                            </div>

                                            <Link
                                                to={`/shop/${shop?.slug || ''}/track-order`}
                                                onClick={onClose}
                                                className="w-full py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition flex items-center justify-between"
                                            >
                                                <span className="flex items-center gap-1.5 text-slate-600">
                                                    <Truck size={12} /> Status: {ord.status || 'Processing'}
                                                </span>
                                                <ChevronRight size={13} className="text-slate-400" />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer / Sign Out Button */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="w-full py-3 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-600 font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
                        >
                            <LogOut size={14} /> Sign Out of Customer Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfileDrawer;
