import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card } from '../components/common/Card';

export const Privacy: React.FC = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: t('privacy.collection.title'),
      content: [
        'Personal identification information (Name, Aadhaar number, Life Certificate number)',
        'Contact information (Phone number)',
        'Date of birth and age',
        'Appointment and queue information',
      ],
    },
    {
      title: t('privacy.usage.title'),
      content: [
        'To process and manage Life Certificate verification appointments',
        'To communicate appointment confirmations and updates',
        'To maintain queue management and prioritization',
        'To improve our services and user experience',
        'To comply with legal and regulatory requirements',
      ],
    },
    {
      title: t('privacy.protection.title'),
      content: [
        'All data is transmitted using SSL/TLS encryption',
        'Personal information is stored in secure government databases',
        'Access is restricted to authorized personnel only',
        'Regular security audits are conducted',
        'Data retention follows government data protection guidelines',
      ],
    },
    {
      title: t('privacy.rights.title'),
      content: [
        'Right to access your personal data',
        'Right to correct inaccurate information',
        'Right to request deletion of your data (subject to legal requirements)',
        'Right to data portability',
        'Right to withdraw consent',
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
          <h1 className="text-h1 text-primary-500 mb-2">{t('privacy.title')}</h1>
          <p className="text-text-muted text-sm">Last updated: January 2024</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6">
            <p className="text-text-secondary leading-relaxed">
              The Ministry of Social Justice and Empowerment, Government of India, is committed to protecting
              your privacy. This policy explains how we collect, use, and safeguard your personal information
              when you use the Life Certificate Queue Management System.
            </p>
          </Card>
        </motion.div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card>
                <h2 className="text-xl font-semibold text-primary-500 mb-4">{section.title}</h2>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-text-secondary">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                      {item}
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
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card>
            <h2 className="text-xl font-semibold text-primary-500 mb-4">Contact for Privacy Concerns</h2>
            <p className="text-text-secondary mb-4">
              If you have any questions or concerns about this privacy policy or how we handle your data,
              please contact our Data Protection Officer:
            </p>
            <div className="bg-secondary-100 p-4 rounded-lg">
              <p className="font-medium text-text-primary">Data Protection Officer</p>
              <p className="text-text-secondary text-sm">Ministry of Social Justice and Empowerment</p>
              <p className="text-text-secondary text-sm">Shastri Bhawan, New Delhi - 110001</p>
              <p className="text-primary-500 text-sm">dpo@lifecert.gov.in</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
};

export default Privacy;
