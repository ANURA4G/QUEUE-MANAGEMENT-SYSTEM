import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiUser, FiClock } from 'react-icons/fi';
import { QueueEntry } from '../../types';
import { maskName, formatWaitTime } from '../../utils/formatters';
import { Card } from '../common/Card';

interface NowServingProps {
  entry: QueueEntry | null;
}

export const NowServing: React.FC<NowServingProps> = ({ entry }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="bg-gradient-to-r from-success-500 to-success-600 text-white border-0">
        <div className="text-center">
          <p className="text-success-100 text-sm uppercase tracking-wider mb-2">
            {t('queue.nowServing')}
          </p>
          {entry ? (
            <div className="space-y-3">
              <motion.div
                key={entry.life_certificate_no}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-3"
              >
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <FiUser className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold">{maskName(entry.name)}</h3>
                  <p className="text-success-100">
                    {entry.verification_mode === 'presence' ? '🏢' : '💻'}{' '}
                    {entry.verification_mode === 'presence' ? 'In-Person' : 'Online'} Verification
                  </p>
                </div>
              </motion.div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm">
                <FiClock className="w-4 h-4" />
                <span>Processing now...</span>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <p className="text-xl text-success-100">{t('queue.noOneServing')}</p>
              <p className="text-sm text-success-200 mt-2">
                Waiting for the next person in queue
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default NowServing;
