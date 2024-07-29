import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import Masonry from 'react-masonry-css';
import { formatNumber } from "../../../utils/formatter.js";
import "./RenderPosts.scss";
import { useModal } from "../../../contexts/modal/ModalContext.jsx";
import { useAuth } from "../../../contexts/auth/AuthContext.jsx";
import { resizeImageUrl } from "../../../utils/imageDisplayer.js";
import { apiUtils } from "../../../utils/newRequest.js";

export default function RenderPosts({ isSorting, isDisplayOwner, allowEditDelete, posts, layout }) {
    const breakpointColumnsObj = {
        default: layout,
        1200: 6,
        1023: 4,
        739: 2
    };

    const { setModalInfo } = useModal();
    const location = useLocation();
    const navigate = useNavigate();
    const { userId } = useParams();
    const { userInfo, socket } = useAuth();
    const profileInfo = useOutletContext();
    const isPostOwner = userId === userInfo?._id;
    const [selectedPostId, setSelectedPostId] = useState();

    // State to track the like status of posts
    const [likedPosts, setLikedPosts] = useState([]);
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

    useEffect(() => {
        if (posts && userInfo) {
            // Initialize the likedPosts state based on the posts data
            const initialLikedPosts = posts.reduce((acc, post) => {
                if (post.likes?.some(like => like.user === userInfo?._id)) {
                    acc.push(post._id);
                }
                return acc;
            }, []);

            const initialBookmarkedPosts = posts.reduce((acc, post) => {
                if (post.bookmarks?.some(bookmark => bookmark.user === userInfo?._id)) {
                    acc.push(post._id);
                }
                return acc;
            }, []);
            setLikedPosts(initialLikedPosts);
            setBookmarkedPosts(initialBookmarkedPosts);
        }
    }, [posts, userInfo]);

    const handleLikePost = async (selectedPostId, postAuthorId) => {
        if (!userInfo) {
            setModalInfo({ status: "error", message: "Bạn cần đăng nhập để thực hiện thao tác" });
            return;
        }
        try {
            const response1 = await apiUtils.patch(`/post/likePost/${selectedPostId}`);
            if (response1) {
                const action = response1.data.metadata.action;
                if (response1.data.metadata.action == "like") {
                    setModalInfo({ status: "success", message: "Đã thích bài viết" });
                } else {
                    setModalInfo({ status: "success", message: "Đã hoàn tác" });
                }

                // Update like status
                setLikedPosts(prevState => {
                    const isLiked = prevState.includes(selectedPostId);
                    if (isLiked) {
                        // Remove from likedPosts
                        return prevState.filter(id => id !== selectedPostId);
                    } else {
                        // Add to likedPosts
                        return [...prevState, selectedPostId];
                    }
                });

                if (action === "like" && userInfo?._id !== postAuthorId) {
                    const inputs = { receiverId: postAuthorId, type: "like", url: `/users/${postAuthorId}/profile-posts/${selectedPostId}` }

                    const response2 = await apiUtils.post(`/notification/createNotification`, inputs);
                    const notificationData = response2.data.metadata.notification;

                    socket.emit('sendNotification', { senderId: userInfo._id, receiverId: postAuthorId, notification: notificationData, url: notificationData.url });
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handleBookmarkPost = async (selectedPostId, postAuthorId) => {
        if (!userInfo) {
            setModalInfo({ status: "error", message: "Bạn cần đăng nhập để thực hiện thao tác" });
            return;
        }
        try {
            const response1 = await apiUtils.patch(`/post/bookmarkPost/${selectedPostId}`);
            if (response1) {
                const action = response1.data.metadata.action;
                if (response1.data.metadata.action == "bookmark") {
                    setModalInfo({ status: "success", message: "Đã lưu tranh" });
                } else {
                    setModalInfo({ status: "success", message: "Đã hoàn tác" });
                }

                // Update like status
                setBookmarkedPosts(prevState => {
                    const isBookmarked = prevState.includes(selectedPostId);
                    if (isBookmarked) {
                        // Remove from likedPosts
                        return prevState.filter(id => id !== selectedPostId);
                    } else {
                        // Add to likedPosts
                        return [...prevState, selectedPostId];
                    }
                });

                if (action == "bookmark" && userInfo?._id !== postAuthorId) {
                    const response2 = await apiUtils.post(`/notification/createNotification`, { receiverId: postAuthorId, type: "bookmark" });
                    const notificationData = response2.data.metadata.notification;

                    socket.emit('sendNotification', { senderId: userInfo?._id, receiverId: postAuthorId, notification: notificationData });
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    // Sort posts by createdAt in descending order
    const sortedPosts = isSorting ? posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : posts;

    const handlePrevNext = (direction) => {
        console.log("Direction:", direction);
        console.log("Selected Post ID:", selectedPostId);
        console.log("Sorted Posts:", sortedPosts);

        if (!selectedPostId || !sortedPosts.length) {
            console.log("No selectedPostId or posts available");
            return;
        }

        const currentIndex = sortedPosts.findIndex(post => post._id === selectedPostId);
        console.log("Current Index:", currentIndex);

        if (currentIndex === -1) {
            console.log("Selected post not found in sortedPosts");
            return;
        }

        if (direction === "prev" && currentIndex > 0) {
            const prevPostId = sortedPosts[currentIndex - 1]._id;
            console.log("Previous Post ID:", prevPostId);
            navigate(`/${prevPostId}`);
            setSelectedPostId(prevPostId);
        } else if (direction === "next" && currentIndex < sortedPosts.length - 1) {
            const nextPostId = sortedPosts[currentIndex + 1]._id;
            console.log("Next Post ID:", nextPostId);
            navigate(`/${nextPostId}`);
            setSelectedPostId(nextPostId);
        } else {
            console.log("No next or previous post available");
        }
    }

    const copyToClipboard = (selectedPostId) => {
        const url = `${window.location.origin}/${selectedPostId}`;
        navigator.clipboard.writeText(url)
            .then(() => {
                setModalInfo({ status: "success", message: "Đã sao chép đường dẫn" });
            })
            .catch(err => {
                setModalInfo({ status: "error", message: "Có lỗi xảy ra" });
            });
    };

    return (
        <div className="posts">
            {
                selectedPostId && (
                    <>
                        <div className="prev-btn hover-cursor-opacity" onClick={() => handlePrevNext("prev")}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 prev-btn__ic">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </div>
                        <div className="next-btn hover-cursor-opacity" onClick={() => handlePrevNext("next")}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 next-btn__ic">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </div>
                    </>
                )
            }

            {
                sortedPosts?.length > 0 ? (
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {sortedPosts?.map((post, idx) => {
                            const hasLiked = likedPosts.includes(post._id);
                            const hasBookmarked = bookmarkedPosts.includes(post._id);
                            return (
                                <div key={idx} className="post-item" onClick={() => setSelectedPostId(post?._id)}>
                                    <div className="post-item__img">
                                        <Link to={location.pathname.split('/').filter(Boolean).length === 0 ? `${post?._id}` : `${location.pathname}/${post?._id}`}>
                                            <img src={post?.artworks[0].url} alt="" className="post-item__img__thumbnail" />
                                        </Link>
                                        {isPostOwner && (
                                            <span>

                                            </span>
                                        )}
                                        {allowEditDelete && isPostOwner && (
                                            <div className="post-item__img__crud-operation-container">
                                                <Link to={location.pathname.split('/').filter(Boolean).length === 0 ? `${post?._id}` : `${location.pathname}/${post?._id}/update`} className="post-item__img__crud-operation-item">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                </Link>
                                                <Link to={location.pathname.split('/').filter(Boolean).length === 0 ? `${post?._id}` : `${location.pathname}/${post?._id}/delete`} className="post-item__img__crud-operation-item">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        )}

                                        <div className="post-item__img__react-operation-container">
                                            <div className="post-item__img__react-operation-item" onClick={() => { handleLikePost(post._id, post.talentId._id) }}>
                                                {hasLiked ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 liked-ic hover-cursor-opacity">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25a5.973 5.973 0 0 0-1.753-4.247A5.971 5.971 0 0 0 15 2.25a5.973 5.973 0 0 0-4.247 1.753l-.253.253-.253-.253A5.973 5.973 0 0 0 6 2.25a5.973 5.973 0 0 0-4.247 1.753A5.973 5.973 0 0 0 0 8.25c0 1.613.626 3.127 1.753 4.247l8.974 8.974a.75.75 0 0 0 1.06 0l8.974-8.974A5.973 5.973 0 0 0 21 8.25Z" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25a5.973 5.973 0 0 0-1.753-4.247A5.971 5.971 0 0 0 15 2.25a5.973 5.973 0 0 0-4.247 1.753l-.253.253-.253-.253A5.973 5.973 0 0 0 6 2.25a5.973 5.973 0 0 0-4.247 1.753A5.973 5.973 0 0 0 0 8.25c0 1.613.626 3.127 1.753 4.247l8.974 8.974a.75.75 0 0 0 1.06 0l8.974-8.974A5.973 5.973 0 0 0 21 8.25Z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="post-item__img__react-operation-item" onClick={() => { handleBookmarkPost(post._id, post.talentId._id); }}>
                                                {
                                                    hasBookmarked ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 bookmarked-ic hover-cursor-opacity">
                                                            <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`size-6`}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                                        </svg>
                                                    )
                                                }

                                            </div>
                                            <div className="post-item__img__react-operation-item" onClick={() => copyToClipboard(post?._id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                                </svg>
                                            </div>

                                        </div>
                                    </div>
                                    {
                                        isDisplayOwner && (
                                            <Link to={`/users/${post?.talentId._id}/profile-commission-services`} className="user sm hover-cursor-opacity">
                                                <div className="user--left">
                                                    <img src={resizeImageUrl(post?.talentId?.avatar, 50)} alt="" className="user__avatar" />
                                                    <div className="user__name">
                                                        <div className="user__name__title fw-600">{post?.talentId?.fullName}</div>
                                                    </div>
                                                </div>
                                                {/* <div className="user--right flex-align-center">
                                    <span className="mr-4">{post?.views?.length}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 sm">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                </div> */}
                                            </Link>
                                        )
                                    }
                                </div>
                            );
                        })}
                    </Masonry >
                ) : (
                    <div>
                        <h3 className="text-align-center w-100 mt-32">Hiện chưa có tác phẩm ...</h3>
                    </div>
                )
            }
        </div >
    );
}