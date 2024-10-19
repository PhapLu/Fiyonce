// Imports
import { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate, Outlet, useOutletContext } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useQuery, useMutation, useQueryClient } from "react-query";

// Resources
import { useModal } from "../../../contexts/modal/ModalContext";
import { isFilled } from "../../../utils/validator";
import { apiUtils } from "../../../utils/newRequest";

// Styling

export default function ArchiveCommissionOrder() {
    // Return null if the commission order to be rejected is not specified
    const commissionOrder = useOutletContext();
    const queryClient = useQueryClient();

    const { setModalInfo } = useModal();

    const [errors, setErrors] = useState({});
    const [isSubmitArchiveCommissionOrderLoading, setIsSubmitArchiveCommissionOrderLoading] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");

    const archiveCommissionOrderRef = useRef();
    const navigate = useNavigate();

    const closeArchiveCommissionOrderView = () => {
        navigate(`/order-history`);
    }

    useEffect(() => {
        let handler = (e) => {
            if (archiveCommissionOrderRef && archiveCommissionOrderRef.current && !archiveCommissionOrderRef.current.contains(e.target)) {
                closeArchiveCommissionOrderView();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [navigate]);

    const archiveCommissionOrderMutation = useMutation(
        async (orderId) => {
            const response = await apiUtils.patch(`/order/archiveOrder/${orderId}`);
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchTalentOrderHistory');
                queryClient.invalidateQueries('fetchMemberOrderHistory');
                queryClient.invalidateQueries('fetchArchivedOrderHistory');
            },
            onError: (error) => {
                return error;
            },
        }
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitArchiveCommissionOrderLoading(true);
        console.log(commissionOrder._id)

        try {
            const response = await archiveCommissionOrderMutation.mutateAsync(commissionOrder._id);
            console.log(response);
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Đã đưa đơn hàng vào mục lưu trữ",
                });
                closeArchiveCommissionOrderView();
            }
        } catch (error) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response?.data?.message,
            }));
            setModalInfo({
                status: "error",
                message: error.response?.data?.message,
            })
        } finally {
            setIsSubmitArchiveCommissionOrderLoading(false);
        }
    };

    return (
        <div className="overlay">
            <div className="reject-commission-order modal-form type-3 sm" ref={archiveCommissionOrderRef} onClick={(e) => { e.stopPropagation() }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic"
                    onClick={closeArchiveCommissionOrderView}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h2 className="form__title">Đưa vào mục lưu trữ</h2>
                <div className="form-field">
                    <p className="text-align-center">
                        Bạn có chắc muốn đưa đơn hàng vào mục lưu trữ?
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
                        disabled={isSubmitArchiveCommissionOrderLoading}
                    >
                        {isSubmitArchiveCommissionOrderLoading ? (
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
