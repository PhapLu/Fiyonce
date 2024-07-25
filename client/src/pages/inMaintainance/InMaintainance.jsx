// Imports
import { Link } from "react-router-dom";

// Styling
import "./InMaintainance.scss";
import "../../assets/scss/buttons.scss";

export default function InMaintainance() {
    return (
        <div className="static-page not-found">
            <div className="not-found__content">
                <div className="dot dot-1"></div>
                <div className="dot dot-2"></div>
                <div className="dot dot-3"></div>
                <h1>Opps!</h1>
                <h2>ĐANG BẢO TRÌ</h2>
                <h3>Tính năng này đang được bảo trì</h3>
                <Link to="/" className="btn btn-hover color-4">Về trang chủ</Link>
            </div>
        </div>
    )
}