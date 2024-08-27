// Imports
import { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';

// Utils
import { apiUtils } from "../../../utils/newRequest";
import { formatDate } from "../../../utils/formatter";
import { resizeImageUrl } from "../../../utils/imageDisplayer";

// Styling
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import "./RenderPost.scss";
import Loading from '../../loading/Loading';
import { useAuth } from "../../../contexts/auth/AuthContext.jsx";
import { useModal } from "../../../contexts/modal/ModalContext.jsx";

export default function RenderPost() {
    const { userId } = useParams();
    const { postId } = useParams();
    const navigate = useNavigate();
    const renderPostRef = useRef();
    const { userInfo, socket } = useAuth();
    const { setModalInfo } = useModal();

    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [bookmarkCount, setBookmarkCount] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500); // Simulating a 500ms loading delay
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (renderPostRef.current && !renderPostRef.current.contains(e.target)) {
                navigate(userId ? `/users/${userId}/profile-posts` : `/`);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [navigate, userId]);

    const fetchPostByID = async () => {
        try {
            const response = await apiUtils.get(`/post/readPost/${postId}`);
            console.log(response)
            return response.data.metadata.post;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const {
        data: post,
        error,
        isError,
        isLoading,
    } = useQuery("fetchPostByID", fetchPostByID);

    useEffect(() => {
        if (post && userInfo) {
            const isLiked = post.likes?.some(like => like.user === userInfo._id);
            setLiked(isLiked);
            setLikeCount(post.likes?.length || 0);

            const isBookmarked = post.bookmarks?.some(bookmark => bookmark.user === userInfo._id);
            setBookmarked(isBookmarked);
            setBookmarkCount(post.bookmarks?.length || 0);
        }
    }, [post, userInfo]);

    const handleLikePost = async () => {
        if (!userInfo) {
            setModalInfo({ status: "error", message: "Bạn cần đăng nhập để thực hiện thao tác" });
            return;
        }
        try {
            const response = await apiUtils.patch(`/post/likePost/${postId}`);
            if (response) {
                const action = response.data.metadata.action;
                if (action === "like") {
                    setModalInfo({ status: "success", message: "Đã thích bài viết" });
                    setLikeCount(prevCount => prevCount + 1);
                } else {
                    setModalInfo({ status: "success", message: "Đã hoàn tác" });
                    setLikeCount(prevCount => prevCount - 1);
                }
                setLiked(!liked);

                const postAuthorId = post?.talentId?._id;
                console.log(postAuthorId)

                if (action === "like" && userInfo?._id !== postAuthorId) {
                    const inputs = { receiverId: postAuthorId, type: "like", url: `/users/${postAuthorId}/profile-posts/${postId}` }

                    const response2 = await apiUtils.post(`/notification/createNotification`, inputs);
                    const notificationData = response2.data.metadata.notification;
                    socket.emit('sendNotification', { senderId: userInfo._id, receiverId: postAuthorId, notification: notificationData, url: notificationData.url });
                }
            }
        } catch (error) {
            console.log(error);
            setModalInfo({ status: "error", message: "Có lỗi xảy ra" });
        }
    };

    const handleBookmarkPost = async () => {
        if (!userInfo) {
            setModalInfo({ status: "error", message: "Bạn cần đăng nhập để thực hiện thao tác" });
            return;
        }
        try {
            const response = await apiUtils.patch(`/post/bookmarkPost/${postId}`);
            if (response) {
                const action = response.data.metadata.action;
                if (action === "bookmark") {
                    setModalInfo({ status: "success", message: "Đã lưu tranh" });
                    setBookmarkCount(prevCount => prevCount + 1);
                } else {
                    setModalInfo({ status: "success", message: "Đã hoàn tác" });
                    setBookmarkCount(prevCount => prevCount - 1);
                }
                setBookmarked(!bookmarked);

                const postAuthorId = post?.talentId?._id;

                if (action === "bookmark" && userInfo?._id !== postAuthorId) {
                    const inputs = { receiverId: postAuthorId, type: "bookmark", url: `/users/${postAuthorId}/profile-posts/${postId}` }

                    const response2 = await apiUtils.post(`/notification/createNotification`, inputs);
                    const notificationData = response2.data.metadata.notification;
                    socket.emit('sendNotification', { senderId: userInfo._id, receiverId: postAuthorId, notification: notificationData, url: notificationData.url });
                }
            }
        } catch (error) {
            console.log(error);
            setModalInfo({ status: "error", message: "Có lỗi xảy ra" });
        }
    };



    if (isLoading) {
        return <span>Đang tải...</span>;
    }

    if (isError) {
        return <span>Có lỗi xảy ra: {error.message}</span>;
    }

    return (
        <div className="overlay">
            {loading ? (
                <Loading />
            ) : (
                <div className="render-post modal-form type-1" ref={renderPostRef} onClick={(e) => e.stopPropagation()}>
                    <div className="modal-form--left">
                        {post?.artworks?.length > 0 && (
                            <Carousel
                                showArrows
                                infiniteLoop
                                showThumbs={false}
                                dynamicHeight
                            >
                                {post.artworks.map((artwork, index) => (
                                    <div key={index} className="render-commission-service__artwork-item">
                                        <img
                                            src={artwork.url}
                                            alt={`Artwork ${index + 1}`}
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        )}
                    </div>
                    <div className="modal-form--right">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => navigate(-1)}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>

                        <div className="user md">
                            <Link to={`/users/${post?.talentId._id}/profile-posts`} className="user--left hover-cursor-opacity">
                                <img
                                    src={resizeImageUrl(post?.talentId?.avatar, 100)}
                                    className="user__avatar"
                                />
                                <div className="user__name">
                                    <div className="user__name__title">{post?.talentId?.fullName}</div>
                                    <div className="user__name__sub-title">{post?.talentId?.stageName}</div>
                                </div>
                            </Link>
                        </div>

                        <hr className="mt-16 mb-16" />
                        {post?.movementId?.title && <button className="btn btn-4 br-16 mr-8">{post?.movementId?.title}</button>}
                        {post?.postCategoryId?.title && <Link to={`/users/${post?.talentId._id}/profile-posts`} className="btn btn-4 br-16 mr-8">{post?.postCategoryId?.title}</Link>}
                        <p>{post?.description}</p>
                        <br />
                        <span>Đăng tải vào {formatDate(post.createdAt)}</span>
                        <br />
                        <hr className="mb-16 mt-16" />
                        <div className="flex-align-center">
                            <div className="flex-align-center mr-8" onClick={handleLikePost}>
                                <span className="mr-4">{likeCount}</span>
                                {liked ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 liked-ic hover-cursor-opacity">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25a5.973 5.973 0 0 0-1.753-4.247A5.971 5.971 0 0 0 15 2.25a5.973 5.973 0 0 0-4.247 1.753l-.253.253-.253-.253A5.973 5.973 0 0 0 6 2.25a5.973 5.973 0 0 0-4.247 1.753A5.973 5.973 0 0 0 0 8.25c0 1.613.626 3.127 1.753 4.247l8.974 8.974a.75.75 0 0 0 1.06 0l8.974-8.974A5.973 5.973 0 0 0 21 8.25Z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 hover-cursor-opacity">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25a5.973 5.973 0 0 0-1.753-4.247A5.971 5.971 0 0 0 15 2.25a5.973 5.973 0 0 0-4.247 1.753l-.253.253-.253-.253A5.973 5.973 0 0 0 6 2.25a5.973 5.973 0 0 0-4.247 1.753A5.973 5.973 0 0 0 0 8.25c0 1.613.626 3.127 1.753 4.247l8.974 8.974a.75.75 0 0 0 1.06 0l8.974-8.974A5.973 5.973 0 0 0 21 8.25Z" />
                                    </svg>
                                )}
                            </div>

                            <div className="flex-align-center mr-8" onClick={handleBookmarkPost}>
                                <span className="mr-4">{bookmarkCount}</span>
                                {bookmarked ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 bookmarked-ic hover-cursor-opacity">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}