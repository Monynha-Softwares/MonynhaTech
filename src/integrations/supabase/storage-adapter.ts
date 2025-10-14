export type StorageAdapter = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const memoryStorage = (() => {
  const store = new Map<string, string>();

  const adapter: StorageAdapter = {
    getItem: key => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: key => {
      store.delete(key);
    },
  };

  return adapter;
})();

export const getStorageAdapter = (): StorageAdapter => {
  if (typeof window === 'undefined' || !('localStorage' in window)) {
    return memoryStorage;
  }

  return window.localStorage;
};
