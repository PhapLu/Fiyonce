// Imports

// Resources

// Utils

// Styling

import { useState, useEffect, useRef } from 'react';
import './RenderCommissionReviews.scss';

export default function CommissionReviews({ setShowRenderCommissionReviews, setOverlayVisible }) {
    const reviews = [
        // {
        //     id: 1,
        //     user: {
        //         name: 'John Doe',
        //         avatar: 'https://via.placeholder.com/50',
        //     },
        //     rating: 5,
        //     content: 'Amazing artwork! The quality and detail are fantastic. Highly recommend!',
        // },
        // {
        //     id: 2,
        //     user: {
        //         name: 'Jane Smith',
        //         avatar: 'https://via.placeholder.com/50',
        //     },
        //     rating: 4,
        //     content: 'Very good service and beautiful paintings. Will order again.',
        // },
        // {
        //     id: 3,
        //     user: {
        //         name: 'Emily Johnson',
        //         avatar: 'https://via.placeholder.com/50',
        //     },
        //     rating: 5,
        //     content: 'Exceeded my expectations. Great artist!',
        // },
    ];

    const [filteredReviews, setFilteredReviews] = useState(reviews);
    const [selectedRating, setSelectedRating] = useState(null);

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1);
    };

    const averageRating = calculateAverageRating();

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className="star">
                {index < rating ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 not-filled">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                )}
            </span>
        ));
    };

    const handleFilterReviews = (rating) => {
        setSelectedRating(rating);
        setFilteredReviews(rating ? reviews.filter(review => review.rating === rating) : reviews);
    };

    const commissionReviewsRef = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (commissionReviewsRef.current && !commissionReviewsRef.current.contains(e.target)) {
                setShowRenderCommissionReviews(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    return (
        <div className="commission-reviews modal-form type-3" ref={commissionReviewsRef} onClick={(e) => { e.stopPropagation(); }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowRenderCommissionReviews(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h2 className="form__title">Đánh giá</h2>

            {/* <p>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
                <strong>{averageRating} </strong> <span>&#8226;</span> {reviews.length} đánh giá
            </p> */}

            <div className="rating-container">
                {/* <div className={`rating-item btn ${selectedRating === null ? 'selected btn-2' : 'btn-3'}`} onClick={() => handleFilterReviews(null)}>
                    Tất cả ({reviews.length})
                </div>
                <div className={`rating-item btn ${selectedRating === 5 ? 'selected btn-2' : 'btn-3'}`} onClick={() => handleFilterReviews(5)}>
                    5<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                    ({reviews.filter(review => review.rating === 5).length})
                </div>
                <div className={`rating-item btn ${selectedRating === 4 ? 'selected btn-2' : 'btn-3'}`} onClick={() => handleFilterReviews(4)}>
                    4<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                    ({reviews.filter(review => review.rating === 4).length})
                </div>
                <div className={`rating-item btn ${selectedRating === 3 ? 'selected btn-2' : 'btn-3'}`} onClick={() => handleFilterReviews(3)}>
                    3<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                    ({reviews.filter(review => review.rating === 3).length})
                </div>
                <div className={`rating-item btn ${selectedRating === 2 ? 'selected btn-2' : 'btn-3'}`} onClick={() => handleFilterReviews(2)}>
                    2<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                    ({reviews.filter(review => review.rating === 2).length})
                </div>
                <div className={`rating-item btn ${selectedRating === 1 ? 'selected btn-2' : 'btn-3'}`} onClick={() => handleFilterReviews(1)}>
                    1<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                    ({reviews.filter(review => review.rating === 1).length})
                </div> */}
                <div className="rating-item">
                    <span className="rating-item__star">
                        5
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <div className="rating-item__progress-bar">
                        <div className="rating-item__progress-bar__filled" style={{ width: `0%` }}></div>
                        {/* <div className="rating-item__progress-bar__filled" style={{ width: `${Math.round((reviews.filter(review => review.rating === 5).length / reviews.length * 100))}%` }}></div> */}
                    </div>
                    <span className="rating-item__percentage">
                        0%
                    </span>
                    {/* <span className="rating-item__percentage">{Math.round((reviews.filter(review => review.rating === 5).length / reviews.length * 100))}%</span> */}
                </div>
                <div className="rating-item">
                    <span className="rating-item__star">
                        4
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <div className="rating-item__progress-bar">
                        <div className="rating-item__progress-bar__filled" style={{ width: `0%` }}></div>
                        {/* <div className="rating-item__progress-bar__filled" style={{ width: `${Math.round((reviews.filter(review => review.rating === 4).length / reviews.length * 100))}%` }}></div> */}
                    </div>
                    <span className="rating-item__percentage">
                        0%
                    </span>
                    {/* <span className="rating-item__percentage">{Math.round((reviews.filter(review => review.rating === 4).length / reviews.length * 100))}%</span> */}
                </div>
                <div className="rating-item">
                    <span className="rating-item__star">
                        3
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <div className="rating-item__progress-bar">
                        <div className="rating-item__progress-bar__filled" style={{ width: `0%` }}></div>
                        {/* <div className="rating-item__progress-bar__filled" style={{ width: `${Math.round((reviews.filter(review => review.rating === 3).length / reviews.length * 100))}%` }}></div> */}
                    </div>
                    <span className="rating-item__percentage">
                        0%
                    </span>
                    {/* <span className="rating-item__percentage">{Math.round((reviews.filter(review => review.rating === 3).length / reviews.length * 100))}%</span> */}
                </div>
                <div className="rating-item">
                    <span className="rating-item__star">
                        2
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <div className="rating-item__progress-bar">
                        <div className="rating-item__progress-bar__filled" style={{ width: `0%` }}></div>
                        {/* <div className="rating-item__progress-bar__filled" style={{ width: `${Math.round((reviews.filter(review => review.rating === 2).length / reviews.length * 100))}%` }}></div> */}
                    </div>
                    <span className="rating-item__percentage">
                        0%
                    </span>
                    {/* <span className="rating-item__percentage">{Math.round((reviews.filter(review => review.rating === 2).length / reviews.length * 100))}%</span> */}
                </div>
                <div className="rating-item">
                    <span className="rating-item__star">
                        1
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <div className="rating-item__progress-bar">
                        <div className="rating-item__progress-bar__filled" style={{ width: `0%` }}></div>
                        {/* <div className="rating-item__progress-bar__filled" style={{ width: `${Math.round((reviews.filter(review => review.rating === 1).length / reviews.length * 100))}%` }}></div> */}
                    </div>
                    <span className="rating-item__percentage">
                        0%
                    </span>
                    {/* <span className="rating-item__percentage">{Math.round((reviews.filter(review => review.rating === 1).length / reviews.length * 100))}%</span> */}
                </div>
            </div>

            <div className="commission-review-container">
                {filteredReviews && filteredReviews.length > 0 ? (filteredReviews.map((review) =>
                    <div className="commission-review-item" key={review.id}>
                        <div className="user md">
                            <div className="user--left">
                                <img src={review.user.avatar} alt="" className="user__avatar" />
                                <div className="user__name">
                                    <div className="user__name__title">{review.user.name}</div>
                                </div>
                            </div>
                        </div>
                        <div className='commission-review-item__rating'>{renderStars(review.rating)}</div>
                        <p>{review.content}</p>
                    </div>
                )) :
                    (
                        <p className='text-align-center'>Hiện chưa có đánh giá nào</p>
                    )}
            </div>
        </div>
    );
}
