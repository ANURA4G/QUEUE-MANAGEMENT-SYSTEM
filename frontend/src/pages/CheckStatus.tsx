import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { FiCalendar, FiClock, FiUser, FiPhone, FiMapPin, FiMonitor, FiAlertCircle } from 'react-icons/fi';
import { getQueuePosition, removeEntry } from '../api/queue';
import { searchStorage } from '../utils/storage';
import { SearchFormData } from '../utils/validators';
import { ROUTES } from '../utils/constants';
import { formatDateTime, formatWaitTime, formatPosition } from '../utils/formatters';
import { SearchForm } from '../components/forms/SearchForm';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ConfirmModal } from '../components/common/Modal';
import { QueueEntry } from '../types';
import toast from 'react-hot-toast';

interface QueuePositionData {
  position: number;
  entry: QueueEntry;
  peopleAhead: number;
  estimatedWaitTime: number;
}

export const CheckStatus: React.FC = () => {
  const { t } = useTranslation();
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<QueuePositionData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searchedCertNo, setSearchedCertNo] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleSearch = async (data: SearchFormData) => {
    setIsSearching(true);
    setNotFound(false);
    setResult(null);
    setSearchedCertNo(data.life_certificate_no);

    try {
      const positionData = await getQueuePosition(data.life_certificate_no);
      if (positionData) {
        setResult(positionData);
        searchStorage.set(data.life_certificate_no);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCancel = async () => {
    if (!result) return;
    setIsCancelling(true);

    try {
      await removeEntry(result.entry.life_certificate_no);
      toast.success('Appointment cancelled successfully');
      setResult(null);
      setShowCancelModal(false);
    } catch (error) {
      toast.error('Failed to cancel appointment');
    } finally {
      setIsCancelling(false);
    }
  };

  const lastSearch = searchStorage.get();

  return (
    <main id="main-content" className="min-h-screen py-12 bg-secondary-200">
      <div className="container-custom">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-h1 text-primary-500 mb-2">{t('checkStatus.title')}</h1>
          <p className="text-text-secondary">{t('checkStatus.subtitle')}</p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <SearchForm
            onSubmit={handleSearch}
            isSearching={isSearching}
            defaultValue={lastSearch || ''}
          />
        </motion.div>

        {/* Not Found State */}
        {notFound && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto"
          >
            <Card className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                <FiAlertCircle className="w-10 h-10 text-amber-500" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                {t('checkStatus.notFound.title')}
              </h2>
              <p className="text-text-secondary mb-6">{t('checkStatus.notFound.message')}</p>
              <Link to={ROUTES.BOOKING}>
                <Button variant="primary">{t('home.hero.bookNow')}</Button>
              </Link>
            </Card>
          </motion.div>
        )}

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              {/* Queue Position Header */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 -m-6 mb-6 p-6 rounded-t-lg text-white">
                <h2 className="text-center text-primary-100 mb-4">{t('checkStatus.result.title')}</h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-primary-200 text-sm mb-1">{t('checkStatus.result.position')}</p>
                    <p className="text-4xl font-bold">{formatPosition(result.position)}</p>
                  </div>
                  <div>
                    <p className="text-primary-200 text-sm mb-1">{t('checkStatus.result.peopleAhead')}</p>
                    <p className="text-4xl font-bold">{result.peopleAhead}</p>
                  </div>
                  <div>
                    <p className="text-primary-200 text-sm mb-1">{t('checkStatus.result.waitTime')}</p>
                    <p className="text-2xl font-semibold">~{formatWaitTime(result.estimatedWaitTime)}</p>
                  </div>
                </div>
              </div>

              {/* Priority Badge */}
              <div className="flex justify-center mb-6">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    result.entry.priority === 0
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {result.entry.priority === 0 ? '🔴' : '🟢'}
                  {result.entry.priority === 0 ? 'Senior Priority (Age 80+)' : 'General Queue'}
                </span>
              </div>

              {/* Appointment Details */}
              <h3 className="font-semibold text-text-primary mb-4">
                {t('checkStatus.result.appointmentDetails')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <FiUser className="w-5 h-5 text-primary-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-text-muted">{t('checkStatus.result.name')}</p>
                    <p className="font-medium">{result.entry.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMapPin className="w-5 h-5 text-primary-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-text-muted">{t('checkStatus.result.certificate')}</p>
                    <p className="font-medium">{result.entry.life_certificate_no}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  {result.entry.verification_mode === 'presence' ? (
                    <FiMapPin className="w-5 h-5 text-primary-500 mt-0.5" />
                  ) : (
                    <FiMonitor className="w-5 h-5 text-primary-500 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm text-text-muted">{t('checkStatus.result.mode')}</p>
                    <p className="font-medium">
                      {result.entry.verification_mode === 'presence' ? '🏢 In-Person' : '💻 Online'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiCalendar className="w-5 h-5 text-primary-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-text-muted">{t('checkStatus.result.date')}</p>
                    <p className="font-medium">
                      {formatDateTime(result.entry.preferred_date, result.entry.preferred_time)}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="border-t border-border-light pt-6">
                <div className="flex flex-col items-center">
                  <p className="text-sm text-text-muted mb-3">{t('checkStatus.result.qrCode')}</p>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <QRCodeSVG
                      value={JSON.stringify({
                        cert: result.entry.life_certificate_no,
                        name: result.entry.name,
                        pos: result.position,
                      })}
                      size={150}
                      level="H"
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-2">{t('checkStatus.result.qrHint')}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-border-light">
                <Button
                  variant="danger"
                  onClick={() => setShowCancelModal(true)}
                  fullWidth
                >
                  {t('checkStatus.result.cancel')}
                </Button>
                <Link to={ROUTES.BOOKING} className="flex-1">
                  <Button variant="secondary" fullWidth>
                    {t('checkStatus.result.reschedule')}
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Cancel Confirmation Modal */}
        <ConfirmModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancel}
          title="Cancel Appointment"
          message="Are you sure you want to cancel this appointment? This action cannot be undone."
          confirmText="Yes, Cancel"
          cancelText="No, Keep It"
          variant="danger"
          isLoading={isCancelling}
        />
      </div>
    </main>
  );
};

export default CheckStatus;
