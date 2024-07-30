import { useState, useEffect, useRef } from "react";
import { isFilled } from "../../../utils/validator.js";

export default function CreateNews({
    setShowCreateNewsForm,
    setOverlayVisible,
    createNewsMutation,
}) {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitCreateNewsLoading, setIsSubmitCreateCommissionServiceLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState(null);

    const createCommissionRef = useRef();
    useEffect(() => {
        const handler = (e) => {
            if (createCommissionRef.current && !createCommissionRef.current.contains(e.target)) {
                setShowCreateNewsForm(false);
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

        if (!isFilled(inputs.title)) {
            errors.title = "Vui lòng nhập tên trường phái";
        }

        if (!inputs.thumbnail) {
            errors.thumbnail = "Vui lòng chọn thumbnail";
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, type, files } = e.target;

        if (type === "file") {
            const file = files[0];
            setInputs((prevState) => ({ ...prevState, [name]: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnail(reader.result);
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        } else {
            setInputs((prevState) => ({ ...prevState, [name]: e.target.value }));
        }

        setErrors((values) => ({ ...values, [name]: '' }));
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

        const formData = new FormData();
        for (const key in inputs) {
            formData.append(key, inputs[key]);
        }

        try {
            console.log(formData)
            const response = await createNewsMutation.mutateAsync(formData);
            console.log(response);
        } catch (error) {
            console.error("Failed to create new commission service:", error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response.data.message
            }));
        } finally {
            setIsSubmitCreateCommissionServiceLoading(false);
        }
    };

    return (
        <div className="create-commission-service modal-form type-3" ref={createCommissionRef} onClick={(e) => { e.stopPropagation(); }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowCreateNewsForm(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <h2 className="form__title">Thêm tin tức</h2>
            {thumbnail && <div className="form-field">
                <label htmlFor="thumbnail" className="form-field__label">Preview</label>
                <div className="form-field__input img-preview">
                    <div className="img-preview--left">
                        <img src={thumbnail} alt="Thumbnail" className="img-preview__img" />
                        <div className="img-preview__info">
                            <span className="img-preview__name">{inputs?.title}</span>
                        </div>
                    </div>
                </div>
            </div>}
            <div className="form-field">
                <label htmlFor="title" className="form-field__label">Tiêu đề</label>
                <input
                    id="title"
                    name="title"
                    value={inputs?.title || ''}
                    onChange={handleChange}
                    className="form-field__input"
                    placeholder="Nhập tiêu đề"
                />
                {errors.title && <span className="form-field__error">{errors.title}</span>}
            </div>

            <div className="form-field">
                <label htmlFor="subTitle" className="form-field__label">Tiêu đề phụ</label>
                <input
                    id="subTitle"
                    name="subTitle"
                    value={inputs?.subTitle || ''}
                    onChange={handleChange}
                    className="form-field__input"
                    placeholder="Nhập tiêu đề phụ"
                />
                {errors.subTitle && <span className="form-field__error">{errors.subTitle}</span>}
            </div>

            <div className="form-field">
                <label htmlFor="thumbnail" className="form-field__label">Thumbnail</label>
                <input type="file" className="form-field__input" name="thumbnail" id="fileInput" onChange={handleChange} />
                {errors.thumbnail && <span className="form-field__error">{errors.thumbnail}</span>}
            </div>

            <div className="form-field">
                <label htmlFor="isPrivate" className="form-field__label">Trạng thái</label>
                <select className="form-field__input">
                    <option value="true">Công khai</option>
                    <option value="false">Riêng tư</option>
                </select>
                {errors.isPrivate && <span className="form-field__error">{errors.isPrivate}</span>}
            </div>

            <div className="form-field">
                <label htmlFor="isPinned" className="form-field__label">Ghim?</label>
                <select className="form-field__input">
                    <option value="true">Có</option>
                    <option value="false">Không</option>
                </select>
                {errors.isPinned && <span className="form-field__error">{errors.isPinned}</span>}
            </div>

            <div className="form-field">
                <label htmlFor="content" className="form-field__label">Content</label>
                <textarea name="content" onChange={handleChange}></textarea>
                {errors.content && <span className="form-field__error">{errors.content}</span>}
            </div>

            {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}

            <div className="form-field">
                <button type="submit" className="form-field__input btn btn-2 btn-md" disabled={isSubmitCreateNewsLoading} onClick={handleSubmit}>
                    {isSubmitCreateNewsLoading ? 'Đang thêm...' : 'Thêm mới'}
                </button>
            </div>

        </div>
    );
}