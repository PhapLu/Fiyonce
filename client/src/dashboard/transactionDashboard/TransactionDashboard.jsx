
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth/AuthContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiUtils } from '../../utils/newRequest';
import ConfirmTalentRequest from '../../components/crudTalentRequest/confirm/ConfirmTalentRequest';
import { useModal } from '../../contexts/modal/ModalContext';
import DenyTalentRequest from '../../components/crudTalentRequest/deny/DenyTalentRequest';
import { resizeImageUrl } from '../../utils/imageDisplayer';
import ZoomImage from '../../components/zoomImage/ZoomImage';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { formatCurrency, formatFloat } from '../../utils/formatter';

export default function TransactionDashboard() {
    const { userInfo, socket } = useAuth()
    const [talentRequests, setTalentRequests] = useState([]);
    const { setModalInfo } = useModal();
    const queryClient = useQueryClient();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');


    const [talentRequest, setTalentRequest] = useState();
    const [showConfirmTalentRequest, setShowConfirmTalentRequest] = useState();
    const [showDenyTalentRequest, setShowDenyTalentRequest] = useState();
    const [showZoomImage, setShowZoomImage] = useState();
    const [imageSrc, setImageSrc] = useState();
    const [overlayVisible, setOverlayVisible] = useState(false);

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

        // socket.on('disconnect', () => {
        //     console.log('Disconnected from socket server');
        // });

        // return () => {
        //     socket.disconnect();
        // };
    }, []);

    // Mutation hook for upgrading talent request
    const confirmTalentRequestMutation = useMutation(
        (requestId) => apiUtils.patch(`/talentRequest/upgradeRoleToTalent/${requestId}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('talentRequests');
                setModalInfo({
                    status: "success",
                    message: "Nâng cấp tài khoản thành công"
                })
            },
            onError: (error) => {
                queryClient.invalidateQueries('talentRequests');
                setModalInfo({
                    status: "error",
                    message: error.response.data.message
                })
            }
        }
    );

    // Mutation hook for denying talent request
    const denyTalentRequestMutation = useMutation(
        ({ talentRequestId, inputs }) => apiUtils.patch(`/talentRequest/denyTalentRequest/${talentRequestId}`, inputs),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('talentRequests');
            }
        }
    );


    const handleDeny = async (talentRequest) => {
        denyMutation.mutate(talentRequest._id);

        const inputs = { receiverId: talentRequest.userId, type: "responseTalentRequest", url: `/users/${postAuthorId}/profile-posts/${selectedPostId}` }

        const response2 = await apiUtils.post(`/notification/createNotification`, inputs);
        const notificationData = response2.data.metadata.notification;

        socket.emit('sendNotification', { senderId: userInfo._id, receiverId: talentRequest.userId, notification: notificationData, url: notificationData.url });
    };



    const fetchTransactionOverview = async () => {
        try {
            const response = await apiUtils.get(`/transactionDashboard/readTransactionOverview?startDate=${startDate}&endDate=${endDate}`);
            console.log(response.data.metadata.transactionOverview);
            return response.data.metadata.transactionOverview;
        } catch (error) {
            return null;
        }
    };

    const { data: transactionOverview, isFetchingTransactionOverviewError, fetchingTransactionOverviewError, isFetchingTransactionOverviewLoading } = useQuery(
        ['fetchTransactionOverview', startDate, endDate],
        fetchTransactionOverview
    );

    if (isLoading || isFetchingTransactionOverviewLoading) return <div>Loading...</div>;
    if (isError || isFetchingTransactionOverviewError) return <div>Error: {error.message}</div>;

    return (
        <div className="report-dashboard">
            <section className="section overview">
                <div className="section-header">
                    <h3 className="section-header__title">Tổng quan</h3>
                </div>
                <div className="mb-16">
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <label htmlFor="endDate">End Date:</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />

                    <button onClick={() => queryClient.invalidateQueries('fetchTransactionOverview')}>
                        Filter
                    </button>
                </div>
                <div className="section-content overview-container">
                    <div className="overview-item md">
                        <p className="overview-item__title flex-justify-space-between">
                            <span>Đơn hàng</span>
                            <span>{transactionOverview?.totalOrders}</span>
                        </p>

                        <hr />
                        <p className='flex-justify-space-between'>
                            <span>Trực tiếp</span>
                            <span>{transactionOverview?.totalDirectOrders}</span>
                        </p>
                        <p className='flex-justify-space-between'>
                            <span>Chợ commission</span>
                            <span>{transactionOverview?.totalIndirectOrders}</span>
                        </p>
                        <hr />
                        {transactionOverview?.statusCounts?.map((status, index) => {
                            return (
                                <p className='flex-justify-space-between'>
                                    <span>{status.title}</span>
                                    <span>{status.count}</span>
                                </p>
                            );
                        })}
                    </div>

                    <div className="overview-item lg">
                        <p className="overview-item__title flex-justify-space-between">
                            <span>Doanh số</span>
                            <span>4.5%</span>
                        </p>

                        <hr />
                        <p className='flex-justify-space-between'>
                            <span>Tổng GTĐH</span>
                            <span>{formatCurrency(transactionOverview?.achievableVolume)}</span>
                        </p>
                        <p className='flex-justify-space-between'>
                            <span>Tổng doanh thu</span>
                            <span>{formatCurrency(transactionOverview?.estimatedAchievableIncome)}</span>
                        </p>
                        <hr />
                        <p className='flex-justify-space-between'>
                            <span>Tổng GTĐH đã nhận</span>
                            <span>{formatCurrency(transactionOverview?.achievedVolume)}</span>
                        </p>
                        <p className='flex-justify-space-between'>
                            <span>Tổng doanh thu đã nhận</span>
                            <span>{formatCurrency(transactionOverview?.estimatedAchievedIncome)}</span>
                        </p>
                        <hr />
                        <p className='flex-justify-space-between'>
                            <span>Tổng GTĐH sắp nhận</span>
                            <span>{formatCurrency(transactionOverview?.upcomingAchievableVolume)}</span>
                        </p>
                        <p className='flex-justify-space-between'>
                            <span>Tổng doanh thu sắp nhận</span>
                            <span>{formatCurrency(transactionOverview?.estimatedUpcomingAchievableIncome)}</span>
                        </p>
                        <hr />
                        <p className='flex-justify-space-between'>
                            <span>Tổng GTĐH đã lỡ</span>
                            <span>{formatCurrency(transactionOverview?.unachievableVolume)}</span>
                        </p>
                        <p className='flex-justify-space-between'>
                            <span>Tổng doanh thu đã lỡ</span>
                            <span>{formatCurrency(transactionOverview?.estimatedUnachievableIncome)}</span>
                        </p>
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
                            <th>CCCD</th>
                            <th>MST</th>
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
                                    <td>{talentRequest.jobTitle}</td>
                                    <td><a className="highlight-text underlined-text" href={talentRequest.portfolioLink} target="_blank" rel="noopener noreferrer">Link</a></td>
                                    <td >{talentRequest?.cccd}</td>
                                    <td >{talentRequest?.taxCode}</td>
                                    <td className='flex-align-center'>
                                        {talentRequest.artworks.map((artwork, index) => (
                                            <LazyLoadImage key={index} src={resizeImageUrl(artwork, 80)} alt={`artwork-${index}`} effect='blur' onClick={() => { setImageSrc(artwork); setShowZoomImage(true) }} />
                                        ))}
                                    </td>
                                    <td>
                                        {talentRequest.status === "pending" && (
                                            <>
                                                <button className="btn btn-2" onClick={() => { setTalentRequest(talentRequest); setShowConfirmTalentRequest(true); setOverlayVisible(true) }}>Chấp nhận</button>
                                                <button className="btn btn-3" onClick={() => { setTalentRequest(talentRequest); setShowDenyTalentRequest(true); setOverlayVisible(true) }}>Từ chối</button>
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
            {showZoomImage && <ZoomImage src={imageSrc} setShowZoomImage={setShowZoomImage} />}
            {
                overlayVisible && (
                    <div className="overlay">
                        {showConfirmTalentRequest && <ConfirmTalentRequest talentRequest={talentRequest} confirmTalentRequestMutation={confirmTalentRequestMutation} setShowConfirmTalentRequest={setShowConfirmTalentRequest} setOverlayVisible={setOverlayVisible} />}
                        {showDenyTalentRequest && <DenyTalentRequest talentRequest={talentRequest} denyTalentRequestMutation={denyTalentRequestMutation} setShowDenyTalentRequest={setShowDenyTalentRequest} setOverlayVisible={setOverlayVisible} />}
                    </div>
                )
            }
        </div>
    );
}