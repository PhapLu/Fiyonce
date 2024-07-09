// Imports
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

// Contexts
import { useAuth } from "../../contexts/auth/AuthContext";

// Components
import RenderCommissionOrder from "../crudCommissionOrder/render/RenderCommissionOrder";
import UpdateCommissionOrder from "../crudCommissionOrder/update/UpdateCommissionOrder";
import TalentArchiveCommissionOrder from "../crudCommissionOrder/archive/TalentArchiveCommissionOrder";
import TalentReportCommissionOrder from "../crudCommissionOrder/report/TalentReportCommissionOrder";

import RenderProposals from "../crudProposal/render/RenderProposals";
import CreateProposal from "../crudProposal/create/CreateProposal";

import RenderCommissionTos from "../crudCommissionTos/render/RenderCommissionTos";

//Contexts
import { useModal } from "../../contexts/modal/ModalContext";

// Utils
import { apiUtils } from "../../utils/newRequest"
import { formatCurrency } from "../../utils/formatter";

// Styling
import "./OrderHistory.scss";
import RejectCommissionOrder from "../crudCommissionOrder/reject/RejectCommissionOrder";

export default function OrderHistory() {
    const queryClient = useQueryClient();
    const { setModalInfo } = useModal();
    const { userInfo } = useAuth();
    const [commissionOrder, setCommissionOrder] = useState();
    const [showRenderCommissionOrder, setShowRenderCommissionOrder] = useState();
    const [showUpdateCommissionOrder, setShowUpdateCommissionOrder] = useState();
    const [showRenderProposals, setShowRenderProposals] = useState(false);

    const [showCreateProposal, setShowCreateProposal] = useState(false);
    const [showRejectCommissionOrder, setShowRejectCommissionOrder] = useState(false);

    const [showTalentOrderMoreActions, setShowTalentOrderMoreActions] = useState();
    const [showTalentArchiveCommissionOrder, setShowTalentArchiveCommissionOrder] = useState(false);
    const [showTalentReportCommissionOrder, setShowTalentReportCommissionOrder] = useState(false);

    const [showCommissionTosView, setShowCommissionTosView] = useState(false);

    const [overlayVisible, setOverlayVisible] = useState();

    const [orderHistoryType, setOrderHistoryType] = useState(userInfo.role);

    const fetchTalentOrderHistory = async () => {
        try {
            const response = await apiUtils.get(`/order/readTalentOrderHistory`);
            console.log(response.data.metadata.talentOrderHistory)
            return response.data.metadata.talentOrderHistory;
        } catch (error) {
            return null;
        }
    }

    const { data: talentOrderHistory, error: fetchingTalentOrderHistoryError, isError: isFetchingTalentOrderHistoryError, isLoading: isFetchingTalentOrderHistoryLoading } = useQuery(
        'fetchTalentOrderHistory',
        fetchTalentOrderHistory,
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching service by ID:', error);
            },
        }
    );

    const fetchMemberOrderHistory = async () => {
        try {
            const response = await apiUtils.get(`/order/readMemberOrderHistory`);
            return response.data.metadata.memberOrderHistory;
        } catch (error) {
            return null;
        }
    }

    const { data: memberOrderHistory, error: fetchingMemberOrderHistoryError, isError: isFetchingMemberOrderHistoryError, isLoading: isFetchingMemberOrderHistoryLoading } = useQuery(
        'fetchMemberOrderHistory',
        fetchMemberOrderHistory,
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching service by ID:', error);
            },
        }
    );

    const fetchArchivedOrderHistory = async () => {
        try {
            const response = await apiUtils.get(`/order/readArchivedOrderHistory`);
            return response.data.metadata.archivedOrderHistory;
        } catch (error) {
            return null;
        }
    }

    const { data: archivedOrderHistory, error: fetchingArchivedOrderHistoryError, isError: isFetchingArchivedOrderHistoryError, isLoading: isFetchingArchivedOrderHistoryLoading } = useQuery(
        'fetchArchivedOrderHistory',
        fetchArchivedOrderHistory,
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching service by ID:', error);
            },
        }
    );


    const fetchTermOfServices = async () => {
        try {
            const response = await apiUtils.get(`/termOfService/readTermOfServices`);
            return response.data.metadata.termOfServices;
        } catch (error) {
            return null;
        }
    }


    const { data: termOfServices, error: fetchingTermOfServicesError, isError: isFetchingTermOfServicesError, isLoading: isFetchingTermOfServicesLoading } = useQuery(
        'fetchTermOfServices',
        fetchTermOfServices,
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching term of service:', error);
            },
        }
    );

    const createPostMutation = useMutation(
        async (formData) => {
            const response = await apiUtils.post("/proposal/createProposal", formData);
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

    const talentArchiveCommissionOrderMutation = useMutation(
        async (orderId) => {
            const response = await apiUtils.patch(`/order/talentArchiveOrder/${orderId}`);
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

    const talentReportCommissionOrderMutation = useMutation(
        async (orderId) => {
            const response = await apiUtils.patch(`/order/talentReportOrder/${orderId}`);
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

    const memberArchiveCommissionOrderMutation = useMutation(
        async (orderId) => {
            const response = await apiUtils.patch(`/order/memberArchiveOrder/${orderId}`);
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

    const memberReportCommissionOrderMutation = useMutation(
        async (orderId) => {
            const response = await apiUtils.patch(`/order/memberReportOrder/${orderId}`);
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

    const handleShowCreateProposal = () => {
        if (termOfServices && termOfServices.length > 0) {
            setShowCreateProposal(true);
            setOverlayVisible(true);
        } else {
            setModalInfo({
                status: "warning",
                message: "Vui lòng tạo điều khoản dịch vụ trước"
            })
        }
    }

    const moreActionsRef = useRef(null);
    useEffect(() => {
        const handler = (e) => {
            if (moreActionsRef.current && !moreActionsRef.current.contains(e.target)) {
                setShowTalentOrderMoreActions(null);
            }
        }

        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [moreActionsRef]);



    if (orderHistoryType === "member" && isFetchingMemberOrderHistoryLoading) {
        return <span>Đang tải...</span>
    }

    if (orderHistoryType === "member" && isFetchingMemberOrderHistoryError) {
        return <span>Có lỗi xảy ra: {fetchingMemberOrderHistoryError.message}</span>
    }

    if (orderHistoryType === "talent" && isFetchingTalentOrderHistoryLoading) {
        return <span>Đang tải...</span>
    }

    if (orderHistoryType === "talent" && isFetchingTalentOrderHistoryError) {
        return <span>Có lỗi xảy ra: {fetchingTalentOrderHistoryError.message}</span>
    }

    
    if (orderHistoryType === "archived" && isFetchingArchivedOrderHistoryLoading) {
        return <span>Đang tải...</span>
    }

    if (orderHistoryType === "archived" && isFetchingArchivedOrderHistoryError) {
        return <span>Có lỗi xảy ra: {fetchingArchivedOrderHistoryError.message}</span>
    }

    return (
        <>
            <div className="order-history">
                <section className="section">
                    {userInfo.role === "talent" && (
                        <div className="profile-page__header">
                            <div className="profile-page__header--left">
                                <button
                                    className={`btn btn-3 btn-md ${orderHistoryType === "talent" ? "active" : ""}`}
                                    onClick={() => setOrderHistoryType("talent")}
                                >
                                    Đơn khách đặt
                                </button>
                                <button
                                    className={`btn btn-3 btn-md ${orderHistoryType === "member" ? "active" : ""}`}
                                    onClick={() => setOrderHistoryType("member")}
                                >
                                    Đơn hàng của tôi
                                </button>
                                <button
                                    className={`btn btn-3 btn-md ${orderHistoryType === "archived" ? "active" : ""}`}
                                    onClick={() => setOrderHistoryType("archived")}
                                >
                                    Mục lưu trữ
                                </button>
                            </div>

                            <div className="profile-page__header--right">
                                <button className="btn btn-3" onClick={() => { setShowCommissionTosView(true); setOverlayVisible(true) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
                                    </svg>
                                    Điều khoản
                                </button>
                            </div>
                        </div>
                    )}

                    {
                        orderHistoryType === "talent" ? (
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
                                        talentOrderHistory?.length > 0 ? talentOrderHistory.map((order, index) => {
                                            return (
                                                <tr key={index} onClick={() => { setCommissionOrder(order); setShowRenderCommissionOrder(true); setOverlayVisible(true) }}>
                                                    <td >
                                                        <span className={`status ${order.status}`}>
                                                            {order.status === "pending" && "Đang đợi bạn xác nhận"}
                                                            {order.status === "approved" && "Đang đợi khách hàng thanh toán"}
                                                            {order.status === "rejected" && "Bạn đã từ chối"}
                                                            {order.status === "confirmed" && "Khách đã thanh toán cọc"}
                                                            {order.status === "canceled" && "Đã hủy"}
                                                            {order.status === "in_progress" && "Đang thực hiện đơn"}
                                                            {order.status === "finished" && "Hoàn tất"}
                                                            {order.status === "under_processing" && "Admin đang xử lí"}
                                                        </span>
                                                    </td>
                                                    <td>{order.memberId._id || "-"}</td>
                                                    <td>{`đ${formatCurrency(order.minPrice)}` || `đ${formatCurrency(order.price)}` || "-"}</td>
                                                    <td>{order.deadline || "-"}</td>
                                                    <td className="flex-align-center">
                                                        <>
                                                            {
                                                                order.status === "pending" &&
                                                                (
                                                                    <>
                                                                        <button onClick={(e) => { e.stopPropagation(); setCommissionOrder(order); setShowRenderCommissionOrder(false); handleShowCreateProposal() }} className="btn btn-3">Soạn hợp đồng</button>
                                                                        <button onClick={(e) => { e.stopPropagation(); setCommissionOrder(order); setShowRenderCommissionOrder(false); setShowRejectCommissionOrder(true); setOverlayVisible(true); }} className="btn btn-3">Từ chối</button>
                                                                    </>
                                                                )
                                                            }
                                                            {order.status === "approved" && (
                                                                <button onClick={(e) => { e.stopPropagation(); setCommissionOrder(order); setShowRenderCommissionOrder(false); setShowCreateProposal(true); setOverlayVisible(true); }} className="btn btn-3">Xem hợp đồng</button>
                                                            )}
                                                        </>
                                                        <button className="btn btn-3 icon-only p-4 more-action-btn" ref={moreActionsRef} onClick={(e) => { e.stopPropagation(), setShowTalentOrderMoreActions(order) }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                                            </svg>

                                                            {showTalentOrderMoreActions === order && (
                                                                <div className="more-action-container">
                                                                    <div className="more-action-item flex-align-center gray-bg-hover p-4 br-4" onClick={() => { setCommissionOrder(order), setShowTalentArchiveCommissionOrder(true); setOverlayVisible(true) }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                                                        </svg>
                                                                        Lưu trữ
                                                                    </div>
                                                                    <hr />
                                                                    <div className="more-action-item flex-align-center gray-bg-hover p-4 br-4" onClick={() => { setCommissionOrder(order), setShowTalentReportCommissionOrder(true); setOverlayVisible(true) }}>
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
                                                <td colSpan={6}>Hiện chưa nhận được đơn hàng nào. Tham khảo
                                                    <Link><span className="highlight-text"> cẩm nang họa sĩ </span></Link> để xây dựng hồ sơ tốt hơn.
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <div className="" colSpan="5">
                                            <th>Trạng thái</th>
                                            <th>Tên đơn hàng</th>
                                            <th>Giá dự kiến</th>
                                            <th>Deadline dự kiến</th>
                                            <th>Riêng tư</th>
                                        </div>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        memberOrderHistory?.length > 0 ? memberOrderHistory.map((order, index) => {
                                            return (
                                                <tr key={index}>
                                                    <div className="" onClick={() => { setCommissionOrder(order); setShowRenderCommissionOrder(true); setOverlayVisible(true) }}>
                                                        <td >
                                                            <span className={`status ${order.status}`}>
                                                                {order.status === "pending" && "Đang đợi họa sĩ xác nhận"}
                                                                {order.status === "approved" && "Đang đợi bạn thanh toán"}
                                                                {order.status === "rejected" && "Họa sĩ đã từ chối"}
                                                                {order.status === "confirmed" && "Đã thanh toán cọc"}
                                                                {order.status === "canceled" && "Đã hủy"}
                                                                {order.status === "in_progress" && "Họa sĩ đang thực hiện"}
                                                                {order.status === "finished" && "Hoàn tất"}
                                                                {order.status === "under_processing" && "Admin đang xử lí"}
                                                            </span>
                                                        </td>
                                                        <td>{order.title || "-"}</td>
                                                        <td>{`đ${formatCurrency(order.minPrice)}` || `đ${formatCurrency(order.price)}` || "-"}</td>
                                                        <td>{order.deadline || "-"}</td>
                                                        <td>{order.isPrivate ? "Có" : "Không"}</td>
                                                    </div>

                                                    <td>
                                                        <>
                                                            <button onClick={() => { setCommissionOrder(order); setShowRenderCommissionOrder(false); setShowUpdateCommissionOrder(true); setOverlayVisible(true); }} className="btn btn-3">Chỉnh sửa</button>
                                                        </>
                                                        <>
                                                            <button onClick={() => { setCommissionOrder(order); setShowRenderCommissionOrder(false); setShowCreateProposal(true); setOverlayVisible(true); }} className="btn btn-3">Xem hợp đồng</button>
                                                        </>
                                                    </td>
                                                </tr>
                                            )

                                        }) : (

                                            <tr>
                                                <td colSpan={6}>Bạn hiện chưa có đơn hàng nào.
                                                    <Link><span className="highlight-text"> Tìm kiếm họa sĩ</span></Link> hoặc <Link><span className="highlight-text"> mô tả yêu cầu </span></Link> để Fiyonce tìm họa sĩ giúp bạn nhé.
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        )
                    }
                </section>
            </div>

            {/* Modal forms */}
            {
                overlayVisible &&
                (
                    <div className="overlay">
                        {showRenderCommissionOrder && <RenderCommissionOrder commissionOrder={commissionOrder} setShowRenderCommissionOrder={setShowRenderCommissionOrder} setOverlayVisible={setOverlayVisible} />}
                        {showUpdateCommissionOrder && <UpdateCommissionOrder commissionOrder={commissionOrder} setShowUpdateCommissionOrder={setShowUpdateCommissionOrder} setOverlayVisible={setOverlayVisible} />}
                        {showTalentArchiveCommissionOrder && <TalentArchiveCommissionOrder commissionOrder={commissionOrder} setShowTalentArchiveCommissionOrder={setShowTalentArchiveCommissionOrder} setOverlayVisible={setOverlayVisible} talentArchiveCommissionOrderMutation={talentArchiveCommissionOrderMutation} />}
                        {showTalentReportCommissionOrder && <TalentReportCommissionOrder commissionOrder={commissionOrder} setShowTalentReportCommissionOrder={setShowTalentReportCommissionOrder} setOverlayVisible={setOverlayVisible} talentReportCommissionOrderMutation={talentReportCommissionOrderMutation} />}

                        {showCreateProposal && <CreateProposal setShowCreateProposal={setShowCreateProposal} setOverlayVisible={setOverlayVisible} />}
                        {showRenderProposals && <RenderProposals commissionOrder={commissionOrder} setShowRenderProposals={setShowRenderProposals} setOverlayVisible={setOverlayVisible} />}
                        {showRejectCommissionOrder && <RejectCommissionOrder commissionOrder={commissionOrder} setShowRejectCommissionOrder={setShowRejectCommissionOrder} setOverlayVisible={setOverlayVisible} rejectCommissionOrderMutation={rejectCommissionOrderMutation} />}

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