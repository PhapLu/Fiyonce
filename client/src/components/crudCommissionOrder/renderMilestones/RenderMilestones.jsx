// Imports
import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate, Outlet, useOutletContext } from "react-router-dom";
import { useQuery } from "react-query";
import { LazyLoadImage } from 'react-lazy-load-image-component';

// Contexts
import { useAuth } from "../../../contexts/auth/AuthContext";

// Styling
import "./RenderMilestones.scss";

export default function RenderMilestones() {
    const { userInfo } = useAuth();
    const commissionOrder = useOutletContext();
    const isOrderOwner = commissionOrder?.memberId?._id === userInfo._id;
    const isTalentChosen = commissionOrder?.talentChosenId?._id === userInfo._id;

    const [showZoomImage, setShowZoomImage] = useState(false);
    const [zoomedImageSrc, setZoomedImageSrc] = useState();
    const navigate = useNavigate();


    const renderMilestonesRef = useRef();

    const closeRenderMilestonesView = () => {
        navigate(`/order-history`);
    }

    useEffect(() => {
        let handler = (e) => {
            if (renderMilestonesRef && renderMilestonesRef.current && !renderMilestonesRef.current.contains(e.target)) {
                closeRenderMilestonesView();
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
                <h2 className="form__title">Tiến độ công việc</h2>
                <svg onClick={closeRenderMilestonesView} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 form__close-ic">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                <div className="milestone-container">
                    {
                        commissionOrder?.milestones?.length > 0 ?
                            commissionOrder?.milestones?.map((milestone) => {
                                return (
                                    <div className="milestone-item">
                                        <strong className="milestone-item__title fw-bold">{milestone.title}</strong>
                                        {milestone?.url && <p className="milestone-item__link">Link: {milestone.url}</p>}
                                        {
                                            milestone?.note &&
                                            <p className="milestone-item__note">Ghi chú: {milestone?.note}</p>
                                        }
                                        <div className="milestone-item__image-container reference-container">
                                            {milestone?.files?.map((file, index) => {
                                                return (
                                                    <div className="reference-item" key={index}>
                                                        <LazyLoadImage onClick={() => { setShowZoomImage(true); setZoomedImageSrc(file) }} src={resizeImageUrl(file.files, 350)} alt="" effect="blur" />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )
                            })
                            :
                            <p className="text-align-center mb-24">Hiện họa sĩ chưa cập nhật bản thảo cho đơn hàng này. Pastal kính chúc quý khách hàng và họa sĩ trao đổi và làm việc luôn suôn sẻ nhé <span className="fs-18">😊</span></p>
                    }
                </div>

                {isTalentChosen && <Link to={`/order-history/commission-orders/${commissionOrder?._id}/create-milestone`} className="btn btn-2 btn-md w-100">Thêm tiến độ</Link>}
            </div>
            {showZoomImage && <ZoomImage src={zoomedImageSrc} setShowZoomImage={setShowZoomImage} />}
        </div>
    )
}