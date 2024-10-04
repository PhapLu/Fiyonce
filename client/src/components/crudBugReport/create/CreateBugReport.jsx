// Imports
import { useState, useEffect, useRef } from "react";

// Utils
import { bytesToKilobytes, formatFloat, limitString } from "../../../utils/formatter";
import { apiUtils, createFormData } from "../../../utils/newRequest";

// Styling
import "./CreateBugReport.scss";
import { useModal } from "../../../contexts/modal/ModalContext";

export default function CreateBugReport({ setShowCreateBugReport, setOverlayVisible }) {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [files, setFiles] = useState([])
    const [isSubmitOrderCommissionLoading, setIsSubmitCreateBugReportLoading] = useState(false);

    const { setModalInfo } = useModal();
    const triggerFileInput = () => { document.getElementById('file-input').click(); };

    const createBugReportRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (createBugReportRef && createBugReportRef.current && !createBugReportRef.current.contains(e.target)) {
                setShowCreateBugReport(false);
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

        if (!inputs.description) {
            errors.description = 'Vui lòng nhập mô tả';
        }

        if (files.length > 10) {
            errors.files = "Vui lòng cung cấp tối đa 10 ảnh đính kèm.";
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
        const selectedFiles = Array.from(e.target.files);
        const newFiles = [...files];

        selectedFiles.forEach((file) => {
            if (file.size > 2 * 1024 * 1024) {
                setErrors((values) => ({ ...values, files: "Dung lượng ảnh không được vượt quá 2MB." }));
            } else if (newFiles.length + selectedFiles.length <= 10) {
                newFiles.push(file);
                setErrors((values) => ({ ...values, files: "" }));
            } else {
                setErrors((values) => ({ ...values, files: "Bạn có thể chọn tối đa 10 ảnh đính kèm." }));
            }
        });

        setFiles(newFiles);
    };



    const removeImage = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Initialize loading effect for the submit button
        setIsSubmitCreateBugReportLoading(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitCreateBugReportLoading(false);
            return;
        }


        const fd = createFormData(inputs, "files", files)

        try {
            const response = await apiUtils.post("/bugReport/createBugReport", fd);
            console.log(response);

            setModalInfo({
                status: "success",
                message: "Báo cáo sự cố thành công"
            })
        } catch (error) {
            console.log(error);
            setModalInfo({
                status: "error",
                message: error.response.data.message
            })
        } finally {
            setIsSubmitCreateBugReportLoading(false);
        }
    }


    return (
        <div className="create-bug-report modal-form type-3" ref={createBugReportRef}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowCreateBugReport(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h2 className="form__title">Báo cáo lỗi hệ thống</h2>
            <p></p>
            <div className="form-field required">
                <label htmlFor="description" className="form-field__label">Mô tả</label>
                <textarea name="description" value={inputs?.description} className="form-field__input" onChange={handleChange} placeholder="Mô tả sự cố mà bạn gặp phải"></textarea>
                {errors.description && <span className="form-field__error">{errors.description}</span>}
            </div>
            <div className="form-field">
                <label className="form-field__label">Đính kèm</label>
                <span className="form-field__annotation">Bạn có thể đính kèm một số ảnh để Pastal Team hình dung và khắc phục sự cố tốt hơn nhé (Không bắt buộc).</span>
                {files?.map((file, index) => (
                    <div key={index} className="form-field__input img-preview">
                        <div className="img-preview--left">
                            <img src={URL.createObjectURL(file)} alt={`file ${index + 1}`} className="img-preview__img" />
                            <div className="img-preview__info">
                                <span className="img-preview__name">{limitString(file.name, 15)}</span>
                                <span className="img-preview__size">{formatFloat(bytesToKilobytes(file.size), 1)} KB</span>
                            </div>
                        </div>
                        <div className="img-preview--right">
                            <svg onClick={() => removeImage(index)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 img-preview__close-ic">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                ))}

                <div className="form-field with-ic btn add-link-btn" onClick={triggerFileInput}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic add-link-btn__ic">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Thêm ảnh</span>

                    <input type="file" id="file-input" style={{ display: "none" }} multiple accept="image/*" onChange={handleImageChange} className="form-field__input" />
                </div>

                {errors.files && <span className="form-field__error">{errors.files}</span>}
            </div>

            <div className="form-field" onClick={handleSubmit}>
                <button type="submit"
                    className="form-field__input btn btn-2 btn-md"
                    onClick={handleSubmit}
                    disabled={isSubmitOrderCommissionLoading}>
                    {isSubmitOrderCommissionLoading ? (
                        <span className="btn-spinner"></span>
                    ) : (
                        "Xác nhận"
                    )}
                </button>
            </div>
        </div>
    )
}