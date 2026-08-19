import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { useStore } from '../../../store/useStore';

const CATEGORIES = ['Men', 'Women', 'Kids', 'Dresses', 'Accessories'];

const OwnerProducts = () => {
    const { shop, accent } = useOutletContext();
    const { addProduct, updateProduct, deleteProduct } = useStore();
    const [editing, setEditing] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const data = {
            name: fd.get('name'),
            category: fd.get('category'),
            price: Number(fd.get('price')) || 0,
            stock: Number(fd.get('stock')) || 0,
            emoji: fd.get('emoji') || '👕',
            sizes: (fd.get('sizes') || '').split(',').map((s) => s.trim()).filter(Boolean),
            colors: (fd.get('colors') || '').split(',').map((c) => c.trim()).filter(Boolean),
        };
        if (editing && editing.id) updateProduct(shop.id, editing.id, data);
        else addProduct(shop.id, data);
        setEditing(null);
    };

    const lowStock = (p) => p.stock <= 10;
    const input = 'w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100';
    const label = 'block text-sm font-medium text-gray-700 mb-1.5';

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Products & Inventory</h1>
                    <p className="text-sm text-gray-500">{shop.products.length} products in {shop.name}.</p>
                </div>
                <button onClick={() => setEditing({})} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: accent }}>
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {shop.products.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 border-dashed p-12 text-center">
                    <p className="text-gray-500">No products yet. Add your first item.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {shop.products.map((p) => (
                        <div key={p.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col">
                            <div className="flex items-start justify-between">
                                <span className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-3xl">{p.emoji}</span>
                                <div className="flex gap-1">
                                    <button onClick={() => setEditing(p)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-purple-600" title="Edit"><Pencil size={16} /></button>
                                    <button onClick={() => deleteProduct(shop.id, p.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50" title="Delete"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <p className="mt-3 font-semibold text-gray-800">{p.name}</p>
                            <p className="text-sm text-gray-500">{p.category} · ${p.price}</p>
                            <p className="text-xs text-gray-400 mt-1">Sizes: {p.sizes.join(', ') || '—'} · Colors: {p.colors.join(', ') || '—'}</p>
                            <div className="mt-auto pt-3">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${lowStock(p) ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                    {lowStock(p) && <AlertTriangle size={12} />} {p.stock === 0 ? 'Out of stock' : `${p.stock} in stock`}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
                    <form onSubmit={submit} className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800">{editing.id ? 'Edit Product' : 'Add Product'}</h3>
                            <button type="button" onClick={() => setEditing(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">✕</button>
                        </div>
                        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className={label}>Product name *</label>
                                <input name="name" defaultValue={editing.name || ''} className={input} required />
                            </div>
                            <div>
                                <label className={label}>Category</label>
                                <select name="category" defaultValue={editing.category || 'Women'} className={input}>
                                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={label}>Emoji</label>
                                <input name="emoji" defaultValue={editing.emoji || '👕'} className={input} />
                            </div>
                            <div>
                                <label className={label}>Price ($)</label>
                                <input name="price" type="number" min="0" step="0.01" defaultValue={editing.price ?? ''} className={input} required />
                            </div>
                            <div>
                                <label className={label}>Stock</label>
                                <input name="stock" type="number" min="0" defaultValue={editing.stock ?? 0} className={input} />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={label}>Sizes (comma separated)</label>
                                <input name="sizes" defaultValue={(editing.sizes || ['S', 'M', 'L', 'XL']).join(', ')} className={input} />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={label}>Colors (comma separated)</label>
                                <input name="colors" defaultValue={(editing.colors || []).join(', ')} className={input} placeholder="Red, Blue, Black" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
                            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100">Cancel</button>
                            <button type="submit" className="px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: accent }}>{editing.id ? 'Save Changes' : 'Add Product'}</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default OwnerProducts;