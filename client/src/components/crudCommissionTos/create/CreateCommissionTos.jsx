// Imports
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import 'quill-emoji/dist/quill-emoji.css'; // import emoji styles
import { Quill } from 'react-quill';
import 'quill-emoji';

// Resouces
import { useModal } from "../../../contexts/modal/ModalContext";

// Utils
import { formatCurrency, limitString, formatFloat, bytesToKilobytes, formatNumber } from "../../../utils/formatter.js";
import { isFilled } from "../../../utils/validator.js";

// Styling
import "./CreateCommissionTos.scss";
import { apiUtils } from "../../../utils/newRequest.js";
import Emoji from "quill-emoji";

Quill.register('modules/emoji', Emoji);

const modules = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['emoji'], // add emoji button to toolbar
    ],
    'emoji-toolbar': true,
    'emoji-shortname': true,
    keyboard: {
        bindings: {
            bold: {
                key: 'B',
                shortKey: true,
                handler: function (range, context) {
                    this.quill.format('bold', !context.format.bold);
                }
            },
            italic: {
                key: 'I',
                shortKey: true,
                handler: function (range, context) {
                    this.quill.format('italic', !context.format.italic);
                }
            },
            underline: {
                key: 'U',
                shortKey: true,
                handler: function (range, context) {
                    this.quill.format('underline', !context.format.underline);
                }
            },
            strike: {
                key: 'S',
                shortKey: true,
                handler: function (range, context) {
                    this.quill.format('strike', !context.format.strike);
                }
            }
        }
    }
};

export default function CreateCommissionTos({ setShowCreateCommissionTosForm, setOverlayVisible }) {
    // Initialize variables for inputs, errors, loading effect
    const [inputs, setInputs] = useState({
        content: `<h3>Điều khoản chung</h3>...
        <h3>Điều khoản thanh toán</h3>...
        <h3>Điều khoản sử dụng</h3>...
        <h3>Thời hạn và vận chuyển</h3>...
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
        // return () => clearInterval(intervalId);
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

    const handleChange = (value, delta, source, editor) => {
        setInputs((prevState) => ({
            ...prevState,
            content: editor.getHTML()
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Initialize loading effect for the submit button
        setIsSubmitCreateCommissionTosLoading(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Clear the loading effect if validation failed
            setIsSubmitCreateCommissionTosLoading(false);
            return;
        }

        // Handle submit request
        try {
            const response = await apiUtils.post("/termOfService/createTermOfService", inputs);
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Thêm điều khoản dịch vụ thành công"
                })
            }
        } catch (error) {
            setModalInfo({
                status: "success",
                message: error.response.data.message
            })
        } finally {
            // Clear the loading effect
            setIsSubmitCreateCommissionTosLoading(false);
        }
        setShowCreateCommissionTosForm(false);
        setOverlayVisible(false);
    };

    return (
        <div className="create-commission-tos modal-form type-2" ref={createCommissionRef} onClick={(e) => { e.stopPropagation() }}>
            <Link to="/help_center" className="form__help" target="_blank">
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
                        Điều khoản dịch vụ giúp bạn bảo vệ quyền lợi pháp lí của mình khi thực hiện công việc trên Pastal, đồng thời thể hiện sự chuyên nghiệp và cam kết giữa dịch vụ của bạn và khách hàng.
                    </p>
                </div>
            </div>

            <div className="modal-form--right">
                <h2 className="form__title">Thêm điều khoản dịch vụ</h2>
                <>
                    <div className="form-field">
                        <label htmlFor="title" className="form-field__label">Tên điều khoản</label>
                        <span className="form-field__annotation">Đặt tên cho điều khoản để tiện ghi nhớ và sử dụng</span>
                        <input id="title" name="title" className="form-field__input" type="text" placeholder="Nhập tên điều khoản" onChange={handleInputChange} />
                        {errors.title && <span className="form-field__error">{errors.title}</span>}
                    </div>
                    <div className="form-field">
                        <label htmlFor="content" className="form-field__label">Nội dung</label>
                        <span name="content" className="form-field__annotation">Thêm nội dung chi tiết điều khoản dịch vụ của bạn</span>
                        <ReactQuill theme="snow" value={inputs.content} onChange={handleChange} modules={modules} placeholder="Nhập nội dung điều khoản của bạn" />
                        {errors.content && <span className="form-field__error">{errors.content}</span>}
                    </div>
                    <div class="form-field">
                        <label class="form-field__label">
                            <input type="checkbox" name="isAgreeTerms" checked={inputs.isAgreeTerms || false}
                                onChange={handleInputChange} />
                            <span>Tôi đồng ý với các <a class="highlight-text" href="/terms_and_policies"> điều khoản dịch vụ </a> của Pastal</span>
                        </label>
                        {errors.isAgreeTerms && <span className="form-field__error">{errors.isAgreeTerms}</span>}
                    </div>
                    <div className="form__button">
                        <button type="submit" className={`form-field__input btn btn-2 btn-md ${isSubmitCreateCommissionTosLoading ? 'loading' : ''}`} onClick={handleSubmit}>
                            {isSubmitCreateCommissionTosLoading ? 'Đang xử lí...' : 'Xác nhận'}
                        </button>
                        {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
                    </div>
                </>
            </div>
        </div>
    );
}
