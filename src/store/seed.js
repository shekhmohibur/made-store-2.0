// Seed data for the multi-tenant clothing SaaS.
// Every shop is a tenant; products live under their shop. The admin, owner
// panel and storefront all read/write through the same StoreContext so they stay in sync.

export const initialShops = [
    {
        id: 'SHP-001',
        slug: 'urban-threads',
        name: 'Urban Threads',
        description: 'Modern streetwear and urban fashion for men & women.',
        ownerName: 'Amina Yusuf',
        email: 'amina@urbanthreads.com',
        plan: 'Pro',
        status: 'Active',
        accent: '#7c3aed',
        logo: 'UT',
        joined: 'Mar 12, 2025',
        products: [
            { id: 'UT-1', name: 'Classic Denim Jacket', category: 'Men', price: 79, sizes: ['M', 'L', 'XL'], colors: ['Blue', 'Black'], stock: 24, emoji: '🧥' },
            { id: 'UT-2', name: 'Oversized Graphic Tee', category: 'Men', price: 29, sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'White'], stock: 60, emoji: '👕' },
            { id: 'UT-3', name: 'Cropped Hoodie', category: 'Women', price: 45, sizes: ['S', 'M', 'L'], colors: ['Pink', 'Grey'], stock: 38, emoji: '🧶' },
            { id: 'UT-4', name: 'Cargo Pants', category: 'Men', price: 55, sizes: ['M', 'L', 'XL'], colors: ['Olive', 'Black'], stock: 18, emoji: '👖' },
            { id: 'UT-5', name: 'Silk Slip Dress', category: 'Women', price: 89, sizes: ['S', 'M', 'L'], colors: ['Emerald', 'Black'], stock: 12, emoji: '👗' },
        ],
    },
    {
        id: 'SHP-002',
        slug: 'fb-dress-store',
        name: 'FB Dress Store',
        description: 'Gorgeous dresses sold via Facebook — order directly through our shop or DM us.',
        ownerName: 'Grace Mensah',
        email: 'grace@fbdress.com',
        plan: 'Growth',
        status: 'Active',
        accent: '#ec4899',
        logo: 'FB',
        joined: 'Feb 28, 2025',
        products: [
            { id: 'FB-1', name: 'Floral Maxi Dress', category: 'Dresses', price: 69, sizes: ['S', 'M', 'L', 'XL'], colors: ['Floral'], stock: 15, emoji: '🌺' },
            { id: 'FB-2', name: 'Bodycon Party Dress', category: 'Dresses', price: 49, sizes: ['XS', 'S', 'M'], colors: ['Red', 'Black'], stock: 30, emoji: '💃' },
            { id: 'FB-3', name: 'Boho Midi Dress', category: 'Dresses', price: 59, sizes: ['S', 'M', 'L'], colors: ['Cream', 'Brown'], stock: 22, emoji: '🌸' },
            { id: 'FB-4', name: 'Evening Gown', category: 'Dresses', price: 129, sizes: ['M', 'L'], colors: ['Navy', 'Burgundy'], stock: 8, emoji: '👑' },
            { id: 'FB-5', name: 'Summer Sundress', category: 'Dresses', price: 39, sizes: ['S', 'M', 'L', 'XL'], colors: ['Yellow', 'White'], stock: 40, emoji: '☀️' },
        ],
    },
    {
        id: 'SHP-003',
        slug: 'linen-and-co',
        name: 'Linen & Co',
        description: 'Breezy linen staples & traditional Ankara styling.',
        ownerName: 'Daniel Okafor',
        email: 'daniel@linenco.com',
        plan: 'Free',
        status: 'Active',
        accent: '#0ea5e9',
        logo: 'LC',
        joined: 'Jul 03, 2025',
        products: [
            { id: 'LC-1', name: 'Linen Shirt', category: 'Men', price: 42, sizes: ['M', 'L', 'XL'], colors: ['White', 'Beige'], stock: 35, emoji: '👔' },
            { id: 'LC-2', name: 'Ankara Wrap Dress', category: 'Women', price: 72, sizes: ['S', 'M', 'L'], colors: ['Print'], stock: 14, emoji: '🥻' },
            { id: 'LC-3', name: 'Linen Trousers', category: 'Men', price: 48, sizes: ['M', 'L'], colors: ['Sand', 'Navy'], stock: 20, emoji: '👖' },
        ],
    },
];

export const initialOrders = [
    { id: 'ORD-1001', shopId: 'SHP-002', customer: 'Blessing Ade', email: 'blessing@gmail.com', total: 118, status: 'Pending', items: [{ productId: 'FB-3', name: 'Boho Midi Dress', qty: 2, price: 59 }], date: 'Aug 18, 2025' },
    { id: 'ORD-1002', shopId: 'SHP-001', customer: 'Emeka Obi', email: 'emeka@gmail.com', total: 79, status: 'Processing', items: [{ productId: 'UT-1', name: 'Classic Denim Jacket', qty: 1, price: 79 }], date: 'Aug 17, 2025' },
    { id: 'ORD-1003', shopId: 'SHP-002', customer: 'Zainab Bello', email: 'zainab@gmail.com', total: 49, status: 'Delivered', items: [{ productId: 'FB-2', name: 'Bodycon Party Dress', qty: 1, price: 49 }], date: 'Aug 15, 2025' },
];