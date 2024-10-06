// Imports
import { useState, useEffect, useRef } from "react";
import { useParams, Outlet, useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from 'react-query';

// Components
import RenderPosts from "../../components/crudPost/render/RenderPosts";
import CreatePost from "../../components/crudPost/create/CreatePost";
import { useAuth } from "../../contexts/auth/AuthContext.jsx";
// Utils
import { apiUtils } from "../../utils/newRequest.js";

// Styling
import "./ProfileTermOfService.scss";
import { useMovement } from "../../contexts/movement/MovementContext.jsx";
import Masonry from "react-masonry-css";
import { formatDate, limitString } from "../../utils/formatter.js";
import CreateCommissionTos from "../../components/crudCommissionTos/create/CreateCommissionTos.jsx";
import UpdateCommissionTos from "../../components/crudCommissionTos/update/UpdateCommissionTos.jsx";
import DeleteCommissionTos from "../../components/crudCommissionTos/delete/DeleteCommissionTos.jsx";

export default function ProfileTermOfService() {
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [showCreateCommissionTosForm, setShowCreateCommissionTosForm] = useState(false);
    const [selectedCommissionTos, setSelectedCommissionTos] = useState(false);

    const [showUpdateCommissionTosForm, setShowUpdateCommissionTosForm] = useState(false);
    const [showDeleteCommissionTosForm, setShowDeleteCommissionTosForm] = useState(false);

    const { userId } = useParams();
    const { movements } = useMovement
    const { userInfo } = useAuth();
    const isProfileOwner = userInfo?._id === userId;

    const fetchTermsOfServices = async () => {
        try {
            const response = await apiUtils.get('/termOfService/readTermOfServices');
            console.log(response);
            return response.data.metadata.termOfServices
        } catch {
        }
    };
    const { data: termOfServices, error, isLoading } = useQuery(['termsOfServices'], fetchTermsOfServices);

    // Toggle display modal form
    const ManageCommissionTosViewRef = useRef();
    useEffect(() => {
        const handler = (e) => {
            if (ManageCommissionTosViewRef && ManageCommissionTosViewRef.current && !ManageCommissionTosViewRef.current.contains(e.target)) {
                setShowCommissionTosView(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    const breakpointColumnsObj = {
        default: 2,
        739: 2,
        1023: 4,
        1200: 5,
    };

    const handleShowCreateCommissionTosForm = () => {
        setShowCreateCommissionTosForm(true);
        setOverlayVisible(true);
    }

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            <div className="profile-term-of-service">
                <div className="profile-page__header">
                    <div className="profile-page__header--left">
                        <button
                            className={`btn btn-md btn-2`}
                        >
                            Tất cả ({termOfServices?.length || 0})
                        </button>
                    </div>

                    {
                        isProfileOwner && (
                            <div className="profile-page__header--right">
                                <button className="btn btn-7" onClick={handleShowCreateCommissionTosForm}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Điều khoản
                                </button>
                            </div>
                        )
                    }
                </div>

                {
                    termOfServices?.length > 0 ?
                        (
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid profile-term-of-service-container"
                                columnClassName="my-masonry-grid_column"
                            >
                                {termOfServices.map((commissionTos) => (
                                    <div key={commissionTos._id} className="profile-term-of-service-item">
                                        <p><h3 className="fs-18 mb-8 mt-0">{commissionTos.title}</h3>
                                            Cập nhật vào {formatDate(commissionTos.updatedAt)}
                                            <br />
                                            {
                                                commissionTos.commissionServices && commissionTos.commissionServices.length > 0
                                                    ? `Áp dụng cho các dịch vụ: {commissionTos.commissionServices.map(service => service.title).join(', ')}`
                                                    : `Chưa áp dụng cho dịch vụ nào`
                                            }
                                        </p>
                                        <div>
                                            <strong>Nội dung:</strong>
                                            <hr />
                                            <p dangerouslySetInnerHTML={{ __html: limitString(commissionTos?.content, 250) }}></p>
                                        </div>
                                        <div className="mb-16">
                                            <button className="btn btn-md btn-2 mr-8" onClick={() => { setOverlayVisible(true); setSelectedCommissionTos(commissionTos); setShowUpdateCommissionTosForm(true) }}>Cập nhật</button>
                                            <button className="btn btn-md btn-4" onClick={() => { setOverlayVisible(true); setSelectedCommissionTos(commissionTos); setShowDeleteCommissionTosForm(true) }}>Xóa</button>
                                        </div>

                                    </div>
                                ))}
                            </Masonry >)
                        : (
                            <p className=""> Điều khoản dịch vụ giúp họa sĩ bảo vệ quyền lợi của mình khi làm việc trên Pastal.
                                <br />
                                <span className="highlight-text underlined-text hover-cursor-opacity" onClick={handleShowCreateCommissionTosForm}>Tạo điều khoản</span> thôi nào.</p>
                        )
                }
            </div >

            {/* Modal forms */}
            {
                overlayVisible && (
                    <div className="overlay">
                        {showCreateCommissionTosForm && <CreateCommissionTos setShowCreateCommissionTosForm={setShowCreateCommissionTosForm} setOverlayVisible={setOverlayVisible} />}
                        {showUpdateCommissionTosForm && <UpdateCommissionTos commissionTos={selectedCommissionTos} setShowUpdateCommissionTosForm={setShowUpdateCommissionTosForm} setOverlayVisible={setOverlayVisible} />}
                        {showDeleteCommissionTosForm && <DeleteCommissionTos commissionTos={selectedCommissionTos} setShowDeleteCommissionTosForm={setShowDeleteCommissionTosForm} setOverlayVisible={setOverlayVisible} />}
                    </div>
                )
            }
        </>
    );
}