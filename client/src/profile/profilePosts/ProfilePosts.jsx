// Imports
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

// Components
import Posts from "../../components/crudPost/render/RenderPosts"
import CreatePost from "../../components/crudPost/create/CreatePost"

// Styling
import "./ProfilePosts.scss";

export default function ProfilePosts() {
    const [overlayVisible, setOverlayVisible] = useState(false);
    const {userId} = useParams();

    const fetchPosts = async () => {
        try {
            // const response = await apiUtils.get(`/post/readPosts/${userId}`);
            // console.log(response.data.metadata.commissionService)
            // console.log(commissionService)
            // return response.data.metadata.commissionService;
            return [
                {
                    _id: "1",
                    title: "OC",
                    posts: [
                        {
                            _id: "1",
                            media: [
                                "https://i.pinimg.com/236x/c9/33/5b/c9335be944756f57311179e16e463a96.jpg",
                                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
                            ],
                            talentId: "1",
                            talentUsername: "nhatluuquoc03",
                            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
                            viewCount: 3600
                        },
                        {
                            _id: "2",
                            media: [
                                "https://i.pinimg.com/236x/e9/7f/44/e97f44573df1dd4ae1f9f1bbff9be71f.jpg",
                                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
                            ],
                            talentId: "2",
                            talentUsername: "nhatluuquoc03",
                            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
                            viewCount: 3600
                        },
                        {
                            _id: "3",
                            media: [
                                "https://i.pinimg.com/236x/2b/97/3a/2b973a795a718f2193c18e0be888f7ef.jpg",
                                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
                            ],
                            talentId: "3",
                            talentUsername: "nhatluuquoc03",
                            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
                            viewCount: 3600
                        },
                    ]
                },
                {
                    _id: "2",
                    title: "Fanart",
                    posts: [
                        {
                            _id: "4",
                            media: [
                                "https://i.pinimg.com/474x/22/39/24/223924bd54baf7cf19727ea031204da4.jpg",
                                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
                            ],
                            talentId: "4",
                            talentUsername: "nhatluuquoc03",
                            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
                            viewCount: 3600
                        },
                        {
                            _id: "5",
                            media: [
                                "https://i.pinimg.com/564x/4c/61/4f/4c614f6e646df3868e5df3fa16d71d71.jpg",
                                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
                            ],
                            talentId: "5",
                            talentUsername: "nhatluuquoc03",
                            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
                            viewCount: 3600
                        },
                        {
                            _id: "6",
                            media: [
                                "https://i.pinimg.com/236x/bc/d3/3f/bcd33f453decc45b7777be8e7d04d8bc.jpg",
                                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
                            ],
                            talentId: "6",
                            talentUsername: "nhatluuquoc03",
                            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
                            viewCount: 3600
                        },
                        {
                            _id: "7",
                            media: [
                                "https://i.pinimg.com/236x/c1/d3/d3/c1d3d3c242105537d2574089a200bb0e.jpg",
                                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
                            ],
                            talentId: "7",
                            talentUsername: "nhatluuquoc03",
                            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
                            viewCount: 3600
                        },
                        {
                            _id: "8",
                            media: [
                                "https://i.pinimg.com/236x/7a/9c/58/7a9c58474802d8c98ad22166c4dd2930.jpg",
                                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
                            ],
                            talentId: "8",
                            talentUsername: "nhatluuquoc03",
                            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
                            viewCount: 3600
                        },
                        {
                            _id: "9",
                            media: [
                                "https://i.pinimg.com/736x/3d/f2/69/3df269fe2194150b4fa5828ba6b343a6.jpg",
                                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
                            ],
                            talentId: "9",
                            talentUsername: "nhatluuquoc03",
                            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
                            viewCount: 3600
                        },
                        {
                            _id: "10",
                            media: [
                                "https://i.pinimg.com/236x/aa/7c/c7/aa7cc774ab7c063ac183ed62e1332213.jpg",
                                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
                            ],
                            talentId: "10",
                            talentUsername: "nhatluuquoc03",
                            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
                            viewCount: 3600
                        }
                    ]
                }
            ]
        } catch (error) {
            return null;
        }
    }

    const { data: postsByCollections, error, isError, isLoading } = useQuery(
        ['fetchPosts'],
        fetchPosts,
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching service by ID:', error);
            },
        }
    );

    const [activeCollectionId, setActiveCollectionId] = useState("all");

    const [posts, setPosts] = useState(postsByCollections?.map(collection => collection.posts).flat());
    const [showcasingPostCollections, setPortfolioCollections] = useState(postsByCollections.map(collection => { return { _id: collection._id, title: collection.title } }));
    const [showCreatePostForm, setShowCreatePostForm] = useState(false);

    const handleCollectionClick = (collectionId) => {
        setActiveCollectionId(collectionId);
        if (collectionId === "all") {
            setPosts(postsByCollections?.map(collection => collection.posts).flat());
        } else {
            const selectedCollection = postsByCollections.find(col => col._id === collectionId);
            if (selectedCollection) {
                setPosts(selectedCollection.posts);
            }
        }
    };

    const queryClient = useQueryClient();
    const createMutation = useMutation(
        async (formData) => {
            const response = await fetch("/api/showcasingPost", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries("posts");
                setPosts(prev => [...prev, data]);
            },
        }
    );

    if (isLoading) {
        return <span>Đang tải...</span>
    }

    if (isError) {
        return <span>Có lỗi xảy ra: {error.message}</span>
    }

    return (
        <>
            <div className="profile-posts">
                <div className="profile-page__header">
                    <div className="profile-page__header--left">
                        <button
                            className={`btn btn-3 btn-md ${activeCollectionId === "all" ? "active" : ""}`}
                            onClick={() => handleCollectionClick("all")}
                        >
                            Tất cả
                        </button>
                        {postsByCollections?.map((collection, index) => (
                            <button
                                className={`btn btn-3 btn-md ${activeCollectionId === collection._id ? "active" : ""}`}
                                key={index}
                                onClick={() => handleCollectionClick(collection._id)}
                            >
                                {collection.title}
                            </button>
                        ))}
                    </div>
                    <div className="profile-page__header--right">
                        <button className="btn btn-3" onClick={() => { setShowCreatePostForm(true); setOverlayVisible(true) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Tác phẩm
                        </button>
                    </div>
                </div>

                {posts && posts.length > 0 ? (
                    <Posts layout={4} posts={posts} />
                ) : (
                    <p>No posts to be displayed</p>
                )}
            </div>

            {overlayVisible && (
                <div className={`overlay`}>
                    {showCreatePostForm && <CreatePost showcasingPostCollections={showcasingPostCollections} setShowCreatePostForm={setShowCreatePostForm} setOverlayVisible={setOverlayVisible} />}
                </div>
            )}
        </>
    );
}