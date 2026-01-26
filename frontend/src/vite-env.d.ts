/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_QUEUE_POLL_INTERVAL: string;
  readonly VITE_STATS_POLL_INTERVAL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_ENABLE_ADMIN: string;
  readonly VITE_ENABLE_OFFLINE_MODE: string;
  readonly VITE_ENABLE_NOTIFICATIONS: string;
  readonly VITE_DEFAULT_LANGUAGE: string;
  readonly VITE_SUPPORTED_LANGUAGES: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
