'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Package, ShoppingCart, Users, DollarSign, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';

const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const EMPTY_SLIDE_FORM = {
  badge: '',
  title: '',
  subtitle: '',
  image: '',
  ctaLabel: 'Shop Collection',
  ctaLink: '/shop',
  secCtaLabel: '',
  secCtaLink: '',
  sortOrder: 0,
  isActive: true,
};

export function AdminDashboardClient({
  initialProducts,
  initialCategories,
  initialOrders,
  stats,
  initialSlides = [],
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [slideModalOpen, setSlideModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Unified Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Slide Form State
  const [editingSlideId, setEditingSlideId] = useState(null);
  const [slideForm, setSlideForm] = useState(EMPTY_SLIDE_FORM);
  const [slideError, setSlideError] = useState('');

  // Category Form State
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catError, setCatError] = useState('');

  // Product Form State
  const [productError, setProductError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    basePrice: '',
    salePrice: '',
    images: [],
    categoryId: initialCategories[0]?.id || '',
    featured: true,
    variants: [{ size: 'M', color: 'Black', colorHex: '#18181b', stock: 10 }],
  });

  const activeCategoryId = form.categoryId || initialCategories[0]?.id || '';

  // ==========================================
  // DELETE HANDLER (PRODUCTS & SLIDES)
  // ==========================================
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    const endpoint =
      deleteTarget.type === 'product'
        ? `/api/admin/products/${deleteTarget.id}`
        : `/api/admin/slides/${deleteTarget.id}`;

    const res = await fetch(endpoint, { method: 'DELETE' });

    setDeleting(false);
    setDeleteTarget(null);

    if (res.ok) {
      router.refresh();
    }
  };

  // ==========================================
  // SLIDE HANDLERS
  // ==========================================
  const openNewSlideModal = () => {
    setEditingSlideId(null);
    setSlideError('');
    setSlideForm(EMPTY_SLIDE_FORM);
    setSlideModalOpen(true);
  };

  const openEditSlideModal = (slide) => {
    setEditingSlideId(slide.id);
    setSlideError('');
    setSlideForm({
      badge: slide.badge || '',
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      image: slide.image || '',
      ctaLabel: slide.ctaLabel || 'Shop Collection',
      ctaLink: slide.ctaLink || '/shop',
      secCtaLabel: slide.secCtaLabel || '',
      secCtaLink: slide.secCtaLink || '',
      sortOrder: slide.sortOrder ?? 0,
      isActive: slide.isActive ?? true,
    });
    setSlideModalOpen(true);
  };

  const handleSaveSlide = async (e) => {
    e.preventDefault();
    setSlideError('');

    if (!slideForm.image) {
      setSlideError('Please upload a slide image.');
      return;
    }

    setSaving(true);
    const url = editingSlideId
      ? `/api/admin/slides/${editingSlideId}`
      : '/api/admin/slides';
    const method = editingSlideId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slideForm),
    });

    const data = await res.json();
    if (res.ok) {
      setSlideForm(EMPTY_SLIDE_FORM);
      setEditingSlideId(null);
      setSlideModalOpen(false);
      router.refresh();
    } else {
      setSlideError(data.error || 'Failed to save slide.');
    }
    setSaving(false);
  };

  // ==========================================
  // CATEGORY HANDLER
  // ==========================================
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setSaving(true);
    setCatError('');

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: catName, image: catImage }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCatError(data.error || 'Failed to create category.');
        setSaving(false);
        return;
      }

      if (data.category?.id && !form.categoryId) {
        setForm((prev) => ({ ...prev, categoryId: data.category.id }));
      }

      setCatName('');
      setCatImage('');
      setCategoryModalOpen(false);
      router.refresh();
    } catch {
      setCatError('Network error while creating category.');
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // PRODUCT & VARIANT HANDLERS
  // ==========================================
  const addVariantRow = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { size: 'L', color: 'Black', colorHex: '#18181b', stock: 10 },
      ],
    }));
  };

  const updateVariantRow = (index, field, value) => {
    const updated = [...form.variants];
    updated[index][field] = value;
    setForm({ ...form, variants: updated });
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setProductError('');

    if (!activeCategoryId) {
      setProductError('Please create and select a category first.');
      return;
    }

    if (form.images.length === 0) {
      setProductError('Please upload at least one product image.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          categoryId: activeCategoryId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setProductError(data.error || 'Failed to create product.');
        setSaving(false);
        return;
      }

      setForm({
        name: '',
        description: '',
        basePrice: '',
        salePrice: '',
        images: [],
        categoryId: initialCategories[0]?.id || '',
        featured: true,
        variants: [{ size: 'M', color: 'Black', colorHex: '#18181b', stock: 10 }],
      });
      setProductModalOpen(false);
      router.refresh();
    } catch {
      setProductError('Network error while creating product.');
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // ORDER STATUS HANDLER
  // ==========================================
  const handleOrderStatus = async (orderId, status) => {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* KPI Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase">Total Revenue</span>
            <DollarSign className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-black text-zinc-900">
            {formatPrice(stats.revenue)}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase">Total Orders</span>
            <ShoppingCart className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-black text-zinc-900">{stats.orderCount}</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase">Products</span>
            <Package className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-black text-zinc-900">{stats.productCount}</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase">Customers</span>
            <Users className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-black text-zinc-900">{stats.userCount}</p>
        </div>
      </div>

      {/* Action Bar & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div className="flex gap-2">
          {['products', 'orders', 'slides'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Manage {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={openNewSlideModal}>
            <Plus className="h-4 w-4" />
            New Slide
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCategoryModalOpen(true)}>
            <Plus className="h-4 w-4" />
            New Category
          </Button>
          <Button size="sm" onClick={() => setProductModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Products Management Table */}
      {activeTab === 'products' && (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Total Stock</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {initialProducts.map((p) => {
                const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
                return (
                  <tr key={p.id} className="hover:bg-zinc-50/70">
                    <td className="flex items-center gap-3 px-5 py-3.5 font-semibold text-zinc-900">
                      <img
                        src={p.images?.[0] || '/placeholder.png'}
                        alt=""
                        className="h-11 w-9 rounded-lg object-cover"
                      />
                      <div>
                        <p>{p.name}</p>
                        <p className="text-xs font-normal text-zinc-500">
                          {p.variants.length} variants
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-600">{p.category?.name}</td>
                    <td className="px-5 py-3.5 font-medium">
                      {formatPrice(p.salePrice || p.basePrice)}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={totalStock > 0 ? 'success' : 'danger'}>
                        {totalStock} units
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() =>
                          setDeleteTarget({ type: 'product', id: p.id, name: p.name })
                        }
                        className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders Management Table */}
      {activeTab === 'orders' && (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-5 py-3.5">Order #</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Total</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {initialOrders.map((o) => (
                <tr key={o.id}>
                  <td className="px-5 py-3.5 font-bold text-zinc-900">{o.orderNumber}</td>
                  <td className="px-5 py-3.5 text-zinc-600">
                    {o.user?.name} ({o.user?.email || o.user?.phone})
                  </td>
                  <td className="px-5 py-3.5 font-semibold">
                    {formatPrice(o.totalAmount)}
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={o.status}
                      onChange={(e) => handleOrderStatus(o.id, e.target.value)}
                      className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Slides Management Tab */}
      {activeTab === 'slides' && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {initialSlides.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-zinc-300 p-12 text-center text-sm text-zinc-500">
              No custom slides yet. Click &ldquo;New Slide&rdquo; to add one to your homepage carousel.
            </div>
          ) : (
            initialSlides.map((slide) => (
              <div
                key={slide.id}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xs"
              >
                <div className="relative aspect-[16/9] bg-zinc-100">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-3 top-3 flex items-center gap-1.5">
                    <span className="rounded-full bg-zinc-900/80 px-2.5 py-0.5 text-[10px] font-bold text-white">
                      Order: {slide.sortOrder}
                    </span>
                    <Badge variant={slide.isActive ? 'success' : 'warning'}>
                      {slide.isActive ? 'Active' : 'Hidden'}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  {slide.badge && (
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      {slide.badge}
                    </p>
                  )}
                  <h3 className="mt-1 line-clamp-1 text-base font-bold text-zinc-900">
                    {slide.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                    {slide.subtitle}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
                    <span className="text-xs font-medium text-zinc-600">
                      {slide.ctaLabel} → {slide.ctaLink}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditSlideModal(slide)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                        title="Edit slide"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteTarget({
                            type: 'slide',
                            id: slide.id,
                            name: slide.title,
                          })
                        }
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                        title="Delete slide"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Category Modal (File Upload) */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => {
          setCategoryModalOpen(false);
          setCatError('');
        }}
        title="Create Clothing Category"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          {catError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {catError}
            </div>
          )}
          <Input
            label="Category Name"
            placeholder="e.g. Hoodies & Sweatshirts"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            required
          />
          <ImageUpload
            label="Category Cover Image"
            value={catImage}
            onChange={(url) => setCatImage(url)}
          />
          <Button type="submit" isLoading={saving} className="w-full">
            Save Category
          </Button>
        </form>
      </Modal>

      {/* Create / Edit Hero Slide Modal (File Upload) */}
      <Modal
        isOpen={slideModalOpen}
        onClose={() => {
          setSlideModalOpen(false);
          setEditingSlideId(null);
          setSlideError('');
        }}
        title={editingSlideId ? 'Edit Homepage Slide' : 'Add Homepage Carousel Slide'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveSlide} className="max-h-[80vh] space-y-4 overflow-y-auto pr-1">
          {slideError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {slideError}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Top Badge (Optional)"
              placeholder="NEW DROP 2026"
              value={slideForm.badge}
              onChange={(e) => setSlideForm({ ...slideForm, badge: e.target.value })}
            />
            <Input
              label="Sort Order"
              type="number"
              value={slideForm.sortOrder}
              onChange={(e) => setSlideForm({ ...slideForm, sortOrder: e.target.value })}
            />
          </div>

          <Input
            label="Headline Title"
            placeholder="Elevated Streetwear Essentials."
            value={slideForm.title}
            onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
            required
          />

          <Input
            label="Subtitle (Optional)"
            placeholder="Crafted from 420gsm combed cotton..."
            value={slideForm.subtitle}
            onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
          />

          <ImageUpload
            label="Slide Banner Image"
            value={slideForm.image}
            onChange={(url) => setSlideForm({ ...slideForm, image: url })}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Primary Button Text"
              value={slideForm.ctaLabel}
              onChange={(e) => setSlideForm({ ...slideForm, ctaLabel: e.target.value })}
              required
            />
            <Input
              label="Primary Button Link"
              value={slideForm.ctaLink}
              onChange={(e) => setSlideForm({ ...slideForm, ctaLink: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Secondary Button Text (Optional)"
              placeholder="Explore Sale"
              value={slideForm.secCtaLabel}
              onChange={(e) =>
                setSlideForm({ ...slideForm, secCtaLabel: e.target.value })
              }
            />
            <Input
              label="Secondary Button Link"
              placeholder="/shop?sale=true"
              value={slideForm.secCtaLink}
              onChange={(e) =>
                setSlideForm({ ...slideForm, secCtaLink: e.target.value })
              }
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              checked={slideForm.isActive}
              onChange={(e) =>
                setSlideForm({ ...slideForm, isActive: e.target.checked })
              }
              className="h-4 w-4 rounded border-zinc-300 accent-zinc-900"
            />
            <span className="text-sm font-medium text-zinc-800">
              Active (visible on homepage)
            </span>
          </label>

          <Button type="submit" isLoading={saving} className="w-full">
            {editingSlideId ? 'Update Slide' : 'Publish Slide'}
          </Button>
        </form>
      </Modal>

      {/* Product Modal (Multi-File Upload) */}
      <Modal
        isOpen={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setProductError('');
        }}
        title="Add New Clothing Product"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateProduct} className="max-h-[78vh] space-y-4 overflow-y-auto pr-1">
          {productError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
              {productError}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Category
              </label>
              <select
                value={activeCategoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm"
                required
              >
                {initialCategories.length === 0 ? (
                  <option value="">No categories yet — create one first</option>
                ) : (
                  initialCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Base Price ($)"
              type="number"
              step="0.01"
              value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
              required
            />
            <Input
              label="Sale Price (Optional)"
              type="number"
              step="0.01"
              value={form.salePrice}
              onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
            />
          </div>

          {/* Multi-Image Uploader for Product Gallery */}
          <ImageUpload
            label="Product Photos (First photo is the main cover)"
            value={form.images}
            onChange={(urls) => setForm({ ...form, images: urls })}
            multiple
            required
          />

          {/* Variants Matrix */}
          <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-zinc-700">
                Size & Color Variants
              </span>
              <Button type="button" variant="outline" size="sm" onClick={addVariantRow}>
                + Add Variant
              </Button>
            </div>

            {form.variants.map((v, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2">
                <input
                  placeholder="Size (S, M, L)"
                  value={v.size}
                  onChange={(e) => updateVariantRow(idx, 'size', e.target.value)}
                  className="h-9 rounded-lg border border-zinc-300 bg-white px-2.5 text-xs"
                  required
                />
                <input
                  placeholder="Color Name"
                  value={v.color}
                  onChange={(e) => updateVariantRow(idx, 'color', e.target.value)}
                  className="h-9 rounded-lg border border-zinc-300 bg-white px-2.5 text-xs"
                  required
                />
                <input
                  type="color"
                  value={v.colorHex}
                  onChange={(e) => updateVariantRow(idx, 'colorHex', e.target.value)}
                  className="h-9 w-full rounded-lg border border-zinc-300 bg-white p-1"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) => updateVariantRow(idx, 'stock', e.target.value)}
                  className="h-9 rounded-lg border border-zinc-300 bg-white px-2.5 text-xs"
                  required
                />
              </div>
            ))}
          </div>

          <Button type="submit" isLoading={saving} className="w-full">
            Publish Product
          </Button>
        </form>
      </Modal>

      {/* Reusable Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleting}
        title={deleteTarget?.type === 'product' ? 'Delete Product' : 'Delete Slide'}
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}