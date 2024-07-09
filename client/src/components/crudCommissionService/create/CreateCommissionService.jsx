// Imports
import { useState, useEffect, useRef } from "react";
import { useQuery } from 'react-query'
import { Link } from "react-router-dom";

// Resources
import { useModal } from "../../../contexts/modal/ModalContext.jsx";
import Modal from "../../../components/modal/Modal.jsx";

// Utils
import {
    formatCurrency,
    limitString,
    formatFloat,
    bytesToKilobytes,
} from "../../../utils/formatter.js";
import { isFilled, minValue } from "../../../utils/validator.js";
import { createFormData, newRequest, apiUtils } from "../../../utils/newRequest.js";

// Styling
import "./CreateCommissionService.scss";

export default function CreateCommissionService({
    commissionServiceCategories,
    setShowCreateCommissionServiceForm,
    setOverlayVisible,
    createMutation
}) {
    const { setModalInfo } = useModal();

    const fetchMovements = async () => {
        try {
            const response = await newRequest.get('movement/readMovements');
            return response.data.metadata.movements;
        } catch (error) {
            console.error(error)
            return null;
        }
    };

    const { data: movements, error: fetchingMovementError, isError: isFetchingMovementError, isLoading: isFetchingMNovementLoading } = useQuery('fetchMovements', fetchMovements, {
        onError: (error) => {
            console.error('Error fetching art movements:', error);
        },
        onSuccess: (movements) => {
            console.log("Movements", movements);
        },
    });


    const fetchCommissionTos = async () => {
        try {
            const response = await newRequest.get('/termOfService/readTermOfServices');
            return response.data.metadata.termOfServices;
        } catch (error) {
            console.error(error)
            return null;
        }
    };

    const { data: commissionToss, error: fetchingTossError, isError: isFetchingToss, isLoading } = useQuery('fetchCommissionTos', fetchCommissionTos, {
        onError: (error) => {
            console.error('Error fetching art movements:', error);
        },
        onSuccess: (commissionToss) => {
            console.log("Movements", commissionToss);
        },
    });


    const [inputs, setInputs] = useState({
        portfolios: []
    });
    const [errors, setErrors] = useState({});
    const [isSubmitCreateCommissionServiceLoading, setIsSubmitCreateCommissionServiceLoading] = useState(false);
    const [isCreateNewCommissionServiceCategory, setIsCreateNewCommissionServiceCategory] = useState(false);
    const [portfolios, setPortfolios] = useState(Array(5).fill(null));

    const createCommissionRef = useRef();
    useEffect(() => {
        const handler = (e) => {
            if (createCommissionRef.current && !createCommissionRef.current.contains(e.target)) {
                setShowCreateCommissionServiceForm(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    const validateInputs = () => {
        let errors = {};

        if (!isFilled(inputs.movementId)) {
            errors.movementId = "Vui lòng chọn trường phái nghệ thuật";
        }

        if (!isFilled(inputs.newCommissionServiceCategoryTitle) && !isFilled(inputs.serviceCategoryId)) {
            errors.serviceCategoryId = "Vui lòng chọn thể loại dịch vụ của bạn";
        }

        if (!isFilled(inputs.title)) {
            errors.title = "Vui lòng điền tên dịch vụ";
        }

        if (!isFilled(inputs.deliverables)) {
            errors.deliverables = "Vui lòng nhập mô tả";
        }

        const filteredPortfolios = portfolios.filter((portfolio) => portfolio !== null);
        if (!filteredPortfolios || filteredPortfolios.length < 3 || filteredPortfolios.length > 5) {
            errors.portfolios = "Vui lòng chọn 3-5 tranh mẫu";
        }

        if (!isFilled(inputs.minPrice)) {
            errors.minPrice = "Vui lòng chọn mức giá tối thiểu";
        } else if (!minValue(inputs.minPrice, 50000)) {
            errors.minPrice = "Mức giá tối thiểu không được dưới 50.000 VND";
        }

        if (!isFilled(inputs.termOfServiceId)) {
            errors.termOfServiceId = "Vui lòng chọn điều khoản dịch vụ";
        }

        if (!inputs.isAgreeTerms) {
            errors.isAgreeTerms = "Vui lòng xác nhận đồng ý";
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setInputs((prevState) => ({
                ...prevState,
                [name]: checked
            }));
        } else {
            setInputs((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
        setErrors((values) => ({ ...values, [name]: '' }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newPortfolios = portfolios.filter(portfolio => portfolio !== null); // Remove null values
        files.forEach((file) => {
            if (file.size > 10 * 1024 * 1024) {
                setErrors((values) => ({ ...values, portfolios: "Dung lượng ảnh không được vượt quá 10 MB." }));
            } else {
                newPortfolios.push(file);
            }
        });
        setPortfolios(newPortfolios);
    };

    const placeholderImage = "/uploads/default_image_placeholder.png";

    const removeImage = (index) => {
        const newPortfolios = [...portfolios];
        newPortfolios[index] = null;
        setPortfolios(newPortfolios);
    };

    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitCreateCommissionServiceLoading(true);
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitCreateCommissionServiceLoading(false);
            return;
        }

        // Create commission service category
        if (isCreateNewCommissionServiceCategory) {
            try {
                const response = await apiUtils.post("/serviceCategory/createServiceCategory", { title: inputs.newCommissionServiceCategoryTitle });
                if (response) {
                    const serviceCategoryId = response.data.metadata.serviceCategory._id;
                    inputs.serviceCategoryId = serviceCategoryId;
                }
            } catch (error) {
                console.error("Failed to create new commission service category:", error);
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    serverError: error.response.data.message
                }));
                setModalInfo({
                    status: "error",
                    message: error.response.data.message
                })
            }
        }

        const fd = createFormData(inputs, "files", portfolios);

        try {
            const response = await createMutation.mutateAsync(fd);
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Thêm dịch vụ thành công"
                })
                setShowDeleteCommissionTosForm(false);
                setOverlayVisible(false);
            }
        } catch (error) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response.data.message
            }));
            setModalInfo({
                status: "error",
                message: error.response.data.message
            })
        } finally {
            setIsSubmitCreateCommissionServiceLoading(false);
        }
    };

    const filteredPortfolios = portfolios.filter((portfolio) => portfolio !== null);
    const displayPortfolios = portfolios.filter((portfolio) => portfolio !== null).slice(0, 5);

    while (displayPortfolios.length < 3) {
        displayPortfolios.push(placeholderImage);
    }


    return (
        <div className="create-commission-service modal-form type-2" ref={createCommissionRef} onClick={(e) => { e.stopPropagation(); }}>
            <Link to="/help_center" className="form__help" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__help-ic">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg> Trợ giúp
            </Link>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowCreateCommissionServiceForm(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <div className="modal-form--left">
                <span>
                    {inputs?.serviceCategoryId
                        ? commissionServiceCategories.find((category) => category._id == inputs?.serviceCategoryId)?.title || "Thể loại"
                        : "Thể loại"}
                </span>
                <h3>{inputs?.title || "Tên dịch vụ"}</h3>
                <span>Giá từ: <span className="highlight-text"> {(inputs?.minPrice && formatCurrency(inputs?.minPrice)) || "x"} VND</span></span>
                <hr />
                <div className="images-layout-3">
                    {displayPortfolios.slice(0, 3).map((portfolio, index) => (
                        <img
                            key={index}
                            src={
                                portfolio instanceof File
                                    ? URL.createObjectURL(portfolio)
                                    : portfolio
                            }
                            alt={`portfolio ${index + 1}`}
                        />
                    ))}
                </div>
                <p>*Lưu ý: <i>{inputs?.notes || "Lưu ý cho khách hàng"}</i></p>
            </div>

            <div className="modal-form--right">
                <h2 className="form__title">Thêm dịch vụ</h2>
                <div className="form-field">
                    <label htmlFor="movementId" className="form-field__label">Trường phái</label>
                    <select
                        name="movementId"
                        value={inputs?.movementId || ""}
                        onChange={handleChange}
                        className="form-field__input"
                    >
                        <option value="">-- Chọn trường phái --</option>
                        {movements?.map((movement) => (
                            <option key={movement._id} value={movement._id}>{movement.title}</option>
                        ))}
                    </select>
                    {errors.movementId && <span className="form-field__error">{errors.movementId}</span>}
                </div>
                <>
                    <div className="form-field with-create-btn">
                        <label htmlFor="serviceCategoryId" className="form-field__label">Thể loại</label>
                        {!isCreateNewCommissionServiceCategory ? (
                            <>
                                <select
                                    name="serviceCategoryId"
                                    value={inputs?.serviceCategoryId || ""}
                                    onChange={handleChange}
                                    className="form-field__input"
                                >
                                    <option value="">-- Chọn thể loại dịch vụ --</option>
                                    {commissionServiceCategories.map((serviceCategory) => (
                                        <option key={serviceCategory._id} value={serviceCategory._id}>{serviceCategory.title}</option>
                                    ))}
                                </select>
                                <button className="btn btn-2" onClick={() => setIsCreateNewCommissionServiceCategory(true)}>Thêm thể loại</button>
                            </>
                        ) : (
                            <>
                                <input
                                    name="newCommissionServiceCategoryTitle"
                                    value={inputs?.newCommissionServiceCategoryTitle}
                                    onChange={handleChange}
                                    className="form-field__input"
                                    placeholder="Nhập tên thể loại"
                                />
                                <button className="btn btn-2" onClick={() => setIsCreateNewCommissionServiceCategory(false)}>Hủy</button>
                            </>
                        )}
                        {errors.serviceCategoryId && <span className="form-field__error">{errors.serviceCategoryId}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="title" className="form-field__label">Tên dịch vụ</label>
                        <span className="form-field__annotation">Tên dịch vụ nên chứa những từ khóa liên quan để khách hàng tìm kiếm dịch vụ của bạn thuận lợi hơn.</span>
                        <input
                            id="title"
                            name="title"
                            value={inputs?.title}
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
                            value={inputs?.deliverables}
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
                            return (
                                portfolio && (
                                    <div key={index} className="form-field__input img-preview">
                                        <div className="img-preview--left">
                                            <img
                                                src={
                                                    portfolio instanceof File
                                                        ? URL.createObjectURL(portfolio)
                                                        : portfolio || placeholderImage
                                                }
                                                alt={`portfolio ${index + 1}`}
                                                className="img-preview__img"
                                            />
                                            <div className="img-preview__info">
                                                <span className="img-preview__name">
                                                    {portfolio instanceof File
                                                        ? limitString(portfolio.name, 15)
                                                        : "Tranh mẫu"}
                                                </span>
                                                <span className="img-preview__size">
                                                    {portfolio instanceof File
                                                        ? formatFloat(bytesToKilobytes(portfolio.size), 1) + " KB"
                                                        : ""}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="img-preview--right">
                                            <svg
                                                onClick={() => removeImage(index)}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="size-6 img-preview__close-ic"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                    </div>
                                )
                            );
                        })}

                        <div className="form-field with-ic create-link-btn btn-md" onClick={triggerFileInput}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic create-link-btn__ic">
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
                            value={inputs?.minPrice}
                            className="form-field__input"
                            onChange={handleChange}
                            placeholder="Nhập mức tối thiểu"
                        />
                        {errors.minPrice && <span className="form-field__error">{errors.minPrice}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="notes" className="form-field__label">Lưu ý</label>
                        <span className="form-field__annotation">Để lại lưu ý cho khách hàng của bạn về dịch vụ này.</span>
                        <textarea
                            type="text"
                            name="notes"
                            value={inputs?.notes}
                            className="form-field__input"
                            onChange={handleChange}
                            placeholder="Nhập lưu ý ..."
                        />
                        {errors.notes && <span className="form-field__error">{errors.notes}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="termOfServiceId" className="form-field__label">Điều khoản dịch vụ</label>
                        <select
                            name="termOfServiceId"
                            value={inputs?.termOfServiceId || ""}
                            onChange={handleChange}
                            className="form-field__input"
                        >
                            <option value="">-- Chọn điều khoản dịch vụ --</option>
                            {commissionToss?.map((commissionTos) => (
                                <option key={commissionTos._id} value={commissionTos._id}>{commissionTos.title}</option>
                            ))}
                        </select>
                        {errors.termOfServiceId && <span className="form-field__error">{errors.termOfServiceId}</span>}
                    </div>

                    <div className="form-field">
                        <label className="form-field__label">
                            <input
                                type="checkbox"
                                name="isAgreeTerms"
                                checked={inputs?.isAgreeTerms}
                                onChange={handleChange}
                            /> <span>Tôi đồng ý với các <Link to="/terms_and_policies" className="highlight-text"> điều khoản dịch vụ </Link> của Pastal</span>
                        </label>
                        {errors.isAgreeTerms && <span className="form-field__error">{errors.isAgreeTerms}</span>}
                    </div>
                    <div className="form-field">
                        {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
                    </div>
                </>
            </div>

            <div className="form__submit-btn-container">
                <button
                    type="submit"
                    className="form__submit-btn-item btn btn-2 btn-md"
                    onClick={handleSubmit}
                    disabled={isSubmitCreateCommissionServiceLoading}
                >
                    {isSubmitCreateCommissionServiceLoading ? (
                        <span className="btn-spinner"></span>
                    ) : (
                        "Xác nhận"
                    )}

                </button>
            </div>
        </div>
    );
}