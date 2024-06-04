import { Link } from "react-router-dom";
import "./News.scss";
import { useQuery } from 'react-query';
import { useRef, useState, useEffect } from 'react';

export default function News() {
    // Fetch news
    const fetchNews = async () => {
        try {
            // Simulated data fetching
            return [{
                _id: "1",
                title: "[Event tháng 07] Vì một Việt Nam xanh",
                subTitle: "Vì một Việt Nam xanh hơn",
                thumbnail: "https://i.pinimg.com/736x/9d/d6/89/9dd689ebb495fb0fcd44ead16efcef3b.jpg",
                content: "ABC",
            },
            {
                _id: "2",
                title: "[Tính năng mới] Dual challange",
                subTitle: "Thử thách ghép cặp",
                thumbnail: "https://i.pinimg.com/736x/8e/31/ea/8e31ea5c22f956db9bd5344f1c1ef600.jpg",
                content: "ABC",
            },
            {
                _id: "3",
                title: "[Bộ sưu tập mùa đông 2024] Tuyệt tác",
                subTitle: "Tác phẩm mùa đông 2024",
                thumbnail: "https://i.pinimg.com/564x/56/14/b9/5614b97d4e2189d3d9cb3dc2100b530c.jpg",
                content: "ABC",
            },
            {
                _id: "4",
                title: "[Event tháng 07] Vì một Việt Nam xanh",
                subTitle: "Vì một Việt Nam xanh hơn",
                thumbnail: "https://i.pinimg.com/564x/18/d3/dd/18d3ddcdd9d28dcc3e49e1813afe0986.jpg",
                content: "ABC",
            },
            {
                _id: "5",
                title: "[Event tháng 07] Vì một Việt Nam xanh",
                subTitle: "Vì một Việt Nam xanh hơn",
                thumbnail: "https://i.pinimg.com/736x/56/cb/ec/56cbec22e8e48a04e5c54f044e247b5e.jpg",
                content: "ABC",
            },
            {
                _id: "6",
                title: "[Event tháng 07] Vì một Việt Nam xanh",
                subTitle: "Vì một Việt Nam xanh hơn",
                thumbnail: "https://i.pinimg.com/564x/d8/cd/39/d8cd399120daa999dab1ac1592ddb320.jpg",
                content: "ABC",
            },
            {
                _id: "7",
                title: "[Event tháng 07] Vì một Việt Nam xanh",
                subTitle: "Vì một Việt Nam xanh hơn",
                thumbnail: "https://i.pinimg.com/564x/18/d3/dd/18d3ddcdd9d28dcc3e49e1813afe0986.jpg",
                content: "ABC",
            },
            {
                _id: "8",
                title: "[Event tháng 07] Vì một Việt Nam xanh",
                subTitle: "Vì một Việt Nam xanh hơn",
                thumbnail: "https://i.pinimg.com/564x/50/ad/f2/50adf2009fce9b244bab84521b85aba9.jpg",
                content: "ABC",
            }];
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const { data: news, error, isError, isLoading } = useQuery('fetchNews', fetchNews, {
        onError: (error) => {
            console.error('Error fetching news:', error);
        },
        onSuccess: (news) => {
            console.log('Fetched news:', news);
        },
    });

    const containerRef = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);

    const scrollLeft = () => {
        containerRef.current.scrollBy({
            top: 0,
            left: -300,
            behavior: 'smooth'
        });
    };

    const scrollRight = () => {
        containerRef.current.scrollBy({
            top: 0,
            left: 300,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
            setShowLeftButton(scrollLeft > 0);
            setShowRightButton(scrollLeft + clientWidth < scrollWidth);
        };

        if (containerRef.current) {
            containerRef.current.addEventListener('scroll', handleScroll);
            handleScroll();
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [news]);

    useEffect(() => {
        if (news && news.length > 0) {
            handleScroll();
        }
    }, [news]);

    const handleScroll = () => {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft + clientWidth < scrollWidth);

        const items = containerRef.current.getElementsByClassName('news-item');
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
        <div className="news">
            <button className={`button button-left ${showLeftButton ? 'show' : ''}`} onClick={scrollLeft}>&lt;</button>
            <div className="news-container" ref={containerRef}>
                {news && news.map((newItem) => (
                    <Link className="news-item" to={`/news/${newItem._id}`} key={newItem._id}>
                        <img src={newItem.thumbnail} alt={newItem.title} className="news-item__thumbnail" />
                        <div className="news-item__content">
                            <h4 className="news-item__title">{newItem.title}</h4>
                            <span className="news-item__sub-title">{newItem.subTitle}</span>
                        </div>
                    </Link>
                ))}
            </div>
            <button className={`button button-right ${showRightButton ? 'show' : ''}`} onClick={scrollRight}>&gt;</button>
        </div>
    );
}
