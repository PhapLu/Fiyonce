import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/auth/AuthContext";
import { useModal } from "../../../contexts/modal/ModalContext";
import { resizeImageUrl } from "../../../utils/imageDisplayer";
import "./Follower.scss";
import { apiUtils } from "../../../utils/newRequest";

export default function Follower({ profileInfo, setShowFollowers, setProfileInfo, setOverlayVisible }) {
    const { userInfo, setUserInfo } = useAuth();
    const { setModalInfo } = useModal();
    const isProfileOwner = userInfo?._id === profileInfo._id;

    // State to track loading for each button
    const [loadingStates, setLoadingStates] = useState({});

    const followerRef = useRef();
    useEffect(() => {
        const handler = (e) => {
            if (followerRef.current && !followerRef.current.contains(e.target)) {
                setShowFollowers(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    const handleFollowUser = async (follower) => {
        if (!userInfo) {
            setModalInfo({
                status: "error",
                message: "Vui lòng đăng nhập để thực hiện thao tác"
            });
            return;
        }

        setLoadingStates(prev => ({ ...prev, [follower._id]: true }));
        try {
            await apiUtils.patch(`/user/followUser/${follower._id}`);

            // Update the userInfo state
            setUserInfo(prev => ({
                ...prev,
                following: [...prev.following, follower]
            }));

            // Update the local followers state if profile owner
            if (isProfileOwner) {
                setProfileInfo(prev => ({
                    ...prev,
                    following: [...prev.following, follower]
                }));
            }

            setModalInfo({
                status: "success",
                message: "Đã theo dõi"
            });
        } catch (error) {
            console.log(error)
            setModalInfo({
                status: "error",
                message: error.response.data.message
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, [follower._id]: false }));
        }
    };

    const handleUnFollowUser = async (follower) => {
        if (!userInfo) {
            setModalInfo({
                status: "error",
                message: "Vui lòng đăng nhập để thực hiện thao tác"
            });
            return;
        }

        setLoadingStates(prev => ({ ...prev, [follower._id]: true }));
        try {
            await apiUtils.patch(`/user/unFollowUser/${follower._id}`);

            // Update the userInfo state
            setUserInfo(prev => ({
                ...prev,
                following: prev.following.filter(f => f._id !== follower._id)
            }));

            // Update the local followers state if profile owner
            if (isProfileOwner) {
                setProfileInfo(prev => ({
                    ...prev,
                    following: prev.following.filter(f => f._id !== follower._id)
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
            setLoadingStates(prev => ({ ...prev, [follower._id]: false }));
        }
    };

    return (
        <div className="modal-form type-3 follower" ref={followerRef} onClick={(e) => { e.stopPropagation() }}>
            <h3 className="form__title">Người theo dõi</h3>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowFollowers(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <div className="follow-container">
                {profileInfo?.followers?.length > 0 ? (
                    profileInfo?.followers.map((follower) => (
                        <div className="follow-item" key={follower._id}>
                            <div className="user lg">
                                <div className="user--left">
                                    <img src={resizeImageUrl(follower?.avatar, 100)} className="user__avatar" alt="Avatar" />
                                </div>
                                <div className="user--right">
                                    <div className="user__name">
                                        <span className="user__name__title">{follower?.fullName}</span>
                                        <span className="user__name__sub-title">
                                            {follower?.stageName && `@${follower.stageName}`}
                                            {follower?.jobTitle && <>
                                                <span className="dot-delimiter sm"></span>
                                                {follower?.jobTitle}
                                            </>}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="btn-container">
                                {userInfo?.following?.some(followingEl => followingEl._id === follower._id) ? (
                                    <button
                                        className="btn btn-md btn-2"
                                        onClick={() => handleUnFollowUser(follower)}
                                        disabled={loadingStates[follower._id]}
                                    >
                                        {loadingStates[follower._id] ? "Đang hủy theo dõi..." : "Hủy theo dõi"}
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-md btn-4"
                                        onClick={() => handleFollowUser(follower)}
                                        disabled={loadingStates[follower._id]}
                                    >
                                        {loadingStates[follower._id] ? "Đang theo dõi..." : "Theo dõi"}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-align-center fs-16 mt-32">Hiện chưa có người theo dõi</p>
                )}
            </div>
        </div>
    );
}
