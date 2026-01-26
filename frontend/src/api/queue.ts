import apiClient from './client';
import {
  ApiResponse,
  QueueEntry,
  QueueEntryInput,
  QueueListResponse,
  QueueStatsResponse,
  EnqueueResponse,
  DequeueResponse,
  HealthResponse,
} from '../types';

// Queue API Functions

/**
 * Add a new entry to the queue
 */
export const enqueue = async (data: QueueEntryInput): Promise<ApiResponse<EnqueueResponse>> => {
  const response = await apiClient.post<ApiResponse<EnqueueResponse>>('/queue/enqueue', data);
  return response.data;
};

/**
 * Get the entire queue
 */
export const getQueue = async (): Promise<ApiResponse<QueueListResponse>> => {
  const response = await apiClient.get<ApiResponse<QueueListResponse>>('/queue');
  return response.data;
};

/**
 * Get a specific queue entry by certificate number
 */
export const getQueueEntry = async (certNo: string): Promise<ApiResponse<QueueEntry>> => {
  const response = await apiClient.get<ApiResponse<QueueEntry>>(`/queue/entry/${encodeURIComponent(certNo)}`);
  return response.data;
};

/**
 * Serve the next person in queue (dequeue)
 */
export const dequeue = async (): Promise<ApiResponse<DequeueResponse>> => {
  const response = await apiClient.post<ApiResponse<DequeueResponse>>('/queue/dequeue');
  return response.data;
};

/**
 * Remove a specific entry from the queue
 */
export const removeEntry = async (certNo: string): Promise<ApiResponse<{ removed: QueueEntry }>> => {
  const response = await apiClient.delete<ApiResponse<{ removed: QueueEntry }>>(`/queue/entry/${encodeURIComponent(certNo)}`);
  return response.data;
};

/**
 * Get queue statistics
 */
export const getStats = async (): Promise<ApiResponse<QueueStatsResponse>> => {
  const response = await apiClient.get<ApiResponse<QueueStatsResponse>>('/queue/stats');
  return response.data;
};

/**
 * Clear the entire queue (Admin only)
 */
export const clearQueue = async (): Promise<ApiResponse<{ cleared_count: number }>> => {
  const response = await apiClient.post<ApiResponse<{ cleared_count: number }>>('/queue/clear');
  return response.data;
};

/**
 * Health check endpoint
 */
export const healthCheck = async (): Promise<HealthResponse> => {
  const response = await apiClient.get<HealthResponse>('/health');
  return response.data;
};

/**
 * Get position of an entry in queue
 */
export const getQueuePosition = async (certNo: string): Promise<{
  position: number;
  entry: QueueEntry;
  peopleAhead: number;
  estimatedWaitTime: number;
} | null> => {
  try {
    const [queueResponse, entryResponse] = await Promise.all([
      getQueue(),
      getQueueEntry(certNo),
    ]);
    
    if (!queueResponse.data || !entryResponse.data) {
      return null;
    }
    
    const queue = queueResponse.data.queue;
    const entry = entryResponse.data;
    
    // Find position in queue
    const position = queue.findIndex(q => q.life_certificate_no === certNo) + 1;
    
    if (position === 0) {
      return null;
    }
    
    // Calculate people ahead
    const peopleAhead = position - 1;
    
    // Estimate wait time (5 minutes per person on average)
    const estimatedWaitTime = peopleAhead * 5;
    
    return {
      position,
      entry,
      peopleAhead,
      estimatedWaitTime,
    };
  } catch (error) {
    console.error('Error getting queue position:', error);
    return null;
  }
};

// Export all API functions
export const queueApi = {
  enqueue,
  getQueue,
  getQueueEntry,
  dequeue,
  removeEntry,
  getStats,
  clearQueue,
  healthCheck,
  getQueuePosition,
};

export default queueApi;
