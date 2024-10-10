// Imports
import { useState, useEffect } from "react";

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
            errors.fullName = 'Vui lòng nhập họ tên';
        } else if (!minLength(inputs.fullName, 4)) {
            errors.fullName = 'Họ tên phải trên 4 kí tự';
        }

        if (isFilled(inputs.referralCode)) {
            if (!inputs.referralCode.length == 8 || !referrerInfo) {
                errors.referralCode = "Mã giới thiệu không hợp lệ";
            }
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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


    const [referrerInfo, setReferrerInfo] = useState(null); // State to store referrer information

    useEffect(() => {
        const fetchReferrerInfo = async () => {
            if (inputs.referralCode && inputs.referralCode.length == 8) {
                try {
                    // return {
                    //     fullName: "Luu Quoc Nhat"
                    // };
                    const response = await apiUtils.get(`/user/getUserByReferralCode/${inputs.referralCode}`);
                    setReferrerInfo(response.data.metadata.user); // Assuming response.data contains referrer info
                } catch (error) {
                    console.error("Failed to fetch referrer info:", error);
                    setErrors((values) => ({ ...values, referralCode: "Mã giới thiệu không hợp lệ" }));
                    setReferrerInfo(null);
                }
            } else {
                setReferrerInfo(null);
            }
        };

        fetchReferrerInfo();
    }, [inputs.referralCode]);

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

                        <div className="form-field required">
                            <label htmlFor="email" className="form-field__label">Email</label>
                            <input type="email" id="email" name="email" value={inputs.email || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập email đăng nhập" autoComplete="on" />
                            {errors.email && <span className="form-field__error">{errors.email}</span>}
                        </div>

                        <div className="form-field ">
                            <label htmlFor="password" className="form-field__label">Mật khẩu</label>
                            <span className="form-field__annotation">Mật khẩu phải chứa ít nhất 6 kí tự, 1 số và 1 kí tự đặc biệt</span>
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

                        <div className="form-field required">
                            <label htmlFor="confirmPassword" className="form-field__label">Xác nhận mật khẩu</label>

                            <div className="form-field with-ic flex-justify-space-between">
                                <input type={isPasswordVisible ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={inputs.confirmPassword || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập lại mật khẩu" autoComplete="on" />
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

                        <div className="form-field required">
                            <label htmlFor="fullName" className="form-field__label">Họ tên</label>
                            <input type="text" id="fullName" name="fullName" value={inputs.fullName || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập họ và tên" autoComplete="on" />
                            {errors.fullName && <span className="form-field__error">{errors.fullName}</span>}
                        </div>

                        <div className="form-field">
                            <label htmlFor="referralCode" className="form-field__label">Mã giới thiệu</label>
                            <input type="text" id="referralCode" name="referralCode" value={inputs.referralCode || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập mã giới thiệu từ bạn bè (nếu có)" autoComplete="on" />
                            {errors.referralCode && <span className="form-field__error">{errors.referralCode}</span>}
                            {referrerInfo && (
                                <span className="mt-8">Người giới thiệu: {referrerInfo.fullName}</span>
                            )}

                        </div>

                        <div className="form-field">
                            {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
                        </div>

                        <div className="form-field">
                            <button
                                type="submit"
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