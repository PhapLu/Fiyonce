// Imports
import { Link } from "react-router-dom";

// Styling
import "./NotFound.scss";
import "../../assets/scss/buttons.scss";

export default function NotFound() {
    return (
        <div className="static-page not-found">
            <div className="not-found__content">
                <div className="dot dot-1"></div>
                <div className="dot dot-2"></div>
                <div className="dot dot-3"></div>
                <h1>404</h1>
                <h2>Trang bạn tìm kiếm không tồn tại!</h2>
                <h3>Vui lòng kiểm tra lại đường dẫn hoặc </h3>
                <Link to="/explore/posts" className="btn btn-hover color-4">Về trang chủ</Link>
            </div>
        </div>
    )
}