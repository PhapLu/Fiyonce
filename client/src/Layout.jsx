import "./assets/scss/base.scss";
import "./assets/scss/quil.scss";
import React, { useState } from "react";
import { useQuery } from 'react-query';
import { useParams, useLocation, Link } from "react-router-dom";
import { newRequest } from "./utils/newRequest.js";
import Navbar from "./components/navbar/Navbar";
import profileSidebar from "./profile/profileSidebar/ProfileSidebar";
import { useAuth } from "./contexts/auth/AuthContext.jsx";
import { Outlet } from "react-router-dom";
import { apiUtils } from "./utils/newRequest.js";
import { formatEmailToName } from "./utils/formatter.js";

export default function Layout() {
    return (
        <>
            <Navbar />
            <div className='app without-sidebar'>

                <div className="outlet-content">
                    <Outlet />
                </div>
            </div>
        </>
    );
}
