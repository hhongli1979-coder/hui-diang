import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SupportedLang, SUPPORTED_LANGUAGES, LanguageMeta, translations } from './translations';

export * from './translations';

interface I18nContextType {
  lang: SupportedLang;
  setLang: (lang: SupportedLang, isManual?: boolean) => void;
  currentMeta: LanguageMeta;
  languages: LanguageMeta[];
  isAutoDetected: boolean;
  browserLang: string;
  resetToBrowser: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Intelligent Browser Language Resolver
export function detectBrowserLanguage(): SupportedLang {
  if (typeof window === 'undefined' || !navigator) return 'it';

  const browserLangs = navigator.languages || [navigator.language || 'it'];

  for (const raw of browserLangs) {
    if (!raw) continue;
    const lower = raw.toLowerCase();

    // Chinese: zh, zh-CN, zh-TW, zh-HK
    if (lower.startsWith('zh')) return 'zh';

    // Italian: it, it-IT, it-CH
    if (lower.startsWith('it')) return 'it';

    // English: en, en-US, en-GB
    if (lower.startsWith('en')) return 'en';

    // Spanish: es, es-ES, es-MX
    if (lower.startsWith('es')) return 'es';

    // French: fr, fr-FR
    if (lower.startsWith('fr')) return 'fr';
  }

  return 'it';
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(() => {
    return !localStorage.getItem('amica_user_lang_manual');
  });

  const [lang, setLangState] = useState<SupportedLang>(() => {
    const saved = localStorage.getItem('amica_locale') as SupportedLang | null;
    if (saved && ['it', 'zh', 'en', 'es', 'fr'].includes(saved)) {
      return saved;
    }
    return detectBrowserLanguage();
  });

  const [browserLang, setBrowserLang] = useState<string>(() => {
    return typeof navigator !== 'undefined' ? (navigator.language || 'it') : 'it';
  });

  // Intelligent real-time listener: switch language automatically when browser locale changes
  useEffect(() => {
    const handleLanguageChange = () => {
      const currentBrowser = navigator.language || 'it';
      setBrowserLang(currentBrowser);

      // Only auto-switch if user hasn't explicitly locked in a manual language
      const isManual = localStorage.getItem('amica_user_lang_manual') === 'true';
      if (!isManual) {
        const detected = detectBrowserLanguage();
        setLangState(detected);
        setIsAutoDetected(true);
      }
    };

    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  // Update HTML lang attribute whenever language changes
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((newLang: SupportedLang, isManual = true) => {
    setLangState(newLang);
    localStorage.setItem('amica_locale', newLang);
    if (isManual) {
      localStorage.setItem('amica_user_lang_manual', 'true');
      setIsAutoDetected(false);
    } else {
      localStorage.removeItem('amica_user_lang_manual');
      setIsAutoDetected(true);
    }
  }, []);

  const resetToBrowser = useCallback(() => {
    const detected = detectBrowserLanguage();
    setLang(detected, false);
  }, [setLang]);

  // Translation lookup with variable interpolation: {name}, {count}, {dist}, {city}
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const langDict = translations[lang] || translations.it;
      let text = langDict[key] || translations.it[key] || key;

      if (params) {
        Object.entries(params).forEach(([paramKey, val]) => {
          text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
        });
      }

      return text;
    },
    [lang]
  );

  const currentMeta = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return (
    <I18nContext.Provider
      value={{
        lang,
        setLang,
        currentMeta,
        languages: SUPPORTED_LANGUAGES,
        isAutoDetected,
        browserLang,
        resetToBrowser,
        t,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
