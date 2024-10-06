import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/auth/AuthContext";
import { useModal } from "../../../contexts/modal/ModalContext";
import { resizeImageUrl } from "../../../utils/imageDisplayer";
import "./Following.scss";
import { apiUtils } from "../../../utils/newRequest";
import { useQuery } from "react-query";

export default function Following({ profileInfo, setShowFollowing, setProfileInfo, setOverlayVisible }) {
    const { userInfo, setUserInfo } = useAuth();
    const { setModalInfo } = useModal();
    const isProfileOwner = userInfo?._id === profileInfo._id;

    // State to track loading for each button
    const [loadingStates, setLoadingStates] = useState({});

    const followingRef = useRef();
    useEffect(() => {
        const handler = (e) => {
            if (followingRef.current && !followingRef.current.contains(e.target)) {
                setShowFollowing(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    const handleFollowUser = async (following) => {
        if (!userInfo) {
            setModalInfo({
                status: "error",
                message: "Vui lòng đăng nhập để thực hiện thao tác"
            });
            return;
        }

        setLoadingStates(prev => ({ ...prev, [following._id]: true }));
        try {
            await apiUtils.patch(`/user/followUser/${following._id}`);

            // Update the userInfo state
            setUserInfo(prev => ({
                ...prev,
                following: [...prev.following, following]
            }));

            // Update the local following state if profile owner
            if (isProfileOwner) {
                setProfileInfo(prev => ({
                    ...prev,
                    following: [...prev.following, following]
                }));
            }

            setModalInfo({
                status: "success",
                message: "Đã theo dõi"
            });
        } catch (error) {
            setModalInfo({
                status: "error",
                message: error.response.data.message
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, [following._id]: false }));
        }
    };

    const handleUnFollowUser = async (following) => {
        if (!userInfo) {
            setModalInfo({
                status: "error",
                message: "Vui lòng đăng nhập để thực hiện thao tác"
            });
            return;
        }

        setLoadingStates(prev => ({ ...prev, [following._id]: true }));
        try {
            await apiUtils.patch(`/user/unFollowUser/${following._id}`);

            // Update the userInfo state
            setUserInfo(prev => ({
                ...prev,
                following: prev.following.filter(f => f._id !== following._id)
            }));

            // Update the local following state if profile owner
            if (isProfileOwner) {
                setProfileInfo(prev => ({
                    ...prev,
                    following: prev.following.filter(f => f._id !== following._id)
                }));
            }

            setModalInfo({
                status: "success",
                message: "Đã hủy theo dõi"
            });
        } catch (error) {
            setModalInfo({
                status: "error",
                message: error.response.data.message
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, [following._id]: false }));
        }
    };

    const fetchUsersToFollow = async () => {
        try {
            // Fetch posts data
            const response = await apiUtils.get(`/recommender/recommendUsersToFollow`);
            console.log(response.data.metadata.usersToFollow)
            return response.data.metadata.usersToFollow;
        } catch (error) {
            console.log(error)
            throw new Error("Error fetching posts");
        }
    };

    const {
        data: usersToFollow = [],
        error,
        isError,
        isLoading,
    } = useQuery("fetchUsersToFollow", fetchUsersToFollow, {
        enabled: isProfileOwner, // Only fetch if the user is the profile owner
    });

    return (
        <div className="modal-form type-3 following" ref={followingRef} onClick={(e) => { e.stopPropagation() }}>
            <h3 className="form__title">Đang theo dõi</h3>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowFollowing(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <div className="follow-container">
                {profileInfo?.followings?.length > 0 ? (
                    profileInfo?.followings.map((following) => (
                        <div className="follow-item" key={following._id}>
                            <div className="user lg">
                                <div className="user--left">
                                    <img src={resizeImageUrl(following?.avatar, 100)} className="user__avatar" alt="Avatar" />
                                </div>
                                <div className="user--right">
                                    <div className="user__name">
                                        <span className="user__name__title">{following?.fullName}</span>
                                        <span className="user__name__sub-title">
                                            {following?.stageName && `@${following.stageName}`}
                                            {following?.jobTitle && <>
                                                <span className="dot-delimiter sm"></span>
                                                {following?.jobTitle}
                                            </>}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="btn-container">
                                {userInfo?.following?.some(followingEl => followingEl._id === following._id) ? (
                                    <button
                                        className="btn btn-md btn-2"
                                        onClick={() => handleUnFollowUser(following)}
                                        disabled={loadingStates[following._id]}
                                    >
                                        {loadingStates[following._id] ? "Đang hủy theo dõi..." : "Hủy theo dõi"}
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-md btn-4"
                                        onClick={() => handleFollowUser(following)}
                                        disabled={loadingStates[following._id]}
                                    >
                                        {loadingStates[following._id] ? "Đang theo dõi..." : "Theo dõi"}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    !isProfileOwner ?
                        <p className="text-align-center fs-16 mt-32">Hiện {profileInfo?.fullName} chưa theo dõi người khác</p>
                        :
                        <>
                            <p className="text-align-center fs-16 mt-32">Hiện chưa theo dõi người khác</p>
                            <hr />
                            <h4 className="text-align-center">Bạn có thể quen</h4>


                            {
                                usersToFollow.map((following) => (
                                    <div className="follow-item" key={following._id}>
                                        <div className="user lg">
                                            <div className="user--left">
                                                <img src={resizeImageUrl(following?.avatar, 100)} className="user__avatar" alt="Avatar" />
                                            </div>
                                            <div className="user--right">
                                                <div className="user__name">
                                                    <span className="user__name__title">{following?.fullName}</span>
                                                    <span className="user__name__sub-title">
                                                        {following?.stageName && `@${following.stageName}`}
                                                        {following?.jobTitle && <>
                                                            <span className="dot-delimiter sm"></span>
                                                            {following?.jobTitle}
                                                        </>}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="btn-container">
                                            {userInfo?.following?.some(followingEl => followingEl._id === following._id) ? (
                                                <button
                                                    className="btn btn-md btn-2"
                                                    onClick={() => handleUnFollowUser(following)}
                                                    disabled={loadingStates[following._id]}
                                                >
                                                    {loadingStates[following._id] ? "Đang hủy theo dõi..." : "Hủy theo dõi"}
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-md btn-4"
                                                    onClick={() => handleFollowUser(following)}
                                                    disabled={loadingStates[following._id]}
                                                >
                                                    {loadingStates[following._id] ? "Đang theo dõi..." : "Theo dõi"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            }
                        </>
                )}
            </div>
        </div>
    );
}
