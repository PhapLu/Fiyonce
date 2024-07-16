// Imports
import { Link } from "react-router-dom";

// Styling
import "./InDevelopement.scss";
import "../../assets/scss/buttons.scss";

export default function InDevelopement() {
    return (
        <div className="not-found">
            <div className="not-found__content">
                <div className="dot dot-1"></div>
                <div className="dot dot-2"></div>
                <div className="dot dot-3"></div>
                <h1>404</h1>
                <h2>SẮP RA MẮTt</h2>
                <h3>Tính năng này đang được phát triển</h3>
                <Link to="/" className="btn btn-hover color-4">Về trang chủ</Link>
            </div>
        </div>
    )
}