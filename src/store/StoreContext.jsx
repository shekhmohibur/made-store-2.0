import { useState, useEffect, useCallback } from 'react';
import { StoreContext } from './storeDefinition';
import {
    initialShops,
    initialUsers,
    initialOrders,
    initialCoupons,
    initialReviews
} from './seed';
import { formatCurrency } from '../utils/currency';
import ApiService from '../services/api';

const STORAGE_KEYS = {
    SHOPS: 'kaizer_shops_v3',
    USERS: 'kaizer_users_v3',
    ORDERS: 'kaizer_orders_v3',
    COUPONS: 'kaizer_coupons_v3',
    REVIEWS: 'kaizer_reviews_v3',
    WISHLIST: 'kaizer_wishlist_v3',
    CART: 'kaizer_cart_v3',
    CURRENCY: 'kaizer_currency_v3',
    SETTINGS: 'kaizer_settings_v3',
    ACTIVITIES: 'kaizer_activities_v3',
    AUTH_USER: 'kaizer_auth_user_v3',
    API_URL: 'kaizer_custom_api_url',
};

let toastCounter = 1;

const getStored = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch {
        return fallback;
    }
};

const setStored = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Storage sync error:', e);
    }
};

export const StoreProvider = ({ children }) => {
    const [shops, setShops] = useState(() => getStored(STORAGE_KEYS.SHOPS, initialShops));
    const [users, setUsers] = useState(() => getStored(STORAGE_KEYS.USERS, initialUsers));
    const [orders, setOrders] = useState(() => getStored(STORAGE_KEYS.ORDERS, initialOrders));
    const [coupons, setCoupons] = useState(() => getStored(STORAGE_KEYS.COUPONS, initialCoupons));
    const [reviews, setReviews] = useState(() => getStored(STORAGE_KEYS.REVIEWS, initialReviews));
    const [wishlist, setWishlist] = useState(() => getStored(STORAGE_KEYS.WISHLIST, []));
    const [cart, setCart] = useState(() => getStored(STORAGE_KEYS.CART, []));
    const [activeCurrency, setActiveCurrency] = useState(() => getStored(STORAGE_KEYS.CURRENCY, 'USD'));
    const [currentAuthUser, setCurrentAuthUser] = useState(() =>
        getStored(STORAGE_KEYS.AUTH_USER, initialUsers[0]) // Default Super Admin
    );

    // Backend Connection & Synchronization States
    const [backendStatus, setBackendStatus] = useState('checking'); // 'checking' | 'connected' | 'offline'
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncedAt, setLastSyncedAt] = useState(null);
    const [apiBaseUrl, setApiBaseUrlState] = useState(() => ApiService.getBaseUrl());

    const [settings, setSettings] = useState(() =>
        getStored(STORAGE_KEYS.SETTINGS, {
            platformName: 'Kaizer Commerce',
            supportEmail: 'support@kaizercommerce.com',
            commissionRate: 2.5,
            currency: 'USD',
            allowSelfSignup: true,
            requireAdminApproval: true,
            defaultTheme: 'theme-streetwear',
        })
    );

    const [activities, setActivities] = useState(() =>
        getStored(STORAGE_KEYS.ACTIVITIES, [
            { id: 'ACT-1', text: 'New merchant application: "Velvet & Silk Atelier" submitted', time: '5m ago', type: 'signup' },
            { id: 'ACT-2', text: 'Order #ORD-1004 placed at Linen & Co ($118.00)', time: '20m ago', type: 'order' },
            { id: 'ACT-3', text: 'Urban Threads updated inventory for Vintage Washed Denim Jacket', time: '1h ago', type: 'product' },
            { id: 'ACT-4', text: 'Super Admin approved "FB Dress Store" boutique access', time: '2h ago', type: 'approval' },
        ])
    );

    const [toasts, setToasts] = useState([]);
    const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

    // Sync state to local storage
    useEffect(() => setStored(STORAGE_KEYS.SHOPS, shops), [shops]);
    useEffect(() => setStored(STORAGE_KEYS.USERS, users), [users]);
    useEffect(() => setStored(STORAGE_KEYS.ORDERS, orders), [orders]);
    useEffect(() => setStored(STORAGE_KEYS.COUPONS, coupons), [coupons]);
    useEffect(() => setStored(STORAGE_KEYS.REVIEWS, reviews), [reviews]);
    useEffect(() => setStored(STORAGE_KEYS.WISHLIST, wishlist), [wishlist]);
    useEffect(() => setStored(STORAGE_KEYS.CART, cart), [cart]);
    useEffect(() => setStored(STORAGE_KEYS.CURRENCY, activeCurrency), [activeCurrency]);
    useEffect(() => setStored(STORAGE_KEYS.SETTINGS, settings), [settings]);
    useEffect(() => setStored(STORAGE_KEYS.ACTIVITIES, activities), [activities]);
    useEffect(() => setStored(STORAGE_KEYS.AUTH_USER, currentAuthUser), [currentAuthUser]);

    const formatPrice = (usdAmount) => formatCurrency(usdAmount, activeCurrency);

    // Toast Manager
    const dismissToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message, type = 'info', duration = 3500) => {
        const id = `toast-${toastCounter++}`;
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => dismissToast(id), duration);
    }, [dismissToast]);

    const logActivity = (text, type = 'general') => {
        const newAct = { id: `act-${toastCounter++}`, text, time: 'Just now', type };
        setActivities((prev) => [newAct, ...prev.slice(0, 30)]);
    };

    // -------------------------------------------------------------
    // BACKEND HYDRATION & BIDIRECTIONAL SYNC ENGINE
    // -------------------------------------------------------------
    const syncWithBackend = useCallback(async (silent = false) => {
        setIsSyncing(true);
        try {
            const health = await ApiService.checkHealth();
            if (health.online) {
                setBackendStatus('connected');

                // 1. Fetch live shops from MySQL
                const shopRes = await ApiService.getShops().catch(() => null);
                if (shopRes && shopRes.status === 'success' && Array.isArray(shopRes.data) && shopRes.data.length > 0) {
                    setShops((prev) => {
                        const incomingIds = new Set(shopRes.data.map((s) => s.id));
                        const localOnly = prev.filter((s) => !incomingIds.has(s.id));
                        return [...shopRes.data, ...localOnly];
                    });
                }

                // 2. Fetch live orders from MySQL
                const orderRes = await ApiService.getOrders().catch(() => null);
                if (orderRes && orderRes.status === 'success' && Array.isArray(orderRes.data) && orderRes.data.length > 0) {
                    setOrders(orderRes.data);
                }

                // 3. Fetch live users
                const userRes = await ApiService.getUsers().catch(() => null);
                if (userRes && userRes.status === 'success' && Array.isArray(userRes.data) && userRes.data.length > 0) {
                    setUsers(userRes.data);
                }

                setLastSyncedAt(new Date());
                if (!silent) {
                    showToast('Synchronized successfully with MySQL backend! 🟢', 'success');
                }
            } else {
                setBackendStatus('offline');
                if (!silent) {
                    showToast('Backend offline or unreachable. Operating on high-speed local cache.', 'info');
                }
            }
        } catch {
            setBackendStatus('offline');
            if (!silent) {
                showToast('Backend offline or unreachable. Operating on high-speed local cache.', 'info');
            }
        } finally {
            setIsSyncing(false);
        }
    }, [showToast]);

    // Automatic Sync on Initial Boot
    useEffect(() => {
        let isMounted = true;
        const initializeBackend = async () => {
            try {
                const health = await ApiService.checkHealth();
                if (isMounted) {
                    if (health.online) {
                        setBackendStatus('connected');
                        const shopRes = await ApiService.getShops().catch(() => null);
                        if (isMounted && shopRes?.status === 'success' && Array.isArray(shopRes.data) && shopRes.data.length > 0) {
                            setShops((prev) => {
                                const incomingIds = new Set(shopRes.data.map((s) => s.id));
                                const localOnly = prev.filter((s) => !incomingIds.has(s.id));
                                return [...shopRes.data, ...localOnly];
                            });
                        }
                        const orderRes = await ApiService.getOrders().catch(() => null);
                        if (isMounted && orderRes?.status === 'success' && Array.isArray(orderRes.data) && orderRes.data.length > 0) {
                            setOrders(orderRes.data);
                        }
                        setLastSyncedAt(new Date());
                    } else {
                        setBackendStatus('offline');
                    }
                }
            } catch {
                if (isMounted) setBackendStatus('offline');
            }
        };
        initializeBackend();
        return () => {
            isMounted = false;
        };
    }, []);

    const setApiBaseUrl = (newUrl) => {
        ApiService.setBaseUrl(newUrl);
        setApiBaseUrlState(ApiService.getBaseUrl());
        syncWithBackend(false);
    };

    // Auth & Role Switcher
    const loginAs = (userOrRole) => {
        let userToSet;
        if (typeof userOrRole === 'string') {
            if (userOrRole === 'Super Admin') {
                userToSet = users.find((u) => u.role === 'Super Admin') || users[0];
            } else if (userOrRole === 'Pending') {
                userToSet = users.find((u) => u.status === 'Pending') || users[4];
            } else {
                userToSet = users.find((u) => u.role === 'Owner' && u.status === 'Active') || users[1];
            }
        } else {
            userToSet = userOrRole;
        }
        setCurrentAuthUser(userToSet);
        showToast(`Switched session to: ${userToSet.name} (${userToSet.role})`, 'info');
        return userToSet;
    };

    const logout = () => {
        setCurrentAuthUser(null);
        showToast('Logged out of platform', 'info');
    };

    // Merchant Signup Workflow (Creates Pending Store)
    const registerMerchantSignup = (formData) => {
        const slug = formData.slug || formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        const shopId = `SHP-${toastCounter++}`;
        const userId = `USR-${toastCounter++}`;

        const newShop = {
            id: shopId,
            slug,
            name: formData.name,
            tagline: formData.tagline || `Exclusive ${formData.category || 'Fashion'} Storefront`,
            description: formData.description || 'New boutique awaiting Super Admin authorization.',
            ownerName: formData.ownerName,
            email: formData.email,
            phone: formData.phone || '+1 (555) 000-0000',
            plan: formData.plan || 'Growth',
            status: 'Pending', // PENDING APPROVAL BY SUPER ADMIN
            activeTheme: formData.theme || 'theme-streetwear',
            accent: formData.accent || '#6366f1',
            accentSecondary: '#4f46e5',
            logo: (formData.name || 'NB').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
            banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80',
            joined: 'Just now',
            currency: 'USD',
            permissions: {
                allowedThemes: [formData.theme || 'theme-streetwear', 'theme-luxury'],
                canUseCoupons: true,
                customDomain: false,
                maxProducts: 100,
            },
            socials: { instagram: `@${slug}`, website: `https://${slug}.kaizer.store` },
            products: [],
        };

        const newUser = {
            id: userId,
            name: formData.ownerName,
            email: formData.email,
            role: 'Owner',
            shopName: formData.name,
            shopId: shopId,
            status: 'Pending',
            joined: 'Just now',
            avatar: (formData.ownerName || 'U').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
        };

        setShops((prev) => [newShop, ...prev]);
        setUsers((prev) => [...prev, newUser]);
        setCurrentAuthUser(newUser);

        logActivity(`New merchant registration submitted for "${formData.name}" (Pending Review)`, 'signup');
        showToast('Application submitted! Awaiting Super Admin approval.', 'success', 5000);

        return { shop: newShop, user: newUser };
    };

    // Super Admin: Approve Shop Application
    const approveShop = (shopId, customPermissions = null) => {
        setShops((prev) =>
            prev.map((s) => {
                if (s.id === shopId) {
                    const updatedPerms = customPermissions || s.permissions || {
                        allowedThemes: ['theme-streetwear', 'theme-luxury', 'theme-resort', 'theme-viral'],
                        canUseCoupons: true,
                        customDomain: true,
                        maxProducts: 500,
                    };
                    return { ...s, status: 'Active', permissions: updatedPerms };
                }
                return s;
            })
        );

        setUsers((prev) =>
            prev.map((u) => (u.shopId === shopId ? { ...u, status: 'Active' } : u))
        );

        // Async sync with MySQL Backend
        ApiService.updateShop(shopId, { status: 'Active' }).catch(() => {});

        const targetShop = shops.find((s) => s.id === shopId);
        logActivity(`Super Admin approved "${targetShop?.name || shopId}" merchant storefront`, 'approval');
        showToast(`Boutique "${targetShop?.name || shopId}" is now Approved & Live!`, 'success');
    };

    // Super Admin: Reject / Suspend Shop
    const rejectShop = (shopId, reason = 'Application criteria not met') => {
        setShops((prev) =>
            prev.map((s) => (s.id === shopId ? { ...s, status: 'Suspended', rejectReason: reason } : s))
        );
        setUsers((prev) =>
            prev.map((u) => (u.shopId === shopId ? { ...u, status: 'Suspended' } : u))
        );

        // Async sync with MySQL Backend
        ApiService.updateShop(shopId, { status: 'Suspended' }).catch(() => {});

        logActivity(`Super Admin suspended/rejected boutique ${shopId}: ${reason}`, 'warning');
        showToast(`Boutique status updated to Suspended`, 'info');
    };

    // Theme & Appearance Management
    const setShopActiveTheme = (shopId, themeId) => {
        setShops((prev) =>
            prev.map((s) => (s.id === shopId ? { ...s, activeTheme: themeId } : s))
        );
        ApiService.updateShop(shopId, { activeTheme: themeId }).catch(() => {});
        const targetShop = shops.find((s) => s.id === shopId);
        logActivity(`"${targetShop?.name || 'Shop'}" activated theme template: ${themeId}`, 'general');
        showToast(`Active Theme updated to: ${themeId}`, 'success');
    };

    const updateShopPermissions = (shopId, patch) => {
        setShops((prev) =>
            prev.map((s) => {
                if (s.id === shopId) {
                    return { ...s, permissions: { ...s.permissions, ...patch } };
                }
                return s;
            })
        );
        showToast('Store permissions updated', 'success');
    };

    // Shop CRUD
    const addShop = (shopData) => {
        const id = `SHP-${toastCounter++}`;
        const slug = shopData.slug || shopData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        const newShop = {
            id,
            slug,
            status: 'Active',
            activeTheme: 'theme-streetwear',
            permissions: {
                allowedThemes: ['theme-streetwear', 'theme-luxury', 'theme-resort', 'theme-viral'],
                canUseCoupons: true,
                customDomain: true,
                maxProducts: 500,
            },
            joined: 'Today',
            products: [],
            ...shopData,
        };
        setShops((prev) => [newShop, ...prev]);

        // Async sync with MySQL Backend
        ApiService.createShop({ ...newShop, ownerName: shopData.ownerName || 'Owner' }).catch(() => {});

        logActivity(`Created new boutique "${newShop.name}"`, 'shop');
        showToast(`Shop "${newShop.name}" provisioned successfully!`, 'success');
        return newShop;
    };

    const updateShop = (id, patch) => {
        setShops((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
        ApiService.updateShop(id, patch).catch(() => {});
        showToast('Shop details updated', 'success');
    };

    const deleteShop = (id) => {
        const target = shops.find((s) => s.id === id);
        setShops((prev) => prev.filter((s) => s.id !== id));
        ApiService.deleteShop(id).catch(() => {});
        logActivity(`Deleted boutique "${target?.name || id}"`, 'warning');
        showToast(`Deleted shop "${target?.name || id}"`, 'info');
    };

    const duplicateShop = (id) => {
        const source = shops.find((s) => s.id === id);
        if (!source) return;
        const newId = `SHP-${toastCounter++}`;
        const newShop = {
            ...source,
            id: newId,
            name: `${source.name} (Copy)`,
            slug: `${source.slug}-copy`,
            joined: 'Today',
            products: [...(source.products || [])],
        };
        setShops((prev) => [newShop, ...prev]);
        ApiService.createShop(newShop).catch(() => {});
        showToast(`Duplicated "${source.name}"`, 'success');
    };

    const getShopBySlug = (slug) => {
        return shops.find((s) => s.slug === slug) || null;
    };

    // Product CRUD
    const addProduct = (shopId, productData) => {
        const id = `PRD-${toastCounter++}`;
        const newProduct = {
            id,
            rating: 5.0,
            reviewCount: 1,
            ...productData,
        };
        setShops((prev) =>
            prev.map((s) => {
                if (s.id === shopId) {
                    return { ...s, products: [newProduct, ...(s.products || [])] };
                }
                return s;
            })
        );

        // Async sync with MySQL Backend
        ApiService.addProduct(shopId, newProduct).catch(() => {});

        logActivity(`Added apparel item "${newProduct.name}" to inventory`, 'product');
        showToast(`Item "${newProduct.name}" added to catalog`, 'success');
        return newProduct;
    };

    const updateProduct = (shopId, productId, patch) => {
        setShops((prev) =>
            prev.map((s) => {
                if (s.id === shopId) {
                    return {
                        ...s,
                        products: (s.products || []).map((p) => (p.id === productId ? { ...p, ...patch } : p)),
                    };
                }
                return s;
            })
        );
        ApiService.updateProduct(productId, patch).catch(() => {});
        showToast('Product specifications updated', 'success');
    };

    const deleteProduct = (shopId, productId) => {
        setShops((prev) =>
            prev.map((s) => {
                if (s.id === shopId) {
                    return {
                        ...s,
                        products: (s.products || []).filter((p) => p.id !== productId),
                    };
                }
                return s;
            })
        );
        ApiService.deleteProduct(productId).catch(() => {});
        showToast('Product removed from catalog', 'info');
    };

    const updateProductStock = (shopId, productId, delta) => {
        setShops((prev) =>
            prev.map((s) => {
                if (s.id === shopId) {
                    return {
                        ...s,
                        products: (s.products || []).map((p) => {
                            if (p.id === productId) {
                                const newStock = Math.max(0, (Number(p.stock) || 0) + delta);
                                return { ...p, stock: newStock };
                            }
                            return p;
                        }),
                    };
                }
                return s;
            })
        );
        ApiService.updateProduct(productId, { stockDelta: delta }).catch(() => {});
        showToast('Inventory stock level adjusted', 'info');
    };

    // Orders & Checkout
    const placeOrder = (shopId, items, customerInfo, couponCode = '') => {
        const targetShop = shops.find((s) => s.id === shopId);
        const orderId = `ORD-${toastCounter++}`;
        const subtotal = items.reduce((acc, it) => acc + it.price * it.qty, 0);

        let discount = 0;
        if (couponCode) {
            const coupon = coupons.find((c) => c.code.toUpperCase() === couponCode.toUpperCase() && c.active);
            if (coupon) {
                discount = coupon.type === 'percentage' ? Math.round((subtotal * coupon.value) / 100) : Math.min(coupon.value, subtotal);
            }
        }

        const total = Math.max(0, subtotal - discount);

        const newOrder = {
            id: orderId,
            shopId,
            shopName: targetShop ? targetShop.name : 'Fashion Boutique',
            customer: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone || '+1 (555) 019-2834',
            address: customerInfo.address,
            paymentMethod: customerInfo.paymentMethod || 'Credit Card',
            paymentStatus: 'Paid',
            items,
            subtotal,
            discount,
            total,
            status: 'Pending',
            date: 'Today',
            timeline: [
                { title: 'Order Placed', time: 'Just now', done: true },
                { title: 'Payment Confirmed', time: 'Just now', done: true },
                { title: 'Packing at Warehouse', time: 'Queued', done: false },
                { title: 'Courier Delivery', time: 'Pending', done: false },
            ]
        };

        setOrders((prev) => [newOrder, ...prev]);

        // Decrement product stocks
        items.forEach((item) => {
            if (item.productId) {
                updateProductStock(shopId, item.productId, -item.qty);
            }
        });

        // Async sync with MySQL Backend
        ApiService.placeOrder({
            shopId,
            shopName: newOrder.shopName,
            items,
            customer: customerInfo,
            discount,
        }).catch(() => {});

        logActivity(`New order #${orderId} received from ${customerInfo.name} ($${total})`, 'order');
        showToast(`Order #${orderId} placed successfully!`, 'success');
        return newOrder;
    };

    const updateOrderStatus = (orderId, status) => {
        setOrders((prev) =>
            prev.map((o) => {
                if (o.id === orderId) {
                    const updatedTimeline = (o.timeline || []).map((t, idx) => {
                        if (status === 'Delivered') return { ...t, done: true };
                        if (status === 'Shipped' && idx <= 2) return { ...t, done: true };
                        if (status === 'Processing' && idx <= 1) return { ...t, done: true };
                        return t;
                    });
                    return { ...o, status, timeline: updatedTimeline };
                }
                return o;
            })
        );
        ApiService.updateOrderStatus(orderId, status).catch(() => {});
        logActivity(`Order #${orderId} status transitioned to: ${status}`, 'order');
        showToast(`Order #${orderId} updated to ${status}`, 'info');
    };

    const getShopOrders = (shopId) => {
        return orders.filter((o) => o.shopId === shopId);
    };

    // User CRUD
    const addUser = (userData) => {
        const id = `USR-${toastCounter++}`;
        const newUser = {
            id,
            status: 'Active',
            joined: 'Today',
            avatar: (userData.name || 'U').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
            ...userData,
        };
        setUsers((prev) => [...prev, newUser]);
        showToast(`User "${newUser.name}" invited successfully`, 'success');
        return newUser;
    };

    const updateUser = (id, patch) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
        showToast('User record updated', 'success');
    };

    const deleteUser = (id) => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        showToast('User removed', 'info');
    };

    // Coupons
    const addCoupon = (couponData) => {
        const id = `CPN-${toastCounter++}`;
        const newCoupon = { id, active: true, ...couponData };
        setCoupons((prev) => [newCoupon, ...prev]);
        showToast(`Coupon "${newCoupon.code}" created!`, 'success');
    };

    const deleteCoupon = (id) => {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        showToast('Coupon removed', 'info');
    };

    const validateCoupon = (code, subtotal) => {
        const found = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.active);
        if (!found) return { valid: false, message: 'Invalid or inactive promo code' };
        if (found.minSpend && subtotal < found.minSpend) {
            return { valid: false, message: `Minimum spend of $${found.minSpend} required for this code` };
        }
        return { valid: true, coupon: found };
    };

    // Reviews & Wishlist
    const addReview = (productId, reviewData) => {
        const id = `REV-${toastCounter++}`;
        const newReview = {
            id,
            productId,
            date: 'Today',
            ...reviewData,
        };
        setReviews((prev) => [newReview, ...prev]);
        showToast('Thank you for submitting your verified review!', 'success');
    };

    const getProductReviews = (productId) => {
        return reviews.filter((r) => r.productId === productId);
    };

    const toggleWishlist = (productId) => {
        setWishlist((prev) => {
            const exists = prev.includes(productId);
            if (exists) {
                showToast('Removed from wishlist', 'info');
                return prev.filter((id) => id !== productId);
            }
            showToast('Saved to wishlist ❤️', 'success');
            return [...prev, productId];
        });
    };

    const isWishlisted = (productId) => wishlist.includes(productId);

    // Reset Demo State
    const resetDemoData = () => {
        localStorage.clear();
        setShops(initialShops);
        setUsers(initialUsers);
        setOrders(initialOrders);
        setCoupons(initialCoupons);
        setReviews(initialReviews);
        setWishlist([]);
        setCart([]);
        setCurrentAuthUser(initialUsers[0]);
        setActivities([
            { id: 'ACT-1', text: 'System restored to fresh production seed baseline', time: 'Just now', type: 'system' }
        ]);
        showToast('Platform reset to pristine demo baseline!', 'success');
    };

    return (
        <StoreContext.Provider
            value={{
                shops,
                users,
                orders,
                coupons,
                reviews,
                wishlist,
                cart,
                setCart,
                activeCurrency,
                setActiveCurrency,
                formatPrice,
                settings,
                activities,
                toasts,
                currentAuthUser,
                isGlobalSearchOpen,
                setIsGlobalSearchOpen,
                showToast,
                dismissToast,
                logActivity,
                loginAs,
                logout,
                registerMerchantSignup,
                approveShop,
                rejectShop,
                setShopActiveTheme,
                updateShopPermissions,
                addShop,
                updateShop,
                deleteShop,
                duplicateShop,
                getShopBySlug,
                addProduct,
                updateProduct,
                deleteProduct,
                updateProductStock,
                placeOrder,
                updateOrderStatus,
                getShopOrders,
                addUser,
                updateUser,
                deleteUser,
                addCoupon,
                deleteCoupon,
                validateCoupon,
                addReview,
                getProductReviews,
                toggleWishlist,
                isWishlisted,
                setSettings,
                resetDemoData,
                backendStatus,
                isSyncing,
                lastSyncedAt,
                apiBaseUrl,
                setApiBaseUrl,
                syncWithBackend,
                ApiService,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};
