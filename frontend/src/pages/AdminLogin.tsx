import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiUser, FiLock, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, LoginFormData } from '../utils/validators';
import { ROUTES } from '../utils/constants';
import { InputField } from '../components/forms/InputField';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const AdminLogin: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    const success = await login(data.username, data.password);
    if (success) {
      navigate(ROUTES.ADMIN);
    } else {
      setError(t('admin.login.error'));
    }
  };

  return (
    <main id="main-content" className="min-h-screen py-12 bg-secondary-200 flex items-center justify-center">
      <div className="container-custom max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <FiLock className="w-8 h-8 text-primary-500" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary">{t('admin.login.title')}</h1>
              <p className="text-text-secondary mt-1">{t('admin.login.subtitle')}</p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
              >
                <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <InputField
                {...register('username')}
                type="text"
                label={t('admin.login.username')}
                placeholder="Enter username"
                error={errors.username?.message}
                leftIcon={<FiUser className="w-5 h-5" />}
                autoComplete="username"
              />

              <InputField
                {...register('password')}
                type="password"
                label={t('admin.login.password')}
                placeholder="Enter password"
                error={errors.password?.message}
                leftIcon={<FiLock className="w-5 h-5" />}
                autoComplete="current-password"
              />

              <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading}>
                {t('admin.login.submit')}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Demo Credentials:</strong>
                <br />
                Username: <code className="bg-amber-100 px-1 rounded">admin</code>
                <br />
                Password: <code className="bg-amber-100 px-1 rounded">admin123</code>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
};

export default AdminLogin;
