// Imports
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams, useLocation, useOutletContext } from "react-router-dom";
import { useQuery } from "react-query";

// Contexts
import { useModal } from "../../../contexts/modal/ModalContext";

// Utils
import { formatCurrency, formatDate, formatDatetime, formatTimeAgo, limitString } from "../../../utils/formatter";
import { apiUtils, newRequest } from "../../../utils/newRequest";

// Styling
import "./RenderCommissionOrderReviews.scss"
import { useAuth } from "../../../contexts/auth/AuthContext";
import { resizeImageUrl } from "../../../utils/imageDisplayer";


export default function RenderCommissionOrderReviews() {
    const commissionOrder = useOutletContext();

    const navigate = useNavigate();
    const location = useLocation();
    const { "commission-order-id": commissionOrderId } = useParams();

    const { setModalInfo } = useModal();
    const { userInfo } = useAuth();
    const [isProcedureVisible, setIsProcedureVisible] = useState(true);

    const fetchReviewsByOrderId = async () => {
        try {
            const response = await apiUtils.get(`/review/readReviewsByOrderId/${commissionOrderId}`);
            console.log(response)
            return response.data.metadata.reviews;
        } catch (error) {
            return null;
        }
    }

    const { data: reviews, fetchingOrderReviewsError, isFetchingOrderReviewsError, isFetchingOrderReviewsLoading } = useQuery(
        ['fetchReviewsByOrderId'],
        () => fetchReviewsByOrderId(),
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching reviews by Order ID:', error);
            },
        }
    );

    const closeRejectResponseView = () => {
        navigate("/order-history");
    }

    const renderOrderReviewsRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (renderOrderReviewsRef && renderOrderReviewsRef.current && !renderOrderReviewsRef.current.contains(e.target)) {
                closeRejectResponseView();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [navigate]);


    if (isFetchingOrderReviewsError) {
        return fetchingCommissionOrderError;
    }

    if (isFetchingOrderReviewsLoading) {
        return <div className="loading-spinner" />;
    }

    const isOrderOwnerAsMember = userInfo?._id === commissionOrder?.memberId?._id;
    const isOrderOwnerAsTalent = userInfo?._id === commissionOrder?.talentChosenId?._id;

    return (
        <div className="overlay">
            <div className="reject-response modal-form type-3" ref={renderOrderReviewsRef} onClick={(e) => { e.stopPropagation() }}>
                <h2 className="form__title">Xem đánh giá</h2>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={closeRejectResponseView}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>

                {/* Member reviews Talent */}
                <p className="text-align-justify border-text type-1 mt-20 mb-24">
                    {
                        commissionOrder?.isReviewedByMember ? (
                            // Rating, content, hashtags
                            reviews?.map((review, index) => {
                                return (
                                    review?.reviewerId === commissionOrder?.memberId?._id &&
                                    (
                                        <>
                                            <Link to={`/users/${commissionOrder?.memberId?._id}`} className="user md hover-cursor-opacity w-50">
                                                <div className="user--left">
                                                    <img src={resizeImageUrl(commissionOrder?.memberId?.avatar, 50)} alt="" className="user__avatar" />
                                                    <div className="user__name">
                                                        <div className="fs-13">{commissionOrder?.memberId?.fullName}</div>
                                                        {
                                                            commissionOrder?.memberId?.stageName &&
                                                            <div className="fs-13">@{commissionOrder?.memberId?.stageName}</div>
                                                        }
                                                    </div>
                                                </div>
                                            </Link>
                                            <div className="flex-align-center mt-8">
                                                <div className="flex-align-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-6 rating-star-ic ${review?.rating >= 1 ? "active" : ""}`}>
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-6 rating-star-ic ml-4 ${review?.rating >= 2 ? "active" : ""}`}>
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-6 rating-star-ic ml-4 ${review?.rating >= 3 ? "active" : ""}`}>
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-6 rating-star-ic ml-4 ${review?.rating >= 4 ? "active" : ""}`}>
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-6 rating-star-ic ml-4 ${review?.rating >= 5 ? "active" : ""}`}>
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="dot-delimiter sm"></span>
                                                {formatDate(review?.createdAt)}
                                            </div>
                                            <p className="mt-16">{review?.content}</p>
                                            <p className="mt-16">{review?.hashtags?.map((hashtag, index) => {
                                                return (
                                                    <div className="btn btn-3 btn-sm mr-8" key={index}>{hashtag}</div>
                                                )
                                            })}</p>
                                        </>
                                    )
                                )
                            })

                        ) : (
                            <p>Khách hàng chưa để lại đánh giá cho đơn hàng này</p>
                        )
                    }
                </p>

                <hr className="mt-20 mb-20" />

                <p className="text-align-justify border-text type-1 mt-20 mb-24">
                    {
                        commissionOrder?.isReviewedByTalent ? (
                            // Rating, content, hashtags
                            reviews?.map((review, index) => {
                                return (
                                    review?.reviewerId === commissionOrder?.talentChosenId?._id &&
                                    (
                                        <>
                                            <Link to={`/users/${commissionOrder?.talentChosenId?._id}`} className="user md hover-cursor-opacity w-50">
                                                <div className="user--left">
                                                    <img src={resizeImageUrl(commissionOrder?.talentChosenId?.avatar, 50)} alt="" className="user__avatar" />
                                                    <div className="user__name">
                                                        <div className="fs-13">{commissionOrder?.talentChosenId?.fullName}</div>
                                                        {
                                                            commissionOrder?.talentChosenId?.stageName &&
                                                            <div className="fs-13">@{commissionOrder?.talentChosenId?.stageName}</div>
                                                        }
                                                    </div>
                                                </div>
                                            </Link>
                                            <div className="flex-align-center mt-8">
                                                <div className="flex-align-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-6 rating-star-ic ${review?.rating >= 1 ? "active" : ""}`}>
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-6 rating-star-ic ml-4 ${review?.rating >= 2 ? "active" : ""}`}>
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-6 rating-star-ic ml-4 ${review?.rating >= 3 ? "active" : ""}`}>
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-6 rating-star-ic ml-4 ${review?.rating >= 4 ? "active" : ""}`}>
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-6 rating-star-ic ml-4 ${review?.rating >= 5 ? "active" : ""}`}>
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="dot-delimiter sm"></span>
                                                {formatDate(review?.createdAt)}
                                            </div>
                                            <p className="mt-16">{review?.content}</p>
                                            <p className="mt-16">{review?.hashtags?.map((hashtag, index) => {
                                                return (
                                                    <div className="btn btn-3 btn-sm mr-8" key={index}>{hashtag}</div>
                                                )
                                            })}</p>
                                        </>
                                    )
                                )
                            })
                        ) : (
                            <p>Họa sĩ chưa để lại đánh giá cho đơn hàng này</p>
                        )
                    }
                </p>

                {
                    ((isOrderOwnerAsMember && !commissionOrder?.isReviewedByMember) || (isOrderOwnerAsTalent && !commissionOrder?.isReviewedByTalent)) &&
                    <Link to={`/order-history/commission-orders/${commissionOrder?._id}/review`} className="btn btn-2 btn-md w-100" onClick={closeRejectResponseView}>Đi đến đánh giá</Link>
                }
            </div >
        </div >
    )
}