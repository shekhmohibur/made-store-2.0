// Route → page metadata used to drive breadcrumbs, document titles,
// and route highlighting across the admin panel.
export const pageMeta = [
    { path: '/panel', label: 'Dashboard' },
    { path: '/panel/approvals', label: 'Pending Approvals' },
    { path: '/panel/orders', label: 'Global Orders Ledger' },
    { path: '/panel/shops', label: 'Clothing Shops' },
    { path: '/panel/analytics', label: 'Analytics & Financials' },
    { path: '/panel/announcements', label: 'Broadcast Notices' },
    { path: '/panel/create-shop', label: 'Create New Shop' },
    { path: '/panel/users', label: 'Users & Roles' },
    { path: '/panel/audit', label: 'Security & Audit Logs' },
    { path: '/panel/database', label: 'Database Studio' },
    { path: '/panel/settings', label: 'Platform Settings' },
];

export const findPageByPath = (pathname) => {
    return pageMeta.find((p) => p.path === pathname) || null;
};