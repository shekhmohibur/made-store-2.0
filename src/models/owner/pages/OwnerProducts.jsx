import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Plus, Pencil, Trash2, AlertTriangle, Search,
    LayoutGrid, Table as TableIcon, X
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

const CATEGORIES = ['Men', 'Women', 'Dresses', 'Casuals', 'Accessories'];
const BADGES = ['None', 'New', 'Bestseller', 'Trending', 'Hot', 'Sale', 'Viral Pick', 'Premium'];

const IMAGE_PRESETS = [
    { label: 'Denim Jacket', url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80', emoji: '🧥' },
    { label: 'Oversized Graphic Tee', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', emoji: '👕' },
    { label: 'Cropped Fleece Hoodie', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80', emoji: '🧶' },
    { label: 'Utility Cargo Pants', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80', emoji: '👖' },
    { label: 'Silk Slip Dress', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80', emoji: '👗' },
    { label: 'Floral Maxi Dress', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80', emoji: '🌺' },
    { label: 'Satin Bodycon Dress', url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80', emoji: '💃' },
    { label: 'Linen Camp Shirt', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80', emoji: '👔' },
    { label: 'Ankara Wrap Dress', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80', emoji: '🥻' },
];

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const OwnerProducts = () => {
    const { shop, accent } = useOutletContext();
    const { addProduct, updateProduct, deleteProduct, updateProductStock } = useStore();

    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [catFilter, setCatFilter] = useState('All');
    const [stockFilter, setStockFilter] = useState('All');

    const [modalProduct, setModalProduct] = useState(null); // null = closed, {} = add, product = edit
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('👕');
    const [selectedSizes, setSelectedSizes] = useState(['S', 'M', 'L', 'XL']);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // Open modal with prefilled state
    const openAddModal = () => {
        setSelectedImage(IMAGE_PRESETS[0].url);
        setSelectedEmoji(IMAGE_PRESETS[0].emoji);
        setSelectedSizes(['S', 'M', 'L', 'XL']);
        setModalProduct({});
    };

    const openEditModal = (prod) => {
        setSelectedImage(prod.image || IMAGE_PRESETS[0].url);
        setSelectedEmoji(prod.emoji || '👕');
        setSelectedSizes(prod.sizes || ['S', 'M', 'L', 'XL']);
        setModalProduct(prod);
    };

    const handleSaveProduct = (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);

        const colorsRaw = fd.get('colors') || 'Black, Blue';
        const colorsList = colorsRaw.split(',').map((c) => {
            const name = c.trim();
            return { name, hex: '#18181b' };
        }).filter((c) => c.name.length > 0);

        const data = {
            name: fd.get('name'),
            category: fd.get('category'),
            price: Number(fd.get('price')) || 0,
            originalPrice: Number(fd.get('originalPrice')) || Number(fd.get('price')) * 1.2,
            stock: Number(fd.get('stock')) || 0,
            sku: fd.get('sku') || `SKU-${Date.now().toString(36).toUpperCase()}`,
            badge: fd.get('badge') === 'None' ? '' : fd.get('badge'),
            emoji: selectedEmoji,
            image: selectedImage || (fd.get('customImage') || IMAGE_PRESETS[0].url),
            gallery: [selectedImage || (fd.get('customImage') || IMAGE_PRESETS[0].url)],
            sizes: selectedSizes,
            colors: colorsList,
            description: fd.get('description') || 'Premium apparel crafted from fine textiles.',
            fabric: fd.get('fabric') || '100% Cotton Blend',
            care: fd.get('care') || 'Machine wash cold with like colors.',
        };

        if (modalProduct && modalProduct.id) {
            updateProduct(shop.id, modalProduct.id, data);
        } else {
            addProduct(shop.id, data);
        }
        setModalProduct(null);
    };

    // Filter products
    const filteredProducts = (shop.products || []).filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = catFilter === 'All' || p.category === catFilter;
        const matchesStock =
            stockFilter === 'All'
                ? true
                : stockFilter === 'In Stock'
                ? p.stock > 15
                : stockFilter === 'Low Stock'
                ? p.stock > 0 && p.stock <= 15
                : p.stock === 0;
        return matchesSearch && matchesCat && matchesStock;
    });

    const toggleSize = (s) => {
        setSelectedSizes((prev) =>
            prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
        );
    };

    const inputClass =
        'w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition';
    const labelClass = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5';

    return (
        <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Products & Inventory</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Manage styles, stock quantities, pricing, and variants for {shop.name}.
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition"
                    style={{ backgroundColor: accent }}
                >
                    <Plus size={18} /> Add Apparel Item
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                    <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Search styles, SKU, category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                    />
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
                    <select
                        value={catFilter}
                        onChange={(e) => setCatFilter(e.target.value)}
                        className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer focus:outline-none"
                    >
                        <option value="All">All Categories</option>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                        className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer focus:outline-none"
                    >
                        <option value="All">All Stock Levels</option>
                        <option value="In Stock">In Stock (&gt; 15)</option>
                        <option value="Low Stock">Low Stock (&le; 15)</option>
                        <option value="Out of Stock">Out of Stock (0)</option>
                    </select>

                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                            title="Grid View"
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded-lg transition ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                            title="Table View"
                        >
                            <TableIcon size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Product List Content */}
            {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                    <p className="text-base font-bold text-slate-700">No products matching current filter</p>
                    <p className="text-xs text-slate-400 mt-1 mb-4">Try clearing filters or add your first apparel item.</p>
                    <button
                        onClick={openAddModal}
                        className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow"
                        style={{ backgroundColor: accent }}
                    >
                        + Add First Product
                    </button>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map((p) => {
                        const isLow = p.stock > 0 && p.stock <= 15;
                        const isOut = p.stock === 0;
                        return (
                            <div
                                key={p.id}
                                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                                    {p.image ? (
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-7xl">
                                            {p.emoji}
                                        </div>
                                    )}

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                                        {p.badge && (
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900/90 text-white backdrop-blur shadow">
                                                {p.badge}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Hover overlay */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1">
                                        <button
                                            onClick={() => openEditModal(p)}
                                            className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 shadow-md backdrop-blur transition"
                                            title="Edit Item"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(p)}
                                            className="p-2 rounded-xl bg-white/90 hover:bg-rose-50 text-rose-600 shadow-md backdrop-blur transition"
                                            title="Delete Item"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                    <div>
                                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                                            <span className="font-semibold">{p.category}</span>
                                            <span className="font-mono text-[11px]">{p.sku || p.id}</span>
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">{p.name}</h3>
                                        <div className="flex items-baseline gap-2 mt-1.5">
                                            <span className="text-base font-extrabold text-slate-900">${p.price}</span>
                                            {p.originalPrice > p.price && (
                                                <span className="text-xs text-slate-400 line-through">${p.originalPrice}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Inventory adjustments footer */}
                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                            isOut
                                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                : isLow
                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        }`}>
                                            {isLow && <AlertTriangle size={12} />}
                                            {isOut ? 'Out of Stock' : `${p.stock} units`}
                                        </span>

                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => updateProductStock(shop.id, p.id, -1)}
                                                className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold hover:bg-slate-100 text-slate-600"
                                                title="Decrement 1"
                                            >
                                                -1
                                            </button>
                                            <button
                                                onClick={() => updateProductStock(shop.id, p.id, 5)}
                                                className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold hover:bg-indigo-50 text-indigo-600"
                                                title="Add 5"
                                            >
                                                +5
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Table View */
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/70">
                                <th className="px-6 py-4">Apparel Item</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Sizes</th>
                                <th className="px-6 py-4">Stock Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProducts.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                                                {p.image ? (
                                                    <img src={p.image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xl">{p.emoji}</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-xs leading-tight">{p.name}</p>
                                                <p className="text-[11px] text-slate-400 font-mono">{p.sku || p.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5 text-xs text-slate-600 font-semibold">{p.category}</td>
                                    <td className="px-6 py-3.5 font-bold text-slate-900">${p.price}</td>
                                    <td className="px-6 py-3.5 text-xs text-slate-500 font-mono">
                                        {(p.sizes || []).join(', ')}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${
                                            p.stock === 0
                                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                : p.stock <= 15
                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        }`}>
                                            {p.stock} units
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => openEditModal(p)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(p)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add / Edit Product Modal */}
            {modalProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalProduct(null)} />
                    <form
                        onSubmit={handleSaveProduct}
                        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {modalProduct.id ? 'Edit Apparel Style' : 'Add New Apparel Item'}
                                </h3>
                                <p className="text-xs text-slate-500">Configure photography, sizing, pricing and stock.</p>
                            </div>
                            <button type="button" onClick={() => setModalProduct(null)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-200">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-5">
                            
                            {/* Image Preset Picker */}
                            <div>
                                <label className={labelClass}>Select Fashion Photography Preset</label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                                    {IMAGE_PRESETS.map((preset) => (
                                        <button
                                            type="button"
                                            key={preset.label}
                                            onClick={() => {
                                                setSelectedImage(preset.url);
                                                setSelectedEmoji(preset.emoji);
                                            }}
                                            className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition ${selectedImage === preset.url ? 'border-indigo-600 ring-2 ring-indigo-500/20 scale-105' : 'border-slate-200 hover:border-slate-300'}`}
                                        >
                                            <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                                            <span className="absolute bottom-1 right-1 text-sm bg-slate-900/80 px-1 rounded backdrop-blur">
                                                {preset.emoji}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Or Custom Image URL */}
                            <div>
                                <label className={labelClass}>Custom Image URL (Optional)</label>
                                <input
                                    name="customImage"
                                    defaultValue={selectedImage}
                                    onChange={(e) => setSelectedImage(e.target.value)}
                                    className={inputClass}
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>Product Title *</label>
                                    <input
                                        name="name"
                                        defaultValue={modalProduct.name || ''}
                                        className={inputClass}
                                        placeholder="e.g. Vintage Washed Denim Jacket"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Category</label>
                                    <select name="category" defaultValue={modalProduct.category || 'Women'} className={inputClass}>
                                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>Merchandise Badge</label>
                                    <select name="badge" defaultValue={modalProduct.badge || 'New'} className={inputClass}>
                                        {BADGES.map((b) => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>Sale Price ($) *</label>
                                    <input
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        defaultValue={modalProduct.price ?? 59}
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Original Price ($) [Compare At]</label>
                                    <input
                                        name="originalPrice"
                                        type="number"
                                        step="0.01"
                                        defaultValue={modalProduct.originalPrice ?? 79}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Current Stock Units *</label>
                                    <input
                                        name="stock"
                                        type="number"
                                        defaultValue={modalProduct.stock ?? 25}
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>SKU Barcode / ID</label>
                                    <input
                                        name="sku"
                                        defaultValue={modalProduct.sku || ''}
                                        className={inputClass}
                                        placeholder="e.g. UT-DNM-001"
                                    />
                                </div>
                            </div>

                            {/* Sizes checkboxes */}
                            <div>
                                <label className={labelClass}>Available Sizing</label>
                                <div className="flex flex-wrap gap-2">
                                    {STANDARD_SIZES.map((sz) => {
                                        const isSel = selectedSizes.includes(sz);
                                        return (
                                            <button
                                                type="button"
                                                key={sz}
                                                onClick={() => toggleSize(sz)}
                                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${isSel ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                                            >
                                                {sz}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <label className={labelClass}>Color Names (Comma Separated)</label>
                                <input
                                    name="colors"
                                    defaultValue={(modalProduct.colors || []).map((c) => c.name || c).join(', ') || 'Black, Ivory, Sage'}
                                    className={inputClass}
                                    placeholder="Black, White, Dusty Rose"
                                />
                            </div>

                            {/* Description & Fabric */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>Product Description</label>
                                    <textarea
                                        name="description"
                                        rows={2}
                                        defaultValue={modalProduct.description || ''}
                                        className={inputClass}
                                        placeholder="Silhouettes, cut details, hardware specifications..."
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Fabric & Composition</label>
                                    <input
                                        name="fabric"
                                        defaultValue={modalProduct.fabric || '100% Cotton'}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Care Instructions</label>
                                    <input
                                        name="care"
                                        defaultValue={modalProduct.care || 'Machine wash cold, hang dry'}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0">
                            <button
                                type="button"
                                onClick={() => setModalProduct(null)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition active:scale-95"
                                style={{ backgroundColor: accent }}
                            >
                                {modalProduct.id ? 'Update Product' : 'Add to Inventory'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
                    <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl p-6 border border-slate-200 animate-in fade-in zoom-in-95">
                        <div className="flex items-center gap-3.5 mb-4">
                            <span className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                                <AlertTriangle size={24} />
                            </span>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Delete Product?</h3>
                                <p className="text-xs text-slate-500">{deleteTarget.name}</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            This apparel style will be removed permanently from your store catalog and inventory records.
                        </p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    deleteProduct(shop.id, deleteTarget.id);
                                    setDeleteTarget(null);
                                }}
                                className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold shadow-lg shadow-rose-600/30 hover:bg-rose-700"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerProducts;