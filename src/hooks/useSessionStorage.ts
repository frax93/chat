import { useCallback, useLayoutEffect, useMemo, useState } from "react";

// The hook to get the value of a determinated key from sessionStorage
const useSessionStorage = <T,>(key: string, initialValue?: T) => {
  // Function to get the value of the key from the storage
  const getFromSessionStorage = useCallback(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(error);
      return initialValue;
    }
  }, [key, initialValue]);

  // The last value in the storage
  const prevSessionStorage = useMemo(() => getFromSessionStorage(), [getFromSessionStorage]);
  
  // State for update/read the storage value
  const [storedValue, setStoredValue] = useState(prevSessionStorage);

  // Function to set the value in the storage
  const setValue = useCallback((value: T) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    window.dispatchEvent(new Event('storage'));
  }, [setStoredValue, key, storedValue]);

  // Function to change the state of the hook on storage change
  const onStorageChange = useCallback(() => {
    const valueFromStorage = getFromSessionStorage();
    setStoredValue(valueFromStorage);
  }, [getFromSessionStorage, setStoredValue]);

  // Effect to add/remove a listener on storage change
  useLayoutEffect(() => {
    window.addEventListener('session-storage', onStorageChange);
    return () => {
      window.removeEventListener('session-storage', onStorageChange);
    }
  }, [onStorageChange]);

  // Effect to add/remove a listener on storage change
  useLayoutEffect(() => {
    window.addEventListener('storage', onStorageChange);
    return () => {
        window.removeEventListener('storage', onStorageChange);
    }
  }, [onStorageChange]);

  // The hook returned values
  return [storedValue, setValue] as [T, (value: T) => void];
};

export default useSessionStorage;
