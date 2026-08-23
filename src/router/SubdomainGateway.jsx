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
            navigate(`/shop/${detectedSubdomain}`, { replace: true });
        }
    }, [detectedSubdomain, location.pathname, navigate]);

    // If on main platform domain, render normal SaaS landing page
    return <LandingPage />;
};

export default SubdomainGateway;
