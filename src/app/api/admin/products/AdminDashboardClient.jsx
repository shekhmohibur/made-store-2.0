'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';

const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export function AdminDashboardClient({ initialProducts, initialCategories, initialOrders, stats }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Category Form State
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState('');

  // Product Form State
  const [form, setForm] = useState({
    name: '',
    description: '',
    basePrice: '',
    salePrice: '',
    imageUrl: '',
    categoryId: initialCategories[0]?.id || '',
    featured: true,
    variants: [{ size: 'M', color: 'Black', colorHex: '#18181b', stock: 10 }],
  });

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

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: catName, image: catImage }),
    });
    if (res.ok) {
      setCatName('');
      setCatImage('');
      setCategoryModalOpen(false);
      router.refresh();
    }
    setSaving(false);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        images: form.imageUrl ? [form.imageUrl] : [],
      }),
    });

    if (res.ok) {
      setProductModalOpen(false);
      router.refresh();
    }
    setSaving(false);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product permanently?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    router.refresh();
  };

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
          {['products', 'orders'].map((tab) => (
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

        <div className="flex gap-2">
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
                        onClick={() => handleDeleteProduct(p.id)}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600"
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

      {/* Create Category Modal */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="Create Clothing Category"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Hoodies & Sweatshirts"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            required
          />
          <Input
            label="Cover Image URL"
            placeholder="https://..."
            value={catImage}
            onChange={(e) => setCatImage(e.target.value)}
          />
          <Button type="submit" isLoading={saving} className="w-full">
            Save Category
          </Button>
        </form>
      </Modal>

      {/* Create Product Modal */}
      <Modal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        title="Add New Clothing Product"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateProduct} className="max-h-[75vh] space-y-4 overflow-y-auto pr-1">
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
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm"
                required
              >
                {initialCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <div className="grid gap-4 sm:grid-cols-3">
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
            <Input
              label="Image URL"
              placeholder="https://..."
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              required
            />
          </div>

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
    </div>
  );
}