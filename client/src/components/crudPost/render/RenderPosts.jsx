// Imports
import { useState } from "react";
import { Link } from "react-router-dom";
import Masonry from 'react-masonry-css';

// Utils
import { formatNumber } from "../../../utils/formatter.js";

// Styling
import "./RenderPosts.scss";

export default function Posts({ isDisplayOwner, posts, layout }) {
    const breakpointColumnsObj = {
        default: layout,
        1200: 5,
        800: 2,
        600: 1
    };

    // Copy to Clipboard Function
const copyToClipboard = (postId) => {
    const pageURL = window.location.href;
    const copiedUrl = `${pageURL}/${postId}`;
    navigator.clipboard.writeText(copiedUrl).then(() => {
        
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};

    return (
        <div className="posts">
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {posts && posts.length > 0 && posts.map((post, idx) => {
                    return (
                        <Link key={idx} className="post-item">
                            <div className="post-item__img">
                                <img src={post.media[0]} alt="" className="post-item__img__thumbnail" />
                                <div className="post-item__img__operation-container">
                                    <div className="post-item__img__operation-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                        </svg>
                                    </div>
                                    <div className="post-item__img__operation-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                        </svg>
                                    </div>
                                    <div className="post-item__img__operation-item">
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
                        </Link>
                    );
                })}
            </Masonry>
        </div>
    );
}