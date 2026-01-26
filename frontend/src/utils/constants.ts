// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10);

// Polling Intervals
export const QUEUE_POLL_INTERVAL = parseInt(import.meta.env.VITE_QUEUE_POLL_INTERVAL || '30000', 10);
export const STATS_POLL_INTERVAL = parseInt(import.meta.env.VITE_STATS_POLL_INTERVAL || '60000', 10);

// App Info
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Life Certificate Queue Management System';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Feature Flags
export const ENABLE_ADMIN = import.meta.env.VITE_ENABLE_ADMIN === 'true';
export const ENABLE_OFFLINE_MODE = import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true';
export const ENABLE_NOTIFICATIONS = import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true';

// Localization
export const DEFAULT_LANGUAGE = import.meta.env.VITE_DEFAULT_LANGUAGE || 'en';
export const SUPPORTED_LANGUAGES = (import.meta.env.VITE_SUPPORTED_LANGUAGES || 'en,hi').split(',');

// Theme Colors
export const COLORS = {
  primary: '#003D82',
  secondary: '#F4F4F4',
  accent: '#FF9933',
  success: '#138808',
  error: '#D32F2F',
  warning: '#FFA000',
  info: '#1976D2',
  text: '#333333',
  border: '#CCCCCC',
};

// Priority Configuration
export const PRIORITY_CONFIG = {
  0: {
    label: 'Senior Priority',
    color: 'error',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-500',
    icon: '🔴',
    description: 'Citizens aged 80 and above',
    minAge: 80,
  },
  1: {
    label: 'General Queue',
    color: 'success',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-500',
    icon: '🟢',
    description: 'Standard priority queue',
    minAge: 0,
  },
} as const;

// Verification Modes
export const VERIFICATION_MODES = {
  presence: {
    label: 'In-Person',
    labelHi: 'व्यक्तिगत उपस्थिति',
    icon: '🏢',
    description: 'Visit the office for verification',
  },
  online: {
    label: 'Online',
    labelHi: 'ऑनलाइन',
    icon: '💻',
    description: 'Verify through video call',
  },
} as const;

// Form Validation Rules
export const VALIDATION_RULES = {
  lifeCertificateNo: {
    minLength: 5,
    maxLength: 20,
    pattern: /^[A-Z0-9]+$/i,
  },
  name: {
    minLength: 2,
    maxLength: 100,
  },
  age: {
    min: 0,
    max: 150,
    seniorAge: 80,
  },
  phone: {
    length: 10,
    pattern: /^\d{10}$/,
  },
  date: {
    format: 'YYYY-MM-DD',
    pattern: /^\d{4}-\d{2}-\d{2}$/,
  },
  time: {
    format: 'HH:MM',
    pattern: /^\d{2}:\d{2}$/,
  },
};

// Working Hours
export const WORKING_HOURS = {
  start: '09:00',
  end: '17:00',
  lunchStart: '13:00',
  lunchEnd: '14:00',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  formDraft: 'booking_form_draft',
  theme: 'app_theme',
  language: 'app_language',
  fontSize: 'app_font_size',
  adminToken: 'admin_token',
  lastSearch: 'last_search',
};

// Routes
export const ROUTES = {
  HOME: '/',
  BOOKING: '/booking',
  QUEUE_STATUS: '/queue-status',
  CHECK_STATUS: '/check-status',
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ABOUT: '/about',
  HELP: '/help',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  SITEMAP: '/sitemap',
};

// Navigation Items
export const NAV_ITEMS = [
  { path: ROUTES.HOME, labelKey: 'nav.home', icon: 'home' },
  { path: ROUTES.BOOKING, labelKey: 'nav.booking', icon: 'calendar' },
  { path: ROUTES.QUEUE_STATUS, labelKey: 'nav.queueStatus', icon: 'queue' },
  { path: ROUTES.CHECK_STATUS, labelKey: 'nav.checkStatus', icon: 'search' },
];

// Footer Links
export const FOOTER_LINKS = {
  quickLinks: [
    { path: ROUTES.BOOKING, labelKey: 'nav.booking' },
    { path: ROUTES.QUEUE_STATUS, labelKey: 'nav.queueStatus' },
    { path: ROUTES.CHECK_STATUS, labelKey: 'nav.checkStatus' },
  ],
  support: [
    { path: ROUTES.HELP, labelKey: 'nav.help' },
    { path: ROUTES.ABOUT, labelKey: 'nav.about' },
  ],
  legal: [
    { path: ROUTES.PRIVACY, labelKey: 'nav.privacy' },
    { path: ROUTES.TERMS, labelKey: 'nav.terms' },
    { path: ROUTES.SITEMAP, labelKey: 'nav.sitemap' },
  ],
};

// Contact Information
export const CONTACT_INFO = {
  phone: '1800-XXX-XXXX',
  email: 'support@lifecert.gov.in',
  address: 'Department of Pension & Pensioners Welfare, Ministry of Personnel, Government of India',
  timings: 'Monday - Friday, 9:00 AM - 5:00 PM',
};
