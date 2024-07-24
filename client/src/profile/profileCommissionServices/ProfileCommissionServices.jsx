import { useState, useEffect, useRef } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

// Resources
import Modal from "../../components/modal/Modal.jsx";
import { useAuth } from "../../contexts/auth/AuthContext.jsx";
import RenderCommissionTos from "../../components/crudCommissionTos/render/RenderCommissionTos.jsx";

import RenderCommissionService from "../../components/crudCommissionService/render/RenderCommissionService.jsx";
import CreateCommissionService from "../../components/crudCommissionService/create/CreateCommissionService.jsx";
import UpdateCommissionService from "../../components/crudCommissionService/update/UpdateCommissionService.jsx";
import DeleteCommissionService from "../../components/crudCommissionService/delete/DeleteCommissionService.jsx";

import RenderCommissionReviews from "../../components/crudCommissionReviews/render/RenderCommissionReviews.jsx";

import UpdateCommissionServiceCategory from "../../components/crudCommissionServiceCategory/update/UpdateCommissionServiceCategory.jsx";
import DeleteCommissionServiceCategory from "../../components/crudCommissionServiceCategory/delete/DeleteCommissionServiceCategory.jsx";

// Utils
import { formatCurrency, limitString } from "../../utils/formatter.js";
import { newRequest, apiUtils } from "../../utils/newRequest.js";

// Styling
import "./ProfileCommissionServices.scss";

