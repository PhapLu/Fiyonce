import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import RenderConversations from "../crudConversation/render/RenderConversations";
import RenderConversation from "../crudConversation/render/RenderConversation";
import Auth from "../auth/Auth";
import Logo from "../../assets/img/logo.png";
import './Navbar.scss';
import { useConversation } from "../../contexts/conversation/ConversationContext";
import { useAuth } from "../../contexts/auth/AuthContext";
import { apiUtils } from "../../utils/newRequest";

export default function Navbar() {
    const location = useLocation();
    const {userInfo} = useAuth();
    const [shadow, setShadow] = useState(false);
    const [showRenderConversations, setShowRenderConversations] = useState(false);
    const messageButtonRef = useRef(null);
    const conversationsRef = useRef(null);
    const [unSeenConversations, setUnSeenConversations] = useState(userInfo.unSeenConversations);
    
    const {conversation, setConversation, showRenderConversation , setShowRenderConversation} = useConversation();

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
                messageButtonRef.current && !messageButtonRef.current.contains(event.target) &&
                conversationsRef.current && !conversationsRef.current.contains(event.target) &&
                !event.target.closest('.conversation-item')
            ) {
                setShowRenderConversations(false);
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
            const response = await apiUtils.patch(`/user/updateUserProfile/${userInfo._id}`, {lastViewConversations: Date.now()});
            console.log(response);
        } catch (error) {
            setModalInfo({
                status: "error",
                message: error.response.data.message
            })
        }
    }

    return (
        <>
            <div className={`navbar ${shadow ? 'with-shadow' : ''}`}>
                <div className="navbar--left">
                    <Link to="/explore" className="flex-align-center">
                        <img src={Logo} alt="Logo" className="navbar__brand-logo" />
                        <h3 className="navbar__brand-name">Pastal<span className="highlight-text">&#x2022;</span></h3>
                    </Link>

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
                        <li className={`navbar-link-item ` + (location.pathname.includes('/commission_market') ? "active" : "")}>
                            <Link to="/commission_market">Chợ Commission</Link>
                        </li>
                        <li className={`navbar-link-item ` + (location.pathname.includes('/challenges') ? "active" : "")}>
                            <Link to="/challenges">Thử thách</Link>
                        </li>
                        <hr className="navbar__veritcal-hr" />
                        <div className="mr-8 toggle-display-conversations-btn" ref={messageButtonRef}>
                            <div className="btn btn-3 icon-only" onClick={handleViewConversations}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                </svg>
                                {unSeenConversations?.length > 0 && <span className="noti-dot">{unSeenConversations.length}</span>}
                            </div>
                            {showRenderConversations && (
                                <div ref={conversationsRef}>
                                    <RenderConversations setConversation={setConversation} setShowRenderConversation={setShowRenderConversation} setShowRenderConversations={setShowRenderConversations} />
                                </div>
                            )}
                        </div>
                        <div className="btn btn-3 icon-only mr-16">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>
                        </div>
                        <Auth />
                    </ul>
                </div>
            </div>

            {/* {showRenderConversation && <RenderConversation conversation={conversation} setShowRenderConversation={setShowRenderConversation} />} */}
        </>
    );
}