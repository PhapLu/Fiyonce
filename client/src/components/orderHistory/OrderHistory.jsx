import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/auth/AuthContext";
import { useOutletContext } from "react-router-dom";
import "./OrderHistory.scss";

export default function OrderHistory() {
    // const { userInfo } = useAuth();
    // const [myOrders, setMyOrders] = useState([]);
    // const profileInfo = useOutletContext();

    // // Fetch orders by user id
    // useEffect(() => {
    //     const userId = userInfo._id;
    // }, [])

    return (
        <div className="order-history">
            <section className="section">
                <h3 className="section__title">Đơn hàng của bạn</h3>
                {/* {(myOrders && myOrders.length > 0) ? (
                    <ul className="order-history-container">
                        {myOrders.map(order => {
                            <li>{order.title}</li>
                        })}
                    </ul>
                ) : (
                    <div>
                        <p>Bạn hiện chưa có đơn hàng nào.</p>
                        <p>
                            <Link><span className="highlight-text">Tìm kiếm họa sĩ</span></Link> hoặc <Link><span className="highlight-text"> mô tả yêu cầu </span></Link> để Fiyonce tìm họa sĩ giúp bạn nhé.
                        </p>
                    </div>
                )} */}
            </section>
        </div>
    )
}