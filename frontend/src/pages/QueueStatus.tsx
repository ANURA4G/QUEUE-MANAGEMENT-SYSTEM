import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useQueue } from '../hooks/useQueue';
import { NowServing } from '../components/queue/NowServing';
import { QueueList } from '../components/queue/QueueList';
import { QueueStats } from '../components/queue/QueueStats';

export const QueueStatus: React.FC = () => {
  const { t } = useTranslation();
  const { queue, stats, isLoading, refresh, lastUpdated, isPolling } = useQueue(true);

  // Get the first person (now serving) and the rest
  const nowServing = queue.length > 0 ? queue[0] : null;
  const waitingQueue = queue.slice(1);

  return (
    <main id="main-content" className="min-h-screen py-12 bg-secondary-200">
      <div className="container-custom">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-h1 text-primary-500 mb-2">{t('queue.title')}</h1>
          <p className="text-text-secondary">{t('queue.subtitle')}</p>
        </motion.div>

        {/* Stats */}
        <QueueStats stats={stats} isLoading={isLoading} />

        {/* Now Serving */}
        <NowServing entry={nowServing} />

        {/* Queue List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Waiting Queue ({waitingQueue.length})
          </h2>
          <QueueList
            queue={waitingQueue}
            isLoading={isLoading}
            onRefresh={refresh}
            lastUpdated={lastUpdated}
            isPolling={isPolling}
          />
        </motion.div>
      </div>
    </main>
  );
};

export default QueueStatus;
