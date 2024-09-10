// Imports
import { Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";

// Contexts
import { useSetting } from "../../contexts/setting/SettingContext.jsx";

// Styling
import "./HelpNavbar.scss";

export default function HelpNavbar() {
    const [shadow, setShadow] = useState(false);
    const { theme, setTheme } = useSetting();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setShadow(true);
            } else {
                setShadow(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`help navbar ${shadow ? 'with-shadow' : ''}`}>
            <div className={`navbar__blur desktop-hide ${shadow ? 'active' : ''}`}></div>
            <div className="navbar--left">
                <svg onClick={() => { setShowHamburgerMenu(true) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 lg mr-12 desktop-hide hover-cursor-opacity">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>

                <Link to="/help-center" className="flex-align-center">
                    <h2 className="navbar__brand-name">Pastal<span className="highlight-text">&#x2022;</span></h2>
                    <hr className="vertical-hr" />
                    <h4>Trung tâm trợ giúp</h4>
                    {/* <hr className="veritcal-hr" />
                        <h3>Help Center</h3> */}
                </Link>
            </div>

            <div className="navbar--right flex-align-center">
                {theme == "light" ? (
                    <button className="btn btn-7 btn-round mr-16 icon-only" onClick={() => setTheme('dark')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                        </svg>
                    </button>
                ) : (
                    <button className="btn btn-7 btn-round mr-16 icon-only" onClick={() => setTheme('light')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6" onClick={() => setTheme('light')}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                        </svg>
                    </button>
                )}

                <Link to="/" className="btn btn-md btn-2 br-16 text-align-center back-to-home-btn">Trở về Pastal</Link>
            </div>
        </div>
    )
}