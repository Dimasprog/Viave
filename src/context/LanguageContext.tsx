import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { translations, type TranslationKey } from '../i18n/translations';
import type { LanguageCode, TranslationParams } from '../i18n/types';

const STORAGE_KEY = '@viave/language';

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
  isHydrated: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function applyParams(template: string, params?: TranslationParams): string {
  if (!params) {
    return template;
  }
  let s = template;
  for (const [k, v] of Object.entries(params)) {
    const needle = `{{${k}}}`;
    s = s.split(needle).join(String(v));
  }
  return s;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('ro');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (
          !cancelled &&
          (stored === 'ro' || stored === 'ru')
        ) {
          setLanguageState(stored);
        }
      } finally {
        if (!cancelled) {
          setIsHydrated(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang).catch(() => {});
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams) => {
      const raw = translations[language][key] ?? translations.ro[key] ?? key;
      return applyParams(raw, params);
    },
    [language],
  );

  const value = useMemo(
    () => ({ language, setLanguage, t, isHydrated }),
    [language, setLanguage, t, isHydrated],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
