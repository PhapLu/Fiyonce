// Imports
import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate, Outlet, useOutletContext } from "react-router-dom";
import { useQuery } from "react-query";
import { LazyLoadImage } from 'react-lazy-load-image-component';

// Contexts
import { useAuth } from "../../../contexts/auth/AuthContext";

// Styling
import "./RenderFinalDelivery.scss";
import { resizeImageUrl } from "../../../utils/imageDisplayer";
import ZoomImage from "../../zoomImage/ZoomImage";

export default function RenderFinalDelivery() {
    const { userInfo } = useAuth();
    const commissionOrder = useOutletContext();
    const isOrderOwner = commissionOrder?.memberId?._id === userInfo?._id;
    const isTalentChosen = commissionOrder?.talentChosenId?._id === userInfo?._id;

    const [showZoomImage, setShowZoomImage] = useState(false);
    const [zoomedImageSrc, setZoomedImageSrc] = useState();
    const navigate = useNavigate();

    const renderMilestonesRef = useRef();

    const closeRenderFinalDeliveryView = () => {
        navigate(`/order-history`);
    }

    useEffect(() => {
        let handler = (e) => {
            if (renderMilestonesRef && renderMilestonesRef.current && !renderMilestonesRef.current.contains(e.target)) {
                closeRenderFinalDeliveryView();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [navigate]);

    if (!commissionOrder || !isOrderOwner && !isTalentChosen) {
        return;
    }

    return (
        <div className="overlay">
            <div className="render-milestones modal-form type-3" ref={renderMilestonesRef} onClick={(e) => { e.stopPropagation() }}>
                <h2 className="form__title">Đơn hàng đã hoàn tất</h2>
                <svg onClick={closeRenderFinalDeliveryView} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 form__close-ic">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                <p className="highlight-bg-text green text-align-center">
                    Một phần lợi nhuận từ đơn hàng sẽ được trích ra để hỗ trợ tổ chức phi lợi nhuận <strong>Làng trẻ em SOS</strong>  😊
                </p>

                {
                    commissionOrder?.finalDelivery?.url &&
                    <div className="form-field">
                        <label htmlFor="" className="form-field__label">Đường dẫn</label>
                        <span>{commissionOrder?.finalDelivery?.url}</span>
                    </div>
                }
                {
                    commissionOrder?.finalDelivery?.note &&
                    <div className="form-field">
                        <label htmlFor="" className="form-field__label">Ghi chú</label>
                        <span>{commissionOrder?.finalDelivery?.note}</span>

                    </div>
                }

                {
                    commissionOrder?.finalDelivery?.files &&
                    <div className="form-field">
                        <label htmlFor="" className="form-field__label">Đính kèm</label>
                        <div className="reference-container">
                            {commissionOrder?.finalDelivery?.files?.map((file, index) => {
                                return (
                                    <div className="reference-item" key={index}>
                                        <LazyLoadImage onClick={() => { setShowZoomImage(true); setZoomedImageSrc(file) }} src={resizeImageUrl(file, 350)} alt="" effect="blur" />
                                    </div>
                                    // <img src={file} alt={index} className="reference-item" />
                                )
                            })}
                        </div>
                    </div>
                }

                <div className="form-field">
                    <Link to={`/order-history/commission-orders/${commissionOrder?._id}/review`} className="btn btn-2 btn-md w-100">Đi đến đánh giá</Link>
                </div>
            </div>
            {showZoomImage && <ZoomImage src={zoomedImageSrc} setShowZoomImage={setShowZoomImage} />}
        </div>
    )
}