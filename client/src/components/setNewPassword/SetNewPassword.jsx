import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/auth/AuthContext";
import { apiUtils } from "../../utils/newRequest";
import Confetti from 'react-confetti';
import "./SetNewPassword.scss";
import { isFilled, minLength, isMatch } from "../../utils/validator.js";

export default function SetNewPassword({ resetPasswordEmail }) {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const { setShowMenu, login, setShowLoginForm, setOverlayVisible, setShowResetPasswordForm, setShowSetNewPasswordForm } = useAuth();
    const [isSuccessSetNewPassword, setIsSuccessSetNewPassword] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
        setErrors((values) => ({ ...values, [name]: '' })); // Clear the error for this field
    };

    const validateInputs = () => {
        let errors = {};
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
        return errors;
    };

    const handleNavigate = (event) => {
        event.preventDefault();
        navigate('/explore');
        setShowMenu(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }


        // setTimeout(() => {
        //     setShowConfetti(false);
        // }, 5000); // Show confetti for 3 seconds

        try {
            console.log({ password: inputs.password, email: resetPasswordEmail });
            const response = await apiUtils.patch("/auth/users/resetPassword", { password: inputs.password, email: resetPasswordEmail });
            console.log(response)
            if (response) {
                setIsSuccessSetNewPassword(true);
                setShowConfetti(true);
                login(resetPasswordEmail, inputs.password);
            }
        } catch (error) {
            console.log(error);
            errors.serverError = error.response.message;
        }
    };

    return (
        <>
            {isSuccessSetNewPassword ? (
                <div className="success-reset-password">
                    {showConfetti && <Confetti />}
                    <form className="form register-form" onSubmit={handleSubmit}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={
                            () => {
                                setShowSetNewPasswordForm(false);
                                setOverlayVisible(false);
                            }
                        }>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg >

                        <h2 className="form__title">Đặt lại mật khẩu</h2>
                        <p>Đã đặt lại mật khẩu cho {resetPasswordEmail}</p>
                        <br />
                        <div className="form-field">
                            <input
                                type="submit"
                                value="Đi đến trang chủ"
                                className="form-field__input btn btn-2 btn-md"
                                onClick={handleNavigate}
                            />
                        </div>
                    </form >
                </div>
            ) :
                <>
                    <form className="form register-form" onSubmit={handleSubmit}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={
                            () => {
                                setShowSetNewPasswordForm(false);
                                setOverlayVisible(false);
                            }
                        }>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg >

                        <h2 className="form__title">Đặt lại mật khẩu</h2>
                        <p>Đặt lại mật khẩu cho {resetPasswordEmail}</p>
                        <div className="form-field">
                            <label htmlFor="password" className="form-field__label">Mật khẩu mới</label>
                            <div className="form-field with-ic flex-justify-space-between">
                                <input type={isPasswordVisible ? "text" : "password"} id="password" name="password" value={inputs.password || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập mật khẩu mới" autoComplete="on" />

                                {isPasswordVisible ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover-cursor-opacity mr-8" onClick={() => { setIsPasswordVisible(false) }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover-cursor-opacity mr-8" onClick={() => { setIsPasswordVisible(true) }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                )}
                            </div>
                            {errors.password && <span className="form-field__error">{errors.password}</span>}
                        </div>
                        <div className="form-field">
                            <label htmlFor="confirmPassword" className="form-field__label">Xác nhận mật khẩu mới</label>
                            <div className="form-field with-ic flex-justify-space-between">
                                <input type={isPasswordVisible ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={inputs.confirmPassword || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập mật khẩu mới" autoComplete="on" />
                                {isPasswordVisible ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover-cursor-opacity mr-8" onClick={() => { setIsPasswordVisible(false) }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover-cursor-opacity mr-8" onClick={() => { setIsPasswordVisible(true) }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                )}
                            </div>
                            {errors.confirmPassword && <span className="form-field__error">{errors.confirmPassword}</span>}
                        </div>

                        <div className="form-field">
                            {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
                        </div>
                        <div className="form-field">
                            <input
                                type="submit"
                                value="Xác nhận"
                                className="form-field__input btn btn-2 btn-md"
                            />
                        </div>
                    </form >
                    <p className="form__extra-text">
                        Quay lại <span className="form__extra-text__link" onClick={() => {
                            setShowSetNewPasswordForm(false);
                            setShowLoginForm(true);
                        }}>đăng nhập</span>
                    </p>
                </>}
        </>
    );
}
