



// Styling
import "./UserBadge.scss";


export default function UserBadge({ size, badges }) {
    return (
        <div className={`user-badge ${size}`}>
            <div className="user-badge-container">
                {badges?.map((badge, index) => {
                    if (!badge?.isComplete) return
                    return (
                        <div className="user-badge-item hover-display-label" aria-label={badge?.badgeId?.title}>
                            <img className="user-badge-item__icon" src={badge?.badgeId?.icon} alt="" />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}