import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingContext = createContext();

export const useSetting = () => {
    return useContext(SettingContext);
};


export const SettingProvider = ({ children }) => {
    // Initialize theme, language
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'vn');

    // Handle setting changes
    useEffect(() => {
        const applySettings = () => {
          const root = document.getElementsByTagName('body')[0];
          root.className = `${theme} ${language}`;
          localStorage.setItem('theme', theme);
          localStorage.setItem('language', language);
        };
    
        applySettings();
      }, [theme, language]);
    
    const value = {
        theme,
        setTheme,
        language,
        setLanguage,
    };

    return (
        <SettingContext.Provider value={value}>
            {children}
        </SettingContext.Provider>
    );
};

