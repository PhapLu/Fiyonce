// Imports
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

// Resources
import { useModal } from "../../../contexts/modal/ModalContext";
import { useAuth } from "../../../contexts/auth/AuthContext";

// Styling
import "./DeleteCommissionService.scss";
import { apiUtils } from "../../../utils/newRequest";

export default function DeleteCommissionService() {
    // Return null if commission service to be deleted is not specified
    const { commissionService, commissionServiceCategories } = useOutletContext();
    console.log(commissionService)
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {userInfo} = useAuth();

    const { setModalInfo } = useModal();

    const [errors, setErrors] = useState({});
    const [isSubmitDeleteCommissionServiceLoading, setIsSubmitDeleteCommissionServiceLoading] = useState(false);

    // Toggle display modal form
    const deleteCommissionServiceRef = useRef();
    const closeDeleteCommissionServiceView = () => {
        navigate(-1);
    }
    useEffect(() => {
        let handler = (e) => {
            if (deleteCommissionServiceRef && deleteCommissionServiceRef.current && !deleteCommissionServiceRef.current.contains(e.target)) {
                closeDeleteCommissionServiceView();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    const deleteMutation = useMutation(
        (serviceId) => apiUtils.delete(`/commissionService/deleteCommissionService/${serviceId}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['fetchCommissionServiceCategories', userInfo?._id]);
                closeDeleteCommissionServiceView();
            },
        }
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitDeleteCommissionServiceLoading(true);

        try {
            const response = await deleteMutation.mutateAsync(commissionService?._id);
            console.log(response)
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Xóa dịch vụ thành công",
                });
            }
        } catch (error) {
            // console.error("Failed to submit:", error);
            // setErrors((prevErrors) => ({
            //     ...prevErrors,
            //     serverError: error.response.data.message
            // }));
            console.log(error)
        } finally {
            setIsSubmitDeleteCommissionServiceLoading(false);
        }
    };

    return (
        <div className="overlay">
            <div className="delete-commission-service modal-form type-3 sm" ref={deleteCommissionServiceRef} onClick={(e) => { e.stopPropagation() }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={closeDeleteCommissionServiceView}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h2 className="form__title">Xóa dịch vụ</h2>
                <div className="form-field">
                    <p className="text-align-center">
                        Bạn có chắc muốn xóa dịch vụ <span className="highlight-text">{` ${commissionService?.title} `}</span> khỏi trang cá nhân?
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
        </div>
    );
}