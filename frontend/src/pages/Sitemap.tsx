import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHome, FiCalendar, FiUsers, FiSearch, FiInfo, FiHelpCircle, FiLock, FiFileText, FiShield } from 'react-icons/fi';
import { Card } from '../components/common/Card';
import { ROUTES } from '../utils/constants';

interface SitemapItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

interface SitemapSection {
  title: string;
  items: SitemapItem[];
}

export const Sitemap: React.FC = () => {
  const { t } = useTranslation();

  const sections: SitemapSection[] = [
    {
      title: 'Main Pages',
      items: [
        {
          name: t('nav.home'),
          path: ROUTES.HOME,
          icon: <FiHome className="w-5 h-5" />,
          description: 'Homepage with service overview and quick actions',
        },
        {
          name: t('nav.booking'),
          path: ROUTES.BOOKING,
          icon: <FiCalendar className="w-5 h-5" />,
          description: 'Book a new appointment for Life Certificate verification',
        },
        {
          name: t('nav.queueStatus'),
          path: ROUTES.QUEUE_STATUS,
          icon: <FiUsers className="w-5 h-5" />,
          description: 'View real-time queue status and current serving number',
        },
        {
          name: t('nav.checkStatus'),
          path: ROUTES.CHECK_STATUS,
          icon: <FiSearch className="w-5 h-5" />,
          description: 'Check your appointment status using Life Certificate number',
        },
      ],
    },
    {
      title: 'Information',
      items: [
        {
          name: t('nav.about'),
          path: ROUTES.ABOUT,
          icon: <FiInfo className="w-5 h-5" />,
          description: 'About the Life Certificate Queue Management System',
        },
        {
          name: t('nav.help'),
          path: ROUTES.HELP,
          icon: <FiHelpCircle className="w-5 h-5" />,
          description: 'Help center with guides and contact information',
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        {
          name: t('nav.privacy'),
          path: ROUTES.PRIVACY,
          icon: <FiLock className="w-5 h-5" />,
          description: 'Privacy policy and data protection information',
        },
        {
          name: t('nav.terms'),
          path: ROUTES.TERMS,
          icon: <FiFileText className="w-5 h-5" />,
          description: 'Terms of service and usage conditions',
        },
      ],
    },
    {
      title: 'Administration',
      items: [
        {
          name: t('nav.admin'),
          path: ROUTES.ADMIN_LOGIN,
          icon: <FiShield className="w-5 h-5" />,
          description: 'Admin login for queue management (authorized personnel only)',
        },
      ],
    },
  ];

  return (
    <main id="main-content" className="min-h-screen py-12 bg-secondary-200">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-h1 text-primary-500 mb-2">{t('sitemap.title')}</h1>
          <p className="text-text-secondary">{t('sitemap.subtitle')}</p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <h2 className="text-lg font-semibold text-primary-500 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-500 rounded-full" />
                {section.title}
              </h2>
              <Card>
                <ul className="divide-y divide-secondary-200">
                  {section.items.map((item, itemIndex) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="flex items-start gap-4 py-4 hover:bg-secondary-100 -mx-6 px-6 transition-colors first:pt-0 last:pb-0"
                      >
                        <div className="p-2 bg-primary-100 rounded-lg text-primary-500 flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-text-primary hover:text-primary-500 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-sm text-text-muted mt-1">{item.description}</p>
                          <p className="text-xs text-primary-400 mt-1">{item.path}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="text-center bg-secondary-100">
            <p className="text-text-secondary text-sm">
              This sitemap is automatically generated and updated. All pages are accessible via keyboard
              navigation and screen readers for WCAG 2.1 AA compliance.
            </p>
          </Card>
        </motion.div>
      </div>
    </main>
  );
};

export default Sitemap;
