import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiLogOut,
  FiUserPlus,
  FiDownload,
  FiTrash2,
  FiPlay,
  FiUsers,
  FiMonitor,
  FiHome,
  FiClock,
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useQueue } from '../hooks/useQueue';
import { dequeue, clearQueue, removeEntry } from '../api/queue';
import { ROUTES } from '../utils/constants';
import { formatNumber, formatWaitTime } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ConfirmModal } from '../components/common/Modal';
import { QueueList } from '../components/queue/QueueList';
import { NowServing } from '../components/queue/NowServing';
import toast from 'react-hot-toast';

export const Admin: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const { queue, stats, isLoading, refresh, lastUpdated, isPolling } = useQueue(true);

  const [isDequeuing, setIsDequeuing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState<string | null>(null);

  // Redirect to login if not authenticated
  if (!authLoading && !isAuthenticated) {
    return <Navigate to={ROUTES.ADMIN_LOGIN} replace />;
  }

  const nowServing = queue.length > 0 ? queue[0] : null;
  const waitingQueue = queue.slice(1);

  const handleDequeue = async () => {
    setIsDequeuing(true);
    try {
      const response = await dequeue();
      if (response.success) {
        toast.success(`Called: ${response.data?.served.name}`);
        refresh();
      }
    } catch (error) {
      // Silent fail
    } finally {
      setIsDequeuing(false);
    }
  };

  const handleClearQueue = async () => {
    setIsClearing(true);
    try {
      const response = await clearQueue();
      if (response.success) {
        toast.success(`Cleared ${response.data?.cleared_count} entries`);
        setShowClearModal(false);
        refresh();
      }
    } catch (error) {
      // Silent fail
    } finally {
      setIsClearing(false);
    }
  };

  const handleRemoveEntry = async (certNo: string) => {
    try {
      await removeEntry(certNo);
      toast.success('Entry removed from queue');
      setShowRemoveModal(null);
      refresh();
    } catch (error) {
      // Silent fail
    }
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Position', 'Name', 'Certificate No', 'Age', 'Phone', 'Guardian', 'Mode', 'Priority', 'Date', 'Time'];
    const rows = queue.map((entry, index) => [
      index + 1,
      entry.name,
      entry.life_certificate_no,
      entry.age,
      entry.phone,
      entry.proof_guardian_name,
      entry.verification_mode,
      entry.priority === 0 ? 'Senior' : 'General',
      entry.preferred_date,
      entry.preferred_time,
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `queue-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Queue data exported');
  };

  return (
    <main id="main-content" className="min-h-screen py-8 bg-secondary-200">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-h1 text-primary-500">{t('admin.dashboard.title')}</h1>
            <p className="text-text-secondary">{t('admin.dashboard.welcome')}</p>
          </div>
          <Button variant="ghost" onClick={logout} leftIcon={<FiLogOut />}>
            {t('admin.dashboard.logout')}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <FiUsers className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="text-xs text-text-muted">{t('admin.dashboard.stats.total')}</p>
                <p className="text-xl font-bold text-text-primary">
                  {stats ? formatNumber(stats.total_in_queue) : '-'}
                </p>
              </div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-lg">🔴</span>
              </div>
              <div>
                <p className="text-xs text-text-muted">{t('admin.dashboard.stats.priority0')}</p>
                <p className="text-xl font-bold text-text-primary">
                  {stats ? formatNumber(stats.priority_0_count) : '-'}
                </p>
              </div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-lg">🟢</span>
              </div>
              <div>
                <p className="text-xs text-text-muted">{t('admin.dashboard.stats.priority1')}</p>
                <p className="text-xl font-bold text-text-primary">
                  {stats ? formatNumber(stats.priority_1_count) : '-'}
                </p>
              </div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiHome className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-text-muted">{t('admin.dashboard.stats.presence')}</p>
                <p className="text-xl font-bold text-text-primary">
                  {stats ? formatNumber(stats.presence_mode_count) : '-'}
                </p>
              </div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiMonitor className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-text-muted">{t('admin.dashboard.stats.online')}</p>
                <p className="text-xl font-bold text-text-primary">
                  {stats ? formatNumber(stats.online_mode_count) : '-'}
                </p>
              </div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-100 rounded-lg">
                <FiClock className="w-5 h-5 text-accent-500" />
              </div>
              <div>
                <p className="text-xs text-text-muted">{t('admin.dashboard.stats.avgAge')}</p>
                <p className="text-xl font-bold text-text-primary">
                  {stats ? Math.round(stats.average_age) : '-'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            variant="success"
            size="lg"
            onClick={handleDequeue}
            isLoading={isDequeuing}
            disabled={queue.length === 0}
            leftIcon={<FiPlay />}
          >
            {t('admin.dashboard.callNext')}
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowClearModal(true)}
            disabled={queue.length === 0}
            leftIcon={<FiTrash2 />}
          >
            {t('admin.dashboard.clearQueue')}
          </Button>
          <Button
            variant="secondary"
            onClick={handleExport}
            disabled={queue.length === 0}
            leftIcon={<FiDownload />}
          >
            {t('admin.dashboard.export')}
          </Button>
        </div>

        {/* Now Serving */}
        <NowServing entry={nowServing} />

        {/* Queue Management */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            {t('admin.dashboard.queue.title')} ({waitingQueue.length})
          </h2>
          <QueueList
            queue={waitingQueue}
            isLoading={isLoading}
            onRefresh={refresh}
            lastUpdated={lastUpdated}
            isPolling={isPolling}
            onRemove={(certNo) => setShowRemoveModal(certNo)}
            showActions
          />
        </motion.div>

        {/* Clear Queue Modal */}
        <ConfirmModal
          isOpen={showClearModal}
          onClose={() => setShowClearModal(false)}
          onConfirm={handleClearQueue}
          title="Clear Entire Queue"
          message={t('admin.dashboard.confirm.clearQueue')}
          confirmText="Yes, Clear All"
          cancelText="Cancel"
          variant="danger"
          isLoading={isClearing}
        />

        {/* Remove Entry Modal */}
        <ConfirmModal
          isOpen={!!showRemoveModal}
          onClose={() => setShowRemoveModal(null)}
          onConfirm={() => showRemoveModal && handleRemoveEntry(showRemoveModal)}
          title="Remove Entry"
          message={t('admin.dashboard.confirm.remove')}
          confirmText="Yes, Remove"
          cancelText="Cancel"
          variant="warning"
        />
      </div>
    </main>
  );
};

export default Admin;
