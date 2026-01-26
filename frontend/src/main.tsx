import React from 'react';
import ReactDOM from 'react-dom/client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import App from './App';
import './styles/globals.css';

// Initialize i18next
i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'hi'],
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    interpolation: {
      escapeValue: false, // React already escapes
    },
    react: {
      useSuspense: true,
    },
  });

// Render the app
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-secondary-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading...</p>
          </div>
        </div>
      }
    >
      <App />
    </React.Suspense>
  </React.StrictMode>
);
