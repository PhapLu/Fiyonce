// Imports
import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { useQuery } from "react-query";

// Resources
import Navbar from '../../components/navbar/Navbar.jsx';
import BackToTop from '../../components/backToTop/BackToTop.jsx';

// Utils
import { formatNumber } from "../../utils/formatter.js";

// Styling
import "../../assets/scss/base.scss";
import { useMovement } from '../../contexts/movement/MovementContext.jsx';
import Footer from '../../components/footer/Footer.jsx';
import "./StaticLayout.scss"

export default function StaticLayout() {
    return (
        <div className='static-layout'>
            <Navbar />
            <div className='app without-sidebar static-outlet-content'>
                <Outlet />
            </div>

            <Footer />
        </div>
    )
}