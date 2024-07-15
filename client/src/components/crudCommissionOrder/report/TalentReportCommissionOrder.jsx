// Imports
import { useState, useRef, useEffect } from "react";

// Resources
import { useModal } from "../../../contexts/modal/ModalContext";
import { isFilled } from "../../../utils/validator";
import { apiUtils } from "../../../utils/newRequest";

// Styling

export default function TalentReportCommissionOrder({ commissionOrder, setShowTalentReportCommissionOrder, setOverlayVisible, talentReportCommissionOrderMutation }) {
    // Return null if the commission order to be rejected is not specified
    if (!commissionOrder) {
        return null;
    }

    const { setModalInfo } = useModal();

    const [errors, setErrors] = useState({});
    const [isSubmitTalentReportCommissionOrderLoading, setIsSubmitTalentReportCommissionOrderLoading] = useState(false);

    // Toggle display modal form
    const talentReportCommissionOrderRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (talentReportCommissionOrderRef && talentReportCommissionOrderRef.current && !talentReportCommissionOrderRef.current.contains(e.target)) {
                setShowTalentReportCommissionOrder(false);
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
        setIsSubmitTalentReportCommissionOrderLoading(true);

        try {
            // const response = await talentReportCommissionOrderMutation.mutateAsync(orderId);
            const response = "a";
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Báo cáo khách hàng thành công",
                });
                setShowTalentReportCommissionOrder(false);
                setOverlayVisible(false);
            }
        } catch (error) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response?.data?.message,
            }));
        } finally {
            setIsSubmitTalentReportCommissionOrderLoading(false);
        }
    };

    return (
        <div className="reject-commission-order modal-form type-3 sm" ref={talentReportCommissionOrderRef} onClick={(e) => { e.stopPropagation() }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowTalentReportCommissionOrder(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h2 className="form__title">Báo cáo khách hàng</h2>
            <div className="form-field">
                <p className="highlight-bg-text text-align-center">
                Pastal cần thông tin và bằng chứng để tiến hành xử lí và giành lại quyền lợi cho bạn. 
                Quy trình xử lí thường diễn ra trong 1-3 ngày. 
                </p>
            </div>
            <div className="form-field">
                <label htmlFor="content" className="form-field__label">Lí do</label>
                <textarea name="content" className="form-field__input" placeholder="Mô tả nguyên nhân "></textarea>
            </div>
            <div className="form-field">
                <label htmlFor="" className="form-field__label">Bằng chứng</label>
                <div className="form-field__annotation">Vui lòng cung cấp bằng chứng (3-5 ảnh) cho thấy khách hàng vi phạm hợp đồng giữa hai bên, hoặc các vi phạm về chính sách điều khoản họa sĩ của bạn hoặc của nền tảng.</div>
                
            </div>
            <div className="form-field">
                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
            </div>
            <div className="form-field">
                <button
                    type="submit"
                    className="form-field__input btn btn-2 btn-md"
                    onClick={handleSubmit}
                    disabled={isSubmitTalentReportCommissionOrderLoading}
                >
                    {isSubmitTalentReportCommissionOrderLoading ? (
                        <span className="btn-spinner"></span>
                    ) : (
                        "Xác nhận"
                    )}
                </button>
            </div>

        </div>
    );
}
