// Imports
import { useState, useRef, useEffect } from "react";

// Resources
import { useModal } from "../../../contexts/modal/ModalContext";
import { isFilled } from "../../../utils/validator";
import { apiUtils } from "../../../utils/newRequest";

// Styling

export default function CancelCommissionOrder({ commissionOrder, setShowCancelCommissionOrder, setOverlayVisible, cancelCommissionOrderMutation }) {
    // Return null if the commission order to be canceled is not specified
    if (!commissionOrder) {
        return null;
    }

    const { setModalInfo } = useModal();

    const [errors, setErrors] = useState({});
    const [isSubmitCancelCommissionOrderLoading, setIsSubmitCancelCommissionOrderLoading] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");

    // Toggle display modal form
    const commissionOrderRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (commissionOrderRef && commissionOrderRef.current && !commissionOrderRef.current.contains(e.target)) {
                setShowCancelCommissionOrder(false);
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
        const cancelMessage = selectedReason === "other" ? otherReason : selectedReason;

        if (!isFilled(cancelMessage)) {
            errors.cancelMessage = "Vui lòng chọn một lí do";
        }
        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitCancelCommissionOrderLoading(true);

        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitCancelCommissionOrderLoading(false);
            return;
        }

        try {
            const cancelMessage = selectedReason === "other" ? otherReason : selectedReason;
            console.log(cancelMessage);
            const fd = new FormData();
            fd.append("cancelMessage", cancelMessage);
            console.log(commissionOrder._id)
            console.log(fd.get("cancelMessage"))
            // const response = await apiUtils.patch(`/order/cancelOrder/${commissionOrder.orderId}`, fd);
            const response = await cancelCommissionOrderMutation.mutateAsync({ orderId: commissionOrder._id, fd });
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Hủy đơn  hàng thành công",
                });
                setShowCancelCommissionOrder(false);
                setOverlayVisible(false);
            }
        } catch (error) {
            console.error("Failed to submit:", error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response?.data?.message,
            }));
        } finally {
            setIsSubmitCancelCommissionOrderLoading(false);
        }
    };

    return (
        <div className="cancel-commission-order modal-form type-3 sm" ref={commissionOrderRef} onClick={(e) => { e.stopPropagation() }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowCancelCommissionOrder(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h2 className="form__title">Hủy đơn</h2>
            <div className="form-field">
                <p className="highlight-bg-text text-align-center">
                    Nếu xác nhận hủy đơn, thông tin về đơn hàng vẫn sẽ được hiển thị nhưng đơn hàng sẽ không còn hiệu lực.
                </p>
            </div>
            <div className="mb-32">
                <div className="mb-8">
                    <label className="form-field__label">
                        <input
                            type="radio"
                            name="cancelMessage"
                            value="Li do 1"
                            checked={selectedReason === "Li do 1"}
                            onChange={(e) => setSelectedReason(e.target.value)}
                        />
                        Li do 1
                    </label>
                </div>

                <div className="mb-8">
                    <label>
                        <input
                            type="radio"
                            name="cancelMessage"
                            value="Li do 2"
                            checked={selectedReason === "Li do 2"}
                            onChange={(e) => setSelectedReason(e.target.value)}
                        />
                        Li do 2
                    </label>
                </div>

                <div className="mb-8">
                    <label>
                        <input
                            type="radio"
                            name="cancelMessage"
                            value="other"
                            checked={selectedReason === "other"}
                            onChange={(e) => setSelectedReason(e.target.value)}
                        />
                        Lí do khác
                    </label>
                </div>
                {selectedReason === "other" && (
                    <div className="form-field">
                        <label htmlFor="cancelMessage" className="form-field__label"></label>
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
                {errors.cancelMessage && <span className="form-field__error">{errors.cancelMessage}</span>}
                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
            </div>
            <div className="form-field">
                <button
                    type="submit"
                    className="form-field__input btn btn-2 btn-md"
                    onClick={handleSubmit}
                    disabled={isSubmitCancelCommissionOrderLoading}
                >
                    {isSubmitCancelCommissionOrderLoading ? (
                        <span className="btn-spinner"></span>
                    ) : (
                        "Xác nhận"
                    )}
                </button>
            </div>

        </div>
    );
}
