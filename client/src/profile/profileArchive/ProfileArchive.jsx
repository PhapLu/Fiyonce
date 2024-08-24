// Imports
import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom"
import { useQuery } from "react-query";

// Styling

import RenderPosts from "../../components/crudPost/render/RenderPosts";
import { apiUtils } from "../../utils/newRequest";
import RenderCommissionServices from "../../components/crudCommissionService/render/RenderCommissionServices";

export default function ProfileArchive() {
    const [archiveType, setArchiveType] = useState("post");
    const { profileInfo } = useOutletContext();
    console.log(profileInfo)

    // Depending on the archiveType, fetching the items archived by the profileInfo._id user
    const fetchBookmarkedPosts = async () => {
        try {
            const response = await apiUtils.get(`/post/readBookmarkedPosts/${profileInfo._id}`);
            console.log(response.data.metadata.posts)
            return response.data.metadata.posts;
        } catch (error) {
            console.log(error)
            return null;
        }
    }
    const { data: posts, error, isError, isLoading } = useQuery(
        ['fetchBookmarkedPosts'],
        fetchBookmarkedPosts,
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching bookmarked posts:', error);
            },
        }
    );

    // Depending on the archiveType, fetching the items archived by the profileInfo._id user
    const fetchBookmarkedServices = async () => {
        try {
            const response = await apiUtils.get(`/commissionService/readBookmarkedServices/${profileInfo._id}`);
            console.log(response.data.metadata.services)
            return response.data.metadata.services;
        } catch (error) {
            console.log(error)
            return null;
        }
    }
    const { data: services, fetchingBookmarkedServicesError, isFetchingBookmarkedServicesError, isFetchingBookmarkedServicesLoading } = useQuery(
        ['fetchBookmarkedServices'],
        fetchBookmarkedServices,
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (fetchingBookmarkedServicesError) => {
                console.error('Error fetching bookmarked posts:', fetchingBookmarkedServicesError);
            },
        }
    );

    return (
        <div className="profile-archive">
            <div className="profile-page__header">
                <div className="profile-page__header--left">
                    <button
                        className={`btn btn-3 btn-md ${archiveType === "post" ? "active" : ""}`}
                        onClick={() => setArchiveType("post")}
                    >
                        Tác phẩm
                    </button>

                    <button
                        className={`btn btn-3 btn-md ${archiveType === "service" ? "active" : ""}`}
                        onClick={() => setArchiveType("service")}
                    >
                        Dịch vụ
                    </button>
                </div>
            </div>





            {
                archiveType == "post" && (
                    posts?.length > 0 ? (
                        <RenderPosts isDisplayOwner={false} posts={posts} layout={4} />
                    ) : (
                        <p>
                            Hiện chưa có tranh để hiển thị
                        </p>
                    )
                )
            }

            {
                archiveType == "service" && (
                    services?.length > 0 ? (
                        <RenderCommissionServices commissionServices={services} layout={4} />
                    ) : (
                        <p>
                            Hiện chưa có dịch vụ để hiển thị
                        </p>
                    )
                )
            }
        </div>
    )
}