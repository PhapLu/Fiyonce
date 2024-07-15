// Imports
import { useState, useRef, useEffect } from "react";

// Resources
import { useModal } from "../../../contexts/modal/ModalContext";
import { isFilled } from "../../../utils/validator";
import { apiUtils } from "../../../utils/newRequest";

// Styling

export default function RejectCommissionOrder({ commissionOrder, setShowRejectCommissionOrder, setOverlayVisible, rejectCommissionOrderMutation }) {
    // Return null if the commission order to be rejected is not specified
    if (!commissionOrder) {
        return null;
    }

    const { setModalInfo } = useModal();

    const [errors, setErrors] = useState({});
    const [isSubmitRejectCommissionOrderLoading, setIsSubmitRejectCommissionOrderLoading] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");

    // Toggle display modal form
    const commissionOrderRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (commissionOrderRef && commissionOrderRef.current && !commissionOrderRef.current.contains(e.target)) {
                setShowRejectCommissionOrder(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    const validateInputs = () => {
        let errors = {};
        const rejectMessage = selectedReason === "other" ? otherReason : selectedReason;

        if (!isFilled(rejectMessage)) {
            errors.rejectMessage = "Vui lòng chọn một lí do";
        }
        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitRejectCommissionOrderLoading(true);

        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitRejectCommissionOrderLoading(false);
            return;
        }

        try {
            const rejectMessage = selectedReason === "other" ? otherReason : selectedReason;
            console.log(rejectMessage);
            const fd = new FormData();
            fd.append("rejectMessage", rejectMessage);
            console.log(commissionOrder.orderId)
            console.log(fd.get("rejectMessage"))
            // const response = await apiUtils.patch(`/order/rejectOrder/${commissionOrder.orderId}`, fd);
            const response = await rejectCommissionOrderMutation.mutateAsync({orderId: commissionOrder.orderId, fd});
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Từ chối đơn hàng thành công",
                });
                setShowRejectCommissionOrder(false);
                setOverlayVisible(false);
            }
        } catch (error) {
            console.error("Failed to submit:", error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response?.data?.message,
            }));
        } finally {
            setIsSubmitRejectCommissionOrderLoading(false);
        }
    };

    return (
        <div className="reject-commission-order modal-form type-3 sm" ref={commissionOrderRef} onClick={(e) => { e.stopPropagation() }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowRejectCommissionOrder(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h2 className="form__title">Từ chối nhận đơn</h2>
            <div className="form-field">
                <p className="highlight-bg-text text-align-center">
                    Nếu xác nhận từ chối, thông tin về đơn hàng vẫn sẽ được hiển thị nhưng bạn sẽ không thể nhận lại đơn hàng này nữa.
                </p>
            </div>
            <div className="mb-32">
                <div className="mb-8">
                    <label className="form-field__label">
                        <input
                            type="radio"
                            name="rejectMessage"
                            value="Hiện đang quá tải đơn hàng"
                            checked={selectedReason === "Hiện đang quá tải đơn hàng"}
                            onChange={(e) => setSelectedReason(e.target.value)}
                        />
                        Hiện đang quá tải đơn hàng
                    </label>
                </div>

                <div className="mb-8">
                    <label>
                        <input
                            type="radio"
                            name="rejectMessage"
                            value="Yêu cầu của đơn hàng nằm ngoài khả năng"
                            checked={selectedReason === "Yêu cầu của đơn hàng nằm ngoài khả năng"}
                            onChange={(e) => setSelectedReason(e.target.value)}
                        />
                        Yêu cầu của đơn hàng nằm ngoài khả năng
                    </label>
                </div>

                <div className="mb-8">
                    <label>
                        <input
                            type="radio"
                            name="rejectMessage"
                            value="other"
                            checked={selectedReason === "other"}
                            onChange={(e) => setSelectedReason(e.target.value)}
                        />
                        Lí do khác
                    </label>
                </div>
                {selectedReason === "other" && (
                    <div className="form-field">
                        <label htmlFor="rejectMessage" className="form-field__label"></label>
                        <textarea
                            id="otherReason"
                            className="form-field__input"
                            placeholder="Nhập lí do hủy đơn"
                            value={otherReason}
                            onChange={(e) => setOtherReason(e.target.value)}
                        ></textarea>
                    </div>
                )}
            </div>
            <div className="form-field">
                {errors.rejectMessage && <span className="form-field__error">{errors.rejectMessage}</span>}
                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
            </div>
            <div className="form-field">
                <button
                    type="submit"
                    className="form-field__input btn btn-2 btn-md"
                    onClick={handleSubmit}
                    disabled={isSubmitRejectCommissionOrderLoading}
                >
                    {isSubmitRejectCommissionOrderLoading ? (
                        <span className="btn-spinner"></span>
                    ) : (
                        "Xác nhận"
                    )}
                </button>
            </div>

        </div>
    );
}
