import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth/AuthContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiUtils } from '../../utils/newRequest';

export default function AccountDashboard() {
    const {userInfo, socket} = useAuth()
    const [talentRequests, setTalentRequests] = useState([]);
    const queryClient = useQueryClient();

    // Fetch existing talent requests from the API
    const { data, isError, error, isLoading } = useQuery('talentRequests', () =>
        apiUtils.get('/talentRequest/readTalentRequestsByStatus/pending').then(res => res.data.metadata.talentRequests)
    );

    useEffect(() => {
        if (data) {
            setTalentRequests(data);
        }
    }, [data]);

    useEffect(() => {
        socket.on('getTalentRequest', (data) => {
            setTalentRequests((prevRequests) => {
                if (data && data.talentRequest) {
                    return [...prevRequests, data.talentRequest];
                } else {
                    console.warn('Received malformed talent request:', data);
                    return prevRequests;
                }
            });
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Mutation hook for upgrading talent request
    const upgradeMutation = useMutation(
        (requestId) => apiUtils.patch(`/talentRequest/upgradeRoleToTalent/${requestId}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('talentRequests');
            }
        }
    );

    // Mutation hook for denying talent request
    const denyMutation = useMutation(
        (requestId) => apiUtils.patch(`/talentRequest/denyTalentRequest/${requestId}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('talentRequests');
            }
        }
    );

    const handleUpgrade = async (talentRequest) => {
        upgradeMutation.mutate(talentRequest._id);
    };

    const handleDeny = async (talentRequest) => {
        denyMutation.mutate(talentRequest._id);

        const inputs = { receiverId: talentRequest.userId, type: "responseTalentRequest", url: `/users/${postAuthorId}/profile-posts/${selectedPostId}` }

        const response2 = await apiUtils.post(`/notification/createNotification`, inputs);
        const notificationData = response2.data.metadata.notification;

        socket.emit('sendNotification', { senderId: userInfo._id, receiverId: talentRequest.userId, notification: notificationData, url: notificationData.url });
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <div className="dashboard-account">
            <section className="section overview">
                <div className="section-header">
                    <h3 className="section-header__title">Tổng quan</h3>
                </div>
                <div className="section-content overview-container">
                    <div className="overview-item">
                        <p className="overview-item__title">Người dùng</p>
                        <span className="overview-item__statistics">5.347</span>
                    </div>
                    <div className="overview-item">
                        <p className="overview-item__title">Họa sĩ</p>
                        <span className="overview-item__statistics">5.347</span>
                    </div>
                    <div className="overview-item">
                        <p className="overview-item__title">Khách hàng</p>
                        <span className="overview-item__statistics">5.347</span>
                    </div>
                    <div className="overview-item">
                        <p className="overview-item__title">Yêu cầu nâng cấp tài khoản</p>
                        <span className="overview-item__statistics">5.347</span>
                    </div>
                    <div className="overview-item">
                        <p className="overview-item__title">Tài khoản bị chặn</p>
                        <span className="overview-item__statistics">5.347</span>
                    </div>
                </div>
            </section>

            <section className="overview">
                <div className="section-header">
                    <h3 className="section-header__title">Nâng cấp tài khoản</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Trạng thái</th>
                            <th>Email</th>
                            <th>Họ tên</th>
                            <th>Nghệ danh</th>
                            <th>Vị trí công việc</th>
                            <th>Portfolio URL</th>
                            <th>Tranh</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {talentRequests.length > 0 ? (
                            talentRequests.map((talentRequest) => (
                                <tr key={talentRequest._id}>
                                    <td>
                                        <span className={`status ${talentRequest.status}`}>
                                            {talentRequest.status === "pending" && "Đang xử lí"}
                                            {talentRequest.status === "rejected" && "Đã từ chối"}
                                            {talentRequest.status === "approved" && "Đã chấp nhận"}
                                        </span>
                                    </td>
                                    <td>{talentRequest.userId.email}</td>
                                    <td>{talentRequest.userId.fullName}</td>
                                    <td>{talentRequest.stageName}</td>
                                    <td><a href={talentRequest.portfolioLink} target="_blank" rel="noopener noreferrer">Portfolio</a></td>
                                    <td>{talentRequest.jobTitle}</td>
                                    <td className='flex-align-center'>
                                        {talentRequest.artworks.map((artwork, index) => (
                                            <img key={index} src={artwork} alt={`artwork-${index}`} />
                                        ))}
                                    </td>
                                    <td>
                                        {talentRequest.status === "pending" && (
                                        <>
                                            <button className="btn btn-2" onClick={() => handleUpgrade(talentRequest)}>Chấp nhận</button>
                                            <button className="btn btn-3" onClick={() => handleDeny(talentRequest)}>Từ chối</button>
                                        </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No talent requests received yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
}