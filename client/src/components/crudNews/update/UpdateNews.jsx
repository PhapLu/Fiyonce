import { useState, useEffect, useRef } from "react";
import { isFilled } from "../../../utils/validator.js";
import { useQuery } from "react-query";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor, ImageInsert,
    Highlight,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload, SourceEditing, Bold, Essentials, Italic, Mention, Paragraph, Undo, Font
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { apiUtils } from "../../../utils/newRequest.js";

export default function UpdateNews({
    news,
    setShowUpdateNews,
    setOverlayVisible,
    updateNewsMutation,
}) {

    const fetchNewsById = async () => {
        try {
            const response = await apiUtils.get(`/news/readNews/${news._id}`);
            return response.data.metadata.news;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const {
        data: newsData,
        error,
        isError,
        isLoading,
    } = useQuery("fetchNewsById", fetchNewsById);

    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [thumbnail, setThumbnail] = useState(null);
    const updateCommissionRef = useRef();
    const [isSubmitUpdateNewsLoading, setIsSubmitUpdateNewsLoading] = useState();
    const [editorData, setEditorData] = useState("");

    useEffect(() => {
        if (newsData) {
            setInputs(newsData);
            setEditorData(newsData?.content);
            setThumbnail(newsData?.thumbnail || null);
        }
    }, []);

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
        setIsSubmitUpdateNewsLoading(true);

        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitUpdateNewsLoading(false);
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

            const response = await updateNewsMutation.mutateAsync(fd);
            console.log(response);
        
        } catch (error) {
            console.error("Failed to update new news:", error);
            // setErrors((prevErrors) => ({
            //     ...prevErrors,
            //     serverError: error.response.data.message
            // }));
        } finally {
            setIsSubmitUpdateNewsLoading(false);
        }
    };

    return (
        <div className="update-commission-service modal-form type-2" ref={updateCommissionRef} onClick={(e) => { e.stopPropagation(); }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowUpdateNews(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <div className="modal-form--left">
                <h2 className="form__title">Cập nhật tin tức</h2>
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
                    
                    <div className="form-field__input img-preview">
                        <div className="img-preview--left">
                            <img src={thumbnail instanceof File ? URL.createObjectURL(thumbnail) : thumbnail} alt="Artwork 1" className="img-preview__img" />
                            <div className="img-preview__info">
                                <span className="img-preview__name">Preview</span>
                            </div>
                        </div>
                    </div>
                    <input type="file" className="form-field__input" name="thumbnail" id="fileInput" onChange={handleImageChange} />
                    {errors.thumbnail && <span className="form-field__error">{errors.thumbnail}</span>}
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
                                Highlight,
                                ImageStyle,
                                ImageToolbar,
                                ImageUpload, SourceEditing, Bold, Italic, Font, Paragraph],
                            toolbar: {
                                items: [
                                    'sourceEditing', '|', 'bold', 'italic', '|',
                                    'fontSize', 'highlight', 'fontColor', '|'
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
                <button type="submit" className="btn btn-2 btn-md form__submit-btn-item" disabled={isSubmitUpdateNewsLoading} onClick={handleSubmit}>
                    {isSubmitUpdateNewsLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
            </div>


            {/* <div className="preview-section border-text">
                {thumbnail && (
                    <img src={URL.updateObjectURL(thumbnail)} alt="Thumbnail" className="preview-section__thumbnail" />
                )}

                <h2 className='text-align-center'>{inputs?.title}</h2>
                <h4 className='text-align-center'>{inputs?.subTitle}</h4>
                <div dangerouslySetInnerHTML={{ __html: `${inputs?.content || ""}` }}></div>
            </div> */}
        </div>
    );
}