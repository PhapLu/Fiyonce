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

export default function FinishCommissionOrder() {
    // Return null if the commission order to be completeed is not specified
    const { userInfo, socket } = useAuth();
    const { setModalInfo } = useModal();

    const [errors, setErrors] = useState({});
    const [isSubmitFinishCommissionOrderLoading, setIsSubmitFinishCommissionOrderLoading] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");

    // Toggle display modal form
    const commissionOrderRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (commissionOrderRef && commissionOrderRef.current && !commissionOrderRef.current.contains(e.target)) {
                setShowFinishCommissionOrder(false);
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
        setIsSubmitFinishCommissionOrderLoading(true);

        try {
            console.log(commissionOrder._id)
            // const response = await apiUtils.patch(`/order/completeOrder/${commissionOrder.orderId}`, fd);
            const response = await completeCommissionOrderMutation.mutateAsync({ orderId: commissionOrder._id });
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Đã xác nhận thực hiện đơn hàng",
                });
                setShowFinishCommissionOrder(false);
                setOverlayVisible(false);
            }

            // const senderId = userInfo._id;
            // const receiverId = commissionOrder.memberId._id;
            // const inputs2 = { receiverId, type: "completeCommissionOrder", url: `/order-history` }
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
            setIsSubmitFinishCommissionOrderLoading(false);
        }
    };

    return (
        <div className="overlay">
            <div className="complete-commission-order modal-form type-3 sm" ref={commissionOrderRef} onClick={(e) => { e.stopPropagation() }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                    setShowFinishCommissionOrder(false);
                    setOverlayVisible(false);
                }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h2 className="form__title">Hoàn tất đơn hàng</h2>
                <div className="form-field">
                    <p className="highlight-bg-text text-align-justify">
                        Khi khách hàng xác nhận "Đã nhận được hàng", bạn sẽ nhận
                        Sau 07 ngày kể từ thời điểm hoàn tất, nếu không có báo cáo vi phạm gì thì tiền sẽ được chuyển vào tài khoản mà bạn liên kết với Pastal.
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
                        disabled={isSubmitFinishCommissionOrderLoading}
                    >
                        {isSubmitFinishCommissionOrderLoading ? (
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