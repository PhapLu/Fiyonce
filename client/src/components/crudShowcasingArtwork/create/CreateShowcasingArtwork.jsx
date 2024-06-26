import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    formatCurrency,
    limitString,
    formatFloat,
    bytesToKilobytes,
    formatNumber
} from "../../../utils/formatter.js";
import { isFilled, minValue } from "../../../utils/validator.js";
import "./CreateShowcasingArtwork.scss";
import { createFormData, apiUtils } from "../../../utils/newRequest.js";

export default function CreateShowcasingArtwork({
    showcasingArtworkCollections,
    setShowCreateShowcasingArtworkForm,
    setOverlayVisible,
    createMutation
}) {

    const [movements, setMovements] = useState([
        {
            _id: 1,
            name: "Truyền thần",
        },
        {
            _id: 2,
            name: "Minh họa",
        },
    ]);

    const [inputs, setInputs] = useState({
        showcasingArtworks: [],
        hashtags: [],
    });
    const [errors, setErrors] = useState({});
    const [isSubmitCreateShowcasingArtworkLoading, setIsSubmitCreateShowcasingArtworkLoading] = useState(false);
    const [isCreateNewShowcasingArtworkCategory, setIsCreateNewShowcasingArtworkCategory] = useState(false);
    const [isSuccessCreateShowcasingArtwork, setIsSuccessCreateShowcasingArtwork] = useState(false);
    const [showcasingArtworks, setShowcasingArtworks] = useState(Array(5).fill(null));

    const createCommissionRef = useRef();
    useEffect(() => {
        const handler = (e) => {
            if (createCommissionRef.current && !createCommissionRef.current.contains(e.target)) {
                setShowCreateShowcasingArtworkForm(false);
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

        // Validation logic

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
        const newShowcasingArtworks = [...showcasingArtworks];
        files.forEach((file) => {
            if (file.size > 500 * 1024) {
                setErrors((values) => ({ ...values, showcasingArtworks: "Dung lượng ảnh không được vượt quá 500KB." }));
            } else {
                const showcasingArtworkIndex = newShowcasingArtworks.findIndex((showcasingArtwork) => showcasingArtwork === null);
                if (showcasingArtworkIndex !== -1) {
                    newShowcasingArtworks[showcasingArtworkIndex] = file;
                }
            }
        });
        setShowcasingArtworks(newShowcasingArtworks);
    };

    const placeholderImage = "/uploads/default_image_placeholder.png";

    const removeImage = (index) => {
        const newShowcasingArtworks = [...showcasingArtworks];
        newShowcasingArtworks[index] = null;
        setShowcasingArtworks(newShowcasingArtworks);
    };

    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitCreateShowcasingArtworkLoading(true);
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitCreateShowcasingArtworkLoading(false);
            return;
        }


        // Create showcasing artwork category
        if (isCreateNewShowcasingArtworkCategory) {
            console.log({ title: inputs.newShowcasingArtworkCategoryTitle })
            try {
                const response = await apiUtils.post("/serviceCategory/createServiceCategory", { title: inputs.newShowcasingArtworkCategoryTitle });
                console.log(response)
                if (response) {
                    const serviceCategoryId = response.data.metadata.serviceCategory._id;
                    inputs.serviceCategoryId = serviceCategoryId;
                    console.log(serviceCategoryId)
                    console.log(inputs.serviceCategoryId)
                    setIsSuccessCreateShowcasingArtwork(true);
                }
            } catch (error) {
                console.error("Failed to create new showcasing artwork category:", error);
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    serverError: error.response.data.message
                }));
            } finally {
                setIsSubmitCreateShowcasingArtworkLoading(false);
            }
        }
        console.log(inputs)
        const { isAgreeTerms, ...submissionData } = inputs;
        console.log(showcasingArtworks)
        console.log(submissionData)
        const fd = createFormData(submissionData, showcasingArtworks);
        console.log(fd.get("title"))
        console.log(fd.get("minPrice"))
        console.log(fd.get("deliverables"))
        console.log(fd.get("createOns"))
        console.log(fd.get("serviceCategoryId"))
        console.log(fd.get("files"))

        try {
            // const response = await apiUtils.post("/showcasingArtwork/createShowcasingArtwork", fd);
            await createMutation.mutateAsync(fd);
        } catch (error) {
            console.error("Failed to create new showcasing artwork:", error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response.data.message
            }));
        } finally {
            setIsSubmitCreateShowcasingArtworkLoading(false);
        }
    };

    const filteredShowcasingArtworks = showcasingArtworks.filter((showcasingArtwork) => showcasingArtwork !== null);
    const displayShowcasingArtworks = [...filteredShowcasingArtworks];

    while (displayShowcasingArtworks.length < 3) {
        displayShowcasingArtworks.push(placeholderImage);
    }

    return (
        <div className="create-commission-service modal-form type-3" ref={createCommissionRef} onClick={(e) => { e.stopPropagation(); }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowCreateShowcasingArtworkForm(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <h2 className="form__title">Thêm tác phẩm</h2>
            {!isSuccessCreateShowcasingArtwork ? (
                <>
                    <div className="form-field with-add-btn">
                        <label htmlFor="showcasingArtworkCategory" className="form-field__label">Album</label>
                        {!isCreateNewShowcasingArtworkCategory ? (
                            <>
                                <select
                                    name="showcasingArtworkCategory"
                                    value={inputs?.showcasingArtworkCategory || ""}
                                    onChange={handleChange}
                                    className="form-field__input"
                                >
                                    <option value="">-- Chọn album --</option>
                                    {showcasingArtworkCollections.map((serviceCategory) => (
                                        <option key={serviceCategory._id} value={serviceCategory._id}>{serviceCategory.title}</option>
                                    ))}
                                </select>
                                <button className="btn btn-2" onClick={() => setIsCreateNewShowcasingArtworkCategory(true)}>Thêm Album</button>
                            </>
                        ) : (
                            <>
                                <input
                                    name="newShowcasingArtworkCategoryTitle"
                                    value={inputs?.newShowcasingArtworkCategoryTitle}
                                    onChange={handleChange}
                                    className="form-field__input"
                                    placeholder="Nhập tên thể loại"
                                />
                                <button className="btn btn-4" onClick={() => setIsCreateNewShowcasingArtworkCategory(false)}>Hủy</button>
                            </>
                        )}
                        {errors._id && <span className="form-field__error">{errors._id}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="description" className="form-field__label">Mô tả</label>
                        <textarea
                            id="description"
                            name="description"
                            value={inputs?.description}
                            onChange={handleChange}
                            className="form-field__input"
                            placeholder="Mô tả chi tiết yêu cầu của bạn ..."
                        />
                        {errors.description && <span className="form-field__error">{errors.description}</span>}
                    </div>

                    <div className="form-field">
                        {showcasingArtworks.map((showcasingArtwork, index) => {
                            return (
                                showcasingArtwork && (
                                    <div key={index} className="form-field__input img-preview">
                                        <div className="img-preview--left">
                                            <img
                                                src={
                                                    showcasingArtwork instanceof File
                                                        ? URL.createObjectURL(showcasingArtwork)
                                                        : showcasingArtwork || placeholderImage
                                                }
                                                alt={`showcasingArtwork ${index + 1}`}
                                                className="img-preview__img"
                                            />
                                            <div className="img-preview__info">
                                                <span className="img-preview__name">
                                                    {showcasingArtwork instanceof File
                                                        ? limitString(showcasingArtwork.name, 15)
                                                        : "Tranh mẫu"}
                                                </span>
                                                <span className="img-preview__size">
                                                    {showcasingArtwork instanceof File
                                                        ? formatFloat(bytesToKilobytes(showcasingArtwork.size), 1) + " KB"
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

                        {errors.showcasingArtworks && <span className="form-field__error">{errors.showcasingArtworks}</span>}
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
            <button
                type="submit"
                className="form__submit-btn btn btn-2 btn-md"
                onClick={handleSubmit}
                disabled={isSubmitCreateShowcasingArtworkLoading}
            >
                {isSubmitCreateShowcasingArtworkLoading ? (
                    <span className="btn-spinner"></span>
                ) : (
                    "Tiếp tục"
                )}
            </button>
        </div>
    );
}