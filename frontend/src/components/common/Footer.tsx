import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';
import { ROUTES, FOOTER_LINKS, CONTACT_INFO } from '../../utils/constants';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-500 text-white mt-auto">
      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary-500 font-bold text-lg">🏛️</span>
              </div>
              <div>
                <h3 className="font-bold">{t('app.name')}</h3>
              </div>
            </div>
            <p className="text-sm text-primary-100 leading-relaxed">
              {t('app.department')}, {t('app.ministry')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-100 hover:text-white transition-colors text-sm"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">{t('footer.support')}</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-100 hover:text-white transition-colors text-sm"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-100 hover:text-white transition-colors text-sm"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <FiPhone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-primary-100">{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <FiMail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a 
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-primary-100 hover:text-white transition-colors"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <FiClock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-primary-100">{CONTACT_INFO.timings}</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-primary-100">{CONTACT_INFO.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-400">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-primary-100">
              {t('footer.copyright').replace('2025', currentYear.toString())}
            </p>
            <p className="text-primary-200 text-center md:text-right">
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
