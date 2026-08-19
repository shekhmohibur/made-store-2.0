import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../models/admin/pages/Dashboard';
import Shops from '../models/admin/pages/Shops';
import CreateShop from '../models/admin/pages/CreateShop';
import Users from '../models/admin/pages/Users';
import Settings from '../models/admin/pages/Settings';
import NotFound from '../models/admin/pages/NotFound';

// Owner (merchant) panel
import OwnerLayout from '../models/owner/OwnerLayout';
import OwnerDashboard from '../models/owner/pages/OwnerDashboard';
import OwnerProducts from '../models/owner/pages/OwnerProducts';
import OwnerOrders from '../models/owner/pages/OwnerOrders';
import OwnerDiscounts from '../models/owner/pages/OwnerDiscounts';

// Customer storefront
import StorefrontLayout from '../models/storefront/StorefrontLayout';
import Storefront from '../models/storefront/Storefront';
import ProductDetail from '../models/storefront/ProductDetail';
import DressShop from '../models/storefront/DressShop';

const Router = createBrowserRouter([
    // ---------- Admin Control Center ----------
    {
        path: '/panel',
        Component: AdminLayout,
        children: [
            { path: '', Component: Dashboard },
            { path: 'shops', Component: Shops },
            { path: 'create-shop', Component: CreateShop },
            { path: 'users', Component: Users },
            { path: 'settings', Component: Settings },
        ],
    },

    // ---------- Owner (Merchant) Panel ----------
    {
        path: '/panel/owner',
        Component: OwnerLayout,
        children: [
            { path: '', Component: OwnerDashboard },
            { path: 'products', Component: OwnerProducts },
            { path: 'orders', Component: OwnerOrders },
            { path: 'discounts', Component: OwnerDiscounts },
        ],
    },

    // ---------- Customer Storefront (dynamic by slug) ----------
    {
        path: '/shop/:slug',
        Component: StorefrontLayout,
        children: [
            { path: '', Component: Storefront },
            { path: 'product/:productId', Component: ProductDetail },
        ],
    },

    // ---------- Facebook dress-selling page ----------
    { path: '/dress-shop', Component: DressShop },

    { path: '/', element: <Navigate to="/panel" replace /> },
    { path: '*', Component: NotFound },
]);

export default Router;