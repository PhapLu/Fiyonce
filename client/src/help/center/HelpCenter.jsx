// Imports
import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

// Utils

// Styling
import "./HelpCenter.scss"

export default function HelpCenter() {
    const location = useLocation();
    const [shadow, setShadow] = useState(false);

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
        <div className="help-center">
            {/* Header section */}
            <div className={`navbar ${shadow ? 'with-shadow' : ''}`}>
                <div className={`navbar__blur desktop-hide ${shadow ? 'active' : ''}`}></div>
                <div className="navbar--left">
                    <svg onClick={() => { setShowHamburgerMenu(true) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 lg mr-12 desktop-hide hover-cursor-opacity">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>

                    <Link to="/help-center" >
                        <h2 className="navbar__brand-name">Pastal<span className="highlight-text">&#x2022;</span></h2>
                        {/* <hr className="veritcal-hr" />
                        <h3>Help Center</h3> */}
                    </Link>
                </div>

                <div className="navbar--right">
                    <ul className="navbar-link-container">
                        <li className={`navbar-link-item tablet-hide mobile-hide ` + (location.pathname.split('/').filter(Boolean).length === 0 || location.pathname.includes('/talents') || location.pathname.includes('/commission-services') ? "active" : "")}>
                            <Link to="/">Trở về Pastal</Link>
                        </li>
                        <hr className="navbar__veritcal-hr tablet-hide mobile-hide" />
                        <li className={`navbar-link-item tablet-hide mobile-hide ` + (location.pathname.split('/').filter(Boolean).length === 0 || location.pathname.includes('/talents') || location.pathname.includes('/commission-services') ? "active" : "")}>
                            <Link to="/help-center/for-clients">Dành cho khách hàng</Link>
                        </li>

                        <li className={`navbar-link-item tablet-hide mobile-hide ` + (location.pathname.split('/').filter(Boolean).length === 0 || location.pathname.includes('/talents') || location.pathname.includes('/commission-services') ? "active" : "")}>
                            <Link to="/help-center/for-artists">Dành cho họa sĩ</Link>
                        </li>

                        <li className={`navbar-link-item tablet-hide mobile-hide ` + (location.pathname.split('/').filter(Boolean).length === 0 || location.pathname.includes('/talents') || location.pathname.includes('/commission-services') ? "active" : "")}>
                            <Link to="/help-center/about">Về Pastal</Link>
                        </li>
                    </ul>
                </div>
            </div>


            <div className="theme-container">
                <div className="theme-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                    </svg>
                    Dành cho khách hàng
                </div>

                <div className="theme-item">
                    Dành cho họa sĩ Về Pastal
                </div>

                <div className="theme-item">
                    Về Pastal
                </div>
            </div>

            {/* FAQ section */}
            <section className="faq text-align-center">
                <h1>Các câu hỏi thường gặp</h1>
                <ul className="faq-container">
                    <li className="faq-item">Quy trình đặt và thực hiện commission trên Pastal?</li>
                    <li className="faq-item">Pastal thu những phí nào?</li>
                    <li className="faq-item">Bản đồ tính năng?</li>
                </ul>
            </section>

        </div>

    );
}