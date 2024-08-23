// Imports
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

// Contexts
import { useAuth } from "../../contexts/auth/AuthContext";

// Components
import RenderCommissionOrder from "../crudCommissionOrder/render/RenderCommissionOrder";
import UpdateCommissionOrder from "../crudCommissionOrder/update/UpdateCommissionOrder";
import ArchiveCommissionOrder from "../crudCommissionOrder/archive/ArchiveCommissionOrder";
import UnarchiveCommissionOrder from "../crudCommissionOrder/archive/UnarchiveCommissionOrder";
import ReportCommissionOrder from "../crudCommissionOrder/report/ReportCommissionOrder";
import StartWipCommissionOrder from "../crudCommissionOrder/startWip/StartWipCommissionOrder";

import RenderProposals from "../crudProposal/render/RenderProposals";
import CreateProposal from "../crudProposal/create/CreateProposal";
import RenderProposal from "../crudProposal/render/RenderProposal";

import RenderCommissionTos from "../crudCommissionTos/render/RenderCommissionTos";

import MemberOrderHistory from "./MemberOrderHistory"
import ArchivedOrderHistory from "./ArchivedOrderHistory"

//Contexts
import { useModal } from "../../contexts/modal/ModalContext";

// Utils
import { apiUtils } from "../../utils/newRequest"
import { formatCurrency } from "../../utils/formatter";

// Styling
import "./OrderHistory.scss";
import RejectCommissionOrder from "../crudCommissionOrder/reject/RejectCommissionOrder";
import { resizeImageUrl } from "../../utils/imageDisplayer";

