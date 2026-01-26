import { useState, useEffect, useCallback, useRef } from 'react';

interface UsePollingOptions<T> {
  fetchFn: () => Promise<T>;
  interval: number;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UsePollingReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  start: () => void;
  stop: () => void;
  isPolling: boolean;
}

export function usePolling<T>({
  fetchFn,
  interval,
  enabled = true,
  onSuccess,
  onError,
}: UsePollingOptions<T>): UsePollingReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isPolling, setIsPolling] = useState(enabled);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await fetchFn();
      
      if (isMountedRef.current) {
        setData(result);
        setLastUpdated(new Date());
        onSuccess?.(result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setError(error);
        onError?.(error);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetchFn, onSuccess, onError]);

  const start = useCallback(() => {
    setIsPolling(true);
  }, []);

  const stop = useCallback(() => {
    setIsPolling(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Setup polling
  useEffect(() => {
    isMountedRef.current = true;
    
    if (isPolling) {
      fetchData();
      intervalRef.current = setInterval(fetchData, interval);
    }
    
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, interval, isPolling]);

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refresh: fetchData,
    start,
    stop,
    isPolling,
  };
}

export default usePolling;
