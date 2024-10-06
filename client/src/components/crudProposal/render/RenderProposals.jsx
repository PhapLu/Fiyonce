// Imports
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams, useLocation, useOutletContext } from "react-router-dom";
import { useQuery } from "react-query";

// Contexts

// Components

// Utils
import { formatCurrency, formatTimeAgo, limitString } from "../../../utils/formatter";

// Styling
import "./RenderProposals.scss"
import { apiUtils } from "../../../utils/newRequest";
import { resizeImageUrl } from "../../../utils/imageDisplayer";
import { useConversation } from "../../../contexts/conversation/ConversationContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ZoomImage from "../../zoomImage/ZoomImage";
import { useAuth } from "../../../contexts/auth/AuthContext";


export default function RenderProposals() {
    const navigate = useNavigate();
    const location = useLocation();
    const commissionOrder = useOutletContext();

    const { userInfo } = useAuth();
    const { setOtherMember } = useConversation();

    const [isProcedureVisible, setIsProcedureVisible] = useState(false);
    const [imageSrc, setImageSrc] = useState();
    const [showZoomImage, setShowZoomImage] = useState(false);

    const fetchProposals = async () => {
        try {
            const response = await apiUtils.get(`/proposal/readProposals/${commissionOrder?._id}`);
            console.log(response)
            return response.data.metadata.proposals;
        } catch (error) {
            return null;
        }
    }

    const { data: proposals, fetchingProposalsError, isFetchingProposalsError, isFetchingProposalsLoading } = useQuery(
        ['fetchProposals'],
        () => fetchProposals(), // Pass a function that calls 
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching proposals by Order ID:', error);
            },
        }
    );


    const closeRenderProposalsView = () => {
        if (location.pathname.includes("commisison-market")) {
            navigate("/commission-market")
        } else {
            navigate("/order-history")
        }
    }

    const renderProposalsRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (renderProposalsRef && renderProposalsRef.current && !renderProposalsRef.current.contains(e.target)) {
                closeRenderProposalsView();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [navigate]);

    if (isFetchingProposalsError) {
        return fetchingCommissionOrderError;
    }

    if (isFetchingProposalsLoading) {
        return <div className="loading-spinner" />;
    }

    const isOrderOwner = commissionOrder?.memberId?._id === userInfo._id;
    return (
        <div className="overlay">
            <div className="render-proposals modal-form type-2" ref={renderProposalsRef} onClick={(e) => { e.stopPropagation() }}>
                <Link to="/help-center" className="form__help" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__help-ic">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                    </svg> Trợ giúp
                </Link>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                    closeRenderProposalsView();
                }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>



                <div className="modal-form--left">
                    <div className="btn btn-3 br-16 btn-sm gray-bg-hover mb-12" onClick={() => { navigate(-1) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                        </svg>
                        Quay lại
                    </div>
                    <br />
                    <div className={`status ${commissionOrder?.status}`}>
                        <div className="status__title">
                            {
                                commissionOrder?.isDirect ?

                                    commissionOrder?.status === "pending"
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
                                                            : commissionOrder?.status === "finished"
                                                                ?
                                                                "Đã hoàn tất đơn hàng"
                                                                : commissionOrder?.status === "under_processing"
                                                                    ? "Admin đang xử lí"
                                                                    : ""
                                    : (
                                        commissionOrder?.status === "pending"
                                            ?
                                            `${commissionOrder?.proposalsCount || 0} họa sĩ đã ứng`
                                            : commissionOrder?.status === "approved"
                                                ? "Đang đợi khách hàng thanh toán"
                                                : commissionOrder?.status === "rejected"
                                                    ? "Họa sĩ đã từ chối"
                                                    : commissionOrder?.status === "confirmed"
                                                        ?
                                                        "Đã chọn họa sĩ và thanh toán"
                                                        : commissionOrder?.status === "canceled"
                                                            ? "Khách hàng đã hủy đơn"
                                                            : commissionOrder?.status === "in_progress"
                                                                ? "Họa sĩ đang thực hiện"
                                                                : commissionOrder?.status === "finished"
                                                                    ?
                                                                    "Đã hoàn tất đơn hàng"
                                                                    : commissionOrder?.status === "under_processing"
                                                                        ? "Admin đang xử lí"
                                                                        : ""

                                    )
                            }
                        </div>
                    </div>

                    <div className="user md mt-16">
                        <Link to={`/users/${commissionOrder?.memberId._id}`} className="user--left hover-cursor-opacity">
                            <img src={resizeImageUrl(commissionOrder?.memberId?.avatar, 50)} alt="" className="user__avatar" />
                            <div className="user__name">
                                <div className="fs-14">{commissionOrder?.memberId?.fullName}</div>
                            </div>
                        </Link>
                    </div>

                    {
                        commissionOrder?.isDirect ? (
                            <>
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
                                <h4 onClick={() => { setIsProcedureVisible(!isProcedureVisible) }} className="flex-space-between flex-align-center">
                                    Thủ tục đăng yêu cầu tìm họa sĩ
                                    {isProcedureVisible ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                    </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    )}</h4>
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
                            Vui lòng bật thông báo Gmail để cập nhật thông tin mới nhất về đơn hàng của bạn.
                        </p>
                    </div>
                </div>

                <div className="modal-form--right">
                    <h2 className="form__title">Danh sách hồ sơ</h2>
                    <p>Dưới đây là danh sách hồ sơ mà các họa sĩ đã nộp dựa trên yêu cầu của {isOrderOwner ? "bạn" : commissionOrder?.memberId?.fullName}. Các họa sĩ vẫn có thể nộp hồ sơ cho đến khi {isOrderOwner ? "bạn" : commissionOrder?.memberId?.fullName} chọn được họa sĩ phù hợp nhất.</p>
                    <hr />
                    <div className="proposal-container">{
                        proposals?.length > 0 ? proposals.map((proposal, index) => {
                            return (
                                <div className="proposal-item" key={index}>
                                    <div className="user md">
                                        <LazyLoadImage effect="blur" src={proposal.talentId.avatar} alt={proposal.talentId.fullName} className="user__avatar" />
                                        <div className="user__name">
                                            <div className="user__name__title">{proposal.talentId.fullName}</div>
                                            <div className="user__name__subtitle">
                                                {formatTimeAgo(proposal.createdAt)}
                                            </div>
                                        </div>
                                    </div>

                                    <p>Họa sĩ đề xuất: <span className="highlight-text">{formatCurrency(proposal.price)} VND</span></p>
                                    <p>{limitString(proposal.scope, 250)}</p>
                                    <div className="reference-container mb-8">
                                        {proposal.artworks.map((artwork, index) => {
                                            return (
                                                <div key={index} className="reference-item" onClick={() => { setImageSrc(artwork?.url); setShowZoomImage(true) }}>
                                                    <LazyLoadImage effect="blur" src={artwork?.url} alt="" />
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div>
                                        <Link to={`${location.pathname}/${proposal._id}`} className="btn btn-2 btn-md">
                                            Xem hợp đồng
                                        </Link>
                                        <button className="btn btn-4 btn-md" onClick={() => { setOtherMember(proposal?.talentId) }}>
                                            Liên hệ
                                        </button>
                                    </div>
                                </div>
                            )
                        }) : (
                            <p className="text-align-center">Tạm thời chưa có họa sĩ ứng đơn hàng.</p>
                        )
                    }
                    </div>
                </div>

                {showZoomImage && <ZoomImage src={imageSrc} setShowZoomImage={setShowZoomImage} />}
            </div>
        </div>
    )
}

