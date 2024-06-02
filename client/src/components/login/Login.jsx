import React, { useState } from "react";
import { useAuth } from "../../contexts/auth/AuthContext";
import Cookies from 'js-cookie';
import axios from 'axios';

import FacebookLogo from "../../assets/img/facebook-logo.png";
import GoogleLogo from "../../assets/img/google-logo.png";
import "../../assets/scss/authentication.scss";
import "./Login.scss";

export default function Login() {
    const [inputs, setInputs] = useState({});
    const {login, showRegisterVerificationForm, setShowLoginForm, setShowRegisterForm, setShowRegisterVerificationForm, overlayVisible,  setOverlayVisible, userInfo, setUserInfo} = useAuth();

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            login(inputs.email, inputs.password);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        

<div className="authentication--right">
<form className="form login-form" onSubmit={handleSubmit}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
        setShowLoginForm(false);
        setOverlayVisible(false);
    }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>

    <h2 className="form__title">Đăng nhập</h2>
    <div className="form-field">
        <label htmlFor="email" className="form-field__label">Email</label>
        <input type="email" id="email" name="email" value={inputs.email || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập email đăng nhập" />
    </div>
    <div className="form-field">
        <label htmlFor="password" className="form-field__label">Mật khẩu</label>
        <input type="password" id="password" name="password" value={inputs.password || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập mật khẩu" />
    </div>
    <div className="form-field">
        <input
            type="submit"
            value="Đăng nhập"
            className="form-field__input btn btn-2 btn-md"
        />
    </div>
</form>
<p className="form__extra-text">
    Chưa có tài khoản?{" "}
    <span className="form__extra-text__link" onClick={() => {
        setShowLoginForm(false);
        setShowRegisterForm(true);
    }}>Đăng kí</span>
    <br />
    <span>Quên mật khẩu</span>
</p>
<br />
<ul className="login-option-container">
    <li className="login-option-item">
        <img src={FacebookLogo} className="login-option-item__img" alt="Facebook logo" />
        Login with Facebook
    </li>
    <li className="login-option-item">
        <img src={GoogleLogo} className="login-option-item__img" alt="Facebook logo" />
        Login with Google
    </li>
</ul>
</div>
    );
}
