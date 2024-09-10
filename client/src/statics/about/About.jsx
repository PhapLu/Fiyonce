// Imports
import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom"

// Styling
import "./About.scss"
import BackToTop from "../../components/backToTop/BackToTop"
import { LazyLoadImage } from "react-lazy-load-image-component"
import communityReviews from "../../data/about/communityReviews.json";

export default function About() {
    const settings = {
        dots: false,
        infinite: true,
        speed: 1000, // Animation speed in milliseconds
        slidesToShow: 3, // Number of slides to show at one time
        slidesToScroll: 1, // Number of slides to scroll at one time
        autoplay: true, // Enable autoplay mode
        autoplaySpeed: 3000, // Delay between each auto-scroll (in milliseconds)
        cssEase: "linear" // Type of animation easing
    };

    return (
        <div className="about">
            <BackToTop />
            <h1 className="flex-align-center flex-justify-center">Về Pastal</h1>
            <hr />
            <br />
            <br />
            <section className="section development-story mb-80">
                <div className="development-story--left">
                    <h2>PASTAL</h2>
                    <h4>Passionate & Talent</h4>
                </div>

                <div className="development-story--right">
                    <span>Khoảng đầu năm 2022, trong một lần cùng teammates chuẩn bị cho kì thi Hackathon tại TPHCM, mình đã có tìm hiểu về những mô hình “vẽ tranh theo yêu cầu”. Kể từ đó, mình đã ấp ủ ý tưởng xây dựng một nền tảng kết nối những người yêu nghệ thuật nói chung và những họa sĩ trẻ đầy tài năng nói riêng. Mình muốn nghệ thuật trở nên dễ tiếp cận hơn với cộng đồng,
                        Với hơn 8 năm ở vai trò là một họa sĩ tự do, một nhà thiết kế part-time, cũng như một lập trình viên phần mềm, mình
                        Như tinh thần của cái tên Pastal (passionate & talent), mình muốn tạo ra một cộng đồng những người trẻ sáng tạo, dám bước ra khỏi vòng an toàn để theo đuổi giấc mơ .
                        Thật may mắn khi được gặp những người cộng sự làm việc hết mình. </span>
                </div>
            </section>

            <div className="section office mb-80">
                <img src="https://i.pinimg.com/736x/13/ca/8a/13ca8a0b5a2c4f592dd8c1dc6b811889.jpg" alt="" />
            </div>

            {/* Core values */}
            <section className="section core-values">
                <div className="core-values--left">
                    <div className="core-value-container">
                        <div className="core-value-item active">
                            <div className="core-value-item__ic-bg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                            </div>

                            <h4 className="core-value-item__title">Phát triển vì cộng đồng</h4>
                            <p className="core-value-item__description">
                                Mỗi giao dịch thành công trên Pastal sẽ trực tiếp đóng góp cải thiện bữa ăn cho trẻ  em vùng cao, trồng thêm cây xanh và tạo sân chơi nuôi dưỡng đam mê cho các thế hệ họa sĩ tiếp theo.
                            </p>

                            <Link to="" className="core-value-item__explore">Xem thêm</Link>
                        </div>
                        <div className="core-value-item">
                            <div className="core-value-item__ic-bg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                            </div>

                            <h4 className="core-value-item__title">Phát triển vì cộng đồng</h4>
                            <p className="core-value-item__description">
                                Mỗi giao dịch thành công trên Pastal sẽ trực tiếp đóng góp cải thiện bữa ăn cho trẻ  em vùng cao, trồng thêm cây xanh và tạo sân chơi nuôi dưỡng đam mê cho các thế hệ họa sĩ tiếp theo.
                            </p>

                            <Link to="" className="core-value-item__explore">Xem thêm</Link>
                        </div>
                        <div className="core-value-item">
                            <div className="core-value-item__ic-bg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                            </div>

                            <h4 className="core-value-item__title">Phát triển vì cộng đồng</h4>
                            <p className="core-value-item__description">
                                Mỗi giao dịch thành công trên Pastal sẽ trực tiếp đóng góp cải thiện bữa ăn cho trẻ  em vùng cao, trồng thêm cây xanh và tạo sân chơi nuôi dưỡng đam mê cho các thế hệ họa sĩ tiếp theo.
                            </p>

                            <Link to="" className="core-value-item__explore">Xem thêm</Link>
                        </div>
                        <div className="core-value-item">
                            <div className="core-value-item__ic-bg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                            </div>

                            <h4 className="core-value-item__title">Phát triển vì cộng đồng</h4>
                            <p className="core-value-item__description">
                                Mỗi giao dịch thành công trên Pastal sẽ trực tiếp đóng góp cải thiện bữa ăn cho trẻ  em vùng cao, trồng thêm cây xanh và tạo sân chơi nuôi dưỡng đam mê cho các thế hệ họa sĩ tiếp theo.
                            </p>

                            <Link to="" className="core-value-item__explore">Xem thêm</Link>
                        </div>
                    </div>
                </div>

                <div className="core-values--right">
                    <h2>GIÁ TRỊ CỐT LÕI</h2>
                    <h4>Điều gì tạo nên một Pastal khác biệt?</h4>
                </div>
            </section>

            {/* Pastal Team */}
            <section className="section team mt-60">
                <div className="text-align-center">
                    <h2>Đội ngũ Pastal</h2>
                    <h4>Những Pastalists đầu tiên</h4>
                </div>

                <div className="team-member-container">
                    <div className="team-member-item">
                        <div className="team-member-item--left">
                            <img src="https://i.pinimg.com/564x/60/6d/5e/606d5e6ac811b6278d95b18c059792b4.jpg" alt="" className="team-member-item__avatar" />
                        </div>
                        <div className="team-member-item--right">
                            <h4 className="team-member-item__name">Lưu Quốc Nhật</h4>
                            <span className="team-member-item__position">CEO & Founder</span>
                            <hr />
                            <p className="team-member-item__quote">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the</p>
                            <div className="team-member-item__social-container">
                                <svg xmlns="http://www.w3.org/2000/svg" className="team-member-item__social-item mr-8" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="team-member-item__social-item mr-8" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="team-member-item__social-item mr-8" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="team-member-item__social-item mr-8" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="team-member-item">
                        <div className="team-member-item--left">
                            <img src="https://i.pinimg.com/564x/60/6d/5e/606d5e6ac811b6278d95b18c059792b4.jpg" alt="" className="team-member-item__avatar" />
                        </div>
                        <div className="team-member-item--right">
                            <h4 className="team-member-item__name">Lưu Quốc Pháp</h4>
                            <span className="team-member-item__position">CTO & Co-Founder</span>
                            <hr />
                            <p className="team-member-item__quote">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the</p>
                            <div className="team-member-item__social-container">
                                <svg xmlns="http://www.w3.org/2000/svg" className="team-member-item__social-item mr-8" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="team-member-item__social-item mr-8" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="team-member-item__social-item mr-8" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="team-member-item__social-item mr-8" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="team-member-item">
                        <div className="team-member-item--left">
                            <img src="https://i.pinimg.com/564x/60/6d/5e/606d5e6ac811b6278d95b18c059792b4.jpg" alt="" className="team-member-item__avatar" />
                        </div>
                        <div className="team-member-item--right">
                            <h4 className="team-member-item__name">Võ Đại Nghĩa</h4>
                            <span className="team-member-item__position">Legal Consultant</span>
                            <hr />
                            <p className="team-member-item__quote">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the</p>
                            <div className="team-member-item__social-container">
                                <svg xmlns="http://www.w3.org/2000/svg" className="team-member-item__social-item mr-8" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="team-member-item__social-item mr-8" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="team-member-item__social-item mr-8" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="team-member-item__social-item mr-8" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="team-member-item">
                        <div className="team-member-item--left">
                            <img src="https://i.pinimg.com/564x/60/6d/5e/606d5e6ac811b6278d95b18c059792b4.jpg" alt="" className="team-member-item__avatar" />
                        </div>
                        <div className="team-member-item--right">
                            <h4 className="team-member-item__name">Lưu Văn Phú</h4>
                            <span className="team-member-item__position">Business Consultant</span>
                            <hr />
                            <p className="team-member-item__quote">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the</p>
                            <div className="team-member-item__social-container">
                                <svg xmlns="http://www.w3.org/2000/svg" className="team-member-item__social-item mr-8" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="team-member-item__social-item mr-8" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="team-member-item__social-item mr-8" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="team-member-item__social-item mr-8" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pastal Community */}
            <section className="section community mt-60 mb-80">
                <div className="text-align-center mb-60">
                    <h2>Cộng đồng Pastal</h2>
                    <h4>Và hơn 10.000+ Pastalists sau đó...</h4>
                </div>
                <Slider {...settings}>
                    {communityReviews.map((review, index) => {
                        let highlightedContent = review.content;

                        if (review.keywords && review.colors) {
                            review.keywords.forEach((keyword, keywordIndex) => {
                                const color = review.colors[keywordIndex] || 'inherit'; // Fallback to 'inherit' if no color is provided
                                const regex = new RegExp(`(${keyword})`, 'gi');
                                highlightedContent = highlightedContent.replace(regex, `<span class="fs-12" style="color:${color};">$1</span>`);
                            });
                        }

                        return (
                            <div className="community-member-item" key={index}>
                                <div className="user md">
                                    <Link to={review.profileUrl} className="user--left mt-8 hover-cursor-opacity">
                                        <LazyLoadImage
                                            src={review.avatar || "https://i.pinimg.com/564x/60/6d/5e/606d5e6ac811b6278d95b18c059792b4.jpg"}
                                            alt={review.fullName}
                                            className="user__avatar"
                                            effect="blur"
                                        />
                                        <div className="user__name">
                                            <div className="user__name__title fw-600">{review.fullName}</div>
                                        </div>
                                    </Link>
                                </div>
                                <p className="fs-12" dangerouslySetInnerHTML={{ __html: highlightedContent }}></p>
                            </div>
                        );
                    })}
                </Slider>


                <Slider {...settings}>
                    {communityReviews.map((review, index) => (
                        <div className="community-member-item " key={index}>
                            <div className="user md">
                                <Link to={review.profileUrl} className="user--left mt-8 hover-cursor-opacity">
                                    <LazyLoadImage
                                        src={review.avatar || "https://i.pinimg.com/564x/60/6d/5e/606d5e6ac811b6278d95b18c059792b4.jpg"}
                                        alt={review.fullName}
                                        className="user__avatar"
                                        effect="blur"
                                    />
                                    <div className="user__name">
                                        <div className="user__name__title fw-600">{review.fullName}</div>
                                    </div>
                                </Link>
                            </div>
                            <p className="fs-12">{review.content}</p>
                        </div>
                    ))}
                </Slider>
            </section>


            {/* Partners */}
            {/* <div className="partners"></div>
            <div className="partner-container">
                <img src="" className="partner-item" />
            </div> */}

            {/* Call to join Pastal community */}
            <div className="join-community">
                <div className="text-align-center">
                    <h3>Trở thành một phần của cộng đồng Pastal?</h3>
                    <p>
                        Pastal hiện đang trong giai đoạn beta, mọi thắc mắc và đóng góp vui lòng liên hệ qua <span className="highlight-text">help@gmail.com</span> hoặc Fanpage
                    </p>

                    <Link to="" className="register-now-btn flex-align-center">Đăng kí ngay <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>
                    </Link>
                </div>
            </div>
        </div >
    )
}