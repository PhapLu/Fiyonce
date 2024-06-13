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

export default function Auth() {
    const { userInfo, showMenu, setShowMenu, showLoginForm, showRegisterForm, showResetPasswordForm, showSetNewPasswordForm, setShowLoginForm, setShowRegisterForm, showRegisterVerificationForm, overlayVisible, setOverlayVisible } = useAuth();

    // Toggle display menu
    const menuRef = useRef();

    // useEffect(() => {
    //     setShowRegisterForm(false);
    //     setShowRegisterVerificationForm(false);
    //     setOverlayVisible(false);
    // }, [])

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
        <div className="navbar__authentication">
            {userInfo ? <div className="user" ref={menuRef}>
                <img src={userInfo.avatar} className="user__avatar" alt="Avatar" onClick={() => {
                    setShowMenu(!showMenu);
                }} />
                {showMenu && <MenuBar />}
            </div>
                : <button className="btn btn-2 btn-md" onClick={() => { setShowLoginForm(true); setOverlayVisible(true) }}>
                    Đăng nhập
                </button>}
            {
                overlayVisible && (
                    <div className={`overlay`} onClick={(e) => { e.stopPropagation() }}>
                        {/* setOverlayVisible(false); setShowRegisterForm(false); setShowRegisterVerificationForm(false)  */}
                        <div className="modal-form type-1 login">
                            <div className="modal-form--left">
                                <img src={AuthenticationImg} className="modal-form__img" alt="Authentication image" />
                                <h2>Fiyonce</h2>
                                <span className="line"></span>
                                <p>Nền tảng vẽ tranh theo yêu cầu <br />hàng đầu Việt Nam</p>
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <p>Mỗi giao dịch thành công trên Fiyonce sẽ trực tiếp đóng góp cải thiện bữa ăn cho trẻ em vùng cao, trồng thêm cây xanh, và tạo sân chơi nuôi dưỡng đam mê hội họa cho các thế hệ họa sĩ tiếp theo.</p>
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

        </div>
    );
}
