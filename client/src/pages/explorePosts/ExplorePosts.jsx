// Imports
import { Outlet, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useEffect } from "react";

// Resources
import RenderPosts from "../../components/crudPost/render/RenderPosts";

// Utils
import { apiUtils } from "../../utils/newRequest";

export default function ExplorePosts() {
    const [searchParams] = useSearchParams();
    const recommenderType = searchParams.get("recommender") || "popular"; // Default to "popular" if not specified

    const fetchRecommendedPosts = async () => {
        try {
            let endpoint;
            switch (recommenderType) {
                case "following":
                    endpoint = `/recommender/readFollowingPosts`;
                    break;
                case "latest":
                    endpoint = `/recommender/readLatestPosts`;
                    break;
                case "popular":
                default:
                    endpoint = `/recommender/readPopularPosts`;
                    break;
            }
            const response = await apiUtils.get(endpoint);
            console.log(response.data.metadata.posts);
            return response.data.metadata.posts;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const { data: posts, error: fetchingPosts, isError: isFetchingPostsError, isLoading: isFetchingPostsLoading } = useQuery(
        ['fetchRecommendedPosts', recommenderType],
        fetchRecommendedPosts,
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching posts:', error);
            },
        }
    );

    return (
        <>
            {isFetchingPostsLoading && <p>Loading posts...</p>}
            {isFetchingPostsError && <p>Error fetching posts.</p>}
            <RenderPosts isDisplayOwner={true} layout={6} posts={posts} />
            <Outlet />
        </>
    );
}
