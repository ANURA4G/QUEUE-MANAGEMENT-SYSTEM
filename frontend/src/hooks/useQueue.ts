import { useState, useEffect, useCallback, useRef } from 'react';
import { getQueue, getStats } from '../api/queue';
import { QueueEntry, QueueStatsResponse } from '../types';
import { QUEUE_POLL_INTERVAL } from '../utils/constants';

interface UseQueueReturn {
  queue: QueueEntry[];
  stats: QueueStatsResponse | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
  isPolling: boolean;
}

export const useQueue = (autoStart: boolean = true): UseQueueReturn => {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [stats, setStats] = useState<QueueStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isPolling, setIsPolling] = useState(autoStart);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [queueResponse, statsResponse] = await Promise.all([
        getQueue(),
        getStats(),
      ]);
      
      if (queueResponse.success && queueResponse.data) {
        setQueue(queueResponse.data.queue);
      }
      
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch queue data';
      setError(message);
      console.error('Error fetching queue:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startPolling = useCallback(() => {
    setIsPolling(true);
  }, []);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Initial fetch and polling setup
  useEffect(() => {
    fetchData();
    
    if (isPolling) {
      intervalRef.current = setInterval(fetchData, QUEUE_POLL_INTERVAL);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, isPolling]);

  return {
    queue,
    stats,
    isLoading,
    error,
    lastUpdated,
    refresh: fetchData,
    startPolling,
    stopPolling,
    isPolling,
  };
};

export default useQueue;
