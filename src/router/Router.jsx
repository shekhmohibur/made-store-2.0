import { createBrowserRouter } from 'react-router-dom';

// Error Boundary & Common Components
import ErrorBoundary from '../components/common/ErrorBoundary';

// Public & Onboarding Portal
import LandingPage from '../models/public/LandingPage';
import SignupPage from '../models/public/SignupPage';
import LoginPage from '../models/public/LoginPage';
import PendingApprovalPage from '../models/public/PendingApprovalPage';

// Super Admin Control Center
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../models/admin/pages/Dashboard';
import PendingApprovals from '../models/admin/pages/PendingApprovals';
import Shops from '../models/admin/pages/Shops';
import CreateShop from '../models/admin/pages/CreateShop';
import Users from '../models/admin/pages/Users';
import Settings from '../models/admin/pages/Settings';
import NotFound from '../models/admin/pages/NotFound';

// Owner (Merchant) Panel & Theme Studio
import OwnerLayout from '../models/owner/OwnerLayout';
import OwnerDashboard from '../models/owner/pages/OwnerDashboard';
import ThemeStudio from '../models/owner/pages/ThemeStudio';
import OwnerProducts from '../models/owner/pages/OwnerProducts';
import OwnerOrders from '../models/owner/pages/OwnerOrders';
import OwnerCustomers from '../models/owner/pages/OwnerCustomers';
import OwnerDiscounts from '../models/owner/pages/OwnerDiscounts';
import OwnerSettings from '../models/owner/pages/OwnerSettings';

// Customer Storefront
import StorefrontLayout from '../models/storefront/StorefrontLayout';
import Storefront from '../models/storefront/Storefront';
import ProductDetail from '../models/storefront/ProductDetail';
import Lookbook from '../models/storefront/Lookbook';
import AboutAtelier from '../models/storefront/AboutAtelier';
import ContactStore from '../models/storefront/ContactStore';
import TrackOrder from '../models/storefront/TrackOrder';
import DressShop from '../models/storefront/DressShop';

const Router = createBrowserRouter([
    // ---------- Public Marketing & Merchant Signup Flow ----------
    { path: '/', Component: LandingPage, ErrorBoundary: ErrorBoundary },
    { path: '/signup', Component: SignupPage, ErrorBoundary: ErrorBoundary },
    { path: '/login', Component: LoginPage, ErrorBoundary: ErrorBoundary },
    { path: '/pending-approval', Component: PendingApprovalPage, ErrorBoundary: ErrorBoundary },

    // ---------- Super Admin Control Center ----------
    {
        path: '/panel',
        Component: AdminLayout,
        ErrorBoundary: ErrorBoundary,
        children: [
            { path: '', Component: Dashboard },
            { path: 'approvals', Component: PendingApprovals },
            { path: 'shops', Component: Shops },
            { path: 'create-shop', Component: CreateShop },
            { path: 'users', Component: Users },
            { path: 'settings', Component: Settings },
        ],
    },

    // ---------- Merchant Owner Panel (/owner) ----------
    {
        path: '/owner',
        Component: OwnerLayout,
        ErrorBoundary: ErrorBoundary,
        children: [
            { path: '', Component: OwnerDashboard },
            { path: 'themes', Component: ThemeStudio },
            { path: 'products', Component: OwnerProducts },
            { path: 'orders', Component: OwnerOrders },
            { path: 'customers', Component: OwnerCustomers },
            { path: 'discounts', Component: OwnerDiscounts },
            { path: 'settings', Component: OwnerSettings },
        ],
    },

    // ---------- Backwards Compatibility Route (/panel/owner) ----------
    {
        path: '/panel/owner',
        Component: OwnerLayout,
        ErrorBoundary: ErrorBoundary,
        children: [
            { path: '', Component: OwnerDashboard },
            { path: 'themes', Component: ThemeStudio },
            { path: 'products', Component: OwnerProducts },
            { path: 'orders', Component: OwnerOrders },
            { path: 'customers', Component: OwnerCustomers },
            { path: 'discounts', Component: OwnerDiscounts },
            { path: 'settings', Component: OwnerSettings },
        ],
    },

    // ---------- Customer Storefront (Dynamic Multi-Theme Store by Slug) ----------
    {
        path: '/shop/:slug',
        Component: StorefrontLayout,
        ErrorBoundary: ErrorBoundary,
        children: [
            { path: '', Component: Storefront },
            { path: 'product/:productId', Component: ProductDetail },
            { path: 'lookbook', Component: Lookbook },
            { path: 'about', Component: AboutAtelier },
            { path: 'contact', Component: ContactStore },
            { path: 'track-order', Component: TrackOrder },
        ],
    },

    // ---------- Facebook Dress Boutique Direct Experience ----------
    { path: '/dress-shop', Component: DressShop, ErrorBoundary: ErrorBoundary },

    // ---------- 404 Fallback ----------
    { path: '*', Component: NotFound, ErrorBoundary: ErrorBoundary },
]);

export default Router;