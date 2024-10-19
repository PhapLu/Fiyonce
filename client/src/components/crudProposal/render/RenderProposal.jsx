// Imports
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams, useLocation, useOutletContext } from "react-router-dom";
import { useQuery } from "react-query";
import MoMoPayment from "/uploads/momo_payment.png"
import AtmPayment from "/uploads/atm_payment.png"
import VisaPayment from "/uploads/visa_payment.png"

// Contexts
import { useModal } from "../../../contexts/modal/ModalContext";

// Components

// Utils
import { formatCurrency, formatDate, formatTimeAgo, limitString } from "../../../utils/formatter";
import { apiUtils, newRequest } from "../../../utils/newRequest";

// Styling
import "./RenderProposal.scss"
import { useAuth } from "../../../contexts/auth/AuthContext";
import { resizeImageUrl } from "../../../utils/imageDisplayer";

export default function RenderProposal() {
    const commissionOrder = useOutletContext();

    const navigate = useNavigate();
    const location = useLocation();
    const { "commission-order-id": commissionOrderId, "proposal-id": proposalId } = useParams();

    const { setModalInfo } = useModal();
    const { userInfo, socket } = useAuth();

    const [isSuccessConfirmProposal, setIsSuccessConfirmProposal] = useState(false);
    const [isProcedureVisible, setIsProcedureVisible] = useState(true);


    const fetchProposal = async () => {
        try {
            const response = await apiUtils.get(`/proposal/readProposal/${proposalId}`);
            console.log(response)
            return response.data.metadata.proposal;
        } catch (error) {
            return null;
        }
    }

    const { data: proposal, fetchingProposalError, isFetchingProposalError, isFetchingProposalLoading } = useQuery(
        ['fetchProposal'],
        () => fetchProposal(),
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching proposals by Order ID:', error);
            },
        }
    );

    const closeRenderProposalView = () => {
        if (location.pathname.includes("commission-market")) {
            navigate("/commission-market");
        } else {
            navigate("/order-history");
        }
        // navigate(commissionOrder?.isDirect ? `/order-history` : `/commission-market`);
    }

    const renderProposalRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (renderProposalRef && renderProposalRef.current && !renderProposalRef.current.contains(e.target)) {
                closeRenderProposalView();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [navigate]);


    const [paymentUrl, setPaymentUrl] = useState();

    const handlePayment = async (e) => {
        e.preventDefault();

        try {
            const response = await apiUtils.patch(`/proposal/confirmProposal/${proposal?._id}`);
            console.log(response.data.metadata.proposal)
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Thanh toán thành công"
                })
            }


            const senderId = userInfo?._id;
            const receiverId = proposal?.talentId?._id;
            const inputs2 = { receiverId, type: "confirmCommissionOrder", url: `/order-history` }
            const response2 = await apiUtils.post(`/notification/createNotification`, inputs2);
            const notificationData = response2.data.metadata.notification;
            socket.emit('sendNotification', { senderId, receiverId, notification: notificationData, url: notificationData.url });
            // const paymentResponse = response1.data.metadata.paymentResponse;
            // console.log(response1.data.metadata.paymentResponse);
            // window.open(paymentResponse.payUrl)

            // const response2 = await newRequest.post('https://test-payment.momo.vn/v2/gateway/api/create', paymentData);
            // console.log(response2)
            // Navigate(response.data.metadata.paymentData.paymentUrl);
        } catch (error) {
            console.log(error);
            setModalInfo({
                status: "error",
                message: error?.response?.data?.message
            })
        }
    }


    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('momo');

    const paymentMethods = [
        { id: 'momo', name: 'Ví MoMo', imgSrc: MoMoPayment },
        { id: 'atm', name: 'Thẻ ATM nội địa', imgSrc: AtmPayment },
        { id: 'visa', name: 'Thẻ ATM quốc tế', imgSrc: VisaPayment },
    ];

    if (isFetchingProposalError) {
        return fetchingCommissionOrderError;
    }

    if (isFetchingProposalLoading) {
        return <div className="loading-spinner" />;
    }

    const isOrderOwnerAsMember = userInfo?._id === commissionOrder?.memberId?._id;

    return (
        <div className="overlay">
            <div className="render-proposals modal-form type-2" ref={renderProposalRef} onClick={(e) => { e.stopPropagation() }}>
                <Link to="/help-center" className="form__help" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__help-ic">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                    </svg> Trợ giúp
                </Link>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                    closeRenderProposalView();
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
                                                            : commissionOrder?.status === "delivered"
                                                                ? "Họa sĩ đã bàn giao"
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
                                                                : commissionOrder?.status === "delivered"
                                                                    ? "Họa sĩ đã bàn giao"
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
                        <Link to={`/users/${commissionOrder?.memberId?._id}`} className="user--left hover-cursor-opacity">
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
                                            <li className={`step-item ${["approved"].includes(commissionOrder?.status) && "checked"}`}>Họa sĩ xác nhận và gửi proposal</li>
                                            <li className={`step-item ${["approved", "confirmed"].includes(commissionOrder?.status) && "checked"}`}>Khách hàng thanh toán đặt cọc</li>
                                            {commissionOrder?.status === "under_processing" ? <li className="step-item checked">Admin đang xử lí</li> : (
                                                <>
                                                    <li className={`step-item ${["in_progress"].includes(commissionOrder?.status) && "checked"}`}>Họa sĩ cập nhật tiến độ và bản thảo qua tin nhắn và gmail</li>
                                                    <li className={`step-item ${["delivered", "finished"].includes(commissionOrder?.status) && "checked"}`}>Họa sĩ hoàn tất đơn hàng, khách hàng đánh giá chất lượng sản phẩm</li>
                                                </>
                                            )}
                                        </ul>
                                    )
                                }
                            </>
                        ) : (
                            <>
                                <h3>Thủ tục đăng yêu cầu tìm họa sĩ</h3>
                                <hr />
                                <ul className="step-container">
                                    <li className="step-item checked">Khách hàng mô tả yêu cầu</li>
                                    <li className="step-item checked">Các họa sĩ gửi proposal</li>
                                    <li className="step-item">Khách hàng chọn ra họa sĩ phù hợp nhất và thanh toán đặt cọc</li>
                                    <li className="step-item">Họa sĩ cập nhật tiến độ và bản thảo qua tin nhắn và gmail</li>
                                    <li className="step-item">Họa sĩ hoàn tất đơn hàng, khách hàng đánh giá chất lượng sản phẩm</li>
                                </ul>
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
                    {isSuccessConfirmProposal ? (
                        <h2 className="form__title">Thanh toán thành công</h2>

                    ) : (
                        <>
                            <h2 className="form__title">Chi tiết hồ sơ</h2>
                            <div className="form-field">
                                <label htmlFor="scope" className="form-field__label">Phạm vi hợp đồng</label>
                                <span>{proposal?.scope}</span>
                            </div>

                            {!commissionOrder?.isDirect && proposal?.artworks?.length > 0 && (
                                <div className="form-field">
                                    <label htmlFor="scope" className="form-field__label">Tranh tham khảo</label>
                                    <div className="reference-container">
                                        {proposal?.artworks.map((artwork, index) => (
                                            <div className="reference-item" key={index}>
                                                <img src={artwork.url} alt="Tranh tham khảo" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="form-field">
                                <label htmlFor="scope" className="form-field__label">Thời gian</label>
                                <div>
                                    <span>Bắt đầu từ ngày: {formatDate(proposal?.startAt)}</span>
                                    <br />
                                    <span>Đến ngày: {formatDate(proposal?.deadline)}</span>
                                </div>
                            </div>

                            <div className="form-field">
                                <label htmlFor="termOfServiceId" className="form-field__label">Điều khoản dịch vụ</label>
                                <div className="border-text w-100" dangerouslySetInnerHTML={{ __html: proposal?.termOfServiceId.content }}></div>
                            </div>

                            {
                                isOrderOwnerAsMember && ["approved"].includes(commissionOrder?.status) && (
                                    <div className="form-field">
                                        <label htmlFor="price" className="form-field__label">Thanh toán</label>

                                        <div className="border-text w-100">
                                            <p className="text-align-center">Giá trị đơn hàng: <span className="highlight-text">{formatCurrency(proposal?.price)}đ</span></p>
                                            {/* <p className="fw-bold">Phương thức thanh toán</p> */}
                                            {/* <div className="payment-method-container">
                                                {paymentMethods.map(method => (
                                                    <div
                                                        key={method.id}
                                                        className={`payment-method-item hover-cursor-opacity ${selectedPaymentMethod === method.id ? 'active' : ''}`}
                                                        onClick={() => setSelectedPaymentMethod(method.id)}
                                                    >
                                                        <img src={method.imgSrc} alt={method.name} />
                                                        <span>{method.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <hr /> */}
                                            <p className="text-align-center mb-20">Bạn vẫn chưa bị trừ tiền cho đến khi hoàn tất thủ tục thanh toán</p>
                                            <br />
                                            <button className="btn btn-lg btn-hover color-4 w-100" onClick={handlePayment}>Đi đến cổng thanh toán</button>
                                        </div>
                                    </div>
                                )
                            }
                        </>
                    )}
                </div>
            </div >
        </div >
    )
}

