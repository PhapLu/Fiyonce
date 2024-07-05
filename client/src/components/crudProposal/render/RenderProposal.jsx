// Imports
import { useState, useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "react-query";

// Contexts

// Components

// Utils
import { formatCurrency, formatTimeAgo, limitString } from "../../../utils/formatter";
import { apiUtils } from "../../../utils/newRequest";

// Styling
// import "./RenderProposal.scss"


export default function RenderProposal({ commissionOrder, proposal, setShowRenderProposal, setOverlayVisible }) {
    console.log(proposal)

    if (!proposal || !commissionOrder) {
        return;
    }


    const fetchProposal = async () => {
        try {
            // const response = await newRequest.get(`/proposals/readProposal/:${proposal._id}`);
            // return response.data.metadata.proposal;
            return {
                scope: "Ban se nhan duoc ....",
                startAt: "2024-07-12",
                deadline: "2024-07-29",
                price: 500000,
                termOfServiceId: {
                    _id: 1,
                    content: "Dieu khoan dich vu content"
                }
            }
        } catch (error) {
            return null;
        }
    }

    const { data: proposals, error, isError, isLoading } = useQuery(
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
            const response = await apiUtils.post(`/proposal/confirmProposal/${proposal._id}`);
            console.log(response.data.metadata.paymentData.paymentUrl);
            setPaymentUrlsetPaymentUrl(response.data.metadata.paymentData.paymentUrl)
            // Navigate(response.data.metadata.paymentData.paymentUrl);
        } catch (error) {
            console.log(error)
        }
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
                                                <li className={`step-item ${["approved", "confirmed", "in_progress"].includes(commissionOrder.status) && "checked"}`}>Hai bên tiến hành trao đổi thêm. Họa sĩ cập nhật tiến độ và bản thảo</li>
                                                <li className={`step-item ${["approved", "confirmed", "finished"].includes(commissionOrder.status) && "checked"}`}>Họa sĩ hoàn tất đơn hàng, khách hàng thanh toán phần còn lại và đánh giá</li>
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
                                <li className="step-item checked">Các họa sĩ gửi proposal và khách hàng chọn ra họa sĩ phù hợp nhất</li>
                                <li className="step-item">Khách hàng thanh toán đặt cọc</li>
                                <li className="step-item">Hai bên tiến hành trao đổi thêm. Họa sĩ cập nhật tiến độ và bản thảo</li>
                                <li className="step-item">Họa sĩ hoàn tất đơn hàng, khách hàng thanh toán phần còn lại và đánh giá</li>
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
                <h2 className="form__title">Chi tiết hồ sơ</h2>
                <div className="form-field">
                    <label htmlFor="scope" className="form-field__label">Phạm vi hợp đồng</label>
                    <p>{proposal.scope}</p>
                </div>

                <div className="form-field">
                    <label htmlFor="scope" className="form-field__label">Tranh tham khảo</label>
                    <div className="reference-container">
                        {proposal.artworks.map((artwork, index) => {
                            return (
                                <div className="reference-item" key={index}>
                                    <img src={artwork.url} alt="Tranh tham khảo" />
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="form-field">
                    <label htmlFor="scope" className="form-field__label">Điều khoản dịch vụ</label>
                    <p>{proposal.termOfServiceId.content}</p>
                </div>

                <hr />

                <div className="form-field">
                    <label htmlFor="scope" className="form-field__label">Thanh toán</label>
                    <p>{proposal.price}</p>
                </div>

                <button className="btn btn-2 btn-md" onClick={handlePayment}>
                        Pay with Momo
                </button>

                
            </div>
        </div >
    )
}

