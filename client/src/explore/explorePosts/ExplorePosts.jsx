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
            const movementId = searchParams.get('movementId');
            console.log(movementId)
    
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
    
            // Append the movementId query parameter if it exists
            if (movementId) {
                console.log("lll")
                endpoint += `&movementId=${movementId}`;
            }
    
            const response = await apiUtils.get(endpoint);
            const posts = response?.data.metadata?.posts || [];
    
            return posts;
        } catch (error) {
            console.error("Error fetching recommended posts:", error);
            return [];
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
            setHasMore(initialPosts.length > 0);
        };
    
        loadInitialPosts();
    }, [selectedRecommender, searchParams]);

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