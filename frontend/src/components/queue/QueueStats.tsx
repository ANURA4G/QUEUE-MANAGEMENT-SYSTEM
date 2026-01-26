import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiUsers, FiClock, FiMonitor, FiHome } from 'react-icons/fi';
import { QueueStatsResponse } from '../../types';
import { formatWaitTime, formatNumber } from '../../utils/formatters';
import { Card } from '../common/Card';
import { Skeleton } from '../common/Loading';

interface QueueStatsProps {
  stats: QueueStatsResponse | null;
  isLoading: boolean;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  color: string;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, subtext, color, bgColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    className="bg-white rounded-lg p-4 shadow-card hover:shadow-card-hover transition-shadow"
  >
    <div className="flex items-start gap-3">
      <div className={`p-3 rounded-lg ${bgColor}`}>
        <span className={color}>{icon}</span>
      </div>
      <div>
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        {subtext && <p className="text-xs text-text-muted">{subtext}</p>}
      </div>
    </div>
  </motion.div>
);

export const QueueStats: React.FC<QueueStatsProps> = ({ stats, isLoading }) => {
  const { t } = useTranslation();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} padding="sm">
            <div className="flex items-start gap-3">
              <Skeleton width={48} height={48} rounded="lg" />
              <div>
                <Skeleton width={60} height={16} className="mb-2" />
                <Skeleton width={40} height={28} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      icon: <FiUsers className="w-6 h-6" />,
      label: t('queue.stats.total'),
      value: formatNumber(stats.total_in_queue),
      subtext: 'people waiting',
      color: 'text-primary-500',
      bgColor: 'bg-primary-100',
    },
    {
      icon: <span className="text-2xl">🔴</span>,
      label: t('queue.stats.priority0'),
      value: formatNumber(stats.priority_0_count),
      subtext: 'senior citizens (80+)',
      color: 'text-red-500',
      bgColor: 'bg-red-100',
    },
    {
      icon: <span className="text-2xl">🟢</span>,
      label: t('queue.stats.priority1'),
      value: formatNumber(stats.priority_1_count),
      subtext: 'general queue',
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      label: t('queue.stats.avgWait'),
      value: formatWaitTime(stats.estimated_wait_time_minutes),
      color: 'text-accent-500',
      bgColor: 'bg-accent-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

// Mini Stats for Homepage
interface MiniStatsProps {
  stats: QueueStatsResponse | null;
  isLoading: boolean;
}

export const MiniStats: React.FC<MiniStatsProps> = ({ stats, isLoading }) => {
  const { t } = useTranslation();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center">
            <Skeleton width={60} height={40} className="mx-auto mb-2" />
            <Skeleton width={80} height={16} className="mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <p className="text-4xl font-bold text-primary-500">{stats.total_in_queue}</p>
        <p className="text-sm text-text-secondary">{t('home.stats.totalInQueue')}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <p className="text-4xl font-bold text-accent-500">
          {stats.estimated_wait_time_minutes}
          <span className="text-lg font-normal ml-1">{t('home.stats.minutes')}</span>
        </p>
        <p className="text-sm text-text-secondary">{t('home.stats.avgWaitTime')}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <p className="text-4xl font-bold text-success-500">
          {stats.presence_mode_count + stats.online_mode_count}
        </p>
        <p className="text-sm text-text-secondary">{t('home.stats.servedToday')}</p>
      </motion.div>
    </div>
  );
};

export default QueueStats;
