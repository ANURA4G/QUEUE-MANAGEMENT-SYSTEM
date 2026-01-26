import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { Header, Footer, Loading } from './components/common';
import { ROUTES } from './utils/constants';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Booking = React.lazy(() => import('./pages/Booking'));
const QueueStatus = React.lazy(() => import('./pages/QueueStatus'));
const CheckStatus = React.lazy(() => import('./pages/CheckStatus'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const Admin = React.lazy(() => import('./pages/Admin'));
const About = React.lazy(() => import('./pages/About'));
const Help = React.lazy(() => import('./pages/Help'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Terms = React.lazy(() => import('./pages/Terms'));
const Sitemap = React.lazy(() => import('./pages/Sitemap'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Page transition wrapper
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// Loading fallback component
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-secondary-200">
    <Loading size="lg" text="Loading page..." />
  </div>
);

// Skip to main content link for accessibility
const SkipLink: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary-500 text-white px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-primary-300"
  >
    Skip to main content
  </a>
);

// Animated routes component
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path={ROUTES.HOME}
          element={
            <PageWrapper>
              <Suspense fallback={<PageLoader />}>
                <Home />
              </Suspense>
            </PageWrapper>
          }
        />
        <Route
          path={ROUTES.BOOKING}
          element={
            <PageWrapper>
              <Suspense fallback={<PageLoader />}>
                <Booking />
              </Suspense>
            </PageWrapper>
          }
        />
        <Route
          path={ROUTES.QUEUE_STATUS}
          element={
            <PageWrapper>
              <Suspense fallback={<PageLoader />}>
                <QueueStatus />
              </Suspense>
            </PageWrapper>
          }
        />
        <Route
          path={ROUTES.CHECK_STATUS}
          element={
            <PageWrapper>
              <Suspense fallback={<PageLoader />}>
                <CheckStatus />
              </Suspense>
            </PageWrapper>
          }
        />
        <Route
          path={ROUTES.ADMIN_LOGIN}
          element={
            <PageWrapper>
              <Suspense fallback={<PageLoader />}>
                <AdminLogin />
              </Suspense>
            </PageWrapper>
          }
        />
        <Route
          path={ROUTES.ADMIN}
          element={
            <PageWrapper>
              <Suspense fallback={<PageLoader />}>
                <Admin />
              </Suspense>
            </PageWrapper>
          }
        />
        <Route
          path={ROUTES.ABOUT}
          element={
            <PageWrapper>
              <Suspense fallback={<PageLoader />}>
                <About />
              </Suspense>
            </PageWrapper>
          }
        />
        <Route
          path={ROUTES.HELP}
          element={
            <PageWrapper>
              <Suspense fallback={<PageLoader />}>
                <Help />
              </Suspense>
            </PageWrapper>
          }
        />
        <Route
          path={ROUTES.PRIVACY}
          element={
            <PageWrapper>
              <Suspense fallback={<PageLoader />}>
                <Privacy />
              </Suspense>
            </PageWrapper>
          }
        />
        <Route
          path={ROUTES.TERMS}
          element={
            <PageWrapper>
              <Suspense fallback={<PageLoader />}>
                <Terms />
              </Suspense>
            </PageWrapper>
          }
        />
        <Route
          path={ROUTES.SITEMAP}
          element={
            <PageWrapper>
              <Suspense fallback={<PageLoader />}>
                <Sitemap />
              </Suspense>
            </PageWrapper>
          }
        />
        <Route
          path="*"
          element={
            <PageWrapper>
              <Suspense fallback={<PageLoader />}>
                <NotFound />
              </Suspense>
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-secondary-200">
        <SkipLink />
        <Header />
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1f2937',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            success: {
              iconTheme: {
                primary: '#138808',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#dc2626',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
