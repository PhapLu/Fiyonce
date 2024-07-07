// Imports
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

// Contexts
import { useAuth } from "../../contexts/auth/AuthContext";

// Components
import RenderCommissionOrder from "../crudCommissionOrder/render/RenderCommissionOrder";
import UpdateCommissionOrder from "../crudCommissionOrder/update/UpdateCommissionOrder";
import RenderProposals from "../crudProposal/render/RenderProposals";
import CreateProposal from "../crudProposal/create/CreateProposal";


// Utils
import { apiUtils } from "../../utils/newRequest"
import { formatCurrency } from "../../utils/formatter";

// Styling
import "./OrderHistory.scss";

export default function OrderHistory() {
    const { userInfo } = useAuth();
    const [commissionOrder, setCommissionOrder] = useState();
    const [showRenderCommissionOrder, setShowRenderCommissionOrder] = useState();
    const [showUpdateCommissionOrder, setShowUpdateCommissionOrder] = useState();
    const [showRenderProposals, setShowRenderProposals] = useState(false);

    const [showCreateProposal, setShowCreateProposal] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState();


    const [orderHistoryType, setOrderHistoryType] = useState(userInfo.role);

    const fetchMemberOrderHistory = async () => {
        try {
            const response = await apiUtils.get(`/order/readMemberOrderHistory`);
            return response.data.metadata.memberOrderHistory;
        } catch (error) {
            return null;
        }
    }

    const { data: memberOrderHistory, error: fetchingMemberOrderHistoryError, isError: isFetchingMemberOrderHistoryError, isLoading: isFetchingMemberOrderHistoryLoading } = useQuery(
        ['fetchMemberOrderHistory'],
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

    const fetchTalentOrderHistory = async () => {
        try {
            const response = await apiUtils.get(`/order/readTalentOrderHistory`);
            console.log("abc")
            console.log(response.data.metadata.talentOrderHistory)
            return response.data.metadata.talentOrderHistory;
        } catch (error) {
            return null;
        }
    }

    const { data: talentOrderHistory, error: fetchingTalentOrderHistory, isError: isFetchingTalentOrderHistoryError, isLoading: isFetchingTalentOrderHistoryLoading } = useQuery(
        ['fetchTalentOrderHistory'],
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

    if (orderHistoryType === "member" && isFetchingMemberOrderHistoryLoading) {
        return <span>Đang tải...</span>
    }

    if (orderHistoryType === "member" && isFetchingMemberOrderHistoryError) {
        return <span>Có lỗi xảy ra: {error.message}</span>
    }

    return (
        <>
            <div className="order-history">
                <section className="section">
                    {userInfo.role === "talent" && (
                        <div className="profile-page__header">
                            <div className="profile-page__header--left">
                                <button
                                    className={`btn btn-3 btn-md ${orderHistoryType === "member" ? "active" : ""}`}
                                    onClick={() => setOrderHistoryType("member")}
                                >
                                    Đơn khách đặt
                                </button>
                                <button
                                    className={`btn btn-3 btn-md ${orderHistoryType === "talent" ? "active" : ""}`}
                                    onClick={() => setOrderHistoryType("talent")}
                                >
                                    Đơn hàng của tôi
                                </button>
                            </div>
                        </div>
                    )}


                    {
                        orderHistoryType === "talent" ? (
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
                                        talentOrderHistory?.length > 0 ? talentOrderHistory.map((order, index) => {
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
                                                            <button onClick={() => { setCommissionOrder(order); setShowRenderCommissionOrder(false); setShowUpdateCommissionOrder(true), setOverlayVisible(true) }} className="btn btn-3">Chỉnh sửa</button>
                                                        </>
                                                        <>
                                                            <button onClick={() => { setCommissionOrder(order); setShowRenderCommissionOrder(false); setShowCreateProposal(true), setOverlayVisible(true) }} className="btn btn-3">Soạn hợp đồng</button>
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
                                                            <button onClick={() => { setCommissionOrder(order); setShowRenderCommissionOrder(false); setShowUpdateCommissionOrder(true), setOverlayVisible(true) }} className="btn btn-3">Chỉnh sửa</button>
                                                        </>
                                                        <>
                                                            <button onClick={() => { setCommissionOrder(order); setShowRenderCommissionOrder(false); setShowCreateProposal(true), setOverlayVisible(true) }} className="btn btn-3">Xem hợp đồng</button>
                                                        </>
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
                        )
                    }
                </section>
            </div >

            {/* Modal forms */}
            {
                overlayVisible &&
                (
                    <div className="overlay">
                        {showRenderCommissionOrder && <RenderCommissionOrder commissionOrder={commissionOrder} setShowRenderCommissionOrder={setShowRenderCommissionOrder} setOverlayVisible={setOverlayVisible} />}
                        {showUpdateCommissionOrder && <UpdateCommissionOrder commissionOrder={commissionOrder} setShowUpdateCommissionOrder={setShowUpdateCommissionOrder} setOverlayVisible={setOverlayVisible} />}
                        
                        {showCreateProposal && <CreateProposal setShowCreateProposal={setShowCreateProposal} setOverlayVisible={setOverlayVisible} />}
                        {showRenderProposals && <RenderProposals commissionOrder={commissionOrder} setShowRenderProposals={setShowRenderProposals} setOverlayVisible={setOverlayVisible} />}
                   
                    </div>
                )
            }
        </>
    )
}