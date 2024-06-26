import React, { useState } from "react";
import { isFilled, minLength, isValidEmail } from "../../../utils/validator.js";

export default function EditCommissionServiceCategory({
    editCommissionServiceCategory,
    setShowEditCommissionServiceCategoryForm,
    setOverlayVisible,
    editCommissionServiceCategoryMutation
}) {
    if (!editCommissionServiceCategory) {
        return;
    }

    // Initialize variables for inputs, errors, loading effect
    const [inputs, setInputs] = useState(editCommissionServiceCategory);
    const [errors, setErrors] = useState({});
    const [isSubmitEditCommissionServiceCategoryLoading, setIsSubmitEditCommissionServiceCategoryLoading] = useState(false);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        // Update input value & clear error
        setInputs((values) => ({ ...values, [name]: value }));
        setErrors((values) => ({ ...values, [name]: '' }));
    };

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
        setIsSubmitEditCommissionServiceCategoryLoading(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Clear the loading effect if validation failed
            setIsSubmitEditCommissionServiceCategoryLoading(false);
            return;
        }

        // Handle register request
        try {
            editCommissionServiceCategoryMutation.mutate(inputs)
        } catch (error) {
            console.error("Failed to register:", error);
            errors.serverError = error.response.data.message;
        } finally {
            // Clear the loading effect
            setIsSubmitEditCommissionServiceCategoryLoading(false);
        }
    };

    return (
        <div className="modal-form type-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowEditCommissionServiceCategoryForm(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h2 className="form__title">Chỉnh sửa thể loại dịch vụ</h2>
            <div className="form-field">
                <label htmlFor="title" className="form-field__label">Tên thể loại</label>
                <input type="title" id="title" name="title" value={inputs.title || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập thể loại" autoComplete="on" />
                {errors.title && <span className="form-field__error">{errors.title}</span>}
            </div>
            <div className="form-field">
                <button
                    type="submit"
                    className="form-field__input btn btn-2 btn-md"
                    onClick={handleSubmit}
                    disabled={isSubmitEditCommissionServiceCategoryLoading}
                >
                    {isSubmitEditCommissionServiceCategoryLoading ? (
                        <span className="btn-spinner"></span>
                    ) : (
                        "Xác nhận"
                    )}
                </button>
            </div>
            {/* <div className="modal-content">
                <span
                    className="close"
                    onClick={() => {
                        setShowEditCommissionServiceCategoryForm(false);
                        setOverlayVisible(false);
                    }}
                >
                    &times;
                </span>
                <h2>Edit Commission Service Category</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Save Changes
                    </button>
                </form>
            </div> */}
        </div>
    );
}
