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
            // const response = await apiUtils.get(`/news/readNews/${newsId}`);
            // return response.data.metadata.news;
            return {
                title: "Blizzard Entertainment Warcraft Rumble",
                subTitle: "Lorem Ispum rande lossum iyovan de minau",
                thumbnail: "https://images.squarespace-cdn.com/content/v1/63b76a1801fb6b5692cfed8c/e60de761-9057-4e94-8146-fb9e0999bf5b/MerMay+20.jpeg?format=1500w",
                views: 1265,
                createdAt: "2024-07-29T07:55:55.485Z",
                content: `<p>
                <span style="white-space:pre-wrap;">🌟 What is PleinAirpril?</span><br>
                <span style="white-space:pre-wrap;">PleinAirpril is a social media campaign started in 2017 to celebrate Earth Day. The aim is to challenge and engage with plein air artists across the globe and to encourage them to share their artworks—one per day—during the month of April.</span>
            </p>
            <p>
                <br>
                <span style="white-space:pre-wrap;">🌟 How to participate in PleinAirpril 2024</span><br>
                <span style="white-space:pre-wrap;">Every day of April 2024, paint one painting based on the themes "City, Forest, Ocean, Mountain" and post your work on Cara or Instagram</span><br>
                <span style="white-space:pre-wrap;">Use the hashtag #PleinAirpril, and tag @warriorpainters</span><br>
                <span style="white-space:pre-wrap;">You can use any medium you want as PleinAirpril is about experimentation, practice, and exploration!</span><br>
                <span style="white-space:pre-wrap;">Challenge yourself to paint more from life, but feel free to create photo studies or virtual plein air pieces</span><br>
                <span style="white-space:pre-wrap;">Due to Instagram’s recent limitations on artwork discovery via hashtags, participants are encouraged to post on Cara for increased visibility, Content shared on Cara stands a better chance of being discovered and reshared by both the Warrior Painters and Cara community.</span><br>
                <span style="white-space:pre-wrap;">About Warrior Painters</span><br>
                <span style="white-space:pre-wrap;">Warrior Painters was founded in 2016 as a way to connect artists from all walks of life, who share the same passion of showcasing natural and architectural diversity through plein air painting. The majority of painters in the group work in the entertainment industry, spanning from animation and games, to live action films and theme park designs. There is also a good number of freelance illustrators and concept artists.</span><br>
                <span style="white-space:pre-wrap;">~</span><br>
                <span style="white-space:pre-wrap;">As per usual, we have curated a selection of stunning past #pleinairpril artwork on Cara. Check out what the community has been up to, be inspired, and we hope to see you join us this PleinAirpril!</span>
            </p>`
            }
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