import { useCallback, useLayoutEffect, useMemo, useState } from "react";

// The custom hook to get the value of a determinated key from localStorage
const useLocalStorage = <T,>(key: string, initialValue?: T) => {
  // Function to get the value of the key from the storage
  const getFromLocalStorage = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(error);
      return initialValue;
    }
  }, [key, initialValue]);

  // The last value in the storage
  const prevLocalStorage = useMemo(
    () => getFromLocalStorage(),
    [getFromLocalStorage]
  );

  // State for update/read the storage value
  const [storedValue, setStoredValue] = useState(prevLocalStorage);

  // Function to set the value in the storage
  const setValue = useCallback(
    (value: T) => {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    },
    [setStoredValue, key, storedValue]
  );

  // Function to change the state of the hook on storage change
  const onStorageChange = useCallback(() => {
    const valueFromStorage = getFromLocalStorage();
    setStoredValue(valueFromStorage);
  }, [getFromLocalStorage, setStoredValue]);

  // Effect to add/remove a listener on storage change
  useLayoutEffect(() => {
    window.addEventListener("local-storage", onStorageChange);
    return () => {
      window.removeEventListener("local-storage", onStorageChange);
    };
  }, [onStorageChange]);

  // Effect to add/remove a listener on storage change
  useLayoutEffect(() => {
    window.addEventListener("storage", onStorageChange);
    return () => {
      window.removeEventListener("storage", onStorageChange);
    };
  }, [onStorageChange]);

  // The hook returned values
  return [storedValue, setValue] as [T, (value: T) => void];
};

export default useLocalStorage;
