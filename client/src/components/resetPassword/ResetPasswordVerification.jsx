// Imports
import React, { useState } from "react";

// Resources

// Contexts
import { useAuth } from "../../contexts/auth/AuthContext.jsx";
import { useModal } from "../../contexts/modal/ModalContext.jsx";

// Utils
import { apiUtils } from "../../utils/newRequest.js";
import { isFilled, minLength, isMatch, hasSymbol, isValidEmail } from "../../utils/validator.js";

// Styling
import "./ResetPassword.scss";

export default function ResetPasswordVerification({ resetPasswordEmail }) {
    // Resources from AuthContext
    const { setShowLoginForm, setOverlayVisible, setShowResetPasswordForm, setShowSetNewPasswordForm, showResetPasswordVerification, setShowResetPasswordVerificationForm } = useAuth();
    const {setModalInfo} = useModal();
    
    // Initialize variables for inputs, errors, loading effect
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitResetPasswordVerificationLoading, setIsSubmitResetPasswordVerificationLoading] = useState(false);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        // Update input value & clear error
        setInputs((values) => ({ ...values, [name]: value }));
        setErrors((values) => ({ ...values, [name]: '' }));
    };

    const validateInputs = () => {
        let errors = {};

        // Validate otp
        if (!isFilled(inputs.otp)) {
            errors.otp = 'Vui lòng nhập mã xác thực';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Initialize loading effect for the submit button
        setIsSubmitResetPasswordVerificationLoading(true);

        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Clear the loading effect if validation failed
            setIsSubmitResetPasswordVerificationLoading(false);
            return;
        }
        setOverlayVisible(true);

        // Handle verify otp request
        try {
            inputs.email = resetPasswordEmail;
            const response = await apiUtils.post("/auth/users/verifyResetPasswordOtp", inputs);
            if (response) {
                setShowResetPasswordVerificationForm(false);
                setShowSetNewPasswordForm(true);
            }
        } catch (error) {
            console.error("Failed to reset password:", error);
            setModalInfo({
                status: "error",
                message: error.response.data.message
            })
            errors.serverError = error.response.data.message;
        } finally {
            // Clear the loading effect
            setIsSubmitResetPasswordVerificationLoading(false);
        }
    };

    return (
        <>
            <form className="form register-form" onSubmit={handleSubmit}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                    setShowResetPasswordVerificationForm(false);
                    setOverlayVisible(false);
                }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>

                <h2 className="form__title">Đặt lại mật khẩu</h2>

                <p>Fiyonce vừa gửi mã xác nhận đến <span className="highlight-text">{resetPasswordEmail}</span>.
                    Để đặt lại mật khẩu, vui lòng điền mã xác thực.
                </p>

                <div className="form-field">
                    <label htmlFor="otp" className="form-field__label">Mã xác thực</label>
                    <input type="otp" id="otp" name="otp" value={inputs.otp || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập mã xác thực" autoComplete="on" />
                    {errors.otp && <span className="form-field__error">{errors.otp}</span>}
                </div>

                <div className="form-field">
                    {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
                </div>

                <div className="form-field">
                    <button
                        type="submit"
                        className="form-field__input btn btn-2 btn-md"
                        disabled={isSubmitResetPasswordVerificationLoading}
                    >
                        {isSubmitResetPasswordVerificationLoading ? (
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
                    setShowResetPasswordVerificationForm(false);
                    setShowLoginForm(true);
                }}>đăng nhập</span>
            </p>
        </>
    );
}