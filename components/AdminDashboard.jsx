"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
  Check,
  Pencil,
  DollarSign,
  Package,
  ShoppingCart,
  AlertTriangle,
  LayoutTemplate,
  Tags,
  LogOut,
} from "lucide-react";
import { signOutAction } from "@/app/actions/authActions";
import {
  updateSiteSettings,
  createCategory,
  deleteCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
} from "@/app/actions/shopActions";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Drawer } from "@/components/ui/Drawer";

function ProductForm({ categories, initialData = null, onSubmit, submitLabel }) {
  return (
    <form action={onSubmit} className="space-y-3.5">
      <Input
        name="name"
        label="Product Title"
        defaultValue={initialData?.name}
        placeholder="e.g. Relaxed Linen Overshirt"
        required
      />
      <Textarea
        name="description"
        label="Fabric & Fit Notes"
        defaultValue={initialData?.description}
        placeholder="100% European flax linen, mother-of-pearl buttons..."
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          name="price"
          label="Price ($)"
          type="number"
          step="0.01"
          defaultValue={initialData?.price}
          required
        />
        <Input
          name="stock"
          label="Stock Units"
          type="number"
          defaultValue={initialData?.stock}
          required
        />
      </div>
      <Select name="categoryId" label="Category" defaultValue={initialData?.categoryId || ""} required>
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
      <Input
        name="imageUrl"
        label="Product Image URL"
        defaultValue={initialData?.imageUrl}
        placeholder="https://images.unsplash.com/..."
        required
      />
      <Input
        name="sizes"
        label="Sizes (comma-separated)"
        defaultValue={initialData?.sizes?.join(", ")}
        placeholder="XS, S, M, L, XL"
        required
      />
      <Input
        name="colors"
        label="Colors (comma-separated)"
        defaultValue={initialData?.colors?.join(", ")}
        placeholder="Washed Black, Sand, Olive"
        required
      />
      <label className="flex items-center gap-2.5 text-xs font-medium text-stone-700 pt-1 cursor-pointer">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={initialData?.featured}
          className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
        />
        Highlight as Featured Piece
      </label>
      <Button type="submit" className="w-full" size="lg">
        {submitLabel}
      </Button>
    </form>
  );
}

