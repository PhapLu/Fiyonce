// Imports
import React, { useState } from "react";

// Resources
import { useAuth } from "../../contexts/auth/AuthContext";
import RegisterVerification from "./RegisterVerification";

// Utils
import { apiUtils } from "../../utils/newRequest";
import { isFilled, minLength, isMatch, hasSymbol, isValidEmail, isValidPassword } from "../../utils/validator.js";

// Styling
import "./Register.scss";

export default function Register() {
    // Resources from AuthContext
    const { showRegisterVerificationForm, setShowLoginForm, setShowRegisterForm, setOverlayVisible, setShowRegisterVerificationForm } = useAuth();

    // Initialize variables for inputs, errors, loading effect
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitRegisterLoading, setIsSubmitRegisterLoading] = useState(false);

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

        // Validate passwords
        if (!isFilled(inputs.password)) {
            errors.password = 'Vui lòng nhập mật khẩu';
        } else if (!isValidPassword(inputs.password)) {
            errors.password = 'Mật khẩu phải chứa ít nhất 6 kí tự, 1 số và 1 kí tự đặc biệt';
        }

        if (!isFilled(inputs.confirmPassword)) {
            errors.confirmPassword = 'Vui lòng nhập mật khẩu xác nhận';
        } else if (!isMatch(inputs.confirmPassword, inputs.password)) {
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        if (isFilled(inputs.password) && isFilled(inputs.confirmPassword) && !isMatch(inputs.confirmPassword, inputs.password)) {
            errors.password = 'Mật khẩu không khớp';
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        // Validate fullname
        if (!isFilled(inputs.fullName)) {
            errors.fullName = 'Vui lòng nhập họ và tên';
        } else if (!minLength(inputs.fullName, 6)) {
            errors.fullName = 'Họ và tên phải trên 6 kí tự';
        } else if (hasSymbol(inputs.fullName)) {
            errors.fullName = 'Tên không được chứa kí tự đặc biệt';
        }
        return errors;
    };

    const handleSubmit = async () => {
        // Initialize loading effect for the submit button
        setIsSubmitRegisterLoading(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Clear the loading effect if validation failed
            setIsSubmitRegisterLoading(false);
            return;
        }

        // Handle register request
        try {
            const { confirmPassword, ...others } = inputs;
            const response = await apiUtils.post("/auth/users/signUp", others);
            if (response) {
                setShowRegisterVerificationForm(true);
            }
        } catch (error) {
            console.error("Failed to register:", error);
            errors.serverError = error.response.data.message;
        } finally {
            // Clear the loading effect
            setIsSubmitRegisterLoading(false);
        }
    };

    return (
        <>
            {showRegisterVerificationForm ? (
                <RegisterVerification handleRegisterSubmit={handleSubmit} registerInputs={inputs} />
            )
                :
                <>
                    <form className="form register-form">
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
                            <button
                                className="form-field__input btn btn-2 btn-md"
                                disabled={isSubmitRegisterLoading}
                                onClick={handleSubmit}
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
                        Đã có tài khoản?{" "}
                        <span className="form__extra-text__link" onClick={() => {
                            setShowRegisterForm(false);
                            setShowLoginForm(true);
                        }}>Đăng nhập</span>
                    </p>
                </>
            }
        </>
    );
}