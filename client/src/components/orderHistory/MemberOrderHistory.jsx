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
import { apiUtils } from "../../utils/newRequest";
import { formatCurrency } from "../../utils/formatter";

// Styling
import "./OrderHistory.scss";

export default function MemberOrderHistory() {
    const queryClient = useQueryClient();

    const [commissionOrder, setCommissionOrder] = useState();
    const [showMemberOrderMoreActions, setShowMemberOrderMoreActions] =
        useState();
    const [showRenderCommissionOrder, setShowRenderCommissionOrder] =
        useState();

    const [showUpdateCommissionOrder, setShowUpdateCommissionOrder] =
        useState();
    const [showRenderProposals, setShowRenderProposals] = useState(false);

    const [showCreateProposal, setShowCreateProposal] = useState(false);
    const [showRenderProposal, setShowRenderProposal] = useState(false);

    const [showArchiveCommissionOrder, setShowArchiveCommissionOrder] =
        useState(false);
    const [showUnarchiveCommissionOrder, setShowUnarchiveCommissionOrder] =
        useState(false);
    const [showReportCommissionOrder, setShowReportCommissionOrder] =
        useState(false);

    const [showCommissionTosView, setShowCommissionTosView] = useState(false);

    const [overlayVisible, setOverlayVisible] = useState();

    const moreActionsRef = useRef(null);
    const archiveOrderBtnRef = useRef(null);
    const reportOrderBtnRef = useRef(null);

    const fetchMemberOrderHistory = async () => {
        try {
            const response = await apiUtils.get(
                `/order/readMemberOrderHistory`
            );
            console.log(response.data.metadata.memberOrderHistory);
            return response.data.metadata.memberOrderHistory;
        } catch (error) {
            return null;
        }
    };
    const {
        data: orders,
        error: fetchingMemberOrderHistoryError,
        isError: isFetchingMemberOrderHistoryError,
        isLoading: isFetchingMemberOrderHistoryLoading,
        refetch: refetchMemberOrderHistory,
    } = useQuery("fetchMemberOrderHistory", fetchMemberOrderHistory, {});

    const cancelCommissionOrderMutation = useMutation(
        async ({ orderId, fd }) => {
            const response = await apiUtils.patch(
                `/order/cancelOrder/${orderId}`,
                { cancelMessage: fd.get("cancelMessage") }
            );
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("fetchTalentOrderHistory");
            },
            onError: (error) => {
                return error;
            },
        }
    );

    const archiveCommissionOrderMutation = useMutation(
        async (orderId) => {
            const response = await apiUtils.patch(
                `/order/archiveOrder/${orderId}`
            );
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("fetchMemberOrderHistory");
                queryClient.invalidateQueries("fetchArchivedOrderHistory");
            },
            onError: (error) => {
                return error;
            },
        }
    );

    const reportCommissionOrderMutation = useMutation(
        async (orderId) => {
            const response = await apiUtils.post(
                `/commissionReport/createCommissionReport/${orderId}`
            );
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("fetchMemberOrderHistory");
            },
            onError: (error) => {
                return error;
            },
        }
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                moreActionsRef.current &&
                !moreActionsRef.current.contains(event.target) &&
                archiveOrderBtnRef.current &&
                !archiveOrderBtnRef.current.contains(event.target) &&
                reportOrderBtnRef.current &&
                !reportOrderBtnRef.current.contains(event.target)
                // && !event.target.closest('.conversation-item')
            ) {
                setShowMemberOrderMoreActions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (isFetchingMemberOrderHistoryLoading) {
        return <span>Đang tải...</span>;
    }

    if (isFetchingMemberOrderHistoryError) {
        return (
            <span>
                Có lỗi xảy ra: {fetchingMemberOrderHistoryError.message}
            </span>
        );
    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Trạng thái</th>
                        <th>Dịch vụ</th>
                        <th>Giá dự kiến</th>
                        <th>Deadline dự kiến</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                {orders?.length}
                {orders?.map((order) => {
                    <>
                        <span>{order?._id}</span>
                        <span>{order?.status}</span>
                        <span>{order?.isDirect}</span>
                        <span>{order?.commissionServiceId?.title}</span>
                        <span>{order?.isDirect}</span>
                        <span>{order?.isDirect}</span>
                        {/* <span>{showMemberOrderMoreActions === order}</span> */}
                    </>;
                })}
                
            </table>
            {/* Modal forms */}
            {overlayVisible && (
                <div className="overlay">
                    {showRenderCommissionOrder && (
                        <RenderCommissionOrder
                            commissionOrder={commissionOrder}
                            setShowRenderCommissionOrder={
                                setShowRenderCommissionOrder
                            }
                            setOverlayVisible={setOverlayVisible}
                        />
                    )}
                    {showUpdateCommissionOrder && (
                        <UpdateCommissionOrder
                            commissionOrder={commissionOrder}
                            setShowUpdateCommissionOrder={
                                setShowUpdateCommissionOrder
                            }
                            setOverlayVisible={setOverlayVisible}
                        />
                    )}
                    {showArchiveCommissionOrder && (
                        <ArchiveCommissionOrder
                            commissionOrder={commissionOrder}
                            setShowArchiveCommissionOrder={
                                setShowArchiveCommissionOrder
                            }
                            setOverlayVisible={setOverlayVisible}
                            archiveCommissionOrderMutation={
                                archiveCommissionOrderMutation
                            }
                        />
                    )}
                    {showUnarchiveCommissionOrder && (
                        <UnarchiveCommissionOrder
                            commissionOrder={commissionOrder}
                            setShowUnarchiveCommissionOrder={
                                setShowUnarchiveCommissionOrder
                            }
                            setOverlayVisible={setOverlayVisible}
                            unarchiveCommissionOrderMutation={
                                unarchiveCommissionOrderMutation
                            }
                        />
                    )}
                    {showReportCommissionOrder && (
                        <ReportCommissionOrder
                            commissionOrder={commissionOrder}
                            setShowReportCommissionOrder={
                                setShowReportCommissionOrder
                            }
                            setOverlayVisible={setOverlayVisible}
                            reportCommissionOrderMutation={
                                reportCommissionOrderMutation
                            }
                        />
                    )}

                    {showRenderProposals && (
                        <RenderProposals
                            commissionOrder={commissionOrder}
                            setShowRenderProposals={setShowRenderProposals}
                            setOverlayVisible={setOverlayVisible}
                        />
                    )}
                </div>
            )}
        </>
    );
}
