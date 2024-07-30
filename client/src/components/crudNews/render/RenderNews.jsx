// Imports
import { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

// Utils
import { apiUtils } from "../../../utils/newRequest";

// Styling
import "./RenderNews.scss";
import { formatDate } from "../../../utils/formatter";

export default function RenderNews() {
    const { newsId } = useParams();

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
    } = useQuery("fetchNewsById", fetchNewsById);

    return (
        <div className="news">
            <div className="news-header text-align-center">
                <h1 className="news-header__title">{news?.title}</h1>
                <h3 className="news-header__sub-title">{news?.subTitle}</h3>
                <p>bởi <span className="highlight-text fw-bold">Pastal Team</span>, {formatDate(news?.createdAt)}</p>
                <img src={news?.thumbnail} alt="" className="news-header__thumbnail" />
            </div>
            <div className="news-content">
                <p dangerouslySetInnerHTML={{ __html: `${news?.content}` }}></p>
            </div>

            <br />
            <hr />
            <br />
            <h4>Chia sẻ</h4>
        </div>
    )
}