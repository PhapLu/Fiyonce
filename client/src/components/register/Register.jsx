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
    const [errors, setErrors] = useState({});
    const { setShowLoginForm, setShowRegisterForm, setOverlayVisible, showRegisterVerificationForm, setShowRegisterVerificationForm } = useAuth();
    const [registerEmail, setRegisterEmail] = useState();

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
        setErrors((values) => ({ ...values, [name]: '' })); // Clear the error for this field
    };

    function isValidEmail(val) {
        return /\S+@\S+\.\S+/.test(val);
    }

    function isFilled(val) {
        return val != null && val != undefined && val.trim() !== "";
    }

    function minLength(val, length) {
        return val.length >= length;
    }

    function isMatch(val1, val2) {
        return val1 === val2;
    }

    function hasSymbol(val) {
        return /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(val);
    }

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

        if (!isFilled(inputs.confirmPassword)) {
            errors.confirmPassword = 'Vui lòng nhập mật khẩu xác nhận';
        } else if (!isMatch(inputs.confirmPassword, inputs.password)) {
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        if (!isMatch(inputs.confirmPassword, inputs.password)) {
            errors.password = 'Mật khẩu không khớp';
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        if (!isFilled(inputs.fullName)) {
            errors.fullName = 'Vui lòng nhập họ và tên';
        } else if (hasSymbol(inputs.fullName)) {
            errors.fullName = 'Tên không được chứa kí tự đặc biệt';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setOverlayVisible(true);
        inputs.role = "client";
        const { confirmPassword, ...others } = inputs;

        try {
            const response = await apiUtils.post("/access/users/signUp", others);
            if (response) {
                setShowRegisterVerificationForm(true);
                setRegisterEmail(response.data.metadata.email);
            }
        } catch (error) {
            console.log(error.response.data.message);
            errors.serverError = error.response.data.message;
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
                                <input type="email" id="email" name="email" value={inputs.email || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập email đăng nhập" autoComplete="on" />
                                {errors.email && <span className="form-field__error">{errors.email}</span>}
                            </div>
                            <div className="form-field">
                                <label htmlFor="password" className="form-field__label">Mật khẩu</label>
                                <input type="password" id="password" name="password" value={inputs.password || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập mật khẩu" autoComplete="on" />
                                {errors.password && <span className="form-field__error">{errors.password}</span>}
                            </div>
                            <div className="form-field">
                                <label htmlFor="confirmPassword" className="form-field__label">Xác nhận mật khẩu</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" value={inputs.confirmPassword || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập lại mật khẩu" autoComplete="on" />
                                {errors.confirmPassword && <span className="form-field__error">{errors.confirmPassword}</span>}
                            </div>
                            <div className="form-field">
                                <label htmlFor="fullName" className="form-field__label">Họ và tên</label>
                                <input type="text" id="fullName" name="fullName" value={inputs.fullName || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập họ và tên" autoComplete="on" />
                                {errors.fullName && <span className="form-field__error">{errors.fullName}</span>}
                            </div>
                            <div className="form-field">
                                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
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