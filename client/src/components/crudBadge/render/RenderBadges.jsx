import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../contexts/auth/AuthContext";
import badges from "../../../data/badge/badges.json";
import "./RenderBadges.scss";
import { limitString } from "../../../utils/formatter";
import { LazyLoadImage } from "react-lazy-load-image-component";

// Import all badge icons
import EarlyBirdIcon from "../../../assets/img/early-bird-badge.png";
import TrustedArtistIcon from "../../../assets/img/trusted-artist-badge.png";
import CommunityBuilderIcon from "../../../assets/img/community-builder-badge.png";
import PlatformAmbassadorIcon from "../../../assets/img/platform-ambassador-badge.png";
import RisingStarIcon from "../../../assets/img/fresher-artist-badge.png";
import SuperstarIcon from "../../../assets/img/fresher-artist-badge.png";
import FresherArtistIcon from "../../../assets/img/fresher-artist-badge.png";
import JuniorArtistIcon from "../../../assets/img/junior-artist-badge.png";
import SeniorArtistIcon from "../../../assets/img/senior-artist-badge.png";
import { apiUtils } from "../../../utils/newRequest";
import { useModal } from "../../../contexts/modal/ModalContext";

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

export default function RenderBadges({ setShowRenderBadges, setOverlayVisible }) {
    const { userInfo, setUserInfo } = useAuth();
    const { setModalInfo } = useModal();
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [isClaimable, setIsClaimable] = useState(null);

    const renderBadgesRef = useRef();
    useEffect(() => {
        const handler = (e) => {
            if (renderBadgesRef.current && !renderBadgesRef.current.contains(e.target)) {
                setShowRenderBadges(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [setShowRenderBadges, setOverlayVisible]);

    const getIcon = (badgeKey) => badgeIcons[badgeKey]; // Use default icon if key not found

    const fetchBadgeClaimStatus = async (badgeKey) => {
        try {
            console.log(badgeKey)
            const response = await apiUtils.get(`/badge/readBadge/${badgeKey}`);

            console.log(response)
            setIsClaimable(response.data.metadata.claimable);

        } catch (error) {
            console.error("Error fetching badge claim status:", error);
        }
    };
    const handleClaimBadge = async () => {
        try {
            const response = await apiUtils.patch(`/badge/awardBadge/${selectedBadge.key}`);
            if (response) {
                console.log(response);

                // Update userInfo with the new badge
                const updatedBadges = [...userInfo.badges, selectedBadge.key];
                setUserInfo({ ...userInfo, badges: updatedBadges });

                setIsClaimable(false); // Update to show "Đã nhận" after claiming
                setModalInfo({
                    status: "congrat",
                    message: "Nhận huy hiệu thành công"
                });
            }
        } catch (error) {
            console.error("Error claiming badge:", error);
            setModalInfo({
                status: "error",
                message: error.message.response.data
            })
        }
    }

    const handleBadgeSelect = (badge) => {
        setSelectedBadge(badge);
        fetchBadgeClaimStatus(badge.key);
    };


    return (
        <div className="render-badges modal-form type-3" ref={renderBadgesRef}>
            <h2 className="form__title">Huy hiệu</h2>
            <svg onClick={() => { setShowRenderBadges(false); setSelectedBadge(null); setOverlayVisible(false) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 form__close-ic">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            <hr />
            {
                selectedBadge ? (
                    <div className="render-badge badge-details">
                        <div className="form__back-ic" onClick={() => { setSelectedBadge(null); setIsClaimable(null); }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                            </svg>
                        </div>
                        <img src={getIcon(selectedBadge.key)} alt={selectedBadge?.icon} className="badge-details__ic" />
                        <h3 className="text-align-center badge-item__title">{selectedBadge.title}</h3>
                        <p className="text-align-justify">{selectedBadge?.description}</p>

                        {
                            userInfo?.badges?.includes(selectedBadge?.key) ?
                                (<button
                                    className={`btn btn-4 btn-md w-100 mt-16 mb-16 `}
                                    disabled={!isClaimable}
                                >
                                    Đã nhận
                                </button>) : 
                                    (<button
                                        className={`btn ${isClaimable ? "btn-2" : "btn-4 inactive"} btn-md w-100 mt-16 mb-16 `}
                                        onClick={isClaimable ? handleClaimBadge : null}
                                        disabled={!isClaimable}
                                    >
                                        Nhận huy hiệu
                                    </button>)
                        }
                    </div>
                ) : (
                    <div className="badge-container">
                        {badges?.map((badge, index) => {
                            const icon = getIcon(badge.key);
                            return (
                                <div className="badge-item" key={index} onClick={() => handleBadgeSelect(badge)}>
                                    <img src={icon} alt={badge.icon} className="badge-item__ic" />
                                    <h4 className="badge-item__title">{badge.title}</h4>
                                </div>
                            );
                        })}
                    </div>
                )
            }
        </div >
    );
}