import { useState, useEffect } from "react";
import { Link, useLocation, useOutlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
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
        800: 2,
        600: 1
    };

    const { setModalInfo } = useModal();
    const location = useLocation();
    const navigate = useNavigate();
    const { userId } = useParams();
    const { userInfo, socket } = useAuth();
    const profileInfo = useOutletContext();
    const isPostOwner = userId === userInfo?._id;
    const [postId, setPostId] = useState();
    
    useEffect(() => {
        socket.on('getNotification', (newNotification) => {
            alert(newNotification.content)
            // console.log("NEW MESSAGE")
            // console.log(newNotification);
            // // alert(newNotification)
            // setMessages((prevMessages) => [...prevMessages, newNotification]);
            // // conversation?.messages?.push(newNotification);
        });

        return () => {
            socket.off('getNotification');
            socket.emit('removeUser', userInfo._id);
        };
    }, [userInfo._id]);

    if (!posts) {
        return null; // Or handle the loading state or empty state
    }


    const handleLikePost = async (postId, postAuthorId) => {
        console.log(postId)
        console.log(postAuthorId)
        try {
            const response1 = await apiUtils.patch(`/post/likePost/${postId}`);
            if (response1) {
                setModalInfo({ status: "success", message: "Thích bài viết thành công" });
                console.log(response1);

                // const fd = new FormData();
                // fd.append("receiverId", postAuthorId);
                // fd.append("type", "like");

                // console.log(fd.get("receiverId"))
                // console.log(fd.get("type"))

                const response2 = await apiUtils.post(`/notification/createNotification`, { receiverId: postAuthorId, type: "like" });
                const notificationData = response2.data.metadata.notification;
                console.log(response2);
                console.log(response2.data.metadata.notification)

                socket.emit('sendNotification', { senderId: userInfo._id, receiverId: postAuthorId, notification: notificationData });
            }

        } catch (error) {
            console.log(error);
        }
    }

    // Sort posts by createdAt in descending order
    const sortedPosts = isSorting ? posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : posts;

    const handlePrevNext = (direction) => {
        const currentIndex = sortedPosts.findIndex(post => post._id === postId);
        if (direction === "prev" && currentIndex > 0) {
            const prevPostId = sortedPosts[currentIndex - 1]._id;
            navigate(`${location.pathname}/${prevPostId}`);
            setPostId(prevPostId);
        } else if (direction === "next" && currentIndex < sortedPosts.length - 1) {
            const nextPostId = sortedPosts[currentIndex + 1]._id;
            navigate(`${location.pathname}/${nextPostId}`);
            setPostId(nextPostId);
        }
    };

    const copyToClipboard = (postId) => {
        const url = `${window.location.origin}${location.pathname}/${postId}`;
        navigator.clipboard.writeText(url)
            .then(() => {
                setModalInfo({ status: "success", message: "Đã sao chép đường dẫn" });
            })
            .catch(err => {
                setModalInfo({ status: "success", message: "Có lỗi xảy ra" });
            });
    };

    const { postId: selectedPostId } = useParams();
    console.log(selectedPostId)



    return (
        <div className="posts">
            {
                postId && (
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

            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {sortedPosts?.length > 0 && sortedPosts?.map((post, idx) => {
                    return (
                        <div key={idx} className="post-item" onClick={() => setPostId(post?._id)}>
                            <div className="post-item__img">
                                <Link to={`${location.pathname}/${post?._id}`}>
                                    <img src={post?.artworks[0].url} alt="" className="post-item__img__thumbnail" />
                                </Link>
                                {isPostOwner && (
                                    <span>

                                    </span>
                                )}
                                {allowEditDelete && (
                                    <div className="post-item__img__crud-operation-container">
                                        <Link to={`${location.pathname}/${post?._id}/update`} className="post-item__img__crud-operation-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </Link>
                                        <Link to={`${location.pathname}/${post?._id}/delete`} className="post-item__img__crud-operation-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </Link>
                                    </div>
                                )}

                                <div className="post-item__img__react-operation-container">
                                    <div className="post-item__img__react-operation-item" onClick={() => { handleLikePost(post._id, post.talentId._id) }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                        </svg>
                                    </div>
                                    <div className="post-item__img__react-operation-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                        </svg>
                                    </div>
                                    <div className="post-item__img__react-operation-item" onClick={() => copyToClipboard(post?._id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <Link to={`/users/${post?.talentId._id}/profile_commission_services`} className="user sm">
                                <div className="user--left">
                                    <img src={resizeImageUrl(post?.talentId?.avatar, 50)} alt="" className="user__avatar" />
                                    <div className="user__name">
                                        <div className="user__name__title">{post?.talentId?.fullName}</div>
                                    </div>
                                </div>
                                <div className="user--right flex-align-center">
                                    <span className="mr-4">{post.views}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 sm">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </Masonry>
        </div>
    );
}