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
            console.log({password: inputs.password, email: resetPasswordEmail});
            const response = await apiUtils.patch("/auth/users/resetPassword", {password: inputs.password, email: resetPasswordEmail});
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
                            <input type="password" id="password" name="password" value={inputs.password || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập mật khẩu mới" autoComplete="on" />
                            {errors.password && <span className="form-field__error">{errors.password}</span>}
                        </div>
                        <div className="form-field">
                            <label htmlFor="confirmPassword" className="form-field__label">Xác nhận mật khẩu mới</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" value={inputs.confirmPassword || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập mật khẩu mới" autoComplete="on" />
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
