import React, { createContext, useContext, useState, useEffect } from 'react';
import englishFlag from '../assets/hero/header-slider/English.png';
import franceFlag from '../assets/hero/header-slider/France.png';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const languages = [
  { code: 'en', name: 'English', flag: englishFlag },
  { code: 'fr', name: 'Français', flag: franceFlag },
];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fr');

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (langCode) => {
    setLanguage(langCode);
  };

  const currentLanguage = languages.find(lang => lang.code === language) || languages[1];

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, languages, currentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
