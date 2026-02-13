import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from '../locales/es/translation.json';
import en from '../locales/en/translation.json';

const resources = {
  es: {
    translation: es,
  },
  en: {
    translation: en,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // Default language
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // React already safe from XSS
    },
    react: {
      useSuspense: false, // Avoid suspense for now if loading synchronously
    },
  });

export default i18n;
