// Imports
import { useState, useRef, useEffect } from "react";

// Resources
import { useModal } from "../../../contexts/modal/ModalContext";
import { isFilled } from "../../../utils/validator";
import { apiUtils } from "../../../utils/newRequest";

// Styling

export default function UnarchiveCommissionOrder({ commissionOrder, setShowUnarchiveCommissionOrder, setOverlayVisible, unarchiveCommissionOrderMutation }) {
    // Return null if the commission order to be rejected is not specified
    if (!commissionOrder) {
        return null;
    }
    console.log(commissionOrder)

    const { setModalInfo } = useModal();

    const [errors, setErrors] = useState({});
    const [isSubmitUnarchiveCommissionOrderLoading, setIsSubmitUnarchiveCommissionOrderLoading] = useState(false);

    // Toggle display modal form
    const commissionOrderRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (commissionOrderRef && commissionOrderRef.current && !commissionOrderRef.current.contains(e.target)) {
                setShowUnarchiveCommissionOrder(false);
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
        setIsSubmitUnarchiveCommissionOrderLoading(true);
        console.log(commissionOrder._id)

        try {
            const response = await unarchiveCommissionOrderMutation.mutateAsync(commissionOrder._id);
            console.log(response);
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Xóa khỏi mục lưu trữ thành công",
                });
                setShowUnarchiveCommissionOrder(false);
                setOverlayVisible(false);
            }
        } catch (error) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response?.data?.message,
            }));
        } finally {
            setIsSubmitUnarchiveCommissionOrderLoading(false);
        }
    };

    return (
        <div className="reject-commission-order modal-form type-3 sm" ref={commissionOrderRef} onClick={(e) => { e.stopPropagation() }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowUnarchiveCommissionOrder(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h2 className="form__title">Xóa khỏi mục lưu trữ</h2>
            <div className="form-field">
                <p className="text-align-center">
                Bạn có chắc muốn xóa đơn hàng khỏi mục lưu trữ?
                </p>
            </div>
            <div className="form-field">
                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
            </div>
            <div className="form-field">
                <button
                    type="submit"
                    className="form-field__input btn btn-2 btn-md"
                    onClick={handleSubmit}
                    disabled={isSubmitUnarchiveCommissionOrderLoading}
                >
                    {isSubmitUnarchiveCommissionOrderLoading ? (
                        <span className="btn-spinner"></span>
                    ) : (
                        "Xác nhận"
                    )}
                </button>
            </div>

        </div>
    );
}
