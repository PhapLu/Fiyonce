// Imports
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

// Contexts
import { useAuth } from "../../../contexts/auth/AuthContext";

// Components
import RenderProposals from "../../crudProposal/render/RenderProposals";

// Styling
import "./RenderCommissionOrder.scss";
import { resizeImageUrl } from "../../../utils/imageDisplayer";

export default function RenderCommissionOrder({ commissionOrder, setShowCreateProposal, setShowRenderCommissionOrder, setShowRenderProposals, setShowUpdateCommissionOrder, setOverlayVisible }) {
    if (!commissionOrder) {
        return;
    }
    const { userInfo } = useAuth();

    const isOrderOwner = commissionOrder.memberId._id === userInfo._id;
    const isTalentChosen = commissionOrder.talentChosenId?._id === userInfo._id;

    const renderCommissionServiceRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (renderCommissionServiceRef && renderCommissionServiceRef.current && !renderCommissionServiceRef.current.contains(e.target)) {
                setShowRenderCommissionOrder(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [setShowRenderCommissionOrder, setOverlayVisible]);
    const [isProcedureVisible, setIsProcedureVisible] = useState(true);

    return (
        <div className="render-commission-order modal-form type-2" ref={renderCommissionServiceRef} onClick={(e) => { e.stopPropagation() }}>
            <Link to="/help-center" className="form__help" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__help-ic">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg> Trợ giúp
            </Link>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowRenderCommissionOrder(false);
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
                    <div className="status approved mt-8 mb-8">
                        <span className="fs-12"> &nbsp;Đã chọn họa sĩ và thanh toán</span>
                    </div>
                ) : (
                    <div className="status pending mt-8 mb-8">
                        <span className="highlight-text fs-12">&nbsp;{commissionOrder.talentsApprovedCount} họa sĩ đã ứng</span>
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
                                                <li className={`step-item ${["in_progress"].includes(commissionOrder.status) && "checked"}`}>Hai bên tiến hành trao đổi thêm. Họa sĩ cập nhật tiến độ và bản thảo</li>
                                                <li className={`step-item ${["finished"].includes(commissionOrder.status) && "checked"}`}>Họa sĩ hoàn tất đơn hàng, khách hàng thanh toán phần còn lại và đánh giá</li>
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
                <h2 className="form__title">Thông tin đơn hàng</h2>
                <div className="form-field">
                    <label htmlFor="description" className="form-field__label">Mô tả</label>
                    <span>{commissionOrder.description}</span>
                </div>

                <div className="form-field">
                    <label htmlFor="references" className="form-field__label">Nguồn tham khảo</label>
                    <div className="reference-container">
                        {commissionOrder.references.map((reference, index) => {
                            return (
                                <div className="reference-item" key={index}>
                                    <img src={resizeImageUrl(reference, 350)} alt="" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="form-field">
                    <label htmlFor="usage" className="form-field__label">Nhu cầu sử dụng</label>
                    <span>{commissionOrder.usage === "personal" ? "Mục đích cá nhân" : "Mục đích thương mại"}</span>
                </div>

                <div className="form-field">
                    <label htmlFor="isPrivate" className="form-field__label">Riêng tư?</label>
                    <span>{commissionOrder.isPrivate ? "Không cho phép họa sĩ sử dụng tranh vẽ cho bạn để quảng bá hình ảnh của họ" : "Cho phép họa sĩ sử dụng tranh vẽ cho bạn để quảng bá hình ảnh của họ"}</span>
                </div>

                <div className="form-field">
                    <label htmlFor="fileFormats" className="form-field__label">Định dạng file</label>
                    <span>{commissionOrder.fileFormats?.length > 0 ? (
                        commissionOrder.fileFormats.map((fileFormat, index) => { return (<span key={index}>{fileFormat}</span>) })
                    ) : (
                        "Không yêu cầu"
                    )}</span>
                </div>

                <div className="form-field">
                    <label htmlFor="fileFormats" className="form-field__label">Mức giá dự kiến</label>
                    <div>
                        {commissionOrder.minPrice && <span>đ{commissionOrder.minPrice}</span>}
                        {commissionOrder.maxPrice && <span> - đ{commissionOrder.maxPrice}</span>}
                    </div>
                </div>

                <div className="form__submit-btn-container">
                    {
                        isOrderOwner && (
                            <button className="form__submit-btn-item btn btn-2 btn-md" onClick={() => { setShowRenderCommissionOrder(false); setShowUpdateCommissionOrder(true) }}>Cập nhật</button>
                        )
                    }
                    {
                        (isOrderOwner || commissionOrder.isDirect === false) && (
                            <button className="form__submit-btn-item btn btn-2 btn-md" onClick={() => { setShowRenderCommissionOrder(false); setShowRenderProposals(true) }}>Xem hồ sơ ({commissionOrder.talentsApprovedCount || "0"})</button>
                        )
                    }
                    {
                        commissionOrder.isDirect ? (
                            isTalentChosen && (<button className="form__submit-btn-item btn btn-2 btn-md">Tạo hợp đồng</button>)
                        ) : (
                            !isOrderOwner && userInfo.role == "talent") && (
                            <button className="form__submit-btn-item btn btn-2 btn-md" onClick={() => { setShowRenderCommissionOrder(false); setShowCreateProposal(true) }}>Ứng commission</button>
                        )
                    }
                </div>

            </div>
        </div >
    )
}