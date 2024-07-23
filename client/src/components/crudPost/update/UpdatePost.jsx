import { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useMovement } from "../../../contexts/movement/MovementContext.jsx";
import { useModal } from "../../../contexts/modal/ModalContext.jsx";
import { formatCurrency, limitString, formatFloat, bytesToKilobytes, formatNumber } from "../../../utils/formatter.js";
import { isFilled, minValue } from "../../../utils/validator.js";
import { createFormData, apiUtils } from "../../../utils/newRequest.js";
import "./UpdatePost.scss";

export default function UpdatePost() {
    const { movements } = useMovement();
    const { setModalInfo } = useModal();
    const navigate = useNavigate(); // Use the useNavigate hook
    const { postId, userId } = useParams();
    const { postCategories } = useOutletContext();

    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitUpdatePostLoading, setIsSubmitUpdatePostLoading] = useState(false);
    const [isCreateNewShowcasingPostCategory, setIsCreateNewShowcasingPostCategory] = useState(false);
    const [artworks, setArtworks] = useState([]);

    const updatePostRef = useRef();

    const closeForm = () => {
        if (userId) {
            navigate(`/users/${userId}/profile-posts`);
        } else {
            navigate(`/explore`);
        }
    };

    useEffect(() => {
        const handler = (e) => {
            if (updatePostRef.current && !updatePostRef.current.contains(e.target)) {
                closeForm();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [navigate]);

    const urlToFile = async (url, filename, mimeType) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], filename, { type: mimeType });
    };

    // Fetch post details by ID
    const fetchPostByID = async () => {
        try {
            const response = await apiUtils.get(`/post/readPost/${postId}`);
            const postData = response.data.metadata.post;
            console.log(postData)
            console.log(postData.artworks)
            const artworksWithFiles = await Promise.all(
                postData.artworks.map(async (artwork, index) => {
                    const file = await urlToFile(artwork.url, `${index + Date.now()}.jpg`, 'image/jpeg');
                    return file;
                })
            );

            return {
                postCategoryId: postData.postCategoryId?._id || "",
                movementId: postData.movementId?._id || "",
                description: postData.description || "",
                artworks: artworksWithFiles
            };
        } catch (error) {
            console.log(error)
            return null;
        }
    };

    const {
        data: post,
        error,
        isError,
        isLoading,
    } = useQuery("fetchPostByID", fetchPostByID, {
        onSuccess: (data) => {
            console.log(data)
            setInputs(data);
            setArtworks(data.artworks);
        }
    });

    if (isLoading) {
        return;
    }

    const validateInputs = () => {
        let errors = {};

        if (!isFilled(inputs.movementId)) {
            errors.movementId = "Vui lòng chọn trường phái nghệ thuật";
        }

        if (!isFilled(inputs.newPostCategoryTitle) && !isFilled(inputs.postCategoryId)) {
            errors.postCategoryId = "Vui lòng chọn thể loại dịch vụ của bạn";
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
        const newArtworks = [...artworks];
        files.forEach((file) => {
            if (file.size > 2000 * 1024) {
                setErrors((values) => ({ ...values, artworks: "Dung lượng ảnh không được vượt quá 2MB." }));
            } else {
                newArtworks.push({ url: null, file });
            }
        });
        setArtworks(newArtworks);
    };

    const placeholderImage = "/uploads/default_image_placeholder.png";

    const removeImage = (index) => {
        const newArtworks = [...artworks];
        newArtworks.splice(index, 1);
        setArtworks(newArtworks);
    };

    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitUpdatePostLoading(true);
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitUpdatePostLoading(false);
            return;
        }

        if (isCreateNewShowcasingPostCategory) {
            try {
                const response = await apiUtils.post("/postCategory/createPostCategory", { title: inputs.newPostCategoryTitle });
                if (response) {
                    const postCategoryId = response.data.metadata.postCategory._id;
                    inputs.postCategoryId = postCategoryId;
                }
            } catch (error) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    serverError: error.response.data.message
                }));
                setIsSubmitUpdatePostLoading(false);
                return;
            }
        }

        console.log(inputs)
        const fd = createFormData(inputs, 'artworks', artworks.filter(f => f !== null));

        try {
            const response = await apiUtils.patch(`/post/updatePost/${postId}`, fd);
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Đăng tác phẩm thành công"
                });
                closeForm();
            }
        } catch (error) {
            setModalInfo({
                status: "error",
                message: error.response.data.message
            });
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response.data.message
            }));
        } finally {
            setIsSubmitUpdatePostLoading(false);
        }
    };

    const filteredShowcasingPosts = artworks.filter((showcasingPost) => showcasingPost.file !== null || showcasingPost.url !== null);
    const displayShowcasingPosts = [...filteredShowcasingPosts];

    while (displayShowcasingPosts.length < 3) {
        displayShowcasingPosts.push({ url: placeholderImage, file: null });
    }

    return (
        <div className="overlay">
            <div className="create-commission-service modal-form type-3" ref={updatePostRef} onClick={(e) => { e.stopPropagation(); }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                    closeForm();
                }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>

                <h2 className="form__title">Chỉnh sửa</h2>
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
                    {errors.movement && <span className="form-field__error">{errors.movement}</span>}
                </div>
                <div className="form-field with-create-btn">
                    <label htmlFor="postCategoryId" className="form-field__label">Album</label>
                    {!isCreateNewShowcasingPostCategory ? (
                        <>
                            <select
                                name="postCategoryId"
                                value={inputs?.postCategoryId || ""}
                                onChange={handleChange}
                                className="form-field__input"
                            >
                                <option value="">-- Chọn album --</option>
                                {postCategories?.map((postCategory) => (
                                    <option key={postCategory._id} value={postCategory._id}>{postCategory.title}</option>
                                ))}
                            </select>
                            <button className="btn btn-2" onClick={() => setIsCreateNewShowcasingPostCategory(true)}>Thêm Album</button>
                        </>
                    ) : (
                        <>
                            <input
                                name="newPostCategoryTitle"
                                value={inputs?.newPostCategoryTitle || ""}
                                onChange={handleChange}
                                className="form-field__input"
                                placeholder="Nhập tên album"
                            />
                            <button className="btn btn-4" onClick={() => setIsCreateNewShowcasingPostCategory(false)}>Hủy</button>
                        </>
                    )}
                    {errors.postCategory && <span className="form-field__error">{errors.postCategory}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="description" className="form-field__label">Mô tả</label>
                    <textarea
                        id="description"
                        name="description"
                        value={inputs?.description || ""}
                        onChange={handleChange}
                        className="form-field__input"
                        placeholder="Nói gì đó về tác phẩm của bạn ..."
                    />
                    {errors.description && <span className="form-field__error">{errors.description}</span>}
                </div>

                <div className="form-field">
                    {displayShowcasingPosts?.map((showcasingPost, index) => {
                        return (
                            showcasingPost && (
                                <div key={index} className="form-field__input img-preview">
                                    <div className="img-preview--left">
                                        <img
                                            src={
                                                showcasingPost instanceof File
                                                    ? URL.createObjectURL(showcasingPost)
                                                    : showcasingPost.url || placeholderImage
                                            }
                                            alt={`showcasingPost ${index + 1}`}
                                            className="img-preview__img"
                                        />
                                        <div className="img-preview__info">
                                            <span className="img-preview__name">
                                                {
                                                    showcasingPost instanceof File
                                                        ? limitString(showcasingPost.name, 15)
                                                        : "Tranh mẫu"}
                                            </span>
                                            <span className="img-preview__size">
                                                {showcasingPost.file
                                                    ? formatFloat(bytesToKilobytes(showcasingPost.file.size), 1) + " KB"
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

                    {errors.artworks && <span className="form-field__error">{errors.artworks}</span>}
                </div>

                <div className="form-field">
                    {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
                </div>

                <div className="form-field">
                    <button
                        type="submit"
                        className="form-field__input btn btn-2 btn-md"
                        onClick={handleSubmit}
                        disabled={isSubmitUpdatePostLoading}
                    >
                        {isSubmitUpdatePostLoading ? (
                            <span className="btn-spinner"></span>
                        ) : (
                            "Xác nhận"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
