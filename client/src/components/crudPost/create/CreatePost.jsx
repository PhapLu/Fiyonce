// Imports
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Contexts
import { useMovement } from "../../../contexts/movement/MovementContext.jsx"
import {useModal} from "../../../contexts/modal/ModalContext.jsx";

// Utils
import { formatCurrency, limitString, formatFloat, bytesToKilobytes, formatNumber } from "../../../utils/formatter.js";
import { isFilled, minValue } from "../../../utils/validator.js";
import { createFormData, apiUtils } from "../../../utils/newRequest.js";

// Styling
import "./CreatePost.scss";

export default function CreatePost({ showcasingPostCollections, setShowCreatePostForm, setOverlayVisible, createMutation }) {
    const { movements } = useMovement();
    const { setModalInfo } = useModal();

    const [inputs, setInputs] = useState({
        hashtags: [],
    });
    const [errors, setErrors] = useState({});
    const [isSubmitCreatePostLoading, setIsSubmitCreatePostLoading] = useState(false);
    const [isCreateNewShowcasingPostCategory, setIsCreateNewShowcasingPostCategory] = useState(false);
    const [isSuccessCreatePost, setIsSuccessCreatePost] = useState(false);
    const [showcasingPosts, setShowcasingPosts] = useState(Array(5).fill(null));

    const createCommissionRef = useRef();
    useEffect(() => {
        const handler = (e) => {
            if (createCommissionRef.current && !createCommissionRef.current.contains(e.target)) {
                setShowCreatePostForm(false);
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

        if (isFilled(inputs.movement)) {
            errors.movement = "Vui lòng chọn trường phái nghệ thuật";
        }

        if (isFilled(inputs.showcasingPostCategory)) {
            errors.showcasingPostCategory = "Vui lòng chọn thể loại";
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
        const newShowcasingPosts = [...showcasingPosts];
        files.forEach((file) => {
            if (file.size > 500 * 1024) {
                setErrors((values) => ({ ...values, showcasingPosts: "Dung lượng ảnh không được vượt quá 500KB." }));
            } else {
                const showcasingPostIndex = newShowcasingPosts.findIndex((showcasingPost) => showcasingPost === null);
                if (showcasingPostIndex !== -1) {
                    newShowcasingPosts[showcasingPostIndex] = file;
                }
            }
        });
        setShowcasingPosts(newShowcasingPosts);
    };

    const placeholderImage = "/uploads/default_image_placeholder.png";

    const removeImage = (index) => {
        const newShowcasingPosts = [...showcasingPosts];
        newShowcasingPosts[index] = null;
        setShowcasingPosts(newShowcasingPosts);
    };

    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitCreatePostLoading(true);
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitCreatePostLoading(false);
            return;
        }


        // Create showcasing post category
        if (isCreateNewShowcasingPostCategory) {
            console.log({ title: inputs.newShowcasingPostCategoryTitle })
            try {
                const response = await apiUtils.post("/serviceCategory/createServiceCategory", { title: inputs.newShowcasingPostCategoryTitle });
                console.log(response)
                if (response) {
                    const serviceCategoryId = response.data.metadata.serviceCategory._id;
                    inputs.serviceCategoryId = serviceCategoryId;
                    console.log(serviceCategoryId)
                    console.log(inputs.serviceCategoryId)
                    setIsSuccessCreatePost(true);
                }
            } catch (error) {
                console.error("Failed to create new showcasing post category:", error);
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    serverError: error.response.data.message
                }));
            } finally {
                setIsSubmitCreatePostLoading(false);
            }
        }
        console.log(inputs)
        const fd = createFormData(inputs, showcasingPosts, 'files');

        try {
            // const response = await apiUtils.post("/showcasingPost/createShowcasingPost", fd);
            const response = await createMutation.mutateAsync(fd);
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Đăng tác phẩm thành công"
                })
            }
        } catch (error) {
            setModalInfo({
                status: "error",
                message: error.response.data.message
            })
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response.data.message
            }));
        } finally {
            setIsSubmitCreatePostLoading(false);
        }
    };

    const filteredShowcasingPosts = showcasingPosts.filter((showcasingPost) => showcasingPost !== null);
    const displayShowcasingPosts = [...filteredShowcasingPosts];

    while (displayShowcasingPosts.length < 3) {
        displayShowcasingPosts.push(placeholderImage);
    }

    return (
        <div className="create-commission-service modal-form type-3" ref={createCommissionRef} onClick={(e) => { e.stopPropagation(); }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowCreatePostForm(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <h2 className="form__title">Thêm tác phẩm</h2>
            <div className="form-field">
                <label htmlFor="movement" className="form-field__label">Trường phái</label>
                <select
                    name="movement"
                    value={inputs?.movement || ""}
                    onChange={handleChange}
                    className="form-field__input"
                >
                    <option value="">-- Chọn trường phái --</option>
                    {movements.map((movement) => (
                        <option key={movement._id} value={movement._id}>{movement.title}</option>
                    ))}
                </select>
                {errors.movement && <span className="form-field__error">{errors.movement}</span>}
            </div>
            <div className="form-field with-create-btn">
                <label htmlFor="showcasingPostCategory" className="form-field__label">Album</label>
                {!isCreateNewShowcasingPostCategory ? (
                    <>
                        <select
                            name="showcasingPostCategory"
                            value={inputs?.showcasingPostCategory || ""}
                            onChange={handleChange}
                            className="form-field__input"
                        >
                            <option value="">-- Chọn album --</option>
                            {showcasingPostCollections.map((serviceCategory) => (
                                <option key={serviceCategory._id} value={serviceCategory._id}>{serviceCategory.title}</option>
                            ))}
                        </select>
                        <button className="btn btn-2" onClick={() => setIsCreateNewShowcasingPostCategory(true)}>Thêm Album</button>
                    </>
                ) : (
                    <>
                        <input
                            name="newShowcasingPostCategoryTitle"
                            value={inputs?.newShowcasingPostCategoryTitle}
                            onChange={handleChange}
                            className="form-field__input"
                            placeholder="Nhập tên album"
                        />
                        <button className="btn btn-4" onClick={() => setIsCreateNewShowcasingPostCategory(false)}>Hủy</button>
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
                    placeholder="Nói gì đó về tác phẩm của bạn ..."
                />
                {errors.description && <span className="form-field__error">{errors.description}</span>}
            </div>

            <div className="form-field">
                {showcasingPosts.map((showcasingPost, index) => {
                    return (
                        showcasingPost && (
                            <div key={index} className="form-field__input img-preview">
                                <div className="img-preview--left">
                                    <img
                                        src={
                                            showcasingPost instanceof File
                                                ? URL.createObjectURL(showcasingPost)
                                                : showcasingPost || placeholderImage
                                        }
                                        alt={`showcasingPost ${index + 1}`}
                                        className="img-preview__img"
                                    />
                                    <div className="img-preview__info">
                                        <span className="img-preview__name">
                                            {showcasingPost instanceof File
                                                ? limitString(showcasingPost.name, 15)
                                                : "Tranh mẫu"}
                                        </span>
                                        <span className="img-preview__size">
                                            {showcasingPost instanceof File
                                                ? formatFloat(bytesToKilobytes(showcasingPost.size), 1) + " KB"
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

                {errors.showcasingPosts && <span className="form-field__error">{errors.showcasingPosts}</span>}
            </div>

            <div className="form-field">
                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
            </div>

            <div className="form-field">
                <button
                    type="submit"
                    className="form-field__input btn btn-2 btn-md"
                    onClick={handleSubmit}
                    disabled={isSubmitCreatePostLoading}
                >
                    {isSubmitCreatePostLoading ? (
                        <span className="btn-spinner"></span>
                    ) : (
                        "Đăng tải"
                    )}
                </button>
            </div>

        </div>
    );
}