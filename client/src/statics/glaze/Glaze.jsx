import { Link } from "react-router-dom"
import GlazeLogo from "/uploads/glaze_logo.png";
import "./Glaze.scss"

export default function Glaze() {
    return (
        <div className="glaze">
            <h1 className="flex-align-center flex-justify-center"><img src={GlazeLogo} className="glaze-logo mr-16" alt="" />Bảo vệ tác phẩm nghệ thuật của bạn với Glaze</h1>
            <span className="flex-align-center flex-justify-center"> bởi &nbsp; <Link to="/statics/about-team" className="highlight-text">Pastal Team</Link> <span className="dot-delimiter sm ml-8 mr-8"></span> Cập nhật gần nhất: 12/08/2024</span>
            <hr />
            <h3 className="">1. Glaze là gì?</h3>
            <span>
                Đi cùng với sự phát triển đáng kinh ngạc của các mô hình trí tuệ nhân tạo là nỗi lo về quyền sáng tác và giá trị nghệ thuật do chúng tạo ra. Với nỗ lực tạo ra một cộng đồng giữa những người yêu nghệ thuật sáng tạo, Pastal muốn giới thiệu đến mọi người Glaze - một công cụ bảo vệ họa sĩ và tác phẩm của họ khỏi sự sao chép trái phép của các mô hình AI.
            </span>
            <br />
            <br />

            <h3 className="">2. Glaze bảo vệ sáng tác của bạn như thế nào?</h3>
            <span>

                <span>
                    <strong>1. Phân tích tác phẩm: </strong>
                    Khi bạn tải một tác phẩm lên nền tảng Glaze, công cụ này sẽ tiến hành phân tích các đặc điểm độc đáo của tác phẩm đó, từ màu sắc, bố cục cho đến phong cách nghệ thuật.
                    <br />
                    <br />
                    <strong>2. Tạo dấu vân tay kỹ thuật số: </strong>
                    Dựa trên kết quả phân tích, Glaze sẽ tạo ra một "dấu vân tay kỹ thuật số" độc nhất vô nhị cho tác phẩm của bạn. Dấu vân tay này được tích hợp vào tác phẩm gốc một cách tinh tế, không làm ảnh hưởng đến chất lượng hình ảnh.
                    <br />
                    <br />
                    <strong>3. Bảo vệ tác phẩm: </strong>
                    Dấu vân tay kỹ thuật số này hoạt động như một hàng rào bảo vệ, ngăn cản các mô hình AI sao chép chính xác tác phẩm của bạn. Ngay cả khi một AI cố gắng học hỏi và tái tạo tác phẩm, kết quả thu được sẽ không bao giờ giống hoàn toàn với bản gốc.
                </span>
                <br />
                <br />

                <h3 className="">3. Hướng dẫn sử dụng</h3>
                <strong>1. Tải xuống và cài đặt Glaze:  </strong>
                <span>Truy cập trang web chính thức của Glaze <Link target="_blank" to="https://glaze.cs.uchicago.edu/index.html" className="highlight-text underlined-text">tại đây</Link></span>
                <br />
                <br />
                <strong>2. Mở tác phẩm nghệ thuật: </strong>
                Mở tác phẩm bạn muốn bảo vệ bằng phần mềm chỉnh sửa ảnh.
                <br />
                <br />
                <strong>3. Áp dụng plugin Glaze: </strong>
                Tìm và kích hoạt plugin Glaze trong danh sách các plugin của phần mềm chỉnh sửa ảnh.
                <br />
                <br />

                <strong>4. Lưu tác phẩm: </strong>
                <span>Sau khi áp dụng plugin, hãy lưu lại tác phẩm đã được bảo vệ. </span>
                <br />
                <br />
                <br />

                <hr />

            </span>
        </div>
    )
}