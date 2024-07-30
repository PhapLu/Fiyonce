import { useState, useEffect } from "react";
import { useQuery } from 'react-query';
import { useParams, useLocation, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../contexts/auth/AuthContext.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import ProfileSidebar from "../profileSidebar/ProfileSidebar";
import { newRequest, apiUtils } from "../../utils/newRequest.js";
import "./ProfileLayout.scss";

export default function ProfileLayout() {
    const [profileBtnActive, setProfileNavActive] = useState(null);
    const { userInfo, setUserInfo } = useAuth();
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();
    const [profileInfo, setProfileInfo] = useState();
    const isProfileOwner = userInfo && userInfo?._id === userId;

    const handleCoverClick = () => {
        document.getElementById('coverPhoto').click();
    };

    const handleCoverChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', "bg");

        if (file) {
            setLoading(true);
            console.log(formData.get('file'));
            console.log(userInfo?._id);

            try {
                const response = await apiUtils.post(`/upload/profile/avatarOrCover/${userInfo?._id}`, formData);
                console.log(response);
                if (response.data.metadata.image_url) {
                    setProfileInfo((prev) => ({ ...prev, bg: response.data.metadata.image_url }));
                    // setUserInfo({ ...userInfo, bg: response.data.metadata.image_url });
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const location = useLocation();

    const fetchProfileById = async () => {
        try {
            const response = await newRequest.get(`/user/readUserProfile/${userId}`);
            console.log(response);
            return response.data.metadata.user;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const { data, error, isError, isLoading } = useQuery(['fetchProfileById', userId], fetchProfileById, {
        onError: (error) => {
            console.error('Error fetching profile:', error);
        },
        onSuccess: (data) => {
            if (data) {
                console.log('Fetched profile:', data);
                setProfileInfo(data)
            }
        },
    });

    useEffect(() => {
        setProfileInfo(data);
    }, [data, userId]);

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
                <ProfileSidebar profileInfo={profileInfo} setProfileInfo={setProfileInfo} />
                <div className="outlet-content">
                    <div className="profile">
                        <div className="profile__bg">
                            <img
                                src={profileInfo.bg || "/uploads/pastal_system_default_background.png"}
                                alt={`${profileInfo.fullName}'s cover photo`}
                                className={`tablet-hide mobile-hide profile__bg__img ${loading ? "skeleton-img" : ""}`}
                            />
                            {
                                isProfileOwner && (
                                    <>
                                        <button className="profile__bg__edit-btn btn btn-md" onClick={handleCoverClick}>
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
                                    </>
                                )
                            }

                        </div>
                        <div className="sub-nav-container">
                            <div className="sub-nav-container--left">
                                {
                                    isProfileOwner ? (userInfo?.role == "talent" && (
                                        <>
                                            <Link
                                                to={`/users/${userId}/profile-commission-services`}
                                                className={`sub-nav-item btn ${location.pathname.includes('/profile-commission-services') ? "active" : ""}`}
                                            >
                                                Dịch vụ
                                            </Link>
                                            <Link
                                                to={`/users/${userId}/profile-posts`}
                                                className={`sub-nav-item btn ${location.pathname.includes('/profile-posts') ? "active" : ""}`}
                                            >
                                                Tác phẩm
                                            </Link>
                                        </>
                                    )) : (
                                        <>
                                            <Link
                                                to={`/users/${userId}/profile-commission-services`}
                                                className={`sub-nav-item btn ${location.pathname.includes('/profile-commission-services') ? "active" : ""}`}
                                            >
                                                Dịch vụ
                                            </Link>
                                            <Link
                                                to={`/users/${userId}/profile-posts`}
                                                className={`sub-nav-item btn ${location.pathname.includes('/profile-posts') ? "active" : ""}`}
                                            >
                                                Tác phẩm
                                            </Link>
                                        </>
                                    )
                                }

                                {
                                    isProfileOwner &&
                                    (
                                        <>
                                            <Link
                                                to={`/users/${userId}/order-history`}
                                                className={`sub-nav-item btn ${location.pathname.includes('/order-history') ? "active" : ""}`}
                                            >
                                                Đơn hàng
                                            </Link>

                                            <Link
                                                to={`/users/${userId}/basic-info`}
                                                className={`sub-nav-item btn ${location.pathname.includes('/basic-info') ? "active" : ""}`}
                                            >
                                                Thông tin cơ bản
                                            </Link>
                                        </>
                                    )
                                }
                            </div>

                            <div className="sub-nav-container--right">
                            </div>
                        </div>
                        <hr />
                    </div>
                    <Outlet context={{ profileInfo, setProfileInfo }} />
                </div>
            </div>
        </>
    );
}
