// Imports
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Utils
import { formatCurrency, limitString, formatFloat, bytesToKilobytes, formatNumber } from "../../../utils/formatter.js";
import { isFilled } from "../../../utils/validator.js";

// Styling
import "./AddCommissionTos.scss";

export default function AddCommissionTos({ setShowAddCommissionTosForm, setOverlayVisible }) {
    // Initialize variables for inputs, errors, loading effect
    const [inputs, setInputs] = useState({
    });
    const [errors, setErrors] = useState({});
    const [isSubmitAddCommissionTosLoading, setIsSubmitAddCommissionTosLoading] = useState(false);
    const [isSuccessAddCommissionTos, setIsSuccessAddCommissionTos] = useState(false);

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
        }, 60000); // Update every minute
        // return () => clearInterval(intervalId);
    }, []);

    // Toggle display overlay box
    const addCommissionRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (addCommissionRef && addCommissionRef.current && !addCommissionRef.current.contains(e.target)) {
                setShowAddCommissionTosForm(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    const validateInputs = () => {
        let errors = {};

        // Validate category
        if (!isFilled(inputs.commissionServiceCategoryId)) {
            errors.title = 'Vui lòng chọn thể loại dịch vụ';
        }


        // Validate title
        if (!isFilled(inputs.title)) {
            errors.title = 'Vui lòng nhập tên dịch vụ';
        }

        // Validate description
        if (!isFilled(inputs.description)) {
            errors.description = 'Vui lòng nhập mô tả';
        }

        // Validate minimum price
        if (!isFilled(inputs.minPrice)) {
            errors.minPrice = 'Vui lòng nhập giá tối thiểu';
        } else if (inputs.minPrice <= 50000) {
            errors.minPrice = 'Giá trị dịch vụ tối thiểu là 50.000 VND';
        }

        // Validate agree to terms
        if (!inputs.agreeTerms) {
            errors.agreeTerms = 'Vui lòng xác nhận đồng ý với điều khoản';
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
                setInputs
                setInputs(prevState => ({
                    ...prevState,
                    [name]: checked
                }));
            }
        } else {
            setInputs(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
        
        // Update input value & clear error
        setErrors((values) => ({ ...values, [name]: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Initialize loading effect for the submit button
        setIsSubmitAddCommissionTosLoading(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Clear the loading effect if validation failed
            setIsSubmitAddCommissionTosLoading(false);
            return;
        }

        // Handle submit request
        try {
            setIsSuccessAddCommissionTos(true);
        } catch (error) {
            console.error("Failed to submit:", error);
            errors.serverError = error.response.data.message;
        } finally {
            // Clear the loading effect
            setIsSubmitAddCommissionTosLoading(false);
        }
    };

    return (
        <div className="add-commission-tos modal-form type-2" ref={addCommissionRef} onClick={(e) => { e.stopPropagation() }}>
            <Link to="/help_center" className="form__help" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__help-ic">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg> Trợ giúp
            </Link>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowAddCommissionTosForm(false);
                setIsSuccessAddCommissionTos(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <div className="modal-form--left">
                <h3>{inputs.title || "Tên điều khoản dịch vụ"}</h3>
                <span>Cập nhật vào lúc {formatTime(currentTime)}</span>
                <hr />
                <div className="form__note">

                    <p><strong>*Lưu ý:</strong>
                        <br />
                        Điều khoản dịch vụ giúp bạn bảo vệ quyền lợi pháp lí của mình khi thực hiện công việc trên Pastal, đồng thời thể hiện sự chuyên nghiệp và cam kết giữa dịch vụ của bạn và khách hàng.
                    </p>
                </div>
            </div>

            <div className="modal-form--right">
                <h2 className="form__title">Thêm điều khoản dịch vụ</h2>
                {!isSuccessAddCommissionTos ?
                    (
                        // general: {type: String, required: true},
                        // payments: {type: String, required: true},
                        // deadlinesAndDelivery: {type: String, required: true},
                        // use: {type: String, required: true},
                        // refunds: {type: String, required: true},
                        // updatedAt: {type: Date}
                        <>
                            <div className="form-field">
                                <label htmlFor="title" className="form-field__label">Tiêu đề</label>
                                <span className="form-field__annotation">Đặt tên cho điều khoản để tiện ghi nhớ và sử dụng.</span>
                                <input
                                    id="title"
                                    name="title"
                                    value={inputs.title}
                                    onChange={handleChange}
                                    className="form-field__input"
                                    placeholder="Nhập tiêu đề điều khoản dịch vụ"
                                />
                                {errors.title && <span className="form-field__error">{errors.title}</span>}
                            </div>

                            <div className="form-field">
                                <label htmlFor="general" className="form-field__label">Điều khoản chung</label>
                                <span className="form-field__annotation">Ở phần này, vui lòng mô tả chi tiết những gì khách hàng có thể nhận được từ dịch vụ của bạn.</span>
                                <textarea
                                    id="general"
                                    name="general"
                                    value={inputs.general}
                                    onChange={handleChange}
                                    className="form-field__input"
                                    placeholder="Mô tả chi tiết yêu cầu của bạn ..."
                                />
                                {errors.general && <span className="form-field__error">{errors.general}</span>}
                            </div>
                            <div className="form-field">
                                <label htmlFor="payments" className="form-field__label">Điều khoản thanh toán</label>
                                <span className="form-field__annotation">Ở phần này, vui lòng mô tả chi tiết những gì khách hàng có thể nhận được từ dịch vụ của bạn.</span>
                                <textarea
                                    id="payments"
                                    name="payments"
                                    value={inputs.payments}
                                    onChange={handleChange}
                                    className="form-field__input"
                                    placeholder="Mô tả chi tiết yêu cầu của bạn ..."
                                />
                                {errors.payments && <span className="form-field__error">{errors.payments}</span>}
                            </div>
                            <div className="form-field">
                                <label htmlFor="deadlinesAndDelivery" className="form-field__label">Thời hạn và vận chuyển</label>
                                <span className="form-field__annotation">Ở phần này, vui lòng mô tả chi tiết những gì khách hàng có thể nhận được từ dịch vụ của bạn.</span>
                                <textarea
                                    id="deadlinesAndDelivery"
                                    name="deadlinesAndDelivery"
                                    value={inputs.deadlinesAndDelivery}
                                    onChange={handleChange}
                                    className="form-field__input"
                                    placeholder="Mô tả chi tiết yêu cầu của bạn ..."
                                />
                                {errors.deadlinesAndDelivery && <span className="form-field__error">{errors.deadlinesAndDelivery}</span>}
                            </div>
                            <div className="form-field">
                                <label htmlFor="use" className="form-field__label">Điều khoản sử dụng</label>
                                <span className="form-field__annotation">Ở phần này, vui lòng mô tả chi tiết những gì khách hàng có thể nhận được từ dịch vụ của bạn.</span>
                                <textarea
                                    id="use"
                                    name="use"
                                    value={inputs.use}
                                    onChange={handleChange}
                                    className="form-field__input"
                                    placeholder="Mô tả chi tiết yêu cầu của bạn ..."
                                />
                                {errors.use && <span className="form-field__error">{errors.use}</span>}
                            </div>
                            <div className="form-field">
                                <label htmlFor="refunds" className="form-field__label">Điều kiện hoàn tiền</label>
                                <span className="form-field__annotation">Ở phần này, vui lòng mô tả chi tiết những gì khách hàng có thể nhận được từ dịch vụ của bạn.</span>
                                <textarea
                                    id="refunds"
                                    name="refunds"
                                    value={inputs.refunds}
                                    onChange={handleChange}
                                    className="form-field__input"
                                    placeholder="Mô tả chi tiết yêu cầu của bạn ..."
                                />
                                {errors.refunds && <span className="form-field__error">{errors.refunds}</span>}
                            </div>

                            <div className="form-field">
                                <label className="form-field__label">
                                    <input
                                        type="checkbox"
                                        name="agreeTerms"
                                        checked={inputs.agreeTerms}
                                        onChange={handleChange}
                                    /> <span>Tôi đồng ý với các <Link to="/terms_and_policies" className="highlight-text"> điều khoản dịch vụ </Link> của Pastal</span>
                                </label>
                                {errors.agreeTerms && <span className="form-field__error">{errors.agreeTerms}</span>}
                            </div>
                            <div className="form-field">
                                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
                            </div>
                        </>
                    ) : (
                        <p className="text-align-center">
                            Điều khoản dịch vụ của bạn đã được thêm thành công!
                            <br />Quay lại trang <span className="highlight-text">quản lí các điều khoản</span>.
                        </p>
                    )}
            </div>
            <button type="submit"
                className="form__submit-btn btn btn-2 btn-md"
                onClick={handleSubmit}
                disabled={isSubmitAddCommissionTosLoading}>
                {isSubmitAddCommissionTosLoading ? (
                    <span className="btn-spinner"></span>
                ) : (
                    "Gửi yêu cầu"
                )}
            </button>
        </div >
    )
}