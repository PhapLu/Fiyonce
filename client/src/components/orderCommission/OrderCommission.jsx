// Imports
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Utils
import { limitString, formatFloat, bytesToKilobytes } from "../../utils/formatter.js";
import { isFilled, minValue } from "../../utils/validator.js";

// Styling
import "./OrderCommission.scss";

export default function OrderCommission({ setShowOrderCommissionForm, setOverlayVisible }) {
    // Initialize variables for inputs, errors, loading effect
    const [inputs, setInputs] = useState({
        description: '',
        references: [],
        usage: 'personal',
        isPrivate: "0",
        fileTypes: [],
        minPrice: '',
        maxPrice: '',
        agreeTerms: false
    });
    const [errors, setErrors] = useState({});
    const [isSubmitOrderCommissionLoading, setIsSubmitOrderCommissionLoading] = useState(false);
    const [isSuccessOrderCommission, setIsSuccessOrderCommission] = useState(false);

    const [references, setReferences] = useState([]);

    // Toggle display overlay box
    const orderCommissionRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (orderCommissionRef && orderCommissionRef.current && !orderCommissionRef.current.contains(e.target)) {
                setShowOrderCommissionForm(false);
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

        // Validate email
        if (!isFilled(inputs.description)) {
            errors.description = 'Vui lòng nhập mô tả';
        }

        // Validate references uploading
        if (references.length < 1) {
            errors.references = "Vui lòng cung cấp ít nhất 1 ảnh tham khảo.";
        }

        // Validate minimum price
        if (!isFilled(inputs.minPrice)) {
            errors.minPrice = 'Vui lòng nhập giá tối thiểu';
        } else if (inputs.minPrice <= 100000) {
            errors.minPrice = 'Giá trị đơn hàng tối thiểu là 100.000 VND';
        }

        // Validate maximum price
        if (!isFilled(inputs.maxPrice)) {
            errors.maxPrice = 'Vui lòng nhập giá tối đa';
        }

        // Validate minimum price
        if (!inputs.isAgreeTerms) {
            errors.isAgreeTerms = 'Vui lòng xác nhận đồng ý với điều khoản';
        }

        return errors;
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log(inputs)

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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newReferences = [...references];

        files.forEach((file) => {
            if (file.size > 500 * 1024) {
                setErrors((values) => ({ ...values, references: "Dung lượng ảnh không được vượt quá 500KB." }));
            } else if (newReferences.length < 7) {
                newReferences.push(file);
                setErrors((values) => ({ ...values, references: "" }));
            } else {
                setErrors((values) => ({ ...values, references: "Bạn có thể chọn tối đa 3 tác phẩm." }));
            }
        });
        setReferences(newReferences);

        // Reset the input value to allow re-selecting the same file later
        e.target.value = '';
    };

    const removeImage = (index) => {
        const newReferences = [...references];
        newReferences.splice(index, 1);
        setReferences(newReferences);
    };

    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Initialize loading effect for the submit button
        setIsSubmitOrderCommissionLoading(true);
        console.log(inputs)

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Clear the loading effect if validation failed
            setIsSubmitOrderCommissionLoading(false);
            return;
        }

        // Handle login request
        try {
            setIsSuccessOrderCommission(true);
        } catch (error) {
            console.error("Failed to login:", error);
            errors.serverError = error.response.data.message;
        } finally {
            // Clear the loading effect
            setIsSubmitOrderCommissionLoading(false);
        }
    };

    return (
        <div className="order-commission modal-form type-2" ref={orderCommissionRef} onClick={(e) => { e.stopPropagation() }}>
            <Link to="/help_center" className="form__help" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 form__help-ic">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg> Trợ giúp
            </Link>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowOrderCommissionForm(false);
                setIsSuccessOrderCommission(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <div className="modal-form--left">
                <h3>Thủ tục đăng yêu cầu tìm họa sĩ</h3>
                <hr />
                <ul className="step-container">
                    <li className="step-item checked">Mô tả yêu cầu</li>
                    <li className="step-item">Các họa sĩ ứng hồ sơ và khách hàng chọn ra họa sĩ phù hợp nhất</li>
                    <li className="step-item">Khách hàng thanh toán đặt cọc</li>
                    <li className="step-item">Hai bên tiến hành trao đổi thêm. Họa sĩ cập nhật tiến độ và bản thảo</li>
                    <li className="step-item">Họa sĩ hoàn tất đơn hàng, khách hàng thanh toán phần còn lại và đánh giá</li>
                </ul>

                <div className="form__note">
                    <p>
                        <strong>*Lưu ý:</strong>
                        <br />
                        Mọi thông tin về đơn hàng của bạn sẽ được gửi đến hộp thư email của tài khoản mà bạn đăng kí. Vui lòng bật thông báo Gmail để nhận được thông tin mới nhất nhé!
                    </p>
                </div>
            </div>
            <div className="modal-form--right">
                <h2 className="form__title">Mô tả yêu cầu</h2>

                {!isSuccessOrderCommission ?

                    (
                        <>

                            <div className="form-field">
                                <label htmlFor="description" className="form-field__label">Mô tả</label>
                                <span className="form-field__annotation">Ở phần này, vui lòng miêu tả yêu cầu của bạn về sản phẩm mong muốn. Bạn và họa sĩ có thể trao đổi chi tiết thêm qua tin nhắn.</span>
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
                                <label className="form-field__label">Nguồn tham khảo</label>
                                <span className="form-field__annotation">Cung cấp tranh tham khảo hoặc đường dẫn đến chúng giúp họa sĩ hình dung ra yêu cầu của bạn tốt hơn (tối đa 5 ảnh).</span>
                                {references.map((reference, index) => (
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
                                ))}

                                <div className="form-field with-ic add-link-btn" onClick={triggerFileInput}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic add-link-btn__ic">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span>Thêm ảnh</span>

                                    <input type="file" id="file-input" style={{ display: "none" }} multiple accept="image/*" onChange={handleImageChange} className="form-field__input" />
                                </div>

                                {errors.references && <span className="form-field__error">{errors.references}</span>}
                            </div>
                            <div className="form-field">
                                <label className="form-field__label">Nhu cầu sử dụng</label>
                                <span className="form-field__annotation">Bạn cần tranh cho?</span>
                                <label className="form-field__label">
                                    <input
                                        type="radio"
                                        name="usage"
                                        value="personal"
                                        checked={inputs.usage === 'personal'}
                                        onChange={handleChange}
                                    /> Mục đích cá nhân
                                </label>
                                <label className="form-field__label">
                                    <input
                                        type="radio"
                                        name="usage"
                                        value="commercial"
                                        checked={inputs.usage === 'commercial'}
                                        onChange={handleChange}
                                    /> Mục đích thương mại
                                </label>
                                {errors.usage && <span className="form-field__error">{errors.usage}</span>}
                            </div>
                            <div className="form-field">
                                <label className="form-field__label">Riêng tư</label>
                                <span className="form-field__annotation">Cho phép họa sĩ sử dụng tranh vẽ cho bạn để quảng bá hình ảnh của họ?</span>
                                <label className="form-field__label">
                                    <input
                                        type="radio"
                                        name="isPrivate"
                                        value={"1"}
                                        checked={inputs.isPrivate === "1"}
                                        onChange={handleChange}
                                    /> Cho phép
                                </label>
                                <label className="form-field__label">
                                    <input
                                        type="radio"
                                        name="isPrivate"
                                        value={"0"}
                                        checked={inputs.isPrivate === "0"}
                                        onChange={handleChange}
                                    /> Không cho phép
                                </label>
                                {errors.isPrivate && <span className="form-field__error">{errors.isPrivate}</span>}
                            </div>
                            <div className="form-field">
                                <label className="form-field__label">Định dạng file</label>
                                <span className="form-field__annotation">Bạn muốn họa sĩ gửi file ở định dạng nào?</span>
                                <div className="checkbox-container">
                                    <label className="form-field__label">
                                        <input
                                            type="checkbox"
                                            name="fileTypes"
                                            value="png"
                                            checked={inputs.fileTypes.includes('png')}
                                            onChange={handleChange}
                                        /> png
                                    </label>
                                    <label className="form-field__label">
                                        <input
                                            type="checkbox"
                                            name="fileTypes"
                                            value="jpg"
                                            checked={inputs.fileTypes.includes('jpg')}
                                            onChange={handleChange}
                                        /> jpg
                                    </label>
                                    <label className="form-field__label">
                                        <input
                                            type="checkbox"
                                            name="fileTypes"
                                            value="jpeg"
                                            checked={inputs.fileTypes.includes('jpeg')}
                                            onChange={handleChange}
                                        /> jpeg
                                    </label>
                                    <label className="form-field__label">
                                        <input
                                            type="checkbox"
                                            name="fileTypes"
                                            value="svg"
                                            checked={inputs.fileTypes.includes('svg')}
                                            onChange={handleChange}
                                        /> svg
                                    </label>
                                    <label className="form-field__label">
                                        <input
                                            type="checkbox"
                                            name="fileTypes"
                                            value="tif"
                                            checked={inputs.fileTypes.includes('tif')}
                                            onChange={handleChange}
                                        /> tif
                                    </label>
                                    <label className="form-field__label">
                                        <input
                                            type="checkbox"
                                            name="fileTypes"
                                            value="ai"
                                            checked={inputs.fileTypes.includes('ai')}
                                            onChange={handleChange}
                                        /> ai
                                    </label>
                                    <label className="form-field__label">
                                        <input
                                            type="checkbox"
                                            name="fileTypes"
                                            value="psd"
                                            checked={inputs.fileTypes.includes('psd')}
                                            onChange={handleChange}
                                        /> psd
                                    </label>
                                </div>
                                {errors.fileTypes && <span className="form-field__error">{errors.fileTypes}</span>}
                            </div>
                            <div className="form-field">
                                <label className="form-field__label">Giá cả</label>
                                <span className="form-field__annotation">Cung cấp giá tiền tối thiểu và tối đa mà bạn có thể chi trả cho họa sĩ để hoàn thành tác phẩm theo yêu cầu của mình.</span>
                                <div className="half-split">
                                    <input
                                        type="number"
                                        name="minPrice"
                                        value={inputs.minPrice}
                                        className="form-field__input"
                                        onChange={handleChange}
                                        placeholder="Nhập mức tối thiểu"
                                    />
                                    -
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        value={inputs.maxPrice}
                                        className="form-field__input"
                                        onChange={handleChange}
                                        placeholder="Nhập mức tối đa"
                                    />
                                </div>
                                {errors.minPrice && <span className="form-field__error">{errors.minPrice}</span>}
                                {errors.maxPrice && <span className="form-field__error">{errors.maxPrice}</span>}
                            </div>
                            <div className="form-field">
                                <label className="form-field__label">
                                    <input
                                        type="checkbox"
                                        name="isAgreeTerms"
                                        checked={inputs.isAgreeTerms}
                                        onChange={handleChange}
                                    /> <span>Tôi đồng ý với các <Link to="/terms_and_policies" className="highlight-text"> điều khoản dịch vụ </Link> của Pastal</span>
                                </label>
                                {errors.isAgreeTerms && <span className="form-field__error">{errors.isAgreeTerms}</span>}
                            </div>
                            <div className="form-field">
                                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
                            </div>
                        </>
                    ) : (
                        <span>
                            Pastal đã gửi đi yêu cầu của bạn thành công. Các họa sĩ sẽ liên hệ với bạn qua nền tảng sớm nhất có thể.


                            Lưu ý: Pastal không chịu trách nhiệm đảm bảo lợi ích cho các giao dịch ngoài phạm vi. Nếu họa sĩ có hành động không trung thực, báo cáo cho chúng tôi tại đây.
                        </span>
                    )}
            </div>
            <button type="submit"
                className="form__submit-btn btn btn-2 btn-md"
                onClick={handleSubmit}
                disabled={isSubmitOrderCommissionLoading}>
                {isSubmitOrderCommissionLoading ? (
                    <span className="btn-spinner"></span>
                ) : (
                    "Gửi yêu cầu"
                )}
            </button>
        </div >
    )
}