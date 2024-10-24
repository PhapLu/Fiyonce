import { Link } from "react-router-dom"
import "./TermsOfServices.scss"

export default function TermsOfServices() {
    return (
        <div className="terms-of-services">
            <h1 className="flex-align-center flex-justify-center">Chính sách và điều khoản</h1>
            <span className="flex-align-center flex-justify-center"> bởi &nbsp; <Link to="/statics/about" className="highlight-text underlined-text">Pastal Team</Link> <span className="dot-delimiter sm ml-8 mr-8"></span> Cập nhật gần nhất: 12/08/2024</span>
            <hr />
            <h3 className="">1. TermsOfServices là gì?</h3>
            <span>
                Đi cùng với sự phát triển đáng kinh ngạc của các mô hình trí tuệ nhân tạo là nỗi lo về bản quyền sáng tác và giá trị nghệ thuật do chúng tạo ra. Với nỗ lực tạo ra một cộng đồng giữa những người yêu nghệ thuật chân chính, Pastal muốn giới thiệu đến mọi người TermsOfServices - một công cụ dùng để bảo vệ tác phẩm của bạn khỏi sự sao chép trái phép của các mô hình AI.
            </span>
            <br />
            <br />
            <br />
            <br />
            <br />
            <hr />
        </div >
    )
}