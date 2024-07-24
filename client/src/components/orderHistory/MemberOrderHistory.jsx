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

import RenderProposals from "../crudProposal/render/RenderProposals";
import CreateProposal from "../crudProposal/create/CreateProposal";
import RenderProposal from "../crudProposal/render/RenderProposal";

import RenderCommissionTos from "../crudCommissionTos/render/RenderCommissionTos";


//Contexts
import { useModal } from "../../contexts/modal/ModalContext";

// Utils
import { apiUtils } from "../../utils/newRequest"
import { formatCurrency } from "../../utils/formatter";

// Styling
import "./OrderHistory.scss";
import CancelCommissionOrder from "../crudCommissionOrder/cancel/CancelCommissionOrder";

export default function MemberOrderHistory({ orders }) {
    const queryClient = useQueryClient();

    const [commissionOrder, setCommissionOrder] = useState();
    const [showMemberOrderMoreActions, setShowMemberOrderMoreActions] = useState();
    const [showRenderCommissionOrder, setShowRenderCommissionOrder] = useState();

    const [showUpdateCommissionOrder, setShowUpdateCommissionOrder] = useState();
    const [showRenderProposals, setShowRenderProposals] = useState(false);

    const [showCreateProposal, setShowCreateProposal] = useState(false);
    const [showRenderProposal, setShowRenderProposal] = useState(false);

    const [showCancelCommissionOrder, setShowCancelCommissionOrder] = useState(false);

    const [showArchiveCommissionOrder, setShowArchiveCommissionOrder] = useState(false);
    const [showUnarchiveCommissionOrder, setShowUnarchiveCommissionOrder] = useState(false);
    const [showReportCommissionOrder, setShowReportCommissionOrder] = useState(false);

    const [showCommissionTosView, setShowCommissionTosView] = useState(false);

    const [overlayVisible, setOverlayVisible] = useState();

    const moreActionsRef = useRef(null);
    const archiveOrderBtnRef = useRef(null);
    const reportOrderBtnRef = useRef(null);


    const cancelCommissionOrderMutation = useMutation(
        async ({ orderId, fd }) => {
            const response = await apiUtils.patch(`/order/cancelOrder/${orderId}`, { cancelMessage: fd.get("cancelMessage") });
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


    const archiveCommissionOrderMutation = useMutation(
        async (orderId) => {
            const response = await apiUtils.patch(`/order/archiveOrder/${orderId}`);
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchMemberOrderHistory');
                queryClient.invalidateQueries('fetchArchivedOrderHistory');
            },
            onError: (error) => {
                return error;
            },
        }
    );

    const reportCommissionOrderMutation = useMutation(
        async (orderId) => {
            const response = await apiUtils.post(`/commissionReport/createCommissionReport/${orderId}`);
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchMemberOrderHistory');
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
                setShowMemberOrderMoreActions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Trạng thái</th>
                        <th>Tên đơn hàng</th>
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
                                        <span className={`status ${order?.status}`}>
                                            {
                                                order?.status === "pending" ? "Đang đợi họa sĩ xác nhận" :
                                                    order?.status === "approved" ? "Đang đợi bạn thanh toán" :
                                                        order?.status === "rejected" ? "Họa sĩ đã từ chối" :
                                                            order?.status === "confirmed" ? "Đã thanh toán cọc" :
                                                                order?.status === "canceled" ? "Bạn đã hủy đơn" :
                                                                    order?.status === "in_progress" ? "Họa sĩ đang thực hiện" :
                                                                        order?.status === "finished" ? "Hoàn tất" :
                                                                            order?.status === "under_processing" ? "Admin đang xử lí" :
                                                                                ""
                                            }
                                        </span>

                                    </td>
                                    <td>{order?.title || "-"}</td>
                                    <td>{`đ${formatCurrency(order?.minPrice)}` || `đ${formatCurrency(order?.price)}` || "-"}</td>
                                    <td>{order?.deadline || "-"}</td>
                                    <td className="flex-align-center">
                                        <>
                                            {
                                                order?.status === "pending" &&
                                                (
                                                    <>
                                                        <button onClick={(e) => { e.stopPropagation(); setCommissionOrder(order); setShowRenderCommissionOrder(false); setShowCancelCommissionOrder(true); setOverlayVisible(true); }} className="btn btn-3">Hủy đơn</button>
                                                    </>
                                                )
                                            }
                                            {order?.status === "approved" && (
                                                <button onClick={(e) => { e.stopPropagation(); setCommissionOrder(order); setShowRenderProposal(true); setOverlayVisible(true); }} className="btn btn-3">Xem hợp đồng</button>
                                            )}
                                        </>
                                        <button className="btn btn-3 icon-only p-4 more-action-btn" ref={moreActionsRef} onClick={(e) => { e.stopPropagation(), setShowMemberOrderMoreActions(order) }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                            </svg>

                                            {showMemberOrderMoreActions === order && (
                                                <div className="more-action-container" ref={archiveOrderBtnRef}>
                                                    <div className="more-action-item flex-align-center gray-bg-hover p-4 br-4" onClick={(e) => { e.stopPropagation(), setCommissionOrder(order), setShowArchiveCommissionOrder(true); setOverlayVisible(true) }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                                        </svg>
                                                        Lưu trữ
                                                    </div>
                                                    <hr />
                                                    <div className="more-action-item flex-align-center gray-bg-hover p-4 br-4" ref={reportOrderBtnRef} onClick={() => { setCommissionOrder(order), setShowReportCommissionOrder(true); setOverlayVisible(true) }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-8">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                        </svg>
                                                        Báo cáo
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            )
                        }) : (
                            <tr className="non-hover">
                                <td colSpan={6}>Hiện chưa có đơn hàng nào. <Link to="/commission-market"><span className="highlight-text">Tìm kiếm họa sĩ</span></Link> trên Chợ Commission nhé!
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
                        {showRenderCommissionOrder && <RenderCommissionOrder commissionOrder={commissionOrder} setShowRenderCommissionOrder={setShowRenderCommissionOrder} setOverlayVisible={setOverlayVisible} />}
                        {showUpdateCommissionOrder && <UpdateCommissionOrder commissionOrder={commissionOrder} setShowUpdateCommissionOrder={setShowUpdateCommissionOrder} setOverlayVisible={setOverlayVisible} />}
                        {showArchiveCommissionOrder && <ArchiveCommissionOrder commissionOrder={commissionOrder} setShowArchiveCommissionOrder={setShowArchiveCommissionOrder} setOverlayVisible={setOverlayVisible} archiveCommissionOrderMutation={archiveCommissionOrderMutation} />}
                        {showUnarchiveCommissionOrder && <UnarchiveCommissionOrder commissionOrder={commissionOrder} setShowUnarchiveCommissionOrder={setShowUnarchiveCommissionOrder} setOverlayVisible={setOverlayVisible} unarchiveCommissionOrderMutation={unarchiveCommissionOrderMutation} />}
                        {showReportCommissionOrder && <ReportCommissionOrder commissionOrder={commissionOrder} setShowReportCommissionOrder={setShowReportCommissionOrder} setOverlayVisible={setOverlayVisible} reportCommissionOrderMutation={reportCommissionOrderMutation} />}

                        {showRenderProposals && <RenderProposals commissionOrder={commissionOrder} setShowRenderProposals={setShowRenderProposals} setOverlayVisible={setOverlayVisible} />}
                        {showCancelCommissionOrder && <CancelCommissionOrder commissionOrder={commissionOrder} setShowCancelCommissionOrder={setShowCancelCommissionOrder} setOverlayVisible={setOverlayVisible} cancelCommissionOrderMutation={cancelCommissionOrderMutation} />}

                    </div>
                )
            }
        </>
    )
}