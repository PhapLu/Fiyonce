import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor, ImageInsert,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload, SourceEditing, Bold, Essentials, Italic, Mention, Paragraph, Undo, Font
} from 'ckeditor5';
import { useModal } from "../../../contexts/modal/ModalContext";

// Utils
import { formatCurrency, limitString, formatFloat, bytesToKilobytes, formatNumber } from "../../../utils/formatter.js";
import { isFilled } from "../../../utils/validator.js";

// Styling
import "./UpdateCommissionTos.scss";
import { apiUtils } from "../../../utils/newRequest.js";

export default function UpdateCommissionTos({ setShowUpdateCommissionTosForm, setShowCommissionTosView, setOverlayVisible, commissionTos }) {
    // Initialize variables for inputs, errors, loading effect
    const [inputs, setInputs] = useState(commissionTos);
    const [errors, setErrors] = useState({});
    const [isSubmitUpdateCommissionTosLoading, setIsSubmitUpdateCommissionTosLoading] = useState(false);
    const [isSuccessUpdateCommissionTos, setIsSuccessUpdateCommissionTos] = useState(false);
    const { setModalInfo } = useModal();

    const [currentTime, setCurrentTime] = useState(new Date());

    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(intervalId);
    }, []);

    // Toggle display overlay box
    const updateCommissionRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (updateCommissionRef && updateCommissionRef.current && !updateCommissionRef.current.contains(e.target)) {
                setShowUpdateCommissionTosForm(false);
                setShowCommissionTosView(false);
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

        // Validate title
        if (!isFilled(inputs?.title)) {
            errors.title = 'Vui lòng nhập tên dịch vụ';
        }

        // Validate content
        if (!isFilled(inputs?.content)) {
            errors.content = 'Vui lòng điền nội dung điều khoản dịch vụ';
        }

        // Validate if user has agreed to platform terms & policies
        if (!inputs?.isAgreeTerms) {
            errors.isAgreeTerms = 'Vui lòng xác nhận đồng ý';
        }
        console.log(inputs);
        console.log(errors);

        return errors;
    };

    const handleInputChange = (e) => {
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
        } else {
            setInputs(prevState => ({
                ...prevState,
                [name]: value
            }));
        }

        // Update input value & clear error
        setErrors((values) => ({ ...values, [name]: '' }));
    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setInputs((prevState) => ({
            ...prevState,
            content: data
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Initialize loading effect for the submit button
        setIsSubmitUpdateCommissionTosLoading(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Clear the loading effect if validation failed
            setIsSubmitUpdateCommissionTosLoading(false);
            return;
        }

        // Handle submit request
        try {
            const response = await apiUtils.patch(`/termOfService/updateTermOfService/${inputs._id}`, inputs);
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Cập nhật điều khoản dịch vụ thành công"
                })
                setShowUpdateCommissionTosForm(false);
                setShowCommissionTosView(false);
                setOverlayVisible(false);
            }
        } catch (error) {
            setModalInfo({
                status: "error",
                message: error.response.data.message
            })
        } finally {
            // Clear the loading effect
            setIsSubmitUpdateCommissionTosLoading(false);
        }
    };

    return (
        <div className="update-commission-tos modal-form type-2" ref={updateCommissionRef} onClick={(e) => { e.stopPropagation() }}>
            <Link to="/help-center" className="form__help" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__help-ic">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg> Trợ giúp
            </Link>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowUpdateCommissionTosForm(false);
                setShowCommissionTosView(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <div className="modal-form--left">
                <h3>{inputs?.title || "Tên điều khoản dịch vụ"}</h3>
                <span>Cập nhật vào lúc {formatTime(currentTime)}</span>
                <hr />
                <div className="form__note">

                    <p><strong>*Lưu ý:</strong>
                        <br />
                        Điều khoản dịch vụ giúp bạn bảo vệ quyền lợi pháp lí của mình khi thực hiện công việc trên Pastal, đồng thời thể hiện sự chuyên nghiệp và cam kết giữa dịch vụ của bạn và khách hàng.
                    </p>
                </div>
            </div>

            <div className="modal-form--right">
                <h2 className="form__title">Chỉnh sửa điều khoản dịch vụ</h2>
                {!isSuccessUpdateCommissionTos ?
                    (
                        <>
                            <div className="form-field">
                                <label htmlFor="title" className="form-field__label">Tên điều khoản</label>
                                <span className="form-field__annotation">Đặt tên cho điều khoản để tiện ghi nhớ và sử dụng</span>
                                <input id="title" name="title" value={inputs?.title || ""} className="form-field__input" type="text" placeholder="Nhập tên điều khoản" onChange={handleInputChange} />
                                {errors.title && <span className="form-field__error">{errors.title}</span>}
                            </div>
                            <div className="form-field">
                                <label htmlFor="content" className="form-field__label">Nội dung</label>
                                <span name="content" className="form-field__annotation">Điền nội dung chi tiết điều khoản dịch vụ của bạn</span>
                                {/* <CKEditor
                                    editor={ClassicEditor}
                                    data={inputs?.content}
                                    onChange={handleEditorChange}
                                    config={{
                                        toolbar: ['bold', 'italic', 'underline', 'bulletedList', 'numberedList', 'emoji'],
                                        emoji: { toolbar: true, shortname: true }
                                    }}
                                /> */}
                                {errors.content && <span className="form-field__error">{errors.content}</span>}
                            </div>
                            <div className="form-field">
                                <label className="form-field__label">
                                    <input type="checkbox" name="isAgreeTerms" checked={inputs?.isAgreeTerms || false}
                                        onChange={handleInputChange} />
                                    <span>Tôi đồng ý với các <a className="highlight-text" href="/terms_and_policies"> điều khoản dịch vụ </a> của Pastal</span>
                                </label>
                                {errors.isAgreeTerms && <span className="form-field__error">{errors.isAgreeTerms}</span>}
                            </div>
                            <div className="form-field">
                                <button type="submit" className={`form-field__input btn btn-2 btn-md ${isSubmitUpdateCommissionTosLoading ? 'loading' : ''}`} onClick={handleSubmit}>
                                    {isSubmitUpdateCommissionTosLoading ? 'Đang xử lí...' : 'Xác nhận'}
                                </button>
                                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
                            </div>
                        </>
                    ) : (
                        <div className="form__success">
                            <h3>Điều khoản dịch vụ của bạn đã được tạo!</h3>
                            <p>Bạn có thể xem lại điều khoản dịch vụ của mình trong danh sách điều khoản dịch vụ.</p>
                            <button className="button button__primary" onClick={() => {
                                setShowUpdateCommissionTosForm(false);
                                setShowCommissionTosView(false);
                                setOverlayVisible(false);
                            }}>Đóng</button>
                        </div>
                    )}
            </div>
        </div>
    );
}