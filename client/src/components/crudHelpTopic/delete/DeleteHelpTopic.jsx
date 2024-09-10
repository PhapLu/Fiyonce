

import { useState, useEffect, useRef } from "react";
import { isFilled } from "../../../utils/validator.js";

export default function DeleteHelpTopic({
    helpTopic,
    setShowDeleteHelpTopic,
    setOverlayVisible,
    deleteHelpTopicMutation,
}) {
    const [inputs, setInputs] = useState(helpTopic);
    const [errors, setErrors] = useState({});
    const [isSubmitDeleteHelpTopicLoading, setIsSubmitDeleteHelpTopicLoading] = useState(false);

    const deleteCommissionRef = useRef();
    useEffect(() => {
        const handler = (e) => {
            if (deleteCommissionRef.current && !deleteCommissionRef.current.contains(e.target)) {
                setShowDeleteHelpTopic(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitDeleteHelpTopicLoading(true);

        try {
            await deleteHelpTopicMutation.mutateAsync(helpTopic._id);
        } catch (error) {
            console.error("Failed to delete helpTopic:", error);
            // setErrors((prevErrors) => ({
            //     ...prevErrors,
            //     serverError: error.response.data.message
            // }));
            errors.serverError = error.response.data.message;
        } finally {
            setIsSubmitDeleteHelpTopicLoading(false);
        }
    };

    return (
        <div className="delete-commission-service modal-form type-3" ref={deleteCommissionRef} onClick={(e) => { e.stopPropagation(); }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowDeleteHelpTopic(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <h2 className="form__title">Xóa bài viết</h2>
            <div className="form-field">
                <p className="text-align-center">
                    Bạn có chắc muốn xóa bài viết <span className="highlight-text">{helpTopic?.title}</span> không?
                    <br />
                    Thông tin về bài viết này sẽ bị xóa vĩnh viễn khỏi Pastal!
                </p>
            </div>

            <div className="form-field">
                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
            </div>

            <div className="form-field">
                <button type="submit" className="form-field__input btn btn-2 btn-md" disabled={isSubmitDeleteHelpTopicLoading} onClick={handleSubmit}>
                    {isSubmitDeleteHelpTopicLoading ? 'Đang xóa...' : 'Xác nhận'}
                </button>
            </div>
        </div>
    );
}