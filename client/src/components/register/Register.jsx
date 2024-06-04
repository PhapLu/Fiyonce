import React, { useState } from "react";
import { useAuth } from "../../contexts/auth/AuthContext";
import Cookies from 'js-cookie';
import { apiUtils } from "../../utils/newRequest";
import RegisterVerification from "./RegisterVerification";

import AuthenticationImg from "../../assets/img/authentication-img.png";
import FacebookLogo from "../../assets/img/facebook-logo.png";
import GoogleLogo from "../../assets/img/google-logo.png";
import "../../assets/scss/authentication.scss";
import "./Register.scss";

export default function Register() {
    const [inputs, setInputs] = useState({});
    const { setShowLoginForm, setShowRegisterForm, setOverlayVisible, showRegisterVerificationForm, setShowRegisterVerificationForm } = useAuth();
    const [registerEmail, setRegisterEmail] = useState();

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setOverlayVisible(true);
        inputs.role = "client";
        const { confirm_password, ...others } = inputs;

        // Validate user inputs0
        try {
            console.log()
            const response = await apiUtils.post("/access/users/signUp", inputs);
            console.log(response);
            if (response) {
                setShowRegisterVerificationForm(true);
                setRegisterEmail(response.data.metadata.email);
            }
        } catch (error) {
            console.log(error.response);
        }

    };

    return (
        <div className="authentication--right">
            {showRegisterVerificationForm ? <RegisterVerification handleRegisterSubmit={handleSubmit} registerInfo={inputs} registerEmail={registerEmail} /> :
                (
                    <>
                        <form className="form register-form" onSubmit={handleSubmit}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                                setShowRegisterForm(false);
                                setOverlayVisible(false);
                            }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>

                            <h2 className="form__title">Đăng kí</h2>
                            <div className="form-field">
                                <label htmlFor="email" className="form-field__label">Email</label>
                                <input type="email" id="email" name="email" value={inputs.email || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập email đăng nhập" />
                            </div>
                            <div className="form-field">
                                <label htmlFor="password" className="form-field__label">Mật khẩu</label>
                                <input type="password" id="password" name="password" value={inputs.password || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập mật khẩu" />
                            </div>
                            <div className="form-field">
                                <label htmlFor="confirm_password" className="form-field__label">Xác nhận mật khẩu</label>
                                <input type="password" id="confirm_password" name="confirm_password" value={inputs.confirm_password || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập lại mật khẩu" />
                            </div>
                            <div className="form-field">
                                <label htmlFor="fullName" className="form-field__label">Họ và tên</label>
                                <input type="fullName" id="fullName" name="fullName" value={inputs.fullName || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập họ và tên" />
                            </div>
                            <div className="form-field">
                                <input
                                    type="submit"
                                    value="Tiếp tục"
                                    className="form-field__input btn btn-2 btn-md"
                                />
                            </div>
                        </form>
                        <p className="form__extra-text">
                            Đã có tài khoản?{" "}
                            <span className="form__extra-text__link" onClick={() => {
                                setShowRegisterForm(false);
                                setShowLoginForm(true);
                            }}>Đăng nhập</span>
                        </p>
                    </>
                )}
        </div>
    );
}
