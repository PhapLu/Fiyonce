// Imports
import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";


// Contexts
import { useAuth } from "../../contexts/auth/AuthContext.jsx";
import { useConversation } from "../../contexts/conversation/ConversationContext.jsx";

// Components
import Auth from "../auth/Auth";
import CreateBugReport from "../crudBugReport/create/CreateBugReport.jsx"
import RenderConversations from "../crudConversation/render/RenderConversations.jsx";
import RenderNotifications from "../crudNotification/render/RenderNotifications.jsx";

// Utils
import { apiUtils } from "../../utils/newRequest";
import { resizeImageUrl } from "../../utils/imageDisplayer";

// Styling
import LogoLightTheme from "../../assets/img/logo-light-theme.png";
import './Navbar.scss';

export default function Navbar() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const {showRenderConversations, setShowRenderConversations} = useConversation();
    const queryTerm = queryParams.get('q') || '';
    const { userInfo, socket } = useAuth();
    const [shadow, setShadow] = useState(false);
    const [showRenderNotifications, setShowRenderNotifications] = useState(false);
    const messageButtonRef = useRef(null);
    const conversationsRef = useRef(null);
    const notificationBtnRef = useRef(null);
    const [unSeenConversations, setUnSeenConversations] = useState(userInfo?.unSeenConversations);
    const [unSeenNotifications, setUnSeenNotifications] = useState(userInfo?.unSeenNotifications);
    const [query, setQuery] = useState(queryTerm);
    const [searchResults, setSearchResults] = useState();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchFieldRef = useRef(null);
    const [showLabel, setShowLabel] = useState(false);

    const navigate = useNavigate();
    const handleSearchTermChange = async (e) => {
        const searchTerm = e.target.value;
        setQuery(searchTerm);

        if (searchTerm) {
            try {
                const response = await apiUtils.get(`/recommender/search?searchTerm=${searchTerm}`);
                const userSearchResults = response.data.metadata.userResults;
                setSearchResults({ users: userSearchResults });
            } catch (error) {
                console.log(error);
            }
        }
    }


    const handleSearch = async (e) => {
        e.preventDefault();
        navigate(`/search?q=${query}`);
    };

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
            if (conversationsRef.current && !conversationsRef.current.contains(event.target) &&
                messageButtonRef.current && !messageButtonRef.current.contains(event.target)) {
                setShowRenderConversations(false);
            }

            if (notificationBtnRef.current && !notificationBtnRef.current.contains(event.target) &&
                !event.target.closest('.toggle-display-notifications-btn')) {
                setShowRenderNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleClickOutsideSearch = (event) => {
            if (searchFieldRef.current && !searchFieldRef.current.contains(event.target)) {
                setIsSearchFocused(false);
                setIsSearchExpanded(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutsideSearch);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideSearch);
        };
    }, []);



    const handleViewConversations = async () => {
        setUnSeenConversations([]);
        if (!showRenderConversations) {
            setShowRenderNotifications(false);
        }
        setShowRenderConversations(prevState => !prevState);

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
                const conversationIndex = unSeenConversations.findIndex(convo => convo._id === newMessage.conversationId);

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
        if (!showRenderNotifications) {
            setShowRenderConversations(false);
        }
        setShowRenderNotifications(prevState => !prevState);
    }

    const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

    const [overlayVisible, setOverlayVisible] = useState(false);
    const [showCreateBugReport, setShowCreateBugReport] = useState(false);

    const [isSearchExpanded, setIsSearchExpanded] = useState(false); // New state

    const handleSearchIconClick = () => {
        setIsSearchExpanded(prevState => !prevState); // Toggle search field
    };

    return (
        <>
            <div className={`navbar ${shadow ? 'with-shadow' : ''}`}>
                <div className="navbar--left">
                    {
                        !isSearchExpanded && (
                            <>
                                <div className="hamburger-btn">
                                    <svg onClick={() => { setShowHamburgerMenu(true) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 lg mr-8 desktop-hide hover-cursor-opacity">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                </div>

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
                                    <img src={LogoLightTheme} alt="Logo" className="navbar__brand-logo desktop-hide tablet-hide" />
                                    <h2 className="navbar__brand-name mobile-hide">Pastal<span className="highlight-text">&#x2022;</span></h2>
                                </Link>
                            </>
                        )
                    }


                    <form className={`navbar__search-field ${isSearchExpanded ? "expanded" : ""}`} onSubmit={handleSearch} ref={searchFieldRef}>
                        <div className="btn navbar__search-field__ic icon-only" onClick={handleSearchIconClick} >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>

                        <input
                            type="text"
                            className="navbar__search-field__input form-field__input"
                            value={query || ""}
                            onChange={handleSearchTermChange}
                            onFocus={() => setIsSearchFocused(true)}
                            placeholder="Tìm kiếm tranh vẽ và họa sĩ"
                        />
                        {
                            isSearchFocused && query.length > 0 && (
                                <div className="search-result-container">
                                    {searchResults?.users?.length > 0 ? (
                                        <>
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
                                        </>
                                    ) : (
                                        <Link to={`/search?q=${query}`} className="search-result-item flex-align-center fw-bold gray-bg-hover">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 mr-8">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                            </svg>
                                            {query}
                                        </Link>
                                    )}
                                </div>)
                        }
                    </form>
                </div >

                <div className="navbar--right">
                    <ul className="navbar-link-container">
                        <li className={`navbar-link-item tablet-hide mobile-hide ` + (location.pathname.split('/').filter(Boolean).length === 0 || location.pathname.includes('/talents') || location.pathname.includes('/commission-services') ? "active" : "")}>
                            <Link to="/">Khám phá</Link>
                        </li>
                        <li className={`navbar-link-item tablet-hide mobile-hide ` + (location.pathname.includes('/commission-market') ? "active" : "")}>
                            <Link to="/commission-market">Chợ Commission</Link>
                        </li>
                        <li className={`navbar-link-item tablet-hide mobile-hide ` + (location.pathname.includes('/challenges') ? "active" : "")}>
                            <Link to="/challenges">Thử thách</Link>
                        </li>
                        <hr className="navbar__veritcal-hr tablet-hide mobile-hide" />
                        {userInfo && (
                            <>
                                <div className={`toggle-display-conversations-btn hover-display-label bottom ${showRenderConversations ? 'hide-label' : ''}`} ref={messageButtonRef}
                                    onMouseEnter={() => setShowLabel(true)}
                                    onMouseLeave={() => setShowLabel(false)} aria-label="Tin nhắn">
                                    <div className={`btn btn-7 icon-only ${showRenderConversations && "active"}`} onClick={handleViewConversations}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                        </svg>
                                        {unSeenConversations?.length > 0 && <span className="noti-dot">{unSeenConversations?.length < 20 ? unSeenConversations?.length : "20+"}</span>}
                                    </div>
                                    {showRenderConversations && (
                                        <div ref={conversationsRef}>
                                            <RenderConversations />
                                        </div>
                                    )}
                                </div>
                                <div className={`icon-only toggle-display-notifications-btn hover-display-label bottom ${showRenderNotifications ? 'hide-label' : ''}`} ref={notificationBtnRef} aria-label="Thông báo">
                                    <div className={`btn btn-7 icon-only ${showRenderNotifications && "active"}`} onClick={handleViewNotifications}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="size-6">
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

                                {/* <div className="icon-only toggle-display-bug-report-btn mr-8 hover-display-label bottom mobile-hide" ref={notificationBtnRef} aria-label="Báo cáo sự cố">
                                    <div className={`btn btn-7 icon-only ${showCreateBugReport && "active"}`} onClick={() => { setShowCreateBugReport(true), setOverlayVisible(true), setShowRenderConversations(false), setShowRenderNotifications(false) }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                                        </svg>
                                    </div>
                                </div> */}
                            </>
                        )}
                        <Auth />
                    </ul>
                </div>
            </div >

            {overlayVisible &&
                <div className="overlay">
                    {showCreateBugReport && <CreateBugReport setShowCreateBugReport={setShowCreateBugReport} setOverlayVisible={setOverlayVisible} />}
                </div>
            }
        </>
    );
}