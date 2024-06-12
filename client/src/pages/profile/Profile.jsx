import "../../assets/scss/base.scss";
import "./Profile.scss";
import React, { useState } from "react";
import { useQuery } from 'react-query';
import { useParams, useLocation, Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { useAuth } from "../../contexts/auth/AuthContext.jsx";
import { Outlet } from "react-router-dom";
import { newRequest, apiUtils } from "../../utils/newRequest.js";
import { formatEmailToName } from "../../utils/formatter.js";

export default function Profile() {
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

    const { data: profileInfo, error, isError, isLoading } = useQuery('fetchProfileById', fetchProfileById, {
        onError: (error) => {
            console.error('Error fetching profile:', error);
        },
        onSuccess: (profileInfo) => {
            console.log(profileInfo);
            if (profileInfo) {
                profileInfo.displayName = formatEmailToName(profileInfo.email);
                console.log('Fetched profile:', profileInfo);
            }
        },
    });

    if (isLoading) {
        return <span>Đang tải...</span>;
    }

    if (isError) {
        return <span>Have an error: {error.message}</span>;
    }

    if (!profileInfo) {
        return <span>No profile information available.</span>;
    }

    return (
        <>
            <Navbar />
            <div className='app with-sidebar'>
                <Sidebar profileInfo={profileInfo} />

                <div className="outlet-content">
                    <div className="profile">
                        <div className="profile__bg">
                            <img
                                src={profileInfo.bg || "https://i.pinimg.com/736x/f9/ad/30/f9ad3071831de9aef6ebe8dd0daf508d.jpg"}
                                alt={`${profileInfo.fullName}'s cover photo`}
                                className={`profile__bg__img ${loading ? "skeleton-img" : ""}`}
                            />
                            <button className="profile__bg__edit-btn btn btn-5" onClick={handleCoverClick}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2.5"
                                    stroke="currentColor"
                                    className="size-6 profile__bg__ic"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.25 15.75L7.409 10.591a2.25 2.25 0 013.182 0L15.75 15.75m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0L22.75 15.75m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zM12.75 8.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                    />
                                </svg>
                                Đổi ảnh nền
                            </button>
                            <input type="file" id="coverPhoto" style={{ display: 'none' }} onChange={handleCoverChange} />
                        </div>
                        <div className="profile-nav-container">
                            <Link
                                to={`/users/${id}/order-history`}
                                className={`profile-nav-item btn btn-md ${location.pathname.includes('/order-history') ? "btn-2" : "btn-3"}`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6 profile-nav-item__ic"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                    />
                                </svg>
                                <span>Đơn hàng của tôi</span>
                            </Link>
                            <Link
                                to={`/users/${id}/basic-info`}
                                className={`profile-nav-item btn btn-md ${location.pathname.includes('/basic-info') ? "btn-2" : "btn-3"}`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6 profile-nav-item__ic"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                    />
                                </svg>
                                <span>Thông tin cơ bản</span>
                            </Link>
                        </div>
                    </div>
                    <Outlet context={profileInfo} />
                </div>
            </div>
        </>
    );
}
