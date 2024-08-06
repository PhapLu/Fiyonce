// Imports
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';

// Components

import CreateNews from '../../components/crudNews/create/CreateNews.jsx';
import UpdateNews from '../../components/crudNews/update/UpdateNews.jsx';
import DeleteNews from '../../components/crudNews/delete/DeleteNews.jsx';


// Contexts
import { useModal } from "../../contexts/modal/ModalContext.jsx";

// Utils
import { apiUtils } from '../../utils/newRequest';

// Styling
import "./NewsDashboard.scss";
import { isFilled } from '../../utils/validator';
import { limitString } from '../../utils/formatter.js';

export default function NewsDashboard() {
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [showCreateNews, setShowCreateNews] = useState(false);
    const [showUpdateNews, setShowUpdateNews] = useState(false);
    const [showDeleteNews, setShowDeleteNews] = useState(false);
    const [news, setNews] = useState(null);

    const queryClient = useQueryClient();
    const [isSubmitCreateNewsLoading, setIsSubmitCreateNewsLoading] = useState(false);
    const { setModalInfo } = useModal();

    const fetchNewss = async () => {
        try {
            const response = await apiUtils.get("/news/readNewss");
            console.log(response);
            return response.data.metadata.newss;
        } catch (error) {
            return null;
        }
    };

    const { data: newss, isError, error, isLoading } = useQuery('fetchNewss', fetchNewss);
    const createNewsMutation = useMutation(
        (newNews) => apiUtils.post("/news/createNews", newNews),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchNewss');
                setOverlayVisible(false);
                setShowCreateNews(false);
                setModalInfo({
                    status: "success",
                    message: "Tạo bản tin thành công"
                })
            }
        }
    );

    const updateNewsMutation = useMutation(
        (updatedNews) => apiUtils.patch(`/news/updateNews/${updatedNews.get("_id")}`, updatedNews),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchNewss');
                setOverlayVisible(false);
                setShowUpdateNews(false);
                setModalInfo({
                    status: "success",
                    message: "Cập nhật bản tin thành công"
                })
            }
        }
    );

    const deleteNewsMutation = useMutation(
        (newsId) => apiUtils.delete(`/news/deleteNews/${newsId}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchNewss');
                setOverlayVisible(false);
                setShowDeleteNews(false);
                setModalInfo({
                    status: "success",
                    message: "Xóa bản tin thành công"
                })
            }
        }
    );


    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <>
            <div className="dashboard-account">
                <section className="section overview">
                    <div className="section-header">
                        <div className="section-header--left">
                            <h3 className="section-header__title">Bản tin</h3>
                            <svg onClick={() => { setOverlayVisible(true); setShowCreateNews(true) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 btn add-btn">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                    </div>

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
                                            <td><span className='fw-bold'>{news.title}</span>
                                                <br />{limitString(news.subTitle, 50)} </td>
                                            <td>{news.views}</td>
                                            <td>{news.updatedAt}</td>
                                            <td>
                                                <button className="btn btn-2" onClick={() => { setNews(news); setOverlayVisible(true); setShowUpdateNews(true) }}>Chỉnh sửa</button>
                                                <button className="btn btn-3" onClick={() => { setNews(news); setOverlayVisible(true); setShowDeleteNews(true) }}>Xóa</button>
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
            {overlayVisible && (
                <div className="overlay">
                    {showCreateNews && <CreateNews news={news} setShowCreateNews={setShowCreateNews} setOverlayVisible={setOverlayVisible} createNewsMutation={createNewsMutation} />}
                    {showUpdateNews && <UpdateNews news={news} setShowUpdateNews={setShowUpdateNews} setOverlayVisible={setOverlayVisible} updateNewsMutation={updateNewsMutation} />}
                    {showDeleteNews && <DeleteNews news={news} setShowDeleteNews={setShowDeleteNews} setOverlayVisible={setOverlayVisible} deleteNewsMutation={deleteNewsMutation} />}
                </div>
            )}

        </>
    );
}