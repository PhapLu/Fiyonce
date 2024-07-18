// Imports
import { useState } from "react";
import { useQuery } from "react-query";
import {Outlet} from "react-router-dom"

// Resources
import Posts from "../../components/crudPost/render/RenderPosts";

// Utils
import { apiUtils } from "../../utils/newRequest"

// Styling

export default function ExplorePosts() {
    const fetchRecommendedPosts = async () => {
        try {
            const response = await apiUtils.get(`/recommender/readPopularPosts`);
            console.log(response.data.metadata.posts)
            return response.data.metadata.posts;
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    const { data: posts, error: fetchingPostss, isError: isFetchingPostssError, isLoading: isFetchingPostssLoading } = useQuery(
        'fetchRecommendedPosts',
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
            <Posts layout={6} posts={posts} />
            <Outlet />
        </>
    )
}