// Imports
import { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { ShareSocial } from 'react-share-social'

// Components
import RenderNewss from "./RenderNewss.jsx";
import Footer from "../../footer/Footer.jsx";

// Utils
import { apiUtils } from "../../../utils/newRequest";
import { formatDate } from "../../../utils/formatter";

// Styling
import "./RenderNews.scss";

export default function RenderNews() {
    const { newsId } = useParams();

    const url = "http://localhost:5173/newss/66a8f46e143aa910a3d771f9";
    const title = "";
    const fetchNewsById = async () => {
        try {
            const response = await apiUtils.get(`/news/readNews/${newsId}`);
            return response.data.metadata.news;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const {
        data: news,
        error,
        isError,
        isLoading,
    } = useQuery(["fetchNewsById", newsId], fetchNewsById);


    return (
        <>
            <div className="news">
                <div className="news-header text-align-center">
                    <h1 className="news-header__title">{news?.title}</h1>
                    <h3 className="news-header__sub-title">{news?.subTitle}</h3>
                    <p>bởi <span className="highlight-text fw-bold">Pastal Team</span> <span className="dot-delimiter"></span> {formatDate(news?.createdAt)}</p>
                    <img src={news?.thumbnail} alt="" className="news-header__thumbnail" />
                </div>
                <div className="news-content">
                    <p dangerouslySetInnerHTML={{ __html: `${news?.content}` }}></p>
                </div>

                <br />
                <hr />
                <br />

                <div className="flex-align-center">
                    <h4>Chia sẻ</h4>
                    <ShareSocial
                        url={window.location.href}  // Pass the current URL
                        media={window.location.href}  // Pass the current URL
                        socialTypes={['facebook', 'twitter', 'reddit', 'linkedin', 'pinterest', 'telegram']}
                        title={title}  // Pass the title of the news article
                        // Optionally, you can add more props like description, hashtags, etc.
                        description={news?.subTitle}
                        hashtags={['Pastal', 'News']}
                    />

                </div>

                <br />
                <hr />
                <br />

                <div className="">
                    <h4>Bài viết liên quan</h4>
                    <RenderNewss />
                </div>
                <br />
                <br />

            </div>
            <Footer />
        </>
    )
}