import { useState, useEffect, useRef } from "react";
import { isFilled } from "../../../utils/validator.js";

export default function UpdateMovement({
    movement,
    setShowUpdateMovementForm,
    setOverlayVisible,
    updateMovementMutation,
}) {
    const [inputs, setInputs] = useState(movement);
    const [errors, setErrors] = useState({});
    const [isSubmitUpdateMovementLoading, setIsSubmitUpdateCommissionServiceLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState(inputs.thumbnail);

    const updateCommissionRef = useRef();
    useEffect(() => {
        const handler = (e) => {
            if (updateCommissionRef.current && !updateCommissionRef.current.contains(e.target)) {
                setShowUpdateMovementForm(false);
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
        setIsSubmitUpdateCommissionServiceLoading(true);

        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitUpdateCommissionServiceLoading(false);
            return;
        }

        try {
            await updateMovementMutation.mutateAsync(inputs);
            alert("Cập nhật trường phái thành công")
        } catch (error) {
            console.error("Failed to update new commission service:", error);
            // setErrors((prevErrors) => ({
            //     ...prevErrors,
            //     serverError: error.response.data.message
            // }));
            errors.serverError = error.response.data.message;
        } finally {
            setIsSubmitUpdateCommissionServiceLoading(false);
        }
    };

    return (
        <div className="update-commission-service modal-form type-3" ref={updateCommissionRef} onClick={(e) => { e.stopPropagation(); }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowUpdateMovementForm(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <h2 className="form__title">Chỉnh sửa dịch vụ</h2>
            <div className="form-field">
                <label htmlFor="title" className="form-field__label">Tên trường phái</label>
                <input
                    id="title"
                    name="title"
                    value={inputs?.title || ''}
                    onChange={handleChange}
                    className="form-field__input"
                    placeholder="Nhập tên trường phái"
                />
                {errors.title && <span className="form-field__error">{errors.title}</span>}
            </div>
            <div className="form-field">
                <label htmlFor="thumbnail" className="form-field__label">Thumbnail</label>
                <input type="file" className="form-field__input" name="thumbnail" id="fileInput" onChange={handleChange} />
                {errors.thumbnail && <span className="form-field__error">{errors.thumbnail}</span>}
            </div>

            <div className="form-field">
                <label htmlFor="thumbnail" className="form-field__label">Preview</label>
                <div className="form-field__input img-preview">
                    <div className="img-preview--left">
                        <img src={thumbnail} alt="Thumbnail" className="img-preview__img" />
                        <div className="img-preview__info">
                            <span className="img-preview__name">{inputs?.title}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-field">
                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
            </div>


            <div className="form-field">
                <button type="submit" className="form-field__input btn btn-2 btn-md" disabled={isSubmitUpdateMovementLoading} onClick={handleSubmit}>
                    {isSubmitUpdateMovementLoading ? 'Đang cập nhật...' : 'Xác nhận'}
                </button>
            </div>

        </div>
    );
}