import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSubdomain } from '../utils/subdomain';
import { useStore } from '../store/useStore';
import LandingPage from '../models/public/LandingPage';

/**
 * SubdomainGateway:
 * Directs traffic based on whether the visitor arrived at a merchant's custom subdomain
 * (e.g. https://amina-styles.clothing.trivora.top) or the main platform portal.
 */
const SubdomainGateway = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { getShopBySlug, shops } = useStore();

    const detectedSubdomain = getSubdomain();

    useEffect(() => {
        if (!detectedSubdomain) return;

        // If visitor is at the root '/' of a subdomain, route directly to the store
        if (location.pathname === '/') {
            const matchedShop = getShopBySlug(detectedSubdomain);
            if (matchedShop || shops.length > 0) {
                navigate(`/shop/${detectedSubdomain}`, { replace: true });
            }
        }
    }, [detectedSubdomain, location.pathname, getShopBySlug, shops, navigate]);

    // If on main platform domain, render normal SaaS landing page
    return <LandingPage />;
};

export default SubdomainGateway;