export default function TalentOrderHistory() {
    const queryClient = useQueryClient();

    const [commissionOrder, setCommissionOrder] = useState();
    const [showTalentOrderMoreActions, setShowTalentOrderMoreActions] = useState();
    const [showRenderCommissionOrder, setShowRenderCommissionOrder] = useState();

    const [showUpdateCommissionOrder, setShowUpdateCommissionOrder] = useState();
    const [showRenderProposals, setShowRenderProposals] = useState(false);

    const [showCreateProposal, setShowCreateProposal] = useState(false);
    const [showRenderProposal, setShowRenderProposal] = useState(false);

    const [showRejectCommissionOrder, setShowRejectCommissionOrder] = useState(false);
    const [showStartWipCommissionOrder, setShowStartWipCommissionOrder] = useState(false);

    const [showArchiveCommissionOrder, setShowArchiveCommissionOrder] = useState(false);
    const [showUnarchiveCommissionOrder, setShowUnarchiveCommissionOrder] = useState(false);
    const [showReportCommissionOrder, setShowReportCommissionOrder] = useState(false);

    const [showCommissionTosView, setShowCommissionTosView] = useState(false);
    const [proposalId, setProposalId] = useState();

    const [overlayVisible, setOverlayVisible] = useState();

    const moreActionsRef = useRef(null);
    const archiveOrderBtnRef = useRef(null);
    const reportOrderBtnRef = useRef(null);



    const fetchTalentOrderHistory = async () => {
        try {
            const response = await apiUtils.get(`/order/readTalentOrderHistory`);
            return response.data.metadata.talentOrderHistory;
        } catch (error) {
            return null;
        }
    };

    const {
        data: orders,
        error: fetchingTalentOrderHistoryError,
        isError: isFetchingTalentOrderHistoryError,
        isLoading: isFetchingTalentOrderHistoryLoading,
        refetch: refetchTalentOrderHistory,
    } = useQuery('fetchTalentOrderHistory', fetchTalentOrderHistory, {
    });

    const archiveCommissionOrderMutation = useMutation(
        async (orderId) => {
            const response = await apiUtils.patch(`/order/archiveOrder/${orderId}`);
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchTalentOrderHistory');
                queryClient.invalidateQueries('fetchArchivedOrderHistory');
            },
            onError: (error) => {
                return error;
            },
        }
    );

    const reportCommissionOrderMutation = useMutation(
        async (fd) => {
            const response = await apiUtils.post(`/commissionReport/createCommissionReport`, fd);
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchTalentOrderHistory');
            },
            onError: (error) => {
                return error;
            },
        }
    );



    const rejectCommissionOrderMutation = useMutation(
        async ({ orderId, fd }) => {
            const response = await apiUtils.patch(`/order/rejectOrder/${orderId}`, { rejectMessage: fd.get("rejectMessage") });
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchTalentOrderHistory');
            },
            onError: (error) => {
                return error;
            },
        }
    );

    const startWipCommissionOrderMutation = useMutation(
        async ({ orderId }) => {
            const response = await apiUtils.patch(`/order/startWipOrder/${orderId}`);
            console.log(response)
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchTalentOrderHistory');
            },
            onError: (error) => {
                return error;
            },
        }
    );

    const unarchiveCommissionOrderMutation = useMutation(
        async (orderId) => {
            const response = await apiUtils.patch(`/order/unarchiveOrder/${orderId}`);
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchTalentOrderHistory');
                queryClient.invalidateQueries('fetchArchivedOrderHistory');
            },
            onError: (error) => {
                return error;
            },
        }
    );


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                moreActionsRef.current && !moreActionsRef.current.contains(event.target)
                && archiveOrderBtnRef.current && !archiveOrderBtnRef.current.contains(event.target)
                && reportOrderBtnRef.current && !reportOrderBtnRef.current.contains(event.target)
                // && !event.target.closest('.conversation-item')
            ) {
                setShowTalentOrderMoreActions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (isFetchingTalentOrderHistoryLoading) {
        return <span>Đang tải...</span>
    }

    if (isFetchingTalentOrderHistoryError) {
        return <span>Có lỗi xảy ra: {fetchingTalentOrderHistoryError.message}</span>
    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Trạng thái</th>
                        <th>Khách hàng</th>
                        <th>Giá dự kiến</th>
                        <th>Deadline dự kiến</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orders?.length > 0 ? orders.map((order, index) => {
                            return (
                                <tr key={index} onClick={() => { setCommissionOrder(order); setShowRenderCommissionOrder(true); setOverlayVisible(true) }}>
                                    <td >
                                        <div className="status-cell">
                                            <div className={`status-cell__bg ${order?.status}`}>
                                            </div>
                                            <div className="status-cell__title">
                                                {order?.status === "pending"
                                                    ? "Đang đợi bạn xác nhận"
                                                    : order?.status === "approved"
                                                        ? "Đang đợi khách hàng thanh toán"
                                                        : order?.status === "rejected"
                                                            ? "Bạn đã từ chối"
                                                            : order?.status === "confirmed"
                                                                ? "Khách đã thanh toán cọc"
                                                                : order?.status === "canceled"
                                                                    ? "Đã hủy"
                                                                    : order?.status === "in_progress"
                                                                        ? "Đang thực hiện đơn"
                                                                        : order?.status === "finished"
                                                                            ? "Hoàn tất"
                                                                            : order?.status === "under_processing"
                                                                                ? "Admin đang xử lí"
                                                                                : ""}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <Link to={`/users/${order?.memberId._id}`} className="user sm hover-cursor-opacity">
                                            <div className="user--left">
                                                <img src={resizeImageUrl(order?.memberId?.avatar, 50)} alt="" className="user__avatar" />
                                                <div className="user__name">
                                                    <div className="fs-13">{order?.memberId?.fullName}</div>
                                                </div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td>{`đ${formatCurrency(order.minPrice)}` || `đ${formatCurrency(order.price)}` || "-"}</td>
                                    <td>{order.deadline || "-"}</td>
                                    <td className="flex-align-center">
                                        <>
                                            {
                                                order.status === "pending" &&
                                                (
                                                    <>
                                                        <button onClick={(e) => { e.stopPropagation(); setCommissionOrder(order); setShowRenderCommissionOrder(false); setShowCreateProposal(true); setOverlayVisible(true); }} className="btn btn-3">Soạn hợp đồng</button>
                                                        <button onClick={(e) => { e.stopPropagation(); setCommissionOrder(order); setShowRenderCommissionOrder(false); setShowRejectCommissionOrder(true); setOverlayVisible(true); }} className="btn btn-3">Từ chối</button>
                                                    </>
                                                )
                                            }
                                            {order.status === "approved" && (
                                                <button onClick={(e) => { e.stopPropagation(); setProposalId(order?.proposalId); setCommissionOrder(order); setShowRenderProposal(true); setOverlayVisible(true); }} className="btn btn-3">Xem hợp đồng</button>
                                            )}
                                            {order.status === "confirmed" && (
                                                <button aria-label="Bắt đầu thực hiện đơn hàng" onClick={(e) => { e.stopPropagation(); setCommissionOrder(order); setShowStartWipCommissionOrder(true); setOverlayVisible(true); }} className="btn btn-3 hover-display-label">WIP</button>
                                            )}
                                            {order.status === "in_progress" && (
                                                <button aria-label="Bắt đầu thực hiện đơn hàng" onClick={(e) => { e.stopPropagation(); setCommissionOrder(order); setShowStartWipCommissionOrder(true); setOverlayVisible(true); }} className="btn btn-3 hover-display-label">Hoàn tất</button>
                                            )}
                                        </>
                                        <button className="btn btn-3 icon-only p-4 more-action-btn" ref={moreActionsRef} onClick={(e) => { e.stopPropagation(), setShowTalentOrderMoreActions(order) }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                            </svg>

                                            {showTalentOrderMoreActions === order && (
                                                <div className="more-action-container" ref={archiveOrderBtnRef}>
                                                    <div className="more-action-item flex-align-center gray-bg-hover p-4 br-4" onClick={(e) => { e.stopPropagation(), setCommissionOrder(order), setShowArchiveCommissionOrder(true); setOverlayVisible(true) }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                                        </svg>
                                                        Lưu trữ
                                                    </div>
                                                    {
                                                        ["confirmed", "in_progress", "finished", "canceled", "under_processing"].includes(order?.status)
                                                        && (
                                                            <>
                                                                <hr />
                                                                <div className="more-action-item flex-align-center gray-bg-hover p-4 br-4" ref={reportOrderBtnRef} onClick={() => { setCommissionOrder(order); setProposalId(order?.proposalId); setShowReportCommissionOrder(true); setOverlayVisible(true) }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-8">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                                    </svg>
                                                                    Báo cáo
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            )
                        }) : (
                            <tr className="non-hover">
                                <td colSpan={6}>Hiện chưa nhận được đơn hàng nào. Tham khảo
                                    <Link><span className="highlight-text"> cẩm nang họa sĩ </span></Link> để xây dựng hồ sơ tốt hơn.
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>

            {/* Modal forms */}
            {
                overlayVisible &&
                (
                    <div className="overlay">
                        {showRenderCommissionOrder && <RenderCommissionOrder commissionOrder={commissionOrder} setShowCreateProposal={setShowCreateProposal} setShowRenderCommissionOrder={setShowRenderCommissionOrder} setOverlayVisible={setOverlayVisible} />}
                        {showUpdateCommissionOrder && <UpdateCommissionOrder commissionOrder={commissionOrder} setShowUpdateCommissionOrder={setShowUpdateCommissionOrder} setOverlayVisible={setOverlayVisible} />}
                        {showArchiveCommissionOrder && <ArchiveCommissionOrder commissionOrder={commissionOrder} setShowArchiveCommissionOrder={setShowArchiveCommissionOrder} setOverlayVisible={setOverlayVisible} archiveCommissionOrderMutation={archiveCommissionOrderMutation} />}
                        {showUnarchiveCommissionOrder && <UnarchiveCommissionOrder commissionOrder={commissionOrder} setShowUnarchiveCommissionOrder={setShowUnarchiveCommissionOrder} setOverlayVisible={setOverlayVisible} unarchiveCommissionOrderMutation={unarchiveCommissionOrderMutation} />}
                        {showReportCommissionOrder && <ReportCommissionOrder proposalId={proposalId} commissionOrder={commissionOrder} setShowReportCommissionOrder={setShowReportCommissionOrder} setOverlayVisible={setOverlayVisible} reportCommissionOrderMutation={reportCommissionOrderMutation} />}

                        {showCreateProposal && <CreateProposal commissionOrder={commissionOrder} setShowCreateProposal={setShowCreateProposal} setOverlayVisible={setOverlayVisible} />}
                        {showRenderProposal && <RenderProposal commissionOrder={commissionOrder} proposalId={proposalId} setShowRenderProposal={setShowRenderProposal} setOverlayVisible={setOverlayVisible} />}

                        {showRenderProposals && <RenderProposals commissionOrder={commissionOrder} setShowRenderProposals={setShowRenderProposals} setOverlayVisible={setOverlayVisible} />}
                        {showRejectCommissionOrder && <RejectCommissionOrder commissionOrder={commissionOrder} setShowRejectCommissionOrder={setShowRejectCommissionOrder} setOverlayVisible={setOverlayVisible} rejectCommissionOrderMutation={rejectCommissionOrderMutation} />}

                        {showStartWipCommissionOrder && <StartWipCommissionOrder commissionOrder={commissionOrder} setShowStartWipCommissionOrder={setShowStartWipCommissionOrder} setOverlayVisible={setOverlayVisible} startWipCommissionOrderMutation={startWipCommissionOrderMutation} />}

                        {/* Commission TOS */}
                        {showCommissionTosView &&
                            <RenderCommissionTos
                                setShowCommissionTosView={setShowCommissionTosView}
                                setOverlayVisible={setOverlayVisible}
                            />
                        }
                    </div>
                )
            }
        </>
    )
}