import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import Masonry from 'react-masonry-css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { formatCurrency, formatNumber } from "../../../utils/formatter.js";
import "./RenderCommissionServices.scss";
import { useModal } from "../../../contexts/modal/ModalContext.jsx";
import { useAuth } from "../../../contexts/auth/AuthContext.jsx";
import { resizeImageUrl } from "../../../utils/imageDisplayer.js";
import { apiUtils } from "../../../utils/newRequest.js";
import { ClipLoader } from 'react-spinners';

import {
    FacebookIcon,
    TwitterIcon,
    PinterestIcon,
    EmailShareButton,
    FacebookShareButton,
    GabShareButton,
    HatenaShareButton,
    InstapaperShareButton,
    LineShareButton,
    LinkedinShareButton,
    LivejournalShareButton,
    MailruShareButton,
    OKShareButton,
    PinterestShareButton,
    PocketShareButton,
    RedditShareButton,
    TelegramShareButton,
    TumblrShareButton,
    TwitterShareButton,
    ViberShareButton,
    VKShareButton,
    WhatsappShareButton,
    WorkplaceShareButton,
} from "react-share";
import RenderComissionService from "./RenderCommissionService.jsx";

export default function RenderCommissionServices({ isSorting, isDisplayOwner, allowEditDelete, commissionServices, layout }) {
    const breakpointColumnsObj = {
        default: 4,
        1023: 4,
        739: 1,
        // 739: 1
    };

    const [showRenderCommissionService, setShowRenderCommissionService] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);

    const { setModalInfo } = useModal();
    const location = useLocation();
    const navigate = useNavigate();
    const { userId } = useParams();
    const { userInfo, socket } = useAuth();
    const profileInfo = useOutletContext();
    const isCommissionServiceOwner = userId === userInfo?._id;
    const [commissionServiceId, setCommissionServiceId] = useState();

    // State to track the like status of commissionServices
    const [likedCommissionServices, setLikedCommissionServices] = useState([]);
    const [bookmarkedCommissionServices, setBookmarkedCommissionServices] = useState([]);
    const [showMoreCommissionServiceActions, setShowMoreCommissionServiceActions] = useState(false);

    useEffect(() => {
        if (commissionServices && userInfo) {
            // Initialize the likedCommissionServices state based on the commissionServices data
            const initialLikedCommissionServices = commissionServices.reduce((acc, commissionService) => {
                if (commissionService.likes?.some(like => like.user === userInfo?._id)) {
                    acc.push(commissionService._id);
                }
                return acc;
            }, []);

            const initialBookmarkedCommissionServices = commissionServices.reduce((acc, commissionService) => {
                if (commissionService.bookmarks?.some(bookmark => bookmark.user === userInfo?._id)) {
                    acc.push(commissionService._id);
                }
                return acc;
            }, []);
            setLikedCommissionServices(initialLikedCommissionServices);
            setBookmarkedCommissionServices(initialBookmarkedCommissionServices);
        }
    }, [commissionServices, userInfo]);

    const handleLikeCommissionService = async (commissionServiceId, commissionServiceAuthorId) => {
        if (!userInfo) {
            setModalInfo({ status: "error", message: "Bạn cần đăng nhập để thực hiện thao tác" });
            return;
        }
        try {
            const response1 = await apiUtils.patch(`/commissionService/likeCommissionService/${commissionServiceId}`);
            if (response1) {
                const action = response1.data.metadata.action;
                if (response1.data.metadata.action == "like") {
                    setModalInfo({ status: "success", message: "Đã thích bài viết" });
                } else {
                    setModalInfo({ status: "success", message: "Đã hoàn tác" });
                }

                // Update like status
                setLikedCommissionServices(prevState => {
                    const isLiked = prevState.includes(commissionServiceId);
                    if (isLiked) {
                        // Remove from likedCommissionServices
                        return prevState.filter(id => id !== commissionServiceId);
                    } else {
                        // Add to likedCommissionServices
                        return [...prevState, commissionServiceId];
                    }
                });

                if (action === "like" && userInfo?._id !== commissionServiceAuthorId) {
                    const inputs = { receiverId: commissionServiceAuthorId, type: "like", url: `/users/${commissionServiceAuthorId}/profile-commissionServices/${commissionServiceId}` }

                    const response2 = await apiUtils.post(`/notification/createNotification`, inputs);
                    const notificationData = response2.data.metadata.notification;

                    socket.emit('sendNotification', { senderId: userInfo._id, receiverId: commissionServiceAuthorId, notification: notificationData, url: notificationData.url });
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handleBookmarkCommissionService = async (commissionServiceId, commissionServiceAuthorId) => {
        console.log(commissionServiceId)
        console.log(commissionServiceAuthorId)
        if (!userInfo) {
            setModalInfo({ status: "error", message: "Bạn cần đăng nhập để thực hiện thao tác" });
            return;
        }
        try {
            const response1 = await apiUtils.patch(`/commissionService/bookmarkCommissionService/${commissionServiceId}`);
            if (response1) {
                const action = response1.data.metadata.action;
                if (response1.data.metadata.action == "bookmark") {
                    setModalInfo({ status: "success", message: "Đã thêm vào mục lưu trữ" });
                } else {
                    setModalInfo({ status: "success", message: "Đã hoàn tác" });
                }

                // Update like status
                setBookmarkedCommissionServices(prevState => {
                    const isBookmarked = prevState.includes(commissionServiceId);
                    if (isBookmarked) {
                        // Remove from likedCommissionServices
                        return prevState.filter(id => id !== commissionServiceId);
                    } else {
                        // Add to likedCommissionServices
                        return [...prevState, commissionServiceId];
                    }
                });

                if (action == "bookmark" && userInfo?._id !== commissionServiceAuthorId) {
                    const response2 = await apiUtils.post(`/notification/createNotification`, { receiverId: commissionServiceAuthorId, type: "bookmark" });
                    const notificationData = response2.data.metadata.notification;

                    socket.emit('sendNotification', { senderId: userInfo?._id, receiverId: commissionServiceAuthorId, notification: notificationData });
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    // Sort commissionServices by createdAt in descending order
    const sortedCommissionServices = isSorting ? commissionServices.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : commissionServices;

    // Handle share commissionServices
    const copyToClipboard = (commissionServiceId) => {
        const url = `${window.location.origin}/${commissionServiceId}`;
        navigator.clipboard.writeText(url)
            .then(() => {
                setModalInfo({ status: "success", message: "Đã sao chép đường dẫn" });
            })
            .catch(err => {
                setModalInfo({ status: "error", message: "Có lỗi xảy ra" });
            });
    };
    const url = window.location.href;

    const handleNavigation = (commissionServiceId) => {
        const currentPath = location.pathname;
        const searchParams = new URLSearchParams(location.search);
        const searchTerm = searchParams.get('q'); // Extract the search term from query parameters
    
        if (currentPath === "/commission-services") {
            navigate(`/commission-services/${commissionServiceId}${location.search}`);
        } else if (currentPath === "/search") {
            // Navigate to /search/:searchTerm/commission-services/:commissionServiceId and include query params
            navigate(`/search/commission-services/${commissionServiceId}${location.search}`);
        }
    };

    const handleShare = (platform, itemId) => {
        // URL to share

        switch (platform) {
            case 'copy':
                navigator.clipboard.writeText(`${url}${itemId}`);
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
        <div className="render-commission-services">
            <div className="commission-service-container">
                {
                    sortedCommissionServices?.length > 0 ? (
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className={`my-masonry-grid layout-${layout}`}
                            columnClassName="my-masonry-grid_column"
                        >

                            {sortedCommissionServices?.map((commissionService, idx) => {
                                const hasLiked = likedCommissionServices.includes(commissionService._id);
                                const hasBookmarked = bookmarkedCommissionServices.includes(commissionService._id);
                                return (
                                    // onClick={() => { setCommissionServiceId(commissionService?._id), setOverlayVisible(true), setShowRenderCommissionService(true) }}

                                    <div onClick={() => {handleNavigation(commissionService?._id)}} key={idx} className="commission-service-item gray-bg-hover" >
                                        <div className={`commission-service-item__status ${commissionService?.status}`}>
                                            {commissionService?.status == "open" ? (
                                                "Open"
                                            ) : commissionService?.status == "waitlist" ? "Wailist" : ""}
                                        </div>
                                        <div className={`commission-service-item__bookmark-btn ${hasBookmarked ? "active" : " "}`} onClick={(event) => {
                                            event.preventDefault(); // Prevent default behavior of the link
                                            event.stopPropagation(); // Stop event propagation to avoid navigation
                                            handleBookmarkCommissionService(commissionService?._id, commissionService?.talentId?._id);
                                        }}>

                                            {
                                                hasBookmarked ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 bookmarked-ic hover-cursor-opacity">
                                                        <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={`size-6 hover-cursor-opacity`}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                                    </svg>
                                                )
                                            }

                                        </div>

                                        <div className="commission-service-item__img">
                                            <div>
                                                <div className="commission-service-item__image-container images-layout-3">
                                                    {commissionService?.artworks.slice(0, 3).map((artwork, index) => {
                                                        if (index === 2 && commissionService?.artworks.length > 3) {
                                                            return (
                                                                <div className="image-item" key={index}>
                                                                    <LazyLoadImage
                                                                        src={resizeImageUrl(artwork, 250)}
                                                                        alt={`Artwork ${index + 1}`}
                                                                        effect="blur"
                                                                    />
                                                                    <div className="image-item__overlay">
                                                                        +{commissionService?.artworks?.length - 3}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        return (
                                                            <div className="image-item" key={index}>
                                                                <LazyLoadImage
                                                                    src={resizeImageUrl(artwork, 400)}
                                                                    alt={`Artwork ${index + 1}`}
                                                                    effect="blur"
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <p className="fs-16 mt-16 fw-bold">{commissionService?.title}</p>
                                                <div className="fw-500 fs-18">Giá từ: <span className="highlight-text fw-500 fs-18">{formatCurrency(commissionService?.minPrice)} VND</span> </div>

                                            </div>
                                        </div>
                                        {
                                            isDisplayOwner && (
                                                <span>
                                                    <Link to={`/users/${commissionService?.talentId._id}/profile-commission-services`} className="user xs hover-cursor-opacity">
                                                        <div className="user--left">
                                                            <LazyLoadImage
                                                                src={resizeImageUrl(commissionService?.talentId?.avatar, 40)}
                                                                className="user__avatar"
                                                                effect="blur"
                                                            />
                                                            <div className="user__name">
                                                                <div className="user__name__title fw-600">{commissionService?.talentId?.fullName}</div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </span>
                                            )
                                        }
                                    </div>
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

            {overlayVisible &&
                <div className="overlay">
                    {showRenderCommissionService && <RenderComissionService commissionServiceId={commissionServiceId} setShowRenderCommissionService={setShowRenderCommissionService} setOverlayVisible={setOverlayVisible} />}
                </div>
            }
        </div >
    );
}