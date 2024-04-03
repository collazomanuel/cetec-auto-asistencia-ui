import { writable } from 'svelte/store';

function createConnectivityStore() {
  const { subscribe, set } = writable(true); // Default to true for SSR

  if (typeof window !== 'undefined') {
    // Initialize with the actual connectivity status when in the browser
    set(navigator.onLine);

    // Update the store based on online/offline events
    window.addEventListener('online', () => set(true));
    window.addEventListener('offline', () => set(false));
  }

  return {
    subscribe,
  };
}

export const isConnected = createConnectivityStore();
