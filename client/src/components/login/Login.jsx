import React, { useState } from "react";
import { useAuth } from "../../contexts/auth/AuthContext";
import { isFilled, minLength, isValidEmail } from "../../utils/validator.js";
import Cookies from 'js-cookie';
import axios from 'axios';

import FacebookLogo from "../../assets/img/facebook-logo.png";
import GoogleLogo from "../../assets/img/google-logo.png";
import "./Login.scss";

export default function Login() {
    const [inputs, setInputs] = useState({});
    const { login, setShowLoginForm, setShowRegisterForm, setShowResetPasswordForm, setOverlayVisible } = useAuth();
    const [isSubmitLoginLoading, setIsSubmitLoginLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
        setErrors((values) => ({ ...values, [name]: '' })); // Clear the error for this field
    };

    const validateInputs = () => {
        let errors = {};
        if (!isFilled(inputs.email)) {
            errors.email = 'Vui lòng nhập email';
        } else if (!isValidEmail(inputs.email)) {
            errors.email = 'Email không hợp lệ';
        }

        if (!isFilled(inputs.password)) {
            errors.password = 'Vui lòng nhập mật khẩu';
        } else if (!minLength(inputs.password, 6)) {
            errors.password = 'Mật khẩu nên chứa ít nhất 6 kí tự';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitLoginLoading(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitLoginLoading(false);
            return;
        }

        // Handle login request
        try {
            // setTimeout(() => {
                // console.log("abc")
            // }, 5000);
            await login(inputs.email, inputs.password);
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsSubmitLoginLoading(false);
        }
    };

    return (
        <>
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
                    <input type="email" id="email" name="email" value={inputs.email || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập email đăng nhập" autoComplete="on" />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="form-field">
                    <label htmlFor="password" className="form-field__label">Mật khẩu</label>
                    <input type="password" id="password" name="password" value={inputs.password || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập mật khẩu" autoComplete="on" />
                    {errors.password && <span className="error">{errors.password}</span>}
                </div>
                <div className="form-field">
                    <button
                        type="submit"
                        className="form-field__input btn btn-2 btn-md"
                        disabled={isSubmitLoginLoading}
                    >
                        {isSubmitLoginLoading ? (
                            <span className="btn-spinner"></span>
                        ) : (
                            "Đăng nhập"
                        )}
                    </button>
                </div>
            </form>
            <p className="form__extra-text">
                Chưa có tài khoản?{" "}
                <span className="form__extra-text__link" onClick={() => {
                    setShowLoginForm(false);
                    setShowRegisterForm(true);
                }}>Đăng kí</span>
                <br />
                <span onClick={() => {
                    setShowLoginForm(false);
                    setShowResetPasswordForm(true);
                }}>Quên mật khẩu</span>
            </p>
            <br />
            <ul className="login-option-container">
                <li className="login-option-item">
                    <img src={FacebookLogo} className="login-option-item__img" alt="Facebook logo" />
                    Login with Facebook
                </li>
                <li className="login-option-item">
                    <img src={GoogleLogo} className="login-option-item__img" alt="Google logo" />
                    Login with Google
                </li>
            </ul>
        </>
    );
}