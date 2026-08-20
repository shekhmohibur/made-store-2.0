import { useContext } from 'react';
import { StoreContext } from './storeDefinition';

/**
 * Convenience hook to read/write the shared store.
 */
export const useStore = () => useContext(StoreContext);
