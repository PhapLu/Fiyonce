import React, { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";

// Components
import DatePicker from '../../components/datePicker/DatePicker.jsx';

// Contexts
import { useAuth } from "../../contexts/auth/AuthContext.jsx";
import { useModal } from '../../contexts/modal/ModalContext.jsx';

// Utils
import { apiUtils } from '../../utils/newRequest.js';
import { isFilled, isValidPhone, hasSymbol, isValidEmail } from "../../utils/validator.js";
import { YYYYMMDDAsDDMMYYYY, dateTimeAsYYYYMMDD } from '../../utils/formatter.js';

// Styling
import './ProfileBasicInfo.scss';

export default function ProfileBasicInfo() {
    const { profileInfo, setProfileInfo } = useOutletContext();
    const { userInfo, setUserInfo } = useAuth();
    const { setModalInfo } = useModal();

    const [inputs, setInputs] = useState(profileInfo);
    const [errors, setErrors] = useState({});
    const [isSubmitProfileBasicInfoLoading, setIsSubmitProfileBasicInfoLoading] = useState(false);
    const [socialLinks, setSocialLinks] = useState(profileInfo.socialLinks || []);

    if (!profileInfo) {
        return null;
    }

    useEffect(() => {
        if (profileInfo) {
            const dob = profileInfo.dob ? new Date(profileInfo.dob).toISOString().split('T')[0] : "";
            setInputs({ ...profileInfo, dob: dob });
            setSocialLinks(profileInfo.socialLinks || []);
        }
    }, []);

    const handleDateChange = (formattedDate) => {
        const date = new Date(formattedDate);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        const dob = `${year}-${month}-${day}T00:00:00.000Z`;
        setInputs((values) => ({ ...values, dob: dob }));
    };
    const handleChange = (e) => {
        const name = e.target.name;
        let value = e.target.value;

        setInputs((values) => ({ ...values, [name]: value }));
        setErrors((values) => ({ ...values, [name]: '' }));
    };

    const validateInputs = () => {
        let errors = {};

        if (isFilled(inputs.phone)) {
            if (!isValidPhone(inputs.phone)) {
                errors.phone = 'Số điện thoại không hợp lệ';
            }
        }

        if (!isFilled(inputs.fullName)) {
            errors.fullName = 'Vui lòng nhập họ và tên';
        } else if (hasSymbol(inputs.fullName)) {
            errors.fullName = 'Tên không được chứa kí tự đặc biệt';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitProfileBasicInfoLoading(true);

        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitProfileBasicInfoLoading(false);
            return;
        }

        try {
            // Convert the date format to yyyy-mm-dd for backend compatibility
            if (inputs.dob) {
                inputs.dob = inputs.dob.split('/').reverse().join('-');
            }

            const userId = profileInfo._id;
            const response = await apiUtils.patch(`/user/updateProfile/${userId}`, inputs);
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Cập nhật thông tin thành công"
                });
                setProfileInfo(response.data.metadata.user);
            }
        } catch (error) {
            console.error("Failed to update basic info:", error);
            setErrors({ serverError: "Failed to update profile. Please try again later." });
        } finally {
            setIsSubmitProfileBasicInfoLoading(false);
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        if (profileInfo) {
            setInputs(profileInfo);
            setSocialLinks(profileInfo.socialLinks || []);
        }
    };

    return (
        <div className="profile-basic-info">
            <section className="section profile-basic-info-section">
                <h3 className="section__title">Thông tin cơ bản</h3>
                <form className="form profile-basic-info-form">
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

                    {userInfo?.role === "talent" && (
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
                    )}

                    <div className="form-field">
                        <label htmlFor="gender" className="form-field__label">Giới tính</label>
                        <select
                            name="gender"
                            value={inputs?.gender || ""}
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
                        <DatePicker name="dob" value={inputs.dob} onChange={handleDateChange} />
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
                <form className="form profile-basic-info-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="email" className="form-field__label">Email đăng nhập</label>
                        <input
                            type="text"
                            name="email"
                            value={inputs.email || ""}
                            onChange={handleChange}
                            readOnly={true}
                            className="form-field__input outline-border-none"
                            placeholder="Nhập email đăng nhập"
                        />
                        {errors.email && <span className="form-field__error">{errors.email}</span>}
                    </div>
                </form>
            </section>

            <div className="form-field">
                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
            </div>

            <div className="profile-basic-info__button-container">
                <button
                    type="submit"
                    className="form-field__input btn btn-2 btn-md"
                    disabled={isSubmitProfileBasicInfoLoading}
                    onClick={handleSubmit}
                >
                    {isSubmitProfileBasicInfoLoading ? (
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
