import React from "react";

// Types
type StorageArea = "sync" | "local" | "managed" | "session";
type StorageValue = any;

interface CacheItem {
  data: StorageValue;
  timestamp: number;
}

interface StorageCache {
  [key: string]: CacheItem;
}

interface ChromeStorageContextValue {
  get: <T>(key: string, options?: UseStorageOptions<T>) => Promise<T>;
  set: <T>(
    key: string,
    value: T,
    options?: Pick<UseStorageOptions<T>, "area">,
  ) => Promise<void>;
  subscribe: (
    key: string,
    callback: (value: StorageValue) => void,
  ) => () => void;
}

interface UseStorageOptions<T> {
  area?: StorageArea;
  ttl?: number; // Time to live in milliseconds
  fallback?: T;
}

// Context
export const ChromeStorageContext =
  React.createContext<ChromeStorageContextValue | null>(null);

// Provider Component
export const ChromeStorageProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [cache, setCache] = React.useState<StorageCache>({});
  const subscribers = React.useRef<
    Map<string, Set<(value: StorageValue) => void>>
  >(new Map());
  // Keep track of storage areas being used
  const activeAreas = React.useRef(new Set<StorageArea>());

  // Initialize chrome.storage change listener
  React.useEffect(() => {
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: StorageArea,
    ) => {
      // Only process changes for active storage areas
      if (!activeAreas.current.has(areaName)) {
        return;
      }

      Object.entries(changes).forEach(([key, change]) => {
        // Update cache
        setCache((prev) => ({
          ...prev,
          [key]: {
            data: change.newValue,
            timestamp: Date.now(),
          },
        }));

        // Notify subscribers
        const keySubscribers = subscribers.current.get(key);
        if (keySubscribers) {
          keySubscribers.forEach((callback) => callback(change.newValue));
        }
      });
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const get = React.useCallback(
    async <T,>(
      key: string,
      {
        area = "sync",
        ttl = 5 * 60 * 1000,
        fallback,
      }: UseStorageOptions<T> = {},
    ) => {
      // Register the storage area as active
      activeAreas.current.add(area);

      const cached = cache[key];
      const now = Date.now();

      // Return cached value if within TTL
      if (cached && now - cached.timestamp < ttl) {
        return cached.data as T;
      }

      try {
        const result = await chrome.storage[area].get(key);
        const value = result[key] ?? fallback;

        // Update cache
        setCache((prev) => ({
          ...prev,
          [key]: {
            data: value,
            timestamp: now,
          },
        }));

        return value as T;
      } catch (error) {
        console.error(`Error reading from chrome.storage.${area}:`, error);
        return fallback as T;
      }
    },
    [cache],
  );

  const set = React.useCallback(
    async <T,>(
      key: string,
      value: T,
      { area = "sync" }: Pick<UseStorageOptions<T>, "area"> = {},
    ) => {
      try {
        await chrome.storage[area].set({ [key]: value });
        // Cache is updated through the storage change listener
      } catch (error) {
        console.error(`Error writing to chrome.storage.${area}:`, error);
        throw error;
      }
    },
    [],
  );

  const subscribe = React.useCallback(
    (key: string, callback: (value: StorageValue) => void) => {
      if (!subscribers.current.has(key)) {
        subscribers.current.set(key, new Set());
      }
      subscribers.current.get(key)!.add(callback);

      // Return unsubscribe function
      return () => {
        const keySubscribers = subscribers.current.get(key);
        if (keySubscribers) {
          keySubscribers.delete(callback);
          if (keySubscribers.size === 0) {
            subscribers.current.delete(key);
          }
        }
      };
    },
    [],
  );

  const contextValue = React.useMemo(
    () => ({
      get,
      set,
      subscribe,
    }),
    [get, set, subscribe],
  );

  return (
    <ChromeStorageContext.Provider value={contextValue}>
      {children}
    </ChromeStorageContext.Provider>
  );
};

// Hook
export const useChromeStorage = <T,>(
  key: string,
  options: UseStorageOptions<T> = {},
) => {
  const context = React.useContext(ChromeStorageContext);
  const [data, setData] = React.useState<T>(() => options.fallback as T);
  const [isValidating, setIsValidating] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(!options.fallback);
  const [error, setError] = React.useState<Error | null>(null);

  if (!context) {
    throw new Error(
      "useChromeStorage must be used within a ChromeStorageProvider",
    );
  }

  React.useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        // If we have no data (no fallback), we're loading
        // If we have fallback/cached data, we're just validating
        if (!options.fallback) {
          setIsLoading(true);
        }
        setIsValidating(true);

        const value = await context.get<T>(key, options);

        if (mounted) {
          setData(value);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
          setIsValidating(false);
        }
      }
    };

    fetchData();

    // Subscribe to changes
    const unsubscribe = context.subscribe(key, (newValue) => {
      if (mounted) {
        setData(newValue as T);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [key, context, options]);

  const setValue = React.useCallback(
    async (newValue: T) => {
      try {
        setIsValidating(true);
        await context.set(key, newValue, { area: options.area });
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        throw err;
      } finally {
        setIsValidating(false);
      }
    },
    [context, key, options.area],
  );

  return {
    data,
    isLoading,
    isValidating,
    error,
    setValue,
  };
};
