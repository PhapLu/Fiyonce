import { useState, useEffect, useRef } from "react";
import { isFilled } from "../../../utils/validator.js";
import "./CreateNews.scss"

import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor, ImageInsert,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload, SourceEditing, Bold, Essentials, Italic, Mention, Paragraph, Undo, Font
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
export default function CreateNews({
    setShowCreateNews,
    setOverlayVisible,
    createNewsMutation,
}) {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [thumbnail, setThumbnail] = useState(null);
    const createCommissionRef = useRef();
    const [isSubmitCreateNewsLoading, setIsSubmitCreateNewsLoading] = useState();
    const [editorData, setEditorData] = useState('');

    const handleImageChange = (event) => {
        const { name, value, files } = event.target;
        setThumbnail(files[0]);
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        setInputs(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setEditorData(data);
        setInputs(prev => ({ ...prev, content: data }));
        setErrors(prev => ({ ...prev, content: "" }));
    };

    const validateInputs = () => {
        let errors = {};

        if (!isFilled(inputs.title)) {
            errors.title = "Vui lòng nhập tên tiêu đề";
        }

        if (!isFilled(inputs.subTitle)) {
            errors.subTitle = "Vui lòng nhập tên tiêu đề phụ";
        }

        if (!isFilled(inputs.content)) {
            errors.content = "Vui lòng nhập nội dung";
        }

        if (!thumbnail) {
            errors.thumbnail = "Vui lòng chọn thumbnail";
        }

        return errors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitCreateNewsLoading(true);

        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitCreateNewsLoading(false);
            return;
        }

        const fd = new FormData();
        inputs.isPrivate = inputs?.isPrivate === "true" ? true : false;
        inputs.isPinned = inputs?.isPrivate === "true" ? true : false;

        for (const key in inputs) {
            fd.append(key, inputs[key]);
        }
        fd.append('thumbnail', thumbnail);

        try {
            console.log(inputs)
            console.log(thumbnail)

            const response = await createNewsMutation.mutateAsync(fd);
            console.log(response);
            setModalInfo({
                status: "success",
                message: "Thêm bản tin thành công"
            })
        } catch (error) {
            console.error("Failed to create new news:", error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response.data.message
            }));
        } finally {
            setIsSubmitCreateNewsLoading(false);
        }
    };

    return (
        <div className="create-commission-service modal-form type-2" ref={createCommissionRef} onClick={(e) => { e.stopPropagation(); }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowCreateNews(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <div className="modal-form--left">
                <h2 className="form__title">Thêm tin tức</h2>
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
                    <input type="file" className="form-field__input" name="thumbnail" id="fileInput" onChange={handleImageChange} />
                    {errors.thumbnail && <span className="form-field__error">{errors.thumbnail}</span>}
                    {errors.isPinned && <span className="form-field__error">{errors.isPinned}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="isPrivate" className="form-field__label">Riêng tư?</label>
                    <select className="form-field__input" name="isPrivate" value={inputs?.isPrivate || ''} onChange={handleChange}>
                        <option value="false">Riêng tư</option>
                        <option value="true">Công khai</option>
                    </select>
                    {errors.isPrivate && <span className="form-field__error">{errors.isPrivate}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="isPrivate" className="form-field__label">Ghim?</label>
                    <select className="form-field__input" name="isPinned" value={inputs?.isPinned || ''} onChange={handleChange}>
                        <option value="false">Không</option>
                        <option value="true">Có</option>
                    </select>
                    {errors.isPinned && <span className="form-field__error">{errors.isPinned}</span>}
                </div>



            </div>
            <div className="modal-form--right">
                <div className="form-field">
                    <label htmlFor="content" className="form-field__label">Content</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={editorData}
                        onChange={handleEditorChange}
                        config={{
                            plugins: [Essentials, ImageInsert,
                                ImageResize,
                                ImageStyle,
                                ImageToolbar,
                                ImageUpload, SourceEditing, Bold, Italic, Font, Paragraph],
                            toolbar: {
                                items: [
                                    'sourceEditing', '|', 'bold', 'italic', '|',
                                    'fontSize', 'fontFamily', 'fontColor', '|'
                                ]
                            },
                            mention: {
                                // Mention configuration
                            },
                            initialData: '<p>Hello from CKEditor 5 in React!</p>',
                        }}
                    />
                    {/* <textarea name="content" value={inputs?.content || ''} onChange={handleChange} className="form-field__input"></textarea> */}

                    {errors.content && <span className="form-field__error">{errors.content}</span>}
                </div>
            </div>

            {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}

            <div className="form__submit-btn-container">
                <button type="submit" className="btn btn-2 btn-md form__submit-btn-item" disabled={isSubmitCreateNewsLoading} onClick={handleSubmit}>
                    {isSubmitCreateNewsLoading ? 'Đang thêm...' : 'Thêm mới'}
                </button>
            </div>


            {/* <div className="preview-section border-text">
                {thumbnail && (
                    <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail" className="preview-section__thumbnail" />
                )}

                <h2 className='text-align-center'>{inputs?.title}</h2>
                <h4 className='text-align-center'>{inputs?.subTitle}</h4>
                <div dangerouslySetInnerHTML={{ __html: `${inputs?.content || ""}` }}></div>
            </div> */}
        </div>
    );
}