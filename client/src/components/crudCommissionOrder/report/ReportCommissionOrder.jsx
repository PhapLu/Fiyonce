// Imports
import { useState, useRef, useEffect } from "react";

// Resources
import { useModal } from "../../../contexts/modal/ModalContext";
import { isFilled } from "../../../utils/validator";
import { apiUtils } from "../../../utils/newRequest";
import { useAuth } from "../../../contexts/auth/AuthContext";

// Styling

export default function ReportCommissionOrder({ commissionOrder, setShowReportCommissionOrder, setOverlayVisible, reportCommissionOrderMutation }) {
    // Return null if the commission order to be reported is not specified
    if (!commissionOrder) {
        return null;
    }


    const { userInfo } = useAuth();
    console.log(userInfo._id)
    console.log(commissionOrder.memberId._id)

    const { setModalInfo } = useModal();

    const [errors, setErrors] = useState({});
    const [isSubmitReportCommissionOrderLoading, setIsSubmitReportCommissionOrderLoading] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");

    // Toggle display modal form
    const commissionOrderRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (commissionOrderRef && commissionOrderRef.current && !commissionOrderRef.current.contains(e.target)) {
                setShowReportCommissionOrder(false);
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
        const content = selectedReason === "other" ? otherReason : selectedReason;

        if (!isFilled(content)) {
            errors.content = "Vui lòng chọn một lí do";
        }
        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitReportCommissionOrderLoading(true);

        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitReportCommissionOrderLoading(false);
            return;
        }

        try {
            const content = selectedReason === "other" ? otherReason : selectedReason;
            console.log(content);
            const fd = new FormData();
            fd.append("content", content);
            console.log(commissionOrder.orderId)
            console.log(fd.get("content"))
            // const response = await apiUtils.patch(`/order/reportOrder/${commissionOrder.orderId}`, fd);
            const response = await reportCommissionOrderMutation.mutateAsync({ orderId: commissionOrder.orderId, fd });
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Từ chối đơn hàng thành công",
                });
                setShowReportCommissionOrder(false);
                setOverlayVisible(false);
            }
        } catch (error) {
            console.error("Failed to submit:", error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response?.data?.message,
            }));
        } finally {
            setIsSubmitReportCommissionOrderLoading(false);
        }
    };

    return (
        <div className="report-commission-order modal-form type-3 sm" ref={commissionOrderRef} onClick={(e) => { e.stopPropagation() }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowReportCommissionOrder(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h2 className="form__title">{userInfo?._id === commissionOrder.memberId._id ? "Báo cáo khách hàng" : "Báo cáo họa sĩ"}</h2>
            <div className="form-field">
                <p className="highlight-bg-text text-align-center">
                    Pastal sẽ dựa trên hợp đồng giữa hai bên và thông tin bạn cung cấp để giải quyết. Quá trình này có thể mất 1-3 ngày.
                </p>
            </div>
            {userInfo?._id === commissionOrder.memberId._id ? (
                <div className="mb-32">
                    <div className="mb-8">
                        <label className="form-field__label">
                            <input
                                type="radio"
                                name="content"
                                value="Họa sĩ hoàn thành không đúng hạn"
                                checked={selectedReason === "Họa sĩ hoàn thành không đúng hạn"}
                                onChange={(e) => setSelectedReason(e.target.value)}
                            />
                            Họa sĩ hoàn thành không đúng hạn
                        </label>
                    </div>

                    <div className="mb-8">
                        <label>
                            <input
                                type="radio"
                                name="content"
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
                                name="content"
                                value="other"
                                checked={selectedReason === "other"}
                                onChange={(e) => setSelectedReason(e.target.value)}
                            />
                            Lí do khác
                        </label>
                    </div>
                    {selectedReason === "other" && (
                        <div className="form-field">
                            <label htmlFor="content" className="form-field__label"></label>
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
            ) : (
                <div className="mb-32">
                    <div className="mb-8">
                        <label className="form-field__label">
                            <input
                                type="radio"
                                name="content"
                                value="Khách hàng không hợp tác"
                                checked={selectedReason === "Khách hàng không hợp tác"}
                                onChange={(e) => setSelectedReason(e.target.value)}
                            />
                            Khách hàng không hợp tác
                        </label>
                    </div>

                    <div className="mb-8">
                        <label>
                            <input
                                type="radio"
                                name="content"
                                value="Khách hàng yêu cầu thêm chi tiết"
                                checked={selectedReason === "Khách hàng yêu cầu thêm chi tiết"}
                                onChange={(e) => setSelectedReason(e.target.value)}
                            />
                            Khách hàng yêu cầu thêm chi tiết
                        </label>
                    </div>

                    <div className="mb-8">
                        <label>
                            <input
                                type="radio"
                                name="content"
                                value="other"
                                checked={selectedReason === "other"}
                                onChange={(e) => setSelectedReason(e.target.value)}
                            />
                            Lí do khác
                        </label>
                    </div>
                    {selectedReason === "other" && (
                        <div className="form-field">
                            <label htmlFor="content" className="form-field__label"></label>
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
            )}

            <div className="form-field">
                {errors.content && <span className="form-field__error">{errors.content}</span>}
                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
            </div>
            <div className="form-field">
                <button
                    type="submit"
                    className="form-field__input btn btn-2 btn-md"
                    onClick={handleSubmit}
                    disabled={isSubmitReportCommissionOrderLoading}
                >
                    {isSubmitReportCommissionOrderLoading ? (
                        <span className="btn-spinner"></span>
                    ) : (
                        "Xác nhận"
                    )}
                </button>
            </div>

        </div>
    );
}
