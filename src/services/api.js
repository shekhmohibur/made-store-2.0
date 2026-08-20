/**
 * Kaizer Commerce - Production API Client Service
 * Connects React Frontend to the Shared cPanel PHP MySQL REST API Backend.
 */

import { compressImage } from '../utils/imageCompressor';

const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'http://localhost/backend/api';

let activeApiUrl = (() => {
    try {
        return localStorage.getItem('kaizer_custom_api_url') || DEFAULT_API_URL;
    } catch {
        return DEFAULT_API_URL;
    }
})();

/**
 * Universal Fetch Helper with Error Handling & Timeout
 */
async function request(endpoint, options = {}, timeoutMs = 8000) {
    const cleanBase = activeApiUrl.replace(/\/+$/, '');
    const url = `${cleanBase}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            headers,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.message || `Request failed with status ${response.status}`);
        }
        return data;
    } catch (err) {
        clearTimeout(timeoutId);
        throw err;
    }
}

export const ApiService = {
    // -------------------------------------------------------------
    // CONFIG & HEALTH CHECK
    // -------------------------------------------------------------
    getBaseUrl() {
        return activeApiUrl;
    },

    setBaseUrl(newUrl) {
        if (!newUrl) return;
        activeApiUrl = newUrl.trim().replace(/\/+$/, '');
        try {
            localStorage.setItem('kaizer_custom_api_url', activeApiUrl);
        } catch (e) {
            console.error('Failed to save API URL:', e);
        }
    },

    async checkHealth() {
        try {
            const res = await request('/stats.php', {}, 4000);
            return { online: res.status === 'success', data: res.data };
        } catch {
            return { online: false };
        }
    },

    // -------------------------------------------------------------
    // SHOPS / BOUTIQUES
    // -------------------------------------------------------------
    async getShops() {
        return request('/shops.php');
    },

    async getShopBySlug(slug) {
        return request(`/shops.php?slug=${encodeURIComponent(slug)}`);
    },

    async createShop(shopData) {
        return request('/shops.php', {
            method: 'POST',
            body: JSON.stringify(shopData),
        });
    },

    async updateShop(shopId, updateData) {
        return request(`/shops.php?id=${encodeURIComponent(shopId)}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    },

    async deleteShop(shopId) {
        return request(`/shops.php?id=${encodeURIComponent(shopId)}`, {
            method: 'DELETE',
        });
    },

    // -------------------------------------------------------------
    // USERS & ROLES
    // -------------------------------------------------------------
    async getUsers() {
        return request('/users.php');
    },

    async createUser(userData) {
        return request('/users.php', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    async loginUser(email, password = '') {
        return request('/users.php?action=login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    // -------------------------------------------------------------
    // PRODUCTS & INVENTORY
    // -------------------------------------------------------------
    async getProducts(shopId = null) {
        const query = shopId ? `?shop_id=${encodeURIComponent(shopId)}` : '';
        return request(`/products.php${query}`);
    },

    async addProduct(shopId, productData) {
        let compressedImage = productData.image;
        if (productData.image && productData.image.startsWith('data:image')) {
            const comp = await compressImage(productData.image, 800, 800, 0.65);
            compressedImage = comp.dataUrl;
        }

        return request('/products.php', {
            method: 'POST',
            body: JSON.stringify({
                ...productData,
                shopId,
                image: compressedImage,
            }),
        });
    },

    async updateProduct(productId, updateData) {
        return request(`/products.php?id=${encodeURIComponent(productId)}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    },

    async deleteProduct(productId) {
        return request(`/products.php?id=${encodeURIComponent(productId)}`, {
            method: 'DELETE',
        });
    },

    // -------------------------------------------------------------
    // ORDERS & CHECKOUT
    // -------------------------------------------------------------
    async placeOrder(orderPayload) {
        return request('/orders.php', {
            method: 'POST',
            body: JSON.stringify(orderPayload),
        });
    },

    async getOrders(shopId = null) {
        const query = shopId ? `?shop_id=${encodeURIComponent(shopId)}` : '';
        return request(`/orders.php${query}`);
    },

    async updateOrderStatus(orderId, status) {
        return request(`/orders.php?id=${encodeURIComponent(orderId)}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },

    // -------------------------------------------------------------
    // COUPONS & DISCOUNTS
    // -------------------------------------------------------------
    async getCoupons(shopId = null) {
        const query = shopId ? `?shop_id=${encodeURIComponent(shopId)}` : '';
        return request(`/coupons.php${query}`);
    },

    async createCoupon(couponData) {
        return request('/coupons.php', {
            method: 'POST',
            body: JSON.stringify(couponData),
        });
    },

    async validateCoupon(code, shopId, subtotal) {
        return request(
            `/coupons.php?validate=1&code=${encodeURIComponent(code)}&shop_id=${encodeURIComponent(shopId)}&subtotal=${subtotal}`
        );
    },

    // -------------------------------------------------------------
    // CUSTOMERS CRM
    // -------------------------------------------------------------
    async getCustomers(shopId = null) {
        const query = shopId ? `?shop_id=${encodeURIComponent(shopId)}` : '';
        return request(`/customers.php${query}`);
    },

    async saveCustomer(customerData) {
        return request('/customers.php', {
            method: 'POST',
            body: JSON.stringify(customerData),
        });
    },

    // -------------------------------------------------------------
    // IMAGE UPLOADS
    // -------------------------------------------------------------
    async uploadImage(fileOrDataUrl) {
        const compResult = await compressImage(fileOrDataUrl, 800, 800, 0.65);
        return request('/upload.php', {
            method: 'POST',
            body: JSON.stringify({ dataUrl: compResult.dataUrl }),
        });
    },

    // -------------------------------------------------------------
    // PLATFORM ANALYTICS
    // -------------------------------------------------------------
    async getStats(shopId = null) {
        const query = shopId ? `?shop_id=${encodeURIComponent(shopId)}` : '';
        return request(`/stats.php${query}`);
    },
};

export default ApiService;
