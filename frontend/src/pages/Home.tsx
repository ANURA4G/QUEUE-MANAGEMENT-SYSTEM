import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiSearch,
  FiClock,
  FiUsers,
  FiMonitor,
  FiShield,
  FiChevronDown,
} from 'react-icons/fi';
import { useQueue } from '../hooks/useQueue';
import { ROUTES } from '../utils/constants';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { MiniStats } from '../components/queue/QueueStats';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const { stats, isLoading } = useQueue(true);
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const features = [
    {
      icon: <FiUsers className="w-8 h-8" />,
      titleKey: 'home.features.priority.title',
      descKey: 'home.features.priority.description',
      color: 'text-red-500',
      bg: 'bg-red-100',
    },
    {
      icon: <FiMonitor className="w-8 h-8" />,
      titleKey: 'home.features.online.title',
      descKey: 'home.features.online.description',
      color: 'text-blue-500',
      bg: 'bg-blue-100',
    },
    {
      icon: <FiClock className="w-8 h-8" />,
      titleKey: 'home.features.realtime.title',
      descKey: 'home.features.realtime.description',
      color: 'text-accent-500',
      bg: 'bg-accent-100',
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      titleKey: 'home.features.accessible.title',
      descKey: 'home.features.accessible.description',
      color: 'text-success-500',
      bg: 'bg-success-50',
    },
  ];

  const steps = [
    { num: 1, titleKey: 'home.howItWorks.step1.title', descKey: 'home.howItWorks.step1.description', icon: '📝' },
    { num: 2, titleKey: 'home.howItWorks.step2.title', descKey: 'home.howItWorks.step2.description', icon: '✅' },
    { num: 3, titleKey: 'home.howItWorks.step3.title', descKey: 'home.howItWorks.step3.description', icon: '🏢' },
    { num: 4, titleKey: 'home.howItWorks.step4.title', descKey: 'home.howItWorks.step4.description', icon: '🎉' },
  ];

  const faqs = [
    { qKey: 'home.faq.q1.question', aKey: 'home.faq.q1.answer' },
    { qKey: 'home.faq.q2.question', aKey: 'home.faq.q2.answer' },
    { qKey: 'home.faq.q3.question', aKey: 'home.faq.q3.answer' },
    { qKey: 'home.faq.q4.question', aKey: 'home.faq.q4.answer' },
    { qKey: 'home.faq.q5.question', aKey: 'home.faq.q5.answer' },
  ];

  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* National Emblem */}
            <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-5xl">🏛️</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {t('home.hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 leading-relaxed">
              {t('home.hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ROUTES.BOOKING}>
                <Button variant="accent" size="lg" leftIcon={<FiCalendar />}>
                  {t('home.hero.bookNow')}
                </Button>
              </Link>
              <Link to={ROUTES.QUEUE_STATUS}>
                <Button variant="secondary" size="lg" leftIcon={<FiSearch />}>
                  {t('home.hero.checkStatus')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-12 bg-white -mt-8 relative z-10">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="max-w-3xl mx-auto">
              <h2 className="text-center text-lg font-semibold text-text-secondary mb-6">
                {t('home.stats.title')}
              </h2>
              <MiniStats stats={stats} isLoading={isLoading} />
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-secondary-200">
        <div className="container-custom">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              {t('home.howItWorks.title')}
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hoverable className="text-center h-full">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">{step.icon}</span>
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-primary-500 text-white rounded-full text-sm font-bold mb-3">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-sm text-text-secondary">{t(step.descKey)}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('home.features.title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hoverable className="flex items-start gap-4">
                  <div className={`p-4 rounded-xl ${feature.bg}`}>
                    <span className={feature.color}>{feature.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-1">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-sm text-text-secondary">{t(feature.descKey)}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-secondary-200">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('home.faq.title')}</h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card padding="none" className="overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary-50 transition-colors"
                    aria-expanded={openFaq === index}
                  >
                    <span className="font-medium text-text-primary">{t(faq.qKey)}</span>
                    <FiChevronDown
                      className={`w-5 h-5 text-text-muted transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="px-4 pb-4"
                    >
                      <p className="text-text-secondary">{t(faq.aKey)}</p>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Book Your Appointment?
            </h2>
            <p className="text-primary-100 mb-8 max-w-xl mx-auto">
              Join thousands of citizens who have already simplified their life certificate verification process.
            </p>
            <Link to={ROUTES.BOOKING}>
              <Button variant="accent" size="lg" leftIcon={<FiCalendar />}>
                {t('home.hero.bookNow')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;
