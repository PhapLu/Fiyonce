// Imports
import { useState, useRef, useEffect } from "react";
import { useOutletContext, useParams, useNavigate, Link, useLocation, Outlet } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

// Utils
import { isFilled, minLength, isValidEmail } from "../../../utils/validator.js";
import { apiUtils } from "../../../utils/newRequest.js";

export default function DeleteCommissionServiceCategory() {
    // Initialize variables for inputs, errors, loading effect
    const [errors, setErrors] = useState({});
    const [isSubmitDeleteCommissionServiceCategoryLoading, setIsSubmitDeleteCommissionServiceCategoryLoading] = useState(false);

    // Fetch commission service categories and pass this prop to children component
    const { "service-category-id": serviceCategoryId } = useParams();
    const queryClient = useQueryClient();

    const validateInputs = () => {
        let errors = {};

        return errors;
    };

    const deleteCommissionServiceCategoryMutation = useMutation(
        (serviceCategoryId) => apiUtils.delete(`/serviceCategory/deleteServiceCategory/${serviceCategoryId}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['fetchCommissionServiceCategories', userInfo?._id]);
                closeDeleteCommissionServiceCategoryView();
            },
            onError: (error) => {
                console.error('Error deleting commission service category:', error);
            }
        }
    );

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
            console.log(serviceCategoryId);
            deleteCommissionServiceCategoryMutation.mutate(serviceCategoryId)
        } catch (error) {
            console.error("Failed to register:", error);
            errors.serverError = error.response.data.message;
        } finally {
            // Clear the loading effect
            setIsSubmitDeleteCommissionServiceCategoryLoading(false);
        }
    };

    const navigate = useNavigate();
    const closeDeleteCommissionServiceCategoryView = () => {
        navigate(-1);
    }

    // Toggle display overlay box
    const deleteCommissionServiceCategoryRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (deleteCommissionServiceCategoryRef && deleteCommissionServiceCategoryRef.current && !deleteCommissionServiceCategoryRef.current.contains(e.target)) {
                closeDeleteCommissionServiceCategoryView();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    return (
        <div className="overlay">
            <div className="modal-form type-3" ref={deleteCommissionServiceCategoryRef} onClick={(e) => { e.stopPropagation() }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={closeDeleteCommissionServiceCategoryView}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h2 className="form__title">Xóa thể loại dịch vụ</h2>
                <div className="form-field">
                    <p className="text-align-center">Bạn có chắc muốn xóa thể loại dịch vụ này khỏi trang cá nhân không?
                        Các dịch vụ thuộc thể loại này cũng sẽ bị xóa vĩnh viễn khỏi nền tảng.</p>
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
        </div>
    );
}
