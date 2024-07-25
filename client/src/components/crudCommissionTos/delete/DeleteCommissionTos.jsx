// Imports
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Resources
import Modal from "../../modal/Modal.jsx";
import { useModal } from "../../../contexts/modal/ModalContext";

// Utils
import { formatCurrency, limitString, formatFloat, bytesToKilobytes, formatNumber } from "../../../utils/formatter.js";
import { isFilled } from "../../../utils/validator.js";

// Styling
import "./DeleteCommissionTos.scss";
import { apiUtils } from "../../../utils/newRequest.js";

export default function DeleteCommissionTos({ setShowDeleteCommissionTosForm, setShowCommissionTosView, setOverlayVisible, commissionTos }) {
    // Initialize variables for inputs, errors, loading effect
    const [errors, setErrors] = useState({});
    const [isSubmitDeleteCommissionTosLoading, setIsSubmitDeleteCommissionTosLoading] = useState(false);
    const [isSuccessDeleteCommissionTos, setIsSuccessDeleteCommissionTos] = useState(false);
    const {setModalInfo } = useModal();

    const [currentTime, setCurrentTime] = useState(new Date());

    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Delete every minute
        // return () => clearInterval(intervalId);
    }, []);

    // Toggle display overlay box
    const deleteCommissionRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (deleteCommissionRef && deleteCommissionRef.current && !deleteCommissionRef.current.contains(e.target)) {
                setShowDeleteCommissionTosForm(false);
                setShowCommissionTosView(false);
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

        // Initialize loading effect for the submit button
        setIsSubmitDeleteCommissionTosLoading(true);

        // Handle submit request
        try {
            const response = await apiUtils.delete(`/termOfService/deleteTermOfService/${commissionTos._id}`);
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Xóa điều khoản dịch vụ thành công"
                })
                setShowDeleteCommissionTosForm(false);
                setShowCommissionTosView(false);
                setOverlayVisible(false);
            }
        } catch (error) {
            setModalInfo({
                status: "error",
                message: error.response.data.message
            })
        } finally {
            // Clear the loading effect
            setIsSubmitDeleteCommissionTosLoading(false);
        }
    };

    return (
        <div className="delete-commission-tos modal-form type-3" ref={deleteCommissionRef} onClick={(e) => { e.stopPropagation() }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowDeleteCommissionTosForm(false);
                setIsSuccessDeleteCommissionTos(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <h2 className="form__title">Xóa điều khoản dịch vụ</h2>

            <div className="form-field">
                <p className="text-align-center">
                    Bạn có chắc muốn xóa điều khoản <span className="highlight-text">{commissionTos?.title}</span> không?
                    <br />Thông tin về điều khoản này sẽ bị xóa vĩnh viễn khỏi Pastal?
                </p>
            </div>

            <div className="form-field">
                <button type="submit"
                    className="form-field__input btn btn-2 btn-md"
                    onClick={handleSubmit}
                    disabled={isSubmitDeleteCommissionTosLoading}>
                    {isSubmitDeleteCommissionTosLoading ? (
                        <span className="btn-spinner"></span>
                    ) : (
                        "Xác nhận"
                    )}
                </button>
            </div>
        </div >
    )
}