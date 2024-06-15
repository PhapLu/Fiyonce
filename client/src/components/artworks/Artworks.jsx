// Imports
import { useState } from "react";
import { Link } from "react-router-dom";

// Utils
import { formatNumber } from "../../utils/formatter.js";

// Styling
import "./Artworks.scss";

export default function Artworks() {
    const [artworks, setArtworks] = useState([
        {
            _id: "1",
            media: [
                "https://i.pinimg.com/236x/c9/33/5b/c9335be944756f57311179e16e463a96.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "1",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        },
        {
            _id: "2",
            media: [
                "https://i.pinimg.com/236x/e9/7f/44/e97f44573df1dd4ae1f9f1bbff9be71f.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "2",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        },
        {
            _id: "3",
            media: [
                "https://i.pinimg.com/236x/2b/97/3a/2b973a795a718f2193c18e0be888f7ef.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "3",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        },
        {
            _id: "4",
            media: [
                "https://i.pinimg.com/474x/22/39/24/223924bd54baf7cf19727ea031204da4.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "4",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        },
        {
            _id: "5",
            media: [
                "https://i.pinimg.com/564x/4c/61/4f/4c614f6e646df3868e5df3fa16d71d71.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "5",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        },
        {
            _id: "6",
            media: [
                "https://i.pinimg.com/236x/bc/d3/3f/bcd33f453decc45b7777be8e7d04d8bc.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "6",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        },
        {
            _id: "7",
            media: [
                "https://i.pinimg.com/236x/c1/d3/d3/c1d3d3c242105537d2574089a200bb0e.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "7",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        },
        {
            _id: "8",
            media: [
                "https://i.pinimg.com/236x/7a/9c/58/7a9c58474802d8c98ad22166c4dd2930.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "8",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        },
        {
            _id: "9",
            media: [
                "https://i.pinimg.com/736x/3d/f2/69/3df269fe2194150b4fa5828ba6b343a6.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "9",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        },
        {
            _id: "10",
            media: [
                "https://i.pinimg.com/236x/aa/7c/c7/aa7cc774ab7c063ac183ed62e1332213.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "10",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        }
    ]);

    return (
        <div className="artworks">
            <div className="artwork-container">
                {artworks && artworks.length > 0 && artworks.map((artwork, idx) => {
                    return (
                        <Link key={idx} className="artwork-item">
                            <div className="artwork-item__img">
                                <img src={artwork.media[0]} alt="" className="artwork-item__img__thumbnail" />
                                <div className="artwork-item__img__operation-container">
                                    <div className="artwork-item__img__operation-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                        </svg>
                                    </div>
                                    <div className="artwork-item__img__operation-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                        </svg>
                                    </div>
                                    <div className="artwork-item__img__operation-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="user sm">
                                <div className="user--left">
                                    <img src={artwork.talentAvatar} alt="" className="user__avatar" />
                                    <div className="user__name">
                                        <div className="user__name__title">{artwork.talentUsername}</div>
                                        {/* <div className="user__name__sub-title">{artwork.talentUsername}</div> */}
                                    </div>
                                </div>
                                <div className="user--right">
                                    <span className="artwork-item__view">
                                        <span className="artwork__view__count">{formatNumber(artwork.viewCount, 1)}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}