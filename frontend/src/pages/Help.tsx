import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiClock, FiBookOpen, FiVideo, FiCalendar } from 'react-icons/fi';
import { Card } from '../components/common/Card';
import { CONTACT_INFO } from '../utils/constants';

export const Help: React.FC = () => {
  const { t } = useTranslation();

  const guides = [
    {
      icon: <FiCalendar className="w-6 h-6" />,
      title: t('help.guide.booking'),
      steps: [
        'Click on "Book Appointment" from the homepage',
        'Fill in your Life Certificate Number and personal details',
        'Select verification mode (In-Person or Online)',
        'Choose your preferred date and time',
        'Submit the form and download your appointment slip',
      ],
    },
    {
      icon: <FiBookOpen className="w-6 h-6" />,
      title: t('help.guide.check'),
      steps: [
        'Go to "Check My Status" page',
        'Enter your Life Certificate Number',
        'View your current queue position',
        'See estimated wait time',
        'Download or view your QR code for verification',
      ],
    },
    {
      icon: <FiVideo className="w-6 h-6" />,
      title: t('help.guide.online'),
      steps: [
        'Choose "Online Video Call" during booking',
        'Ensure you have a stable internet connection',
        'Keep your ID documents ready',
        'Join the video call at your scheduled time',
        'Follow the verification officers instructions',
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
          <h1 className="text-h1 text-primary-500 mb-2">{t('help.title')}</h1>
          <p className="text-text-secondary">{t('help.subtitle')}</p>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <h2 className="text-xl font-semibold text-primary-500 mb-4">{t('help.contact.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <FiPhone className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">{t('help.contact.phone')}</p>
                  <p className="font-semibold text-text-primary">{CONTACT_INFO.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <FiMail className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">{t('help.contact.email')}</p>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="font-semibold text-primary-500 hover:underline">
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <FiClock className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">{t('help.contact.hours')}</p>
                  <p className="font-semibold text-text-primary">{CONTACT_INFO.timings}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* User Guides */}
        <h2 className="text-xl font-semibold text-primary-500 mb-4">{t('help.guide.title')}</h2>
        <div className="space-y-4">
          {guides.map((guide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent-100 rounded-lg text-accent-500">
                    {guide.icon}
                  </div>
                  <h3 className="font-semibold text-text-primary">{guide.title}</h3>
                </div>
                <ol className="space-y-2 ml-4">
                  {guide.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-3 text-text-secondary">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full text-sm flex items-center justify-center">
                        {stepIndex + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="text-center">
            <p className="text-text-secondary mb-2">Still have questions?</p>
            <p className="text-text-primary">
              Check our{' '}
              <a href="/#faq" className="text-primary-500 hover:underline font-medium">
                Frequently Asked Questions
              </a>{' '}
              or contact our support team.
            </p>
          </Card>
        </motion.div>
      </div>
    </main>
  );
};

export default Help;
