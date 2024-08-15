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
        1200: 5,
        1023: 4,
        739: 2
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

                    const response2 = await apiUtils.commissionService(`/notification/createNotification`, inputs);
                    const notificationData = response2.data.metadata.notification;

                    socket.emit('sendNotification', { senderId: userInfo._id, receiverId: commissionServiceAuthorId, notification: notificationData, url: notificationData.url });
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handleBookmarkCommissionService = async (commissionServiceId, commissionServiceAuthorId) => {
        if (!userInfo) {
            setModalInfo({ status: "error", message: "Bạn cần đăng nhập để thực hiện thao tác" });
            return;
        }
        try {
            const response1 = await apiUtils.patch(`/commissionService/bookmarkCommissionService/${commissionServiceId}`);
            if (response1) {
                const action = response1.data.metadata.action;
                if (response1.data.metadata.action == "bookmark") {
                    setModalInfo({ status: "success", message: "Đã lưu tranh" });
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
                    const response2 = await apiUtils.commissionService(`/notification/createNotification`, { receiverId: commissionServiceAuthorId, type: "bookmark" });
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
        <div className="render-commission-services">
            <div className="commission-service-container">
                {
                    sortedCommissionServices?.length > 0 ? (
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid_column"
                        >

                            {sortedCommissionServices?.map((commissionService, idx) => {
                                const hasLiked = likedCommissionServices.includes(commissionService._id);
                                const hasBookmarked = bookmarkedCommissionServices.includes(commissionService._id);
                                return (
                                    <div key={idx} className="commission-service-item gray-bg-hover" onClick={() => { setCommissionServiceId(commissionService?._id), setOverlayVisible(true), setShowRenderCommissionService(true) }}>
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
                                                <div className="highlight-text fw-500 fs-18">{formatCurrency(commissionService?.minPrice)} VND</div>

                                            </div>

                                            {/* {allowEditDelete && isCommissionServiceOwner && (
                                            <div className="commissionService-item__img__crud-operation-container">
                                                <Link to={location.pathname.split('/').filter(Boolean).length === 0 ? `${commissionService?._id}` : `${location.pathname}/${commissionService?._id}/update`} className="commissionService-item__img__crud-operation-item">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                </Link>
                                                <Link to={location.pathname.split('/').filter(Boolean).length === 0 ? `${commissionService?._id}` : `${location.pathname}/${commissionService?._id}/delete`} className="commissionService-item__img__crud-operation-item">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        )} */}
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