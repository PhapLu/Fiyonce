// Import badge data
import badgeData from '../../../data/badge/badges.json';
import "./UserBadge.scss";

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

export default function UserBadge({ size, badges }) {
    // Create a lookup object for the badge data by key
    const badgeLookup = badgeData.reduce((acc, badge) => {
        acc[badge.key] = badge;
        return acc;
    }, {});

    return (
        <div className={`user-badge ${size}`}>
            <div className="user-badge-container">
                {badges?.map((badgeKey, index) => {
                    const badge = badgeLookup[badgeKey];
                    const icon = badgeIcons[badgeKey];
                    if (!badge || !icon) return null; // Skip if badge or icon not found

                    return (
                        <div key={index} className="user-badge-item hover-display-label hover-cursor-opacity" aria-label={badge.title}>
                            <img className="user-badge-item__icon" src={icon} alt={badge.title} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}