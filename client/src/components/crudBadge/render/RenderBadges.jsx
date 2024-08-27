import { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";

// Components
import RenderBadge from "./RenderBadge";

// Styling
import "./RenderBadges.scss"
import { resizeImageUrl } from "../../../utils/imageDisplayer";
import { limitString } from "../../../utils/formatter";

export default function RenderBadges({ badge, setShowRenderBadges, setOverlayVisible }) {
    const fetchBadges = async () => {
        try {
            // const response = await apiUtils.get(`/badge/readBadges`);
            // return response.data.metadata.badges;
            return [
                {
                    _id: "1",
                    title: "Badge 01",
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
                    level: "hard",
                    type: "platform_contributor",
                    thumbnail: "https://i.pinimg.com/564x/40/00/9a/40009a289df54c8e570d89a7c72612fa.jpg",
                    isComplete: true,
                },
                {
                    _id: "2",
                    title: "Badge 02",
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
                    level: "medium",
                    type: "sale_achievement",
                    thumbnail: "https://i.pinimg.com/736x/14/1f/40/141f40e1fae6a366cf81ff1a2f30600b.jpg",
                    isComplete: false,
                },
                {
                    _id: "3",
                    title: "Badge 03",
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
                    level: "easy",
                    type: "challenge_participation",
                    thumbnail: "https://i.pinimg.com/736x/14/1f/40/141f40e1fae6a366cf81ff1a2f30600b.jpg",
                    isComplete: false,
                },
                {
                    _id: "4",
                    title: "Badge 04",
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
                    level: "hard",
                    type: "other",
                    thumbnail: "https://i.pinimg.com/736x/25/d8/8d/25d88de4ab6f64ff2fafd8c67e0b85c3.jpg",
                    isComplete: false,
                }
            ]
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    const { data: badges, error, isError, isLoading } = useQuery(
        ['fetchBadges'],
        fetchBadges,
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching service by ID:', error);
            },
        }
    );

    const [selectedBadge, setSelectedBadge] = useState(badge);

    // Group badges by type and sort by level
    const groupBadges = (badges) => {
        const grouped = badges.reduce((acc, badge) => {
            const { type } = badge;
            if (!acc[type]) acc[type] = [];
            acc[type].push(badge);
            return acc;
        }, {});

        Object.keys(grouped).forEach(type => {
            grouped[type].sort((a, b) => a.level.localeCompare(b.level));
        });

        return grouped;
    };

    // Toggle display overlay box
    const renderBadgesRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (renderBadgesRef && renderBadgesRef.current && !renderBadgesRef.current.contains(e.target)) {
                setShowRenderBadges(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [setShowRenderBadges, setOverlayVisible]);

    const groupedBadges = badges ? groupBadges(badges) : {};

    return (
        <div className="modal-form type-3 render-badges" ref={renderBadgesRef}>
            {selectedBadge ? (
                <div className="badge-details">
                    <h2 className="form__title">{selectedBadge?.title}</h2>
                    <svg onClick={() => { setShowRenderBadges(false); setOverlayVisible(false) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__close-ic">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>

                    <div aria-label="Xem tất cả" className="hover-display-label left form__back-ic btn-ic" onClick={() => { setSelectedBadge(null) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                        </svg>
                    </div>

                    <div className="text-align-center">
                        <div className="flex-justify-center">
                            <img className="badge-details__thumbnail" src={selectedBadge?.thumbnail} alt="" />
                        </div>
                        <h3>
                            <strong className="fw-bold fs-16">
                                <span className={`badge--level mr-8 ${selectedBadge?.level}`}>{selectedBadge?.level == "easy" ?
                                    "Dễ" : selectedBadge?.level == "medium" ? "Trung bình" : "Khó"}</span> {selectedBadge.title}
                            </strong></h3>
                        {
                            selectedBadge?.isComplete && (
                                <div className={`flex-justify-center flex-align-center badge-details__status complete`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 mr-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    Đã nhận huy hiệu
                                </div>
                            )
                        }

                        <p className="text-align-justify">{selectedBadge?.description}</p>
                    </div>
                </div>
            ) : (
                <>
                    <h2 className="form__title">Huy hiệu</h2>
                    <hr className="mb-8" />
                    <svg onClick={() => { setShowRenderBadges(false); setOverlayVisible(false) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__close-ic">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>

                    <div className="badge-container">
                        {Object.keys(groupedBadges).length > 0 ? (
                            Object.keys(groupedBadges).map((type, index) => (
                                <div key={index} className="mb-32">
                                    <div className="mb-8">
                                        {type == "platform_contributor" ?
                                            <strong className="badge-group-title fs-16 hover-display-label bottom" aria-label="Tri ân những thành viên đóng góp vào sự phát triển của nền tảng">Thành tích đóng góp</strong>
                                            : type == "sale_achievement" ?
                                                <strong className="badge-group-title fs-16 hover-display-label bottom" aria-label="Vinh danh những người làm nghệ thuật trên Pastal">Họa sĩ triển vọng</strong>
                                                :
                                                type == "challenge_participation" ?
                                                    <strong className="badge-group-title fs-16 hover-display-label bottom" aria-label="Vinh danh các thí sinh thực hiện thử thách sáng tạo">Thử thách sáng tạo</strong>
                                                    :

                                                    <strong className="badge-group-title fs-16 hover-display-label bottom" aria-label="Các huy hiệu khác">Huy hiệu khác</strong>
                                        }
                                    </div>
                                    {groupedBadges[type].map((badge, index) => (
                                        <div key={index} className={`badge-item gray-bg-hover ${badge?.isComplete ? "active" : " "}`} onClick={() => { setSelectedBadge(badge) }}>
                                            <img className="badge-item__thumbnail badge-item--left" src={badge.thumbnail} alt="" />

                                            <div className="badge-item--right">
                                                <div className="fw-bold fs-16 mb-8">
                                                    <span className={`badge--level mr-8 ${badge?.level}`}>{badge?.level == "easy" ?
                                                        "Dễ" : badge?.level == "medium" ? "Trung bình" : "Khó"}</span> {badge.title}
                                                </div>
                                                <span className="mt-8">{limitString(badge?.description, 150)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <p>Tạm thời chưa có huy hiệu nào</p>
                        )
                        }
                    </div>
                </>
            )}
        </div >
    )
}