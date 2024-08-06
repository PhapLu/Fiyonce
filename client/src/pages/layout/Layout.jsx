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

export default function Explore() {
    return (
        <>
            <Navbar />
            <div className='app without-sidebar'>
                <Outlet />
            </div>
        </>
    )
}