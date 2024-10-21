// Imports
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

// Components
import CreateCommissionOrder from "../../crudCommissionOrder/create/CreateCommissionOrder";
import ZoomImage from "../../zoomImage/ZoomImage";
import Loading from '../../loading/Loading';

// Utils
import { apiUtils } from "../../../utils/newRequest";
import { formatCurrency } from "../../../utils/formatter";

// Styling
import "./RenderCommissionService.scss";
import { resizeImageUrl } from "../../../utils/imageDisplayer";

export default function RenderComissionService() {
    const { userId, "commission-service-id": commissionServiceId } = useParams();
    const {commissionService, commissionServiceCategories} = useOutletContext();
    console.log(commissionService)
    console.log(commissionServiceCategories)

    const [showRenderCommissionService, setShowRenderCommissionService] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [showCreateCommissionOrder, setShowCreateCommissionOrder] = useState(false);
    const [showZoomImage, setShowZoomImage] = useState(false);
    const [imageSource, setImageSource] = useState();
    const agreeTermsRef = useRef(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500); // Simulating a 500ms loading delay
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (renderCommissionServiceRef.current && !renderCommissionServiceRef.current.contains(e.target)) {
                navigate(-1);
                // userId ? `/users/${userId}/commission-services` : `/commission-services`
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [navigate, userId]);

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

    return (
        <div className="overlay">
            {loading ? (
                <Loading />
            ) : (
                !showCreateCommissionOrder ?
                    (
                        <div className="render-commission-service modal-form type-2" ref={renderCommissionServiceRef} onClick={(e) => { e.stopPropagation() }}>
                            <Link to="/help_center" className="form__help" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__help-ic">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                                </svg> Trợ giúp
                            </Link>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => navigate(-1)}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>

                            <div className="modal-form--left flex-align-center">
                                {commissionService?.artworks?.length > 0 && (
                                    <Carousel
                                        showArrows
                                        infiniteLoop
                                        showThumbs
                                        dynamicHeight
                                    >


                                        {commissionService.artworks.map((artwork, index) => (
                                            <div key={index} className="render-commission-service__artwork-item" onClick={() => { setImageSource(artwork); setShowZoomImage(true) }}>
                                                <img src={resizeImageUrl(artwork, 900)} alt={`Artwork ${index + 1}`} />
                                            </div>
                                        ))}
                                    </Carousel>
                                )}
                            </div>

                            <div className="modal-form--right">
                                <span>{commissionService?.movementId?.title}</span>
                                <h2>{commissionService?.title}</h2>
                                <h3>Giá từ: <span className="highlight-text fs-18">{formatCurrency(commissionService?.minPrice)} VND</span></h3>
                                <hr />
                                <Link to={`/users/${commissionService?.talentId?._id}/profile-commission-services`} className="user md">
                                    <div className="user--left">
                                        <img src={resizeImageUrl(commissionService?.talentId?.avatar, 100)} alt="" className="user__avatar" />
                                        <div className="user__name">
                                            <div className="user__name__title">{commissionService?.talentId?.fullName}</div>
                                            <span className="user__name__sub-title">{commissionService?.talentId?.stageName}</span>
                                        </div>
                                    </div>
                                </Link>
                                <div className="render-commission-service__owner-msg mt-12 mb-32">
                                    <span>
                                        Cảm ơn bạn đã ghé thăm dịch vụ của mình. Vui lòng đọc kĩ thông tin và điều khoản dịch vụ trước khi đặt commission giúp mình nhé.
                                    </span>
                                </div>

                                <div className=" mb-32">
                                    <h3 className="mb-12">
                                        <strong>
                                            Bạn sẽ nhận được gì?
                                        </strong>
                                    </h3>
                                    <div className="border-text">
                                        <span>
                                            {commissionService?.deliverables}
                                        </span>
                                    </div>
                                </div>

                                <div className=" mb-32">
                                    <h3 className="mb-12">
                                        <strong>
                                            Điều khoản dịch vụ
                                        </strong>
                                    </h3>
                                    <div className="border-text tos-content">
                                        <span>
                                            {commissionService?.termOfServiceId?.content && (
                                                <div dangerouslySetInnerHTML={{ __html: commissionService.termOfServiceId.content }} />
                                            )}
                                        </span>
                                    </div>
                                </div>


                                <div className="form-field" ref={agreeTermsRef}>
                                    <label className="form-field__label">
                                        <input
                                            type="checkbox"
                                            name="isAgreeTerms"
                                            checked={inputs.isAgreeTerms || false}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <span>Tôi đồng ý với các điều khoản dịch vụ của {commissionService?.talentId?.fullName}</span>
                                    </label>
                                    {errors.isAgreeTerms && <span className="form-field__error">{errors.isAgreeTerms}</span>}
                                </div>
                            </div>

                            <div className="form__submit-btn-container">
                                <button
                                    className="btn btn-2 btn-md form__submit-btn-item mobile-full-width-btn"
                                    onClick={handleShowCreateCommissionOrderBtn}
                                >
                                    Đặt ngay
                                </button>
                            </div>
                            {showZoomImage && <ZoomImage src={imageSource} setShowZoomImage={setShowZoomImage} />}
                        </div>
                    )
                    : (
                        <CreateCommissionOrder setShowCreateCommissionOrder={setShowCreateCommissionOrder} setOverlayVisible={setOverlayVisible} isDirect={true} commissionService={commissionService} />
                    )
            )}
        </div>
    );
}
