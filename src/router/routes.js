// Route → page metadata used to drive breadcrumbs, document titles,
// and route highlighting across the admin panel.
export const pageMeta = [
    { path: '/panel', label: 'Dashboard' },
    { path: '/panel/approvals', label: 'Pending Approvals' },
    { path: '/panel/shops', label: 'Clothing Shops' },
    { path: '/panel/create-shop', label: 'Create New Shop' },
    { path: '/panel/users', label: 'Users & Roles' },
    { path: '/panel/settings', label: 'Platform Settings' },
];

export const findPageByPath = (pathname) => {
    return pageMeta.find((p) => p.path === pathname) || null;
};