import React, { useState } from 'react';
import "./Sidebar.scss";
import UpgradeAccount from "../upgradeAccount/UpgradeAccount";
import { apiUtils } from '../../utils/newRequest';
// import { useOutletContext } from "react-router-dom";
import { useAuth } from '../../contexts/auth/AuthContext';

export default function Sidebar({ profileInfo }) {
    // const profileInfo = useOutletContext();
    const { userInfo, setUserInfo } = useAuth();
    const [openEditProfileForm, setOpenEditProfileForm] = useState(false);
    const [inputs, setInputs] = useState(profileInfo);
    const [loading, setLoading] = useState(false);
    const [openUpgradeAccountForm, setUpgradeAccountForm] = useState(false);
    if (!profileInfo) {
        return null;
    }
    console.log(profileInfo);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = profileInfo._id;
            const response = await apiUtils.patch(`/user/updateUserProfile/${userId}`, inputs);
            setUserInfo(response.data.metadata.updatedUser);
            alert("Successfully updated user information")
        } catch (error) {
            console.log(error);
        }
    };

    const handleAvatarClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', "avatar");

        if (file) {
            setLoading(true);
            try {
                const response = await apiUtils.post(`upload/profile/avatarOrCover/${profileInfo._id}`, formData);
                if (response.data.metadata.image_url) {
                    setUserInfo({ ...profileInfo, avatar: response.data.metadata.image_url });
                    profileInfo.avatar = response.data.metadata.image_url;
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="sidebar">
            <div className={'sidebar__avatar ' + (loading ? " skeleton-img" : "")}>
                <img src={profileInfo.avatar} alt="" className={'sidebar__avatar__img '} />
                <svg onClick={handleAvatarClick} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 sidebar__avatar__ic">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75L7.409 10.591a2.25 2.25 0 013.182 0L15.75 15.75m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0L22.75 15.75m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zM12.75 8.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
            </div>

            {openEditProfileForm ? (
                <div className="form edit-profile-form">
                    <div className="form-field">
                        <label htmlFor="fullName" className="form-field__label">Họ và tên</label>
                        <input type="text" id="fullName" name="fullName" value={inputs.fullName || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập họ và tên" />
                    </div>
                    <div className="form-field">
                        <label htmlFor="stageName" className="form-field__label">Nghệ danh</label>
                        <input type="text" id="stageName" name="stageName" value={inputs.stageName || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập nghệ danh" />
                    </div>
                    <div className="form-field">
                        <label htmlFor="jobTitle" className="form-field__label">Vị trí công việc</label>
                        <input type="text" id="jobTitle" name="jobTitle" value={inputs.jobTitle || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập vị trí công việc" />
                    </div>
                    <div className="form-field">
                        <label htmlFor="province" className="form-field__label">Tỉnh thành</label>
                        <select
                            id="province"
                            name="province"
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
                        <label htmlFor="bio" className="form-field__label">Bio</label>
                        <textarea type="text" id="bio" name="bio" value={inputs.bio || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập giới thiệu ngắn gọn về bản thân" />
                    </div>
                    <button className="sidebar__btn btn btn-md btn-2" onClick={handleSubmit}>
                        <span>Lưu thay đổi</span>
                    </button>
                    <button className="sidebar__btn btn btn-4" onClick={() => setOpenEditProfileForm(false)}>
                        <span>Hủy</span>
                    </button>
                </div>
            ) : (
                <>
                    <div className="sidebar__name">
                        <p className="sidebar__name__fullName">{profileInfo.fullName}</p>
                        <span className="sidebar__name__email">{profileInfo.displayName}</span>
                    </div>
                    <div>
                        {profileInfo.jobTitle && (
                            <>
                                <span className="sidebar__job-title">
                                    {profileInfo.jobTitle}
                                </span>
                                <br />
                            </>
                        )}
                        {profileInfo.province && (
                            <span className="sidebar__location">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                                {profileInfo.province}
                            </span>
                        )}
                    </div>
                    <br />


                    <div className="sidebar__follow">
                        <span className="sidebar__follow__follower">{profileInfo.followers.length === 0 ? "Chưa có người theo dõi" : `${profileInfo.followers.length} người theo dõi`}</span>
                        {" " + "-" + " "}
                        <span className="sidebar__follow__following">{profileInfo.following.length === 0 ? "Chưa theo dõi" : `${profileInfo.following.length} đang theo dõi`}</span>
                    </div>

                    {profileInfo.bio && (
                        <div className="sidebar__section sidebar__bio">
                            <p className="sidebar__section__title">Bio</p>
                            <hr />
                            <p>{profileInfo.bio}</p>
                        </div>
                    )}

                    {profileInfo.socialLinks && (
                        <div className="sidebar__section sidebar__socials">
                            <p className="sidebar__section__title">Liên kết</p>
                            <hr />
                            <div className="sidebar__socials__link-container">
                                <div className="sidebar__socials__link-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                    </svg>
                                    <span>vhqwfbwf.com</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <button className="sidebar__btn btn btn-md btn-2" onClick={() => setOpenEditProfileForm(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21p.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        <span>Chỉnh sửa thông tin</span>
                    </button>
                    <button className="sidebar__btn btn btn-1" onClick={() => setUpgradeAccountForm(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#726FFF" className="size-6">
                            <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
                        </svg>
                        <span>Nâng cấp tài khoản</span>
                    </button>
                </>
            )}
            {openUpgradeAccountForm && <UpgradeAccount closeModal={() => setUpgradeAccountForm(false)} />}
        </div>
    );
}