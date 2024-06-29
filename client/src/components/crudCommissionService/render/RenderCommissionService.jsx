// Imports
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

// Components
import CreateCommissionOrder from "../../crudCommissionOrder/create/CreateCommissionOrder";

// Utils
import { apiUtils } from "../../../utils/newRequest";
import { formatCurrency } from "../../../utils/formatter";

// Styling
import "./RenderCommissionService.scss";

export default function RenderComissionService({ commissionServiceId, setShowRenderCommissionService, setOverlayVisible }) {
    if (!commissionServiceId) {
        return null;
    }

    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [showCreateCommissionOrder, setShowCreateCommissionOrder] = useState(false);

    const agreeTermsRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setInputs(prevState => ({
                ...prevState,
                [name]: checked
            }));
        } else {
            setInputs(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
        // Clear error
        setErrors((values) => ({ ...values, [name]: '' }));
    };

    const fetchCommissionService = async () => {
        try {
            const response = await apiUtils.get(`/commissionService/readCommissionService/${commissionServiceId}`);
            console.log(response.data.metadata.commissionService)
            console.log(commissionService)
            return response.data.metadata.commissionService;
        } catch (error) {
            return null;
        }
    }

    const { data: commissionService, error, isError, isLoading } = useQuery(
        ['fetchCommissionService'],
        fetchCommissionService,
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching service by ID:', error);
            },
        }
    );

    // Toggle display overlay box
    const renderCommissionServiceRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (renderCommissionServiceRef && renderCommissionServiceRef.current && !renderCommissionServiceRef.current.contains(e.target)) {
                setShowRenderCommissionService(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [setShowRenderCommissionService, setOverlayVisible]);

    const handleShowCreateCommissionOrderBtn = () => {
        if (!inputs.isAgreeTerms) {
            setErrors(prevErrors => ({
                ...prevErrors,
                isAgreeTerms: 'Vui lòng xác nhận đồng ý với điều khoản dịch vụ của họa sĩ'
            }));
            agreeTermsRef.current.scrollIntoView({ behavior: 'smooth' });
        } else {
            setShowCreateCommissionOrder(true);
            setOverlayVisible(true);
        }
    }

    if (isLoading) {
        return <span>Đang tải...</span>
    }

    if (isError) {
        return <span>Có lỗi xảy ra: {error.message}</span>
    }

    return (
        <>
            {
                !showCreateCommissionOrder ?

                    (
                        <div className="render-commission-service modal-form type-2" ref={renderCommissionServiceRef} onClick={(e) => { e.stopPropagation() }}>
                            <Link to="/help_center" className="form__help" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__help-ic">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                                </svg> Trợ giúp
                            </Link>
                            <svg onClick={() => { setShowRenderCommissionService(false); setOverlayVisible(false) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__close-ic">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>

                            <div className="modal-form--left">
                                {commissionService?.artworks?.length > 0 && (
                                    <Carousel
                                        showArrows
                                        infiniteLoop
                                        showThumbs
                                        dynamicHeight
                                    >
                                        {commissionService.artworks.map((artwork, index) => (
                                            <div key={index} className="render-commission-service__artwork-item">
                                                <img src={artwork} alt={`Artwork ${index + 1}`} />
                                            </div>
                                        ))}
                                    </Carousel>
                                )}
                            </div>

                            <div className="modal-form--right">
                                <span>{commissionService?.movementId?.title}</span>
                                <h2>{commissionService?.serviceCategoryId?.title}</h2>
                                <h4>Giá từ: <span className="highlight-text">{formatCurrency(commissionService?.minPrice)} VND</span></h4>
                                <hr />
                                <div className="user md">
                                    <div className="user--left">
                                        <img src={commissionService?.talentId?.avatar} alt="" className="user__avatar" />
                                        <div className="user__name">
                                            <div className="user__name__title">{commissionService?.talentId?.fullName}</div>
                                            <div className="user__name__sub-title">{commissionService?.talentId?.stageName}</div>
                                        </div>
                                    </div>
                                </div>
                                <p className="render-commission-service__owner-msg">
                                    Cảm ơn bạn đã ghé thăm dịch vụ của mình. Vui lòng đọc trước thông tin và điều khoản dịch vụ trước khi đặt comm giúp mình nhé.
                                </p>
                                <hr />

                                <h4>
                                    <strong>
                                        Bạn sẽ nhận được gì?
                                    </strong>
                                </h4>
                                <p className="border-text">{commissionService?.deliverables}</p>
                                <br />
                                <hr />

                                <h4>
                                    <strong>
                                        Điều khoản dịch vụ
                                    </strong>
                                </h4>
                                <p className="border-text">
                                    {commissionService?.termOfServiceId?.content && (
                                        <div dangerouslySetInnerHTML={{ __html: commissionService.termOfServiceId.content }} />
                                    )}
                                </p>
                                <div className="form-field" ref={agreeTermsRef}>
                                    <label className="form-field__label">
                                        <input
                                            type="checkbox"
                                            name="isAgreeTerms"
                                            checked={inputs.isAgreeTerms || false}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <span>Tôi đồng ý với các <a className="highlight-text" href="/terms_and_policies"> điều khoản dịch vụ </a> của Pastal</span>
                                    </label>
                                    {errors.isAgreeTerms && <span className="form-field__error">{errors.isAgreeTerms}</span>}
                                </div>
                            </div>

                            <button
                                className="btn btn-6 btn-md form__submit-btn"
                                onClick={handleShowCreateCommissionOrderBtn}
                            >
                                Đặt ngay
                            </button>
                        </div>
                    )
                    : (
                        <CreateCommissionOrder setShowCreateCommissionOrderForm={setShowCreateCommissionOrder} isDirect={true} commissionService={commissionService} />
                    )
            }
        </>
    );
}
