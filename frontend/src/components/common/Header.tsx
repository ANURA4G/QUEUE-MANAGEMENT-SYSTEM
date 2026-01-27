import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiCalendar, 
  FiUsers, 
  FiSearch,
  FiSettings,
  FiGlobe,
  FiSun,
  FiMoon
} from 'react-icons/fi';
import { ROUTES, NAV_ITEMS } from '../../utils/constants';
import { languageStorage, fontSizeStorage, themeStorage } from '../../utils/storage';

const iconMap: Record<string, React.ReactNode> = {
  home: <FiHome className="w-5 h-5" />,
  calendar: <FiCalendar className="w-5 h-5" />,
  queue: <FiUsers className="w-5 h-5" />,
  search: <FiSearch className="w-5 h-5" />,
};

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    languageStorage.set(newLang as 'en' | 'hi');
  };

  const toggleTheme = () => {
    const currentTheme = themeStorage.get();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    themeStorage.set(newTheme);
  };

  const changeFontSize = (size: 'normal' | 'large' | 'extra-large') => {
    fontSizeStorage.set(size);
    document.documentElement.classList.remove('text-normal', 'text-large', 'text-extra-large');
    document.documentElement.classList.add(`text-${size}`);
  };

  const toggleContrast = () => {
    const currentTheme = themeStorage.get();
    const newTheme = currentTheme === 'high-contrast' ? 'light' : 'high-contrast';
    themeStorage.set(newTheme);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* Top Bar - Government Banner */}
      <div className="bg-primary-500 text-white py-2">
        <div className="container-custom flex justify-between items-center text-sm">
          <span className="hidden sm:block">{t('app.department')}</span>
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 hover:text-accent-500 transition-colors"
              aria-label={t('accessibility.theme')}
            >
              {themeStorage.get() === 'dark' ? (
                <FiSun className="w-4 h-4" />
              ) : (
                <FiMoon className="w-4 h-4" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 hover:text-accent-500 transition-colors"
              aria-label={t('accessibility.language')}
            >
              <FiGlobe className="w-4 h-4" />
              <span>{i18n.language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
            
            {/* Accessibility Toggle */}
            <button
              onClick={() => setAccessibilityOpen(!accessibilityOpen)}
              className="flex items-center gap-1 hover:text-accent-500 transition-colors"
              aria-label="Accessibility options"
              aria-expanded={accessibilityOpen}
            >
              <FiSettings className="w-4 h-4" />
              <span className="hidden sm:inline">{t('accessibility.fontSize')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Accessibility Dropdown */}
      <AnimatePresence>
        {accessibilityOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-secondary-100 border-b border-border overflow-hidden"
          >
            <div className="container-custom py-3 flex flex-wrap gap-4 items-center justify-center">
              {/* Font Size */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{t('accessibility.fontSize')}:</span>
                <button
                  onClick={() => changeFontSize('normal')}
                  className="px-3 py-1 text-sm border rounded hover:bg-primary-100"
                >
                  A
                </button>
                <button
                  onClick={() => changeFontSize('large')}
                  className="px-3 py-1 text-base border rounded hover:bg-primary-100"
                >
                  A+
                </button>
                <button
                  onClick={() => changeFontSize('extra-large')}
                  className="px-3 py-1 text-lg border rounded hover:bg-primary-100"
                >
                  A++
                </button>
              </div>
              
              {/* Contrast */}
              <button
                onClick={toggleContrast}
                className="px-4 py-1 text-sm border rounded hover:bg-primary-100"
              >
                {t('accessibility.highContrast')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation */}
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">🏛️</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-primary-500 leading-tight">
                {t('app.name')}
              </h1>
              <p className="text-xs text-text-secondary">{t('app.tagline')}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-text-primary hover:bg-secondary-200'
                  }`}
                >
                  {iconMap[item.icon]}
                  <span>{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary-200 transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <div className="flex flex-col gap-2 pb-4">
                {NAV_ITEMS.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-500 text-white'
                          : 'text-text-primary hover:bg-secondary-200'
                      }`}
                    >
                      {iconMap[item.icon]}
                      <span>{t(item.labelKey)}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
