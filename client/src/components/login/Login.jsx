// Imports
import React, { useState } from "react";

// Components
import { useAuth } from "../../contexts/auth/AuthContext";

// Utils
import { isFilled, minLength, isValidEmail } from "../../utils/validator.js";

// Styling
import FacebookLogo from "../../assets/img/facebook-logo.png";
import GoogleLogo from "../../assets/img/google-logo.png";
import "./Login.scss";

export default function Login() {
    // Resources from AuthContext and ModalContext
    const { login, setShowLoginForm, setShowRegisterForm, setShowResetPasswordForm, setOverlayVisible } = useAuth();

    // Initialize variables for inputs, errors, loading effect
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitLoginLoading, setIsSubmitLoginLoading] = useState(false);

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

        // Validate password
        if (!isFilled(inputs.password)) {
            errors.password = 'Vui lòng nhập mật khẩu';
        } else if (!minLength(inputs.password, 6)) {
            errors.password = 'Mật khẩu nên chứa ít nhất 6 kí tự';
        }

        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Initialize loading effect for the submit button
        setIsSubmitLoginLoading(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Clear the loading effect if validation failed
            setIsSubmitLoginLoading(false);
            return;
        }

        // Handle login request
        await login(inputs.email, inputs.password);
        setIsSubmitLoginLoading(false);
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
                    {errors.email && <span className="form-field__error">{errors.email}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="password" className="form-field__label">Mật khẩu</label>
                    <input type="password" id="password" name="password" value={inputs.password || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập mật khẩu" autoComplete="on" />
                    {errors.password && <span className="form-field__error">{errors.password}</span>}
                </div>

                <div className="form-field">
                    {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
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

            {/* Extra section of the form */}
            <p className="form__extra-text">
                Chưa có tài khoản?{" "}
                <span className="form__extra-text__link" onClick={() => {
                    setShowLoginForm(false);
                    setShowRegisterForm(true);
                }}>Đăng kí</span>
                <br />
                <span className="hover-el" onClick={() => {
                    setShowLoginForm(false);
                    setShowResetPasswordForm(true);
                }}>Quên mật khẩu</span>
            </p>

            <br />

            {/* Other login options: Google or Facebook */}
            {/* <ul className="login-option-container">
                <li className="login-option-item">
                    <img src={FacebookLogo} className="login-option-item__img" alt="Facebook logo" />
                    Login with Facebook
                </li>
                <li className="login-option-item">
                    <img src={GoogleLogo} className="login-option-item__img" alt="Google logo" />
                    Login with Google
                </li>
            </ul> */}
        </>
    );
}