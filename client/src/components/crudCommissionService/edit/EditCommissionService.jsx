// Imports
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Utils
import { formatCurrency, limitString, formatFloat, bytesToKilobytes, formatNumber } from "../../../utils/formatter.js";
import { isFilled, minValue } from "../../../utils/validator.js";

// Styling
import "./EditCommissionService.scss";

export default function EditCommissionService({ selectedCommissionService, commissionServiceCategories, setShowEditCommissionServiceForm, setOverlayVisible }) {
    // Initialize variables for inputs, errors, loading effect
    const [inputs, setInputs] = useState(selectedCommissionService);
    console.log(inputs.portfolios)

    const [errors, setErrors] = useState({});
    const [isSubmitEditCommissionServiceLoading, setIsSubmitEditCommissionServiceLoading] = useState(false);
    const [isSuccessEditCommissionService, setIsSuccessEditCommissionService] = useState(false);
    const [isAddNewCommissionServiceCategory, setIsAddNewCommissionServiceCategory] = useState(false);

    const [portfolios, setPortfolios] = useState(inputs.portfolios || Array(5).fill(null));
    console.log(portfolios);

    // Toggle display overlay box
    const editCommissionRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (editCommissionRef && editCommissionRef.current && !editCommissionRef.current.contains(e.target)) {
                setShowEditCommissionServiceForm(false);
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

        // if (!((isAddNewCommissionServiceCategory && isFilled(inputs.newCommissionServiceCategory)) || (!isAddNewCommissionServiceCategory && isFilled(inputs._id)))) {
        //     errors._id = 'Vui lòng chọn thể loại dịch vụ';
        // }

        // // Validate category
        // if (!isFilled(inputs._id)) {
        //     errors.title = 'Vui lòng chọn thể loại dịch vụ';
        // }


        // // Validate title
        // if (!isFilled(inputs.title)) {
        //     errors.title = 'Vui lòng nhập tên dịch vụ';
        // }

        // // Validate description
        // if (!isFilled(inputs.description)) {
        //     errors.description = 'Vui lòng nhập mô tả';
        // }

        // // Validate portfolios uploading
        // if (portfolios.filter(portfolio => portfolio !== null).length < 3) {
        //     errors.portfolios = "Vui lòng cung cấp tối thiểu 3 tranh mẫu.";
        // } else if (portfolios.filter(portfolio => portfolio !== null).length > 5) {
        //     errors.portfolios = "Vui lòng cung cấp tối đa 5 tranh mẫu.";
        // }

        // // Validate minimum price
        // if (!isFilled(inputs.minPrice)) {
        //     errors.minPrice = 'Vui lòng nhập giá tối thiểu';
        // } else if (inputs.minPrice <= 50000) {
        //     errors.minPrice = 'Giá trị dịch vụ tối thiểu là 50.000 VND';
        // }

        // // Validate agree to terms
        // if (!inputs.agreeTerms) {
        //     errors.agreeTerms = 'Vui lòng xác nhận đồng ý với điều khoản';
        // }

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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newPortfolios = [...portfolios];

        files.forEach((file) => {
            if (file.size > 500 * 1024) {
                setErrors((values) => ({ ...values, portfolios: "Dung lượng ảnh không được vượt quá 500KB." }));
            } else {
                const portfolioIndex = newPortfolios.findIndex(portfolio => portfolio === null);
                if (portfolioIndex !== -1) {
                    newPortfolios[portfolioIndex] = file;
                }
            }
        });

        setPortfolios(newPortfolios);
    };


    const removeImage = (index) => {
        const newportfolios = [...portfolios];
        newportfolios[index] = null;
        setPortfolios(newportfolios);
    };

    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Initialize loading effect for the submit button
        setIsSubmitEditCommissionServiceLoading(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Clear the loading effect if validation failed
            setIsSubmitEditCommissionServiceLoading(false);
            return;
        }

        // If create new commission service category
        // if (isAddNewCommissionServiceCategory) {
        //     try {
        //         alert("Adding new")
        //     } catch (error) {
        //         errors.serverError = error.response.data.message;
        //         return;
        //     }
        // } else {
        //     alert("Not adding new")
        // }


        // Handle submit request
        try {
            setIsSuccessEditCommissionService(true);
        } catch (error) {
            console.error("Failed to submit:", error);
            errors.serverError = error.response.data.message;
        } finally {
            // Clear the loading effect
            setIsSubmitEditCommissionServiceLoading(false);
        }
    };

    return (
        <div className="edit-commission-service modal-form type-2" ref={editCommissionRef} onClick={(e) => { e.stopPropagation() }}>
            <Link to="/help_center" className="form__help" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__help-ic">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg> Trợ giúp
            </Link>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowEditCommissionServiceForm(false);
                setIsSuccessEditCommissionService(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <div className="modal-form--left">
                <span>{inputs.categoryTitle || "Thể loại"}</span>
                <h3>{inputs.title || "Tên dịch vụ"}</h3>
                <span>Giá từ: <span className="highlight-text">{formatCurrency(inputs.minPrice) || "x"} VND</span></span>
                <hr />
                <div className="images-layout-3">
                    {portfolios.slice(0, 3).map((portfolio, index) => (
                        <img
                            key={index}
                            src={portfolio ? URL.createObjectURL(portfolio) : "/uploads/default_image_placeholder.png"}
                            alt={`portfolio ${index + 1}`}
                        />
                    ))}
                </div>
                <p>*Lưu ý: <i>{inputs.notes || "Lưu ý cho khách hàng"}</i></p>
            </div>

            <div className="modal-form--right">
                <h2 className="form__title">Chỉnh sửa dịch vụ</h2>
                {!isSuccessEditCommissionService ?
                    (
                        <>
                            <div className="form-field">
                                <label htmlFor="_id" className="form-field__label">Thể loại</label>

                                {
                                    isAddNewCommissionServiceCategory == false ? (
                                        <>
                                            <select
                                                name="_id"
                                                value={inputs.categoryId || ""}
                                                onChange={handleChange}
                                                className="form-field__input"
                                            >
                                                <option value="">-- Chọn loại dịch vụ --</option>
                                                {commissionServiceCategories.map((serviceCategory) => {
                                                    return (<option value={serviceCategory._id}>{serviceCategory.title}</option>)
                                                })}
                                            </select>
                                            <button className="btn btn-2" onClick={() => { setIsAddNewCommissionServiceCategory(true); }}>Thêm thể loại</button>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                name="newCommissionServiceCategory"
                                                value={inputs.newCommissionServiceCategory}
                                                onChange={handleChange}
                                                className="form-field__input"
                                                placeholder="Nhập tên thể loại"
                                            />
                                            <button className="btn btn-2" onClick={() => { setIsAddNewCommissionServiceCategory(false) }}>Hủy</button>
                                        </>
                                    )
                                }

                                {errors._id && <span className="form-field__error">{errors._id}</span>}
                            </div>

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
                                <label htmlFor="deliverables" className="form-field__label">Mô tả</label>
                                <span className="form-field__annotation">Ở phần này, vui lòng mô tả chi tiết những gì khách hàng có thể nhận được từ dịch vụ của bạn.</span>
                                <textarea
                                    id="deliverables"
                                    name="deliverables"
                                    value={inputs.deliverables}
                                    onChange={handleChange}
                                    className="form-field__input"
                                    placeholder="Mô tả chi tiết yêu cầu của bạn ..."
                                />
                                {errors.deliverables && <span className="form-field__error">{errors.deliverables}</span>}
                            </div>

                            <div className="form-field">
                                <label className="form-field__label">Tranh mẫu</label>
                                <span className="form-field__annotation">Cung cấp một số tranh mẫu để khách hàng hình dung chất lượng dịch vụ của bạn tốt hơn (tối thiểu 3 và tối đa 5 tác phẩm).</span>
                                {portfolios.map((portfolio, index) => {
                                    return (portfolio &&
                                        <div key={index} className="form-field__input img-preview">
                                            <div className="img-preview--left">
                                                <img src={URL.createObjectURL(portfolio)} alt={`portfolio ${index + 1}`} className="img-preview__img" />
                                                <div className="img-preview__info">
                                                    {/* <span className="img-preview__name">{limitString(portfolio, 15)}</span> */}
                                                    {/* <span className="img-preview__size">{formatFloat(bytesToKilobytes(portfolio.size), 1)} KB</span> */}
                                                </div>
                                            </div>
                                            <div className="img-preview--right">
                                                <svg onClick={() => removeImage(index)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 img-preview__close-ic">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        </div>
                                    )
                                })}


                                <div className="form-field with-ic add-link-btn btn-md" onClick={triggerFileInput}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic add-link-btn__ic">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span>Thêm ảnh</span>

                                    <input type="file" id="file-input" style={{ display: "none" }} multiple accept="image/*" onChange={handleImageChange} className="form-field__input" />
                                </div>

                                {errors.portfolios && <span className="form-field__error">{errors.portfolios}</span>}
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
                                <label htmlFor="notes" className="form-field__label">Lưu ý</label>
                                <span className="form-field__annotation">Để lại lưu ý cho khách hàng của bạn.</span>
                                <textarea
                                    type=""
                                    name="notes"
                                    value={inputs.notes}
                                    className="form-field__input"
                                    onChange={handleChange}
                                    placeholder="Nhập lưu ý ..."
                                />
                                {errors.notes && <span className="form-field__error">{errors.notes}</span>}
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
                disabled={isSubmitEditCommissionServiceLoading}>
                {isSubmitEditCommissionServiceLoading ? (
                    <span className="btn-spinner"></span>
                ) : (
                    "Tiếp tục"
                )}
            </button>
        </div >
    )
}