'use client';

import { createContext, useContext } from 'react';

const SettingsContext = createContext(null);

export function SettingsProvider({ initialSettings, children }) {
  const currency = initialSettings?.currencySymbol || '৳';

  const formatMoney = (amount) => {
    const num = Number(amount || 0);
    return `${currency}${num.toFixed(2)}`;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings: initialSettings,
        currency,
        formatMoney,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    return {
      settings: null,
      currency: '৳',
      formatMoney: (amount) => `৳${Number(amount || 0).toFixed(2)}`,
    };
  }
  return ctx;
}