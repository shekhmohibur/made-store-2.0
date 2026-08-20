import { useState } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import {
    ShoppingBag, Star, Heart, Truck,
    CheckCircle2, Ruler, ChevronRight,
    Share2, X, Phone
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const SIZE_CHART = [
    { size: 'XS', chest: '32-34"', waist: '26-28"', hips: '34-36"' },
    { size: 'S', chest: '35-37"', waist: '29-31"', hips: '37-39"' },
    { size: 'M', chest: '38-40"', waist: '32-34"', hips: '40-42"' },
    { size: 'L', chest: '41-43"', waist: '35-37"', hips: '43-45"' },
    { size: 'XL', chest: '44-46"', waist: '38-40"', hips: '46-48"' },
];

const ProductDetail = () => {
    const { productId } = useParams();
    const { shop, addToCart, formatPrice = (p) => `$${Number(p).toFixed(2)}` } = useOutletContext();
    const { wishlist, toggleWishlist, isWishlisted, addReview, showToast } = useStore();

    const product = useMemo(() => {
        return (shop.products || []).find((p) => p.id === productId) || shop.products?.[0];
    }, [shop.products, productId]);

    const [selectedImageIdx, setSelectedImageIdx] = useState(0);
    const [selectedSize, setSelectedSize] = useState(() => product?.sizes?.[0] || 'M');
    const [selectedColor, setSelectedColor] = useState(() => {
        if (!product?.colors || product.colors.length === 0) return 'Standard';
        return typeof product.colors[0] === 'object' ? product.colors[0].name : product.colors[0];
    });
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [isFitFinderOpen, setIsFitFinderOpen] = useState(false);

    // Review Form Modal
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewAuthor, setReviewAuthor] = useState('');
    const [reviewComment, setReviewComment] = useState('');

    if (!product) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-20 text-center font-sans">
                <h2 className="text-2xl font-serif text-slate-900 uppercase">Apparel Item Not Found</h2>
                <p className="text-xs text-slate-500 mt-2 mb-6">The requested garment may have been moved or archived.</p>
                <Link
                    to={`/shop/${shop.slug}`}
                    className="px-8 py-3 bg-slate-950 text-white font-bold text-xs tracking-widest uppercase hover:bg-slate-800 transition"
                >
                    Back to {shop.name}
                </Link>
            </div>
        );
    }

    const reviews = getProductReviews(product.id);
    const wishlisted = isWishlisted(product.id);
    const galleryImages = product.gallery?.length ? product.gallery : [product.image || ''];
    const currentImg = selectedImage || galleryImages[0];

    const discountPct = product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const relatedProducts = (shop.products || []).filter((p) => p.id !== product.id).slice(0, 4);

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            showToast('Storefront link copied to clipboard!', 'info');
        }
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!reviewAuthor.trim() || !reviewComment.trim()) return;
        addReview(product.id, {
            author: reviewAuthor,
            rating: reviewRating,
            comment: reviewComment,
        });
        setReviewAuthor('');
        setReviewComment('');
        setIsReviewModalOpen(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12 bg-white text-slate-900 font-sans">
            
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-slate-400">
                <Link to={`/shop/${shop.slug}`} className="hover:text-slate-900 transition">
                    HOME
                </Link>
                <ChevronRight size={11} />
                <span className="text-slate-600">{product.category}</span>
                <ChevronRight size={11} />
                <span className="text-slate-900 truncate max-w-xs">{product.name}</span>
            </nav>

            {/* Product Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
                
                {/* Left: Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-[3/4] bg-[#f8fafc] overflow-hidden border border-slate-100 shadow-sm">
                        <img
                            src={currentImg}
                            alt={product.name}
                            className="w-full h-full object-cover object-top"
                        />

                        {discountPct > 0 && (
                            <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#b86868] text-white flex items-center justify-center text-xs font-black shadow-sm">
                                -{discountPct}%
                            </div>
                        )}

                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <button
                                onClick={handleShare}
                                className="w-9 h-9 rounded-full bg-white text-slate-700 shadow-md flex items-center justify-center hover:bg-slate-900 hover:text-white transition"
                                title="Share product"
                            >
                                <Share2 size={14} />
                            </button>
                            <button
                                onClick={() => toggleWishlist(product.id)}
                                className="w-9 h-9 rounded-full bg-white text-slate-700 shadow-md flex items-center justify-center hover:bg-slate-900 hover:text-white transition"
                                title="Save to wishlist"
                            >
                                <Heart size={14} className={wishlisted ? 'text-rose-500 fill-rose-500' : ''} />
                            </button>
                        </div>
                    </div>

                    {/* Thumbnail Strip */}
                    {galleryImages.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-1">
                            {galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-20 h-24 overflow-hidden border-2 transition shrink-0 ${currentImg === img ? 'border-slate-900 opacity-100' : 'border-slate-200 opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover object-top" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Purchase Specs & Controls */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                            <span className="font-bold tracking-widest uppercase text-slate-900">{product.category}</span>
                            <span>•</span>
                            <span className="font-mono text-[11px]">SKU: {product.sku || product.id}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                                <Star size={11} className="fill-amber-400 text-amber-400" />
                                <span>{product.rating || 5.0}</span>
                                <span className="text-slate-400 font-normal">({reviews.length + (product.reviewCount || 10)} reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-4xl font-serif tracking-[0.05em] uppercase text-slate-950 leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-baseline gap-3 mt-3">
                            <span className="text-2xl sm:text-3xl font-black text-slate-900">${Number(product.price).toFixed(2)} USD</span>
                            {product.originalPrice > product.price && (
                                <span className="text-base text-slate-400 line-through font-semibold">${Number(product.originalPrice).toFixed(2)} USD</span>
                            )}
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed tracking-wide">
                            {product.description}
                        </p>
                    </div>

                    {/* Stock Alert */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                        <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" /> In Stock & Ready for Worldwide Courier
                        </span>
                        <span className="font-mono text-slate-500">{product.stock} units available</span>
                    </div>

                    {/* Sizing & Guide */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold tracking-widest uppercase text-slate-900">Select Size:</span>
                            <button
                                onClick={() => setIsSizeGuideOpen(true)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 underline uppercase tracking-wider"
                            >
                                <Ruler size={12} /> Size Measurement Guide
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {(product.sizes || ['S', 'M', 'L', 'XL']).map((s) => {
                                const isSel = selectedSize === s;
                                return (
                                    <button
                                        key={s}
                                        onClick={() => setSelectedSize(s)}
                                        className={`w-12 h-10 flex items-center justify-center text-xs font-bold border transition ${isSel ? 'bg-slate-950 text-white border-slate-950 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-900'}`}
                                    >
                                        {s}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Color Swatch Selector */}
                    <div>
                        <span className="text-xs font-bold tracking-widest uppercase text-slate-900 block mb-2">
                            Colorway: <span className="font-semibold text-slate-600 capitalize">{selectedColor}</span>
                        </span>

                        <div className="flex flex-wrap gap-2.5">
                            {(product.colors || [{ name: 'Standard', hex: '#18181b' }]).map((c, idx) => {
                                const cName = typeof c === 'object' ? c.name : c;
                                const cHex = typeof c === 'object' ? c.hex : '#18181b';
                                const isSel = selectedColor === cName;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedColor(cName)}
                                        className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-bold transition ${isSel ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'}`}
                                    >
                                        <span
                                            className="w-3 h-3 rounded-full border border-white/50"
                                            style={{ backgroundColor: cHex }}
                                        />
                                        <span>{cName}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quantity + Add to Bag + WhatsApp 1-Click */}
                    <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center border border-slate-200 h-12 bg-white shrink-0">
                                <button
                                    onClick={() => setQty(Math.max(1, qty - 1))}
                                    className="px-3.5 h-full text-slate-600 hover:bg-slate-100"
                                >
                                    -
                                </button>
                                <span className="w-8 text-center font-bold text-xs text-slate-900">{qty}</span>
                                <button
                                    onClick={() => setQty(qty + 1)}
                                    className="px-3.5 h-full text-slate-600 hover:bg-slate-100"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={() => addToCart(product, qty, selectedSize, selectedColor)}
                                className="flex-1 h-12 bg-slate-950 text-white font-bold text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 shadow hover:bg-slate-800 transition"
                            >
                                <ShoppingBag size={14} />
                                <span>Add to Bag · ${(product.price * qty).toFixed(2)} USD</span>
                            </button>
                        </div>

                        {shop.paymentMethods?.whatsapp !== false && (
                            <a
                                href={`https://wa.me/${(shop.whatsappNumber || '+18004567890').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                    `🛍️ *DIRECT ORDER FROM ${shop.name}*\n\n` +
                                    `*Product:* ${product.name}\n` +
                                    `*SKU:* ${product.sku || product.id}\n` +
                                    `*Size:* ${selectedSize}\n` +
                                    `*Color:* ${selectedColor}\n` +
                                    `*Qty:* ${qty}\n` +
                                    `*Total:* $${(product.price * qty).toFixed(2)} USD\n\n` +
                                    `Please confirm availability and courier booking! Thank you.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-none flex items-center justify-center gap-2 shadow transition"
                            >
                                <span>Order Directly via WhatsApp 💬</span>
                            </a>
                        )}
                    </div>

                    {/* Features Strip */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                        <div className="p-3 bg-slate-50 border border-slate-100">
                            <Truck size={17} className="mx-auto text-slate-900 mb-1" />
                            <p className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Free Shipping</p>
                            <p className="text-[10px] text-slate-400">On all orders $100+</p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-100">
                            <CheckCircle2 size={17} className="mx-auto text-slate-900 mb-1" />
                            <p className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">100% Authentic</p>
                            <p className="text-[10px] text-slate-400">Direct from atelier</p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-100">
                            <Phone size={17} className="mx-auto text-slate-900 mb-1" />
                            <p className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">24/7 Concierge</p>
                            <p className="text-[10px] text-slate-400">Expert size styling</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Tabs */}
            <div className="border border-slate-200 p-6 sm:p-10 space-y-6">
                <div className="flex items-center gap-8 border-b border-slate-200 pb-3 text-xs font-bold tracking-[0.2em] uppercase">
                    {['description', 'fabric', 'reviews'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={`pb-3 transition relative ${activeTab === t ? 'text-slate-950 font-black' : 'text-slate-400 hover:text-slate-700'}`}
                        >
                            {t === 'reviews' ? `Customer Reviews (${reviews.length + 2})` : t === 'fabric' ? 'Fabric & Care' : 'Description'}
                            {activeTab === t && (
                                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-slate-950" />
                            )}
                        </button>
                    ))}
                </div>

                {activeTab === 'description' && (
                    <div className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl space-y-3">
                        <p>{product.description}</p>
                        <p>Finished with clean French seams, reinforced stitching, and premium designer hardware.</p>
                    </div>
                )}

                {activeTab === 'fabric' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs max-w-2xl">
                        <div className="bg-slate-50 p-4 border border-slate-200">
                            <p className="font-bold tracking-widest text-slate-400 uppercase text-[10px] mb-1">Textile Composition</p>
                            <p className="font-bold text-slate-900 text-xs">{product.fabric || '100% Premium Natural Blend'}</p>
                        </div>
                        <div className="bg-slate-50 p-4 border border-slate-200">
                            <p className="font-bold tracking-widest text-slate-400 uppercase text-[10px] mb-1">Care Guidelines</p>
                            <p className="font-bold text-slate-900 text-xs">{product.care || 'Specialist dry clean or hand wash cold.'}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-serif text-slate-900 text-base uppercase font-bold">Client Feedback</h3>
                                <p className="text-xs text-slate-500">Verified buyer ratings & reviews</p>
                            </div>
                            <button
                                onClick={() => setIsReviewModalOpen(true)}
                                className="px-4 py-2 bg-slate-950 text-white font-bold text-xs tracking-widest uppercase hover:bg-slate-800 transition"
                            >
                                Write a Review
                            </button>
                        </div>

                        <div className="space-y-3 divide-y divide-slate-100">
                            {reviews.map((r) => (
                                <div key={r.id} className="pt-3 first:pt-0 space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-slate-900">{r.author}</span>
                                        <span className="text-slate-400 text-[11px]">{r.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-400">
                                        {Array.from({ length: r.rating || 5 }).map((_, i) => (
                                            <Star key={i} size={11} className="fill-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-600">{r.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Related Products Carousel */}
            {relatedProducts.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-xl font-serif tracking-[0.2em] uppercase text-slate-950">You May Also Love</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((p) => (
                            <Link
                                key={p.id}
                                to={`/shop/${shop.slug}/product/${p.id}`}
                                className="group flex flex-col text-center"
                            >
                                <div className="aspect-[3/4] bg-[#f8fafc] overflow-hidden mb-3 border border-slate-100">
                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-xs tracking-wider uppercase truncate">{p.name}</p>
                                    <p className="font-black text-slate-900 text-xs mt-1">${Number(p.price).toFixed(2)} USD</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Sizing Modal */}
            {isSizeGuideOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsSizeGuideOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white p-6 sm:p-8 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Ruler size={18} className="text-slate-900" />
                                <h3 className="font-serif text-slate-900 text-base uppercase font-bold">Apparel Sizing Chart (Inches)</h3>
                            </div>
                            <button onClick={() => setIsSizeGuideOpen(false)} className="p-1 text-slate-400 hover:text-slate-900">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="my-6 border border-slate-200 overflow-hidden">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                                        <th className="px-4 py-2.5 text-left">Size</th>
                                        <th className="px-4 py-2.5 text-center">Chest</th>
                                        <th className="px-4 py-2.5 text-center">Waist</th>
                                        <th className="px-4 py-2.5 text-center">Hips</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {SIZE_CHART.map((sc) => (
                                        <tr key={sc.size}>
                                            <td className="px-4 py-2 font-bold text-slate-900">{sc.size}</td>
                                            <td className="px-4 py-2 text-center text-slate-700">{sc.chest}</td>
                                            <td className="px-4 py-2 text-center text-slate-700">{sc.waist}</td>
                                            <td className="px-4 py-2 text-center text-slate-700">{sc.hips}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <button
                            onClick={() => setIsSizeGuideOpen(false)}
                            className="w-full py-2.5 bg-slate-950 text-white font-bold text-xs uppercase tracking-wider"
                        >
                            Close Guide
                        </button>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {isReviewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsReviewModalOpen(false)} />
                    <form onSubmit={handleReviewSubmit} className="relative w-full max-w-md bg-white p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="font-serif text-slate-900 text-base uppercase font-bold">Review {product.name}</h3>
                            <button type="button" onClick={() => setIsReviewModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900">
                                <X size={18} />
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                            <input
                                required
                                value={reviewAuthor}
                                onChange={(e) => setReviewAuthor(e.target.value)}
                                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                                placeholder="Jessica M."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((st) => (
                                    <button
                                        type="button"
                                        key={st}
                                        onClick={() => setReviewRating(st)}
                                        className="p-1.5"
                                    >
                                        <Star size={18} className={reviewRating >= st ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Comments *</label>
                            <textarea
                                rows={3}
                                required
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                                placeholder="Share details about the fit, fabric texture, and sizing..."
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsReviewModalOpen(false)}
                                className="px-4 py-2 border border-slate-200 text-xs font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-slate-950 text-white font-bold text-xs uppercase tracking-wider"
                            >
                                Submit Review
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;