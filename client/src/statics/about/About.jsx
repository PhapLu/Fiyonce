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
                    <h2> PASTAL</h2>
                    <h4>Passionate & Talent</h4>
                </div>

                <div className="development-story--right">
                    <span>✨ Art commission đã trở thành một khái niệm không còn xa lạ trong cộng đồng những người yêu nghệ thuật khi nhu cầu sở hữu một tác phẩm được cá nhân hóa theo ý mình ngày càng phổ biến.
                        Tuy vậy việc chọn cho mình một họa sĩ phù hợp và đáng tin cậy là điều không hề dễ dàng.
                        Hiểu được nỗi đau này, Pastal sinh ra như một nền tảng trung gian kết nối những ý tưởng nghệ thuật của khách hàng với hàng nghìn họa sĩ trẻ tài năng trên cả nước.
                        <br />
                        <br />
                        Không chỉ dừng lại ở vai trò nền tảng giao dịch trung gian, Pastal tiên phong trong việc giúp họa sĩ xây dựng thương hiệu cá nhân và hồ sơ công việc một cách chuyên nghiệp, lan tỏa những giá trị nghệ thuật đến với đông đảo công chúng. Như tinh thần của cái tên Pastal (Passionate & Talent), chúng ta sẽ tạo nên một cộng đồng những họa sĩ trẻ đầy tài năng và nhiệt huyết, dám bước ra khỏi vùng an toàn và theo đuổi sự nghiệp nghệ thuật về lâu dài. </span>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                                </svg>
                            </div>

                            <h4 className="core-value-item__title">Sự đa dạng</h4>
                            <p className="core-value-item__description">
                                Nhu cầu cá nhân hóa một tác phẩm nghệ thuật đã thúc đẩy Pastal phát triển một nền tảng với quy mô lớn. Tại đây, những họa sĩ trẻ đầy tài năng đến từ nhiều trường phái nghệ thuật khác nhau, sẵn sàng đáp ứng các yêu cầu từ phía khách hàng.
                            </p>

                            {/* <Link to="" className="core-value-item__explore">Xem thêm</Link> */}
                        </div>
                        <div className="core-value-item">
                            <div className="core-value-item__ic-bg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>

                            <h4 className="core-value-item__title">Sự đáng tin cậy</h4>
                            <p className="core-value-item__description">
                                Tất cả giao dịch trên Pastal đều hướng đến bảo vệ quyền lợi cho họa sĩ và khách hàng. Pastal sẽ dựa trên các điều khoản của nền tảng, chính sách dịch vụ của họa sĩ, cũng như hợp đồng làm việc giữa hai bên để xử lí các báo cáo vi phạm.
                            </p>

                            {/* <Link to="" className="core-value-item__explore">Xem thêm</Link> */}
                        </div>
                        <div className="core-value-item">
                            <div className="core-value-item__ic-bg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                                </svg>
                            </div>

                            <h4 className="core-value-item__title">Sự chuyên nghiệp</h4>
                            <p className="core-value-item__description">
                                Pastal tiên phong hỗ trợ họa sĩ xây dựng thương hiệu cá nhân một cách chuyên nghiệp. Pastal cung cấp các tính năng cho phép họa sĩ trưng bày các tác phẩm nghệ thuật của mình như một bộ sưu tập, tùy chỉnh các dịch vụ commission, và quản lí các đơn hàng một cách hiệu quả.
                            </p>

                            {/* <Link to="" className="core-value-item__explore">Xem thêm</Link> */}
                        </div>
                        <div className="core-value-item">
                            <div className="core-value-item__ic-bg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                            </div>

                            <h4 className="core-value-item__title">Sự bền vững</h4>
                            <p className="core-value-item__description">
                                Mỗi giao dịch thành công trên nền tảng sẽ trực tiếp đóng góp để cải thiện chất lượng cuộc sống cho trẻ em không nơi nương nựa. Ngoài ra, các hoạt động vẽ tranh gây quỹ cũng sẽ được tổ chức định kì nhằm tạo ra sân chơi bồi dưỡng các thế hệ họa sĩ tiếp theo.
                            </p>

                            {/* <Link to="" className="core-value-item__explore">Xem thêm</Link> */}
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
                        Pastal hiện đang trong giai đoạn beta nên sẽ không tránh khỏi những thiếu sót.
                        <br /> Mọi thắc mắc và đóng góp vui lòng liên hệ qua <span className="highlight-text fs-13">help@gmail.com</span> hoặc <Link to="" className='highlight-text'>Fanpage</Link>
                    </p>
                    <br />

                    <Link to="" className="btn btn-2 btn-lg register-now-btn text-align-center">Đăng kí ngay <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 ml-8 mr-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>
                    </Link>
                </div>
            </div>
        </div >
    )
}