export default function AdminDashboard({ settings, categories, products, orders }) {
  const [activeTab, setActiveTab] = useState("PRODUCTS");
  const [savedNotice, setSavedNotice] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleSettingsSubmit = async (formData) => {
    await updateSiteSettings(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleEditSubmit = async (formData) => {
    if (!editingProduct) return;
    await updateProduct(editingProduct.id, formData);
    setEditingProduct(null);
  };

  const totalRevenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  const tabs = [
    { id: "PRODUCTS", label: "Catalog & Inventory", icon: Package, count: products.length },
    { id: "ORDERS", label: "Orders", icon: ShoppingCart, count: orders.length },
    { id: "CMS", label: "Storefront CMS", icon: LayoutTemplate },
    { id: "CATEGORIES", label: "Categories", icon: Tags, count: categories.length },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900">
      {/* Top Workspace Header */}
      {/* Top Workspace Header */}
      <header className="bg-white border-b border-stone-200/80 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 px-3 py-1.5 rounded-full transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Live Storefront
            </Link>
            <span className="font-serif font-bold text-lg tracking-wide">
              {settings?.storeName || "ATELIER THREADS"}{" "}
              <span className="font-sans text-xs font-normal text-stone-400">/ Studio Admin</span>
            </span>
          </div>

          <form action={signOutAction}>
            <Button variant="secondary" size="sm" type="submit">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </Button>
          </form>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, sub: "Excluding cancelled" },
            { label: "Active Orders", value: orders.length, icon: ShoppingCart, sub: `${pendingOrders} awaiting fulfillment` },
            { label: "Catalog Pieces", value: products.length, icon: Package, sub: `Across ${categories.length} categories` },
            { label: "Low Stock Alerts", value: lowStockCount, icon: AlertTriangle, sub: "5 units or fewer" },
          ].map(({ label, value, icon: Icon, sub }) => (
            <div key={label} className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-stone-500">{label}</span>
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-stone-900">{value}</p>
              <p className="text-[11px] text-stone-400 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* Pill Tab Switcher */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition ${
                activeTab === id
                  ? "bg-stone-900 text-white shadow-xs"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-stone-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
              {count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeTab === id ? "bg-white/20 text-white" : "bg-stone-100 text-stone-700"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: PRODUCTS MANAGER */}
        {activeTab === "PRODUCTS" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-stone-200/80 h-fit">
              <h2 className="font-serif text-xl font-semibold mb-1">Add New Piece</h2>
              <p className="text-xs text-stone-500 mb-5">Publish directly to the live catalog.</p>
              <ProductForm categories={categories} onSubmit={createProduct} submitLabel="Publish Product" />
            </div>

            <div className="lg:col-span-8 bg-white rounded-xl border border-stone-200/80 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500">
                  <tr>
                    <th className="py-3.5 px-4">Garment</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Inventory</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition">
                      <td className="py-3.5 px-4 flex items-center gap-3.5">
                        <img src={p.imageUrl} alt={p.name} className="w-11 h-14 object-cover rounded-md bg-stone-100" />
                        <div>
                          <p className="font-medium text-stone-900">{p.name}</p>
                          <p className="text-xs text-stone-400">{p.sizes.join(" · ")}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-stone-600">{p.category?.name}</td>
                      <td className="py-3.5 px-4 font-medium">${p.price.toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        <Badge status={p.stock === 0 ? "SOLD_OUT" : p.stock <= 5 ? "PENDING" : "DELIVERED"}>
                          {p.stock} in stock
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS */}
        {activeTab === "ORDERS" && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-xl border border-stone-200/80 flex flex-col md:flex-row justify-between gap-6"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <span className="font-semibold text-sm text-stone-900">{order.customerName}</span>
                    <span className="text-xs text-stone-400">{order.customerEmail}</span>
                    <Badge status={order.status}>{order.status}</Badge>
                  </div>
                  <p className="text-xs text-stone-500 mb-4">Shipping to: {order.address}</p>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item) => (
                      <span
                        key={item.id}
                        className="text-xs bg-stone-50 border border-stone-200/80 px-3 py-1.5 rounded-md text-stone-700"
                      >
                        <strong>{item.quantity}×</strong> {item.product?.name} ({item.size}, {item.color})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between gap-3">
                  <span className="font-bold text-lg text-stone-900">${order.totalAmount.toFixed(2)}</span>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="border border-stone-200 rounded-md px-3 py-2 text-xs font-medium bg-stone-50 focus:outline-none focus:border-stone-900"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: STOREFRONT CMS */}
        {activeTab === "CMS" && (
          <form
            action={handleSettingsSubmit}
            className="bg-white p-8 rounded-xl border border-stone-200/80 space-y-5 max-w-2xl"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h2 className="font-serif text-xl font-semibold">Storefront Identity & Hero</h2>
                <p className="text-xs text-stone-500">Changes update the live homepage immediately.</p>
              </div>
              {savedNotice && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  <Check className="w-3.5 h-3.5" /> Published
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input name="storeName" label="Brand Name" defaultValue={settings?.storeName} required />
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Announcement Ribbon Color
                </label>
                <input
                  type="color"
                  name="primaryColor"
                  defaultValue={settings?.primaryColor || "#1C1917"}
                  className="w-full h-10 border border-stone-200 rounded-md px-1 bg-white cursor-pointer"
                />
              </div>
            </div>

            <Input name="announcementBar" label="Announcement Banner Text" defaultValue={settings?.announcementBar} />
            <Input name="heroTitle" label="Hero Editorial Headline" defaultValue={settings?.heroTitle} />
            <Textarea name="heroSubtitle" label="Hero Subtitle" defaultValue={settings?.heroSubtitle} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input name="heroImageUrl" label="Hero Lookbook Image URL" defaultValue={settings?.heroImageUrl} />
              <Input name="heroCtaText" label="Primary Button Label" defaultValue={settings?.heroCtaText} />
            </div>

            <Input name="contactEmail" label="Customer Care Email" defaultValue={settings?.contactEmail} />

            <Button type="submit" size="lg">
              Publish Storefront Updates
            </Button>
          </form>
        )}

        {/* TAB 4: CATEGORIES */}
        {activeTab === "CATEGORIES" && (
          <div className="max-w-lg space-y-5">
            <form action={createCategory} className="bg-white p-5 rounded-xl border border-stone-200/80 flex gap-3">
              <Input name="name" placeholder="New Category (e.g. Knitwear)" required />
              <Button type="submit">Add</Button>
            </form>

            <div className="bg-white rounded-xl border border-stone-200/80 divide-y divide-stone-100">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium text-stone-900">{cat.name}</span>
                    <span className="text-xs text-stone-400 ml-2">/{cat.slug}</span>
                  </div>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Product Slide-Over Drawer */}
      <Drawer
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title="Edit Garment"
        subtitle={editingProduct?.name}
      >
        {editingProduct && (
          <ProductForm
            categories={categories}
            initialData={editingProduct}
            onSubmit={handleEditSubmit}
            submitLabel="Save Changes"
          />
        )}
      </Drawer>
    </div>
  );
}