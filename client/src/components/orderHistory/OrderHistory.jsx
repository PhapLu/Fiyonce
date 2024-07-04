import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

import { useAuth } from "../../contexts/auth/AuthContext";
import { useOutletContext } from "react-router-dom";
import { apiUtils } from "../../utils/newRequest"
import "./OrderHistory.scss";

export default function OrderHistory() {
    const { userInfo } = useAuth();

    const fetchOrders = async () => {
        try {
            const response = await apiUtils.get(`/order/readOrderHistory`);
            console.log("abc")
            console.log(response)
            return response.data.metadata.orders;
        } catch (error) {
            return null;
        }
    }

    const { data: orders, error, isError, isLoading } = useQuery(
        ['fetchOrders'],
        fetchOrders,
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching service by ID:', error);
            },
        }
    );

    if (isLoading) {
        return <span>Đang tải...</span>
    }

    if (isError) {
        return <span>Có lỗi xảy ra: {error.message}</span>
    }

    return (
        <div className="order-history">
            <section className="section">
                <h3 className="section__title">Đơn hàng của bạn</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Trạng thái</th>
                            <th>Tên đơn hàng</th>
                            <th>Giá dự kiến</th>
                            <th>Deadline dự kiến</th>
                            <th>Riêng tư</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders?.length > 0 ? orders.map((order, index) => {
                                return (
                                    <tr key={index}>
                                        <td >
                                            <span className={`status ${order.status}`}>
                                                {order.status === "pending" && "Đang chờ họa sĩ xác nhận"}
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
                                        <td>{order.minPrice || order.price || "-"}</td>
                                        <td>{order.deadline || "-"}</td>
                                        <td>{order.isPrivate ? "Có" : "Không"}</td>
                                        <td>
                                            <button className="btn btn-3">Chi tiet</button>
                                        </td>
                                    </tr>
                                )

                            }) : (
                                <tr key={index}>
                                    <td colSpan={6}>Bạn hiện chưa có đơn hàng nào.
                                        <Link><span className="highlight-text">Tìm kiếm họa sĩ</span></Link> hoặc <Link><span className="highlight-text"> mô tả yêu cầu </span></Link> để Fiyonce tìm họa sĩ giúp bạn nhé.
                                    </td>
                                </tr>
                            )
                        }

                    </tbody>
                </table>
                <div>
                    <p></p>
                    <p>
                    </p>
                </div>
            </section>
        </div>
    )
}