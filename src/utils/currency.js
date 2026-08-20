// Multi-Currency Exchange Rate Engine for Kaizer Commerce

export const CURRENCIES = {
    USD: { code: 'USD', symbol: '$', rate: 1.0, name: 'US Dollar', flag: '🇺🇸' },
    EUR: { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro', flag: '🇪🇺' },
    GBP: { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound', flag: '🇬🇧' },
    CAD: { code: 'CAD', symbol: 'CA$', rate: 1.36, name: 'Canadian Dollar', flag: '🇨🇦' },
    AUD: { code: 'AUD', symbol: 'AU$', rate: 1.52, name: 'Australian Dollar', flag: '🇦🇺' },
    JPY: { code: 'JPY', symbol: '¥', rate: 154.5, name: 'Japanese Yen', flag: '🇯🇵' },
    AED: { code: 'AED', symbol: 'AED ', rate: 3.67, name: 'UAE Dirham', flag: '🇦🇪' },
    BDT: { code: 'BDT', symbol: '৳', rate: 119.5, name: 'Bangladeshi Taka', flag: '🇧🇩' },
};

/**
 * Converts a base USD price to the target currency and formats it cleanly.
 * @param {number} usdAmount - Base price in USD
 * @param {string} currencyCode - Target currency (e.g. 'USD', 'EUR', 'GBP', 'BDT')
 * @returns {string} Formatted price string (e.g. "$129.90", "€119.50", "৳15,400")
 */
export const formatCurrency = (usdAmount, currencyCode = 'USD') => {
    const num = Number(usdAmount) || 0;
    const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
    const converted = num * curr.rate;

    if (currencyCode === 'JPY' || currencyCode === 'BDT') {
        return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
    }

    return `${curr.symbol}${converted.toFixed(2)}`;
};
