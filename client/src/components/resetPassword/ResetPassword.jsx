// Imports
import React, { useState } from "react";

// Resources
import { useAuth } from "../../contexts/auth/AuthContext";
import ResetPasswordVerification from "./ResetPasswordVerification.jsx";
import SetNewPassword from "../setNewPassword/SetNewPassword";

// Utils
import { apiUtils } from "../../utils/newRequest";
import { isFilled, minLength, isMatch, hasSymbol, isValidEmail } from "../../utils/validator.js";

// Styling
import "./ResetPassword.scss";
import { useModal } from "../../contexts/modal/ModalContext.jsx";

export default function ResetPassword() {
    const {setModalInfo} = useModal();
    // Resources from AuthContext
    const { setShowLoginForm, setOverlayVisible, setShowResetPasswordForm, showSetNewPasswordForm, showResetPasswordVerificationForm, setShowResetPasswordVerificationForm } = useAuth();

    // Initialize variables for inputs, errors, loading effect
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitRegisterLoading, setIsSubmitResetPasswordLoading] = useState(false);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        // Update input value & clear error
        setInputs((values) => ({ ...values, [name]: value }));
        setErrors((values) => ({ ...values, [name]: '' }));
    };

    const validateInputs = () => {
        let errors = {};

        // Validate email
        if (!isFilled(inputs.email)) {
            errors.email = 'Vui lòng nhập email';
        } else if (!isValidEmail(inputs.email)) {
            errors.email = 'Email không hợp lệ';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Initialize loading effect for the submit button
        setIsSubmitResetPasswordLoading(true);
        setOverlayVisible(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitResetPasswordLoading(false);
            return;
        }

        // Handle reset password request
        try {
            const response = await apiUtils.post("/auth/users/forgotPassword", inputs);
            if (response) {
                setShowResetPasswordVerificationForm(true);
            }
        } catch (error) {
            setModalInfo({
                status: "error",
                message: error.response.data.message
            })
            console.error("Failed to reset password:", error);
            errors.serverError = error.response.data.message;
        } finally {
            // Clear the loading effect
            setIsSubmitResetPasswordLoading(false);
        }
    };

    return (
        <>
            {showResetPasswordVerificationForm && <ResetPasswordVerification resetPasswordEmail={inputs.email} />}
            {showSetNewPasswordForm && <SetNewPassword resetPasswordEmail={inputs.email} />}
            {!showResetPasswordVerificationForm && !showSetNewPasswordForm && (
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
                            <button
                                type="submit"
                                className="form-field__input btn btn-2 btn-md"
                                disabled={isSubmitRegisterLoading}
                            >
                                {isSubmitRegisterLoading ? (
                                    <span className="btn-spinner"></span>
                                ) : (
                                    "Tiếp tục"
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Extra section of the form */}
                    <p className="form__extra-text">
                        Quay lại <span className="form__extra-text__link" onClick={() => {
                            setShowResetPasswordForm(false);
                            setShowLoginForm(true);
                        }}>Đăng nhập</span>
                    </p>
                </>
            )}

        </>
    );
}