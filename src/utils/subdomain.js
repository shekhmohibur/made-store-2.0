/**
 * Trivora Commerce Multi-Tenant Subdomain Resolver
 * Configured Architecture:
 * - Backend API: https://clothing.trivora.top/api
 * - Frontend SaaS Platform: https://clothbrand.trivora.top
 * - Merchant Storefronts: https://[slug].trivora.top/
 * - Merchant Owner Portals: https://[slug].trivora.top/owner
 */

export const BASE_PLATFORM_DOMAIN = 'trivora.top';
export const PLATFORM_FRONTEND_URL = 'https://clothbrand.trivora.top';
export const BACKEND_API_URL = 'https://clothing.trivora.top/api';

const RESERVED_SUBDOMAINS = new Set([
    'clothbrand', // Main Platform Frontend
    'clothing',   // Backend API
    'www',
    'app',
    'admin',
    'panel',
    'api',
    'mail',
    'cpanel',
    'webmail'
]);

export function getSubdomain(hostname = window.location.hostname) {
    if (!hostname) return null;

    // Check URL query override for testing/dev: ?subdomain=slug
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const override = urlParams.get('subdomain');
        if (override) return override.toLowerCase().trim();
    } catch {
        // Ignore
    }

    const host = hostname.toLowerCase();

    // Development testing: e.g. "urban-threads.localhost"
    if (host.includes('.localhost')) {
        const parts = host.split('.');
        if (parts.length >= 2 && !RESERVED_SUBDOMAINS.has(parts[0])) {
            return parts[0];
        }
        return null;
    }

    // Production: e.g. "urban-threads.trivora.top" (3 parts)
    if (host.endsWith('.trivora.top')) {
        const parts = host.split('.');
        if (parts.length === 3) {
            const sub = parts[0];
            if (!RESERVED_SUBDOMAINS.has(sub)) {
                return sub;
            }
        }
        return null;
    }

    // Generic multi-tenant subdomain resolution
    const genericParts = host.split('.');
    if (genericParts.length >= 3 && !RESERVED_SUBDOMAINS.has(genericParts[0])) {
        return genericParts[0];
    }

    return null;
}

export function formatShopSubdomain(slug, baseDomain = BASE_PLATFORM_DOMAIN) {
    if (!slug) return '';
    return `https://${slug}.${baseDomain}`;
}

export function formatShopOwnerUrl(slug, baseDomain = BASE_PLATFORM_DOMAIN) {
    if (!slug) return '';
    return `https://${slug}.${baseDomain}/owner`;
}
