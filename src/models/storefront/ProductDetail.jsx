import { useState } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';

const ProductDetail = () => {
    const { productId } = useParams();
    const { shop, accent, addToCart } = useOutletContext();
    const product = shop.products.find((p) => p.id === productId);
    const [size, setSize] = useState(product ? product.sizes[0] : '');
    const [color, setColor] = useState(product ? product.colors[0] : '');
    const [qty, setQty] = useState(1);

    if (!product) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-16 text-center">
                <p className="text-gray-500">Product not found.</p>
                <Link to={`/shop/${shop.slug}`} className="mt-2 inline-block text-purple-600 hover:underline">Back to shop</Link>
            </div>
        );
    }

    const btnCls = 'px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:border-gray-400';

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Link to={`/shop/${shop.slug}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6">
                <ArrowLeft size={15} /> Back to {shop.name}
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center justify-center aspect-square rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 text-[10rem]">
                    {product.emoji}
                </div>

                <div>
                    <p className="text-sm text-gray-400 uppercase tracking-widest">{product.category}</p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{product.name}</h1>
                    <p className="mt-2 text-2xl font-bold text-gray-900">${product.price}</p>
                    <p className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${product.stock === 0 ? 'bg-red-50 text-red-600' : product.stock <= 10 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {product.stock === 0 ? 'Sold out' : `${product.stock} in stock`}
                    </p>

                    <div className="mt-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">Size</p>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map((s) => (
                                <button key={s} onClick={() => setSize(s)} className={`${btnCls} ${size === s ? 'border-gray-800 text-white' : ''}`} style={size === s ? { backgroundColor: accent, borderColor: accent } : undefined}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Color</p>
                        <div className="flex flex-wrap gap-2">
                            {product.colors.map((c) => (
                                <button key={c} onClick={() => setColor(c)} className={`${btnCls} ${color === c ? 'border-gray-800 text-white' : ''}`} style={color === c ? { backgroundColor: accent, borderColor: accent } : undefined}>
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
                        <div className="inline-flex items-center border border-gray-200 rounded-lg">
                            <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-100">−</button>
                            <span className="w-10 text-center font-medium">{qty}</span>
                            <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-gray-600 hover:bg-gray-100">+</button>
                        </div>
                    </div>

                    <button
                        disabled={product.stock === 0}
                        onClick={() => addToCart(product, qty, size, color)}
                        className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold disabled:opacity-40"
                        style={{ backgroundColor: accent }}
                    >
                        {product.stock === 0 ? <Check size={18} /> : <ShoppingBag size={18} />}
                        {product.stock === 0 ? 'Unavailable' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;