import { useContext } from 'react';
import { StoreContext } from './StoreContext';

/**
 * Convenience hook to read/write the shared store.
 * Kept in its own module so `StoreContext.jsx` only exports a
 * component — keeps React Fast Refresh happy.
 */
export const useStore = () => useContext(StoreContext);
