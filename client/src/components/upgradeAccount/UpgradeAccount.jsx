import { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import { useAuth } from '../../contexts/auth/AuthContext.jsx';
import { useQuery } from "react-query";

import UpgradeAccountImg from "../../assets/img/upgrade-account-img.png";
import { limitString, bytesToKilobytes, formatFloat } from "../../utils/formatter";
import { isFilled, minLength } from "../../utils/validator.js";
import { createFormData, apiUtils } from '../../utils/newRequest.js';
import "./UpgradeAccount.scss";

import { io } from 'socket.io-client';
import { useModal } from '../../contexts/modal/ModalContext.jsx';
const SOCKET_SERVER_URL = "http://localhost:8900"; // Update this with your server URL

import { useNavigate } from 'react-router-dom';
const UpgradeAccount = () => {
    const navigate = useNavigate();

    const { setModalInfo } = useModal();
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [artworks, setArtworks] = useState([]);
    const [isSubmitUpgradeAccountLoading, setIsSubmitUpgradeAccountLoading] = useState(false);
    const closeModal = () => {
        const currentPath = window.location.pathname;
        const newPath = currentPath.replace('/upgrade-account', '');
        navigate(newPath);
    };

    const fetchTalentRequest = async () => {
        try {
            const response = await apiUtils.get(`/talentRequest/readMyTalentRequest`);
            console.log(response.data.metadata.myTalentRequest)
            return response.data.metadata.myTalentRequest;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const {
        data: talentRequest,
        error,
        isError,
        isLoading,
    } = useQuery("fetchTalentRequest", fetchTalentRequest);

    const { id } = useParams();
    const { userInfo } = useAuth();

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
        setErrors((values) => ({ ...values, [name]: '' })); // Clear the error for this field
        validateInputs();
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newArtworks = [...artworks];

        files.forEach((file) => {
            if (file.size > 20000 * 1024) {
                setErrors((values) => ({ ...values, artworks: "Dung lượng ảnh không được vượt quá 5MB." }));
            } else if (newArtworks.length < 5) {
                newArtworks.push(file);
                setErrors((values) => ({ ...values, artworks: "" }));
            } else {
                setErrors((values) => ({ ...values, artworks: "Bạn có thể chọn tối đa 5 tác phẩm." }));
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

        if (isFilled(inputs.cccd)) {
            console.log(inputs.cccd)
            console.log(inputs.cccd.length)
            if (!(inputs.cccd.length == 9 || inputs.cccd.length == 12)) {
                errors.cccd = 'CMND hoặc CCCD không hợp lệ';
            }
        }

        if (artworks.length < 3) {
            errors.artworks = "Vui lòng cung cấp tối thiểu 3 tranh.";
        } else if (artworks.length > 5) {
            errors.artworks = "Vui lòng cung cấp tối đa 5 tranh.";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateInputs();
        setIsSubmitUpgradeAccountLoading(true);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitUpgradeAccountLoading(false);
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
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Yêu cầu nâng cấp tài khoản thành công"
                })
                closeModal()
            }

            socket.emit('sendTalentRequest', {
                senderId: "665929dd1937df564df71660",
                talentRequest: response.data.metadata.talentRequest,
            });
        } catch (error) {
            setModalInfo({
                status: "error",
                message: error.response.data.message
            })
            setErrors((values) => ({ ...values, serverError: error.response.data.message }));
        }
        setIsSubmitUpgradeAccountLoading(false);
    };


    const removeImage = (index) => {
        const newArtworks = [...artworks];
        newArtworks.splice(index, 1);
        setArtworks(newArtworks);
    };

    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    };
    const [isFeatureListVisible, setIsFeatureListVisible] = useState(true);

    return (
        <div className="overlay" onClick={closeModal}>
            {
                ["pending", "rejected"].includes(talentRequest) ? (
                    <form action="" className="modal-form type-3 upgrade-account-form">
                        <h3 className="form__title">Nâng cấp tài khoản</h3>

                        {talentRequest === "pending" &&
                            (
                                <div className="form-field">
                                    <p className="text-align-center">Admin đang xử lí yêu cầu nâng cấp tài khoản của bạn. <br />Trong thời gian đó, bạn có thể tham khảo cẩm nang họa sĩ <Link to="" className="highlight-text underlined-text">tại đây</Link>.</p>
                                    <button className="btn btn-2 btn-md mt-8 w-100" onClick={closeModal}>Tôi hiểu</button>
                                </div>
                            )
                        }

                        {talentRequest === "rejected" &&
                            (
                                <div className="form-field">
                                    <p className="text-align-center">Admin đã từ chối yêu cầu nâng cấp tài khoản của bạn.
                                        <br />
                                        <span>Lí do: {talentRequest?.rejectMessage}</span>
                                        <br /> Gửi lại yêu cầu <span className="highlight-text underlined-text">tại đây</span>.</p>
                                    <button className="form-field__input btn btn-2 btn-md mt-8" onClick={closeModal}>Tôi hiểu</button>
                                </div>
                            )
                        }
                    </form>
                ) : (
                    <form className="form modal-form type-2 upgrade-account-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                        <svg onClick={closeModal} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__close-ic">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        <div className="modal-form--left">
                            <h4 onClick={() => { setIsFeatureListVisible(!isFeatureListVisible) }} className="flex-space-between flex-align-center">
                                Tính năng dành cho tài khoản họa sĩ
                                {isFeatureListVisible ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-8 size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-8 size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                )}</h4>
                            <hr />
                            {
                                isFeatureListVisible && (
                                    <ul className="step-container">
                                        <li className="step-item flex-align-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-8">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                            </svg>
                                            Soạn thảo điều khoản dịch vụ
                                        </li>
                                        <li className="step-item flex-align-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-8">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                            </svg>
                                            Trưng bày dịch vụ
                                        </li>
                                        <li className="step-item flex-align-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-8">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                            </svg>
                                            Trưng bày tác phẩm
                                        </li>
                                        <li className="step-item flex-align-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-8">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                            </svg>
                                            Quản lí đơn hàng
                                        </li>
                                    </ul>
                                )
                            }
                            <p className='form__note text-align-justify mt-32'>
                                Các họa sĩ thân mến,
                                <br />
                                Bạn vẫn có thể nộp yêu cầu để trải nghiệm các tính năng của tài khoản họa sĩ mà không cần cung cấp CMND/CCCD và mã số thuế cá nhân. Tuy nhiên, điều này là bắt buộc để có thể nhận đơn hàng và thực hiện giao dịch trên Pastal.
                                Đây là các thông tin bắt buộc mà các sàn thương mại điện tử trong nước đều phải cung cấp theo quy định của pháp luật hiện hành. Rất mong nhận được sự hợp tác từ các bạn.
                                <br />
                                Trân trọng,
                                <br />
                                Pastal Team.
                            </p>

                            <p>Hướng dẫn tra cứu MST: <Link to="" className="highlight-text underlined-text">tại đây</Link></p>

                        </div>

                        <div className="modal-form--right">

                            <h3 className="form__title">Nâng cấp tài khoản</h3>


                            {talentRequest !== "pending" && talentRequest !== "rejected" &&

                                <>
                                    <div className="form-field required">
                                        <label htmlFor="stageName" className="form-field__label">Nghệ danh</label>
                                        <span className="form-field__annotation">Bạn muốn được gọi với nghệ danh là?</span>
                                        <input type="text" id="stageName" name="stageName" value={inputs.stageName || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập nghệ danh của bạn" autoComplete="on" />
                                        {errors.stageName && <span className="form-field__error">{errors.stageName}</span>}
                                    </div>
                                    <div className="form-field required">
                                        <label htmlFor="portfolioLink" className="form-field__label">Portfolio URL</label>
                                        <span className="form-field__annotation">Nhập đường dẫn đến hồ sơ họa sĩ của bạn (có thể là Facebook, Instagram, ...)</span>
                                        <input type="text" id="portfolioLink" name="portfolioLink" value={inputs.portfolioLink || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập URL đến hồ sơ họa sĩ của bạn" autoComplete="on" />
                                        {errors.portfolioLink && <span className="form-field__error">{errors.portfolioLink}</span>}
                                    </div>

                                    <div className="form-field required">
                                        <label htmlFor="jobTitle" className="form-field__label">Vị trí công việc</label>
                                        <span className="form-field__annotation">Bạn muốn được gọi với vai trò gì? (vd: Họa sĩ minh họa, ...)</span>
                                        <input type="text" id="jobTitle" name="jobTitle" value={inputs.jobTitle || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập vị trí công việc" autoComplete="on" />
                                        {errors.jobTitle && <span className="form-field__error">{errors.jobTitle}</span>}
                                    </div>

                                    <div className="form-field required">
                                        <label className="form-field__label">Tác phẩm</label>
                                        <span className="form-field__annotation">Cung cấp 3 - 5 tác phẩm có chữ kí của bạn (ảnh không vượt quá 5MB)</span>
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

                                        <div className="form-field required with-ic btn add-link-btn" onClick={triggerFileInput}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic add-link-btn__ic">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            <span>Thêm tác phẩm</span>

                                            <input type="file" id="file-input" style={{ display: "none" }} multiple accept="image/*" onChange={handleImageChange} className="form-field__input" />
                                        </div>

                                        {errors.artworks && <span className="form-field__error">{errors.artworks}</span>}
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="cccd" className="form-field__label">CMND/CCCD</label>
                                        <span className="form-field__annotation">CMND bao gồm 9 số hoặc CCCD bao gồm 12 số</span>
                                        <input type="text" id="cccd" name="cccd" value={inputs.cccd || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập vị trí công việc" autoComplete="on" />
                                        {errors.cccd && <span className="form-field__error">{errors.cccd}</span>}
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="taxCode" className="form-field__label">Mã số thuế</label>
                                        <span className="form-field__annotation">Mã số thuế cá nhân. Tra cứu <Link to="" className="highlight-text underlined-text">tại đây</Link></span>
                                        <input type="text" id="taxCode" name="taxCode" value={inputs.taxCode || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập vị trí công việc" autoComplete="on" />
                                        {errors.taxCode && <span className="form-field__error">{errors.taxCode}</span>}
                                    </div>


                                    <div className="form-field">
                                        {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
                                    </div>

                                    <div className="form__submit-btn-container">
                                        <button
                                            className="form__submit-btn-item form-field__input btn btn-2 btn-md"
                                            disabled={isSubmitUpgradeAccountLoading}
                                            onClick={handleSubmit}
                                        >
                                            {isSubmitUpgradeAccountLoading ? (
                                                <span className="btn-spinner"></span>
                                            ) : (
                                                "Gửi yêu cầu"
                                            )}
                                        </button>
                                    </div>
                                </>
                            }
                        </div>
                    </form >
                )
            }
        </div >
    );
};

export default UpgradeAccount;