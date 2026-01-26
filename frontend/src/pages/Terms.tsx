import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card } from '../components/common/Card';

export const Terms: React.FC = () => {
  const { t } = useTranslation();

  const terms = [
    {
      title: t('terms.acceptance.title'),
      content: `By accessing and using the Life Certificate Queue Management System, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use this service.`,
    },
    {
      title: t('terms.eligibility.title'),
      content: `This service is available to Indian citizens who are eligible for Life Certificate verification. You must provide accurate and complete information including valid Life Certificate Number, Aadhaar details, and other required documentation. The system prioritizes senior citizens aged 80 and above.`,
    },
    {
      title: t('terms.usage.title'),
      content: `You agree to use this service only for legitimate Life Certificate verification purposes. You must not misuse the system, attempt unauthorized access, or interfere with the service's operation. Each user may book one appointment at a time. Appointment slots are non-transferable.`,
    },
    {
      title: t('terms.responsibilities.title'),
      content: `You are responsible for maintaining the confidentiality of your queue token and appointment details. Arrive at the designated center at least 15 minutes before your scheduled time. Bring all required identification documents. Failure to appear may result in automatic cancellation.`,
    },
    {
      title: t('terms.government.title'),
      content: `This is an official Government of India service. All information processed through this system is subject to applicable government regulations and the Information Technology Act, 2000. The system operates under the jurisdiction of the Ministry of Social Justice and Empowerment.`,
    },
    {
      title: t('terms.limitation.title'),
      content: `While we strive to provide accurate information and reliable service, we do not guarantee uninterrupted access. The government reserves the right to modify, suspend, or discontinue the service. We are not liable for any indirect, incidental, or consequential damages arising from service use.`,
    },
    {
      title: t('terms.changes.title'),
      content: `We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the service after changes constitutes acceptance of modified terms. Users are advised to review terms periodically.`,
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
          <h1 className="text-h1 text-primary-500 mb-2">{t('terms.title')}</h1>
          <p className="text-text-muted text-sm">Effective Date: January 2024</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 bg-accent-100 border-l-4 border-accent-500">
            <p className="text-text-primary">
              <strong>Important:</strong> Please read these Terms of Service carefully before using the
              Life Certificate Queue Management System. By using this service, you agree to be bound by
              these terms.
            </p>
          </Card>
        </motion.div>

        <div className="space-y-4">
          {terms.map((term, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Card>
                <h2 className="text-lg font-semibold text-primary-500 mb-3">
                  {index + 1}. {term.title}
                </h2>
                <p className="text-text-secondary leading-relaxed">{term.content}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="text-center">
            <p className="text-text-secondary text-sm">
              For questions regarding these terms, contact us at{' '}
              <a href="mailto:legal@lifecert.gov.in" className="text-primary-500 hover:underline">
                legal@lifecert.gov.in
              </a>
            </p>
          </Card>
        </motion.div>
      </div>
    </main>
  );
};

export default Terms;
