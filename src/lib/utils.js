import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount, currency = '$') {
  const num = Number(amount || 0);
  return `${currency}${num.toFixed(2)}`;
}