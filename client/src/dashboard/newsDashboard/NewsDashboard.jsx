import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiUtils } from '../../utils/newRequest';

// Styling
import "./NewsDashboard.scss";

export default function NewsDashboard() {
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [showCreateNewsForm, setShowCreateNewsForm] = useState(false);
    const [showUpdateNewsForm, setShowUpdateNewsForm] = useState(false);
    const [showDeleteNewsForm, setShowDeleteNewsForm] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [thumbnail, setThumbnail] = useState(null);

    const queryClient = useQueryClient();

    const fetchNewss = async () => {
        try {
            const response = await apiUtils.get("/news/readNewss");
            return response.data.metadata.newss;
        } catch (error) {
            return null;
        }
    };

    const { data: newss, isError, error, isLoading } = useQuery('newss', fetchNewss);

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name === 'thumbnail') {
            setThumbnail(URL.createObjectURL(files[0]));
        }
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        // Implement form submission logic
    };

    const handleUpdateNews = (news) => {
        // Implement update logic
    };

    const handleDeleteNews = (news) => {
        // Implement delete logic
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <>
            <div className="dashboard-account">
                <section className="section overview">
                    <div className="section-header">
                        <div className="section-header--left">
                            <h3 className="section-header__title">Bản tin</h3>
                            <svg onClick={() => { setShowCreateNewsForm(true) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 btn add-btn">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                    </div>

                    {true && (
                        <div className="news-form-container mb-32">
                            <div className="form-section">
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
                                    <div className="form-field half-split">
                                        <select className="form-field__input" name="isPrivate" value={inputs?.isPrivate || ''} onChange={handleChange} className="form-field__input">
                                            <option value="true">Công khai</option>
                                            <option value="false">Riêng tư</option>
                                        </select>

                                        <select className="form-field__input" name="isPinned" value={inputs?.isPinned || ''} onChange={handleChange} className="form-field__input">
                                            <option value="true">Có</option>
                                            <option value="false">Không</option>
                                        </select>
                                        {errors.isPrivate && <span className="form-field__error">{errors.isPrivate}</span>}
                                        {errors.isPinned && <span className="form-field__error">{errors.isPinned}</span>}
                                    </div>

                                </div>

                                <div className="form-field">
                                    <label htmlFor="thumbnail" className="form-field__label">Thumbnail</label>
                                    <input type="file" className="form-field__input" name="thumbnail" id="fileInput" onChange={handleChange} />
                                    {errors.thumbnail && <span className="form-field__error">{errors.thumbnail}</span>}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="content" className="form-field__label">Content</label>
                                    <textarea name="content" value={inputs?.content || ''} onChange={handleChange} className="form-field__input"></textarea>
                                    {errors.content && <span className="form-field__error">{errors.content}</span>}
                                </div>

                                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}

                                <div className="form-field">
                                    <button type="submit" className="form-field__input btn btn-2 btn-md" disabled={isLoading} onClick={handleSubmit}>
                                        {isLoading ? 'Đang thêm...' : 'Thêm mới'}
                                    </button>
                                </div>
                            </div>

                            <div className="preview-section">
                                <h2 className="form__title">Preview</h2>
                                {thumbnail && (
                                    <img src={thumbnail} alt="Thumbnail" className="preview-section__thumbnail" />
                                )}

                            <h2 className='text-align-center'>{inputs?.title}</h2>
                            <h4 className='text-align-center'>{inputs?.subTitle}</h4>
                            <div contentEditable='true' dangerouslySetInnerHTML={{ __html: `${inputs?.content}` }}></div>
                        </div>
                        </div>
                    )}


            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>STT</th>
                        <th>Tiêu đề</th>
                        <th>Lượt xem</th>
                        <th>Cập nhật lúc</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        newss?.length > 0 ? (
                            newss.map((news, index) => (
                                <tr key={news._id}>
                                    <td><img src={news.thumbnail} alt="" /></td>
                                    <td>{index + 1}</td>
                                    <td>{news.title} | {news.subTitle} </td>
                                    <td>{news.views}</td>
                                    <td>{news.updatedAt}</td>
                                    <td>
                                        <button className="btn btn-2" onClick={() => handleUpdateNews(news)}>Chỉnh sửa</button>
                                        <button className="btn btn-3" onClick={() => handleDeleteNews(news)}>Xóa</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">Không có dữ liệu</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </section >

            </div >
        </>
    );
}