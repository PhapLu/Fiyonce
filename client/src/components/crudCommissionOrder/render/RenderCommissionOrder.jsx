// Imports
import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate, Outlet, useOutletContext } from "react-router-dom";
import { useQuery } from "react-query";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Contexts
import { useAuth } from "../../../contexts/auth/AuthContext";
import ZoomImage from "../../zoomImage/ZoomImage";

// Components
import RenderProposals from "../../crudProposal/render/RenderProposals";

// Styling
import "./RenderCommissionOrder.scss";
import { resizeImageUrl } from "../../../utils/imageDisplayer";
import { formatCurrency } from "../../../utils/formatter";
import { apiUtils } from "../../../utils/newRequest";

export default function RenderCommissionOrder() {
    const commissionOrder = useOutletContext();
    console.log(commissionOrder)
    const { userInfo } = useAuth();

    const [showZoomImage, setShowZoomImage] = useState(false);
    const [zoomedImageSrc, setZoomedImageSrc] = useState();

    const navigate = useNavigate();

    const renderCommissionServiceRef = useRef();

    const closeRenderCommissionOrderView = () => {
        navigate(-1);
        // navigate(commissionOrder?.isDirect ? `/order-history` : `/commission-market`);
    }

    useEffect(() => {
        let handler = (e) => {
            if (renderCommissionServiceRef && renderCommissionServiceRef.current && !renderCommissionServiceRef.current.contains(e.target)) {
                closeRenderCommissionOrderView();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [navigate]);

    const [isProcedureVisible, setIsProcedureVisible] = useState(true);

    const isOrderOwner = commissionOrder?.memberId?._id === userInfo?._id;
    const isTalentChosen = commissionOrder?.talentChosenId?._id === userInfo?._id;

    return (
        <>
            <div className="overlay">
                <div className="render-commission-order modal-form type-2" ref={renderCommissionServiceRef} onClick={(e) => { e.stopPropagation() }}>
                    <Link to="/help-center" className="form__help" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__help-ic">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                        </svg> Trợ giúp
                    </Link>

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                        closeRenderCommissionOrderView(false);
                    }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <div className="modal-form--left">
                        {
                            commissionOrder?.isDirect ? (
                                <>
                                    <div className={`status ${commissionOrder?.status}`}>
                                        <div className="status__title">
                                            {commissionOrder?.status === "pending"
                                                ?
                                                "Đang đợi họa sĩ xác nhận"
                                                : commissionOrder?.status === "approved"
                                                    ? "Đang đợi khách hàng thanh toán"
                                                    : commissionOrder?.status === "rejected"
                                                        ? "Họa sĩ đã từ chối"
                                                        : commissionOrder?.status === "confirmed"
                                                            ?
                                                            "Đã chọn họa sĩ và thanh toán"
                                                            : commissionOrder?.status === "canceled"
                                                                ?
                                                                "Khách hàng đã hủy đơn"
                                                                : commissionOrder?.status === "in_progress"
                                                                    ? "Họa sĩ đang thực hiện"
                                                                    : commissionOrder?.status === "delivered"
                                                                        ? "Họa sĩ đã bàn giao"
                                                                        : commissionOrder?.status === "finished"
                                                                            ?
                                                                            "Đã hoàn tất đơn hàng"
                                                                            : commissionOrder?.status === "under_processing"
                                                                                ? "Admin đang xử lí"
                                                                                : ""}
                                        </div>
                                    </div>

                                    <h3 className="mt-0 mb-8">{commissionOrder?.commissionServiceId?.title}</h3>
                                    <span>
                                        Do khách hàng đề xuất: <span className="highlight-text">{formatCurrency(commissionOrder?.minPrice)} - {formatCurrency(commissionOrder?.maxPrice)} VND</span>
                                    </span>
                                    <hr />
                                    {/* <h4>Do khách hàng đề xuất: <span className="highlight-text fs-16"> {(commissionOrder?.minPrice && formatCurrency(commissionOrder?.minPrice)) || "x"} VND</span></h4> */}

                                    <strong onClick={() => { setIsProcedureVisible(!isProcedureVisible) }} className="flex-space-between flex-align-center hover-cursor-opacity mt-32">
                                        {
                                            isProcedureVisible ?
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                                                </svg> : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
                                                    </svg>
                                                )} <span className="ml-8 fs-16">Thủ tục đặt tranh</span></strong>
                                    <hr />
                                    {
                                        isProcedureVisible && (
                                            <ul className="step-container">
                                                <li className="step-item checked">Khách hàng mô tả yêu cầu</li>
                                                <li className="step-item">Họa sĩ xác nhận và gửi proposal</li>
                                                <li className="step-item">Khách hàng thanh toán đặt cọc</li>
                                                <li className="step-item">Họa sĩ cập nhật tiến độ và bản thảo qua tin nhắn</li>
                                                <li className="step-item">Họa sĩ hoàn tất đơn hàng, khách hàng đánh giá chất lượng dịch vụ</li>
                                            </ul>
                                        )
                                    }
                                </>
                            ) : (
                                <>
                                    <div className={`status ${commissionOrder?.status}`}>
                                        <div className="status__title">
                                            {
                                                commissionOrder?.talentChosenId ? (
                                                    "Đã chọn họa sĩ và thanh toán"
                                                ) : (
                                                    `${commissionOrder?.proposalsCount || 0} họa sĩ đã ứng`
                                                )
                                            }
                                        </div>
                                    </div>
                                    <h4>Đặt hàng trên Chợ Commission</h4>

                                    <div className="user md">
                                        <Link to={`/users/${commissionOrder?.memberId._id}`} className="user--left hover-cursor-opacity">
                                            <img src={resizeImageUrl(commissionOrder?.memberId?.avatar, 50)} alt="" className="user__avatar" />
                                            <div className="user__name">
                                                <div className="fs-14">{commissionOrder?.memberId?.fullName}</div>
                                            </div>
                                        </Link>
                                    </div>

                                    <strong onClick={() => { setIsProcedureVisible(!isProcedureVisible) }} className="flex-space-between flex-align-center hover-cursor-opacity mt-32">
                                        {
                                            isProcedureVisible ?
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                                                </svg> : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
                                                    </svg>
                                                )} <span className="ml-8 fs-16">Thủ tục đăng yêu cầu tìm họa sĩ</span></strong>
                                    <hr />
                                    {
                                        isProcedureVisible && (
                                            <ul className="step-container">
                                                <li className="step-item checked">Khách hàng mô tả yêu cầu</li>
                                                <li className="step-item checked">Các họa sĩ gửi proposal</li>
                                                <li className="step-item checked">Khách hàng chọn ra họa sĩ phù hợp nhất và thanh toán đặt cọc</li>
                                                <li className="step-item">Họa sĩ cập nhật tiến độ và bản thảo qua tin nhắn</li>
                                                <li className="step-item">Họa sĩ hoàn tất đơn hàng, khách hàng đánh giá chất lượng dịch vụ</li>
                                            </ul>
                                        )
                                    }
                                </>
                            )
                        }
                        <br />
                        <div className="form__note">
                            <p>
                                <strong>*Lưu ý:</strong>
                                <br />
                                Vui lòng bật thông báo Gmail để cập nhật thông tin mới nhất về đơn hàng{isOrderOwner ? " của bạn" : ""}.
                            </p>
                        </div>
                    </div >
                    <div className="modal-form--right">
                        <h2 className="form__title">Thông tin đơn hàng</h2>
                        <div className="form-field">
                            <label htmlFor="description" className="form-field__label">Mô tả</label>
                            <span>{commissionOrder?.description}</span>
                        </div>

                        <div className="form-field">
                            <label htmlFor="references" className="form-field__label">Nguồn tham khảo</label>
                            <div className="reference-container">
                                {commissionOrder?.references.map((reference, index) => {
                                    return (
                                        <div className="reference-item" key={index}>
                                            <LazyLoadImage onClick={() => { setShowZoomImage(true); setZoomedImageSrc(reference) }} src={resizeImageUrl(reference, 350)} alt="" effect="blur" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="usage" className="form-field__label">Nhu cầu sử dụng</label>
                            <span>{commissionOrder?.usage === "personal" ? "Mục đích cá nhân" : "Mục đích thương mại"}</span>
                        </div>

                        <div className="form-field">
                            <label htmlFor="isPrivate" className="form-field__label">Riêng tư?</label>
                            <span>{commissionOrder?.isPrivate ? "Không cho phép họa sĩ sử dụng tranh vẽ cho bạn để quảng bá hình ảnh của họ" : "Cho phép họa sĩ sử dụng tranh vẽ cho bạn để quảng bá hình ảnh của họ"}</span>
                        </div>

                        <div className="form-field">
                            <label htmlFor="fileFormats" className="form-field__label">Định dạng file</label>
                            <span>{commissionOrder?.fileFormats?.length > 0 ? (
                                commissionOrder?.fileFormats.join(", ")
                            ) : (
                                "Không yêu cầu"
                            )}</span>
                        </div>

                        <div className="form-field">
                            <label htmlFor="fileFormats" className="form-field__label">Mức giá khách hàng đề xuất</label>
                            <div>
                                <span className="highlight-text fw-bold fs-14">{formatCurrency(commissionOrder?.minPrice)} - {formatCurrency(commissionOrder?.maxPrice)} VND</span>
                            </div>
                        </div>

                        <div className="form__submit-btn-container">
                            {
                                isOrderOwner && !commissionOrder?.talentChosenId && (
                                    <Link to={`${location.pathname.includes("commission-market") ? "/commission-market" : "/order-history"}/commission-orders/${commissionOrder?._id}/update`} className="form__submit-btn-item btn btn-2 btn-md">Cập nhật</Link>
                                )
                            }
                            {
                                // (isOrderOwner || commissionOrder?.isDirect === false) && (
                                <Link to={`${location.pathname.includes("commission-market") ? "/commission-market" : "/order-history"}/commission-orders/${commissionOrder?._id}/proposals`} className="form__submit-btn-item btn btn-2 btn-md">Xem hồ sơ ({commissionOrder?.proposalsCount || "0"})</Link>
                                // )
                            }
                            {
                                commissionOrder?.isDirect ? (
                                    isTalentChosen && (<Link to={`${location.pathname.includes("commission-market") ? "/commission-market" : "/order-history"}/commission-orders/${commissionOrder?._id}/create-proposal`} className="form__submit-btn-item btn btn-2 btn-md">Tạo hợp đồng</Link>)
                                ) : (
                                    !isOrderOwner && userInfo?.role == "talent") && (
                                    <Link to={`${location.pathname.includes("commission-market") ? "/commission-market" : "/order-history"}/commission-orders/${commissionOrder?._id}/create-proposal`} className="form__submit-btn-item btn btn-2 btn-md">Ứng commission</Link>
                                )
                            }
                        </div>
                    </div>
                    {showZoomImage && <ZoomImage src={zoomedImageSrc} setShowZoomImage={setShowZoomImage} />}
                </div>
            </div >

            <Outlet />
        </>
    )
}