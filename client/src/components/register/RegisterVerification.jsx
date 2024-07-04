// Imports
import React, { useState } from "react";

// Resources
import { useAuth } from "../../contexts/auth/AuthContext";

// Utils
import { apiUtils } from "../../utils/newRequest";
import { isFilled } from "../../utils/validator.js";

// Styling
import "./Register.scss";

export default function RegisterVerification({ handleRegisterSubmit, registerInputs }) {
    // Resources from AuthContext
    const { setShowMenu, login, setShowRegisterForm, setOverlayVisible, setShowRegisterVerificationForm } = useAuth();

    // Initialize variables for inputs, errors, loading effect
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitRegisterVerificationLoading, setIsSubmitRegisterVerificationLoading] = useState(false);

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
        if (!isFilled(inputs.otp)) {
            errors.otp = 'Vui lòng nhập mã xác thực';
        }

        return errors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Initialize loading effect for the submit button
        setIsSubmitRegisterVerificationLoading(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Clear the loading effect if validation failed
            setIsSubmitRegisterVerificationLoading(false);
            return;
        }

        // Handle verify otp request
        try {
            const response = await apiUtils.post("/auth/users/verifyOtp", { ...inputs, email: registerInputs.email })
            if (response) {
                alert("Successfully register for an account");
                login(registerInputs.email, registerInputs.password);
                setShowMenu();
            }
        } catch (error) {
            console.error("Failed to verify otp:", error);
            errors.serverError = error.response.data.message;
        } finally {
            // Clear the loading effect
            setIsSubmitRegisterVerificationLoading(false);
        }
    };

    return (
        <form className="form verify-registration-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowRegisterForm(false);
                setShowRegisterVerificationForm(false);
                setOverlayVisible(false);
            }}>
                {registerInputs.email}
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <h2 className="form__title">Đăng kí</h2>

            <p>Fiyonce vừa gửi mã xác nhận đến <strong>{registerInputs.email}</strong>.
                Để đăng kí tài khoản, vui lòng điền mã xác thực.
            </p>

            <div className="form-field">
                <label htmlFor="otp" className="form-field__label">Mã xác thực</label>
                <input type="text" id="otp" name="otp" value={inputs.otp || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập mã xác thực" />
                {errors.otp && <span className="form-field__error">{errors.otp}</span>}
            </div>
            <div className="form-field">
                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
            </div>
            <p>Không nhận được mã? <span className="highlight-text" onClick={handleRegisterSubmit}>Gửi lại</span></p>

            <div className="form-field">
                <button
                    type="submit"
                    className="form-field__input btn btn-2 btn-md"
                    disabled={isSubmitRegisterVerificationLoading}
                >
                    {isSubmitRegisterVerificationLoading ? (
                        <span className="btn-spinner"></span>
                    ) : (
                        "Đăng kí"
                    )}
                </button>
            </div>
        </form>
    );
}
