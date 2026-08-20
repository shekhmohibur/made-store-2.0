// Theme & Template Catalog for Kaizer Commerce Multi-Tenant SaaS
// Curated Luxury & SaaS Professional Color Schemes & Aesthetics

export const THEME_CATALOG = [
    {
        id: 'theme-streetwear',
        name: 'Streetwear Noir',
        subtitle: 'Minimalist Architectural Grid & Dark Obsidian Accents',
        category: 'Streetwear & Contemporary Casual',
        tier: 'Free',
        isPremium: false,
        accent: '#18181b', // Obsidian Black
        accentSecondary: '#4f46e5', // Indigo Glow
        previewImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80',
        description: 'Ultra-clean Swiss typography, sleek monochromatic borders, drop-shoulder silhouettes, and refined product badges engineered for modern streetwear houses.',
        features: ['Editorial Hero Banner', 'Architectural Grid', 'Slide-over Bag Drawer', 'Inventory Stock Level Bars', 'Wishlist Support'],
        fontHeading: 'Plus Jakarta Sans',
        bgClass: 'bg-zinc-50',
        cardClass: 'luxury-card',
    },
    {
        id: 'theme-luxury',
        name: 'Velvet & Silk Atelier',
        subtitle: 'Haute Couture Evening Wear & Soft Champagne Elegance',
        category: 'Dresses & Luxury Evening Wear',
        tier: 'Pro',
        isPremium: true,
        accent: '#9d174d', // Deep Velvet Rose
        accentSecondary: '#be185d',
        previewImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
        description: 'Soft champagne gradients, editorial photo spreads, bespoke size measurements, and VIP customer reviews tailored for evening gowns and bridal ateliers.',
        features: ['Editorial Spreads', 'Photo Gallery Zoom', 'Occasion Category Filter', 'VIP Client Testimonials', 'Direct WhatsApp Concierge'],
        fontHeading: 'Plus Jakarta Sans',
        bgClass: 'bg-stone-50',
        cardClass: 'luxury-card',
    },
    {
        id: 'theme-resort',
        name: 'Resort & Linen Minimalist',
        subtitle: 'Artisanal Natural Linens & Mediterranean Earth Tones',
        category: 'Linen, Resort & Eco-Apparel',
        tier: 'Growth',
        isPremium: true,
        accent: '#0f766e', // Deep Teal
        accentSecondary: '#0d9488',
        previewImage: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
        description: 'Harmonious natural earth tones, organic badges, detailed textile composition breakdown, and relaxed resort silhouettes for eco-conscious luxury brands.',
        features: ['Breezy Wide Layout', 'Fabric & Care Accordion', 'Size Measurement Modal', 'Artisanal Tag Badges', 'Eco-Packaging Badges'],
        fontHeading: 'Plus Jakarta Sans',
        bgClass: 'bg-stone-50/50',
        cardClass: 'luxury-card',
    },
    {
        id: 'theme-viral',
        name: 'Viral Social Pop-Up',
        subtitle: 'High-Converting Social Selling & Flash Boutiques',
        category: 'Viral Social Boutiques & TikTok/FB',
        tier: 'Growth',
        isPremium: true,
        accent: '#db2777', // Vivid Fuchsia
        accentSecondary: '#be185d',
        previewImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
        description: 'High-converting flash sale countdown timer, real-time floating buyer notifications, live social proof badges, and simulated WhatsApp/Messenger direct ordering drawer.',
        features: ['Flash Sale Countdown Timer', 'Live Buyer Popup Toasts', 'Direct Messenger Ordering', 'Occasion Filters', '1-Click Fast Checkout'],
        fontHeading: 'Plus Jakarta Sans',
        bgClass: 'bg-rose-50/20',
        cardClass: 'luxury-card',
    },
];

export const findThemeById = (id) => {
    return THEME_CATALOG.find((t) => t.id === id) || THEME_CATALOG[0];
};
