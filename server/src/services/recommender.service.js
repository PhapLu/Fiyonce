import Post from "../models/post.model.js";
import CommissionService from "../models/commissionService.model.js";
import { User } from "../models/user.model.js";
import { AuthFailureError, BadRequestError } from "../core/error.response.js";

class RecommenderService {
    static readPopularPosts = async () => {
        try {
            const posts = await Post.find()
                .populate("talentId")
                .populate("artworks")
                .populate("movementId")
                .populate("postCategoryId");

            // Compute the minimum and maximum values for scaling
            const [minValues, maxValues] = await Promise.all([
                Post.aggregate([
                    {
                        $lookup: {
                            from: "Users",
                            localField: "talentId",
                            foreignField: "_id",
                            as: "talent",
                        },
                    },
                    {
                        $unwind: "$talent",
                    },
                    {
                        $project: {
                            likesCount: { $size: "$likes" },
                            bookmarksCount: { $size: "$bookmarks" },
                            views: 1,
                            followersCount: { $size: "$talent.followers" },
                            ageInHours: {
                                $divide: [
                                    { $subtract: [new Date(), "$createdAt"] },
                                    1000 * 60 * 60,
                                ],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            minLikes: { $min: "$likesCount" },
                            minBookmarks: { $min: "$bookmarksCount" },
                            minViews: { $min: "$views" },
                            minFollowers: { $min: "$followersCount" },
                            minAge: { $min: "$ageInHours" },
                        },
                    },
                ]),
                Post.aggregate([
                    {
                        $lookup: {
                            from: "Users",
                            localField: "talentId",
                            foreignField: "_id",
                            as: "talent",
                        },
                    },
                    {
                        $unwind: "$talent",
                    },
                    {
                        $project: {
                            likesCount: { $size: "$likes" },
                            bookmarksCount: { $size: "$bookmarks" },
                            views: 1,
                            followersCount: { $size: "$talent.followers" },
                            ageInHours: {
                                $divide: [
                                    { $subtract: [new Date(), "$createdAt"] },
                                    1000 * 60 * 60,
                                ],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            maxLikes: { $max: "$likesCount" },
                            maxBookmarks: { $max: "$bookmarksCount" },
                            maxViews: { $max: "$views" },
                            maxFollowers: { $max: "$followersCount" },
                            maxAge: { $max: "$ageInHours" },
                        },
                    },
                ]),
            ]);

            const min = minValues[0] || {};
            const max = maxValues[0] || {};

            // Ensure default values are set if there are no documents
            const minLikesCount = min.minLikes || 0;
            const maxLikesCount = max.maxLikes || 1; // Avoid division by zero
            const minBookmarksCount = min.minBookmarks || 0;
            const maxBookmarksCount = max.maxBookmarks || 1; // Avoid division by zero
            const minViews = min.minViews || 0;
            const maxViews = max.maxViews || 1; // Avoid division by zero
            const minFollowersCount = min.minFollowers || 0;
            const maxFollowersCount = max.maxFollowers || 1; // Avoid division by zero
            const minAge = min.minAge || 0;
            const maxAge = max.maxAge || 1; // Avoid division by zero

            const scoredPosts = await Promise.all(
                posts.map(async (post) => {
                    const talent = await User.findById(post.talentId);

                    // Compute scaled values
                    const likesScaled =
                        (post.likes.length - minLikesCount) /
                        (maxLikesCount - minLikesCount);
                    const viewsScaled =
                        (post.views - minViews) / (maxViews - minViews);
                    const bookmarksScaled =
                        (post.bookmarks.length - minBookmarksCount) /
                        (maxBookmarksCount - minBookmarksCount);
                    const followersScaled =
                        (talent.followers.length - minFollowersCount) /
                        (maxFollowersCount - minFollowersCount);

                    // Compute post age weight
                    const hoursSinceCreation =
                        (new Date() - new Date(post.createdAt)) /
                        (60 * 60 * 1000);
                    const scaledPostAge =
                        (hoursSinceCreation - minAge) / (maxAge - minAge);

                    // Calculate engagement rate
                    const engagementRate = post.views
                        ? post.likes.length / post.views
                        : 0;

                    // Define weights
                    const weights = {
                        likes: 0.3,
                        views: 0.15,
                        bookmarks: 0.15,
                        followers: 0.1,
                        engagementRate: 0.1,
                        postAgeWeight: 0.2,
                    };

                    // Calculate the score with normalized values
                    const score =
                        likesScaled * weights.likes +
                        viewsScaled * weights.views +
                        followersScaled * weights.followers +
                        bookmarksScaled * weights.bookmarks +
                        engagementRate * weights.engagementRate +
                        scaledPostAge * weights.postAgeWeight;

                    return {
                        ...post.toObject(),
                        score,
                        scaledPostAge,
                        engagementRate,
                    };
                })
            );

            // Sort posts by score
            scoredPosts.sort((a, b) => b.score - a.score);

            // Select the top 20 scored posts
            const top20Posts = scoredPosts.slice(0, 20);

            // Select 30 random posts from the remaining posts
            const remainingPosts = scoredPosts.slice(20);
            const random30Posts = remainingPosts
                .sort(() => 0.5 - Math.random())
                .slice(0, 30);

            // Combine top 20 scored posts with 30 random posts
            const finalPosts = [...top20Posts, ...random30Posts];

            console.log(finalPosts);
            return {
                posts: finalPosts,
            };
        } catch (error) {
            console.error("Error in readPopularPosts:", error);
            throw new Error("Failed to read popular posts");
        }
    };

    static readFollowingPosts = async (userId) => {
        try {
            // Fetch the current user and their following list
            const currentUser = await User.findById(userId);
            console.log(currentUser);

            // Extract the IDs of the users the current user is following
            const followingIds = currentUser.following.map((user) => user._id);

            // Fetch posts from users in the following list
            const posts = await Post.find({ talentId: { $in: followingIds } })
                .populate("talentId")
                .populate("artworks")
                .populate("movementId")
                .populate("postCategoryId")
                .limit(50) // Limit the results to 50
                .exec();
            console.log(posts);
            // Compute the minimum and maximum values for scaling
            // const [minValues, maxValues] = await Promise.all([
            //     Post.aggregate([
            //         {
            //             $match: {
            //                 talentId: { $in: currentUser.following.map((follow) => follow._id) }
            //             }
            //         },
            //         {
            //             $lookup: {
            //                 from: 'Users',
            //                 localField: 'talentId',
            //                 foreignField: '_id',
            //                 as: 'talent'
            //             }
            //         },
            //         {
            //             $unwind: '$talent'
            //         },
            //         {
            //             $project: {
            //                 likesCount: { $size: "$likes" },
            //                 bookmarksCount: { $size: "$bookmarks" },
            //                 views: 1,
            //                 followersCount: { $size: "$talent.followers" },
            //                 ageInHours: {
            //                     $divide: [
            //                         { $subtract: [new Date(), "$createdAt"] },
            //                         1000 * 60 * 60
            //                     ]
            //                 }
            //             }
            //         },
            //         {
            //             $group: {
            //                 _id: null,
            //                 minLikes: { $min: "$likesCount" },
            //                 minBookmarks: { $min: "$bookmarksCount" },
            //                 minViews: { $min: "$views" },
            //                 minFollowers: { $min: "$followersCount" },
            //                 minAge: { $min: "$ageInHours" }
            //             }
            //         }
            //     ]),
            //     Post.aggregate([
            //         {
            //             $match: {
            //                 talentId: { $in: currentUser.following.map((follow) => follow._id) }
            //             }
            //         },
            //         {
            //             $lookup: {
            //                 from: 'Users',
            //                 localField: 'talentId',
            //                 foreignField: '_id',
            //                 as: 'talent'
            //             }
            //         },
            //         {
            //             $unwind: '$talent'
            //         },
            //         {
            //             $project: {
            //                 likesCount: { $size: "$likes" },
            //                 bookmarksCount: { $size: "$bookmarks" },
            //                 views: 1,
            //                 followersCount: { $size: "$talent.followers" },
            //                 ageInHours: {
            //                     $divide: [
            //                         { $subtract: [new Date(), "$createdAt"] },
            //                         1000 * 60 * 60
            //                     ]
            //                 }
            //             }
            //         },
            //         {
            //             $group: {
            //                 _id: null,
            //                 maxLikes: { $max: "$likesCount" },
            //                 maxBookmarks: { $max: "$bookmarksCount" },
            //                 maxViews: { $max: "$views" },
            //                 maxFollowers: { $max: "$followersCount" },
            //                 maxAge: { $max: "$ageInHours" }
            //             }
            //         }
            //     ])
            // ])

            // const min = minValues[0] || {}
            // const max = maxValues[0] || {}

            // // Ensure default values are set if there are no documents
            // const minLikesCount = min.minLikes || 0
            // const maxLikesCount = max.maxLikes || 1 // Avoid division by zero
            // const minBookmarksCount = min.minBookmarks || 0
            // const maxBookmarksCount = max.maxBookmarks || 1 // Avoid division by zero
            // const minViews = min.minViews || 0
            // const maxViews = max.maxViews || 1 // Avoid division by zero
            // const minFollowersCount = min.minFollowers || 0
            // const maxFollowersCount = max.maxFollowers || 1 // Avoid division by zero
            // const minAge = min.minAge || 0
            // const maxAge = max.maxAge || 1 // Avoid division by zero

            // const scoredPosts = await Promise.all(
            //     posts.map(async (post) => {
            //         const talent = await User.findById(post.talentId)

            //         // Compute scaled values
            //         const likesScaled = (post.likes.length - minLikesCount) / (maxLikesCount - minLikesCount)
            //         const viewsScaled = (post.views - minViews) / (maxViews - minViews)
            //         const bookmarksScaled = (post.bookmarks.length - minBookmarksCount) / (maxBookmarksCount - minBookmarksCount)
            //         const followersScaled = (talent.followers.length - minFollowersCount) / (maxFollowersCount - minFollowersCount)

            //         // Compute post age weight
            //         const hoursSinceCreation = (new Date() - new Date(post.createdAt)) / (60 * 60 * 1000)
            //         const scaledPostAge = (hoursSinceCreation - minAge) / (maxAge - minAge)

            //         // Calculate engagement rate
            //         const engagementRate = post.views ? post.likes.length / post.views : 0

            //         // Define weights
            //         const weights = {
            //             likes: 0.3,
            //             views: 0.3,
            //             followers: 0.2,
            //             bookmarks: 0.2,
            //             engagementRate: 0.2,
            //         }

            //         // Calculate the score with normalized values
            //         const score =
            //             (likesScaled * weights.likes) +
            //             (viewsScaled * weights.views) +
            //             (followersScaled * weights.followers) +
            //             (bookmarksScaled * weights.bookmarks) +
            //             (engagementRate * weights.engagementRate)

            //         return { ...post.toObject(), score }
            //     })
            // )

            // // Sort posts by score
            // scoredPosts.sort((a, b) => b.score - a.score)

            // // Return the top 50 scored posts
            // return {
            //     posts: scoredPosts.slice(0, 50)
            // }

            // Randomize the posts
            const randomPosts = posts.sort(() => 0.5 - Math.random());

            return {
                posts: randomPosts,
            };
        } catch (error) {
            console.error("Error in readFollowingPosts:", error);
            throw new Error("Failed to read following posts");
        }
    };

    static readLatestPosts = async () => {
        try {
            // Fetch posts and compute min/max values
            const posts = await Post.find({})
                .populate("talentId")
                .populate("artworks")
                .populate("movementId")
                .populate("postCategoryId");

            // Compute the minimum and maximum values for scaling
            const [minValues, maxValues] = await Promise.all([
                Post.aggregate([
                    {
                        $lookup: {
                            from: "Users", // Correct collection name
                            localField: "talentId",
                            foreignField: "_id",
                            as: "talent",
                        },
                    },
                    {
                        $unwind: "$talent",
                    },
                    {
                        $project: {
                            likesCount: { $size: "$likes" },
                            bookmarksCount: { $size: "$bookmarks" },
                            views: 1,
                            followersCount: { $size: "$talent.followers" },
                            ageInHours: {
                                $divide: [
                                    { $subtract: [new Date(), "$createdAt"] },
                                    1000 * 60 * 60,
                                ],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            minLikes: { $min: "$likesCount" },
                            minBookmarks: { $min: "$bookmarksCount" },
                            minViews: { $min: "$views" },
                            minFollowers: { $min: "$followersCount" },
                            minAge: { $min: "$ageInHours" },
                        },
                    },
                ]),
                Post.aggregate([
                    {
                        $lookup: {
                            from: "Users", // Correct collection name
                            localField: "talentId",
                            foreignField: "_id",
                            as: "talent",
                        },
                    },
                    {
                        $unwind: "$talent",
                    },
                    {
                        $project: {
                            likesCount: { $size: "$likes" },
                            bookmarksCount: { $size: "$bookmarks" },
                            views: 1,
                            followersCount: { $size: "$talent.followers" },
                            ageInHours: {
                                $divide: [
                                    { $subtract: [new Date(), "$createdAt"] },
                                    1000 * 60 * 60,
                                ],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            maxLikes: { $max: "$likesCount" },
                            maxBookmarks: { $max: "$bookmarksCount" },
                            maxViews: { $max: "$views" },
                            maxFollowers: { $max: "$followersCount" },
                            maxAge: { $max: "$ageInHours" },
                        },
                    },
                ]),
            ]);

            const min = minValues[0] || {};
            const max = maxValues[0] || {};

            // Ensure default values are set if there are no documents
            const minLikesCount = min.minLikes || 0;
            const maxLikesCount = max.maxLikes || 1; // Avoid division by zero
            const minBookmarksCount = min.minBookmarks || 0;
            const maxBookmarksCount = max.maxBookmarks || 1; // Avoid division by zero
            const minViews = min.minViews || 0;
            const maxViews = max.maxViews || 1; // Avoid division by zero
            const minFollowersCount = min.minFollowers || 0;
            const maxFollowersCount = max.maxFollowers || 1; // Avoid division by zero
            const minAge = min.minAge || 0;
            const maxAge = max.maxAge || 1; // Avoid division by zero

            const scaledPosts = await Promise.all(
                posts.map(async (post) => {
                    const talent = await User.findById(post.talentId);

                    // Compute scaled values
                    const likesScaled =
                        (post.likes.length - minLikesCount) /
                        (maxLikesCount - minLikesCount);
                    const viewsScaled =
                        (post.views - minViews) / (maxViews - minViews);
                    const bookmarksScaled =
                        (post.bookmarks.length - minBookmarksCount) /
                        (maxBookmarksCount - minBookmarksCount);
                    const followersScaled =
                        (talent.followers.length - minFollowersCount) /
                        (maxFollowersCount - minFollowersCount);

                    // Compute post age weight
                    const hoursSinceCreation =
                        (new Date() - new Date(post.createdAt)) /
                        (60 * 60 * 1000);
                    const scaledPostAge =
                        (hoursSinceCreation - minAge) / (maxAge - minAge);

                    // Calculate engagement rate
                    const engagementRate = post.views
                        ? post.likes.length / post.views
                        : 0;

                    // Define weights
                    const weights = {
                        likes: 0.2,
                        views: 0.1,
                        followers: 0.05,
                        bookmarks: 0.05,
                        engagementRate: 0.1,
                        postAgeWeight: 0.5,
                    };

                    // Calculate the score with normalized values
                    const score =
                        likesScaled * weights.likes +
                        viewsScaled * weights.views +
                        followersScaled * weights.followers +
                        bookmarksScaled * weights.bookmarks +
                        engagementRate * weights.engagementRate +
                        scaledPostAge * weights.postAgeWeight;
                    return { ...post.toObject(), score };
                })
            );

            // Sort posts by score
            scaledPosts.sort((a, b) => b.score - a.score);

            // Select the top 20 scored posts
            const top20Posts = scaledPosts.slice(0, 20);

            // Select 30 random posts from the remaining posts
            const remainingPosts = scaledPosts.slice(20);
            const random30Posts = remainingPosts
                .sort(() => 0.5 - Math.random())
                .slice(0, 30);

            // Combine top 20 scored posts with 30 random posts
            const finalPosts = [...top20Posts, ...random30Posts];

            return {
                posts: finalPosts,
            };
        } catch (error) {
            console.error("Error in readLatestPosts:", error);
            throw new Error("Failed to read latest posts");
        }
    };

    static readPopularCommissionServices = async () => {
        try {
            const services = await CommissionService.find()
                .populate("talentId")
                .populate("serviceCategoryId")
                .populate("termOfServiceId")
                .populate("movementId");

            // Compute the minimum and maximum values for scaling
            const [minValues, maxValues] = await Promise.all([
                CommissionService.aggregate([
                    {
                        $lookup: {
                            from: "Users",
                            localField: "talentId",
                            foreignField: "_id",
                            as: "talent",
                        },
                    },
                    {
                        $unwind: "$talent",
                    },
                    {
                        $project: {
                            orderCount: { $ifNull: ["$orderCount", 0] },
                            views: { $ifNull: ["$views", 0] },
                            followersCount: {
                                $ifNull: [{ $size: "$talent.followers" }, 0],
                            },
                            artistViews: { $ifNull: ["$talent.views", 0] },
                            ageInHours: {
                                $divide: [
                                    { $subtract: [new Date(), "$createdAt"] },
                                    1000 * 60 * 60,
                                ],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            minOrderCount: { $min: "$orderCount" },
                            minServiceViews: { $min: "$views" },
                            minFollowersCount: { $min: "$followersCount" },
                            minArtistViews: { $min: "$artistViews" },
                            minAgeInHours: { $min: "$ageInHours" },
                        },
                    },
                ]),
                CommissionService.aggregate([
                    {
                        $lookup: {
                            from: "Users",
                            localField: "talentId",
                            foreignField: "_id",
                            as: "talent",
                        },
                    },
                    {
                        $unwind: "$talent",
                    },
                    {
                        $project: {
                            orderCount: { $ifNull: ["$orderCount", 0] },
                            views: { $ifNull: ["$views", 0] },
                            followersCount: {
                                $ifNull: [{ $size: "$talent.followers" }, 0],
                            },
                            artistViews: { $ifNull: ["$talent.views", 0] },
                            ageInHours: {
                                $divide: [
                                    { $subtract: [new Date(), "$createdAt"] },
                                    1000 * 60 * 60,
                                ],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            maxOrderCount: { $max: "$orderCount" },
                            maxServiceViews: { $max: "$views" },
                            maxFollowersCount: { $max: "$followersCount" },
                            maxArtistViews: { $max: "$artistViews" },
                            maxAgeInHours: { $max: "$ageInHours" },
                        },
                    },
                ]),
            ]);

            const min = minValues[0] || {};
            const max = maxValues[0] || {};

            // Ensure default values are set if there are no documents
            const minOrderCount = min.minOrderCount || 0;
            const maxOrderCount = max.maxOrderCount || 1; // Avoid division by zero
            const minServiceViews = min.minServiceViews || 0;
            const maxServiceViews = max.maxServiceViews || 1; // Avoid division by zero
            const minFollowersCount = min.minFollowersCount || 0;
            const maxFollowersCount = max.maxFollowersCount || 1; // Avoid division by zero
            const minArtistViews = min.minArtistViews || 0;
            const maxArtistViews = max.maxArtistViews || 1; // Avoid division by zero
            const minAgeInHours = min.minAgeInHours || 0;
            const maxAgeInHours = max.maxAgeInHours || 1; // Avoid division by zero

            const scoredServices = await Promise.all(
                services.map(async (service) => {
                    const talent = await User.findById(service.talentId);

                    // Compute scaled values
                    const orderCountScaled =
                        (service.orderCount - minOrderCount) /
                        (maxOrderCount - minOrderCount);
                    const serviceViewsScaled =
                        (service.views - minServiceViews) /
                        (maxServiceViews - minServiceViews);
                    const followersScaled =
                        (talent.followers.length - minFollowersCount) /
                        (maxFollowersCount - minFollowersCount);
                    const artistViewsScaled =
                        (talent.views - minArtistViews) /
                        (maxArtistViews - minArtistViews);

                    // Compute age in hours for scaling
                    const ageInHours =
                        (new Date() - new Date(service.createdAt)) /
                        (60 * 60 * 1000);
                    const ageScaled =
                        (ageInHours - minAgeInHours) /
                        (maxAgeInHours - minAgeInHours);

                    // Define weights
                    const weights = {
                        orderCount: 0.4,
                        serviceViews: 0.2,
                        followers: 0.2,
                        artistViews: 0.1,
                        age: 0.1, // Adding weight for age
                    };

                    // Calculate the score with normalized values
                    const score =
                        orderCountScaled * weights.orderCount +
                        serviceViewsScaled * weights.serviceViews +
                        followersScaled * weights.followers +
                        artistViewsScaled * weights.artistViews +
                        ageScaled * weights.age;
                    return { ...service.toObject(), score };
                })
            );

            // Sort services by score
            scoredServices.sort((a, b) => b.score - a.score);

            // Select the top 20 scored services
            const top20Services = scoredServices.slice(0, 20);

            // Select 30 random services from the remaining services
            const remainingServices = scoredServices.slice(20);
            const random30Services = remainingServices
                .sort(() => 0.5 - Math.random())
                .slice(0, 30);

            // Combine top 20 scored services with 30 random services
            const finalServices = [...top20Services, ...random30Services];

            return {
                commissionServices: finalServices,
            };
        } catch (error) {
            console.error("Error in readPopularCommissionServices:", error);
            throw new Error("Failed to read popular services");
        }
    };

    static readLatestCommissionServices = async () => {
        try {
            const commissionServices = await CommissionService.find()
                .populate("talentId")
                .populate("movementId")
                .populate("serviceCategoryId")
                .populate("termOfServiceId");

            // Compute the minimum and maximum values for scaling
            const [minValues, maxValues] = await Promise.all([
                CommissionService.aggregate([
                    {
                        $lookup: {
                            from: "Users",
                            localField: "talentId",
                            foreignField: "_id",
                            as: "talent",
                        },
                    },
                    {
                        $unwind: "$talent",
                    },
                    {
                        $project: {
                            orderCount: { $ifNull: ["$orderCount", 0] },
                            views: { $ifNull: ["$views", 0] },
                            followersCount: {
                                $ifNull: [{ $size: "$talent.followers" }, 0],
                            },
                            artistViews: { $ifNull: ["$talent.views", 0] },
                            ageInHours: {
                                $divide: [
                                    { $subtract: [new Date(), "$createdAt"] },
                                    1000 * 60 * 60,
                                ],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            minOrderCount: { $min: "$orderCount" },
                            minServiceViews: { $min: "$views" },
                            minFollowersCount: { $min: "$followersCount" },
                            minArtistViews: { $min: "$artistViews" },
                            minAge: { $min: "$ageInHours" },
                        },
                    },
                ]),
                CommissionService.aggregate([
                    {
                        $lookup: {
                            from: "Users",
                            localField: "talentId",
                            foreignField: "_id",
                            as: "talent",
                        },
                    },
                    {
                        $unwind: "$talent",
                    },
                    {
                        $project: {
                            orderCount: { $ifNull: ["$orderCount", 0] },
                            views: { $ifNull: ["$views", 0] },
                            followersCount: {
                                $ifNull: [{ $size: "$talent.followers" }, 0],
                            },
                            artistViews: { $ifNull: ["$talent.views", 0] },
                            ageInHours: {
                                $divide: [
                                    { $subtract: [new Date(), "$createdAt"] },
                                    1000 * 60 * 60,
                                ],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            maxOrderCount: { $max: "$orderCount" },
                            maxServiceViews: { $max: "$views" },
                            maxFollowersCount: { $max: "$followersCount" },
                            maxArtistViews: { $max: "$artistViews" },
                            maxAge: { $max: "$ageInHours" },
                        },
                    },
                ]),
            ]);

            const min = minValues[0] || {};
            const max = maxValues[0] || {};

            // Ensure default values are set if there are no documents
            const minOrderCount = Number(min.minOrderCount) || 0;
            const maxOrderCount = Number(max.maxOrderCount) || 1; // Avoid division by zero
            const minServiceViews = Number(min.minServiceViews) || 0;
            const maxServiceViews = Number(max.maxServiceViews) || 1; // Avoid division by zero
            const minFollowersCount = Number(min.minFollowersCount) || 0;
            const maxFollowersCount = Number(max.maxFollowersCount) || 1; // Avoid division by zero
            const minArtistViews = Number(min.minArtistViews) || 0;
            const maxArtistViews = Number(max.maxArtistViews) || 1; // Avoid division by zero
            const minAge = Number(min.minAge) || 0;
            const maxAge = Number(max.maxAge) || 1; // Avoid division by zero

            const scoredCommissionServices = await Promise.all(
                commissionServices.map(async (service) => {
                    const talent = (await User.findById(service.talentId)) || {
                        followers: [],
                        views: 0,
                    };

                    // Compute scaled values
                    const orderCountScaled =
                        (service.orderCount - minOrderCount) /
                        (maxOrderCount - minOrderCount);
                    const serviceViewsScaled =
                        (service.views - minServiceViews) /
                        (maxServiceViews - minServiceViews);
                    const followersScaled =
                        (talent.followers.length - minFollowersCount) /
                        (maxFollowersCount - minFollowersCount);
                    const artistViewsScaled =
                        (talent.views - minArtistViews) /
                        (maxArtistViews - minArtistViews);
                    const ageInHours =
                        (new Date() - new Date(service.createdAt)) /
                        (60 * 60 * 1000);
                    const ageScaled = (ageInHours - minAge) / (maxAge - minAge);

                    // Define weights
                    const weights = {
                        orderCount: 0.05,
                        serviceViews: 0.05,
                        followers: 0.25,
                        artistViews: 0.05,
                        ageInHours: 0.6,
                    };

                    // Calculate the score with normalized values
                    const score =
                        orderCountScaled * weights.orderCount +
                        serviceViewsScaled * weights.serviceViews +
                        followersScaled * weights.followers +
                        artistViewsScaled * weights.artistViews +
                        ageScaled * weights.ageInHours;

                    return { ...service.toObject(), score };
                })
            );

            // Sort commission services by score
            scoredCommissionServices.sort((a, b) => b.score - a.score);

            // Select the top 20 scored commission services
            const top20CommissionServices = scoredCommissionServices.slice(
                0,
                20
            );

            // Select 30 random commission services from the remaining commission services
            const remainingCommissionServices =
                scoredCommissionServices.slice(20);
            const random30CommissionServices = remainingCommissionServices
                .sort(() => 0.5 - Math.random())
                .slice(0, 30);

            // Combine top 20 scored commission services with 30 random commission services
            const finalCommissionServices = [
                ...top20CommissionServices,
                ...random30CommissionServices,
            ];

            return {
                commissionServices: finalCommissionServices,
            };
        } catch (error) {
            console.error("Error in readLatestCommissionServices:", error);
            throw new Error("Failed to read latest commission services");
        }
    };

    static readFollowingCommissionServices = async (userId) => {
        try {
            const currentUser = await User.findById(userId);
            if (!currentUser) throw new BadRequestError("User not found");

            // Extract the IDs of the users the current user is following
            const followingIds = currentUser.following.map((user) => user._id);

            // Fetch commissionServices from users in the following list
            const commissionServices = await CommissionService.find({
                talentId: { $in: followingIds },
            })
                .populate("talentId")
                .populate("artworks")
                .populate("movementId")
                .populate("serviceCategoryId")
                .populate("termOfServiceId")
                .limit(50) // Limit the results to 50
                .exec();
            // Randomize the order of commission services
            const randomCommissionServices = commissionServices.sort(
                () => 0.5 - Math.random()
            );

            return {
                commissionServices: randomCommissionServices,
            };
        } catch (error) {}
    };
}

export default RecommenderService;
