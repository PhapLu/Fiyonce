// Imports
import { useState, useEffect } from "react";

// Utils
import { limitString } from "../../utils/formatter.js";
import AddCommissionService from "../addCommissionService/AddCommissionService.jsx";
// Styling
import "./ProfileCommissionServices.scss";

export default function ProfileCommissionServices() {
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [showAddCommissionServiceForm, setShowAddCommissionServiceForm] = useState(false);
    const [commissionServiceCategories, setCommissionServiceCategories] = useState([
        {
            title: "DIGITAL ART",
            commissionServices: [
                {
                    title: "Commission Service 01",
                    artworks: [
                        "https://i.pinimg.com/564x/33/e4/a3/33e4a3f37466548d5acb55e5b468a131.jpg",
                        "https://i.pinimg.com/736x/43/80/08/4380081eae585a757cbc688966d0522a.jpg",
                        'https://i.pinimg.com/236x/3a/81/f9/3a81f9cd5f2176f6ed8fb23d5e4d9fc1.jpg',
                        "https://i.pinimg.com/736x/3e/64/01/3e6401f6db718f4936ae2cc7477b28c2.jpg",
                        "https://i.pinimg.com/564x/de/b0/f9/deb0f99b9664ca9d5641b1ef02849c6b.jpg",
                    ],
                    fromPrice: 200000,
                    deliverables: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
                    notes: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
                },
                {
                    title: "Commission Service 01",
                    artworks: [
                        "https://i.pinimg.com/564x/33/e4/a3/33e4a3f37466548d5acb55e5b468a131.jpg",
                        "https://i.pinimg.com/736x/43/80/08/4380081eae585a757cbc688966d0522a.jpg",
                        'https://i.pinimg.com/236x/3a/81/f9/3a81f9cd5f2176f6ed8fb23d5e4d9fc1.jpg',
                        "https://i.pinimg.com/736x/3e/64/01/3e6401f6db718f4936ae2cc7477b28c2.jpg",
                        "https://i.pinimg.com/564x/de/b0/f9/deb0f99b9664ca9d5641b1ef02849c6b.jpg",
                    ],
                    fromPrice: 200000,
                    deliverables: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
                    notes: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
                },
                {
                    title: "Commission Service 01",
                    artworks: [
                        "https://i.pinimg.com/564x/33/e4/a3/33e4a3f37466548d5acb55e5b468a131.jpg",
                        "https://i.pinimg.com/736x/43/80/08/4380081eae585a757cbc688966d0522a.jpg",
                        'https://i.pinimg.com/236x/3a/81/f9/3a81f9cd5f2176f6ed8fb23d5e4d9fc1.jpg',
                        "https://i.pinimg.com/736x/3e/64/01/3e6401f6db718f4936ae2cc7477b28c2.jpg",
                        "https://i.pinimg.com/564x/de/b0/f9/deb0f99b9664ca9d5641b1ef02849c6b.jpg",
                    ],
                    fromPrice: 200000,
                    deliverables: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
                    notes: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
                }
            ]
        },
        {
            title: "DIGITAL ART",
            commissionServices: [
                {
                    title: "Commission Service 01",
                    artworks: [
                        "https://i.pinimg.com/564x/33/e4/a3/33e4a3f37466548d5acb55e5b468a131.jpg",
                        "https://i.pinimg.com/736x/43/80/08/4380081eae585a757cbc688966d0522a.jpg",
                        'https://i.pinimg.com/236x/3a/81/f9/3a81f9cd5f2176f6ed8fb23d5e4d9fc1.jpg',
                        "https://i.pinimg.com/736x/3e/64/01/3e6401f6db718f4936ae2cc7477b28c2.jpg",
                        "https://i.pinimg.com/564x/de/b0/f9/deb0f99b9664ca9d5641b1ef02849c6b.jpg",
                    ],
                    fromPrice: 200000,
                    deliverables: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
                    notes: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
                }
            ]
        },
        {
            title: "DIGITAL ART",
            commissionServices: [
                {
                    title: "Commission Service 01",
                    artworks: [
                        "https://i.pinimg.com/564x/33/e4/a3/33e4a3f37466548d5acb55e5b468a131.jpg",
                        "https://i.pinimg.com/736x/43/80/08/4380081eae585a757cbc688966d0522a.jpg",
                        'https://i.pinimg.com/236x/3a/81/f9/3a81f9cd5f2176f6ed8fb23d5e4d9fc1.jpg',
                        "https://i.pinimg.com/736x/3e/64/01/3e6401f6db718f4936ae2cc7477b28c2.jpg",
                        "https://i.pinimg.com/564x/de/b0/f9/deb0f99b9664ca9d5641b1ef02849c6b.jpg",
                    ],
                    fromPrice: 200000,
                    deliverables: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
                    notes: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
                }
            ]
        }
    ]);

    const [reviews, setReviews] = useState([
        {
            content: "Very good artist",
            rating: 4.0,
        }
    ]);
    const averageRating = 4.0;

    return (
        <div className="profile-commission-services">
            <div className="profile-page__header">
                <div className="profile-page__header--left">
                    <button className="btn btn-4 btn-md"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg> {averageRating}
                        ({reviews.length} đánh giá)</button>
                    {commissionServiceCategories.map((category, index) => {
                        return (
                            <button className="btn btn-3 btn-md" key={index}>{category.title}</button>
                        )
                    })}
                </div>
                <div className="profile-page__header--right">
                    <button className="btn btn-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
                        </svg>
                        Điều khoản dịch vụ
                    </button>
                    <button className="btn btn-3" onClick={() => { setShowAddCommissionServiceForm(true); setOverlayVisible(true) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Thêm dịch vụ
                    </button>
                </div>
            </div>

            {commissionServiceCategories.map((category, index) => (
                <div key={index} className="profile-commission-service__category-container">
                    <div className="profile-commission-service__category-item">
                        <h4 className="profile-commission-service__category-item__header">{category.title}</h4>
                        <br />
                        <div className="profile-commission-service__category-item__service-container">
                            {category.commissionServices.map((service, index) => (
                                <>
                                    <div key={index} className="profile-commission-service__category-item__service-item">
                                        <div className="profile-commission-service__category-item__service-item--left">
                                            {service.artworks.slice(0, 3).map((artwork, index) => (
                                                <img key={index} src={artwork} alt={`Artwork ${index + 1}`} />
                                            ))}
                                        </div>

                                        <button className="btn btn-3 bookmark-service-btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 bookmark-service-btn__ic">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                            </svg>
                                        </button>

                                        <div className="profile-commission-service__category-item__service-item--right">
                                            <h3>{service.title}</h3>
                                            <h4>From {service.fromPrice}</h4>
                                            <p className="profile-commission-service__category-item__service-item__deliverables">{limitString(service.deliverables, 300)}</p>
                                            <p className="profile-commission-service__category-item__service-item__note">*Lưu ý: {service.notes}</p>
                                            <button className="btn btn-2 btn-md">Đặt ngay</button>
                                            <button className="btn btn-3 btn-md">Liên hệ</button>
                                        </div>
                                    </div>
                                    <hr />
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            {/* Modal forms */}
            {overlayVisible && (
                <div className={`overlay`}>
                    {showAddCommissionServiceForm && <AddCommissionService commissionServiceCategories={commissionServiceCategories} setShowAddCommissionServiceForm={setShowAddCommissionServiceForm} setOverlayVisible={setOverlayVisible} />}
                </div>)}

        </div>
    );
}
