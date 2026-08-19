import { createContext, useState, useCallback } from 'react';
import { initialShops, initialOrders } from './seed';

const StoreContext = createContext(null);
export { StoreContext };

const slugify = (s) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const uid = (p) => `${p}-${Date.now().toString(36).toUpperCase()}`;

export const StoreProvider = ({ children }) => {
    const [shops, setShops] = useState(() => initialShops);
    const [orders, setOrders] = useState(() => initialOrders);

    /* ---------- Shops ---------- */
    const addShop = useCallback((data) => {
        const shop = {
            id: uid('SHP'),
            slug: slugify(data.name || 'new-shop'),
            name: data.name,
            description: data.description || '',
            ownerName: data.ownerName || '',
            email: data.email || '',
            plan: data.plan || 'Free',
            status: 'Active',
            accent: data.accent || '#7c3aed',
            logo: (data.name || 'NS').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
            joined: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }),
            products: [],
        };
        setShops((prev) => [...prev, shop]);
        return shop;
    }, []);

    const updateShop = useCallback((id, patch) => {
        setShops((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    }, []);

    const deleteShop = useCallback((id) => {
        setShops((prev) => prev.filter((s) => s.id !== id));
        setOrders((prev) => prev.filter((o) => o.shopId !== id));
    }, []);

    /* ---------- Products ---------- */
    const addProduct = useCallback((shopId, product) => {
        setShops((prev) =>
            prev.map((s) =>
                s.id === shopId ? { ...s, products: [...s.products, { id: uid('P'), stock: 0, ...product }] } : s
            )
        );
    }, []);

    const updateProduct = useCallback((shopId, productId, patch) => {
        setShops((prev) =>
            prev.map((s) =>
                s.id === shopId
                    ? { ...s, products: s.products.map((p) => (p.id === productId ? { ...p, ...patch } : p)) }
                    : s
            )
        );
    }, []);

    const deleteProduct = useCallback((shopId, productId) => {
        setShops((prev) =>
            prev.map((s) =>
                s.id === shopId ? { ...s, products: s.products.filter((p) => p.id !== productId) } : s
            )
        );
    }, []);

    /* ---------- Orders ---------- */
    const placeOrder = useCallback((shopId, items, customer) => {
        const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
        const order = {
            id: uid('ORD'),
            shopId,
            customer: customer.name || 'Guest',
            email: customer.email || '',
            total,
            status: 'Pending',
            items,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }),
        };
        setOrders((prev) => [order, ...prev]);
        // Decrement stock
        setShops((prev) =>
            prev.map((s) =>
                s.id === shopId
                    ? {
                          ...s,
                          products: s.products.map((p) => {
                              const line = items.find((it) => it.productId === p.id);
                              return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p;
                          }),
                      }
                    : s
            )
        );
        return order;
    }, []);

    const updateOrderStatus = useCallback((orderId, status) => {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    }, []);

    const getShopBySlug = useCallback(
        (slug) => shops.find((s) => s.slug === slug) || null,
        [shops]
    );

    const value = {
        shops,
        orders,
        addShop,
        updateShop,
        deleteShop,
        addProduct,
        updateProduct,
        deleteProduct,
        placeOrder,
        updateOrderStatus,
        getShopBySlug,
        getShopOrders: (shopId) => orders.filter((o) => o.shopId === shopId),
    };

        return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
