import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/auth/AuthContext";

import MenuBar from "../menuBar/MenuBar.jsx";
import Login from "../login/Login";
import ResetPassword from "../resetPassword/ResetPassword"
import Register from "../register/Register";
import RegisterVerification from "../register/RegisterVerification.jsx";
import SetNewPassword from "../setNewPassword/SetNewPassword.jsx";

import AuthenticationImg from "../../assets/img/authentication-img.png";
import "./Auth.scss";
import { useSetting } from "../../contexts/setting/SettingContext.jsx";

export default function Auth() {
    const { userInfo, showMenu, setShowMenu, showLoginForm, showRegisterForm, showResetPasswordForm, showSetNewPasswordForm, setShowLoginForm, setShowRegisterForm, showRegisterVerificationForm, overlayVisible, setOverlayVisible } = useAuth();
    const { theme, setTheme } = useSetting();
    // Toggle display menu
    const menuRef = useRef();

    useEffect(() => {
        let handler = (e) => {
            if (menuRef && menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    return (
        <div className="navbar__authentication flex-align-center">
            {userInfo ? <div className="user md" ref={menuRef}>
                <img src={userInfo.avatar} className="user__avatar" alt="Avatar" onClick={() => {
                    setShowMenu(!showMenu);
                }} />
                {showMenu && <MenuBar />}
            </div>
                : (
                    <>
                        {theme == "light" ? (
                            <button className="btn btn-3 mr-16 icon-only" onClick={() => setTheme('dark')}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                </svg>
                            </button>
                        ) : (
                            <button className="btn btn-3 mr-16 icon-only" onClick={() => setTheme('light')}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" onClick={() => setTheme('light')}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                </svg>
                            </button>
                        )}
                        <button className="btn btn-2 btn-md" onClick={() => { setShowLoginForm(true); setOverlayVisible(true) }}>
                            Đăng nhập
                        </button>
                    </>
                )
            }
            {
                overlayVisible && (
                    <div className={`overlay`} onClick={(e) => { e.stopPropagation() }}>
                        {/* setOverlayVisible(false); setShowRegisterForm(false); setShowRegisterVerificationForm(false)  */}
                        <div className="modal-form type-1 login">
                            <div className="modal-form--left">
                                <img src={AuthenticationImg} className="modal-form__img" alt="Authentication image" />
                                <h2>Pastal</h2>
                                <span className="line"></span>
                                <p>Nền tảng vẽ tranh theo yêu cầu <br />hàng đầu Việt Nam</p>
                                <p className="mt-32">Mỗi giao dịch thành công trên Pastal sẽ trực tiếp đóng góp cải thiện bữa ăn cho trẻ em vùng cao, trồng thêm cây xanh, và tạo sân chơi nuôi dưỡng đam mê hội họa cho các thế hệ họa sĩ tiếp theo.</p>
                                <p className="modal-form__img-reference">sáng tác bởi @re_name</p>
                            </div>
                            <div className="modal-form--right">
                                {showRegisterForm && (
                                    <Register />
                                )}

                                {showLoginForm && (
                                    <Login />
                                )}

                                {showResetPasswordForm && (
                                    <ResetPassword />
                                )}

                            </div>
                        </div>
                    </div>
                )
            }

        </div >
    );
}
