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
import CreateHelpTopic from '../../help/topic/create/CreateHelpTopic.jsx';
import CreateHelpArticle from '../../help/article/create/CreateHelpArticle.jsx';
import UpdateHelpTopic from '../../help/topic/update/UpdateHelpTopic.jsx';
import DeleteHelpTopic from '../../help/topic/delete/DeleteHelpTopic.jsx';
import UpdateHelpArticle from '../../help/article/update/UpdateHelpArticle.jsx';
import DeleteHelpArticle from '../../help/article/delete/DeleteHelpArticle.jsx';

export default function NewsDashboard() {
    const [overlayVisible, setOverlayVisible] = useState(false);

    // News
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

    const { data: newss, isFetchingNewssError, fetchingNewsError, isFetchingNewssLoading } = useQuery('fetchNewss', fetchNewss);
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


    // Help topics
    const [showCreateHelpTopic, setShowCreateHelpTopic] = useState(false);
    const [showUpdateHelpTopic, setShowUpdateHelpTopic] = useState(false);
    const [showDeleteHelpTopic, setShowDeleteHelpTopic] = useState(false);
    const [helpTopic, setHelpTopic] = useState(null);

    const fetchHelpTopics = async () => {
        try {
            const response = await apiUtils.get("/help/readHelpTopics");
            console.log(response);
            return response.data.metadata.helpTopics;
        } catch (error) {
            return null;
        }
    };

    const { data: helpTopics, isFetchingHelpTopicsError, fetchingTopicErrors, isFetchingHelpTopicsLoading } = useQuery('fetchHelpTopics', fetchHelpTopics);
    const createHelpTopicMutation = useMutation(
        (newHelpTopic) => apiUtils.post("/help/createHelpTopic", newHelpTopic),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchHelpTopics');
                queryClient.invalidateQueries('fetchHelpArticles');
                setOverlayVisible(false);
                setShowCreateHelpTopic(false);
                setModalInfo({
                    status: "success",
                    message: "Tạo topic thành công"
                })
            }
        }
    );

    const updateHelpTopicMutation = useMutation(
        (updatedHelpTopic) => apiUtils.patch(`/help/updateHelpTopic/${updatedHelpTopic._id}`, updatedHelpTopic),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchHelpTopics');
                queryClient.invalidateQueries('fetchHelpArticles');
                setOverlayVisible(false);
                setShowUpdateHelpTopic(false);
                setModalInfo({
                    status: "success",
                    message: "Cập nhật topic thành công"
                })
            }
        }
    );

    const deleteHelpTopicMutation = useMutation(
        (newsId) => apiUtils.delete(`/help/deleteHelpTopic/${newsId}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchHelpTopics');
                queryClient.invalidateQueries('fetchHelpArticles');
                setOverlayVisible(false);
                setShowDeleteHelpTopic(false);
                setModalInfo({
                    status: "success",
                    message: "Xóa topic thành công"
                })
            }
        }
    );


    // Help articles
    const [showCreateHelpArticle, setShowCreateHelpArticle] = useState(false);
    const [showUpdateHelpArticle, setShowUpdateHelpArticle] = useState(false);
    const [showDeleteHelpArticle, setShowDeleteHelpArticle] = useState(false);
    const [helpArticle, setHelpArticle] = useState(null);

    const fetchHelpArticles = async () => {
        try {
            const response = await apiUtils.get("/help/readHelpArticles");
            console.log(response);
            return response.data.metadata.helpArticles;
        } catch (error) {
            return null;
        }
    };

    const { data: helpArticles, isFetchingHelpArticlesError, fetchingHelpArticlesErrors, isFetchingHelpArticlesLoading } = useQuery('fetchHelpArticles', fetchHelpArticles);
    const createHelpArticleMutation = useMutation(
        (newHelpArticle) => apiUtils.post("/help/createHelpArticle", newHelpArticle),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchHelpArticles');
                setOverlayVisible(false);
                setShowCreateHelpArticle(false);
                setModalInfo({
                    status: "success",
                    message: "Tạo bài viết thành công"
                })
            }
        }
    );

    const updateHelpArticleMutation = useMutation(
        (updatedHelpArticle) => apiUtils.patch(`/help/updateHelpArticle/${updatedHelpArticle._id}`, updatedHelpArticle),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchHelpArticles');
                setOverlayVisible(false);
                setShowUpdateHelpArticle(false);
                setModalInfo({
                    status: "success",
                    message: "Cập nhật bài viết thành công"
                })
            }
        }
    );

    const deleteHelpArticleMutation = useMutation(
        (helpArticleId) => apiUtils.delete(`/help/deleteHelpArticle/${helpArticleId}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchHelpArticles');
                setOverlayVisible(false);
                setShowDeleteHelpArticle(false);
                setModalInfo({
                    status: "success",
                    message: "Xóa bài viết thành công"
                })
            }
        }
    );

    if (isFetchingNewssLoading) return <div>Loading...</div>;
    if (isFetchingNewssError) return <div>Error: {error.message}</div>;

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


                <section className="section overview">
                    <div className="section-header">
                        <div className="section-header--left">
                            <h3 className="section-header__title">Trung tâm trợ giúp</h3>

                        </div>
                    </div>


                    <div className='flex-align-center'>
                        <h4 className='mr-8'>Topics ({helpTopics?.length})</h4>
                        <svg onClick={() => { setOverlayVisible(true); setShowCreateHelpTopic(true) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 btn add-btn">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Theme</th>
                                <th>Topic</th>
                                <th>Cập nhật lúc</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                helpTopics?.length > 0 ? (
                                    helpTopics.map((helpTopic, index) => (
                                        <tr key={helpTopic.index}>
                                            <td>{index + 1}</td>
                                            <td>{helpTopic.theme}</td>
                                            <td>{helpTopic.title}</td>
                                            <td>{helpTopic.updatedAt}</td>
                                            <td>
                                                <button className="btn btn-2" onClick={() => { setHelpTopic(helpTopic); setOverlayVisible(true); setShowUpdateHelpTopic(true) }}>Chỉnh sửa</button>
                                                <button className="btn btn-3" onClick={() => { setHelpTopic(helpTopic); setOverlayVisible(true); setShowDeleteHelpTopic(true) }}>Xóa</button>
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


                <div className='flex-align-center'>
                    <h4 className='mr-8'>Bài viết ({helpArticles?.length})</h4>
                    <svg onClick={() => { setOverlayVisible(true); setShowCreateHelpArticle(true) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 btn add-btn">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Theme</th>
                            <th>Topic</th>
                            <th>Lượt xem</th>
                            <th>Cập nhật lúc</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            helpArticles?.length > 0 ? (
                                helpArticles.map((helpArticle, index) => (
                                    <tr key={helpArticle.index}>
                                        <td>{index + 1}</td>
                                        <td>{helpArticle.helpTopicId.theme}</td>
                                        <td>{helpArticle.helpTopicId.title}</td>
                                        <td>{helpArticle.updatedAt}</td>
                                        <td>
                                            <button className="btn btn-2" onClick={() => { setHelpArticle(helpArticle); setOverlayVisible(true); setShowUpdateHelpArticle(true) }}>Chỉnh sửa</button>
                                            <button className="btn btn-3" onClick={() => { setHelpArticle(helpArticle); setOverlayVisible(true); setShowDeleteHelpArticle(true) }}>Xóa</button>
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
            </div >
            {overlayVisible && (
                <div className="overlay">
                    {showCreateNews && <CreateNews setShowCreateNews={setShowCreateNews} setOverlayVisible={setOverlayVisible} createNewsMutation={createNewsMutation} />}
                    {showUpdateNews && <UpdateNews news={news} setShowUpdateNews={setShowUpdateNews} setOverlayVisible={setOverlayVisible} updateNewsMutation={updateNewsMutation} />}
                    {showDeleteNews && <DeleteNews news={news} setShowDeleteNews={setShowDeleteNews} setOverlayVisible={setOverlayVisible} deleteNewsMutation={deleteNewsMutation} />}

                    {showCreateHelpTopic && <CreateHelpTopic setShowCreateHelpTopic={setShowCreateHelpTopic} setOverlayVisible={setOverlayVisible} createHelpTopicMutation={createHelpTopicMutation} />}
                    {showUpdateHelpTopic && <UpdateHelpTopic helpTopic={helpTopic} setShowUpdateHelpTopic={setShowUpdateHelpTopic} setOverlayVisible={setOverlayVisible} updateHelpTopicMutation={updateHelpTopicMutation} />}
                    {showDeleteHelpTopic && <DeleteHelpTopic helpTopic={helpTopic} setShowDeleteHelpTopic={setShowDeleteHelpTopic} setOverlayVisible={setOverlayVisible} deleteHelpTopicMutation={deleteHelpTopicMutation} />}

                    {showCreateHelpArticle && <CreateHelpArticle helpTopics={helpTopics} setShowCreateHelpArticle={setShowCreateHelpArticle} setOverlayVisible={setOverlayVisible} createHelpArticleMutation={createHelpArticleMutation} />}
                    {showUpdateHelpArticle && <UpdateHelpArticle helpTopics={helpTopics} helpArticle={helpArticle} setShowUpdateHelpArticle={setShowUpdateHelpArticle} setOverlayVisible={setOverlayVisible} updateHelpArticleMutation={updateHelpArticleMutation} />}
                    {showDeleteHelpArticle && <DeleteHelpArticle helpTopics={helpTopics} helpArticle={helpArticle} setShowDeleteHelpArticle={setShowDeleteHelpArticle} setOverlayVisible={setOverlayVisible} deleteHelpArticleMutation={deleteHelpArticleMutation} />}
                </div>
            )}

        </>
    );
}