export default function ProfileCommissionServices() {
    const { userId } = useParams();
    const {userInfo} = useAuth();
    const profileInfo = useOutletContext();
    // alert(profileInfo);
    const queryClient = useQueryClient();

    const isProfileOwner = userInfo?._id === userId;

    const [overlayVisible, setOverlayVisible] = useState(false);
    const [showCreateCommissionServiceForm, setShowCreateCommissionServiceForm] = useState(false);
    const [showUpdateCommissionServiceForm, setShowUpdateCommissionServiceForm] = useState(false);
    const [showDeleteCommissionServiceForm, setShowDeleteCommissionServiceForm] = useState(false);
    const [showUpdateCommissionServiceCategoryForm, setShowUpdateCommissionServiceCategoryForm] = useState(false);
    const [showDeleteCommissionServiceCategoryForm, setShowDeleteCommissionServiceCategoryForm] = useState(false);

    const [showRenderCommissionReviews, setShowRenderCommissionReviews] = useState(false);

    const [updateCommissionService, setUpdateCommissionService] = useState();
    const [deleteCommissionService, setDeleteCommissionService] = useState();
    const [updateCommissionServiceCategory, setUpdateCommissionServiceCategory] = useState()
    const [deleteCommissionServiceCategory, setDeleteCommissionServiceCategory] = useState();


    const [showCommissionTosView, setShowCommissionTosView ] = useState(false);

    const [showRenderCommissionService, setShowRenderCommissionService] = useState(false);
    const [renderCommissionServiceId, setRenderCommissionServiceId] = useState();

    const categoryRefs = useRef([]);
    categoryRefs.current = [];

    const createToRefs = (el) => {
        if (el && !categoryRefs.current.includes(el)) {
            categoryRefs.current.push(el);
        }
    };

    const fetchCommissionServiceCategories = async () => {
        try {
            const response = await newRequest.get(`/serviceCategory/readServiceCategoriesWithServices/${userId}`);
            console.log(response.data.metadata.categorizedServices)
            console.log(response)
            return response.data.metadata.categorizedServices;
        } catch (error) {
            console.error(error);
            return null;
        }
    };
    const [modalInfo, setModalInfo] = useState();

    const handleShowCreateCommissionService = async () => {
        try {
            // Check if talents has at least one commission tos
            const response = await newRequest.get(`/termOfService/readTermOfServices`);
            if (response && response.data.metadata.termOfServices.length > 0) {
                setShowCreateCommissionServiceForm(true); setOverlayVisible(true);
            } else {
                setModalInfo({ status: "warning", message: "Vui lòng tạo ít nhất 1 điều khoản dịch vụ trước" });
            }

        } catch (error) {
            setModalInfo({ status: "error", message: error.response.data.message });
            return;
        }
    }

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

    const createMutation = useMutation(
        (newService) => apiUtils.post(`/commissionService/createCommissionService`, newService),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['fetchCommissionServiceCategories', userId]);
                setShowCreateCommissionServiceForm(false);
                setOverlayVisible(false);
            },
        }
    );

    const updateMutation = useMutation(
        (fd) => apiUtils.patch(`/commissionService/updateCommissionService/${fd.get("_id")}`, fd),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['fetchCommissionServiceCategories', userId]);
                setShowUpdateCommissionServiceForm(false);
                setOverlayVisible(false);
            },
        }
    );


    // Commission Service Category
    const updateCommissionServiceCategoryMutation = useMutation(
        (updatedCategory) => apiUtils.patch(`/serviceCategory/updateServiceCategory/${updatedCategory._id}`, updatedCategory),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['fetchCommissionServiceCategories', userId]);
                setShowUpdateCommissionServiceCategoryForm(false);
                setOverlayVisible(false);
            },
            onError: (error) => {
                console.error('Error updating commission service category:', error);
            }
        }
    );

    const deleteCommissionServiceCategoryMutation = useMutation(
        (categoryId) => apiUtils.delete(`/serviceCategory/deleteServiceCategory/${categoryId}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['fetchCommissionServiceCategories', userId]);
                setShowDeleteCommissionServiceCategoryForm(false);
                setOverlayVisible(false);
            },
            onError: (error) => {
                console.error('Error deleting commission service category:', error);
            }
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

    const scrollContainerRef = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);

    const scrollLeft = () => {
        scrollContainerRef.current.scrollBy({
            top: 0,
            left: -300,
            behavior: 'smooth'
        });
    };

    const scrollRight = () => {
        scrollContainerRef.current.scrollBy({
            top: 0,
            left: 300,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftButton(scrollLeft > 0);
            setShowRightButton(scrollLeft + clientWidth < scrollWidth);
        };

        if (scrollContainerRef.current) {
            scrollContainerRef.current.addEventListener('scroll', handleScroll);
            handleScroll();
        }

        return () => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [commissionServiceCategories]);

    if (isLoading) {
        return <span>Đang tải...</span>
    }

    if (isError) {
        return <span>Have an errors: {error.message}</span>
    }
    return (
        <div className="profile-commission-services">
            <div className="profile-page__header">
                <div className={`profile-page__header--left ${!isProfileOwner && 'full'}`} >
                    <button onClick={() => { setShowRenderCommissionReviews(true); setOverlayVisible(true) }} className="btn btn-4 btn-md view-review-btn flex-align-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg> 4 (2 đánh giá)
                    </button>
                    <div className="scroll">
                        <div className="scroll-container" ref={scrollContainerRef}>
                            <button className={`button button-left ${showLeftButton ? 'show' : ''}`} onClick={scrollLeft}>&lt;</button>
                            {commissionServiceCategories?.map((category, index) => (
                                <button
                                    className="btn btn-3 btn-md scroll-item"
                                    key={index}
                                    onClick={() => scrollToCategory(index)}
                                >
                                    {category.title}
                                </button>
                            ))}
                            <button className={`button button-right ${showRightButton ? 'show' : ''}`} onClick={scrollRight}>&gt;</button>
                        </div>
                    </div>
                </div>
                {isProfileOwner &&
                    <div className="profile-page__header--right">
                        <button className="btn btn-3" onClick={() => { setShowCommissionTosView (true); setOverlayVisible(true) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
                            </svg>
                            Điều khoản
                        </button>
                        <button className="btn btn-3" onClick={handleShowCreateCommissionService}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Dịch vụ
                        </button>
                    </div>
                }
            </div>

            {commissionServiceCategories?.length <= 0 ?
                (
                    <p>{isProfileOwner ? "Bạn" : `${profileInfo?.stageName || profileInfo?.fullName}`} hiện chưa có dịch vụ nào.</p>
                ) : (commissionServiceCategories?.map((category, index) => (
                    <div
                        key={index}
                        ref={createToRefs}
                        className="profile-commission-service__category-container"
                    >
                        <div className="profile-commission-service__category-item">
                            {
                                isProfileOwner &&
                                <>
                                    <button onClick={() => { setUpdateCommissionServiceCategory(category); setShowUpdateCommissionServiceCategoryForm(true); setOverlayVisible(true); }} className="btn btn-3 icon-only profile-commission-service__category-item__update-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </button>
                                    <button onClick={() => { setDeleteCommissionServiceCategory(category); setShowDeleteCommissionServiceCategoryForm(true); setOverlayVisible(true); }} className="btn btn-3 icon-only profile-commission-service__category-item__delete-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </>
                            }


                            <h4 className="profile-commission-service__category-item__header">{category.title}</h4>
                            <br />
                            <div className="profile-commission-service__category-item__service-container">
                                {category.commissionServices?.map((service, serviceIndex) => (
                                    <div key={serviceIndex} className="profile-commission-service__category-item__service-item">
                                        <div className="profile-commission-service__category-item__service-item--left images-layout-3">
                                            {service?.artworks.slice(0, 3)?.map((artwork, artworkIndex) => (
                                                <img key={artworkIndex} src={artwork} alt={`Artwork ${artworkIndex + 1}`} />
                                            ))}
                                        </div>
                                        {/* {!isProfileOwner &&
                                            <button className="btn btn-3 icon-only bookmark-service-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 bookmark-service-btn__ic">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                                </svg>
                                            </button>
                                        } */}
                                        <div className="profile-commission-service__category-item__service-item--right">
                                            <h3>{service?.title}</h3>
                                            <h4>Giá từ: <span className="highlight-text">{formatCurrency(service?.minPrice)} VND</span></h4>
                                            <p className="profile-commission-service__category-item__service-item__deliverables">{limitString(service?.deliverables, 300)}</p>
                                            {service?.notes && (<p className="profile-commission-service__category-item__service-item__note">*Lưu ý: {service?.notes}</p>)}
                                            {isProfileOwner ? (
                                                <>
                                                    <button className="btn btn-2 btn-md" onClick={() => { setUpdateCommissionService({ ...service, categoryId: category._id, categoryTitle: category.title }); setShowUpdateCommissionServiceForm(true); setOverlayVisible(true) }}>Chỉnh sửa</button>
                                                    <button className="btn btn-3 btn-md" onClick={() => { setDeleteCommissionService(service); setShowDeleteCommissionServiceForm(true); setOverlayVisible(true) }}>Xóa</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className="btn btn-2 btn-md" onClick={() => { setRenderCommissionServiceId(service._id); setShowRenderCommissionService(true); setOverlayVisible(true) }}>Đặt ngay</button>
                                                    <button className="btn btn-3 btn-md">Liên hệ</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )))}

            {modalInfo && <Modal modalInfo={modalInfo} />}

            {/* {
                <Modal status={"success"} message={"Đăng kí thành công"} />
            } */}

            {/* Modal forms */}
            {overlayVisible && (
                <div className={`overlay`}>
                    {/* CRUD commisssion service */}
                    {
                        showRenderCommissionService &&
                        <RenderCommissionService
                            commissionServiceId={renderCommissionServiceId}
                            setShowRenderCommissionService={setShowRenderCommissionService}
                            setOverlayVisible={setOverlayVisible}
                        />

                    }

                    {showCreateCommissionServiceForm &&
                        <CreateCommissionService
                            commissionServiceCategories={commissionServiceCategories}
                            setShowCreateCommissionServiceForm={setShowCreateCommissionServiceForm}
                            setOverlayVisible={setOverlayVisible}
                            createMutation={createMutation}
                        />
                    }

                    {showUpdateCommissionServiceForm &&
                        <UpdateCommissionService
                            updateCommissionService={updateCommissionService}
                            commissionServiceCategories={commissionServiceCategories}
                            setShowUpdateCommissionServiceForm={setShowUpdateCommissionServiceForm}
                            setOverlayVisible={setOverlayVisible}
                            updateMutation={updateMutation}
                        />
                    }

                    {showDeleteCommissionServiceForm &&
                        <DeleteCommissionService
                            deleteCommissionService={deleteCommissionService}
                            setShowDeleteCommissionServiceForm={setShowDeleteCommissionServiceForm}
                            setOverlayVisible={setOverlayVisible}
                            deleteMutation={deleteMutation}
                        />
                    }

                    {/* Commisssion service category */}
                    {showUpdateCommissionServiceCategoryForm &&
                        <UpdateCommissionServiceCategory
                            updateCommissionServiceCategory={updateCommissionServiceCategory}
                            setShowUpdateCommissionServiceCategoryForm={setShowUpdateCommissionServiceCategoryForm}
                            setOverlayVisible={setOverlayVisible}
                            updateCommissionServiceCategoryMutation={updateCommissionServiceCategoryMutation}
                        />
                    }
                    {showDeleteCommissionServiceCategoryForm &&
                        <DeleteCommissionServiceCategory
                            deleteCommissionServiceCategory={deleteCommissionServiceCategory}
                            setShowDeleteCommissionServiceCategoryForm={setShowDeleteCommissionServiceCategoryForm}
                            setOverlayVisible={setOverlayVisible}
                            deleteCommissionServiceCategoryMutation={deleteCommissionServiceCategoryMutation}
                        />
                    }

                    {/* Commission TOS */}
                    {showCommissionTosView &&
                        <RenderCommissionTos
                            setShowCommissionTosView ={setShowCommissionTosView }
                            setOverlayVisible={setOverlayVisible}
                        />
                    }

                    {/* Reviews */}
                    {showRenderCommissionReviews &&
                        <RenderCommissionReviews setShowRenderCommissionReviews={setShowRenderCommissionReviews}
                            setOverlayVisible={setOverlayVisible} />
                    }
                </div>
            )}
        </div>
    );
}