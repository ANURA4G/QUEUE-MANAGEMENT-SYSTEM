import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiSearch, FiAlertTriangle } from 'react-icons/fi';
import { Button } from '../components/common/Button';
import { ROUTES } from '../utils/constants';

export const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-secondary-200 py-12">
      <div className="container-custom max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="inline-block"
            >
              <FiAlertTriangle className="w-24 h-24 text-accent-500 mx-auto" />
            </motion.div>
          </div>

          <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            {t('notFound.title')}
          </h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            {t('notFound.message')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={ROUTES.HOME}>
              <Button variant="primary" size="lg">
                <FiHome className="w-5 h-5" />
                {t('notFound.backHome')}
              </Button>
            </Link>
            <Link to={ROUTES.CHECK_STATUS}>
              <Button variant="outline" size="lg">
                <FiSearch className="w-5 h-5" />
                {t('notFound.checkStatus')}
              </Button>
            </Link>
          </div>

          <div className="mt-12 p-6 bg-white rounded-lg shadow-card">
            <h3 className="font-semibold text-text-primary mb-4">Looking for something?</h3>
            <ul className="text-left space-y-2 text-text-secondary">
              <li>
                <Link to={ROUTES.BOOKING} className="text-primary-500 hover:underline">
                  → Book an appointment
                </Link>
              </li>
              <li>
                <Link to={ROUTES.QUEUE_STATUS} className="text-primary-500 hover:underline">
                  → View queue status
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CHECK_STATUS} className="text-primary-500 hover:underline">
                  → Check your appointment
                </Link>
              </li>
              <li>
                <Link to={ROUTES.HELP} className="text-primary-500 hover:underline">
                  → Get help
                </Link>
              </li>
              <li>
                <Link to={ROUTES.SITEMAP} className="text-primary-500 hover:underline">
                  → View sitemap
                </Link>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default NotFound;
