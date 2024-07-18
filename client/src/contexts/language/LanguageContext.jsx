import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
    return useContext(LanguageContext);
};


export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'vn');
    useEffect(() => {
        const applyLanguage = (selectedLanguage) => {
            const root = document.getElementsByTagName('body')[0];
            root.className = `${selectedLanguage}`;
            localStorage.setItem('language', selectedLanguage);
            () => {
                setLanguage(selectedLanguage);
            }
        };

        applyLanguage(language);

        // const storedLanguage = localStorage.getItem('language');
        // if (storedLanguage) {
        //     setLanguage(storedLanguage);
        //     applyLanguage(storedLanguage);
        // } else {
        //     // Default to system language if no stored preference
        //     const systemLanguage = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        //     setLanguage(systemLanguage);
        //     applyLanguage(systemLanguage);
        // }
    }, [language]);

    

    const value = {
        language,
        setLanguage
        // applyLanguage,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

