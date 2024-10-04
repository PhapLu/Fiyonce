import { Outlet, useOutletContext, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';

// Resources
import RenderPosts from "../../components/crudPost/render/RenderPosts";

// Utils
import { apiUtils } from "../../utils/newRequest";

// Styling
import "./ExplorePosts.scss";

export default function ExplorePosts() {
    const [searchParams] = useSearchParams();
    const { selectedRecommender, selectedMovement } = useOutletContext(); // Add this to use the context
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Fetch recommended posts based on the selected recommender
    const fetchRecommendedPosts = async (page = 1) => {
        try {
            let endpoint;
            switch (selectedRecommender.algorithm) {
                case "following":
                    endpoint = `/recommender/readFollowingPosts?page=${page}&limit=10`;
                    break;
                case "latest":
                    endpoint = `/recommender/readLatestPosts?page=${page}&limit=10`;
                    break;
                case "popular":
                default:
                    endpoint = `/recommender/readPopularPosts?page=${page}&limit=10`;
                    break;
            }
            const response = await apiUtils.get(endpoint);
            console.log(response)

            // Add a safety check in case the response structure isn't what you expect
            const posts = response?.data.metadata?.posts || []; // Fallback to an empty array if posts are undefined

            return posts;
        } catch (error) {
            console.error("Error fetching recommended posts:", error);
            return []; // Return an empty array on error to prevent further issues
        }
    };

    // Fetch more posts as the user scrolls
    const fetchMorePosts = async () => {
        const nextPage = page + 1;
        const newPosts = await fetchRecommendedPosts(nextPage);

        if (newPosts.length > 0) {
            setFilteredPosts((prevPosts) => [...prevPosts, ...newPosts]);
            setPage(nextPage);
        } else {
            setHasMore(false); // No more posts to load
        }
    };

    useEffect(() => {
        const loadInitialPosts = async () => {
            const initialPosts = await fetchRecommendedPosts(1);

            setFilteredPosts(initialPosts);
            setPage(1);

            // Check if the initialPosts array has more than 0 items
            setHasMore(initialPosts.length > 0);
        };

        loadInitialPosts();
    }, [selectedRecommender]);
    // Fetch posts again if the recommender algorithm changes

    // Filter posts when selectedMovement changes
    useEffect(() => {
        if (selectedMovement && filteredPosts) {
            const filtered = filteredPosts.filter(post => post?.movementId?._id === selectedMovement?._id);
            setFilteredPosts(filtered);
        }
    }, [selectedMovement]);

    return (
        <>
            <InfiniteScroll
                dataLength={filteredPosts.length}
                next={fetchMorePosts}
                hasMore={hasMore}
            >
                <RenderPosts isDisplayOwner={true} layout={5} posts={filteredPosts} />
            </InfiniteScroll>
            <Outlet />
        </>
    );
}