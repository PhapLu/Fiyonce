import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useModal } from "../../../contexts/modal/ModalContext";
import { apiUtils } from "../../../utils/newRequest";

export default function MakeDecision({ commissionReport }) {
    const {"commission-report-id": commissionReportId} = useParams();

    // Contexts
    const { setModalInfo } = useModal();

    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitMakeDecisionLoading, setIsSubmitMakeDecisionLoading] = useState(false);

    // Handle display the MakeDecision component
    const navigate = useNavigate();
    const closeMakeDecisionView = () => {
        navigate("/dashboard/reports")
    }

    const makeDecisionRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (makeDecisionRef && makeDecisionRef.current && !makeDecisionRef.current.contains(e.target)) {
                closeMakeDecisionView();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    // Handle validation & submission
    const validateInputs = () => {
        let errors = {};

        if (!inputs.decision) {
            errors.decision = 'Vui lòng nhập mô tả';
        }

        if (!inputs.reason) {
            errors.reason = 'Vui lòng nhập mô tả';
        }

        return errors;
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            if (name === 'fileTypes') {
                setInputs(prevState => ({
                    ...prevState,
                    fileTypes: checked
                        ? [...prevState.fileTypes, value]
                        : prevState.fileTypes.filter(type => type !== value)
                }));
            } else {
                setInputs(prevState => ({
                    ...prevState,
                    [name]: checked
                }));
            }
        } else if (type === 'radio') {
            setInputs(prevState => ({
                ...prevState,
                [name]: value
            }));
        } else {
            setInputs(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Initialize loading effect for the submit button
        setIsSubmitMakeDecisionLoading(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitMakeDecisionLoading(false);
            return;
        }

        try {
            const response = await apiUtils.patch(`/commissionReport/adminMakeDecision/${commissionReportId}`, inputs);
            console.log(response);

            setModalInfo({
                status: "success",
                message: "Giải quyết vi phạm thành công"
            })
        } catch (error) {
            console.log(error);
            setModalInfo({
                status: "error",
                message: error.response.data.message
            })
        } finally {
            setIsSubmitMakeDecisionLoading(false);
            closeMakeDecisionView();
        }
    }

    return (
        <div className="overlay">
            <div className="modal-form type-3 make-decision" ref={makeDecisionRef} onClick={(e) => { e.stopPropagation() }}>
                <h2 className="form__title">Ra quyết định</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={closeMakeDecisionView}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>

                <div className="form-field required">
                    <label htmlFor="decision" className="form-field__label">Bên có lợi</label>
                    <select name="decision" id="" className="form-field__input" onChange={handleChange}>
                        <option value="">-- Chọn bên có lợi --</option>
                        <option value="client_favored">Khách hàng</option>
                        <option value="artist_favored">Họa sĩ</option>
                        <option value="neutral">Thương lượng</option>
                    </select>
                    {errors.decision && <span className="form-field__error">{errors.decision}</span>}
                </div>

                <div className="form-field required">
                    <label htmlFor="reason" className="form-field__label">Lí do</label>
                    <textarea name="reason" value={inputs?.reason} className="form-field__input" onChange={handleChange} placeholder="Nhập lí do"></textarea>
                    {errors.reason && <span className="form-field__error">{errors.reason}</span>}
                </div>

                <div className="form-field" onClick={handleSubmit}>
                    <button type="submit"
                        className="form-field__input btn btn-2 btn-md"
                        onClick={handleSubmit}
                        disabled={isSubmitMakeDecisionLoading}>
                        {isSubmitMakeDecisionLoading ? (
                            <span className="btn-spinner"></span>
                        ) : (
                            "Xác nhận"
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}