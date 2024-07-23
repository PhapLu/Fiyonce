// Imports
import { Link } from "react-router-dom";

// Styling
import "./Forbidden.scss";
import "../../assets/scss/buttons.scss";

export default function Forbidden() {
    return (
        <div className="not-found">
            <div className="not-found__content">
                <div className="dot dot-1"></div>
                <div className="dot dot-2"></div>
                <div className="dot dot-3"></div>
                <h1>403</h1>
                <h2>Bạn không có quyền truy cập trang này!</h2>
                <h3>Vui lòng kiểm tra lại đường dẫn hoặc </h3>
                <Link to="/" className="btn btn-hover color-4">Về trang chủ</Link>
            </div>
        </div>
    )
}