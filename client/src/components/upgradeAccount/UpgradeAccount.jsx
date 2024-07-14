import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useAuth } from '../../contexts/auth/AuthContext.jsx';

import UpgradeAccountImg from "../../assets/img/upgrade-account-img.png";
import { limitString, bytesToKilobytes, formatFloat } from "../../utils/formatter";
import { isFilled, minLength } from "../../utils/validator.js";
import { createFormData, apiUtils } from '../../utils/newRequest.js';
import "./UpgradeAccount.scss";

import { io } from 'socket.io-client';
const SOCKET_SERVER_URL = "http://localhost:8900"; // Update this with your server URL

const UpgradeAccount = ({ closeModal }) => {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [artworks, setArtworks] = useState([]);
    const [talentRequestStatus, setTalentRequestStatus] = useState();
    const { id } = useParams();

    const { userInfo } = useAuth();

    useEffect(() => {
        async function fetchTalentRequestStatus() {
            try {
                const response = await apiUtils.get("talentRequest/readTalentRequestStatus");
                // setTalentRequestStatus(response.data.metadata.talentRequestStatus);
                return response;
            } catch (error) {
                return error;
            }
        }
        fetchTalentRequestStatus();
    })
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
        setErrors((values) => ({ ...values, [name]: '' })); // Clear the error for this field
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newArtworks = [...artworks];

        files.forEach((file) => {
            if (file.size > 500 * 1024) {
                setErrors((values) => ({ ...values, artworks: "Dung lượng ảnh không được vượt quá 500KB." }));
            } else if (newArtworks.length < 7) {
                newArtworks.push(file);
                setErrors((values) => ({ ...values, artworks: "" }));
            } else {
                setErrors((values) => ({ ...values, artworks: "Bạn có thể chọn tối đa 3 tác phẩm." }));
            }
        });
        setArtworks(newArtworks);
    };

    const validateInputs = () => {
        let errors = {};
        if (!isFilled(inputs.stageName)) {
            errors.stageName = 'Vui lòng nhập nghệ danh';
        } else if (!minLength(inputs.stageName, 4)) {
            errors.stageName = 'Nghệ danh phải có ít nhất 4 ký tự';
        }

        if (!isFilled(inputs.portfolioLink)) {
            errors.portfolioLink = 'Vui lòng nhập đường dẫn đến hồ sơ của bạn';
        }

        if (!isFilled(inputs.jobTitle)) {
            errors.jobTitle = 'Vui lòng nhập đường dẫn đến hồ sơ của bạn';
        }


        if (artworks.length < 3) {
            errors.artworks = "Vui lòng cung cấp tối thiểu 3 tranh.";
        } else if (artworks.length < 3) {
            errors.artworks = "Vui lòng cung cấp tối thiểu tối đa 5 tranh.";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const socket = io(SOCKET_SERVER_URL, {
            withCredentials: true
        });

        socket.on('connect', () => {
            console.log('Connected to socket server:', socket.id);

            // Add user to socket (for demonstration, assuming userId is 1)
            socket.emit('addUser', "665929dd1937df564df71660");
        });

        try {
            const formData = createFormData(inputs, "files", artworks);
            const response = await apiUtils.post(`/talentRequest/requestUpgradingToTalent`, formData);
            console.log(response);
            if (response) {
                alert("Successfully request for upgrading account")
                closeModal()
            }


            socket.emit('sendTalentRequest', {
                senderId: "665929dd1937df564df71660",
                talentRequest: response.data.metadata.talentRequest,
            });
        } catch (error) {
            console.log("Error")
            console.log(error);
            console.log(error.response.data.message);
            setErrors((values) => ({ ...values, serverError: error.response.data.message }));
        }
    };


    const removeImage = (index) => {
        const newArtworks = [...artworks];
        newArtworks.splice(index, 1);
        setArtworks(newArtworks);
    };

    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    };

    return (
        <div className="overlay" onClick={closeModal}>
            <form className="form modal-form type-3 upgrade-account-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                <svg onClick={closeModal} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__close-ic">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                <h3 className="form__title">Nâng cấp tài khoản</h3>
                {talentRequestStatus === "pending" &&
                    (
                        <div className="form-field">
                            <p className="text-align-center">Admin đang xử lí yêu cầu nâng cấp tài khoản của bạn. <br />Trong thời gian đó, bạn có thể tham khảo cẩm nang họa sĩ <span className="highlight-text">tại đây</span>.</p>
                            <button className="form-field__input btn btn-2 btn-md" onClick={closeModal}>Tôi hiểu</button>
                        </div>
                    )
                }
                {talentRequestStatus === "rejected" &&
                    (
                        <div className="form-field">
                            <p className="text-align-center">Admin đã từ chối yêu cầu nâng cấp tài khoản của bạn. <br /> Gửi lại yêu cầu <span className="highlight-text">tại đây</span>.</p>
                            <button className="form-field__input btn btn-2 btn-md" onClick={closeModal}>Tôi hiểu</button>
                        </div>
                    )
                }

                {talentRequestStatus !== "pending" && talentRequestStatus !== "rejected" &&

                    <>
                        <div className="form-field">
                            <label htmlFor="stageName" className="form-field__label">Nghệ danh</label>
                            <span className="form-field__annotation">Bạn muốn được gọi với nghệ danh là?</span>
                            <input type="text" id="stageName" name="stageName" value={inputs.stageName || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập nghệ danh của bạn" autoComplete="on" />
                            {errors.stageName && <span className="form-field__error">{errors.stageName}</span>}
                        </div>
                        <div className="form-field">
                            <label htmlFor="portfolioLink" className="form-field__label">Portfolio URL</label>
                            <span className="form-field__annotation">Nhập đường dẫn đến hồ sơ họa sĩ của bạn (có thể là Facebook, Instagram, ...)</span>
                            <input type="text" id="portfolioLink" name="portfolioLink" value={inputs.portfolioLink || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập URL đến hồ sơ họa sĩ của bạn" autoComplete="on" />
                            {errors.portfolioLink && <span className="form-field__error">{errors.portfolioLink}</span>}
                        </div>

                        <div className="form-field">
                            <label htmlFor="jobTitle" className="form-field__label">Vị trí công việc</label>
                            <span className="form-field__annotation">Bạn muốn được gọi với vai trò gì?</span>
                            <input type="text" id="jobTitle" name="jobTitle" value={inputs.jobTitle || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập vị trí công việc" autoComplete="on" />
                            {errors.jobTitle && <span className="form-field__error">{errors.jobTitle}</span>}
                        </div>

                        <div className="form-field">
                            <label className="form-field__label">Tác phẩm</label>
                            <span className="form-field__annotation">Cung cấp 3 - 5 tác phẩm có chữ kí của bạn</span>
                            <div className="form-field">
                                {artworks.map((artwork, index) => (
                                    <div key={index} className="form-field__input img-preview">
                                        <div className="img-preview--left">
                                            <img src={URL.createObjectURL(artwork)} alt={`Artwork ${index + 1}`} className="img-preview__img" />
                                            <div className="img-preview__info">
                                                <span className="img-preview__name">{limitString(artwork.name, 15)}</span>
                                                <span className="img-preview__size">{formatFloat(bytesToKilobytes(artwork.size), 1)} KB</span>
                                            </div>
                                        </div>
                                        <div className="img-preview--right">
                                            <svg onClick={() => removeImage(index)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 img-preview__close-ic">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="form-field with-ic add-link-btn" onClick={triggerFileInput}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic add-link-btn__ic">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                <span>Thêm tác phẩm</span>

                                <input type="file" id="file-input" style={{ display: "none" }} multiple accept="image/*" onChange={handleImageChange} className="form-field__input" />
                            </div>

                            {errors.artworks && <span className="form-field__error">{errors.artworks}</span>}
                        </div>
                        <div className="form-field">
                            {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
                        </div>

                        <div className="form-field">
                            <input type="submit" value="Gửi yêu cầu" className="form-field__input btn btn-2 btn-md" />
                        </div>
                    </>
                }
            </form>
        </div>
    );
};

export default UpgradeAccount;