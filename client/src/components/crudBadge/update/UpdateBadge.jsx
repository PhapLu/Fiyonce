import { useState, useEffect, useRef } from "react";
import { isFilled } from "../../../utils/validator.js";
import "./UpdateBadge.scss"

export default function UpdateBadge({
    setShowUpdateBadge,
    setOverlayVisible,
    updateBadgeMutation,
}) {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [icon, setThumbnail] = useState(null);
    const updateCommissionRef = useRef();
    const [isSubmitUpdateBadgeLoading, setIsSubmitUpdateBadgeLoading] = useState(false);
    const [editorData, setEditorData] = useState('');

    const handleImageChange = (event) => {
        const { name, files } = event.target;
        setThumbnail(files[0]);
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validateInputs = () => {
        let errors = {};

        if (!isFilled(inputs.title)) {
            errors.title = "Vui lòng nhập tên tiêu đề";
        }

        if (!isFilled(inputs.description)) {
            errors.description = "Vui lòng nhập mô tả";
        }

        if (!isFilled(inputs.type)) {
            errors.type = "Vui lòng chọn thể loại";
        }

        if (!isFilled(inputs.level)) {
            errors.level = "Vui lòng chọn độ khó";
        }

        if (!icon) {
            errors.icon = "Vui lòng chọn một icon";
        }

        if (!isFilled(inputs.criteria)) {
            errors.criteria = "Vui lòng nhập criteria";
        } else {
            try {
                JSON.parse(inputs.criteria);
            } catch (e) {
                errors.criteria = "Criteria phải là một JSON hợp lệ";
            }
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitUpdateBadgeLoading(true);

        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitUpdateBadgeLoading(false);
            return;
        }

        const fd = new FormData();
        inputs.isPrivate = inputs?.isPrivate === "true" ? true : false;
        inputs.isPinned = inputs?.isPrivate === "true" ? true : false;

        for (const key in inputs) {
            fd.append(key, inputs[key]);
        }
        fd.append('file', icon);

        try {
            console.log(inputs)
            console.log(icon)

            const response = await updateBadgeMutation.mutateAsync(fd);
            console.log(response);
            setModalInfo({
                status: "success",
                message: "Thêm huy hiệu thành công"
            });
        } catch (error) {
            console.error("Failed to update new badge:", error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response.data.message
            }));
        } finally {
            setIsSubmitUpdateBadgeLoading(false);
        }
    };

    return (
        <div className="update-commission-service modal-form type-3" ref={updateCommissionRef} onClick={(e) => { e.stopPropagation(); }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowUpdateBadge(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <h2 className="form__title">Thêm huy hiệu</h2>
            <div className="form-field required">
                <label htmlFor="title" className="form-field__label">Tên huy hiệu</label>
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

            <div className="form-field required">
                <label htmlFor="description" className="form-field__label">Mô tả</label>
                <input
                    id="description"
                    name="description"
                    value={inputs?.description || ''}
                    onChange={handleChange}
                    className="form-field__input"
                    placeholder="Nhập mô tả"
                />
                {errors.description && <span className="form-field__error">{errors.description}</span>}
            </div>

            <div className="form-field required">
                <label htmlFor="icon" className="form-field__label">Icon</label>
                <input type="file" className="form-field__input" name="icon" id="fileInput" onChange={handleImageChange} />
                {errors.icon && <span className="form-field__error">{errors.icon}</span>}
            </div>

            <div className="form-field required">
                <label htmlFor="criteria" className="form-field__label">Tiêu chí</label>
                <input
                    id="criteria"
                    name="criteria"
                    value={inputs?.criteria || ''}
                    onChange={handleChange}
                    className="form-field__input"
                    placeholder='{"updatePost":1,"updateService":1}'
                />
                {errors.criteria && <span className="form-field__error">{errors.criteria}</span>}
            </div>

            <div className="form-field required">
                <label htmlFor="type" className="form-field__label">Type</label>
                <select name="type" onChange={handleChange}>
                    <option value="platform_contributor">Platform Contributor</option>
                    <option value="challenge_participation">Challenge Participation</option>
                    <option value="sale_achievement">Sale Achievement</option>
                    <option value="other">Other</option>
                </select>
                {errors.type && <span className="form-field__error">{errors.type}</span>}
            </div>

            <div className="form-field required">
                <label htmlFor="level" className="form-field__label">Level</label>
                <select name="level" onChange={handleChange}>
                    <option value="hard">Hard</option>
                    <option value="medium">Medium</option>
                    <option value="easy">Easy</option>
                </select>
                {errors.level && <span className="form-field__error">{errors.level}</span>}
                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
            </div>


            <div className="form__submit-btn-container">
                <button type="submit" className="btn btn-2 btn-md form__submit-btn-item" disabled={isSubmitUpdateBadgeLoading} onClick={handleSubmit}>
                    {isSubmitUpdateBadgeLoading ? 'Đang thêm...' : 'Thêm mới'}
                </button>
            </div>
        </div>
    );
}
