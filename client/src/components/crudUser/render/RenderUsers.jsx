import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import Masonry from 'react-masonry-css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { formatCurrency, formatNumber } from "../../../utils/formatter.js";
import "./RenderUsers.scss";
import { useModal } from "../../../contexts/modal/ModalContext.jsx";
import { useAuth } from "../../../contexts/auth/AuthContext.jsx";
import { resizeImageUrl } from "../../../utils/imageDisplayer.js";
import { apiUtils } from "../../../utils/newRequest.js";
import { ClipLoader } from 'react-spinners';

export default function RenderUsers({ isSorting, isDisplayOwner, allowEditDelete, users, layout }) {
    const breakpointColumnsObj = {
        default: 4,
        1200: 5,
        1023: 4,
        739: 2
    };

    const [showRenderUser, setShowRenderUser] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [userId, setUserId] = useState();

    const { setModalInfo } = useModal();
    const location = useLocation();
    const navigate = useNavigate();
    const { userInfo, socket } = useAuth();

    // State to track the like status of users
    const [likedUsers, setLikedUsers] = useState([]);
    const [bookmarkedUsers, setBookmarkedUsers] = useState([]);

    useEffect(() => {
        if (users && userInfo) {
            // Initialize the likedUsers state based on the users data
            const initialLikedUsers = users.reduce((acc, user) => {
                if (user.likes?.some(like => like.user === userInfo?._id)) {
                    acc.push(user._id);
                }
                return acc;
            }, []);

            const initialBookmarkedUsers = users.reduce((acc, user) => {
                if (user.bookmarks?.some(bookmark => bookmark.user === userInfo?._id)) {
                    acc.push(user._id);
                }
                return acc;
            }, []);
            setLikedUsers(initialLikedUsers);
            setBookmarkedUsers(initialBookmarkedUsers);
        }
    }, [users, userInfo]);

    const handleLikeUser = async (userId, userAuthorId) => {
        if (!userInfo) {
            setModalInfo({ status: "error", message: "Bạn cần đăng nhập để thực hiện thao tác" });
            return;
        }
        try {
            const response1 = await apiUtils.patch(`/user/likeUser/${userId}`);
            if (response1) {
                const action = response1.data.metadata.action;
                if (response1.data.metadata.action == "like") {
                    setModalInfo({ status: "success", message: "Đã thích bài viết" });
                } else {
                    setModalInfo({ status: "success", message: "Đã hoàn tác" });
                }

                // Update like status
                setLikedUsers(prevState => {
                    const isLiked = prevState.includes(userId);
                    if (isLiked) {
                        // Remove from likedUsers
                        return prevState.filter(id => id !== userId);
                    } else {
                        // Add to likedUsers
                        return [...prevState, userId];
                    }
                });

                if (action === "like" && userInfo?._id !== userAuthorId) {
                    const inputs = { receiverId: userAuthorId, type: "like", url: `/users/${userAuthorId}/profile-users/${userId}` }

                    const response2 = await apiUtils.post(`/notification/createNotification`, inputs);
                    const notificationData = response2.data.metadata.notification;

                    socket.emit('sendNotification', { senderId: userInfo._id, receiverId: userAuthorId, notification: notificationData, url: notificationData.url });
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handleBookmarkUser = async (userId, userAuthorId) => {
        console.log(userId)
        console.log(userAuthorId)
        if (!userInfo) {
            setModalInfo({ status: "error", message: "Bạn cần đăng nhập để thực hiện thao tác" });
            return;
        }
        try {
            const response1 = await apiUtils.patch(`/user/bookmarkUser/${userId}`);
            if (response1) {
                const action = response1.data.metadata.action;
                if (response1.data.metadata.action == "bookmark") {
                    setModalInfo({ status: "success", message: "Đã lưu dịch vụ" });
                } else {
                    setModalInfo({ status: "success", message: "Đã hoàn tác" });
                }

                // Update like status
                setBookmarkedUsers(prevState => {
                    const isBookmarked = prevState.includes(userId);
                    if (isBookmarked) {
                        // Remove from likedUsers
                        return prevState.filter(id => id !== userId);
                    } else {
                        // Add to likedUsers
                        return [...prevState, userId];
                    }
                });

                if (action == "bookmark" && userInfo?._id !== userAuthorId) {
                    const response2 = await apiUtils.post(`/notification/createNotification`, { receiverId: userAuthorId, type: "bookmark" });
                    const notificationData = response2.data.metadata.notification;

                    socket.emit('sendNotification', { senderId: userInfo?._id, receiverId: userAuthorId, notification: notificationData });
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    // Handle share users
    const copyToClipboard = (userId) => {
        const url = `${window.location.origin}/${userId}`;
        navigator.clipboard.writeText(url)
            .then(() => {
                setModalInfo({ status: "success", message: "Đã sao chép đường dẫn" });
            })
            .catch(err => {
                setModalInfo({ status: "error", message: "Có lỗi xảy ra" });
            });
    };
    const url = window.location.href;

    const handleShare = (platform, itemId) => {
        // URL to share

        switch (platform) {
            case 'copy':
                navigator.clipboard.writeText(`${url}${itemId}`);
                alert('URL copied to clipboard!');
                break;
            case 'x':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}/${itemId}`);
                break;
            case 'messenger':
                window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(url)}/${itemId}`);
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}/${itemId}`);
                break;
            default:
                break;
        }
    };


    return (
        <div className="render-users">
            <div className="user-container">
                {
                    users?.length > 0 ? (
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className={`my-masonry-grid layout-${layout}`}
                            columnClassName="my-masonry-grid_column"
                        >
                            {users?.map((user, idx) => {
                                return (
                                    // onClick={() => { setUserId(user?._id), setOverlayVisible(true), setShowRenderUser(true) }}
                                    <Link to={`/users/${user._id}`} key={idx} className="user-item gray-bg-hover">
                                        <img src={resizeImageUrl(user.bg, 400)} className="user-item__bg" />

                                        <div className="user-item__content">
                                            <div className="user mb-8">
                                                <div className="user--left flex-align-center ">
                                                    <img src={user?.avatar} alt="" className="user__avatar" />
                                                    <div className="user__name mt-4">{user?.fullName}</div>
                                                </div>
                                            </div>
                                            <span className="flex-align-center pl-8 mb-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-8">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
                                                </svg>
                                                {user?.followers?.length} người theo dõi
                                            </span>
                                            <span className="flex-align-center pl-8 mb-4"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-8">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                            </svg>
                                                4.5 (30 đánh giá)
                                            </span>
                                        </div>

                                    </Link>
                                );
                            })}
                        </Masonry >
                    ) : (
                        <div className="text-align-center flex-align-center flex-justify-center mt-40">
                            <br />
                            <ClipLoader className="clip-loader" size={40} loading={true} />
                            <h3 className="ml-12">
                                Đang tải
                            </h3>
                        </div>
                    )
                }
            </div>
        </div >
    );
}