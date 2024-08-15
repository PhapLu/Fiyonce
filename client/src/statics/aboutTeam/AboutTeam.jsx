import { Link } from "react-router-dom"
import "./AboutTeam.scss"

export default function AboutTeam() {
    return (
        <div className="about-team">
            <h1 className="flex-align-center flex-justify-center">Gặp gỡ đội ngũ sáng lập và nhà phát triển</h1>
            <hr />
            <br />
            <br />
            <section className="section development-story">
                <div className="development-story--left">
                    <h2>THE STORY BEHIND</h2>
                    <hr />
                    <h4>Câu chuyện phát triển</h4>
                </div>

                <div className="development-story--right">
                    <span>Khoảng đầu năm 2022, trong một lần cùng teammates chuẩn bị cho kì thi Hackathon tại TPHCM, mình đã có tìm hiểu về những mô hình “vẽ tranh theo yêu cầu”. Kể từ đó, mình đã ấp ủ ý tưởng xây dựng một nền tảng kết nối những người yêu nghệ thuật nói chung và những họa sĩ trẻ đầy tài năng nói riêng. Mình muốn nghệ thuật trở nên dễ tiếp cận hơn với cộng đồng,
                        Với hơn 8 năm ở vai trò là một họa sĩ tự do, một nhà thiết kế part-time, cũng như một lập trình viên phần mềm, mình
                        Như tinh thần của cái tên Pastal (passionate & talent), mình muốn tạo ra một cộng đồng những người trẻ sáng tạo, dám bước ra khỏi vòng an toàn để theo đuổi giấc mơ .
                        Thật may mắn khi được gặp những người cộng sự làm việc hết mình. </span>
                </div>
            </section>

            <br />
            <br />

            <div className="section office">
                <img src="https://i.pinimg.com/736x/13/ca/8a/13ca8a0b5a2c4f592dd8c1dc6b811889.jpg" alt="" />
            </div>


            <hr />
        </div>
    )
}