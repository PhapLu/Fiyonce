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
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");

    // Toggle display modal form
    const commissionOrderRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (commissionOrderRef && commissionOrderRef.current && !commissionOrderRef.current.contains(e.target)) {
                setShowDeliverCommissionOrder(false);
                setOverlayVisible(false);
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
                setShowDeliverCommissionOrder(false);
                setOverlayVisible(false);
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
                    setShowDeliverCommissionOrder(false);
                    setOverlayVisible(false);
                }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h2 className="form__title">Hoàn tất đơn hàng</h2>
                <div className="form-field">
                    <p className="highlight-bg-text text-align-justify">
                        Khi khách hàng xác nhận "Đã nhận được hàng", bạn sẽ nhận được tiền thù lao của mình.
                        Sau 07 ngày kể từ thời điểm hoàn tất, nếu không có báo cáo vi phạm từ phía khách hàng thì tiền sẽ được chuyển vào tài khoản mà bạn liên kết với Pastal.
                    </p>
                </div>

                <p className="mt-8 mb-32 text-align-center">
                    Pastal Team chúc bạn làm việc vui vẻ, giữ sức khỏe và đạt được trạng thái tốt nhất khi thực hiện dịch vụ trên nền tảng <span className="fs-20">💝</span>.
                </p>
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
                </div>
            </div>
        </div>
    );
}