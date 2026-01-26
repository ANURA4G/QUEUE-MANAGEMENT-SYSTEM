// Queue Entry Types
export interface QueueEntry {
  life_certificate_no: string;
  name: string;
  age: number;
  phone: string;
  proof_guardian_name: string;
  verification_mode: 'presence' | 'online';
  preferred_date: string;
  preferred_time: string;
  priority: number;
  timestamp: string;
  status?: 'waiting' | 'processing' | 'completed';
}

export interface QueueEntryInput {
  life_certificate_no: string;
  name: string;
  age: number;
  phone: string;
  proof_guardian_name: string;
  verification_mode: 'presence' | 'online';
  preferred_date: string;
  preferred_time: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface QueueListResponse {
  queue_length: number;
  queue: QueueEntry[];
}

export interface QueueStatsResponse {
  total_in_queue: number;
  priority_0_count: number;
  priority_1_count: number;
  presence_mode_count: number;
  online_mode_count: number;
  average_age: number;
  oldest_entry_timestamp: string | null;
  estimated_wait_time_minutes: number;
}

export interface EnqueueResponse {
  position: number;
  priority: number;
  estimated_wait_time: number;
  entry: QueueEntry;
}

export interface DequeueResponse {
  served: QueueEntry;
  remaining_in_queue: number;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  queue_status: {
    total_entries: number;
    priority_0_entries: number;
    priority_1_entries: number;
  };
}

// UI State Types
export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  token: string | null;
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'operator';
}

export interface ThemeState {
  mode: 'light' | 'dark' | 'high-contrast';
  fontSize: 'normal' | 'large' | 'extra-large';
}

export interface AppState {
  queue: QueueEntry[];
  stats: QueueStatsResponse | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Form Types
export interface BookingFormData {
  life_certificate_no: string;
  name: string;
  age: number | '';
  phone: string;
  proof_guardian_name: string;
  verification_mode: 'presence' | 'online';
  preferred_date: string;
  preferred_time: string;
}

export interface SearchFormData {
  life_certificate_no: string;
}

export interface AdminLoginFormData {
  username: string;
  password: string;
}

// Localization Types
export type Language = 'en' | 'hi';

export interface LocaleStrings {
  [key: string]: string | LocaleStrings;
}

// Filter Types
export interface QueueFilters {
  priority: 'all' | 0 | 1;
  verificationMode: 'all' | 'presence' | 'online';
  date: string | null;
  searchTerm: string;
}
