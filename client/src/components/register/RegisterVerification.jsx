import React, { useState } from "react";
import { useAuth } from "../../contexts/auth/AuthContext";
import Cookies from 'js-cookie';
import { apiUtils } from "../../utils/newRequest";

import AuthenticationImg from "../../assets/img/authentication-img.png";
import FacebookLogo from "../../assets/img/facebook-logo.png";
import GoogleLogo from "../../assets/img/google-logo.png";
import "../../assets/scss/authentication.scss";
import "./Register.scss";

export default function RegisterVerification({handleRegisterSubmit, registerInfo, registerEmail }) {
    const [inputs, setInputs] = useState({});
    const { setShowRegisterForm, setOverlayVisible, showRegisterVerificaitonForm, setShowRegisterVerificationForm } = useAuth();

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        console.log(inputs)
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // setOverlayVisible(true);

        // const response = await axios.post("", others);
        try {
            const response = await apiUtils.post("/access/users/verifyOtp", { ...inputs, email: registerEmail })
            console.log(response);
        } catch (error) {
            console.log(error);
        }


    };

    return (
        <form className="form verify-registration-form" onSubmit={handleSubmit}>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowRegisterForm(false);
                setShowRegisterVerificationForm(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <h2 className="form__title">Đăng kí</h2>
            <p>Fiyonce vừa gửi mã xác nhận đến email của bạn.
                Để đăng kí tài khoản, vui lòng điền mã xác thực.</p>
            <div className="form-field">
                <label htmlFor="otp" className="form-field__label">Mã xác thực</label>
                <input type="otp" id="otp" name="otp" value={inputs.otp || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập mã xác thực" />
            </div>
            <p>Không nhận được mã? <span className="highlight-text" onClick={handleRegisterSubmit}>Gửi lại</span></p>
            <div className="form-field">
                <input
                    type="submit"
                    value="Đăng kí"
                    className="form-field__input btn btn-2 btn-md"
                />
            </div>
        </form>
    );
}
