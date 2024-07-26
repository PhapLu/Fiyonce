// Imports
import { useState, useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
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

export default function RenderProposal({ proposalId, commissionOrder, setShowRenderProposal, setOverlayVisible }) {
    if (!commissionOrder) {
        return;
    }
    const { setModalInfo } = useModal();
    const { userInfo, socket } = useAuth();
    const isOrderOwnerAsMember = userInfo?._id === commissionOrder?.memberId?._id;

    const [isSuccessConfirmProposal, setIsSuccessConfirmProposal] = useState(false);
    const [isProcedureVisible, setIsProcedureVisible] = useState(true);

    const fetchProposal = async () => {
        try {
            const response = await apiUtils.get(`/proposal/readProposal/${proposalId}`);
            console.log(response)
            return response.data.metadata.proposal;
            // console.log({
            //     scope: "Ban se nhan duoc ....",
            //     startAt: "2024-07-12",
            //     deadline: "2024-07-29",
            //     price: 500000,
            //     termOfServiceId: {
            //         _id: 1,
            //         content: "Dieu khoan dich vu content"
            //     }
            // })
            // return {
            //     scope: "Ban se nhan duoc ....",
            //     startAt: "2024-07-12",
            //     deadline: "2024-07-29",
            //     price: 500000,
            //     artworks: [
            //     ],
            //     termOfServiceId: {
            //         _id: 1,
            //         content: "Dieu khoan dich vu content"
            //     }
            // }
        } catch (error) {
            return null;
        }
    }

    const { data: proposal, error, isError, isLoading } = useQuery(
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

    const renderProposalRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (renderProposalRef && renderProposalRef.current && !renderProposalRef.current.contains(e.target)) {
                setShowRenderProposal(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [setShowRenderProposal, setOverlayVisible]);


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

    if (isLoading) {
        return <div className="loading-spinner" />;
    }

    return (
        <div className="render-proposals modal-form type-2" ref={renderProposalRef} onClick={(e) => { e.stopPropagation() }}>
            <Link to="/help_center" className="form__help" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__help-ic">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg> Trợ giúp
            </Link>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowRenderProposal(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <div className="modal-form--left">
                <div className="user md">
                    <Link to={`/users/${commissionOrder?.memberId._id}`} className="user--left hover-cursor-opacity">
                        <img src={resizeImageUrl(commissionOrder?.memberId?.avatar, 50)} alt="" className="user__avatar" />
                        <div className="user__name">
                            <div className="fs-14">{commissionOrder?.memberId?.fullName}</div>
                        </div>
                    </Link>
                </div>

                {commissionOrder?.talentChosenId ? (
                    <div className="status approved">
                        <span> &nbsp;Đã chọn họa sĩ và thanh toán</span>
                    </div>
                ) : (
                    <div className="status pending">
                        <span className="highlight-text">&nbsp;{commissionOrder.talentsApprovedCount} họa sĩ đã ứng</span>
                    </div>
                )}
                {
                    commissionOrder.isDirect ? (
                        <>
                            <h4 onClick={() => { setIsProcedureVisible(!isProcedureVisible) }} className="flex-space-between flex-align-center">
                                Thủ tục đặt tranh
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
                                        <li className={`step-item ${["approved"].includes(commissionOrder.status) && "checked"}`}>Họa sĩ xác nhận và gửi proposal</li>
                                        <li className={`step-item ${["approved", "confirmed"].includes(commissionOrder.status) && "checked"}`}>Khách hàng thanh toán đặt cọc</li>
                                        {commissionOrder.status === "under_processing" ? <li className="step-item checked">Admin đang xử lí</li> : (
                                            <>
                                                <li className={`step-item ${["in_progress"].includes(commissionOrder.status) && "checked"}`}>Họa sĩ cập nhật tiến độ và bản thảo qua tin nhắn và gmail</li>
                                                <li className={`step-item ${["finished"].includes(commissionOrder.status) && "checked"}`}>Họa sĩ hoàn tất đơn hàng, khách hàng đánh giá chất lượng sản phẩm</li>
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
                            isOrderOwnerAsMember && !["confirmed", "canceled",
                                "in_progress",
                                "finished",
                                "under_processing"].includes(commissionOrder?.status) && (
                                <div className="form-field">
                                    <label htmlFor="price" className="form-field__label">Thanh toán</label>

                                    <div className="border-text w-100">
                                        <span>Giá trị đơn hàng: <span className="highlight-text">{formatCurrency(proposal?.price)}đ</span></span>
                                        <p className="fw-bold">Phương thức thanh toán</p>
                                        <div className="payment-method-container">
                                            {paymentMethods.map(method => (
                                                <div
                                                    key={method.id}
                                                    className={`payment-method-item ${selectedPaymentMethod === method.id ? 'active' : ''}`}
                                                    onClick={() => setSelectedPaymentMethod(method.id)}
                                                >
                                                    <img src={method.imgSrc} alt={method.name} />
                                                    <span>{method.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <hr />
                                        <p className="text-align-center">Bạn vẫn chưa bị trừ tiền</p>
                                        <button className="btn btn-md btn-hover color-4 w-100" onClick={handlePayment}>Thanh toán qua {selectedPaymentMethod ? paymentMethods.find(method => method.id === selectedPaymentMethod).name : '...'}</button>
                                    </div>
                                </div>
                            )
                        }
                    </>
                )}
            </div>
        </div >
    )
}

