// Imports
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from "react-router-dom"

// Utils
import { apiUtils } from '../../utils/newRequest';

// Styling

export default function ForTalents() {

    const queryClient = useQueryClient();

    const fetchHelpTopicsAndArticles = async () => {
        try {
            const response = await apiUtils.get("/help/readTopicAndArticlesByTheme?theme=for_clients");
            console.log(response.data.metadata.topicsAndArticles);
            return response.data.metadata.topicsAndArticles;
        } catch (error) {
            return null;
        }
    };

    const { data: topicsAndArticles, isFetchingTopicsAndArticlesError, fetchingNewsError, isFetchingTopicsAndArticlesLoading } = useQuery('fetchHelpTopicsAndArticles', fetchHelpTopicsAndArticles);

    return (
        <div className="for-talent">
            <div className="flex-align-center flex-justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6 mr-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                </svg>
                <h1>Dành cho họa sĩ</h1>
            </div>
            <hr />
            <div className="help-topic-container mt-16">
                <div className="help-topic--left">
                    {
                        topicsAndArticles?.length > 0 && topicsAndArticles?.map((topic, index) => {
                            // Render odd indexed topics in the left container
                            if (index % 2 === 0 && topic.articles.length > 0) {
                                return (
                                    <div className="help-topic-item" key={index}>
                                        <h2>{topic.topicTitle}</h2>
                                        <hr />
                                        {topic.articles?.map((article, articleIndex) => (
                                            <p>
                                                <Link to={`/help-center/articles/${article._id}`} key={articleIndex} > {articleIndex + 1}. {article.title}</Link>
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
                                                <Link to={`/help-center/articles/${article._id}`} key={articleIndex} > {articleIndex + 1}. {article.title}</Link>
                                            </p>
                                        ))}
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>

        </div >
    )
}