import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { FiCheckCircle, FiDownload, FiPrinter, FiCalendar, FiSearch } from 'react-icons/fi';
import { enqueue } from '../api/queue';
import { BookingFormData } from '../utils/validators';
import { ROUTES } from '../utils/constants';
import { formatDateTime, formatPosition, formatWaitTime } from '../utils/formatters';
import { BookingForm } from '../components/forms/BookingForm';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { EnqueueResponse } from '../types';
import toast from 'react-hot-toast';

export const Booking: React.FC = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<EnqueueResponse | null>(null);
  const [submittedData, setSubmittedData] = useState<BookingFormData | null>(null);

  const handleSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const response = await enqueue(data);
      if (response.success && response.data) {
        setBookingResult(response.data);
        setSubmittedData(data);
        toast.success(t('booking.success.title'));
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDF = () => {
    if (!bookingResult || !submittedData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(0, 61, 130); // Primary color
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('Life Certificate Queue Management System', pageWidth / 2, 18, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Government of India - Appointment Slip', pageWidth / 2, 28, { align: 'center' });

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Queue Position Box
    doc.setFillColor(244, 244, 244);
    doc.rect(20, 50, pageWidth - 40, 30, 'F');
    doc.setFontSize(14);
    doc.text('Queue Position', 30, 62);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`#${bookingResult.position}`, 30, 75);
    doc.setFont('helvetica', 'normal');

    // Priority
    doc.setFontSize(12);
    const priorityText = bookingResult.priority === 0 ? 'Senior Priority (80+)' : 'General Queue';
    const priorityColor = bookingResult.priority === 0 ? [220, 38, 38] : [34, 197, 94];
    doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
    doc.text(priorityText, pageWidth - 30, 65, { align: 'right' });
    doc.setTextColor(0, 0, 0);

    // Appointment Details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Appointment Details', 20, 100);
    doc.setFont('helvetica', 'normal');

    const details = [
      ['Certificate No:', submittedData.life_certificate_no],
      ['Name:', submittedData.name],
      ['Age:', `${submittedData.age} years`],
      ['Phone:', submittedData.phone],
      ['Guardian Name:', submittedData.proof_guardian_name],
      ['Verification Mode:', submittedData.verification_mode === 'presence' ? 'In-Person' : 'Online'],
      ['Date:', submittedData.preferred_date],
      ['Time:', submittedData.preferred_time],
      ['Est. Wait Time:', formatWaitTime(bookingResult.estimated_wait_time)],
    ];

    let y = 115;
    doc.setFontSize(11);
    details.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 30, y);
      doc.setFont('helvetica', 'normal');
      doc.text(String(value), 90, y);
      y += 10;
    });

    // Footer
    doc.setFillColor(0, 61, 130);
    doc.rect(0, doc.internal.pageSize.getHeight() - 25, pageWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(
      'Please bring this slip and a valid ID proof for verification.',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 12,
      { align: 'center' }
    );

    // Save
    doc.save(`appointment-slip-${submittedData.life_certificate_no}.pdf`);
    toast.success('Appointment slip downloaded!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBookAnother = () => {
    setBookingResult(null);
    setSubmittedData(null);
  };

  // Success View
  if (bookingResult && submittedData) {
    return (
      <main id="main-content" className="min-h-screen py-12 bg-secondary-200">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              {/* Success Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-4 bg-success-50 rounded-full flex items-center justify-center"
                >
                  <FiCheckCircle className="w-10 h-10 text-success-500" />
                </motion.div>
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                  {t('booking.success.title')}
                </h1>
              </div>

              {/* Queue Position */}
              <div className="bg-primary-500 text-white rounded-xl p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-primary-200 text-sm mb-1">{t('booking.success.position')}</p>
                    <p className="text-4xl font-bold">#{bookingResult.position}</p>
                  </div>
                  <div>
                    <p className="text-primary-200 text-sm mb-1">{t('booking.success.priority')}</p>
                    <p className="text-xl font-semibold">
                      {bookingResult.priority === 0 ? '🔴 Senior' : '🟢 General'}
                    </p>
                  </div>
                  <div>
                    <p className="text-primary-200 text-sm mb-1">{t('booking.success.waitTime')}</p>
                    <p className="text-xl font-semibold">
                      ~{formatWaitTime(bookingResult.estimated_wait_time)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="mb-6">
                <h2 className="font-semibold text-text-primary mb-4">{t('booking.success.details')}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-text-muted">Certificate No.</p>
                    <p className="font-medium">{submittedData.life_certificate_no}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Name</p>
                    <p className="font-medium">{submittedData.name}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Verification Mode</p>
                    <p className="font-medium">
                      {submittedData.verification_mode === 'presence' ? '🏢 In-Person' : '💻 Online'}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-muted">Scheduled</p>
                    <p className="font-medium">
                      {formatDateTime(submittedData.preferred_date, submittedData.preferred_time)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  onClick={generatePDF}
                  leftIcon={<FiDownload />}
                  fullWidth
                >
                  {t('booking.success.downloadSlip')}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handlePrint}
                  leftIcon={<FiPrinter />}
                  fullWidth
                >
                  {t('booking.success.printSlip')}
                </Button>
              </div>

              {/* Additional Actions */}
              <div className="mt-6 pt-6 border-t border-border-light flex flex-col sm:flex-row gap-3">
                <Button variant="ghost" onClick={handleBookAnother} leftIcon={<FiCalendar />} fullWidth>
                  {t('booking.success.bookAnother')}
                </Button>
                <Link to={ROUTES.QUEUE_STATUS} className="flex-1">
                  <Button variant="ghost" leftIcon={<FiSearch />} fullWidth>
                    {t('booking.success.checkStatus')}
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
    );
  }

  // Booking Form View
  return (
    <main id="main-content" className="min-h-screen py-12 bg-secondary-200">
      <div className="container-custom">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-h1 text-primary-500 mb-2">{t('booking.title')}</h1>
          <p className="text-text-secondary">{t('booking.subtitle')}</p>
        </motion.div>

        {/* Booking Form */}
        <BookingForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </main>
  );
};

export default Booking;
