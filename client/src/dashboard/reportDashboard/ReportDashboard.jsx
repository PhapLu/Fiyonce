
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/AuthContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiUtils } from '../../utils/newRequest';
import ConfirmTalentRequest from '../../components/crudTalentRequest/confirm/ConfirmTalentRequest';
import { useModal } from '../../contexts/modal/ModalContext';
import DenyTalentRequest from '../../components/crudTalentRequest/deny/DenyTalentRequest';
import { resizeImageUrl } from '../../utils/imageDisplayer';
import ZoomImage from '../../components/zoomImage/ZoomImage';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { tr } from 'date-fns/locale';

export default function ReportDashboard() {
    const { userInfo, socket } = useAuth()
    const { setModalInfo } = useModal();
    const queryClient = useQueryClient();

    const [showConfirmTalentRequest, setShowConfirmTalentRequest] = useState();
    const [showDenyTalentRequest, setShowDenyTalentRequest] = useState();
    const [showZoomImage, setShowZoomImage] = useState();
    const [imageSrc, setImageSrc] = useState();
    const [overlayVisible, setOverlayVisible] = useState(false);

    const fetchCommissionReports = async () => {
        try {
            const response = await apiUtils.get("/commissionReport/readCommissionReports");
            console.log(response.data.metadata.commissionReports);
            return response.data.metadata.commissionReports;
        } catch (error) {
            return null;
        }
    };
    const { data: commissionReports, isFetchingCommissionReportsError, fetchingCommissionReportsError, isFetchingCommissionReportsLoading } = useQuery('fetchCommissionReports', fetchCommissionReports);

    const fetchReportDashboardOverview = async () => {
        try {
            const response = await apiUtils.get("/reportDashboard/readReportOverview");
            console.log(response.data.metadata.reportOverview);
            return response.data.metadata.reportOverview;
        } catch (error) {
            return null;
        }
    };
    const { data: reportOverview, isFetchingReportOverviewError, fetchingReportOverviewError, isFetchingReportOverviewLoading } = useQuery('fetchReportDashboardOverview', fetchReportDashboardOverview);


    if (isFetchingReportOverviewLoading || isFetchingCommissionReportsLoading) return <div>Loading...</div>;
    if (isFetchingReportOverviewError || isFetchingCommissionReportsError) return <div>Error: {error.message}</div>;

    return (
        <div className="report-dashboard">
            <section className="section overview">
                <div className="section-header">
                    <h3 className="section-header__title">Tổng quan</h3>
                </div>
                <div className="section-content overview-container">
                    <div className="overview-item">
                        <p className="overview-item__title">Đơn hàng vi phạm</p>
                        <span className="overview-item__statistics">{reportOverview?.commissionReportCount}</span>
                    </div>
                    <div className="overview-item">
                        <p className="overview-item__title">Tài khoản vi phạm</p>
                        <span className="overview-item__statistics">{reportOverview?.accountReportCount}</span>
                    </div>
                    <div className="overview-item">
                        <p className="overview-item__title">Báo cáo sự cố</p>
                        <span className="overview-item__statistics">{reportOverview?.bugReportCount}</span>
                    </div>
                </div>
            </section>

            <section className="overview">
                <div className="section-header">
                    <h3 className="section-header__title">Đơn hàng vi phạm</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Trạng thái</th>
                            <th>Người gửi</th>
                            <th>Đơn hàng</th>
                            <th>Hợp đồng</th>
                            <th>Nội dung</th>
                            <th>Bằng chứng</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commissionReports?.length > 0 ? (
                            commissionReports.map((commissionReport, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{commissionReport?.adminDecision?.decision == "client_favored" ?
                                            <span className='status complete'>Đã hoàn tiền cho khách</span> :
                                            commissionReport?.adminDecision?.decision == "artist_favored" ?
                                                <span className='status complete'>Đã bảo vệ quyền lợi cho họa sĩ</span> :
                                                commissionReport?.adminDecision?.decision == "neutral" ?
                                                    <span className='status complete'>Hai bên thương lượng</span> :
                                                    <span className='status pending'>Đang chờ</span>
                                        }</td>
                                        {/* <td>{commissionReport?._id}</td> */}
                                        <td>
                                            <Link target="_blank" to={`/users/${commissionReport?.userId}`}><span className='highlight-text underlined-text'>Xem ngay</span></Link>
                                        </td>
                                        <td>
                                            <Link target="_blank" to={`/commission-market/commission-orders/${commissionReport?.orderId}`}><span className='highlight-text underlined-text'>Xem ngay</span></Link>
                                        </td>
                                        <td>
                                            <Link target="_blank" to={`/commission-market/commission-orders/${commissionReport?.orderId}/proposals/${commissionReport?.proposalId}`}><span className='highlight-text underlined-text'>Xem ngay</span></Link>
                                        </td>
                                        <td>{commissionReport?.content}</td>
                                        <td className='flex-align-center'>{commissionReport?.evidences?.length > 0 ? (
                                            commissionReport?.evidences?.map((evidence, index) => {
                                                return (
                                                    <LazyLoadImage key={index}
                                                        effect="blur"
                                                        alt="Evidence"
                                                        src={resizeImageUrl(evidence, 100)}
                                                        height="50"
                                                        width="50"
                                                        onClick={() => {
                                                            setImageSrc(evidence);
                                                            setShowZoomImage(true);
                                                        }}
                                                    />
                                                )
                                            })
                                        ) : (
                                            "-"
                                        )}</td>
                                        <td>
                                            {["client_favored", "artist_favored", "neutral"]?.includes(commissionReport?.adminDecision?.decision) ?
                                                "Đã giải quyết" :
                                                <Link to={`/dashboard/reports/commission-reports/${commissionReport?._id}/make-decision`} className="btn btn-2 mr-8">Ra quyết định</Link>
                                            }

                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan="8">No talent requests received yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>

            <section className="overview">
                <div className="section-header">
                    <h3 className="section-header__title">Tài khoản vi phạm</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Trạng thái</th>
                            <th>Người gửi</th>
                            <th>Người bị báo cáo</th>
                            <th>Nội dung</th>
                            <th>Bằng chứng</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commissionReports?.length > 0 ? (
                            commissionReports.map((commissionReport, index) => {
                                return (
                                    <tr key={index}>
                                        <td>Trạng tdái</td>
                                        <td>Người gửi</td>
                                        <td>Người bị báo cáo</td>
                                        <td>Nội dung</td>
                                        <td>Bằng chứng</td>
                                        <td>Thao tác</td>
                                    </tr>
                                )
                            })) : (
                            "-"
                        )}
                    </tbody>
                </table>
            </section >


            {showZoomImage && <ZoomImage src={imageSrc} setShowZoomImage={setShowZoomImage} />
            }
            {
                overlayVisible && (
                    <div className="overlay">
                        {showConfirmTalentRequest && <ConfirmTalentRequest talentRequest={talentRequest} confirmTalentRequestMutation={confirmTalentRequestMutation} setShowConfirmTalentRequest={setShowConfirmTalentRequest} setOverlayVisible={setOverlayVisible} />}
                        {showDenyTalentRequest && <DenyTalentRequest talentRequest={talentRequest} denyTalentRequestMutation={denyTalentRequestMutation} setShowDenyTalentRequest={setShowDenyTalentRequest} setOverlayVisible={setOverlayVisible} />}
                    </div>
                )
            }

            <Outlet />
        </div >
    );
}