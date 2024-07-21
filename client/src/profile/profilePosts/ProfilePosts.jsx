// Imports
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams, Outlet, useOutletContext } from "react-router-dom";
import { useQuery } from "react-query";

// Components
import RenderPosts from "../../components/crudPost/render/RenderPosts";
import CreatePost from "../../components/crudPost/create/CreatePost";

// Utils
import { apiUtils } from "../../utils/newRequest.js";

// Styling
import "./ProfilePosts.scss";
import { useMovement } from "../../contexts/movement/MovementContext.jsx";

export default function ProfilePosts() {
    const [overlayVisible, setOverlayVisible] = useState(false);
    const { userId } = useParams();
    const {movements} = useMovement

    const { postId } = useParams();
    const profileInfo = useOutletContext();
    // alert(profileInfo)

    const fetchPosts = async () => {
        try {
            // Fetch posts data
            const response = await apiUtils.get(`/post/readPostCategoriesWithPosts/${userId}`);
            console.log(response.data.metadata.categorizedPosts)
            return response.data.metadata.categorizedPosts;
        } catch (error) {
            throw new Error("Error fetching posts");
        }
    };

    const {
        data: postsByCategories = [],
        error,
        isError,
        isLoading,
    } = useQuery("fetchPosts", fetchPosts);


    const createPostMutation = useMutation(
        async (formData) => {
            console.log(formData)
            const response = await apiUtils.post("/post/createPost", formData);
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("fetchPosts");
            },
            onError: (error) => {
                return error;
            },
        }
    );

    const updatePostMutation = useMutation(
        async (postId, fd) => {
            const response = await apiUtils.patch(`/post/updatePost/${postId}`, fd);
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("fetchPosts");
            },
            onError: (error) => {
                return error;
            },
        }
    );

    const deletePostMutation = useMutation(
        async (postId) => {
            const response = await apiUtils.delete(`/post/deletePost/${postId}`);
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("fetchPosts");
            },
            onError: (error) => {
                return error;
            },
        }
    );


    const [postCategoryId, setPostCategoryId] = useState("all");
    const [posts, setPosts] = useState([]);
    const [postCategories, setPostCategories] = useState([]);
    const [showCreatePostForm, setShowCreatePostForm] = useState(false);

    useEffect(() => {
        if (postsByCategories.length > 0) {
            setPosts(postsByCategories.map((collection) => collection.posts).flat());
            setPostCategories(
                postsByCategories.map((collection) => ({
                    _id: collection._id,
                    title: collection.title,
                }))
            );
        }
    }, [postsByCategories]);

    const queryClient = useQueryClient();

    const handleCategoryClick = (collectionId) => {
        setPostCategoryId(collectionId);
        if (collectionId === "all") {
            setPosts(postsByCategories.map((collection) => collection.posts).flat());
        } else {
            const selectedCategory = postsByCategories.find(
                (col) => col._id === collectionId
            );
            if (selectedCategory) {
                setPosts(selectedCategory.posts);
            }
        }
    };

    if (isLoading) {
        return <span>Đang tải...</span>;
    }

    if (isError) {
        return <span>Có lỗi xảy ra: {error.message}</span>;
    }

    return (
        <>
            <div className="profile-posts">
                <div className="profile-page__header">
                    <div className="profile-page__header--left">
                        <button
                            className={`btn btn-3 btn-md ${postCategoryId === "all" ? "active" : ""}`}
                            onClick={() => handleCategoryClick("all")}
                        >
                            Tất cả
                        </button>
                        {postsByCategories.map((collection, index) => (
                            <button
                                className={`btn btn-3 btn-md ${postCategoryId === collection._id ? "active" : ""}`}
                                key={index}
                                onClick={() => handleCategoryClick(collection._id)}
                            >
                                {collection.title}
                            </button>
                        ))}
                    </div>
                    <div className="profile-page__header--right">
                        <button className="btn btn-3" onClick={() => { setShowCreatePostForm(true); setOverlayVisible(true); }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Tác phẩm
                        </button>
                    </div>
                </div>

                {posts.length > 0 ? (
                    <RenderPosts layout={4} posts={posts} isDisplayOwner={false} allowEditDelete={true}/>
                ) : (
                    <p>Hiện chưa có tác phẩm nào. <span className="highlight-text">Đăng tải</span> ngay</p>
                )}
            </div>

            {overlayVisible && (
                <div className={`overlay`}>
                    {showCreatePostForm && (
                        <CreatePost
                            postCategories={postCategories}
                            setShowCreatePostForm={setShowCreatePostForm}
                            setOverlayVisible={setOverlayVisible}
                            createPostMutation={createPostMutation}
                        />
                    )}
                </div>
            )}
            <Outlet context={{postCategories, movements, createPostMutation, updatePostMutation, deletePostMutation}}/>
        </>
    );
}