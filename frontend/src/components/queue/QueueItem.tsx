import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { QueueEntry } from '../../types';
import { maskName, maskCertificateNo, formatWaitTime, formatPosition } from '../../utils/formatters';
import { PRIORITY_CONFIG } from '../../utils/constants';

interface QueueItemProps {
  entry: QueueEntry;
  position: number;
  onRemove?: (certNo: string) => void;
  showActions?: boolean;
}

export const QueueItem = forwardRef<HTMLDivElement, QueueItemProps>(({
  entry,
  position,
  onRemove,
  showActions = false,
}, ref) => {
  const priorityConfig = PRIORITY_CONFIG[entry.priority as 0 | 1];
  const estimatedWait = position * 5; // 5 minutes per person

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        'flex items-center gap-4 p-4 bg-white rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow',
        priorityConfig.borderColor
      )}
    >
      {/* Position */}
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
        <span className="text-primary-600 font-bold text-lg">{position}</span>
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-semibold text-text-primary truncate">{maskName(entry.name)}</h4>
          <span
            className={clsx(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
              priorityConfig.bgColor,
              priorityConfig.textColor
            )}
          >
            {priorityConfig.icon} {entry.priority === 0 ? `Age ${entry.age}` : 'General'}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-text-secondary mt-1">
          <span>{maskCertificateNo(entry.life_certificate_no)}</span>
          <span className="flex items-center gap-1">
            {entry.verification_mode === 'presence' ? '🏢' : '💻'}
            {entry.verification_mode === 'presence' ? 'In-Person' : 'Online'}
          </span>
        </div>
      </div>

      {/* Wait Time */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-medium text-text-primary">~{formatWaitTime(estimatedWait)}</p>
        <p className="text-xs text-text-muted">estimated wait</p>
      </div>

      {/* Actions (Admin) */}
      {showActions && onRemove && (
        <button
          onClick={() => onRemove(entry.life_certificate_no)}
          className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Remove from queue"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </motion.div>
  );
});

QueueItem.displayName = 'QueueItem';

export default QueueItem;
