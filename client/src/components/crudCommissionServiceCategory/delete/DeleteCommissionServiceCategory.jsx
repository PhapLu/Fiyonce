import { useState, useRef, useEffect } from "react";
import { isFilled, minLength, isValidEmail } from "../../../utils/validator.js";

export default function DeleteCommissionServiceCategory({
    deleteCommissionServiceCategory,
    setShowDeleteCommissionServiceCategoryForm,
    setOverlayVisible,
    deleteCommissionServiceCategoryMutation
}) {
    if (!deleteCommissionServiceCategory) {
        return;
    }
    // Initialize variables for inputs, errors, loading effect
    const [inputs, setInputs] = useState(deleteCommissionServiceCategory);
    const [errors, setErrors] = useState({});
    const [isSubmitDeleteCommissionServiceCategoryLoading, setIsSubmitDeleteCommissionServiceCategoryLoading] = useState(false);

    const validateInputs = () => {
        let errors = {};

        // Validate title
        if (!isFilled(inputs.title)) {
            errors.title = 'Vui lòng nhập tên thể loại';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Initialize loading effect for the submit button
        setIsSubmitDeleteCommissionServiceCategoryLoading(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Clear the loading effect if validation failed
            setIsSubmitDeleteCommissionServiceCategoryLoading(false);
            return;
        }

        // Handle register request
        try {
            console.log(inputs._id);
            deleteCommissionServiceCategoryMutation.mutate(inputs._id)
        } catch (error) {
            console.error("Failed to register:", error);
            errors.serverError = error.response.data.message;
        } finally {
            // Clear the loading effect
            setIsSubmitDeleteCommissionServiceCategoryLoading(false);
        }
    };

    // Toggle display overlay box
    const deleteCommissionServiceCategoryRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (deleteCommissionServiceCategoryRef && deleteCommissionServiceCategoryRef.current && !deleteCommissionServiceCategoryRef.current.contains(e.target)) {
                setShowDeleteCommissionServiceCategoryForm(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    return (
        <div className="modal-form type-3" ref={deleteCommissionServiceCategoryRef} onClick={(e) => { e.stopPropagation() }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowDeleteCommissionServiceCategoryForm(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h2 className="form__title">Xóa thể loại dịch vụ</h2>
            <div className="form-field">
                <p className="text-align-center">Bạn có chắc muốn xóa thể loại dịch vụ <span className="highlight-text">{inputs.title}</span> khỏi trang cá nhân không?
                    <br />
                    Thông tin về dịch vụ này sẽ bị xóa vĩnh viễn khỏi nền tảng.</p>
            </div>
            <div className="form-field">
                <button
                    type="submit"
                    className="form-field__input btn btn-2 btn-md"
                    onClick={handleSubmit}
                    disabled={isSubmitDeleteCommissionServiceCategoryLoading}
                >
                    {isSubmitDeleteCommissionServiceCategoryLoading ? (
                        <span className="btn-spinner"></span>
                    ) : (
                        "Xác nhận"
                    )}
                </button>
            </div>
        </div>
    );
}
