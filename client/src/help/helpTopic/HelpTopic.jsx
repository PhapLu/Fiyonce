// Imports
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link, useParams } from "react-router-dom"

// Utils
import { apiUtils } from '../../utils/newRequest';

// Styling
import "./HelpTopic.scss"

export default function HelpTopic() {
    const queryClient = useQueryClient();
    const { "topic-id": helpTopicId } = useParams();
    console.log(helpTopicId)

    const fetchHelpTopicsAndArticles = async () => {
        try {
            let endPoint = "/help/readTopicAndArticlesByTheme";
            switch (helpTopicId) {
                case "for-clients":
                    endPoint += "?theme=for_clients";
                    break;
                case "for-talents":
                    endPoint += "?theme=for_artists";
                    break;
                default:
                    endPoint += "?theme=about";
                    break;

            }
            console.log(endPoint)
            const response = await apiUtils.get(endPoint);
            console.log(response.data.metadata.topicsAndArticles);
            return response.data.metadata.topicsAndArticles;
        } catch (error) {
            return null;
        }
    };

    const { data: topicsAndArticles, isFetchingTopicsAndArticlesError, fetchingNewsError, isFetchingTopicsAndArticlesLoading } = useQuery('fetchHelpTopicsAndArticles', fetchHelpTopicsAndArticles);

    return (
        <div className="help-topic">
            <div className="help-topic__header flex-align-center flex-justify-center">
                <Link to="/help-center" className="back-btn btn btn-7 btn-round mr-16 icon-only">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                    </svg>
                </Link>
                {
                    helpTopicId == "for-talents" ? <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6 help-theme__ic mr-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                        </svg>
                        <h1>Dành cho họa sĩ</h1>
                    </> : helpTopicId == "for-clients" ?
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6 help-theme__ic mr-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            <h1>Dành cho khách hàng</h1>
                        </>
                        :
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6 help-theme__ic mr-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                            </svg>
                            <h1>Về Pastal</h1>
                        </>
                }
            </div>
            <hr />
            {topicsAndArticles?.length > 0 ?
                (
                    <div className="help-topic-container mt-16">
                        <div className="help-topic--left">
                            {
                                topicsAndArticles?.map((topic, index) => {
                                    // Render odd indexed topics in the left container
                                    if (index % 2 === 0 && topic.articles.length > 0) {
                                        return (
                                            <div className="help-topic-item" key={index}>
                                                <h2>{topic.topicTitle}</h2>
                                                <hr />
                                                {topic.articles?.map((article, articleIndex) => (
                                                    <p>
                                                        <Link to={`/help-center/topics/${helpTopicId}/articles/${article._id}`} key={articleIndex} className='help-topic-item__article-title'> {articleIndex + 1}. {article.title}</Link>
                                                    </p>
                                                ))}
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                        <div className="help-topic--right">
                            {
                                topicsAndArticles?.length > 0 && topicsAndArticles?.map((topic, index) => {
                                    // Render even indexed topics in the right container
                                    if (index % 2 === 1 && topic?.articles?.length > 0) {
                                        return (
                                            <div className="help-topic-item" key={index}>
                                                <h2>{topic.topicTitle}</h2>
                                                <hr />
                                                {topic.articles?.map((article, articleIndex) => (
                                                    <p>
                                                        <Link to={`/help-center/topics/${helpTopicId}/articles/${article._id}`} key={articleIndex} className='help-topic-item__article-title'> {articleIndex + 1}. {article.title}</Link>
                                                    </p>
                                                ))}
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                ) : (
                    <h3 className='flex-justify-center w-100'>Hiện chưa có bài viết nào trong chủ đề này </h3>
                )}
        </div >
    )
}