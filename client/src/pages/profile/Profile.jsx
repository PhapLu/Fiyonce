// Imports
import { useState } from "react";
import { useQuery } from 'react-query';
import { useParams, useLocation, Outlet, Link } from "react-router-dom";

// Resources
import { useAuth } from "../../contexts/auth/AuthContext.jsx";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";

// Utils
import { newRequest, apiUtils } from "../../utils/newRequest.js";
import { formatEmailToName, limitString } from "../../utils/formatter.js";

// Styling
import "./Profile.scss";

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
        formData.append('type', "bg");

        if (file) {
            setLoading(true);
            console.log(formData.get('file'));
            console.log(userInfo._id);

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

    const { userId } = useParams();
    const location = useLocation();

    const fetchProfileById = async () => {
        try {
            const response = await newRequest.get(`user/readUserProfile/${userId}`);
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
            if (profileInfo) {
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
                                src={profileInfo.bg || "/uploads/pastal_system_default_background.png"}
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
                        <div className="sub-nav-container">
                            <div className="sub-nav-container--left">
                                {profileInfo.role === "talent" && (
                                    <>
                                        <Link
                                            to={`/users/${userId}/profile_commission_services`}
                                            className={`sub-nav-item btn ${location.pathname.includes('/profile_commission_services') ? "active" : ""}`}
                                        >
                                            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 sub-nav-item__ic">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                            </svg> */}
                                            <span>Dịch vụ</span>
                                        </Link>
                                        <Link
                                            to={`/users/${userId}/profile_artworks`}
                                            className={`sub-nav-item btn ${location.pathname.includes('/profile_artworks') ? "active" : ""}`}
                                        >
                                            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 sub-nav-item__ic">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
                                            </svg> */}
                                            <span>Tác phẩm</span>
                                        </Link>
                                    </>
                                )}
                                <Link
                                    to={`/users/${userId}/order-history`}
                                    className={`sub-nav-item btn ${location.pathname.includes('/order-history') ? "active" : ""}`}
                                >
                                    {/* <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-6 sub-nav-item__ic"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                        />
                                    </svg> */}
                                    <span>Đơn hàng của tôi</span>
                                </Link>
                                <Link
                                    to={`/users/${userId}/basic-info`}
                                    className={`sub-nav-item btn ${location.pathname.includes('/basic-info') ? "active" : ""}`}
                                >
                                    {/* <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-6 sub-nav-item__ic"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                        />
                                    </svg> */}
                                    <span>Thông tin cơ bản</span>
                                </Link>
                            </div>

                            <div className="sub-nav-container--right">
                            </div>
                        </div>
                        <hr />

                    </div>
                    <Outlet context={profileInfo} />
                </div>
            </div>
        </>
    );
}
