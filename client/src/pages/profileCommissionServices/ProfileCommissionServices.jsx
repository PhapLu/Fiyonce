import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

// Resources
import CommissionTos from "../../components/commissionTos/CommissionTos.jsx";
import AddCommissionTos from "../../components/commissionTos/add/AddCommissionTos.jsx";
import AddCommissionService from "../../components/crudCommissionService/add/AddCommissionService.jsx";
import EditCommissionService from "../../components/crudCommissionService/edit/EditCommissionService.jsx";
import DeleteCommissionService from "../../components/crudCommissionService/delete/DeleteCommissionService.jsx";
import { useAuth } from "../../contexts/auth/AuthContext.jsx";

// Utils
import { limitString } from "../../utils/formatter.js";
import { newRequest, apiUtils } from "../../utils/newRequest.js";
// Styling
import "./ProfileCommissionServices.scss";

export default function Profileservices() {
    const { userInfo } = useAuth();
    const { userId } = useParams();
    const queryClient = useQueryClient();

    const isProfileOwner = userInfo && userInfo._id === userId;

    const [overlayVisible, setOverlayVisible] = useState(false);
    const [showAddCommissionServiceForm, setShowAddCommissionServiceForm] = useState(false);
    const [showEditCommissionServiceForm, setShowEditCommissionServiceForm] = useState(false);
    const [showDeleteCommissionServiceForm, setShowDeleteCommissionServiceForm] = useState(false);

    const [editCommissionService, setEditCommissionService] = useState();
    const [deleteCommissionService, setDeleteCommissionService] = useState();

    const [showCommissionTosView, setShowCommissionTosView] = useState(false);
    const [showAddCommissionTosForm, setShowAddCommissionTosForm] = useState(false);

    const categoryRefs = useRef([]);
    categoryRefs.current = [];

    const addToRefs = (el) => {
        if (el && !categoryRefs.current.includes(el)) {
            categoryRefs.current.push(el);
        }
    };

    const fetchCommissionServiceCategories = async () => {
        try {
            const response = await newRequest.get(`/serviceCategory/readServiceCategoriesWithServices/${userId}`);
            console.log("RESPONSE")
            console.log(response)
            return response.data.metadata.categorizedServices;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const { data: commissionServiceCategories, error, isError, isLoading } = useQuery(
        ['fetchCommissionServiceCategories', userId], 
        fetchCommissionServiceCategories, 
        {
            onError: (error) => {
                console.error('Error fetching commissions by categories:', error);
            },
        }
    );

    const deleteMutation = useMutation(
        (serviceId) => apiUtils.delete(`/commissionService/deleteCommissionService/${serviceId}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['fetchCommissionServiceCategories', userId]);
                setShowDeleteCommissionServiceForm(false);
                setOverlayVisible(false);
            },
        }
    );

    const addMutation = useMutation(
        (newService) => apiUtils.post(`/commissionService/createCommissionService`, newService),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['fetchCommissionServiceCategories', userId]);
                setShowAddCommissionServiceForm(false);
                setOverlayVisible(false);
            },
        }
    );

    const scrollToCategory = (index) => {
        const element = categoryRefs.current[index];
        const offset = -80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset + offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
        });
    };

    const [reviews, setReviews] = useState([
        {
            content: "Very good artist",
            rating: 4.0,
        }
    ]);
    const averageRating = 4.0;

    return (
        <div className="profile-commission-services">
            <div className="profile-page__header">
                <div className="profile-page__header--left">
                    <button className="btn btn-4 btn-md"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg> {averageRating}
                        ({reviews.length} đánh giá)</button>
                    {commissionServiceCategories?.map((category, index) => (
                        <button
                            className="btn btn-3 btn-md"
                            key={index}
                            onClick={() => scrollToCategory(index)}
                        >
                            {category.title}
                        </button>
                    ))}
                </div>
                <div className="profile-page__header--right">
                    <button className="btn btn-3" onClick={() => { setShowCommissionTosView(true); setOverlayVisible(true) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
                        </svg>
                        Điều khoản
                    </button>
                    <button className="btn btn-3" onClick={() => { setShowAddCommissionServiceForm(true); setOverlayVisible(true) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Dịch vụ
                    </button>
                </div>
            </div>

            {commissionServiceCategories?.map((category, index) => (
                <div
                    key={index}
                    ref={addToRefs}
                    className="profile-commission-service__category-container"
                >
                    <div className="profile-commission-service__category-item">
                        <h4 className="profile-commission-service__category-item__header">{category.title}</h4>
                        <br />
                        <div className="profile-commission-service__category-item__service-container">
                            {category.commissionServices?.map((service, index) => (
                                <>
                                    <div key={index} className="profile-commission-service__category-item__service-item">
                                        <div className="profile-commission-service__category-item__service-item--left images-layout-3">
                                            {service?.artworks.slice(0, 3)?.map((artwork, index) => (
                                                <>
                                                    <img key={index} src={artwork} alt={`Artwork ${index + 1}`} />
                                                </>
                                            ))}
                                        </div>

                                        {!isProfileOwner &&
                                            <button className="btn btn-3 bookmark-service-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 bookmark-service-btn__ic">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                                </svg>
                                            </button>
                                        }

                                        <div className="profile-commission-service__category-item__service-item--right">
                                            <h3>{service?.title}</h3>
                                            <h4>Giá từ: {service?.minPrice} VND</h4>
                                            <p className="profile-commission-service__category-item__service-item__deliverables">{limitString(service?.deliverables, 300)}</p>
                                            {service?.notes && (<p className="profile-commission-service__category-item__service-item__note">*Lưu ý: {service?.notes}</p>)}
                                            
                                            {isProfileOwner ? (
                                                <>    <button className="btn btn-2 btn-md" onClick={() => { setEditCommissionService({ ...service, categoryId: category._id, categoryTitle: category.title }); setShowEditCommissionServiceForm(true); setOverlayVisible(true) }}>Chỉnh sửa</button>
                                                    <button className="btn btn-3 btn-md" onClick={() => { setDeleteCommissionService(service); setShowDeleteCommissionServiceForm(true); setOverlayVisible(true) }}>Xóa</button></>
                                            ) : (
                                                <>    <button className="btn btn-2 btn-md">Đặt ngay</button>
                                                    <button className="btn btn-3 btn-md">Liên hệ</button></>
                                            )}

                                        </div>
                                    </div>
                                    <hr />
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            {/* Modal forms */}
            {overlayVisible && (
                <div className={`overlay`}>
                    {showAddCommissionServiceForm &&

                        <AddCommissionService
                            commissionServiceCategories={commissionServiceCategories}
                            setShowAddCommissionServiceForm={setShowAddCommissionServiceForm}
                            setOverlayVisible={setOverlayVisible}
                            addMutation={addMutation} />}

                    {showEditCommissionServiceForm && <EditCommissionService
                        editCommissionService={editCommissionService}
                        commissionServiceCategories={commissionServiceCategories}
                        setShowEditCommissionServiceForm={setShowEditCommissionServiceForm} setOverlayVisible={setOverlayVisible} />}

                    {showDeleteCommissionServiceForm && <DeleteCommissionService
                        deleteCommissionService={deleteCommissionService}
                        setShowDeleteCommissionServiceForm={setShowDeleteCommissionServiceForm} setOverlayVisible={setOverlayVisible} deleteMutation={deleteMutation} />}

                    {showCommissionTosView && <CommissionTos setShowAddCommissionTosForm={setShowAddCommissionTosForm} setShowCommissionTosView={setShowCommissionTosView} setOverlayVisible={setOverlayVisible} />}
                    {showAddCommissionTosForm && <AddCommissionTos setShowAddCommissionTosForm={setShowAddCommissionTosForm} setOverlayVisible={setOverlayVisible} />}
                </div>)}
        </div>
    );
}