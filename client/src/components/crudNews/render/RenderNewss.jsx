import { Link } from "react-router-dom";
import "./RenderNewss.scss";
import { useQuery } from 'react-query';
import { useRef, useState, useEffect } from 'react';
import { apiUtils } from "../../../utils/newRequest";

export default function RenderNewss() {
    const fetchNewss = async () => {
        try {
            const response = await apiUtils.get("/news/readNewss");
            console.log(response)
            return response.data.metadata.newss;
        } catch (error) {
            return null;
        }
    };

    const { data: newss, error, isError, isLoading } = useQuery('fetchNewss', fetchNewss, {
        onError: (error) => {
            console.error('Error fetching news:', error);
        },
        onSuccess: (news) => {
            // console.log('Fetched news:', news);
        },
    });

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
    }, [newss]);

    useEffect(() => {
        if (newss && newss.length > 0) {
            handleScroll();
        }
    }, [newss]);

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

    if (isLoading) {
        return <span>Đang tải...</span>;
    }

    if (isError) {
        return <span>Have an error: {error.message}</span>;
    }

    return (
        <div className="explore-news scroll">
            <button className={`button button-left ${showLeftButton ? 'show' : ''}`} onClick={scrollLeft}>&lt;</button>
            <div className="news-container scroll-container" ref={scrollContainerRef}>
                {newss?.map((newItem) => {
                    return <Link to={`/newss/${newItem._id}`} className="news-item scroll-item" key={newItem._id}>
                        <img src={newItem.thumbnail} alt={newItem.title} className="news-item__thumbnail" />
                        <div className="news-item__content">
                            <h4 className="news-item__title">{newItem.title}</h4>
                            <span className="news-item__sub-title">{newItem.subTitle}</span>
                        </div>
                    </Link>
                })}
            </div>
            <button className={`button button-right ${showRightButton ? 'show' : ''}`} onClick={scrollRight}>&gt;</button>
        </div>
    );
}