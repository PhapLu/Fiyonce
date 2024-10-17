import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { useAuth } from "../../../contexts/auth/AuthContext";
import "./RenderNotifications.scss";
import { apiUtils } from "../../../utils/newRequest";
import { formatTimeAgo, limitString } from "../../../utils/formatter";

export default function RenderNotifications({ setShowRenderNotifications }) {
    const { userInfo } = useAuth();

    const fetchNotifications = async () => {
        try {
            const response = await apiUtils.patch(`/notification/readNotifications`);
            return response.data.metadata.notifications;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    // Utility function to group notifications by type and sort by latest notification date within each group
    const groupNotificationsByType = (notifications) => {
        const grouped = notifications.reduce((acc, notification) => {
            const { type } = notification;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(notification);
            // Sort notifications by createdAt within each type
            acc[type].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return acc;
        }, {});

        // Sort the groups based on the latest notification's createdAt
        return Object.entries(grouped).sort((a, b) => {
            const latestA = new Date(a[1][0].createdAt);
            const latestB = new Date(b[1][0].createdAt);
            return latestB - latestA;
        });
    };

    const { data: notifications, isLoading } = useQuery(
        'fetchNotifications',
        fetchNotifications,
        {
            onSuccess: (data) => {
                setGroupedNotifications(groupNotificationsByType(data));
            },
            onError: (error) => {
                console.error('Error fetching notifications:', error);
            },
        }
    );

    const [groupedNotifications, setGroupedNotifications] = useState([]);

    const handleNotificationClick = (notification) => {
        setShowRenderNotifications(false);
    };

    if (isLoading) {
        return null;
    }

    return (
        <div className="render-notifications">
            <h2>Thông báo</h2>
            <hr />
            <div className="notification-container">
                {groupedNotifications.length === 0 && <p>Hiện chưa có thông báo nào</p>}
                {groupedNotifications.map(([type, notifications]) => (
                    <div key={type} className="mb-12">
                        <h4>{type === 'interaction' ? 'Tương tác' : type === 'order' ? 'Đơn hàng' : 'Hệ thống'}</h4>
                        {notifications.slice(0, 3).map((notification, index) => (
                            <Link
                                key={index}
                                to={notification?.url}
                                className="notification-item user md gray-bg-hover p-4 br-8 mb-8"
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="user--left">
                                    <img src={notification?.senderAvatar} alt="" className="user__avatar" />
                                    <div className="user__name">
                                        <div className="user__name__sub-title">
                                            <span>{limitString(notification?.content, 100)}</span>
                                        </div>
                                        <div className={`user__name__sub-title flex-align-center ${userInfo?.unSeenNotifications?.some(unSeenNotification => unSeenNotification._id === notification._id) && "fw-bold"}`}>
                                            <span className="fs-12 downlight-text fw-500">{formatTimeAgo(notification?.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                                {userInfo?.unSeenNotifications?.some(unSeenNotification => unSeenNotification._id === notification?._id) &&
                                    <div className="user--right unseen-dot"></div>
                                }
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}