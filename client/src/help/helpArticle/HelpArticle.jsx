// Imports
import { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";

import { Link, useNavigate, useParams } from "react-router-dom";
import { ShareSocial } from 'react-share-social'

// Components

// Utils

// Styling
import "./HelpArticle.scss";
import { apiUtils } from "../../utils/newRequest";
import { formatDate, limitString } from "../../utils/formatter";

export default function HelpArticle() {
    const { "article-id": articleId } = useParams();
    const navigate = useNavigate();

    const title = "";
    const fetchArticleById = async () => {
        try {
            const response = await apiUtils.get(`/help/readHelpArticle/${articleId}`);
            console.log(articleId)
            console.log(response.data.metadata.helpArticle)
            return response.data.metadata.helpArticle;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const {
        data: helpArticle,
        error,
        isError,
        isLoading,
    } = useQuery(["fetchArticleById", articleId], fetchArticleById);


    return (
        <div className="help-article">

            <div className="breadcrumb">
                <div className="breadcrumb-container flex-align-center flex-justify-center">
                    <Link to="" className="hover-underline hover-cursor-opacity hover-highlight-text">
                        Trung tâm trợ giúp
                    </Link >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 sm">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                    <Link className="hover-underline hover-cursor-opacity hover-highlight-text">
                        {helpArticle?.helpTopicId?.theme == "for_artists" ? "Dành cho họa sĩ" : helpArticle?.helpTopicId?.theme == "for_clients" ? "Dành cho khách hàng" : "Về Pastal"}
                    </Link >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 sm">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                    <Link className="hover-underline hover-cursor-opacity hover-highlight-text">
                        {helpArticle?.title && limitString(helpArticle?.title, 80)}
                    </Link >
                </div>
            </div>

            <div className="article">
                <div className="article-header text-align-center">
                    <h1 className="article-header__title">{helpArticle?.title}</h1>
                    <h3 className="article-header__sub-title">{helpArticle?.subTitle}</h3>
                </div>
                <div className="article-content">
                    <p dangerouslySetInnerHTML={{ __html: `${helpArticle?.content}` }}></p>
                </div>

                <br />
                <br />

            </div>
        </div>
    )
}