import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../../contexts/auth/AuthContext";
import "./RenderNotifications.scss";
import { apiUtils } from "../../../utils/newRequest";
import { formatTimeAgo, limitString } from "../../../utils/formatter";

export default function RenderNotifications({ setShowRenderNotifications }) {
    const { userInfo } = useAuth();

    const fetchNotifications = async () => {
        try {
            const response = await apiUtils.patch(`/notification/readNotifications`);
            console.log(response)
            return response.data.metadata.notifications;
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    // Utility function to group notifications by type
    const groupNotificationsByType = (notifications) => {
        return notifications.reduce((acc, notification) => {
            const { type } = notification;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(notification);
            return acc;
        }, {});
    };
    const [groupedNotifications, setGroupedNotifications] = useState({});

    const { data: notifications, error: fetchingNotifications, isError: isFetchingNotificationsError, isLoading: isFetchingNotificationsLoading } = useQuery(
        'fetchNotifications',
        fetchNotifications,
        {
            onSuccess: (data) => {
                setGroupedNotifications(groupNotificationsByType(data))
                console.log(groupNotificationsByType(data))
                console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching notifications:', error);
            },
        }
    );

    const handleConversationClick = (notification) => {
        setOtherMember(notification.otherMember)
        setShowRenderNotifications(false);
    }

    if (isFetchingNotificationsLoading) {
        return;
    }

    const displayedInteractionNotifications = groupedNotifications?.order?.length > 0 ? groupedNotifications?.interaction?.slice(0, 3) : groupedNotifications?.interaction?.slice(0, 5);
    const displayedOrderNotifications = groupedNotifications?.interaction?.length > 0 ? groupedNotifications?.order?.slice(0, 3) : groupedNotifications?.order?.slice(0, 5);
    return (
        <>
            <div className="render-notifications">
                <h2>Thông báo</h2>
                <hr />
                <div className="notification-container">
                    {displayedOrderNotifications?.length > 0 ? (
                        <>
                            <h4>Đơn hàng</h4>
                            {
                                displayedOrderNotifications?.map((notification, index) => {
                                    return (<Link
                                        key={index}
                                        to={notification?.url}
                                        className="notification-item user md gray-bg-hover p-4 br-8 mb-8"
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="user--left">
                                            <img src={notification?.senderAvatar} alt="" className="user__avatar" />
                                            <div className="user__name">
                                                <div className="user__name__sub-title">
                                                    <span>
                                                        {limitString(notification?.content, 100)}
                                                    </span>
                                                </div>
                                                <div className={`user__name__sub-title flex-align-center ${userInfo?.unSeenNotifications?.some(unSeenNotification => unSeenNotification._id === notification._id) && "fw-bold"}`}>
                                                    <span className="fs-12 downlight-text fw-500">{formatTimeAgo(notification?.updatedAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            userInfo?.unSeenNotifications?.some(unSeenNotification => unSeenNotification._id === notification?._id) &&
                                            <div className="user--right unseen-dot">

                                            </div>
                                        }
                                    </Link>)
                                })
                            }
                        </>
                    ) : (
                        <p>Hiện chưa có thông báo nào</p>
                    )}

                    {displayedInteractionNotifications?.length > 0 && (
                        <>
                            <h4>Tương tác</h4>
                            {
                                displayedInteractionNotifications?.map((notification, index) => {
                                    return (<Link
                                        key={index}
                                        to={notification?.url}
                                        className="notification-item user md gray-bg-hover p-4 br-8 mb-8"
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="user--left">
                                            <img src={notification?.senderAvatar} alt="" className="user__avatar" />
                                            <div className="user__name">
                                                <div className="user__name__sub-title">
                                                    <span>
                                                        {limitString(notification?.content, 100)}
                                                    </span>
                                                </div>
                                                <div className={`user__name__sub-title flex-align-center ${userInfo?.unSeenNotifications?.some(unSeenNotification => unSeenNotification._id === notification._id) && "fw-bold"}`}>
                                                    <span className="fs-12 downlight-text fw-500">{formatTimeAgo(notification?.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            userInfo?.unSeenNotifications?.some(unSeenNotification => unSeenNotification._id === notification?._id) &&
                                            <div className="user--right unseen-dot">

                                            </div>
                                        }
                                    </Link>)
                                })
                            }
                        </>
                    )}
                </div>
            </div>
        </>
    )
}