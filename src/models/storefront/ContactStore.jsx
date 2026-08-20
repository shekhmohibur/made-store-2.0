import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    MapPin, Phone, Mail, MessageCircle, Send,
    Clock, CheckCircle2
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const ContactStore = () => {
    const { shop } = useOutletContext();
    const { showToast } = useStore();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('General Inquiry / Sizing');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        showToast('Message sent to boutique concierge! We will respond within 24h.', 'success');
    };

    const whatsappLink = `https://wa.me/${(shop.whatsappNumber || '+18004567890').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Hello ${shop.name}! I am inquiring about apparel styling and custom order assistance.`
    )}`;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12 bg-white text-slate-900 font-sans">
            
            {/* Header */}
            <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-[11px] font-bold tracking-[0.25em] text-slate-400 uppercase">
                    CLIENT CONCIERGE & ATELIER
                </span>
                <h1 className="text-3xl sm:text-5xl font-serif tracking-[0.15em] uppercase text-slate-950 font-normal">
                    Contact {shop.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Have questions about sizing, custom fabric specifications, or delivery times? Our dedicated client stylists are at your service.
                </p>
            </div>

            {/* Main Contact Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Left 2 Cols: Message Form */}
                <div className="lg:col-span-2 bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200 space-y-6">
                    <div>
                        <h3 className="font-serif text-xl uppercase text-slate-950 font-bold">Send an Atelier Inquiry</h3>
                        <p className="text-xs text-slate-500 mt-1">Fill in your details below and our style consultants will get in touch.</p>
                    </div>

                    {submitted ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
                            <CheckCircle2 size={40} className="text-emerald-600 mx-auto" />
                            <h4 className="font-serif text-lg text-emerald-950 font-bold">Message Received!</h4>
                            <p className="text-xs text-emerald-700 max-w-md mx-auto">
                                Thank you, {name}. Our client styling team at {shop.name} has received your inquiry and will reply to {email} shortly.
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="px-5 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                                    <input
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Jane Doe"
                                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="jane@example.com"
                                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Topic</label>
                                <select
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 font-bold"
                                >
                                    <option value="General Inquiry / Sizing">General Inquiry & Sizing Advice</option>
                                    <option value="Custom Order / VIP Bridal">Custom Tailoring / Bridal & Evening Wear</option>
                                    <option value="Order Delivery Status">Order Delivery & Tracking Assistance</option>
                                    <option value="Wholesale / Press">Wholesale Partnerships & Press Inquiries</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Your Message *</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Please describe how we can assist you..."
                                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                                />
                            </div>

                            <button
                                type="submit"
                                className="px-8 py-3.5 bg-slate-950 text-white font-bold text-xs tracking-widest uppercase hover:bg-slate-800 transition shadow flex items-center gap-2"
                            >
                                <Send size={14} /> Send Message to Concierge
                            </button>
                        </form>
                    )}
                </div>

                {/* Right Col: Direct Channels */}
                <div className="space-y-6">
                    
                    {/* WhatsApp Fast Contact Card */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                                <MessageCircle size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-emerald-950 text-sm">Direct WhatsApp Chat</h4>
                                <p className="text-[11px] text-emerald-700">Instant responses from active stylist</p>
                            </div>
                        </div>

                        <p className="text-xs text-emerald-900 leading-relaxed">
                            Need immediate assistance with fit or urgent delivery? Chat with our team directly on WhatsApp.
                        </p>

                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow transition"
                        >
                            <MessageCircle size={15} /> Chat on WhatsApp ({shop.whatsappNumber || '+1 800-456-7890'})
                        </a>
                    </div>

                    {/* Physical Details Card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4 text-xs">
                        <h4 className="font-serif text-slate-950 uppercase font-bold text-sm">Flagship Boutique</h4>
                        
                        <div className="space-y-3 text-slate-600">
                            <div className="flex items-start gap-2.5">
                                <MapPin size={16} className="text-slate-900 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-slate-900">{shop.location?.address || '742 Fashion Boulevard, Suite 500'}</p>
                                    <p>{shop.location?.city || 'New York, NY'} · {shop.location?.country || 'United States'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Phone size={16} className="text-slate-900 shrink-0" />
                                <span>{shop.phone || '+1 (800) 456-7890'}</span>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Mail size={16} className="text-slate-900 shrink-0" />
                                <span>{shop.email || 'concierge@zorka-fashion.com'}</span>
                            </div>

                            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200">
                                <Clock size={16} className="text-slate-900 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-slate-900">Atelier Hours</p>
                                    <p>Mon - Fri: 09:00 AM – 08:00 PM EST</p>
                                    <p>Saturday: 10:00 AM – 06:00 PM EST</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactStore;
