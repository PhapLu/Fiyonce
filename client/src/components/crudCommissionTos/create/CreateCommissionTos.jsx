import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor, ImageInsert,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload, SourceEditing, Bold, Essentials, Italic, Mention, Paragraph, Undo, Font
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useMutation, useQueryClient } from "react-query";

// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useModal } from "../../../contexts/modal/ModalContext";
import { LazyLoadImage } from 'react-lazy-load-image-component';

// Utils
import { isFilled } from "../../../utils/validator.js";

// Styling
import "./CreateCommissionTos.scss";
import { apiUtils } from "../../../utils/newRequest.js";

export default function CreateCommissionTos({ setShowCreateCommissionTosForm, setOverlayVisible }) {
    const queryClient = useQueryClient(); // Access the query client

    const createMutation = useMutation(
        async (newData) => {
            return await apiUtils.post("/termOfService/createTermOfService", newData);
        },
        {
            onSuccess: () => {
                // Invalidate the 'termsOfServices' query to refetch the updated list
                queryClient.invalidateQueries(['termsOfServices']);

                // Close the modal and show success message
                setModalInfo({
                    status: "success",
                    message: "Thêm điều khoản dịch vụ thành công"
                });

                setShowCreateCommissionTosForm(false);
                setOverlayVisible(false);
            },
            onError: (error) => {
                setModalInfo({
                    status: "error",
                    message: error.response.data.message
                });
            }
        }
    );

    // Initialize variables for inputs, errors, loading effect
    const [inputs, setInputs] = useState({
        content: `<p>
        <strong>1. Điều khoản chung:</strong>
    </p>
    <p>
        ...
    </p>
    <p>
        <strong>2. Điều khoản thanh toán:</strong>
    </p>
    <p>
        ...
    </p>
    <p>
        <strong>3. Điều khoản sử dụng:</strong>
    </p>
    <p>
        ...
    </p>
    <p>
        <strong>4. Thời hạn và vận chuyển:</strong>
    </p>
    <p>
        ...
    </p>
        `
    });
    const [errors, setErrors] = useState({});
    const [isSubmitCreateCommissionTosLoading, setIsSubmitCreateCommissionTosLoading] = useState(false);
    const [isSuccessCreateCommissionTos, setIsSuccessCreateCommissionTos] = useState(false);

    const [currentTime, setCurrentTime] = useState(new Date());
    const { setModalInfo } = useModal();

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
    const createCommissionRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (createCommissionRef && createCommissionRef.current && !createCommissionRef.current.contains(e.target)) {
                setShowCreateCommissionTosForm(false);
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
        if (!isFilled(inputs.title)) {
            errors.title = 'Vui lòng nhập tên dịch vụ';
        }

        // Validate content
        if (!isFilled(inputs.content)) {
            errors.content = 'Vui lòng điền nội dung điều khoản dịch vụ';
        }

        // Validate if user has agreed to platform terms & policies
        if (!inputs.isAgreeTerms) {
            errors.isAgreeTerms = 'Vui lòng xác nhận đồng ý';
        }

        return errors;
    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setInputs((prevState) => ({
            ...prevState,
            content: data
        }));
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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Initialize loading effect for the submit button
        setIsSubmitCreateCommissionTosLoading(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);

            if (validationErrors.title) {
                titleRef.current.scrollIntoView({ behavior: 'smooth' });
            } else if (validationErrors.content) {
                contentRef.current.scrollIntoView({ behavior: 'smooth' });
            } else if (validationErrors.isAgreeTerms) {
                isAgreeTermsRef.current.scrollIntoView({ behavior: 'smooth' });
            }

            setIsSubmitCreateCommissionTosLoading(false);
            return;
        }

        // Trigger the mutation to create new TOS
        createMutation.mutate(inputs);
    };


    const titleRef = useRef(null);
    const contentRef = useRef(null);
    const isAgreeTermsRef = useRef(null);


    return (
        <div className="create-commission-tos modal-form type-2" ref={createCommissionRef} onClick={(e) => { e.stopPropagation() }}>
            <Link to="/help-center" className="form__help" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__help-ic">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg> Trợ giúp
            </Link>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowCreateCommissionTosForm(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <div className="modal-form--left">
                <h3>{inputs.title || "Tên điều khoản dịch vụ"}</h3>
                <span>Cập nhật vào lúc {formatTime(currentTime)}</span>
                <hr />
                <br />
                <br />

                <div className="form__note">

                    <p><strong>*Lưu ý:</strong>
                        <br />
                        Điều khoản dịch vụ thể hiện sự chuyên nghiệp của dịch vụ, đồng thời giúp bạn bảo vệ quyền lợi pháp lí của mình khi làm việc trên Pastal.
                    </p>
                </div>
            </div>

            <div className="modal-form--right">
                <h2 className="form__title">Thêm điều khoản dịch vụ</h2>
                <>
                    <div className="form-field">
                        <label htmlFor="title" className="form-field__label">Tên điều khoản</label>
                        <span className="form-field__annotation">Đặt tên cho điều khoản để tiện ghi nhớ và sử dụng</span>
                        <input ref={titleRef} id="title" name="title" className="form-field__input" type="text" placeholder="Nhập tên điều khoản" onChange={handleInputChange} />
                        {errors.title && <span className="form-field__error">{errors.title}</span>}
                    </div>
                    <div className="form-field">
                        <label htmlFor="content" className="form-field__label">Nội dung</label>
                        <span name="content" className="form-field__annotation">Thêm nội dung chi tiết điều khoản dịch vụ của bạn</span>
                        <CKEditor
                            ref={contentRef}
                            editor={ClassicEditor}
                            data={inputs?.content}
                            onChange={handleEditorChange}
                            config={{
                                plugins: [Essentials, ImageInsert,
                                    ImageResize,
                                    ImageStyle,
                                    ImageToolbar,
                                    ImageUpload, SourceEditing, Bold, Italic, Font, Paragraph],
                                toolbar: {
                                    items: [
                                        'bold', 'italic', '|',
                                        'fontSize', 'fontFamily', 'fontColor', '|'
                                    ]
                                },
                                mention: {
                                    // Mention configuration
                                },
                            }}
                        />
                        {errors.content && <span className="form-field__error">{errors.content}</span>}
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">
                            <input type="checkbox" ref={isAgreeTermsRef} name="isAgreeTerms" checked={inputs.isAgreeTerms || false}
                                onChange={handleInputChange} />
                            <span>Tôi đồng ý với các <a className="highlight-text" href="/terms_and_policies"> điều khoản dịch vụ </a> của Pastal</span>
                        </label>
                        {errors.isAgreeTerms && <span className="form-field__error">{errors.isAgreeTerms}</span>}
                    </div>
                    <div className="form__submit-btn-container">
                        <button type="submit" className={`form__submit-btn-tem btn btn-2 btn-md ${isSubmitCreateCommissionTosLoading ? 'loading' : ''}`} onClick={handleSubmit}>
                            {isSubmitCreateCommissionTosLoading ? 'Đang xử lí...' : 'Xác nhận'}
                        </button>
                        {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
                    </div>
                </>
            </div>
        </div>
    );
}