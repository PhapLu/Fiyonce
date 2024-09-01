// Imports
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useParams, useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

// Resources
import { useModal } from "../../../contexts/modal/ModalContext";
import { isFilled } from "../../../utils/validator";
import { apiUtils } from "../../../utils/newRequest";
import { useAuth } from "../../../contexts/auth/AuthContext";

// Styling

export default function StartWipCommissionOrder() {
    const { userInfo, socket } = useAuth();
    const { setModalInfo } = useModal();
    const commissionOrder = useOutletContext();

    const [errors, setErrors] = useState({});
    const [isSubmitStartWipCommissionOrderLoading, setIsSubmitStartWipCommissionOrderLoading] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");

    const queryClient = new useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const { "commission-order-id": commissionOrderId } = useParams();

    const closeStartWipCommissionOrderView = () => {
        navigate(-1);
    }

    // Toggle display modal form
    const commissionOrderRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (commissionOrderRef && commissionOrderRef.current && !commissionOrderRef.current.contains(e.target)) {
                closeStartWipCommissionOrderView();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitStartWipCommissionOrderLoading(true);

        try {
            console.log(commissionOrder._id)
            // const response = await apiUtils.patch(`/order/startWipOrder/${commissionOrder.orderId}`, fd);
            const response = await startWipCommissionOrderMutation.mutateAsync({ orderId: commissionOrder._id });
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Đã xác nhận thực hiện đơn hàng",
                });
                closeStartWipCommissionOrderView();
            }

            // const senderId = userInfo._id;
            // const receiverId = commissionOrder.memberId._id;
            // const inputs2 = { receiverId, type: "startWipCommissionOrder", url: `/order-history` }
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
            setIsSubmitStartWipCommissionOrderLoading(false);
        }
    };

    return (
        <div className="overlay">
            <div className="startWip-commission-order modal-form type-3 sm" ref={commissionOrderRef} onClick={(e) => { e.stopPropagation() }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                    closeStartWipCommissionOrderView();
                }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h2 className="form__title">Bắt đầu thực hiện đơn</h2>
                <div className="form-field">
                    <p className="highlight-bg-text text-align-justify">
                        Bằng cách xác nhận, Pastal sẽ thông báo đến khách hàng rằng bạn đã tiến hành thực hiện đơn hàng.
                        Sau khi hoàn thành đơn hàng và bàn giao cho khách, hãy nhớ click vào nút "Hoàn tất" nhé.
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
                        disabled={isSubmitStartWipCommissionOrderLoading}
                    >
                        {isSubmitStartWipCommissionOrderLoading ? (
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