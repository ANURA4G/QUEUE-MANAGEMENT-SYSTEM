import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card } from '../components/common/Card';

export const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <main id="main-content" className="min-h-screen py-12 bg-secondary-200">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-h1 text-primary-500 mb-2">{t('about.title')}</h1>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <p className="text-text-secondary leading-relaxed">{t('about.content')}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <h2 className="text-xl font-semibold text-primary-500 mb-3">{t('about.mission.title')}</h2>
              <p className="text-text-secondary leading-relaxed">{t('about.mission.content')}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <h2 className="text-xl font-semibold text-primary-500 mb-3">{t('about.vision.title')}</h2>
              <p className="text-text-secondary leading-relaxed">{t('about.vision.content')}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <h2 className="text-xl font-semibold text-primary-500 mb-3">Key Features</h2>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-success-500">✓</span>
                  <span>Priority queue for senior citizens (80+ years)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success-500">✓</span>
                  <span>Online verification through secure video call</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success-500">✓</span>
                  <span>Real-time queue status tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success-500">✓</span>
                  <span>Multi-language support (English & Hindi)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success-500">✓</span>
                  <span>WCAG 2.1 AA accessibility compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success-500">✓</span>
                  <span>Downloadable appointment slips with QR codes</span>
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default About;
