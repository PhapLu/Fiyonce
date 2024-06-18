// Imports
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Utils
import { formatCurrency, limitString, formatFloat, bytesToKilobytes, formatNumber } from "../../utils/formatter.js";
import { isFilled, minValue } from "../../utils/validator.js";

// Styling
import "./AddCommissionTos.scss";

export default function AddCommissionTos({ setShowAddCommissionTosForm, setOverlayVisible }) {
    // Initialize variables for inputs, errors, loading effect
    const [inputs, setInputs] = useState({
        description: '',
        usage: 'personal',
        isPrivate: "0",
        fileTypes: [],
        minPrice: '',
        maxPrice: '',
        agreeTerms: false
    });
    const [errors, setErrors] = useState({});
    const [isSubmitAddCommissionTosLoading, setIsSubmitAddCommissionTosLoading] = useState(false);
    const [isSuccessAddCommissionTos, setIsSuccessAddCommissionTos] = useState(false);

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
        <div className="add-commission-service modal-form type-2" ref={addCommissionRef} onClick={(e) => { e.stopPropagation() }}>
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

            <div className="modal-form--right">
                <h2 className="form__title">Thêm dịch vụ</h2>
                {!isSuccessAddCommissionTos ?
                    (
                        <>
                            <div className="form-field">
                                <label htmlFor="title" className="form-field__label">Tên dịch vụ</label>
                                <span className="form-field__annotation">Tên dịch vụ nên chứa những từ khóa liên quan để khách hàng tìm kiếm dịch vụ của bạn thuận lợi hơn.</span>
                                <input
                                    id="title"
                                    name="title"
                                    value={inputs.title}
                                    onChange={handleChange}
                                    className="form-field__input"
                                    placeholder="Mô tả chi tiết yêu cầu của bạn ..."
                                />
                                {errors.title && <span className="form-field__error">{errors.title}</span>}
                            </div>

                            <div className="form-field">
                                <label htmlFor="description" className="form-field__label">Mô tả</label>
                                <span className="form-field__annotation">Ở phần này, vui lòng mô tả chi tiết những gì khách hàng có thể nhận được từ dịch vụ của bạn.</span>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={inputs.description}
                                    onChange={handleChange}
                                    className="form-field__input"
                                    placeholder="Mô tả chi tiết yêu cầu của bạn ..."
                                />
                                {errors.description && <span className="form-field__error">{errors.description}</span>}
                            </div>

                            <div className="form-field">
                                <label className="form-field__label">Tranh mẫu</label>
                                <span className="form-field__annotation">Cung cấp một số tranh mẫu để khách hàng hình dung chất lượng dịch vụ của bạn tốt hơn (tối thiểu 3 và tối đa 5 tác phẩm).</span>
                                {samples.map((reference, index) => {
                                    return (reference &&
                                        <div key={index} className="form-field__input img-preview">
                                            <div className="img-preview--left">
                                                <img src={URL.createObjectURL(reference)} alt={`reference ${index + 1}`} className="img-preview__img" />
                                                <div className="img-preview__info">
                                                    <span className="img-preview__name">{limitString(reference.name, 15)}</span>
                                                    <span className="img-preview__size">{formatFloat(bytesToKilobytes(reference.size), 1)} KB</span>
                                                </div>
                                            </div>
                                            <div className="img-preview--right">
                                                <svg onClick={() => removeImage(index)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 img-preview__close-ic">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        </div>
                                    )
                                }
                                )}

                                <div className="form-field with-ic add-link-btn" onClick={triggerFileInput}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic add-link-btn__ic">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span>Thêm ảnh</span>

                                    <input type="file" id="file-input" style={{ display: "none" }} multiple accept="image/*" onChange={handleImageChange} className="form-field__input" />
                                </div>

                                {errors.samples && <span className="form-field__error">{errors.samples}</span>}
                            </div>

                            <div className="form-field">
                                <label htmlFor="minPrice" className="form-field__label">Giá cả (VND)</label>
                                <span className="form-field__annotation">Cho biết mức phí cơ bản của dịch vụ (không tính kèm các dịch vụ đi kèm).</span>
                                <input
                                    type="number"
                                    name="minPrice"
                                    value={inputs.minPrice}
                                    className="form-field__input"
                                    onChange={handleChange}
                                    placeholder="Nhập mức tối thiểu"
                                />
                                {errors.minPrice && <span className="form-field__error">{errors.minPrice}</span>}
                            </div>

                            <div className="form-field">
                                <label htmlFor="note" className="form-field__label">Lưu ý</label>
                                <span className="form-field__annotation">Để lại lưu ý cho khách hàng của bạn.</span>
                                <textarea
                                    type=""
                                    name="note"
                                    value={inputs.note}
                                    className="form-field__input"
                                    onChange={handleChange}
                                    placeholder="Nhập lưu ý ..."
                                />
                                {errors.note && <span className="form-field__error">{errors.note}</span>}
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
                            Dịch vụ của bạn đã được thêm thành công!
                            <br />Chúc bạn sớm có được những đơn hàng này nhé.
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