import React, { useState, useEffect } from 'react';
import { newRequest } from '../../utils/newRequest';
import './BasicInfo.scss';
import { useAuth } from "../../contexts/auth/AuthContext";
import { apiUtils } from '../../utils/newRequest';

export default function BasicInfo() {
    const { userInfo, setUserInfo } = useAuth();

    const [inputs, setInputs] = useState(userInfo);
    const [socialLinks, setSocialLinks] = useState(userInfo.socialLinks || []);

    useEffect(() => {
        if (userInfo) {
            setInputs(userInfo);
            setSocialLinks(userInfo.socialLinks || []);
        }
    }, [userInfo]);

    const handleChange = (event) => {
        const { id, value } = event.target;
        setInputs((prevInputs) => ({
            ...prevInputs,
            [id]: value,
        }));
    };

    const handleLinkChange = (event, id, field) => {
        const { value } = event.target;
        const updatedLinks = socialLinks.map(link => {
            if (link._id === id) {
                return { ...link, [field]: value };
            }
            return link;
        });
        setSocialLinks(updatedLinks);
    };

    const addLinkInput = () => {
        setSocialLinks([...socialLinks, { id: Math.random().toString(), platform: '', url: '' }]);
    };

    const deleteLinkInput = (id) => {
        const updatedLinks = socialLinks.filter(link => link._id !== id);
        setSocialLinks(updatedLinks);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = userInfo._id;
            const submittedSocialLinks = socialLinks.map(link => ({ url: link.url }));
            const updatedData = inputs;
            updatedData.socialLinks = submittedSocialLinks;
            const response = await apiUtils.patch(`/user/updateUserProfile/${userId}`, updatedData);
            setUserInfo(response.data.metadata.updatedUser);
            alert("Successfully updated user information");
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        if (userInfo) {
            setInputs(userInfo);
            setSocialLinks(userInfo.socialLinks || []);
        }
    }

    if (!userInfo) {
        return null;
    }

    return (
        <div className="basic-info">
            <section className="section basic-info-section">
                <h3 className="section__title">Thông tin cơ bản</h3>
                <form className="form basic-info-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="fullName" className="form-field__label">Họ và tên</label>
                        <input
                            type="text"
                            id="fullName"
                            value={inputs.fullName || ""}
                            onChange={handleChange}
                            className="form-field__input"
                            placeholder="Nhập họ và tên"
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="stageName" className="form-field__label">Nghệ danh</label>
                        <input
                            type="text"
                            id="stageName"
                            value={inputs.stageName || ""}
                            onChange={handleChange}
                            className="form-field__input"
                            placeholder="Nhập nghệ danh"
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="gender" className="form-field__label">Giới tính</label>
                        <select
                            id="gender"
                            value={inputs.gender || ""}
                            onChange={handleChange}
                            className="form-field__input"
                        >
                            <option value="">-- Chọn giới tính --</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label htmlFor="dob" className="form-field__label">Ngày sinh</label>
                        <input
                            type="date"
                            id="dob"
                            value={inputs.dob || ""}
                            onChange={handleChange}
                            className="form-field__input"
                            placeholder="Nhập ngày sinh"
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="country" className="form-field__label">Quốc gia</label>
                        <select
                            id="country"
                            value={inputs.country || ""}
                            onChange={handleChange}
                            className="form-field__input"
                        >
                            <option value="">-- Chọn quốc gia --</option>
                            <option value="vietnam">Việt Nam</option>
                            <option value="usa">Hoa Kỳ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label htmlFor="province" className="form-field__label">Tỉnh thành</label>
                        <select
                            id="province"
                            value={inputs.province || ""}
                            onChange={handleChange}
                            className="form-field__input"
                        >
                            <option value="">-- Chọn tỉnh thành --</option>
                            <option value="hanoi">Hà Nội</option>
                            <option value="hochiminh">TP Hồ Chí Minh</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label htmlFor="phone" className="form-field__label">Điện thoại</label>
                        <input
                            type="text"
                            id="phone"
                            value={inputs.phone || ""}
                            onChange={handleChange}
                            className="form-field__input"
                            placeholder="Nhập số điện thoại"
                        />
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
                            id="email"
                            value={inputs.email || ""}
                            onChange={handleChange}
                            className="form-field__input"
                            placeholder="Nhập email đăng nhập"
                        />
                    </div>
                </form>
            </section>

            <section className="section link-section">
                <h3 className="section__title">Liên kết</h3>
                {socialLinks.map((link, index) => (
                    <div key={index} className="link-form">
                        <span>{link.platform}</span>
                        <div className="form-field with-ic">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                            </svg>
                            <input
                                type="text"
                                value={link.url}
                                onChange={(e) => handleLinkChange(e, link._id, 'url')}
                                className="form-field__input"
                                placeholder="Nhập liên kết"
                            />
                            <svg onClick={() => deleteLinkInput(link._id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic delete-ic">
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
                </div>
            </section>
            <div className="basic-info__button-container">
                <button className="btn btn-2 btn-md" onClick={handleSubmit}>Lưu thay đổi</button>
                <button className="btn btn-4 btn-md" onClick={handleCancel}>Hủy</button>
            </div>
        </div>
    );
}