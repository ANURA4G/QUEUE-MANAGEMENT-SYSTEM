import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { QueueEntry, QueueFilters } from '../../types';
import { QueueItem } from './QueueItem';
import { Button } from '../common/Button';
import { Skeleton } from '../common/Loading';

interface QueueListProps {
  queue: QueueEntry[];
  isLoading: boolean;
  onRefresh: () => void;
  lastUpdated: Date | null;
  isPolling: boolean;
  onRemove?: (certNo: string) => void;
  showActions?: boolean;
}

export const QueueList: React.FC<QueueListProps> = ({
  queue,
  isLoading,
  onRefresh,
  lastUpdated,
  isPolling,
  onRemove,
  showActions = false,
}) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<QueueFilters>({
    priority: 'all',
    verificationMode: 'all',
    date: null,
    searchTerm: '',
  });

  // Filter queue
  const filteredQueue = useMemo(() => {
    return queue.filter((entry) => {
      // Priority filter
      if (filters.priority !== 'all' && entry.priority !== filters.priority) {
        return false;
      }

      // Verification mode filter
      if (
        filters.verificationMode !== 'all' &&
        entry.verification_mode !== filters.verificationMode
      ) {
        return false;
      }

      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesName = entry.name.toLowerCase().includes(searchLower);
        const matchesCert = entry.life_certificate_no.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesCert) {
          return false;
        }
      }

      return true;
    });
  }, [queue, filters]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
          <input
            type="text"
            placeholder={t('queue.filters.search')}
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-text-secondary flex items-center gap-1">
            <FiFilter className="w-4 h-4" />
            Filter:
          </span>

          {/* Priority Filters */}
          <button
            onClick={() => setFilters({ ...filters, priority: 'all' })}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filters.priority === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-secondary-200 text-text-secondary hover:bg-secondary-300'
            }`}
          >
            {t('queue.filters.all')}
          </button>
          <button
            onClick={() => setFilters({ ...filters, priority: 0 })}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filters.priority === 0
                ? 'bg-red-500 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            🔴 {t('queue.filters.priority0')}
          </button>
          <button
            onClick={() => setFilters({ ...filters, priority: 1 })}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filters.priority === 1
                ? 'bg-green-500 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            🟢 {t('queue.filters.priority1')}
          </button>

          <div className="w-px h-6 bg-border mx-2" />

          {/* Verification Mode Filters */}
          <button
            onClick={() => setFilters({ ...filters, verificationMode: 'presence' })}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filters.verificationMode === 'presence'
                ? 'bg-primary-500 text-white'
                : 'bg-secondary-200 text-text-secondary hover:bg-secondary-300'
            }`}
          >
            🏢 {t('queue.filters.presence')}
          </button>
          <button
            onClick={() => setFilters({ ...filters, verificationMode: 'online' })}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filters.verificationMode === 'online'
                ? 'bg-primary-500 text-white'
                : 'bg-secondary-200 text-text-secondary hover:bg-secondary-300'
            }`}
          >
            💻 {t('queue.filters.online')}
          </button>
        </div>

        {/* Last Updated & Refresh */}
        <div className="flex items-center justify-between text-sm">
          <p className="text-text-muted">
            {lastUpdated && (
              <>
                {t('queue.lastUpdated')}: {lastUpdated.toLocaleTimeString()}
              </>
            )}
            {isPolling && (
              <span className="ml-2 text-success-500">• {t('queue.autoRefresh')}</span>
            )}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            leftIcon={<FiRefreshCw className={isLoading ? 'animate-spin' : ''} />}
          >
            {t('common.refresh')}
          </Button>
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-3">
        {isLoading && queue.length === 0 ? (
          // Loading Skeletons
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg">
              <Skeleton width={48} height={48} rounded="full" />
              <div className="flex-1">
                <Skeleton width="60%" height={20} className="mb-2" />
                <Skeleton width="40%" height={16} />
              </div>
              <Skeleton width={80} height={36} />
            </div>
          ))
        ) : filteredQueue.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-lg"
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-secondary-200 rounded-full flex items-center justify-center">
              <span className="text-4xl">📭</span>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {filters.searchTerm || filters.priority !== 'all' || filters.verificationMode !== 'all'
                ? 'No matching entries'
                : t('queue.empty')}
            </h3>
            <p className="text-text-secondary">
              {filters.searchTerm || filters.priority !== 'all' || filters.verificationMode !== 'all'
                ? 'Try adjusting your filters'
                : 'New appointments will appear here'}
            </p>
          </motion.div>
        ) : (
          // Queue Items
          <AnimatePresence mode="popLayout">
            {filteredQueue.map((entry, index) => (
              <QueueItem
                key={entry.life_certificate_no}
                entry={entry}
                position={index + 1}
                onRemove={onRemove}
                showActions={showActions}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Results Count */}
      {!isLoading && filteredQueue.length > 0 && (
        <p className="text-center text-sm text-text-muted mt-4">
          Showing {filteredQueue.length} of {queue.length} entries
        </p>
      )}
    </div>
  );
};

export default QueueList;
