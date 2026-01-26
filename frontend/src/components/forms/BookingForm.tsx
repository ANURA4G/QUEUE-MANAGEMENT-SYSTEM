import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiUser, FiPhone, FiCalendar, FiClock, FiFileText, FiUsers } from 'react-icons/fi';
import { bookingSchema, BookingFormData } from '../../utils/validators';
import { formDraftStorage } from '../../utils/storage';
import { InputField, RadioGroup } from './InputField';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({ onSubmit, isSubmitting }) => {
  const { t } = useTranslation();
  const [showDraftRecovery, setShowDraftRecovery] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isValid, dirtyFields },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: 'onChange',
    defaultValues: {
      life_certificate_no: '',
      name: '',
      age: undefined,
      phone: '',
      proof_guardian_name: '',
      verification_mode: undefined,
      preferred_date: '',
      preferred_time: '',
    },
  });

  // Check for saved draft on mount
  useEffect(() => {
    const draft = formDraftStorage.load();
    if (draft && Object.keys(draft).length > 0) {
      setShowDraftRecovery(true);
    }
  }, []);

  // Auto-save draft
  const formValues = watch();
  useEffect(() => {
    const hasData = Object.values(formValues).some((v) => v !== '' && v !== undefined);
    if (hasData && Object.keys(dirtyFields).length > 0) {
      formDraftStorage.save(formValues);
    }
  }, [formValues, dirtyFields]);

  const handleRestoreDraft = () => {
    const draft = formDraftStorage.load();
    if (draft) {
      reset(draft as BookingFormData);
    }
    setShowDraftRecovery(false);
  };

  const handleDiscardDraft = () => {
    formDraftStorage.clear();
    setShowDraftRecovery(false);
  };

  const handleFormSubmit = async (data: BookingFormData) => {
    await onSubmit(data);
    formDraftStorage.clear();
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Calculate progress
  const totalFields = 8;
  const filledFields = Object.values(formValues).filter((v) => v !== '' && v !== undefined).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Draft Recovery Banner */}
      {showDraftRecovery && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
        >
          <p className="text-amber-800 mb-3">{t('booking.draftRecovered')}</p>
          <div className="flex gap-3">
            <Button size="sm" onClick={handleRestoreDraft}>
              {t('booking.restore')}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDiscardDraft}>
              {t('booking.discard')}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-text-secondary mb-2">
          <span>Form Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-secondary-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Life Certificate Number */}
          <InputField
            {...register('life_certificate_no')}
            label={t('booking.form.certificateNo')}
            placeholder={t('booking.form.certificateNoPlaceholder')}
            error={errors.life_certificate_no?.message}
            leftIcon={<FiFileText className="w-5 h-5" />}
            required
          />

          {/* Name */}
          <InputField
            {...register('name')}
            label={t('booking.form.name')}
            placeholder={t('booking.form.namePlaceholder')}
            error={errors.name?.message}
            leftIcon={<FiUser className="w-5 h-5" />}
            required
          />

          {/* Age and Phone Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              {...register('age', { valueAsNumber: true })}
              type="number"
              label={t('booking.form.age')}
              placeholder={t('booking.form.agePlaceholder')}
              error={errors.age?.message}
              min={0}
              max={150}
              required
            />

            <InputField
              {...register('phone')}
              type="tel"
              label={t('booking.form.phone')}
              placeholder={t('booking.form.phonePlaceholder')}
              error={errors.phone?.message}
              leftIcon={<FiPhone className="w-5 h-5" />}
              maxLength={10}
              required
            />
          </div>

          {/* Guardian Name */}
          <InputField
            {...register('proof_guardian_name')}
            label={t('booking.form.guardianName')}
            placeholder={t('booking.form.guardianNamePlaceholder')}
            error={errors.proof_guardian_name?.message}
            leftIcon={<FiUsers className="w-5 h-5" />}
            required
          />

          {/* Verification Mode */}
          <Controller
            name="verification_mode"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label={t('booking.form.verificationMode')}
                name="verification_mode"
                options={[
                  {
                    value: 'presence',
                    label: t('booking.form.presence'),
                    description: 'Visit the office for in-person verification',
                    icon: '🏢',
                  },
                  {
                    value: 'online',
                    label: t('booking.form.online'),
                    description: 'Verify through secure video call from home',
                    icon: '💻',
                  },
                ]}
                value={field.value}
                onChange={field.onChange}
                error={errors.verification_mode?.message}
                required
              />
            )}
          />

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              {...register('preferred_date')}
              type="date"
              label={t('booking.form.preferredDate')}
              error={errors.preferred_date?.message}
              leftIcon={<FiCalendar className="w-5 h-5" />}
              min={today}
              required
            />

            <InputField
              {...register('preferred_time')}
              type="time"
              label={t('booking.form.preferredTime')}
              error={errors.preferred_time?.message}
              leftIcon={<FiClock className="w-5 h-5" />}
              min="09:00"
              max="17:00"
              required
            />
          </div>

          {/* Age Priority Notice */}
          {formValues.age && formValues.age >= 80 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-800 text-sm">
                🔴 <strong>Senior Priority:</strong> Based on your age ({formValues.age}), you will
                receive priority placement in the queue.
              </p>
            </motion.div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="accent"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? t('booking.form.submitting') : t('booking.form.submit')}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default BookingForm;
