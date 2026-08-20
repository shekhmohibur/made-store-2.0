// =============================================================
// Kaizer Commerce 2.0 - Clean Production Initial State
// All mock/demo data has been commented out for live cPanel deployment.
// =============================================================

export const initialShops = [];

export const initialUsers = [
    {
        id: 'USR-SA',
        name: 'Super Administrator',
        email: 'admin@kaizer.com',
        role: 'Super Admin',
        shopName: 'All Boutiques',
        shopId: null,
        status: 'Active',
        joined: 'Platform Genesis',
        avatar: 'SA',
    },
];

export const initialOrders = [];

export const initialCoupons = [];

export const initialReviews = [];

/*
// =============================================================
// PREVIOUS DEMO / MOCK DATA (COMMENTED OUT FOR PRODUCTION)
// =============================================================

export const demoShops = [
    {
        id: 'SHP-001',
        slug: 'urban-threads',
        name: 'Urban Threads',
        tagline: 'Modern Streetwear & Contemporary Culture',
        description: 'Curated premium streetwear, oversized silhouettes, heavyweight denim, and minimal aesthetics for the modern urban wardrobe.',
        ownerName: 'Amina Yusuf',
        email: 'amina@urbanthreads.com',
        phone: '+1 (555) 234-8901',
        plan: 'Pro',
        status: 'Active',
        activeTheme: 'theme-streetwear',
        accent: '#6366f1',
        accentSecondary: '#4f46e5',
        logo: 'UT',
        banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80',
        joined: 'Mar 12, 2025',
        currency: 'USD',
        location: {
            address: '742 Fashion Boulevard, Suite 500',
            city: 'New York, NY',
            country: 'United States',
            postalCode: '10001',
        },
        demographics: ['Men', 'Women', 'Accessories'],
        whatsappNumber: '+1 (800) 456-7890',
        paymentMethods: { card: true, cod: true, whatsapp: true, applePay: true },
        features: { enableWhatsAppChat: true, enableStylistChat: true, enableFlashCountdown: true, enableOrderTracking: true },
        shipping: { freeShippingThreshold: 100, standardCost: 0, expressCost: 9.99 },
        announcement: { enabled: true, text: 'Complimentary Express Worldwide Courier on orders over $100 · Code SUMMER20' },
        permissions: { allowedThemes: ['theme-streetwear', 'theme-luxury', 'theme-resort', 'theme-viral'], canUseCoupons: true, customDomain: true, maxProducts: 1000 },
        socials: { instagram: '@urbanthreads_co', tiktok: '@urbanthreads', website: 'https://urbanthreads.example.com', whatsapp: '+18004567890' },
        products: [
            {
                id: 'UT-1',
                name: 'Vintage Washed Denim Jacket',
                category: 'Men',
                price: 89,
                originalPrice: 119,
                rating: 4.9,
                reviewCount: 42,
                stock: 24,
                sku: 'UT-DNM-001',
                badge: 'Bestseller',
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                colors: [{ name: 'Indigo Blue', hex: '#2563eb' }, { name: 'Washed Black', hex: '#1e293b' }],
                emoji: '🧥',
                image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
                gallery: [
                    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&auto=format&fit=crop&q=80'
                ],
                description: 'A relaxed-fit classic denim jacket crafted from 13.5oz heavyweight Japanese ring-spun cotton.',
                fabric: '100% Ring-Spun Cotton · 13.5 oz Raw Denim',
                care: 'Machine wash cold inside out, hang dry only.'
            }
        ]
    }
];

export const demoOrders = [
    {
        id: 'ORD-1001',
        shopId: 'SHP-002',
        shopName: 'FB Dress Store',
        customer: 'Blessing Ade',
        email: 'blessing.ade@gmail.com',
        phone: '+1 (555) 912-3041',
        address: '742 Evergreen Terrace, Springfield, OR',
        paymentMethod: 'Credit Card',
        paymentStatus: 'Paid',
        total: 130,
        subtotal: 130,
        discount: 0,
        shipping: 0,
        status: 'Delivered',
        items: [{ productId: 'FB-3', name: 'Sun-Drenched Tiered Boho Sundress', qty: 2, price: 65, size: 'M', color: 'Terracotta Rust', emoji: '🌸' }],
        date: 'Aug 18, 2025',
        timeline: [
            { title: 'Order Placed', time: 'Aug 18, 10:30 AM', done: true },
            { title: 'Payment Confirmed', time: 'Aug 18, 10:32 AM', done: true },
            { title: 'Dispatched with Courier', time: 'Aug 19, 02:15 PM', done: true },
            { title: 'Delivered to Customer', time: 'Aug 20, 11:45 AM', done: true },
        ]
    }
];

export const demoCoupons = [
    { id: 'CPN-1', code: 'SUMMER20', type: 'percentage', value: 20, minSpend: 50, active: true, description: '20% off all orders over $50' },
    { id: 'CPN-2', code: 'FREESHIP', type: 'fixed', value: 10, minSpend: 30, active: true, description: '$10 instant shipping credit' },
];

export const demoReviews = [
    { id: 'REV-1', productId: 'UT-1', author: 'Marcus V.', rating: 5, date: 'Aug 14, 2025', comment: 'The quality of the denim is insane!' }
];
*/