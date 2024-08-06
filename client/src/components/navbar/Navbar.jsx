import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import RenderConversations from "../crudConversation/render/RenderConversations";
import RenderNotifications from "../crudNotification/render/RenderNotifications";
import Auth from "../auth/Auth";
import Logo from "../../assets/img/logo.png";
import './Navbar.scss';
import { useConversation } from "../../contexts/conversation/ConversationContext";
import { useAuth } from "../../contexts/auth/AuthContext";
import { apiUtils } from "../../utils/newRequest";
import { resizeImageUrl } from "../../utils/imageDisplayer";

export default function Navbar() {
    const location = useLocation();
    const { userInfo, socket } = useAuth();
    const [shadow, setShadow] = useState(false);
    const [showRenderConversations, setShowRenderConversations] = useState(false);
    const [showRenderNotifications, setShowRenderNotifications] = useState(false);
    const messageButtonRef = useRef(null);
    const conversationsRef = useRef(null);
    const notificationBtnRef = useRef(null);
    const [unSeenConversations, setUnSeenConversations] = useState(userInfo?.unSeenConversations);
    const [unSeenNotifications, setUnSeenNotifications] = useState(userInfo?.unSeenNotifications);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchFieldRef = useRef(null);

    const history = useNavigate();
    const handleSearchTermChange = async (e) => {
        const searchTerm = e.target.value;
        setQuery(searchTerm);

        if (searchTerm) {
            try {
                const response = await apiUtils.get(`/recommender/search?searchTerm=${searchTerm}`);
                const userSearchResults = response.data.metadata.userResults;
                console.log(userSearchResults);
                setSearchResults({ users: userSearchResults });
            } catch (error) {
                console.log(error);
            }
        }
    }


    const handleSearch = async (e) => {
        e.preventDefault();
        // history.push(`/search?query=${query}`);
    };

    console.log(unSeenConversations);
    const { conversation, setConversation, showRenderConversation, setShowRenderConversation } = useConversation();

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                (messageButtonRef.current && !messageButtonRef.current.contains(event.target) &&
                    conversationsRef.current && !conversationsRef.current.contains(event.target) &&
                    !event.target.closest('.conversation-item')) ||
                (notificationBtnRef.current && !notificationBtnRef.current.contains(event.target) &&
                    !event.target.closest('.conversation-item'))
            ) {
                setShowRenderConversations(false);
                setShowRenderNotifications(false);
            }
            if (searchFieldRef.current && !searchFieldRef.current.contains(event.target) &&
                !event.target.closest('.search-result-container')) {
                setIsSearchFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleViewConversations = async () => {
        setUnSeenConversations([]);
        setShowRenderConversations(true);

        try {
            const response = await apiUtils.patch(`/user/updateProfile/${userInfo?._id}`, { lastViewConversations: Date.now() });
        } catch (error) {
            setModalInfo({
                status: "error",
                message: error.response.data.message
            });
        }
    }

    useEffect(() => {
        if (userInfo && socket) {
            socket.on('getMessage', (newMessage) => {
                console.log("NEW MESSAGE");
                console.log(newMessage);
                console.log(unSeenConversations);
                const conversationIndex = unSeenConversations.findIndex(convo => convo._id === newMessage.conversationId);
                console.log(conversationIndex);

                if (conversationIndex === -1) {
                    setUnSeenConversations(prev => [...prev, { _id: newMessage.conversationId }]);
                }
            });

            return () => {
                socket.off('getMessage');
                socket.emit('removeUser', userInfo?._id);
            };
        }
    }, [unSeenConversations, userInfo?._id, socket]);

    useEffect(() => {
        if (userInfo && socket) {
            socket.on('getNotification', (newNotification) => {
                if (unSeenNotifications.findIndex(convo => convo._id === newNotification._id) === -1) {
                    setUnSeenNotifications(prev => [...prev, { _id: newNotification._id }]);
                }
            });

            return () => {
                socket.off('getNotification');
                socket.emit('removeUser', userInfo?._id);
            };
        }
    }, [unSeenNotifications, userInfo?._id, socket]);

    const handleViewNotifications = async () => {
        setUnSeenNotifications([]);
        setShowRenderNotifications(true);
    }

    const [showHamburgerMenu, setShowHamburgerMenu] = useState();


    return (
        <>
            <div className={`navbar ${shadow ? 'with-shadow' : ''}`}>
                <div className="navbar--left">
                    <svg onClick={() => { setShowHamburgerMenu(true) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 lg mr-12 desktop-hide hover-cursor-opacity">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>

                    <div className={`desktop-hide ${showHamburgerMenu ? "overlay" : ""}`} onClick={() => { setShowHamburgerMenu(false) }}>
                        <ul onClick={(e) => { e.stopPropagation() }} className={`hamburger-menu-container ${showHamburgerMenu ? "active" : ""}`}>
                            <svg onClick={() => { setShowHamburgerMenu(false) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 lg mr-8 ml-8 mb-12 desktop-hide hover-cursor-opacity">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                            <Link to="/" className={`hamburger-menu-item gray-bg-hover ${location.pathname.split('/').filter(Boolean).length === 0 || location.pathname.includes('/talents') || location.pathname.includes('/commission-services') ? "active" : ""}`}>
                                Khám phá
                            </Link>
                            <Link to="/commission-market" className={`hamburger-menu-item gray-bg-hover` + (location.pathname.includes('/commission-market') ? "active" : "")}>
                                Chợ Commission
                            </Link>
                            <Link to="/challenges" className={`hamburger-menu-item gray-bg-hover` + (location.pathname.includes('/challenges') ? "active" : "")}>
                                Thử thách
                            </Link>

                            <hr className="mt-8 mb-8" />
                            <Link to="/challenges" className={`hamburger-menu-item gray-bg-hover` + (location.pathname.includes('/challenges') ? "active" : "")}>
                                Về Pastal
                            </Link>
                            <Link className={`hamburger-menu-item gray-bg-hover` + (location.pathname.includes('/challenges') ? "active" : "")}>
                                Trung tâm trợ giúp
                            </Link>
                            <Link className={`hamburger-menu-item gray-bg-hover` + (location.pathname.includes('/challenges') ? "active" : "")}>
                                Chính sách
                            </Link>
                            <Link className={`hamburger-menu-item gray-bg-hover` + (location.pathname.includes('/challenges') ? "active" : "")}>
                                Điều khoản
                            </Link>
                        </ul>
                    </div>

                    <Link to="/" className="flex-align-center">
                        {/* <img src={Logo} alt="Logo" className="navbar__brand-logo" /> */}
                        <h2 className="navbar__brand-name">Pastal<span className="highlight-text">&#x2022;</span></h2>
                    </Link>

                    <form className="navbar__search-field" onSubmit={handleSearch} ref={searchFieldRef}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 navbar__search-field__ic">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <input
                            type="text"
                            className="navbar__search-field__input form-field__input"
                            onChange={handleSearchTermChange}
                            onFocus={() => setIsSearchFocused(true)}
                            placeholder="Tìm kiếm tranh vẽ và họa sĩ"
                        />
                        {isSearchFocused && searchResults?.users?.length > 0 && (
                            <div className="search-result-container">
                                <h4 className="p-4">Họa sĩ <span className="ml-4 p-4 fs-12 bg-gray-1 fw-500 br-8">{searchResults?.users?.length}</span></h4>
                                <hr />
                                {searchResults?.users?.slice(0, 5).map((user, index) => {
                                    return (
                                        <Link to={`/users/${user._id}/profile-commission-services`} key={index} className="search-result-item user sm gray-bg-hover">
                                            <div className="user--left">
                                                <img src={resizeImageUrl(user.avatar, 50)} alt="" className="user__avatar" />
                                                <div className="user__name flex-align-center">
                                                    <div className="user__name__title fw-600">{user?.fullName}</div>
                                                    {
                                                        user?.jobTitle ?
                                                            <>
                                                                <span className="dot-delimiter sm"></span>
                                                                <span className="fs-14">{user?.jobTitle}</span>
                                                            </>
                                                            : user?.stageName ?
                                                                <>
                                                                    <span className="dot-delimiter sm"></span>
                                                                    <span className="fs-14">{user?.stageName}</span>
                                                                </> :
                                                                <span></span>
                                                    }
                                                </div>
                                            </div>
                                            <div className="user--right flex-align-center">
                                                {/* <span className="mr-4">{user?.fullName}</span> */}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </form>
                </div>

                <div className="navbar--right">
                    <ul className="navbar-link-container">
                        <li className={`navbar-link-item ` + (location.pathname.split('/').filter(Boolean).length === 0 || location.pathname.includes('/talents') || location.pathname.includes('/commission-services') ? "active" : "")}>
                            <Link to="/">Khám phá</Link>
                        </li>
                        <li className={`navbar-link-item ` + (location.pathname.includes('/commission-market') ? "active" : "")}>
                            <Link to="/commission-market">Chợ Commission</Link>
                        </li>
                        <li className={`navbar-link-item ` + (location.pathname.includes('/challenges') ? "active" : "")}>
                            <Link to="/challenges">Thử thách</Link>
                        </li>
                        <hr className="navbar__veritcal-hr tablet-hide" />
                        {userInfo && (
                            <>
                                <div className="mr-8 toggle-display-conversations-btn" ref={messageButtonRef}>
                                    <div className="btn btn-3 icon-only" onClick={handleViewConversations}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                        </svg>
                                        {unSeenConversations?.length > 0 && <span className="noti-dot">{unSeenConversations?.length < 20 ? unSeenConversations?.length : "20+"}</span>}
                                    </div>
                                    {showRenderConversations && (
                                        <div ref={conversationsRef}>
                                            <RenderConversations setConversation={setConversation} setShowRenderConversation={setShowRenderConversation} setShowRenderConversations={setShowRenderConversations} />
                                        </div>
                                    )}
                                </div>
                                <div className="icon-only toggle-display-notifications-btn mr-16" ref={notificationBtnRef}>
                                    <div className="btn btn-3 icon-only" onClick={handleViewNotifications}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                        </svg>
                                    </div>
                                    {unSeenNotifications?.length > 0 && <span className="noti-dot">{unSeenNotifications?.length < 20 ? unSeenNotifications?.length : "20+"}</span>}
                                    {showRenderNotifications && (
                                        <div ref={conversationsRef}>
                                            <RenderNotifications setShowRenderNotifications={setShowRenderNotifications} />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        <Auth />
                    </ul>
                </div>
            </div>
        </>
    );
}