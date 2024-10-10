import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from '../../contexts/auth/AuthContext.jsx';
import { useQuery } from "react-query";

import SupplementTalentRequestImg from "../../assets/img/upgrade-account-img.png";
import { limitString, bytesToKilobytes, formatFloat } from "../../utils/formatter";
import { isFilled, minLength } from "../../utils/validator.js";
import { createFormData, apiUtils } from '../../utils/newRequest.js';
// import "./SupplementTalentRequest.scss";

import { io } from 'socket.io-client';
import { useModal } from '../../contexts/modal/ModalContext.jsx';
import Loading from '../loading/Loading.jsx';
const SOCKET_SERVER_URL = "http://localhost:8900"; // Update this with your server URL

const SupplementTalentRequest = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const { setModalInfo } = useModal();
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [artworks, setArtworks] = useState([]);
    const [isSubmitSupplementTalentRequestLoading, setIsSubmitSupplementTalentRequestLoading] = useState(false);
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
                if (["pending", "rejected"].includes(data.status) && query.get("is-again") !== '1') {
                    console.log("abc")
                    const currentPath = window.location.pathname;
                    const newPath = currentPath.replace('/supplement-talent-request', '/render-talent-request');
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

    const validateInputs = () => {
        let errors = {};
        if (isFilled(inputs.cccd)) {
            console.log(inputs.cccd)
            console.log(inputs.cccd.length)
            if (!(inputs.cccd.length == 9 || inputs.cccd.length == 12)) {
                errors.cccd = 'CMND hoặc CCCD không hợp lệ';
            }
        }

        return errors;
    };

    const [loading, setLoading] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateInputs();
        setIsSubmitSupplementTalentRequestLoading(true);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitSupplementTalentRequestLoading(false);
            return;
        }

        const socket = io(SOCKET_SERVER_URL, {
            withCredentials: true
        });

        socket.on('connect', () => {
            console.log('Connected to socket server:', socket.id);
            socket.emit('addUser', userInfo?._id);
        });

        try {
            const response = await apiUtils.post(`/talentRequest/requestSupplement`, inputs);
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
        setIsSubmitSupplementTalentRequestLoading(false);
    };


    const removeImage = (index) => {
        const newArtworks = [...artworks];
        newArtworks.splice(index, 1);
        setArtworks(newArtworks);
    };

    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    };

    const SupplementTalentRequestRef = useRef();
    useEffect(() => {
        const handler = (e) => {
            if (SupplementTalentRequestRef.current && !SupplementTalentRequestRef.current.contains(e.target)) {
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
            <form className="form modal-form type-3 upgrade-account-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} ref={SupplementTalentRequestRef}>
                <svg onClick={closeModal} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__close-ic">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                <h3 className="form__title">Bổ sung hồ sơ</h3>
                <div className="form-field">
                    <label htmlFor="cccd" className="form-field__label">CMND/CCCD</label>
                    <span className="form-field__annotation">CMND bao gồm 9 số hoặc CCCD bao gồm 12 số</span>
                    <input type="text" id="cccd" name="cccd" value={inputs.cccd || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập vị trí công việc" autoComplete="on" />
                    {errors.cccd && <span className="form-field__error">{errors.cccd}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="taxCode" className="form-field__label">Mã số thuế</label>
                    <span className="form-field__annotation">Mã số thuế cá nhân. Tra cứu <Link to="" className="highlight-text underlined-text">Tại đây</Link></span>
                    <input type="text" id="taxCode" name="taxCode" value={inputs.taxCode || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập vị trí công việc" autoComplete="on" />
                    {errors.taxCode && <span className="form-field__error">{errors.taxCode}</span>}
                </div>

                <div className="form-field">
                    {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
                </div>

                <div className="form__submit-btn-container">
                    <button
                        className="form__submit-btn-item form-field__input btn btn-2 btn-md"
                        disabled={isSubmitSupplementTalentRequestLoading}
                        onClick={handleSubmit}
                    >
                        {isSubmitSupplementTalentRequestLoading ? (
                            <><span className="btn-spinner mr-8"></span> Đang tải</>
                        ) : (
                            "Gửi yêu cầu"
                        )}
                    </button>
                </div>
            </form >
        </div >
    );
};

export default SupplementTalentRequest;