import React, { useState } from "react";
import { useAuth } from "../../contexts/auth/AuthContext";
import Cookies from 'js-cookie';
import axios from 'axios';

import AuthenticationImg from "../../assets/img/authentication-img.png";
import FacebookLogo from "../../assets/img/facebook-logo.png";
import GoogleLogo from "../../assets/img/google-logo.png";
import "../../assets/scss/authentication.scss";
import "./Register.scss";

export default function RegisterVerification() {
    const [inputs, setInputs] = useState({});
    const { showRegisterVerificationForm, setShowLoginForm, setShowRegisterForm, setShowRegisterVerificationForm, overlayVisible,  setOverlayVisible} = useAuth();

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setOverlayVisible(true);
        inputs.role = "member";
        const { confirm_password, ...others } = inputs;
        // const response = await axios.post("", others);
        const response = { data: true, status: 200 };
        if (response.status === 200) {
            console.log("Verification successful");
            // Redirect or update UI based on successful verification
            setShowRegisterForm(false);
            // setShowLoginForm(true);
        } else {
            console.log("Verification failed");
            // Handle verification failure
        }
    };

    return (
        <form className="form verify-registration-form">

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowRegisterForm(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <h2 className="form__title">Đăng kí</h2>
            <p>Fiyonce vừa gửi mã xác nhận đến email của bạn.
                Để đăng kí tài khoản, vui lòng điền mã xác thực.</p>
            <div className="form-field">
                <label htmlFor="register-verification-code" className="form-field__label">Mã xác thực</label>
                <input type="register-verification-code" id="register-verification-code" name="register-verification-code" value={inputs.register_verification_code || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập mã xác thực" />
            </div>
            <div className="form-field">
                <input
                    type="submit"
                    value="Đăng kí"
                    className="form-field__input btn btn-2 btn-md"
                />
            </div>
        </form>
    );
}
