import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiUtils } from '../../utils/newRequest';
import CreateMovement from "../../components/crudMovement/create/CreateMovement";
import UpdateMovement from "../../components/crudMovement/update/UpdateMovement";
import DeleteMovement from "../../components/crudMovement/delete/DeleteMovement";

// Import badge data
import badgeData from '../../data/badge/badges.json';

// Import all badge icons
import EarlyBirdIcon from "../../assets/img/early-bird-badge.png";
import TrustedArtistIcon from "../../assets/img/trusted-artist-badge.png";
import CommunityBuilderIcon from "../../assets/img/community-builder-badge.png";
import PlatformAmbassadorIcon from "../../assets/img/platform-ambassador-badge.png";
import RisingStarIcon from "../../assets/img/fresher-artist-badge.png";
import SuperstarIcon from "../../assets/img/fresher-artist-badge.png";
import FresherArtistIcon from "../../assets/img/fresher-artist-badge.png";
import JuniorArtistIcon from "../../assets/img/junior-artist-badge.png";
import SeniorArtistIcon from "../../assets/img/senior-artist-badge.png";
import { useModal } from '../../contexts/modal/ModalContext';
import { formatDatetime } from '../../utils/formatter';

// Map badge keys to their corresponding icons
const badgeIcons = {
    earlyBird: EarlyBirdIcon,
    trustedArtist: TrustedArtistIcon,
    communityBuilder: CommunityBuilderIcon,
    platformAmbassador: PlatformAmbassadorIcon,
    risingStar: RisingStarIcon,
    superstar: SuperstarIcon,
    fresherArtist: FresherArtistIcon,
    juniorArtist: JuniorArtistIcon,
    seniorArtist: SeniorArtistIcon,
};

