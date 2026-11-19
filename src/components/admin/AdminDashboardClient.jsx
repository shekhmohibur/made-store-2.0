'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Pencil, 
  Check, 
  ShieldCheck,
  UserCheck,
  ArrowUpRight,
  ArrowDownLeft, 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Badge } from '@/components/ui/Badge';
import { useSettings } from '@/context/SettingsContext';

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
  initialSettings,
  initialUsers = [],
  currentUserId,
}) {
  const router = useRouter();
  const { currency, formatMoney } = useSettings();

  const [activeTab, setActiveTab] = useState('products');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [slideModalOpen, setSlideModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Unified Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Orders Optimistic State
  const [orders, setOrders] = useState(initialOrders);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [orderError, setOrderError] = useState('');

// Users State (Strictly Separated: Admins/Authors vs Customers)
  const [users, setUsers] = useState(initialUsers);
  const [userSearch, setUserSearch] = useState('');
  const [userError, setUserError] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const filteredUsers = users.filter((u) => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  });

  const handleRoleChange = async (userId, nextRole) => {
    setUserError('');
    setUpdatingUserId(userId);

    const previousUsers = [...users];
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
    );

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        setUsers(previousUsers);
        setUserError(data.error || 'Failed to change user role.');
      } else {
        router.refresh();
      }
    } catch {
      setUsers(previousUsers);
      setUserError('Network error while updating role.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const adminsAndAuthors = filteredUsers.filter((u) => u.role === 'ADMIN');
  const customers = filteredUsers.filter((u) => u.role === 'CUSTOMER');
  // Site & Payment Settings State
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [siteSettings, setSiteSettings] = useState({
    storeName: initialSettings?.storeName || 'ATELIER.',
    logoUrl: initialSettings?.logoUrl || '',
    tagline: initialSettings?.tagline || '',
    currencySymbol: initialSettings?.currencySymbol || '৳',
    deliveryChargeInside: initialSettings?.deliveryChargeInside ?? 60,
    deliveryChargeOutside: initialSettings?.deliveryChargeOutside ?? 120,
    whatsappEnabled: initialSettings?.whatsappEnabled ?? true,
    whatsappNumber: initialSettings?.whatsappNumber || '8801700000000',
    codEnabled: initialSettings?.codEnabled ?? true,
    bkashEnabled: initialSettings?.bkashEnabled ?? true,
    bkashNumber: initialSettings?.bkashNumber || '',
    nagadEnabled: initialSettings?.nagadEnabled ?? true,
    nagadNumber: initialSettings?.nagadNumber || '',
    rocketEnabled: initialSettings?.rocketEnabled ?? true,
    rocketNumber: initialSettings?.rocketNumber || '',
    sslcommerzEnabled: initialSettings?.sslcommerzEnabled ?? false,
  });

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
    setUserError('');

    const endpoint =
      deleteTarget.type === 'product'
        ? `/api/admin/products/${deleteTarget.id}`
        : deleteTarget.type === 'slide'
        ? `/api/admin/slides/${deleteTarget.id}`
        : `/api/admin/users/${deleteTarget.id}`;

    const res = await fetch(endpoint, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));

    setDeleting(false);
    setDeleteTarget(null);

    if (res.ok) {
      if (deleteTarget.type === 'user') {
        setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      }
      router.refresh();
    } else if (deleteTarget.type === 'user') {
      setUserError(data.error || 'Failed to delete user.');
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
  const handleOrderStatus = async (orderId, newStatus) => {
    setOrderError('');
    setUpdatingOrderId(orderId);

    const previousOrders = [...orders];
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        setOrders(previousOrders);
        setOrderError(data.error || 'Failed to update order status.');
      } else {
        router.refresh();
      }
    } catch {
      setOrders(previousOrders);
      setOrderError('Network error while updating order.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ==========================================
  // SITE & PAYMENT SETTINGS HANDLER
  // ==========================================
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSettingsSaved(false);

    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(siteSettings),
    });

    setSaving(false);
    if (res.ok) {
      setSettingsSaved(true);
      router.refresh();
      setTimeout(() => setSettingsSaved(false), 3000);
    }
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
            {formatMoney(stats.revenue)}
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
        <div className="flex flex-wrap gap-2">
          {['products', 'orders', 'users', 'slides', 'settings'].map((tab) => (
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
                      {formatMoney(p.salePrice || p.basePrice)}
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
        <div className="space-y-3">
          {orderError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
              {orderError}
            </div>
          )}

          <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-5 py-3.5">Order #</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5">Total</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-5 py-3.5 font-bold text-zinc-900">{o.orderNumber}</td>
                    <td className="px-5 py-3.5 text-zinc-600">
                      {o.user?.name} ({o.user?.email || o.user?.phone})
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <span className="font-bold text-zinc-800">{o.paymentMethod || 'COD'}</span>
                      {o.paymentTrxId && (
                        <p className="font-mono text-zinc-500">TrxID: {o.paymentTrxId}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-semibold">
                      {formatMoney(o.totalAmount)}
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={o.status}
                        disabled={updatingOrderId === o.id}
                        onChange={(e) => handleOrderStatus(o.id, e.target.value)}
                        className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold disabled:opacity-50"
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
        </div>
      )}

      {/* Users Management Tab — Strictly Separated Admins/Authors vs Customers */}
      {activeTab === 'users' && (
        <div className="space-y-8">
          {/* Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Input
              placeholder="Search users by name, email, or phone..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="max-w-md"
            />
            <div className="flex items-center gap-3 text-xs font-semibold text-zinc-500">
              <span>Admins / Authors: {adminsAndAuthors.length}</span>
              <span>•</span>
              <span>Customers: {customers.length}</span>
            </div>
          </div>

          {userError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
              {userError}
            </div>
          )}

          {/* SECTION 1: ADMINS & AUTHORS */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-zinc-900" />
              <h2 className="text-lg font-bold text-zinc-900">
                Admins &amp; Authors ({adminsAndAuthors.length})
              </h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-900 text-xs uppercase text-zinc-200">
                  <tr>
                    <th className="px-5 py-3.5">Admin / Author</th>
                    <th className="px-5 py-3.5">Contact &amp; Login Methods</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5">Joined</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {adminsAndAuthors.map((u) => {
                    const isSelf = u.id === currentUserId;
                    return (
                      <tr key={u.id} className="bg-zinc-50/40">
                        <td className="px-5 py-3.5 font-semibold text-zinc-900">
                          <div className="flex items-center gap-2">
                            <span>{u.name}</span>
                            {isSelf && <Badge variant="dark">You</Badge>}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-zinc-600">
                          <div className="space-y-1">
                            {u.email && <p>{u.email}</p>}
                            {u.phone && <p>{u.phone}</p>}
                            <div className="flex gap-1 pt-0.5">
                              {u.googleLinked && <Badge variant="success">Google</Badge>}
                              {u.email && <Badge>Email</Badge>}
                              {u.phone && <Badge>Phone</Badge>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant="dark">ADMIN / AUTHOR</Badge>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-zinc-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {!isSelf && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={updatingUserId === u.id}
                              onClick={() => handleRoleChange(u.id, 'CUSTOMER')}
                            >
                              <ArrowDownLeft className="h-3.5 w-3.5" />
                              Move to Customer
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 2: CUSTOMERS */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-zinc-700" />
              <h2 className="text-lg font-bold text-zinc-900">
                Customers ({customers.length})
              </h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
                  <tr>
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Contact &amp; Login Methods</th>
                    <th className="px-5 py-3.5">Orders</th>
                    <th className="px-5 py-3.5">Joined</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-sm text-zinc-500">
                        No customer accounts found.
                      </td>
                    </tr>
                  ) : (
                    customers.map((u) => (
                      <tr key={u.id} className="hover:bg-zinc-50/70">
                        <td className="px-5 py-3.5 font-semibold text-zinc-900">{u.name}</td>
                        <td className="px-5 py-3.5 text-xs text-zinc-600">
                          <div className="space-y-1">
                            {u.email && <p>{u.email}</p>}
                            {u.phone && <p>{u.phone}</p>}
                            <div className="flex gap-1 pt-0.5">
                              {u.googleLinked && <Badge variant="success">Google</Badge>}
                              {u.email && <Badge>Email</Badge>}
                              {u.phone && <Badge>Phone</Badge>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant={u.orderCount > 0 ? 'success' : 'default'}>
                            {u.orderCount} {u.orderCount === 1 ? 'order' : 'orders'}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-zinc-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={updatingUserId === u.id}
                              onClick={() => handleRoleChange(u.id, 'ADMIN')}
                            >
                              <ArrowUpRight className="h-3.5 w-3.5" />
                              Make Admin
                            </Button>
                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  type: 'user',
                                  id: u.id,
                                  name: u.name,
                                })
                              }
                              className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                              title="Delete customer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
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

    {/* Site & Payment Settings Tab */}
          {activeTab === 'settings' && (
            <form
              onSubmit={handleSaveSettings}
              className="space-y-8 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-5">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">General Store Settings</h2>
                  <p className="text-xs text-zinc-500">
                    Control store branding, site-wide currency symbol, and delivery charges.
                  </p>
                </div>
                {settingsSaved && (
                  <Badge variant="success">
                    <Check className="h-3.5 w-3.5" />
                    Saved &amp; Applied Site-Wide
                  </Badge>
                )}
              </div>

              {/* Row 1: Branding (Logo Dropzone Left + Name & Tagline Right) */}
              <div className="grid items-start gap-6 md:grid-cols-12">
                <div className="md:col-span-4">
                  <ImageUpload
                    label="Site Logo (PNG / SVG / WebP)"
                    value={siteSettings.logoUrl}
                    onChange={(url) => setSiteSettings({ ...siteSettings, logoUrl: url })}
                  />
                </div>

                <div className="space-y-4 md:col-span-8">
                  <Input
                    label="Site Name"
                    placeholder="ATELIER."
                    value={siteSettings.storeName}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, storeName: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Store Tagline / Footer Description"
                    placeholder="Contemporary everyday essentials crafted with precision fabrics..."
                    value={siteSettings.tagline}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, tagline: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Row 2: Symmetrical 3-Column Row (Currency + Inside/Outside Delivery) */}
              <div className="grid gap-5 border-t border-zinc-100 pt-6 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Store Currency
                  </label>
                  <div className="flex items-center gap-1.5">
                    {['৳', '$', '€', '£', '₹'].map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => setSiteSettings({ ...siteSettings, currencySymbol: sym })}
                        className={`h-11 flex-1 rounded-lg border text-sm font-bold transition-colors ${
                          siteSettings.currencySymbol === sym
                            ? 'border-zinc-900 bg-zinc-900 text-white'
                            : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-900'
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                    <input
                      value={siteSettings.currencySymbol}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, currencySymbol: e.target.value })
                      }
                      className="h-11 w-12 shrink-0 rounded-lg border border-zinc-300 px-1.5 text-center text-sm font-bold focus:border-zinc-900 focus:outline-none"
                      placeholder="৳"
                      title="Custom symbol"
                    />
                  </div>
                </div>

                <Input
                  label={`Inside Dhaka Delivery (${siteSettings.currencySymbol})`}
                  type="number"
                  value={siteSettings.deliveryChargeInside}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, deliveryChargeInside: e.target.value })
                  }
                />

                <Input
                  label={`Outside Dhaka Delivery (${siteSettings.currencySymbol})`}
                  type="number"
                  value={siteSettings.deliveryChargeOutside}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, deliveryChargeOutside: e.target.value })
                  }
                />
              </div>

              {/* Row 3: WhatsApp Ordering Control */}
              <div className="space-y-4 border-t border-zinc-100 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">WhatsApp Order System</h3>
                    <p className="text-xs text-zinc-500">
                      Customers can send itemized cart &amp; total directly to this WhatsApp number.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={siteSettings.whatsappEnabled}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, whatsappEnabled: e.target.checked })
                    }
                    className="h-4 w-4 rounded accent-zinc-900"
                  />
                </div>

                <div className="max-w-md">
                  <Input
                    label="WhatsApp Number (With Country Code, e.g. 88017XXXXXXXX)"
                    value={siteSettings.whatsappNumber}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Row 4: Local Payment Gateways */}
              <div className="space-y-4 border-t border-zinc-100 pt-6">
                <h3 className="text-sm font-bold text-zinc-900">
                  On-Site Payment Methods (COD, bKash, Nagad, Rocket, SSLCommerz)
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-200 p-4 transition-colors hover:border-zinc-300">
                    <span className="text-sm font-semibold text-zinc-800">
                      Cash on Delivery (COD)
                    </span>
                    <input
                      type="checkbox"
                      checked={siteSettings.codEnabled}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, codEnabled: e.target.checked })
                      }
                      className="h-4 w-4 accent-zinc-900"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-200 p-4 transition-colors hover:border-zinc-300">
                    <span className="text-sm font-semibold text-zinc-800">
                      SSLCommerz Online Gateway
                    </span>
                    <input
                      type="checkbox"
                      checked={siteSettings.sslcommerzEnabled}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, sslcommerzEnabled: e.target.checked })
                      }
                      className="h-4 w-4 accent-zinc-900"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2.5 rounded-xl border border-zinc-200 p-4">
                    <label className="flex cursor-pointer items-center justify-between text-sm font-bold text-pink-600">
                      <span>bKash</span>
                      <input
                        type="checkbox"
                        checked={siteSettings.bkashEnabled}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, bkashEnabled: e.target.checked })
                        }
                        className="h-4 w-4 accent-pink-600"
                      />
                    </label>
                    <Input
                      placeholder="bKash Merchant/Personal Number"
                      value={siteSettings.bkashNumber || ''}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, bkashNumber: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2.5 rounded-xl border border-zinc-200 p-4">
                    <label className="flex cursor-pointer items-center justify-between text-sm font-bold text-orange-600">
                      <span>Nagad</span>
                      <input
                        type="checkbox"
                        checked={siteSettings.nagadEnabled}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, nagadEnabled: e.target.checked })
                        }
                        className="h-4 w-4 accent-orange-600"
                      />
                    </label>
                    <Input
                      placeholder="Nagad Merchant/Personal Number"
                      value={siteSettings.nagadNumber || ''}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, nagadNumber: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2.5 rounded-xl border border-zinc-200 p-4">
                    <label className="flex cursor-pointer items-center justify-between text-sm font-bold text-purple-700">
                      <span>Rocket</span>
                      <input
                        type="checkbox"
                        checked={siteSettings.rocketEnabled}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, rocketEnabled: e.target.checked })
                        }
                        className="h-4 w-4 accent-purple-700"
                      />
                    </label>
                    <Input
                      placeholder="Rocket Account Number"
                      value={siteSettings.rocketNumber || ''}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, rocketNumber: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-zinc-100 pt-5">
                <Button type="submit" isLoading={saving}>
                  Save Site &amp; Payment Settings
                </Button>
              </div>
            </form>
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
              label={`Base Price (${currency})`}
              type="number"
              step="0.01"
              value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
              required
            />
            <Input
              label={`Sale Price (${currency}) (Optional)`}
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
        title={
          deleteTarget?.type === 'product'
            ? 'Delete Product'
            : deleteTarget?.type === 'slide'
            ? 'Delete Slide'
            : 'Delete Customer Account'
        }
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}