import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Masonry from 'react-masonry-css';
import { formatNumber } from "../../../utils/formatter.js";
import "./RenderPosts.scss";
import { useModal } from "../../../contexts/modal/ModalContext.jsx";
import { useAuth } from "../../../contexts/auth/AuthContext.jsx";

export default function RenderPosts({ isDisplayOwner, posts, layout }) {
    const breakpointColumnsObj = {
        default: layout,
        1200: 5,
        800: 2,
        600: 1
    };

    const { setModalInfo } = useModal();

    if (!posts) {
        return null; // Or handle the loading state or empty state
    }

    const location = useLocation();
    const [postId, setPostId] = useState();
    const { userId } = useParams();
    const { userInfo } = useAuth();
    const isPostOwner = userId === userInfo._id;

    const copyToClipboard = (postId) => {
        const pageURL = window.location.href;
        const copiedUrl = `${pageURL}/${postId}`;
        navigator.clipboard.writeText(copiedUrl).then(() => {
            setModalInfo({
                status: "success",
                message: "Link đã sao chép thành công"
            })
            // Handle successful copy
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    // Sort posts by createdAt in descending order
    const sortedPosts = posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="posts">
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {sortedPosts.length > 0 && sortedPosts.map((post, idx) => {
                    return (
                        <div key={idx} className="post-item" onClick={() => setPostId(post._id)}>

                            <div className="post-item__img">
                                <Link to={`${location.pathname}/${post._id}`}>
                                    <img src={post.artworks[0].url} alt="" className="post-item__img__thumbnail" />
                                </Link>
                                {isPostOwner && (
                                    <span></span>
                                )}
                                <div className="post-item__img__crud-operation-container">
                                    <Link to={`${location.pathname}/${post._id}/update`} className="post-item__img__crud-operation-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </Link>
                                    <Link to={`${location.pathname}/${post._id}/delete`} className="post-item__img__crud-operation-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </Link>
                                </div>

                                <div className="post-item__img__react-operation-container">
                                    <div className="post-item__img__react-operation-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                        </svg>
                                    </div>
                                    <div className="post-item__img__react-operation-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                        </svg>
                                    </div>
                                    <div className="post-item__img__react-operation-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6" onClick={() => copyToClipboard(post._id)}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {isDisplayOwner &&
                                <div className="user sm">
                                    <div className="user--left">
                                        <img src={post.talentAvatar} alt="" className="user__avatar" />
                                        <div className="user__name">
                                            <div className="user__name__title">{post.talentUsername}</div>
                                        </div>
                                    </div>
                                    <div className="user--right">
                                        <span className="post-item__view">
                                            <span className="post__view__count">{formatNumber(post.viewCount, 1)}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            }
                        </div>
                    );
                })}
            </Masonry>
        </div>
    );
}