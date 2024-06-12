import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
};


export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme);
            applyTheme(storedTheme);
        } else {
            // Default to system theme if no stored preference
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            setTheme(systemTheme);
            applyTheme(systemTheme);
        }
    }, []);

    const applyTheme = (selectedTheme) => {
        const root = document.getElementsByTagName('body')[0];
        root.className = selectedTheme;
        localStorage.setItem('theme', selectedTheme);
        () => {
            setTheme(selectedTheme);
        }
    };

    const value = {
        theme,
        setTheme,
        applyTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

