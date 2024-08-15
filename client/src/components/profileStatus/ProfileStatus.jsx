import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/auth/AuthContext';
import EmojiPicker from '../emojiPicker/EmojiPicker'; // Update the path as needed
import { codePointToEmoji } from '../../utils/iconDisplayer';
import { useModal } from '../../contexts/modal/ModalContext';
import { apiUtils } from '../../utils/newRequest';
import "./ProfileStatus.scss"

export default function EditProfileStatus({ profileInfo, setProfileInfo, setShowProfileStatus, setOverlayVisible }) {
    const { userInfo, setUserInfo } = useAuth();
    const { setModalInfo } = useModal();
    const [status, setStatus] = useState({
        icon: userInfo?.profileStatus?.icon || '',
        title: userInfo?.profileStatus.title || ''
    });
    const [errors, setErrors] = useState();

    const [isSubmitProfileStatusLoading, setIsSubmitProfileStatusLoading] = useState(false);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const profileStatusRef = useRef();
    useEffect(() => {
        const handler = (e) => {
            if (profileStatusRef.current && !profileStatusRef.current.contains(e.target)) {
                setShowProfileStatus(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStatus(prevStatus => ({
            ...prevStatus,
            [name]: value
        }));
    };

    const handleEmojiClick = (emoji) => {
        setStatus(prevStatus => ({
            ...prevStatus,
            icon: emoji
        }));
        setShowEmojiPicker(false);
    };

    const validateInputs = () => {
        let errors = {};
        if (status.title || status.icon) {
            if (!status.title) {
                errors.title = "Bạn cảm thấy như thế nào?";
            }

            if (!status.icon) {
                errors.icon = "Hãy chọn một emoji";
            }
        }

        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitProfileStatusLoading(true);
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitProfileStatusLoading(false);
            return;
        }

        try {
            const response = await apiUtils.patch("/user/updateProfileStatus", status)
            if (response) {
                setUserInfo({ ...userInfo, profileStatus: response.data.metadata.profileStatus })
                // setProfileInfo({ ...profileInfo, profileStatus: response.data.metadata.profileStatus })
                setShowEmojiPicker(false);
                setOverlayVisible(false);
                setModalInfo({
                    status: "success",
                    message: "Cập nhật trạng thái thành công"
                });
            }
        } catch (error) {
            console.log(error);
            setModalInfo({
                status: "error",
                message: error.response.data.message
            });
        }
        setIsSubmitProfileStatusLoading(false);
    };

    const handleClearStatus = () => {
        setStatus({
            icon: '',
            title: ''
        });
    };

    const toggleEmojiPicker = () => setShowEmojiPicker(prev => !prev);

    return (
        <div className="profile-status modal-form type-3" ref={profileStatusRef} onClick={(e) => { e.stopPropagation() }}>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowProfileStatus(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <h3 className="form__title">Cập nhật trạng thái</h3>

            <div className="form-field mt-16 mb-32">
                <label htmlFor="emoji" className="form-field__label">Trạng thái</label>
                <div className="form-field with-ic">
                    <div className='show-emoji-btn'>
                        <button className="btn non-hover" type="button" onClick={toggleEmojiPicker}>
                            <span style={{ fontSize: '24px' }}>{status.icon ? codePointToEmoji(status.icon) : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                            </svg>
                            }</span> {/* Display the selected emoji or a default one */}
                        </button>
                        {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} onClickOutside={() => setShowEmojiPicker(false)} />}
                    </div>
                    <hr className='vertical-hr' />
                    <input type="text" name="title" value={status.title} onChange={handleChange} className="form-field__input" placeholder='Bạn đang cảm thấy thế nào?' />
                </div>
                {errors?.icon && <span className="form-field__error">{errors?.icon}</span>}
                {errors?.title && <span className="form-field__error">{errors?.title}</span>}
            </div>
            <div className="form__submit-btn-container half-split">
                <button
                    type="button"
                    className="form__submit-btn-item btn btn-4 btn-md"
                    onClick={handleClearStatus}
                >
                    Đặt lại
                </button>

                <button
                    type="submit"
                    className="form__submit-btn-item btn btn-2 btn-md"
                    onClick={handleSubmit}
                    disabled={isSubmitProfileStatusLoading}
                >
                    {isSubmitProfileStatusLoading ? (
                        <span className="btn-spinner"></span>
                    ) : (
                        "Xác nhận"
                    )}
                </button>

            </div>
        </div>
    );
}