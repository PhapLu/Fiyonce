// Imports
import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { useQuery } from "react-query";

// Resources
import Navbar from '../../components/navbar/Navbar.jsx';
import RenderNewss from "../../components/crudNews/render/RenderNewss.jsx";
import BackToTop from '../../components/backToTop/BackToTop.jsx';

// Utils
import { formatFloat, formatNumber, limitString } from "../../utils/formatter.js";

// Styling
import "../../assets/scss/base.scss";
import "./ExploreLayout.scss";
import { useMovement } from '../../contexts/movement/MovementContext.jsx';

export default function Explore() {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { movements } = useMovement();

    // Initialize selectedMovement based on the movementId from the URL, defaulting to null (for "Tất cả")
    const movementIdFromUrl = searchParams.get("movementId");
    const [selectedMovement, setSelectedMovement] = useState(movementIdFromUrl || null);

    const [showRecommenders, setShowRecommenders] = useState(false);
    const [selectedRecommender, setSelectedRecommender] = useState({
        title: "Phổ biến",
        algorithm: "popular"
    });

    const recommenders = [
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
          </svg>
          `,
            title: "Phổ biến",
            algorithm: "popular"
        },
        // {
        //     title: "Đang theo dõi",
        //     algorithm: "following"
        // },
        {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          `,
            title: "Mới nhất",
            algorithm: "latest"
        }
    ];

    const scrollContainerRef = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);

    const scrollLeft = () => {
        scrollContainerRef.current.scrollBy({
            top: 0,
            left: -300,
            behavior: 'smooth'
        });
    };

    const scrollRight = () => {
        scrollContainerRef.current.scrollBy({
            top: 0,
            left: 300,
            behavior: 'smooth'
        });
    };
    useEffect(() => {
        if (movementIdFromUrl && movements.length > 0) {
            // Find the movement object that matches the movementIdFromUrl
            const movement = movements.find(mov => mov._id === movementIdFromUrl);
            setSelectedMovement(movement || null); // Set to the found movement or to null if not found
        } else {
            // If no movementId is in the URL, default to "Tất cả" (null)
            setSelectedMovement(null);
        }
    }, [movementIdFromUrl, movements]);

    useEffect(() => {
        const handleScroll = () => {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftButton(scrollLeft > 0);
            setShowRightButton(scrollLeft + clientWidth < scrollWidth);
        };

        if (scrollContainerRef.current) {
            scrollContainerRef.current.addEventListener('scroll', handleScroll);
            handleScroll();
        }

        return () => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [movements]);

    useEffect(() => {
        if (movements && movements.length > 0) {
            handleScroll();
        }
    }, [movements]);

    const handleScroll = () => {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft + clientWidth < scrollWidth);

        const items = scrollContainerRef.current.getElementsByClassName('scroll-item');
        Array.from(items).forEach((item, index) => {
            if (index === items.length - 1 && scrollLeft + clientWidth < scrollWidth) {
                item.classList.add('opacity');
            } else {
                item.classList.remove('opacity');
            }
        });
    };

    const handleRecommenderChange = (recommender, movement = null) => {
        setSelectedRecommender(recommender);

        // Update the URL with the selected movement's ID
        if (movement) {
            setSearchParams({ movementId: movement._id });
        } else {
            setSearchParams({}); // Clear movementId from URL if no movement is selected
        }

        setSelectedMovement(movement);
        setShowRecommenders(false); // Hide the recommender container
    };

    const recommenderContainerRef = useRef();
    // Close recommender dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (recommenderContainerRef.current && !recommenderContainerRef.current.contains(event.target)) {
                setShowRecommenders(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch artworks

    return (
        <>
            <div className="explore">
                {/* Display informative news */}
                <RenderNewss />

                {/* Sub navigation bar of the page */}
                <div className="sub-nav-container">
                    <div className="sub-nav-container--left">
                        <Link className={`sub-nav-item btn ${location.pathname.split('/').filter(Boolean).length === 0 ? "active" : ""}`} to="/"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
                            </svg>
                            Tranh vẽ
                        </Link>
                        {/* <Link className={`sub-nav-item btn ${location.pathname.includes('talents') ? "active" : ""}`} to="/talents"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                                </svg>
                                Họa sĩ
                            </Link> */}
                        <Link className={`sub-nav-item btn ${location.pathname.includes('commission-services') ? "active" : ""}`} to="/commission-services">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                            </svg>
                            Dịch vụ
                        </Link>
                    </div>

                    {/* <div className="sub-nav-navigation--right">
                    <button className="btn btn-3 btn-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
                        </svg>
                        Chỉnh sửa newsfeed
                    </button>
                </div> */}
                </div>
                <hr />

                <div className="explore__filter-container">
                    <div className="show-recommender-btn">
                        <button className="btn btn-7 btn-md" onClick={() => { setShowRecommenders(!showRecommenders) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <span className='fw-600'>
                                {selectedRecommender.title}
                            </span>
                        </button>

                        {showRecommenders && (
                            <div className="recommender-container" ref={recommenderContainerRef}>
                                {recommenders && recommenders.map((recommender, idx) => {
                                    return (
                                        <div key={idx} className="recommender-item flex-align-center" onClick={() => handleRecommenderChange(recommender)}>
                                            <div dangerouslySetInnerHTML={{ __html: `${recommender.icon}` }}></div>

                                            <span className='ml-8'>{recommender.title}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="scroll">
                        <div className="scroll-container" ref={scrollContainerRef}>
                            <button className={`button button-left ${showLeftButton ? 'show' : ''}`} onClick={scrollLeft}>&lt;</button>
                            <div onClick={() => handleRecommenderChange(selectedRecommender, null)} className={`explore__filter-item scroll-item flex-align-center ${selectedMovement === null ? "active" : ""}`}>
                                <img src="https://i.pinimg.com/564x/3d/1e/f7/3d1ef71d293b8a427a601f1e3d676dbf.jpg" alt="Tất cả" className="scroll-item__thumbnail" />
                                <div className="explore__filter-item__details">
                                    <span className="explore__filter-item__details__title">Tất cả</span>
                                    {/* {
                                        location.pathname.includes("commission-services") ?
                                            (
                                                <span className="explore__fitler-item__details__count">{formatNumber(movements?.totalServiceCount, 0)}</span>
                                            )
                                            :
                                            (
                                                <span className="explore__fitler-item__details__count">{formatNumber(movements?.totalPostCount, 0)}</span>
                                            )
                                    } */}
                                </div>
                            </div>

                            {movements && movements?.map((movement, idx) => (
                                <div key={idx} onClick={() => handleRecommenderChange(selectedRecommender, movement)} className={`explore__filter-item scroll-item flex-align-center ${selectedMovement?._id === movement._id ? "active" : ""}`}>
                                    <img src={movement?.thumbnail} alt={movement?.title} className="scroll-item__thumbnail" />
                                    <div className="explore__filter-item__details">
                                        <span className="explore__filter-item__details__title">{limitString(movement?.title, 12)}</span>
                                        {
                                            location.pathname.includes("commission-services") ?
                                                (
                                                    <span className="explore__fitler-item__details__count">{movement.commissionServiceCount > 1000 ? formatNumber(movement.commissionServiceCount, 1) : movement.commissionServiceCount}</span>
                                                )
                                                :
                                                (
                                                    <span className="explore__fitler-item__details__count">{movement.postCount > 1000 ? formatNumber(movement.postCount, 1) : movement.postCount}</span>
                                                )
                                        }
                                    </div>
                                </div>
                            ))}

                            <button className={`button button-right ${showRightButton ? 'show' : ''}`} onClick={scrollRight}>&gt;</button>
                        </div>
                    </div>
                </div>

                <div className="outlet-content">
                    <Outlet context={{ selectedRecommender, selectedMovement }} />
                </div>
                <BackToTop />
            </div>
        </>
    )
}