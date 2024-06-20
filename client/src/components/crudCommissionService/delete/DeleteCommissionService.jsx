// Imports
import { useState, useRef, useEffect } from "react";

// Styling
import "./DeleteCommissionService.scss";

export default function DeleteCommissionService({ deleteCommissionService, setShowDeleteCommissionServiceForm, setOverlayVisible, deleteMutation }) {
    if (!deleteCommissionService) {
        return;
    }
    const [errors, setErrors] = useState({});
    const [isSubmitDeleteCommissionServiceLoading, setIsSubmitDeleteCommissionServiceLoading] = useState(false);

    // Toggle display modal form
    const deleteCommissionServiceRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (deleteCommissionServiceRef && deleteCommissionServiceRef.current && !deleteCommissionServiceRef.current.contains(e.target)) {
                setShowDeleteCommissionServiceForm(false);
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
        setIsSubmitDeleteCommissionServiceLoading(true);

        try {
            await deleteMutation.mutateAsync(deleteCommissionService._id);
        } catch (error) {
            console.error("Failed to submit:", error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response.data.message
            }));
        } finally {
            setIsSubmitDeleteCommissionServiceLoading(false);
        }
    };

    return (
        <div className="delete-commission-service modal-form type-3" ref={deleteCommissionServiceRef} onClick={(e) => { e.stopPropagation() }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowDeleteCommissionServiceForm(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h2 className="form__title">Xóa dịch vụ</h2>
            <div className="form-field">
                <span>
                    Bạn có chắc muốn xóa dịch vụ <strong>{` ${deleteCommissionService.title} `}</strong> khỏi trang cá nhân không?
                    <br />
                    Thông tin về dịch vụ này sẽ bị xóa vĩnh viễn khỏi nền tảng.
                </span>
            </div>
            <div className="form-field">
                <div className="half-split">
                    <button
                        type="submit"
                        className="form__submit-btn btn btn-2 btn-md"
                        onClick={handleSubmit}
                        disabled={isSubmitDeleteCommissionServiceLoading}
                    >
                        {isSubmitDeleteCommissionServiceLoading ? (
                            <span className="btn-spinner"></span>
                        ) : (
                            "Xác nhận"
                        )}
                    </button>
                    <button type="submit" className="form__submit-btn btn btn-4 btn-md" onClick={() => {
                        setShowDeleteCommissionServiceForm(false);
                        setOverlayVisible(false);
                    }}>
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
}