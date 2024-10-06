// Imports
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation, useOutletContext } from "react-router-dom";
import { useQuery } from "react-query";

// Resources
import { useModal } from "../../../contexts/modal/ModalContext";
import { isFilled } from "../../../utils/validator";
import { apiUtils } from "../../../utils/newRequest";
import { useAuth } from "../../../contexts/auth/AuthContext";

// Styling

export default function DeliverCommissionOrder() {
    // Return null if the commission order to be delivered is not specified
    const { userInfo, socket } = useAuth();
    const { setModalInfo } = useModal();

    const [errors, setErrors] = useState({});
    const [isSubmitDeliverCommissionOrderLoading, setIsSubmitDeliverCommissionOrderLoading] = useState(false);
    const [isDeliverCommissionOrderSuccess, setIsDeliverCommissionOrderSuccess] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    // Toggle display modal form
    const closeDeliverCommissionOrderView = () => {
        if (location.pathname.includes("commission-market")) {
            navigate("/commission-market");
        } else {
            navigate("/order-history");
        }
    }

    const commissionOrderRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (commissionOrderRef && commissionOrderRef.current && !commissionOrderRef.current.contains(e.target)) {
                closeDeliverCommissionOrderView();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitDeliverCommissionOrderLoading(true);

        try {
            console.log(commissionOrder._id)
            // const response = await apiUtils.patch(`/order/deliverOrder/${commissionOrder.orderId}`, fd);
            const response = await deliverCommissionOrderMutation.mutateAsync({ orderId: commissionOrder._id });
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Đã xác nhận thực hiện đơn hàng",
                });
                closeDeliverCommissionOrderView();
            }

            // const senderId = userInfo._id;
            // const receiverId = commissionOrder.memberId._id;
            // const inputs2 = { receiverId, type: "deliverCommissionOrder", url: `/order-history` }
            // const response2 = await apiUtils.post(`/notification/createNotification`, inputs2);
            // const notificationData = response2.data.metadata.notification;
            // socket.emit('sendNotification', { senderId, receiverId, notification: notificationData, url: notificationData.url });
        } catch (error) {
            console.error("Failed to submit:", error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response?.data?.message,
            }));
        } finally {
            setIsSubmitDeliverCommissionOrderLoading(false);
        }
    };

    return (
        <div className="overlay">
            <div className="deliver-commission-order modal-form type-3 sm" ref={commissionOrderRef} onClick={(e) => { e.stopPropagation() }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                    closeDeliverCommissionOrderView();
                }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h2 className="form__title">Hoàn tất đơn hàng</h2>

                {
                    isDeliverCommissionOrderSuccess ? (
                        <p className="mt-8 mb-32 text-align-center">
                            Tadaaa, chúc mừng bạn đã hoàn thành đơn hàng cho khách và đóng góp vào các hoạt động cải thiện bữa ăn cho trẻ em vùng cao cũng như trồng thêm cây xanh. Pastal Team chúc bạn sớm có những đơn hàng kế tiếp và luôn đạt được trạng thái tốt nhất khi làm việc trên nền tảng. <span className="fs-20">🎉</span>.
                        </p>
                    ) : (
                        <>
                            <div className="form-field">
                                <p className="highlight-bg-text text-align-justify fs-13">
                                    Nếu khách hàng hài lòng với chất lượng sản phẩm và chọn "Đã nhận được hàng", 95.5% giá trị đơn hàng sẽ được chuyển vào tài khoản thanh toán mà bạn liên kết với Pastal trong vòng 24h. Nếu sau 07 ngày kể từ khi hoàn tất giao dịch mà không có phản hồi và báo cáo vi phạm từ phía khách hàng, giá trị đơn hàng sẽ tự động được chuyển vào tài khoản của bạn.
                                </p>
                            </div>
                            <div className="form-field">
                                <button
                                    type="submit"
                                    className="form-field__input btn btn-2 btn-md"
                                    onClick={handleSubmit}
                                    disabled={isSubmitDeliverCommissionOrderLoading}
                                >
                                    {isSubmitDeliverCommissionOrderLoading ? (
                                        <span className="btn-spinner"></span>
                                    ) : (
                                        "Xác nhận"
                                    )}
                                </button>
                            </div >
                        </>
                    )}
            </div >
        </div >
    );
}