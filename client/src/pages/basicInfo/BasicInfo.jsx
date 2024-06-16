// Imports
import React, { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";

// Resources
import { useAuth } from "../../contexts/auth/AuthContext";

// Utils
import { apiUtils } from '../../utils/newRequest';
import { isFilled, isValidPhone, hasSymbol, isValidEmail } from "../../utils/validator.js"

// Styling
import './BasicInfo.scss';

export default function BasicInfo() {
    // User info fetched by id (url parameter)
    const profileInfo = useOutletContext();

    // Resources from AuthContext
    const { userInfo, setUserInfo } = useAuth();

    // Initialize variables for inputs, errors, loading effect
    const [inputs, setInputs] = useState(profileInfo);
    const [errors, setErrors] = useState({});
    const [isSubmitBasicInfoLoading, setIsSubmitBasicInfoLoading] = useState(false);

    const [socialLinks, setSocialLinks] = useState(profileInfo.socialLinks || []);

    // Return null if profile information does not exist
    // Otherwise, assign values for form fields
    if (!profileInfo) {
        return null;
    }

    useEffect(() => {
        if (profileInfo) {
            setInputs(profileInfo);
            setSocialLinks(profileInfo.socialLinks || []);
        }
    }, [profileInfo]);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        // Update input value & clear error
        setInputs((values) => ({ ...values, [name]: value }));
        setErrors((values) => ({ ...values, [name]: '' }));
    };

    const handleLinkChange = (event, index) => {
        const { value } = event.target;
        const updatedLinks = socialLinks.map((link, i) => (i === index ? value : link));
        setSocialLinks(updatedLinks);
    };

    const addLinkInput = () => {
        setSocialLinks([...socialLinks, '']);
    };

    const deleteLinkInput = (index) => {
        const updatedLinks = socialLinks.filter((_, i) => i !== index);
        setSocialLinks(updatedLinks);
    };

    const validateInputs = () => {
        let errors = {};

        // Validate email field if filled
        if (isFilled(inputs.phone)) {
            if (!isValidPhone(inputs.phone)) {
                errors.phone = 'Số điện thoại không hợp lệ';
            }
        }

        // Validate fullname
        if (!isFilled(inputs.fullName)) {
            errors.fullName = 'Vui lòng nhập họ và tên';
        } else if (hasSymbol(inputs.fullName)) {
            errors.fullName = 'Tên không được chứa kí tự đặc biệt';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Initialize loading effect for the submit button
        setIsSubmitBasicInfoLoading(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Clear the loading effect if validation failed
            setIsSubmitBasicInfoLoading(false);
            return;
        }

        try {
            const userId = profileInfo._id;
            const submittedSocialLinks = socialLinks.filter(link => link.trim() !== ''); // Filter out empty URLs
            const updatedData = { ...inputs, socialLinks: submittedSocialLinks };
            const response = await apiUtils.patch(`/user/updateUserProfile/${userId}`, updatedData);
            if (response) {
                alert("Successfully updated user information");
                setUserInfo(response.data.metadata.updatedUser);
            }
        } catch (error) {
            console.error("Failed to update basic info:", error);
            setErrors((prevErrors) => ({ ...prevErrors, serverError: error.response.data.message }));
        } finally {
            // Clear the loading effect
            setIsSubmitBasicInfoLoading(false);
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        if (profileInfo) {
            setInputs(profileInfo);
            setSocialLinks(profileInfo.socialLinks || []);
        }
    }

    return (
        <div className="basic-info">
            <section className="section basic-info-section">

                <h3 className="section__title">Thông tin cơ bản</h3>

                <form className="form basic-info-form">
                    <div className="form-field">
                        <label htmlFor="fullName" className="form-field__label">Họ và tên</label>
                        <input
                            type="text"
                            name="fullName"
                            value={inputs.fullName || ""}
                            onChange={handleChange}
                            className="form-field__input"
                            placeholder="Nhập họ và tên"
                        />
                        {errors.fullName && <span className="form-field__error">{errors.fullName}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="stageName" className="form-field__label">Nghệ danh</label>
                        <input
                            type="text"
                            name="stageName"
                            value={inputs.stageName || ""}
                            onChange={handleChange}
                            className="form-field__input"
                            placeholder="Nhập nghệ danh"
                        />
                        {errors.stageName && <span className="form-field__error">{errors.stageName}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="gender" className="form-field__label">Giới tính</label>
                        <select
                            name="gender"
                            value={inputs.gender || ""}
                            onChange={handleChange}
                            className="form-field__input"
                        >
                            <option value="">-- Chọn giới tính --</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                        {errors.gender && <span className="form-field__error">{errors.gender}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="dob" className="form-field__label">Ngày sinh</label>
                        <input
                            type="date"
                            name="dob"
                            value={inputs.dob || ""}
                            onChange={handleChange}
                            className="form-field__input"
                            placeholder="Nhập ngày sinh"
                        />
                        {errors.dob && <span className="form-field__error">{errors.dob}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="address" className="form-field__label">Địa chỉ</label>
                        <input
                            type="text"
                            name="address"
                            value={inputs.address || ""}
                            onChange={handleChange}
                            className="form-field__input"
                            placeholder="Nhập địa chỉ cụ thể"
                        />
                        {errors.address && <span className="form-field__error">{errors.address}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="phone" className="form-field__label">Điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value={inputs.phone || ""}
                            onChange={handleChange}
                            className="form-field__input"
                            placeholder="Nhập số điện thoại"
                        />
                        {errors.phone && <span className="form-field__error">{errors.phone}</span>}
                    </div>

                </form>
            </section>

            <section className="section account-security-section">
                <h3 className="section__title">Tài khoản và bảo mật</h3>

                <form className="form basic-info-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="email" className="form-field__label">Email đăng nhập</label>
                        <input
                            type="text"
                            name="email"
                            value={inputs.email || ""}
                            onChange={handleChange}
                            className="form-field__input"
                            placeholder="Nhập email đăng nhập"
                        />
                        {errors.email && <span className="form-field__error">{errors.email}</span>}
                    </div>
                </form>
            </section>

            <section className="section link-section">
                <h3 className="section__title">Liên kết</h3>

                {socialLinks.map((link, index) => (
                    <div key={index} className="link-form">
                        <div className="form-field with-ic">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                            </svg>
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => handleLinkChange(e, index)}
                                className="form-field__input"
                                placeholder="Nhập liên kết"
                            />
                            <svg onClick={() => deleteLinkInput(index)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic delete-ic">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                ))}
                <div className="form-field with-ic add-link-btn" onClick={addLinkInput}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic add-link-btn__ic">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Thêm liên kết</span>
                    {errors.socialLinks && <span className="form-field__error">{errors.socialLinks}</span>}
                </div>
            </section>

            <div className="form-field">
                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
            </div>

            <div className="basic-info__button-container">
                <button
                    type="submit"
                    className="form-field__input btn btn-2 btn-md"
                    disabled={isSubmitBasicInfoLoading}
                    onClick={handleSubmit}
                >
                    {isSubmitBasicInfoLoading ? (
                        <span className="btn-spinner"></span>
                    ) : (
                        "Lưu thay đổi"
                    )}
                </button>
                <button className="btn btn-4 btn-md" onClick={handleCancel}>Hủy</button>
            </div>
        </div>
    );
}
