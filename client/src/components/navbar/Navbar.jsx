import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { useParams, useLocation, Link } from "react-router-dom";

import Auth from "../auth/Auth";
import Logo from "../../assets/img/logo.png";
import './Navbar.scss';

export default function Navbar() {
    // Check is logged in
    const accessToken = Cookies.get("access-token");
    let isLogged = false;
    if (accessToken) {
        // Request to server 

        isLogged = true;
    }

    const location = useLocation();

    return (
        <div className="navbar">
            <div className="navbar--left">
                <img src={Logo} alt="Logo" className="navbar__brand-logo" />
                <h3 className="navbar__brand-name">Fiyonce</h3>
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
                    <li className="navbar-link-item">
                        <Link to="/marketplace">Mua bán</Link>
                    </li>
                    <li className="navbar-link-item">
                        <Link to="/briefs">Chợ Commission</Link>
                    </li>
                    <li className="navbar-link-item">
                        <Link to="/challenges">Thử thách</Link>
                    </li>
                    <hr className="navbar__veritcal-hr" />
                    <Auth />                    
                </ul>
            </div>
        </div>
    );
}
