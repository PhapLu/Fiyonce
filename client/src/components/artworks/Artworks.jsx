// Imports
import {Link} from "react-router-dom";


export default function Artworks() {
    return (
        <div className="artworks">
            Hello
            <div className="artwork-container">
                <Link className="artwork-item">
                    <img src="" alt="" className="artwork-item__thumbnail" />
                    <div className="user">
                        <div className="user--left">
                            <img src="" alt="" className="user__avatar" />
                            <span className="user__stage-name">Aveline Yi</span>
                        </div>
                        <div className="user--right">
                            <span className="artwork__view">
                                <span className="artwork__view__count">3.6K</span>
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}