import React, { useState } from "react";
import { useAuth } from "../../contexts/auth/AuthContext";
import { apiUtils } from "../../utils/newRequest";
import "./SetNewPassword.scss";
import { isFilled, minLength, isMatch, hasSymbol, isValidEmail } from "../../utils/validator.js";

export default function SetNewPassword() {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const { setShowLoginForm, setOverlayVisible, setShowResetPasswordForm, setShowSetNewPasswordForm } = useAuth();

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
        try {
            const response = await apiUtils.post("/access/users/resetPassword", inputs);
            if (response.data.status == 200) {
                setShowResetPasswordForm(false);
                setShowSetNewPasswordForm(true);
            }
        } catch (error) {
            console.log(error.response.data.message);
            errors.serverError = error.response.data.message;
        }
    };

    return (
            <>
                <form className="form register-form" onSubmit={handleSubmit}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                        setShowResetPasswordForm(false);
                        setOverlayVisible(false);
                    }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>

                    <h2 className="form__title">Đặt lại mật khẩu</h2>
                    <p>Nhập email đăng nhập của bạn và hệ thống sẽ gửi mã đặt lại mật khẩu</p>
                    <div className="form-field">
                        <label htmlFor="email" className="form-field__label">Email</label>
                        <input type="email" id="email" name="email" value={inputs.email || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập email đăng nhập" autoComplete="on" />
                        {errors.email && <span className="form-field__error">{errors.email}</span>}
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
                    Quay lại <span className="form__extra-text__link" onClick={() => {
                        setShowResetPasswordForm(false);
                        setShowLoginForm(true);
                    }}>đăng nhập</span>
                </p>
            </>
    );
}