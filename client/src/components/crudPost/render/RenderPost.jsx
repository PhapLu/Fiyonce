// Imports
import { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";

// Utils
import { apiUtils } from "../../../utils/newRequest";
import { formatDate } from "../../../utils/formatter";
import { resizeImageUrl } from "../../../utils/imageDisplayer";

// Styling
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import "./RenderPost.scss";
import Loading from '../../loading/Loading';


export default function RenderPost() {
    const { userId } = useParams();
    const { postId } = useParams();
    const navigate = useNavigate(); // Use the useNavigate hook
    const renderPostRef = useRef();

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Simulate data loading or other async operations
        setTimeout(() => {
            setLoading(false);
        }, 500); // Simulating a 2 second loading delay
    }, []);


    useEffect(() => {
        const handler = (e) => {
            if (renderPostRef.current && !renderPostRef.current.contains(e.target)) {
                if (userId) {
                    navigate(`/users/${userId}/profile_posts`); // Navigate to the previous page
                } else {
                    navigate(`/explore/posts`); // Navigate to the previous page
                }
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [navigate]);

    // Fetch post details by ID
    const fetchPostByID = async () => {
        try {
            // Fetch posts data
            const response = await apiUtils.get(`/post/readPost/${postId}`);
            console.log(response.data.metadata.post)
            return response.data.metadata.post;
        } catch (error) {
            return null;
        }
    };

    const {
        data: post,
        error,
        isError,
        isLoading,
    } = useQuery("fetchPostByID", fetchPostByID);

    if (isLoading) {
        return <span>Đang tải...</span>;
    }

    if (isError) {
        return <span>Có lỗi xảy ra: {error.message}</span>;
    }

    return (
        <div className="overlay">
            {
                loading ? (
                    <Loading />
                ) : (


                    <div className="render-post modal-form type-1" ref={renderPostRef} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-form--left">
                            {post?.artworks?.length > 0 && (
                                <Carousel
                                    showArrows
                                    infiniteLoop
                                    showThumbs={false}
                                    dynamicHeight
                                >
                                    {post.artworks.map((artwork, index) => (
                                        <div key={index} className="render-commission-service__artwork-item">
                                            <img src={artwork.url} alt={`Artwork ${index + 1}`} />
                                        </div>
                                    ))}
                                </Carousel>
                            )}
                        </div>
                        <div className="modal-form--right">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                                navigate(-1); // Navigate to the previous page
                            }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>

                            <Link to={`/users/${post?.talentId._id}/profile_commission_services`} className="user md">
                                <div className="user--left">
                                    <img src={resizeImageUrl(post?.talentId?.avatar, 100)} alt="" className="user__avatar" />
                                    <div className="user__name">
                                        <div className="user__name__title">{post?.talentId?.fullName}</div>
                                        <div className="user__name__sub-title">{post?.talentId?.stageName}</div>
                                    </div>
                                </div>
                            </Link>
                            <hr className="mb-16" />
                            {post.movementId?.title && <button className="btn btn-4 br-16 mr-8">{post.movementId?.title}</button>}
                            {post.postCategoryId?.title && <button className="btn btn-4 br-16 mr-8">{post.postCategoryId?.title}</button>}
                            <p>{post.description}</p>
                            <br />
                            <span>Đăng tải lúc {formatDate(post.createdAt)}</span>
                            <br />
                            <hr className="mt-16" />
                            <div className="flex-align-center">
                                <span className="flex-align-center mr-8">
                                    <span className="mr-4">{post.likes?.length}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                </span>
                                <span className="flex-align-center">
                                    <span className="mr-4">{post.views}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div >
                )
            }
        </div >
    )
}
