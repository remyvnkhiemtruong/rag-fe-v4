import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, School, Users, Landmark, MapPin, ExternalLink } from 'lucide-react';

const FAKE_VISIT_COUNT_KEY = 'fake-visit-count';

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function Footer() {
  const { t } = useTranslation();
  const [fakeVisits, setFakeVisits] = useState(() => {
    if (typeof window === 'undefined') {
      return 1000;
    }

    const storedValue = window.localStorage.getItem(FAKE_VISIT_COUNT_KEY);

    if (storedValue) {
      const parsedValue = Number(storedValue);

      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }

    const initialValue = getRandomInteger(1000, 2000);
    window.localStorage.setItem(FAKE_VISIT_COUNT_KEY, String(initialValue));
    return initialValue;
  });
  const [onlineUsers, setOnlineUsers] = useState(() => getRandomInteger(15, 20));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const storedValue = window.localStorage.getItem(FAKE_VISIT_COUNT_KEY);

    if (!storedValue) {
      const initialValue = getRandomInteger(1000, 2000);
      window.localStorage.setItem(FAKE_VISIT_COUNT_KEY, String(initialValue));
      setFakeVisits(initialValue);
      return undefined;
    }

    const parsedValue = Number(storedValue);

    if (Number.isFinite(parsedValue)) {
      setFakeVisits(parsedValue);
      return undefined;
    }

    const fallbackValue = getRandomInteger(1000, 2000);
    window.localStorage.setItem(FAKE_VISIT_COUNT_KEY, String(fallbackValue));
    setFakeVisits(fallbackValue);
    return undefined;
  }, []);

  useEffect(() => {
    const updateOnlineUsers = () => {
      setOnlineUsers(getRandomInteger(15, 20));
    };

    const intervalId = window.setInterval(updateOnlineUsers, getRandomInteger(5000, 8000));

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <footer className="bg-white dark:bg-gray-900 text-slate-600 dark:text-gray-300 border-t border-slate-200 dark:border-gray-700 relative mb-20 md:mb-0">
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-gray-600 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center shadow-sm">
                <Landmark className="w-6 h-6 text-brand-accent" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-dark dark:text-gray-100">{t('footer.projectTitle')}</h3>
                <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-gray-500">{t('footer.tagline')}</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed mb-6">
              {t('footer.projectDesc')}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-600">
                🤖 {t('footer.ragSystem')}
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-600">
                🧠 {t('footer.aiAssistant')}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-5">
              <Users className="w-5 h-5 text-brand-accent" />
              <h3 className="text-lg font-bold text-brand-dark dark:text-gray-100">{t('footer.team')}</h3>
            </div>
            <div className="space-y-4 text-sm text-slate-500 dark:text-gray-400">
              <div className="bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-4">
                <p className="text-brand-dark dark:text-gray-100 font-semibold">{t('footer.advisor')}: {t('footer.advisorName')}</p>
                <p className="text-xs text-slate-600 dark:text-gray-400">{t('footer.school')}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-3">
                  <p className="text-brand-dark dark:text-gray-100 text-sm font-medium">{t('footer.studentOneName')}</p>
                  <p className="text-xs text-slate-600 dark:text-gray-400">12A6</p>
                </div>
                <div className="bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-3">
                  <p className="text-brand-dark dark:text-gray-100 text-sm font-medium">{t('footer.studentTwoName')}</p>
                  <p className="text-xs text-slate-600 dark:text-gray-400">10A2</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:text-right">
            <div className="flex items-center md:justify-end gap-2 mb-5">
              <Mail className="w-5 h-5 text-brand-accent" />
              <h3 className="text-lg font-bold text-brand-dark dark:text-gray-100">{t('footer.contact')}</h3>
            </div>
            <div className="space-y-3 text-sm text-slate-500 dark:text-gray-400">
              <div className="flex items-center md:justify-end gap-2">
                <School className="w-4 h-4 text-slate-400" />
                <span>{t('footer.school')}</span>
              </div>
              <div className="flex items-center md:justify-end gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{t('footer.location')}</span>
              </div>
              <a
                href="mailto:contact@disancamau.vn"
                className="inline-flex items-center gap-2 px-5 py-2.5 mt-4 rounded-xl bg-brand-dark text-white font-semibold hover:opacity-90 transition shadow-sm"
              >
                <Mail className="w-4 h-4" />
                {t('footer.contactUs')}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-gray-700 mt-12 pt-6 text-center text-sm text-slate-400 dark:text-gray-500">
          {t('footer.copyright')}
          <div className="mt-2 text-xs text-slate-500 dark:text-gray-400 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span>{'T\u1ed5ng truy c\u1eadp: '} {fakeVisits.toLocaleString('vi-VN')}</span>
            <span className="hidden sm:inline" aria-hidden="true">&bull;</span>
            <span>{'\u0110ang truy c\u1eadp: '} {onlineUsers}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
