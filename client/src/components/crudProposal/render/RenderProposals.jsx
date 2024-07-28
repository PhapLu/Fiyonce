// Imports
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

// Contexts

// Components
import RenderProposal from "./RenderProposal"

// Utils
import { formatCurrency, formatTimeAgo, limitString } from "../../../utils/formatter";

// Styling
import "./RenderProposals.scss"
import { apiUtils } from "../../../utils/newRequest";
import { resizeImageUrl } from "../../../utils/imageDisplayer";
import { useConversation } from "../../../contexts/conversation/ConversationContext";


export default function RenderProposals({ commissionOrder, setShowRenderProposals, setOverlayVisible }) {
    if (!commissionOrder) {
        return;
    }

    const {setOtherMember} = useConversation();

    const [proposal, setProposal] = useState();
    const [showRenderProposal, setShowRenderProposal] = useState(false);
    const [isProcedureVisible, setIsProcedureVisible] = useState(false);

    const fetchProposals = async () => {
        try {
            const response = await apiUtils.get(`/proposal/readProposals/${commissionOrder._id}`);
            console.log(response)
            return response.data.metadata.proposals;
            // return [
            //     {
            //         _id: 1,
            //         talentId: {
            //             _id: 1,
            //             fullName: "John Doe",
            //             avatar: "https://i.pinimg.com/474x/61/eb/44/61eb4455fef6a3fca18cb0f53bd25eef.jpg"
            //         },
            //         scope: "Ban se nhan duoc ...",
            //         artworks: [
            //             {
            //                 _id: 1,
            //                 url: "https://i.pinimg.com/236x/c1/3f/cb/c13fcbce0b55b9aa9a3cdf0c7c6ea61c.jpg",
            //             },
            //             {
            //                 _id: 2,
            //                 url: "https://i.pinimg.com/236x/84/8c/7b/848c7bc0d8887b1a68eead56bb49f08f.jpg",
            //             },
            //         ],
            //         price: 500000,
            //         createdAt: "2024-05-18",
            //     },
            //     {
            //         _id: 2,
            //         talentId: {
            //             _id: 1,
            //             fullName: "John Doe",
            //             avatar: "https://i.pinimg.com/474x/61/eb/44/61eb4455fef6a3fca18cb0f53bd25eef.jpg"
            //         },
            //         scope: "Ban se nhan duoc ...",
            //         artworks: [
            //             {
            //                 _id: 1,
            //                 url: "https://i.pinimg.com/236x/c1/3f/cb/c13fcbce0b55b9aa9a3cdf0c7c6ea61c.jpg",
            //             },
            //             {
            //                 _id: 2,
            //                 url: "https://i.pinimg.com/236x/84/8c/7b/848c7bc0d8887b1a68eead56bb49f08f.jpg",
            //             },
            //         ],
            //         price: 500000,
            //         createdAt: "2024-06-18",
            //     }
            // ]
        } catch (error) {
            return null;
        }
    }

    const { data: proposals, error, isError, isLoading } = useQuery(
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

    const renderProposalsRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (renderProposalsRef && renderProposalsRef.current && !renderProposalsRef.current.contains(e.target)) {
                setShowRenderProposals(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [setShowRenderProposals, setOverlayVisible]);

    return (
        showRenderProposal ? <RenderProposal commissionOrder={commissionOrder} proposal={proposal} setShowRenderProposal={setShowRenderProposal} setOverlayVisible={setShowRenderProposal} /> : (
            <div className="render-proposals modal-form type-2" ref={renderProposalsRef} onClick={(e) => { e.stopPropagation() }}>
                <Link to="/help_center" className="form__help" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__help-ic">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                    </svg> Trợ giúp
                </Link>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                    setShowRenderProposals(false);
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
                    <h2 className="form__title">Danh sách hồ sơ</h2>
                    <p>Dưới đây là danh sách hồ sơ mà các họa sĩ đã nộp dựa trên yêu cầu của bạn. Các họa sĩ vẫn có thể nộp hồ sơ cho đến khi bạn chọn được họa sĩ phù hợp nhất.</p>

                    <div className="proposal-container">{
                        proposals?.length > 0 ? proposals.map((proposal, index) => {
                            return (
                                <div className="proposal-item" key={index}>
                                    <div className="user md">
                                        <img src={proposal.talentId.avatar} alt={proposal.talentId.fullName} className="user__avatar" />
                                        <div className="user__name">
                                            <div className="user__name__title">{proposal.talentId.fullName}</div>
                                            <div className="user__name__subtitle">
                                                {formatTimeAgo(proposal.createdAt)}
                                            </div>
                                        </div>
                                    </div>

                                    <p>Giá thỏa thuận: <span className="highlight-text">{formatCurrency(proposal.price)} VND</span></p>
                                    <p>{limitString(proposal.scope, 250)}</p>
                                    <div className="reference-container">
                                        {proposal.artworks.map((artwork, index) => {
                                            return (
                                                <div key={index} className="reference-item">
                                                    <img src={artwork.url} alt="" />
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div>
                                        <button className="btn btn-2 btn-md" onClick={() => { setProposal(proposal); setShowRenderProposal(true) }}>
                                            Xem hợp đồng
                                        </button>
                                        <button className="btn btn-3 btn-md" onClick={() => {setOtherMember(proposal?.talentId)}}>
                                            Liên hệ
                                        </button>
                                    </div>
                                </div>
                            )
                        }) : (
                            <p className="text-align-center">Tạm thời chưa có họa sĩ ứng đơn hàng của bạn.</p>
                        )
                    }

                    </div>
                </div>
            </div>
        ))
}

