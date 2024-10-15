import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from '../../contexts/auth/AuthContext.jsx';
import { useQuery } from "react-query";

import UpgradeAccountImg from "../../assets/img/upgrade-account-img.png";
import { limitString, bytesToKilobytes, formatFloat } from "../../utils/formatter";
import { isFilled, minLength } from "../../utils/validator.js";
import { createFormData, apiUtils } from '../../utils/newRequest.js';
import "./UpgradeAccount.scss";

import { io } from 'socket.io-client';
import { useModal } from '../../contexts/modal/ModalContext.jsx';
import Loading from '../loading/Loading.jsx';

const UpgradeAccount = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const { socket } = useAuth();

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

    const [searchParams, setSearchParams] = useSearchParams();


    const {
        data: talentRequest,
        error,
        isError,
        isLoading,
    } = useQuery("fetchTalentRequest", fetchTalentRequest,
        {
            onSuccess: (data) => {
                console.log(data)
                if (["pending", "rejected", "approved"].includes(data?.status) && query.get("is-again") !== '1') {
                    const currentPath = window.location.pathname;
                    const newPath = currentPath.replace('/upgrade-account', '/render-talent-request');
                    navigate(`${newPath}`);
                }
                setLoading(false);
            },
            onError: (error) => {
                console.error('Error fetching notifications:', error);
            },
        });

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

    const [loading, setLoading] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateInputs();
        setIsSubmitUpgradeAccountLoading(true);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitUpgradeAccountLoading(false);
            return;
        }

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
                senderId: userInfo?._id,
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

    const UpgradeAccountRef = useRef();
    useEffect(() => {
        const handler = (e) => {
            if (UpgradeAccountRef.current && !UpgradeAccountRef.current.contains(e.target)) {
                closeModal();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    return (
        <div className="overlay">
            {loading ? (
                <Loading />
            ) : (
                <form className="form modal-form type-2 upgrade-account-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} ref={UpgradeAccountRef}>
                    <svg onClick={closeModal} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__close-ic">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    <div className="modal-form--left">
                        <h4 onClick={() => { setIsFeatureListVisible(!isFeatureListVisible) }} className="flex-space-between flex-align-center hover-cursor-opacity">
                            {
                                isFeatureListVisible ?
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                                    </svg> : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
                                        </svg>
                                    )}
                            <span className="ml-8 fs-16">Tính năng dành cho tài khoản họa sĩ</span>
                        </h4>
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
                            Họa sĩ thân mến,
                            <br />
                            Bạn vẫn có thể gửi yêu cầu để trải nghiệm các tính năng của tài khoản họa sĩ mà không cần cung cấp CMND/CCCD và mã số thuế cá nhân. Tuy nhiên, điều này là bắt buộc để có thể nhận đơn hàng và thực hiện giao dịch trên Pastal.
                            Đây là các thông tin bắt buộc mà các sàn thương mại điện tử trong nước đều phải cung cấp theo quy định của pháp luật hiện hành. Rất mong nhận được sự hợp tác từ bạn.
                            <br />
                            Pastal Team.
                        </p>

                        <p>Hướng dẫn tra cứu MST: <Link to="" className="highlight-text underlined-text">Tại đây</Link></p>

                    </div>

                    <div className="modal-form--right">

                        <h3 className="form__title">Nâng cấp tài khoản</h3>

                        {!["pending", "rejected"].includes(talentRequest) &&
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

                                    <div className="form-field required with-ic btn add-link-btn mt-8 mb-8" onClick={triggerFileInput}>
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
                                    <input type="text" id="cccd" name="cccd" value={inputs.cccd || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập CMND/CCCD" autoComplete="on" />
                                    {errors.cccd && <span className="form-field__error">{errors.cccd}</span>}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="taxCode" className="form-field__label">Mã số thuế</label>
                                    <span className="form-field__annotation">Mã số thuế cá nhân. Tra cứu <Link to="" className="highlight-text underlined-text">Tại đây</Link></span>
                                    <input type="text" id="taxCode" name="taxCode" value={inputs.taxCode || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập MST cá nhân" autoComplete="on" />
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
                                            <><span className="btn-spinner mr-8"></span> Đang tải</>
                                        ) : (
                                            "Gửi yêu cầu"
                                        )}
                                    </button>
                                </div>
                            </>
                        }
                    </div>
                </form >
            )}
        </div >
    );
};

export default UpgradeAccount;