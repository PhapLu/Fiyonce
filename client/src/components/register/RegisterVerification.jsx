// Imports
import React, { useState } from "react";

// Resources

// Contexts
import { useAuth } from "../../contexts/auth/AuthContext";
import { useModal } from "../../contexts/modal/ModalContext"

// Utils
import { apiUtils } from "../../utils/newRequest";
import { isFilled } from "../../utils/validator.js";

// Styling
import "./Register.scss";
import { maskString } from "../../utils/formatter.js";

export default function RegisterVerification({ handleRegisterSubmit, registerInputs }) {
    const { setShowMenu, login, setShowRegisterForm, setOverlayVisible, setShowRegisterVerificationForm } = useAuth();
    const { setModalInfo } = useModal();

    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitRegisterVerificationLoading, setIsSubmitRegisterVerificationLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setInputs((values) => ({ ...values, [name]: value }));
        setErrors((values) => ({ ...values, [name]: '' }));
    };

    const validateInputs = () => {
        let errors = {};

        if (!isFilled(inputs.otp)) {
            errors.otp = 'Vui lòng nhập mã xác thực';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitRegisterVerificationLoading(true);

        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitRegisterVerificationLoading(false);
            return;
        }

        try {const response = await apiUtils.post("/auth/users/verifyOtp", { ...inputs, email: registerInputs.email });
            if (response) {
                setModalInfo({
                    status: "congrat",
                    message: "Đăng kí tài khoản thành công"
                });
                login(registerInputs.email, registerInputs.password);
                setShowRegisterForm(false);
                setShowRegisterVerificationForm(false);
                setShowMenu(false);
            }
        } catch (error) {
            setModalInfo({
                status: "error",
                message: error.response.data.message
            });
            errors.serverError = error.response.data.message;
        } finally {
            setIsSubmitRegisterVerificationLoading(false);
        }
    };

    const handleResend = (e) => {
        setIsButtonDisabled(true);
        setCountdown(60);
        handleRegisterSubmit(e);

        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(timer);
                    setIsButtonDisabled(false);
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);
    };

    return (<>
        <form className="form verify-registration-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowRegisterForm(false);
                setShowRegisterVerificationForm(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <h2 className="form__title">Đăng kí</h2>

            <p>Vui lòng điền mã xác thực Pastal vừa gửi đến email <span className="highlight-text">
                {registerInputs.email}
            </span></p>

            <div className="form-field">
                <label htmlFor="otp" className="form-field__label">Mã xác thực</label>
                <input type="text" id="otp" name="otp" value={inputs.otp || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập mã xác thực" />
                {errors.otp && <span className="form-field__error">{errors.otp}</span>}
            </div>
            <div className="form-field">
                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
            </div>
            <p>
                Không nhận được mã?{" "}
                <span className={`highlight-text ${isButtonDisabled ? "disabled" : ""}`} onClick={!isButtonDisabled ? handleResend : null}>
                    {isButtonDisabled ? `Gửi lại sau ${countdown}s` : "Gửi lại"}
                </span>
            </p>

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
    </>
    );
}