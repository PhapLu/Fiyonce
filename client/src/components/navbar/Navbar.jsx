import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

import Auth from "../auth/Auth";
import Logo from "../../assets/img/logo.png";
import './Navbar.scss';

export default function Navbar() {
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
        <div className={`navbar ${shadow ? 'with-shadow' : ''}`}>
            <div className="navbar--left">
                <Link to="/explore" className="flex-align-center">
                    <img src={Logo} alt="Logo" className="navbar__brand-logo" />
                    <h3 className="navbar__brand-name">Pastal<span className="highlight-text">&#x2022;</span></h3>
                </Link>
                
                <div className="navbar__search-field">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 navbar__search-field__ic">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input type="text" className="navbar__search-field__input form-field__input" placeholder="Tìm kiếm tranh vẽ và họa sĩ" />
                </div>
            </div>

            <div className="navbar--right">
                <ul className="navbar-link-container">
                    <li className={`navbar-link-item ` + (location.pathname.includes('/explore') ? "active" : "")}>
                        <Link to="/explore">Khám phá</Link>
                    </li>
                    {/* <li className={`navbar-link-item ` + (location.pathname.includes('/marketplace') ? "active" : "")}>
                        <Link to="/marketplace">Mua bán</Link>
                    </li> */}
                    <li className={`navbar-link-item ` + (location.pathname.includes('/commission_market') ? "active" : "")}>
                        <Link to="/commission_market">Chợ Commission</Link>
                    </li>
                    <li className={`navbar-link-item ` + (location.pathname.includes('/challenges') ? "active" : "")}>
                        <Link to="/challenges">Thử thách</Link>
                    </li>
                    <hr className="navbar__veritcal-hr" />
                    <Auth />                    
                </ul>
            </div>
        </div>
    );
}
