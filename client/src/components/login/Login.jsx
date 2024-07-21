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
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to track password visibility

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
                    <div className="form-field with-ic flex-justify-space-between">
                        <input type={isPasswordVisible ? "text" : "password"} id="password" name="password" value={inputs.password || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập mật khẩu" autoComplete="on" />
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
                <span>Chưa có tài khoản?{" "}</span>
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