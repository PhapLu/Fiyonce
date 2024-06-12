import "./assets/scss/base.scss";
import React, { useState } from "react";
import { useQuery } from 'react-query';
import { useParams, useLocation, Link } from "react-router-dom";
import { newRequest } from "./utils/newRequest.js";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import { useAuth } from "./contexts/auth/AuthContext.jsx";
import { Outlet } from "react-router-dom";
import { apiUtils } from "./utils/newRequest.js";
import { formatEmailToName } from "./utils/formatter.js";

export default function Layout() {
    const [profileBtnActive, setProfileNavActive] = useState(null);
    const { userInfo, setUserInfo } = useAuth();
    const [loading, setLoading] = useState(false);
    const handleCoverClick = () => {
        document.getElementById('coverPhoto').click();
    };

    const handleCoverChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', "cover");

        if (file) {
            setLoading(true);

            try {
                const response = await apiUtils.post(`upload/profile/avatarOrCover/${userInfo._id}`, formData);
                console.log(response);
                if (response.data.metadata.image_url) {
                    setUserInfo({ ...userInfo, bg: response.data.metadata.image_url });
                    profileInfo.bg = response.data.metadata.image_url;
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const { id } = useParams();
    const location = useLocation();

    const fetchProfileById = async () => {
        try {
            const response = await newRequest.get(`user/readUserProfile/${id}`);
            console.log(response);
            return response.data.metadata.user;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

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
