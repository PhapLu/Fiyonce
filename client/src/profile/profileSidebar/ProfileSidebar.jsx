// Imports
import { useState, useEffect, useCallback } from 'react';
import { useOutletContext, useParams } from "react-router-dom";
import EmojiPicker from 'emoji-picker-react';

// Components
import UpgradeAccount from "../../components/upgradeAccount/UpgradeAccount.jsx";
import Follower from '../../components/follow/follower/Follower.jsx';
// Contexts
import { useAuth } from '../../contexts/auth/AuthContext.jsx';
import { useConversation } from '../../contexts/conversation/ConversationContext.jsx';
import { useModal } from '../../contexts/modal/ModalContext.jsx';
import CropImage from '../../components/cropImage/CropImage.jsx';

// Utils
import { apiUtils } from '../../utils/newRequest.js';
import { isFilled, hasSymbol, maxLength } from "../../utils/validator.js"
import { getSocialLinkIcon } from "../../utils/iconDisplayer.js"

// Styling
import "./ProfileSidebar.scss";
import { resizeImageUrl } from '../../utils/imageDisplayer.js';

export default function Sidebar({ profileInfo, setProfileInfo }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [croppedImage, setCroppedImage] = useState(null);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [showFollowers, setShowFollowers] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const addEmoji = (emoji) => {
        setInputs({
            ...inputs,
            bio: inputs.bio + emoji.native
        });
    };

    const handleFileUpload = async (croppedFile) => {
        const formData = new FormData();
        formData.append('file', croppedFile);
        formData.append('type', "avatar");

        try {
            const response = await apiUtils.post(`/upload/profile/avatarOrCover/${profileInfo._id}`, formData);
            if (response.data.metadata.image_url) {
                setProfileInfo({ ...profileInfo, avatar: response.data.metadata.image_url });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAvatarClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageDataUrl = URL.createObjectURL(file);
            setSelectedImage(imageDataUrl);
            setIsCropping(true);
            setOverlayVisible(true);
        }
        // Reset the input value to allow re-selecting the same file
        e.target.value = null;
    };

    const handleCropComplete = async (croppedFile) => {
        const formData = new FormData();
        formData.append('file', croppedFile);
        formData.append('type', "avatar");

        try {
            const response = await apiUtils.post(`/upload/profile/avatarOrCover/${profileInfo._id}`, formData);
            if (response.data.metadata.image_url) {
                setProfileInfo({ ...profileInfo, avatar: response.data.metadata.image_url });
                setUserInfo({ ...userInfo, avatar: response.data.metadata.image_url })
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsCropping(false);
            setOverlayVisible(false);
        }
    };

    const handleCancelCrop = () => {
        setIsCropping(false);
        setOverlayVisible(false);
        setSelectedImage(null);
    };

    // Resources from AuthContext
    const { userInfo, setUserInfo } = useAuth();
    const { setModalInfo } = useModal();
    const { setOtherMember, setConversation, setShowRenderConversation } = useConversation();

    const { userId } = useParams();
    const isProfileOwner = userInfo?._id === userId;

    // Initialize variables for inputs, errors, loading effect
    const [inputs, setInputs] = useState(profileInfo);
    const [errors, setErrors] = useState({});
    const [isSubmitSidebarInfoLoading, setIsSubmitSidebarInfoLoading] = useState(false);
    const [isUploadAvatarLoading, setUploadAvatarLoading] = useState(false);

    const [socialLinks, setSocialLinks] = useState(profileInfo.socialLinks || []);

    const [openEditProfileForm, setOpenEditProfileForm] = useState(false);
    const [isAvatarLoading, setIsAvatarLoading] = useState(false);
    const [openUpgradeAccountForm, setOpenUpgradeAccountForm] = useState(false);
    const [showAllSocialLinks, setShowAllSocialLinks] = useState(false);
    const socialLinksToShow = showAllSocialLinks ? socialLinks : socialLinks.slice(0, 3);
    const remainingLinksCount = socialLinks.length - socialLinksToShow.length;

    const [profileFollowers, setProfileFollowers] = useState(profileInfo?.followers || [])
    const [userFollowing, setUserFollowing] = useState(userInfo?.following || [])



    const handleShowAllLinks = () => {
        setShowAllSocialLinks(!showAllSocialLinks);
    };

    // Return null if profile information does not exist
    // Otherwise, assign values for form fields
    if (!profileInfo) {
        return null;
    }

    // useEffect(() => {
    //     if (profileInfo) {
    //         setInputs(profileInfo);
    //         setSocialLinks(profileInfo.socialLinks || []);
    //     }
    // }, [userId]);


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

        // Validate biography
        if (inputs?.bio && !maxLength(inputs?.bio, 150)) {
            errors.bio = 'Bio không được vượt quá 150 kí tự';
        }

        // Validate fullname
        if (!isFilled(inputs?.fullName)) {
            errors.fullName = 'Vui lòng nhập họ và tên';
        } else if (hasSymbol(inputs?.fullName)) {
            errors.fullName = 'Tên không được chứa kí tự đặc biệt';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Initialize loading effect for the submit button
        setIsSubmitSidebarInfoLoading(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Clear the loading effect if validation failed
            setIsSubmitSidebarInfoLoading(false);
            return;
        }

        try {
            const userId = profileInfo._id;
            const submittedSocialLinks = socialLinks.filter(link => link.trim() !== ''); // Filter out empty URLs
            const updatedData = { ...inputs, socialLinks: submittedSocialLinks };
            const response = await apiUtils.patch(`/user/updateUserProfile/${userId}`, updatedData);
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Cập nhật thông tin thành công"
                })
                setUserInfo(response.data.metadata.user);
                setProfileInfo(response.data.metadata.user);
                setOpenEditProfileForm(false);
            }
        } catch (error) {
            console.error("Failed to update basic info:", error);
            setErrors((prevErrors) => ({ ...prevErrors, serverError: error.response.data.message }));
        } finally {
            // Clear the loading effect
            setIsSubmitSidebarInfoLoading(false);
        }
    };

    const [isSubmitFollowUserLoading, setIsSubmitFollowUserLoading] = useState();
    const [isSubmitUnFollowUserLoading, setIsSubmitUnFollowUserLoading] = useState();

    const handleFollowUser = async (e) => {
        e.preventDefault();

        if (!userInfo) {
            setModalInfo({
                status: "error",
                message: "Vui lòng đăng nhập để thực hiện thao tác"
            })
            return;
        }

        setIsSubmitFollowUserLoading(true);
        try {
            const response = await apiUtils.patch(`/user/followUser/${profileInfo._id}`)
            console.log(response);
            // setProfileFollowers([...profileFollowers, response.data.metadata.user.followers]);
            setUserFollowing(response.data.metadata.user.following)

            setModalInfo({
                status: "success",
                message: "Đã theo dõi"
            })
        } catch (error) {
            console.log(error);
            setModalInfo({
                status: "error",
                message: error.response.data.message
            })
        } finally {
            setIsSubmitFollowUserLoading(true);
        }
    }

    const handleUnFollowUser = async (e) => {
        e.preventDefault();

        if (!userInfo) {
            setModalInfo({
                status: "error",
                message: "Vui lòng đăng nhập để thực hiện thao tác"
            })
            return;
        }

        setIsSubmitUnFollowUserLoading(true);
        try {
            const response = await apiUtils.patch(`/user/unFollowUser/${profileInfo._id}`)
            console.log(response);
            setProfileFollowers(profileFollowers.filter(user => user._id !== profileInfo._id));
            setUserFollowing(response.data.metadata.user.following)

            setModalInfo({
                status: "success",
                message: "Đã hủy theo dõi"
            })
        } catch (error) {
            console.log(error);
            setModalInfo({
                status: "error",
                message: error.response.data.message
            })
        } finally {
            setIsSubmitUnFollowUserLoading(true);
        }
    }

    const handleOpenConversation = async (e) => {
        e.preventDefault();

        if (!userInfo) {
            setModalInfo({
                status: "error",
                message: "Vui lòng đăng nhập để thực hiện thao tác"
            })
            return;
        }
        setOtherMember({ _id: profileInfo._id, fullName: profileInfo.fullName, avatar: profileInfo.avatar })
        setShowRenderConversation(true)
    }

    const [pronoun, setPronoun] = useState("");
    const [customPronoun, setCustomPronoun] = useState("");

    const handlePronounChange = (e) => {
        setPronoun(e.target.value);
        if (e.target.value !== "custom") {
            setCustomPronoun(""); // Clear custom pronoun if not selected
        }
    };

    const handleCustomPronounChange = (e) => {
        setCustomPronoun(e.target.value);
    };

    return (
        <div className="sidebar">
            <img src={profileInfo.bg || "/uploads/pastal_system_default_background.png"} alt="" className="sidebar__bg desktop-hide" />

            <div className={'sidebar__avatar ' + (isUploadAvatarLoading ? " skeleton-img" : "")}>
                <img src={profileInfo.avatar || "/uploads/pastal_system_default_avatar.png"} alt="" className={'sidebar__avatar__img '} />
                {
                    isProfileOwner && (<>
                        <svg onClick={handleAvatarClick} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 sidebar__avatar__ic">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75L7.409 10.591a2.25 2.25 0 013.182 0L15.75 15.75m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0L22.75 15.75m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zM12.75 8.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
                    </>)
                }
            </div>

            {openEditProfileForm ? (
                <div className="form edit-profile-form">
                    <div className="form-field required">
                        <label htmlFor="fullName" className="form-field__label">Họ và tên</label>
                        <input type="text" id="fullName" name="fullName" value={inputs?.fullName || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập họ và tên" />
                        {errors.fullName && <span className="form-field__error">{errors.fullName}</span>}
                    </div>
                    {
                        userInfo?.role == "talent" && (
                            <>
                                <div className="form-field">
                                    <label htmlFor="stageName" className="form-field__label">Nghệ danh</label>
                                    <input type="text" id="stageName" name="stageName" value={inputs?.stageName || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập nghệ danh" />
                                    {errors.stageName && <span className="form-field__error">{errors.stageName}</span>}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="jobTitle" className="form-field__label">Vị trí công việc</label>
                                    <input type="text" id="jobTitle" name="jobTitle" value={inputs?.jobTitle || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập vị trí công việc" />
                                    {errors.jobTitle && <span className="form-field__error">{errors.jobTitle}</span>}
                                </div>
                            </>

                        )
                    }


                    <div className="form-field">
                        <label htmlFor="pronoun" className="form-field__label">Pronoun</label>
                        <select
                            name="movementId"
                            value={pronoun || ""}
                            onChange={handlePronounChange}
                            className="form-field__input"
                        >
                            <option value="">Không đề cập</option>
                            <option value="him">Nam | Anh ấy</option>
                            <option value="her">Nữ  | Cô ấy</option>
                            <option value="her">Họ  | Họ</option>
                            <option value="custom">Custom</option>
                        </select>
                        {pronoun === "custom" && (
                            <input
                                type="text"
                                value={customPronoun}
                                onChange={handleCustomPronounChange}
                                className="form-field__input mt-8"
                                placeholder="Bạn muốn được gọi là?"
                            />
                        )}
                        {errors.pronoun && <span className="form-field__error">{errors.pronoun}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="address" className="form-field__label">Địa chỉ</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={inputs?.address || ""}
                            onChange={handleChange}
                            className="form-field__input"
                            placeholder="Nhập địa chỉ"
                        />
                        {errors.address && <span className="form-field__error">{errors.address}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="bio" className="form-field__label">Bio</label>
                        <textarea
                            type="text"
                            id="bio"
                            name="bio"
                            value={inputs.bio}
                            onChange={handleChange}
                            className="form-field__input"
                            placeholder="Giới thiệu ngắn gọn về bản thân (tối đa 150 kí tự)"
                        />
                        {errors.bio && <span className="form-field__error">{errors.bio}</span>}
                        <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                            {showEmojiPicker ? 'Hide Emojis' : 'Show Emojis'}
                        </button>
                        {showEmojiPicker && (
                            <EmojiPicker />
                            // <EmojiPicker onEmojiClick={onEmojiClick} />
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="socialLinks" className="form-field__label">Liên kết</label>
                        {socialLinks?.map((link, index) => (
                            // <div key={index} className="link-form">
                            <div className="form-field with-ic" key={index}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic ml-8">
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
                            // </div>
                        ))}
                        <div className="form-field with-ic add-link-btn btn" onClick={addLinkInput}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic add-link-btn__ic">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <span>Thêm liên kết</span>
                        </div>
                        {errors.socialLinks && <span className="form-field__error">{errors.socialLinks}</span>}
                    </div>

                    <div className="form-field">
                        {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
                    </div>

                    <div className="basic-info__button-container">
                        <button
                            type="submit"
                            className="sidebar__btn form-field__input btn btn-2 btn-md"
                            disabled={isSubmitSidebarInfoLoading}
                            onClick={handleSubmit}
                        >
                            {isSubmitSidebarInfoLoading ? (
                                <span className="btn-spinner"></span>
                            ) : (
                                "Lưu thay đổi"
                            )}
                        </button>
                        <button className="sidebar__btn btn btn-4 btn-md" onClick={() => setOpenEditProfileForm(false)}>Hủy</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="sidebar__name">
                        <p className="sidebar__name__fullName">{profileInfo.fullName}</p>
                        <span className="sidebar__name__stageName">{profileInfo.stageName}</span>
                    </div>
                    <div>
                        {profileInfo?.role === "talent" && profileInfo.jobTitle && (
                            <span className="sidebar__job-title">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                                </svg>
                                {profileInfo.jobTitle}
                            </span>
                        )}
                        {profileInfo.address && (
                            <span className="sidebar__location">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                                {profileInfo.address}
                            </span>
                        )}
                    </div>
                    {!isProfileOwner &&
                        (
                            <div className="flex-justify-center flex-align-center mt-16 mb-8">
                                <button className="btn btn-3 btn-md mr-16" onClick={handleOpenConversation}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                    Nhắn tin
                                </button>
                                {
                                    userFollowing.includes(profileInfo._id) ? (
                                        <button className="btn btn-2 btn-md" onClick={handleUnFollowUser}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                            Đã theo dõi
                                        </button>
                                    ) : (
                                        <button className="btn btn-2 btn-md" onClick={handleFollowUser}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                            </svg>
                                            Theo dõi
                                        </button>
                                    )
                                }
                            </div>
                        )

                    }
                    <br />

                    <div className="sidebar__follow">
                        <div className='flex-justify-center flex-align-center'>
                            <span className="sidebar__follow__follower hover-cursor-opacity hover-underline" onClick={() => { setOverlayVisible(true); setShowFollowers(true) }}>{profileInfo?.followers?.length === 0 ? "Chưa có người theo dõi" : `${profileInfo?.followers?.length} người theo dõi`}</span>
                            <span className="dot-delimiter sm ml-8 mr-8"></span>
                            <span className="sidebar__follow__following hover-cursor-opacity hover-underline">{profileInfo?.following?.length === 0 ? "Chưa theo dõi" : `${profileInfo?.following?.length} đang theo dõi`}</span>
                        </div>
                        <div className="flex-justify-center sidebar__follow__follow-container mt-8" style={{ 'margin-left': `${profileInfo?.followers?.length > 6 ? "72px" : profileInfo?.followers?.length * 12 + 'px'}` }}>
                            {
                                profileInfo?.followers?.slice(0, 6)?.reverse().map((follower, index) => {
                                    if (index == 5) {
                                        return <div index={index} className="user xm sidebar__follow__follow-item">
                                            <div className="user--left">
                                                <img src={resizeImageUrl(follower?.avatar, 50)} className="user__avatar" alt="Avatar" />
                                                <div className="overlay">
                                                    <span>{profileInfo?.followers.length - 4 > 0 ? "..." : ""}</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    return (
                                        <div index={index} className="user xm sidebar__follow__follow-item">
                                            <div className="user--left">
                                                <img src={follower?.avatar} className="user__avatar" alt="Avatar" />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    {profileInfo.bio && (
                        <div className="sidebar__section sidebar__bio">
                            <p className="sidebar__section__title">Bio</p>
                            <hr />
                            <p>{profileInfo.bio}</p>
                        </div>
                    )}

                    {profileInfo.socialLinks && profileInfo?.socialLinks?.length > 0 &&
                        <div className="sidebar__section sidebar__socials">
                            <p className="sidebar__section__title">Liên kết</p>
                            <hr />
                            <div className="sidebar__socials__link-container">
                                {socialLinksToShow.map((socialLink, key) => (
                                    <div key={key} className="sidebar__socials__link-item" dangerouslySetInnerHTML={{ __html: getSocialLinkIcon(socialLink) }}>
                                    </div>
                                ))}
                                {
                                    showAllSocialLinks &&
                                    (
                                        <div className="sidebar__socials__link-item" onClick={handleShowAllLinks}>
                                            <i>__ Ẩn bớt liên kết</i>
                                        </div>
                                    )
                                }
                                {
                                    !showAllSocialLinks && remainingLinksCount > 0 && (
                                        <div className="sidebar__socials__link-item" onClick={handleShowAllLinks}>
                                            <i>__ Hiển thị {remainingLinksCount} liên kết</i>
                                        </div>
                                    )
                                }
                            </div>

                        </div>}

                    {
                        isProfileOwner && (
                            <>
                                <button className="sidebar__btn btn btn-md btn-2" onClick={() => setOpenEditProfileForm(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>

                                    <span>Chỉnh sửa thông tin</span>
                                </button>

                                {
                                    profileInfo?.role != "talent" && (
                                        <button className="sidebar__btn btn btn-1" onClick={() => setOpenUpgradeAccountForm(true)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#726FFF" className="size-6">
                                                <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
                                            </svg>
                                            <span>Nâng cấp tài khoản</span>
                                        </button>
                                    )
                                }
                            </>
                        )
                    }
                </>
            )
            }
            {openUpgradeAccountForm && <UpgradeAccount closeModal={() => setOpenUpgradeAccountForm(false)} />}
            {overlayVisible &&
                <div className="overlay">
                    {showFollowers && <Follower followers={profileInfo?.followers} setShowFollowers={setShowFollowers} setOverlayVisible={setOverlayVisible} setProfileInfo={setProfileInfo} />}
                    {isCropping && (
                        <CropImage
                            imageSrc={selectedImage}
                            onCropComplete={handleCropComplete}
                            onCancel={handleCancelCrop}
                        />
                    )}
                    {croppedImage && <img src={croppedImage} alt="Cropped" />}
                </div>
            }
        </div >

    );
}