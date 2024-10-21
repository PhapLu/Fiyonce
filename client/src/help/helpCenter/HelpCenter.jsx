// Imports
import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

// Components
import Footer from "../../components/footer/Footer.jsx";

// Utils

// Styling
import "./HelpCenter.scss"
import HelpNavbar from "../helpNavbar/HelpNavbar.jsx";
import { apiUtils } from "../../utils/newRequest.js";

export default function HelpCenter() {
    const location = useLocation();

    const [activeFaq, setActiveFaq] = useState(null); // Track which FAQ is open


    const faqData = [
        {
            question: "Quy trình đặt và thực hiện commission trên Pastal?",
            answer: "Here’s how you can commission artwork on Pastal. Step-by-step guide to ensure a smooth process.",
            link: "/help-center/commission-process"
        },
        {
            question: "Pastal thu những phí nào?",
            answer: "We charge a 5% platform fee on every commission to help maintain the platform and improve services.",
            link: "/help-center/fees"
        },
        {
            question: "Bản đồ tính năng?",
            answer: "Explore the feature map and understand the full functionality of Pastal.",
            link: "/help-center/feature-map"
        },
        {
            question: "Làm thế nào để nhận hoàn tiền?",
            answer: "Trong trường hợp có tranh chấp xảy ra giữa họa sĩ và khách hàng, Pastal sẽ xử lí vi phạm dựa trên thông tin do hai bên cung cấp và các chính sách pháp lí như <strong>Điều khoản dịch vụ của họa sĩ (1)</strong>, <strong>Hợp đồng giữa họa sĩ và khách hàng (2)</strong>, <strong>Chính sách hoàn tiền của nền tảng (3)</strong>.",
            link: "/help-center/fees"
        },
    ];

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index); // Toggle FAQ
    };

    const fetchHelpTopics = async () => {
        try {
            // Fetch posts data
            const response = await apiUtils.get(`/help/readHelpTopics`);
            console.log(response.data.metadata.helpTopics)
            return response.data.metadata.helpTopics;
        } catch (error) {
            throw new Error("Error fetching posts");
        }
    };

    const {
        data: helpTopics = [],
        error,
        isError,
        isLoading,
    } = useQuery("fetchHelpTopics", fetchHelpTopics);

    return (
        <div className="help-center">
            <HelpNavbar />

            <div className="help-theme">
                <img src="https://cdn.buymeacoffee.com/uploads/cover_images/2023/06/f9ed63251a832c6db79ed2e80400da09.jpg@2560w_0e.webp" alt="" />

                <div className="help-theme__content">
                    {/* <h1 className="text-align-center">Trung tâm trợ giúp</h1> */}
                    <div className="help-theme-container">
                        <Link to="/help-center/topics/for-talents" className="help-theme-item">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 help-theme__ic">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                            </svg>
                            <h3 className="help-theme-item__title">Dành cho họa sĩ</h3>
                            <p className="help-theme-item__description">Xây dựng thương hiệu cá nhân và phát triển sự nghiệp về lâu dài</p>
                            <span>3 chủ đề, 2 bài viết</span>
                        </Link>
                        <hr className="" />
                        <Link to="/help-center/topics/for-clients" className="help-theme-item">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 help-theme__ic">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>

                            <h3 className="help-theme-item__title">Dành cho khách hàng</h3>
                            <p className="help-theme-item__description">Hiện thực hóa ý tưởng của mình với Pastal</p>
                            <span>3 chủ đề, 2 bài viết</span>
                        </Link>
                        <hr className="" />
                        <Link to="/help-center/topics/about" className="help-theme-item">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 help-theme__ic">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                            </svg>
                            <h3 className="help-theme-item__title">Về Pastal</h3>
                            <p className="help-theme-item__description">Tìm hiểu thêm về cộng đồng Pastalists</p>
                            <span>3 chủ đề, 2 bài viết</span>
                        </Link>

                    </div>
                </div>
            </div>

            <div className="help-center__content">
                {/* FAQ section */}
                <section className="faq text-align-center">
                    <h1>Các câu hỏi thường gặp</h1>
                    <ul className="faq-container">
                        {faqData.map((faq, index) => (
                            <li key={index} className="faq-item" onClick={() => toggleFaq(index)}>
                                <div className="faq-question">
                                    {faq.question}
                                    <svg
                                        className={`close-icon ${activeFaq === index ? '' : 'rotate'}`}
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                {activeFaq === index && (
                                    <p className="faq-answer">
                                        <div dangerouslySetInnerHTML={{ __html: faq.answer }}></div>
                                        <br />
                                        <br />
                                        <Link to={faq.link} className="explore-btn underlined-text highlight-text">Xem thêm</Link>
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}