export default function ArtDashboard() {
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [showCreateMovementForm, setShowCreateMovementForm] = useState(false);
    const [showUpdateMovementForm, setShowUpdateMovementForm] = useState(false);
    const [showDeleteMovementForm, setShowDeleteMovementForm] = useState(false);
    const [selectedMovement, setSelectedMovement] = useState(null);

    const queryClient = useQueryClient();
    const badgeLookup = badgeData.reduce((acc, badge) => {
        acc[badge.key] = badge;
        return acc;
    }, {});
    console.log(badgeData)

    const fetchMovements = async () => {
        try {
            const response = await apiUtils.get("/movement/readMovements");
            return response.data.metadata.movements;
        } catch (error) {
            return null;
        }
    };

    const { data: movements, isError, error, isLoading } = useQuery('fetchMovements', fetchMovements);
    const createMovementMutation = useMutation(
        (newMovement) => apiUtils.post("/movement/createMovement", newMovement),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchMovements');
                setOverlayVisible(false);
                setShowCreateMovementForm(false);
            }
        }
    );
    const updateMovementMutation = useMutation(
        (movement) => apiUtils.patch(`/movement/updateMovement/${movement._id}`, movement),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('movements');
                setOverlayVisible(false);
                setShowCreateMovementForm(false);
            }
        }
    );
    const deleteMovementMutation = useMutation(
        (movement) => apiUtils.delete(`/movement/deleteMovement/${movement._id}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('movements');
                setOverlayVisible(false);
                setShowCreateMovementForm(false);
            }
        }
    );

    const handleUpdate = (movement) => {
        setSelectedMovement(movement);
        setShowUpdateMovementForm(true);
        setOverlayVisible(true);
    };

    const handleDelete = (movement) => {
        setSelectedMovement(movement);
        setShowDeleteMovementForm(true);
        setOverlayVisible(true);
    };

    const [showCreateChallenge, setShowCreateChallenge] = useState(false);
    const [showUpdateChallenge, setShowUpdateChallenge] = useState(false);
    const [showDeleteChallenge, setShowDeleteChallenge] = useState(false);
    const [challenge, setChallenge] = useState(null);
    const [isSubmitCreateChallengeLoading, setIsSubmitCreateChallengeLoading] = useState(false);
    const { setModalInfo } = useModal();

    const fetchChallenges = async () => {
        try {
            const response = await apiUtils.get("/challenge/readChallenges");
            console.log(response.data.metadata.challenges);
            return response.data.metadata.challenges;
        } catch (error) {
            return null;
        }
    };

    const { data: challenges, isFetchingChallengesError, fetchingChallengesError, isFetchingChallengesLoading } = useQuery('fetchChallenges', fetchChallenges);
    const createChallengeMutation = useMutation(
        (newChallenge) => apiUtils.post("/challenge/createChallenge", newChallenge),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchChallenges');
                setOverlayVisible(false);
                setShowCreateChallenge(false);
                setModalInfo({
                    status: "success",
                    message: "Tạo thử thách thành công"
                })
            },
            onError: (error) => {
                setModalInfo({
                    status: "error",
                    message: error.response.data.message
                })
            },
        }
    );

    const updateChallengeMutation = useMutation(
        (updatedChallenge) => apiUtils.patch(`/challenge/updateChallenge/${updatedChallenge.get("_id")}`, updatedChallenge),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchChallenges');
                setOverlayVisible(false);
                setShowUpdateChallenge(false);
                setModalInfo({
                    status: "success",
                    message: "Cập nhật thử thách thành công"
                })
            },
            onError: (error) => {
                setModalInfo({
                    status: "error",
                    message: error.response.data.message
                })
            },
        }
    );

    const deleteChallengeMutation = useMutation(
        (challengeId) => apiUtils.delete(`/challenge/deleteChallenge/${challengeId}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchChallenges');
                setOverlayVisible(false);
                setShowDeleteChallenge(false);
                setModalInfo({
                    status: "success",
                    message: "Xóa thử thách thành công"
                })
            },
            onError: (error) => {
                setModalInfo({
                    status: "error",
                    message: error.response.data.message
                })
            },
        }
    );

    if (isLoading || isFetchingChallengesLoading) return <div>Loading...</div>;
    if (isError || isFetchingChallengesError) return <div>Error: {fetchingChallengesError.message}</div>;

    return (
        <>
            <div className="dashboard-account">
                <section className="section overview">
                    <div className="section-header">
                        <div className="section-header--left">
                            <h3 className="section-header__title">Trường phái</h3>
                            <svg onClick={() => { setShowCreateMovementForm(true), setOverlayVisible(true) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 btn add-btn">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Trường phái</th>
                                <th>SL tác phẩm</th>
                                <th>SL dịch vụ</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movements?.length > 0 ? (
                                movements.map((movement, index) => (
                                    <tr key={movement._id}>
                                        <td>{index + 1}</td>
                                        <td>{movement.title}</td>
                                        <td>{movement.postCount}</td>
                                        <td>{movement.commissionServiceCount}</td>
                                        <td>
                                            <button className="btn btn-2" onClick={() => handleUpdate(movement)}>Chỉnh sửa</button>
                                            <button className="btn btn-3" onClick={() => handleDelete(movement)}>Xóa</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">Không có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </div>


            {/* Badges */}
            <section className="section overview">
                <div className="section-header">
                    <div className="section-header--left">
                        <h3 className="section-header__title">Huy hiệu</h3>
                        <svg onClick={() => { setOverlayVisible(true); setShowCreateBadge(true) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 btn add-btn">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>STT</th>
                            <th>Tên huy hiệu</th>
                            <th>Mô tả</th>
                            <th>SL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {badgeData?.map((badge, index) => {
                            const icon = badgeIcons[badge.key];
                            return (
                                <tr>
                                    <td><img className="user-badge-item__icon" src={icon} alt={badge.title} /></td>
                                    <td>{index + 1}</td>
                                    <td>{badge?.title}</td>
                                    <td>{badge?.description}</td>
                                    <td>{}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section >

            {/* Challenges */}
            <section className="section overview">
                <div className="section-header">
                    <div className="section-header--left">
                        <h3 className="section-header__title">Thử thách</h3>
                        <svg onClick={() => { setOverlayVisible(true); setShowCreateChallenge(true) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 btn add-btn">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>STT</th>
                            <th>Tiêu đề</th>
                            <th>Riêng tư</th>
                            <th>Nội dung</th>
                            <th>Thời gian</th>
                            <th>Lượt xem</th>
                            <th>Cập nhật lúc</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            challenges?.length > 0 ? (
                                challenges.map((challenge, index) => (
                                    <tr key={challenge._id}>
                                        <td><img src={challenge.thumbnail} alt="" /></td>
                                        <td>{index + 1}</td>
                                        <td><span className='fw-bold'>{challenge.title}</span></td>
                                        <td>{challenge.isPrivate == true ? "Có" : "Không"}</td>
                                        <td dangerouslySetInnerHTML={{ __html: challenge.description }}></td>
                                        <td>{formatDatetime(challenge.startDate)} - {formatDatetime(challenge.endDate)}</td>
                                        <td>{challenge.views}</td>
                                        <td>{challenge?.updatedAt}</td>
                                        <td>
                                            <button className="btn btn-2" onClick={() => { setChallenge(challenge); setOverlayVisible(true); setShowUpdateChallenge(true) }}>Chỉnh sửa</button>
                                            <button className="btn btn-3" onClick={() => { setChallenge(challenge); setOverlayVisible(true); setShowDeleteChallenge(true) }}>Xóa</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className='text-align-center pt-16 pb-16'>Không có dữ liệu</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </section >

            {overlayVisible && (
                <div className="overlay">
                    {showCreateMovementForm && (
                        <CreateMovement
                            setShowCreateMovementForm={setShowCreateMovementForm}
                            createMovementMutation={createMovementMutation}
                            setOverlayVisible={setOverlayVisible}
                        />
                    )}
                    {showUpdateMovementForm && selectedMovement && (
                        <UpdateMovement
                            setShowUpdateMovementForm={setShowUpdateMovementForm}
                            setOverlayVisible={setOverlayVisible}
                            movement={selectedMovement}
                            updateMovementMutation={updateMovementMutation}
                        />
                    )}
                    {showDeleteMovementForm && selectedMovement && (
                        <DeleteMovement
                            setShowDeleteMovementForm={setShowDeleteMovementForm}
                            setOverlayVisible={setOverlayVisible}
                            movement={selectedMovement}
                            deleteMovementMutation={deleteMovementMutation}
                        />
                    )}
                </div>
            )}
        </>
    );
}