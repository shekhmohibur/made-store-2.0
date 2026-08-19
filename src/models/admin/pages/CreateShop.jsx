import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useStore } from '../../../store/useStore';

const CreateShop = () => {
    const navigate = useNavigate();
    const { addShop } = useStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        addShop({
            name: fd.get('name') || 'New Shop',
            description: fd.get('description') || '',
            email: fd.get('email') || fd.get('ownerEmail') || '',
            plan: fd.get('plan') || 'Free',
            ownerName: fd.get('ownerName') || '',
        });
        navigate('/panel/shops');
    };

    const input =
        'w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition';
    const label = 'block text-sm font-medium text-gray-700 mb-1.5';

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100" title="Back">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Create New Shop</h1>
                        <p className="text-sm text-gray-500">Set up a new tenant shop on the platform.</p>
                    </div>
                </div>
            </div>

            <form className="grid grid-cols-1 lg:grid-cols-3 gap-6" onSubmit={handleSubmit}>
                {/* Main form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic info */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="font-semibold text-gray-800 mb-1">Shop Information</h2>
                        <p className="text-sm text-gray-500 mb-5">Basic details about the new shop.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className={label}>Shop Name *</label>
                                <input name="name" className={input} placeholder="e.g. Urban Threads" required />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={label}>Description</label>
                                <textarea name="description" rows="3" className={input} placeholder="Short description of the shop" />
                            </div>
                            <div>
                                <label className={label}>Email</label>
                                <input name="email" className={input} type="email" placeholder="shop@example.com" />
                            </div>
                            <div>
                                <label className={label}>Phone</label>
                                <input className={input} type="tel" placeholder="+234 800 000 0000" />
                            </div>
                            <div>
                                <label className={label}>Category</label>
                                <select className={input}>
                                    <option>Men's Wear</option>
                                    <option>Women's Wear</option>
                                    <option>Unisex & Casual</option>
                                    <option>Traditional / Ankara</option>
                                    <option>Accessories</option>
                                </select>
                            </div>
                            <div>
                                <label className={label}>Plan</label>
                                <select name="plan" className={input} defaultValue="Growth">
                                    <option>Free</option>
                                    <option>Growth</option>
                                    <option>Pro</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Owner */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="font-semibold text-gray-800 mb-1">Shop Owner</h2>
                        <p className="text-sm text-gray-500 mb-5">Who manages this shop?</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={label}>Owner Name *</label>
                                <input name="ownerName" className={input} placeholder="Full name" />
                            </div>
                            <div>
                                <label className={label}>Owner Email *</label>
                                <input name="ownerEmail" className={input} type="email" placeholder="owner@example.com" />
                            </div>
                            <div>
                                <label className={label}>Password *</label>
                                <input className={input} type="password" placeholder="Set a password" />
                            </div>
                            <div>
                                <label className={label}>Role</label>
                                <select className={input}>
                                    <option>Owner</option>
                                    <option>Staff</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="font-semibold text-gray-800 mb-4">Plan Summary</h2>
                        <div className="space-y-3 text-sm">
                            {[
                                ['Plan', 'Growth'],
                                ['Product limit', '500'],
                                ['Monthly price', '$19.00'],
                                ['Storage', '50 GB'],
                                ['Support', 'Priority'],
                            ].map(([k, v]) => (
                                <div key={k} className="flex items-center justify-between">
                                    <span className="text-gray-500">{k}</span>
                                    <span className="font-medium text-gray-800">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl text-white p-6 shadow">
                        <h2 className="font-semibold mb-1">Ready to launch?</h2>
                        <p className="text-sm text-white/80 mb-4">Review the details and create the shop. An email will be sent to the owner.</p>
                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-indigo-700 text-sm font-semibold hover:bg-indigo-50 transition"
                        >
                            <Save size={18} /> Create Shop
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default CreateShop;