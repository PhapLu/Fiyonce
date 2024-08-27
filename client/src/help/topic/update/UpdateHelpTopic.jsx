import { useState, useEffect, useRef } from "react";
import { isFilled } from "../../../utils/validator.js";
import "./UpdateHelpTopic.scss"
import { useModal } from "../../../contexts/modal/ModalContext.jsx";

export default function UpdateHelpTopic({
    helpTopic,
    setShowUpdateHelpTopic,
    setOverlayVisible,
    updateHelpTopicMutation,
}) {
    const [inputs, setInputs] = useState(helpTopic);
    const [errors, setErrors] = useState({});
    const updateCommissionRef = useRef();
    const [isSubmitUpdateHelpTopicLoading, setIsSubmitUpdateHelpTopicLoading] = useState();
    const { setModalInfo } = useModal();

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        setInputs(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };


    const validateInputs = () => {
        let errors = {};

        if (!isFilled(inputs.theme)) {
            errors.theme = "Vui lòng nhập theme";
        }

        if (!isFilled(inputs.title)) {
            errors.title = "Vui lòng nhập tiêu đề topic";
        }

        return errors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitUpdateHelpTopicLoading(true);

        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitUpdateHelpTopicLoading(false);
            return;
        }

        try {
            console.log(inputs)
            const response = await updateHelpTopicMutation.mutateAsync(inputs);
            console.log(response);
            setModalInfo({
                status: "success",
                message: "Cập nhật chủ đề thành công"
            })
        } catch (error) {
            console.error("Failed to update new title:", error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response.data.message
            }));
        } finally {
            setIsSubmitUpdateHelpTopicLoading(false);
        }
    };

    return (
        <div className="update-commission-service modal-form type-3" ref={updateCommissionRef} onClick={(e) => { e.stopPropagation(); }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowUpdateHelpTopic(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <h2 className="form__title">Cập nhật chủ đề</h2>
            <div className="form-field">
                <label htmlFor="theme" className="form-field__label">Theme</label>
                <select name="theme" id="" className="form-field__input" onChange={handleChange}>
                    <option value="for_artists">Dành cho họa sĩ</option>
                    <option value="for_clients">Dành cho khách hàng</option>
                    <option value="about">Về chúng tôi</option>
                </select>
                {errors.theme && <span className="form-field__error">{errors.theme}</span>}
            </div>

            <div className="form-field">
                <label htmlFor="title" className="form-field__label">Topic</label>
                <input
                    id="title"
                    name="title"
                    value={inputs?.title || ''}
                    onChange={handleChange}
                    className="form-field__input"
                    placeholder="Nhập title"
                />
                {errors.title && <span className="form-field__error">{errors.title}</span>}

                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
            </div>

            <div className="form-field">
                <button type="submit" className="btn btn-2 btn-md form-field__input" disabled={isSubmitUpdateHelpTopicLoading} onClick={handleSubmit}>
                    {isSubmitUpdateHelpTopicLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
            </div>
        </div>
    );
}