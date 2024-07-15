// Imports
import { useState, useRef, useEffect } from "react";

// Resources
import {useModal} from "../../../contexts/modal/ModalContext";

// Styling
import "./DeleteCommissionService.scss";

export default function DeleteCommissionService({ deleteCommissionService, setShowDeleteCommissionServiceForm, setOverlayVisible, deleteMutation }) {
    // Return null if commission service to be deleted is not specified
    if (!deleteCommissionService) {
        return;
    }

    const {setModalInfo} = useModal();

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
            const response = await deleteMutation.mutateAsync(deleteCommissionService._id);
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Xóa dịch vụ thành công",
                });
            }
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
        <div className="delete-commission-service modal-form type-3 sm" ref={deleteCommissionServiceRef} onClick={(e) => { e.stopPropagation() }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowDeleteCommissionServiceForm(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h2 className="form__title">Xóa dịch vụ</h2>
            <div className="form-field">
                <p className="text-align-center">
                    Bạn có chắc muốn xóa dịch vụ <span className="highlight-text">{` ${deleteCommissionService.title} `}</span> khỏi trang cá nhân?
                    <br />
                    <br />
                    Thông tin về dịch vụ này sẽ bị xóa vĩnh viễn khỏi nền tảng.
                </p>
            </div>
            <div className="form-field">
                <button
                    type="submit"
                    className="form-field__input btn btn-2 btn-md"
                    onClick={handleSubmit}
                    disabled={isSubmitDeleteCommissionServiceLoading}
                >
                    {isSubmitDeleteCommissionServiceLoading ? (
                        <span className="btn-spinner"></span>
                    ) : (
                        "Xác nhận"
                    )}
                </button>
            </div>
        </div>
    );
}