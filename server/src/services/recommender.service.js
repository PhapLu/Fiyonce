import Post from "../models/post.model.js"
import CommissionService from "../models/commissionService.model.js"
import { User } from "../models/user.model.js"
import { AuthFailureError, BadRequestError } from "../core/error.response.js"
import { CLIENT_RENEG_LIMIT } from "tls"

import mongoose from "mongoose"

class RecommenderService {
    // Search for exactly matching keyword
    static search = async (query) => {
        if (!query.searchTerm) throw new BadRequestError("Invalid search Term")
        const searchRegex = new RegExp(query.searchTerm, 'i') // 'i' for case-insensitive search
        const userResults = await User.find({
            $or: [
                { fullName: { $regex: searchRegex } },
                { stageName: { $regex: searchRegex } },
                { email: { $regex: searchRegex } },
                { bio: { $regex: searchRegex } },
            ]
        })

        return {
            userResults,
            // artworkResults
        }
    }

    // Search for nearly matching keyword (top 20 relevant talent/service results)
    static readSearchResults = async (query) => {
        console.log("OOO")
        console.log(query)
        if (!query.searchTerm) throw new BadRequestError("Invalid search Term");

        const caseSensitiveRegex = new RegExp(`^${query.searchTerm}$`); // Exact case-sensitive match
        const caseInsensitiveRegex = new RegExp(query.searchTerm, 'i'); // Case-insensitive match

        // Step 1: Search for case-sensitive matches in Users
        const caseSensitiveUserResults = await User.find({
            $or: [
                { fullName: { $regex: caseSensitiveRegex } },
                { stageName: { $regex: caseSensitiveRegex } },
                { email: { $regex: caseSensitiveRegex } },
                { bio: { $regex: caseSensitiveRegex } },
            ]
        }).limit(20);

        // Step 2: Search for case-insensitive matches excluding those already found
        const caseInsensitiveUserResults = await User.find({
            $or: [
                { fullName: { $regex: caseInsensitiveRegex } },
                { stageName: { $regex: caseInsensitiveRegex } },
                { email: { $regex: caseInsensitiveRegex } },
                { bio: { $regex: caseInsensitiveRegex } },
            ],
            _id: { $nin: caseSensitiveUserResults.map(result => result._id) } // Exclude already found results
        }).limit(20 - caseSensitiveUserResults.length);

        // Combine user results, prioritizing case-sensitive matches
        const userResults = [...caseSensitiveUserResults, ...caseInsensitiveUserResults];

        // Step 3: Search for case-sensitive matches in Services
        const caseSensitiveServiceResults = await CommissionService.find({
            $or: [
                { title: { $regex: caseSensitiveRegex } },
                { description: { $regex: caseSensitiveRegex } },
                { notes: { $regex: caseSensitiveRegex } },
            ]
        }).limit(20);

        // Step 4: Search for case-insensitive matches excluding those already found
        const caseInsensitiveServiceResults = await CommissionService.find({
            $or: [
                { title: { $regex: caseInsensitiveRegex } },
                { description: { $regex: caseInsensitiveRegex } },
                { notes: { $regex: caseInsensitiveRegex } },
            ],
            _id: { $nin: caseSensitiveServiceResults.map(result => result._id) } // Exclude already found results
        }).limit(20 - caseSensitiveServiceResults.length);

        // Combine service results, prioritizing case-sensitive matches
        const serviceResults = [...caseSensitiveServiceResults, ...caseInsensitiveServiceResults];

        console.log("PPP")
        console.log(userResults)
        console.log(serviceResults)
        return {
            userResults,
            serviceResults
        };
    }

    static readPopularPosts = async (req) => {
        const q = req.query;
        const page = parseInt(req.query.page) || 1;  // Current page, default to 1
        const limit = parseInt(req.query.limit) || 50;  // Number of posts per page, default to 50
        const skip = (page - 1) * limit;
        const filters = {
            ...(q.movementId !== undefined && { movementId: q.movementId }),
        };
    
        try {
            const posts = await Post.find(filters)
                .populate("talentId")
                .populate("artworks")
                .populate("movementId")
                .populate("postCategoryId");
    
            // Compute the minimum and maximum values for scaling
            const [minMaxValues] = await Post.aggregate([
                {
                    $project: {
                        likesCount: { $size: "$likes" },
                        bookmarksCount: { $size: "$bookmarks" },
                        viewsCount: { $size: "$views" },
                        followersCount: { $size: { $ifNull: ["$talent.followers", []] } },
                        ageInHours: {
                            $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60 * 60],
                        },
                    },
                },
                {
                    $facet: {
                        minValues: [
                            {
                                $group: {
                                    _id: null,
                                    minLikes: { $min: "$likesCount" },
                                    minBookmarks: { $min: "$bookmarksCount" },
                                    minViews: { $min: "$viewsCount" },
                                    minFollowers: { $min: "$followersCount" },
                                    minAge: { $min: "$ageInHours" },
                                },
                            },
                        ],
                        maxValues: [
                            {
                                $group: {
                                    _id: null,
                                    maxLikes: { $max: "$likesCount" },
                                    maxBookmarks: { $max: "$bookmarksCount" },
                                    maxViews: { $max: "$viewsCount" },
                                    maxFollowers: { $max: "$followersCount" },
                                    maxAge: { $max: "$ageInHours" },
                                },
                            },
                        ],
                    },
                },
            ]);
    
            const minValues = minMaxValues.minValues[0] || {};
            const maxValues = minMaxValues.maxValues[0] || {};
    
            // Ensure default values are set if there are no documents
            const minLikesCount = minValues.minLikes || 0;
            const maxLikesCount = maxValues.maxLikes || 1; // Avoid division by zero
            const minBookmarksCount = minValues.minBookmarks || 0;
            const maxBookmarksCount = maxValues.maxBookmarks || 1; // Avoid division by zero
            const minViews = minValues.minViews || 0;
            const maxViews = maxValues.maxViews || 1; // Avoid division by zero
            const minFollowersCount = minValues.minFollowers || 0;
            const maxFollowersCount = maxValues.maxFollowers || 1; // Avoid division by zero
            const minAge = minValues.minAge || 0;
            const maxAge = maxValues.maxAge || 1; // Avoid division by zero
    
            const scoredPosts = await Promise.all(
                posts.map(async (post) => {
                    const talent = await User.findById(post.talentId);
    
                    // Compute scaled values
                    const likesScaled = (post.likes.length - minLikesCount) / (maxLikesCount - minLikesCount);
                    const viewsScaled = (post.views.length - minViews) / (maxViews - minViews);
                    const bookmarksScaled = (post.bookmarks.length - minBookmarksCount) / (maxBookmarksCount - minBookmarksCount);
                    const followersScaled = (talent.followers.length - minFollowersCount) / (maxFollowersCount - minFollowersCount);
    
                    // Compute post age weight
                    const hoursSinceCreation = (new Date() - new Date(post.createdAt)) / (60 * 60 * 1000);
                    const scaledPostAge = (hoursSinceCreation - minAge) / (maxAge - minAge);
    
                    // Calculate engagement rate
                    const engagementRate = post.views.length ? post.likes.length / post.views.length : 0;
    
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
    
            // Implement pagination here: select the right posts based on the page and limit
            const paginatedPosts = scoredPosts.slice(skip, skip + limit);
    
            return {
                posts: paginatedPosts,
                currentPage: page,
                totalPages: Math.ceil(scoredPosts.length / limit),
            };
        } catch (error) {
            console.error("Error in readPopularPosts:", error);
            throw new BadRequestError("Failed to read popular posts");
        }
    };

    static readLatestPosts = async (req) => {
        const q = req.query
        const filters = {
            ...(q.movementId !== undefined && { movementId: q.movementId }),
        }
        try {
            const posts = await Post.find(filters)
                .populate("talentId")
                .populate("artworks")
                .populate("movementId")
                .populate("postCategoryId")

            // Compute the minimum and maximum values for scaling
            const [minMaxValues] = await Post.aggregate([
                {
                    $project: {
                        likesCount: { $size: "$likes" },
                        bookmarksCount: { $size: "$bookmarks" },
                        viewsCount: { $size: "$views" },  // Count the number of views
                        followersCount: { $size: { $ifNull: ["$talent.followers", []] } },  // Use $ifNull to avoid null
                        ageInHours: {
                            $divide: [
                                { $subtract: [new Date(), "$createdAt"] },
                                1000 * 60 * 60,
                            ],
                        },
                    },
                },
                {
                    $facet: {
                        minValues: [
                            {
                                $group: {
                                    _id: null,
                                    minLikes: { $min: "$likesCount" },
                                    minBookmarks: { $min: "$bookmarksCount" },
                                    minViews: { $min: "$viewsCount" },
                                    minFollowers: { $min: "$followersCount" },
                                    minAge: { $min: "$ageInHours" },
                                },
                            },
                        ],
                        maxValues: [
                            {
                                $group: {
                                    _id: null,
                                    maxLikes: { $max: "$likesCount" },
                                    maxBookmarks: { $max: "$bookmarksCount" },
                                    maxViews: { $max: "$viewsCount" },
                                    maxFollowers: { $max: "$followersCount" },
                                    maxAge: { $max: "$ageInHours" },
                                },
                            },
                        ],
                    },
                },
            ])


            const minValues = minMaxValues.minValues[0] || {}
            const maxValues = minMaxValues.maxValues[0] || {}

            // Ensure default values are set if there are no documents
            const minLikesCount = minValues.minLikes || 0
            const maxLikesCount = maxValues.maxLikes || 1 // Avoid division by zero
            const minBookmarksCount = minValues.minBookmarks || 0
            const maxBookmarksCount = maxValues.maxBookmarks || 1 // Avoid division by zero
            const minViews = minValues.minViews || 0
            const maxViews = maxValues.maxViews || 1 // Avoid division by zero
            const minFollowersCount = minValues.minFollowers || 0
            const maxFollowersCount = maxValues.maxFollowers || 1 // Avoid division by zero
            const minAge = minValues.minAge || 0
            const maxAge = maxValues.maxAge || 1 // Avoid division by zero



            const scoredPosts = await Promise.all(
                posts.map(async (post) => {
                    const talent = await User.findById(post.talentId)

                    // Compute scaled values
                    const likesScaled =
                        (post.likes.length - minLikesCount) /
                        (maxLikesCount - minLikesCount)
                    const viewsScaled =
                        (post.views.length - minViews) / (maxViews - minViews)
                    const bookmarksScaled =
                        (post.bookmarks.length - minBookmarksCount) /
                        (maxBookmarksCount - minBookmarksCount)
                    const followersScaled =
                        (talent.followers.length - minFollowersCount) /
                        (maxFollowersCount - minFollowersCount)

                    // Compute post age weight
                    const hoursSinceCreation =
                        (new Date() - new Date(post.createdAt)) /
                        (60 * 60 * 1000)
                    const scaledPostAge =
                        1 / (hoursSinceCreation - minAge) / (maxAge - minAge)

                    // Calculate engagement rate
                    const engagementRate = post.views.length
                        ? post.likes.length / post.views.length
                        : 0

                    // Define weights
                    // const weights = {
                    //     likes: 0.1,
                    //     views: 0.1,
                    //     followers: 0.05,
                    //     bookmarks: 0.05,
                    //     engagementRate: 0.1,
                    //     postAgeWeight: 0.6,
                    // }

                    const weights = {
                        likes: 0,
                        views: 0,
                        followers: 0,
                        bookmarks: 0,
                        engagementRate: 0,
                        postAgeWeight: 1,
                    }

                    // Calculate the score with normalized values
                    const score =
                        likesScaled * weights.likes +
                        viewsScaled * weights.views +
                        followersScaled * weights.followers +
                        bookmarksScaled * weights.bookmarks +
                        engagementRate * weights.engagementRate +
                        scaledPostAge * weights.postAgeWeight

                    return {
                        ...post.toObject(),
                        score,
                        scaledPostAge,
                        engagementRate,
                    }
                })
            )


            // Sort posts by score
            scoredPosts.sort((a, b) => b.score - a.score)

            // Select the top 20 scored posts
            const top20Posts = scoredPosts.slice(0, 20)

            // Select 30 random posts from the remaining posts
            const remainingPosts = scoredPosts.slice(20)
            const random30Posts = remainingPosts
                .sort(() => 0.5 - Math.random())
                .slice(0, 30)

            // Combine top 20 scored posts with 30 random posts
            const finalPosts = [...top20Posts, ...random30Posts]

            return {
                posts: finalPosts,
            }
        } catch (error) {
            console.error("Error in readPopularPosts:", error)
            throw new Error("Failed to read popular posts")
        }
    }

    static readFollowingPosts = async (userId) => {
        try {
            // Fetch the current user and their following list
            const currentUser = await User.findById(userId)

            // Extract the IDs of the users the current user is following
            const followingIds = currentUser.following.map((user) => user._id)

            // Fetch posts from users in the following list
            const posts = await Post.find({ talentId: { $in: followingIds } })
                .populate("talentId")
                .populate("artworks")
                .populate("movementId")
                .populate("postCategoryId")
                .limit(50) // Limit the results to 50
                .exec()
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
            //         const viewsScaled = (post.views.length - minViews) / (maxViews - minViews)
            //         const bookmarksScaled = (post.bookmarks.length - minBookmarksCount) / (maxBookmarksCount - minBookmarksCount)
            //         const followersScaled = (talent.followers.length - minFollowersCount) / (maxFollowersCount - minFollowersCount)

            //         // Compute post age weight
            //         const hoursSinceCreation = (new Date() - new Date(post.createdAt)) / (60 * 60 * 1000)
            //         const scaledPostAge = (hoursSinceCreation - minAge) / (maxAge - minAge)

            //         // Calculate engagement rate
            //         const engagementRate = post.views.length ? post.likes.length / post.views.length : 0

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
            const randomPosts = posts.sort(() => 0.5 - Math.random())

            return {
                posts: randomPosts,
            }
        } catch (error) {
            console.error("Error in readFollowingPosts:", error)
            throw new Error("Failed to read following posts")
        }
    }



    static readPopularCommissionServices = async (req) => {
        const q = req.query
        const filters = {
            ...(q.movementId !== undefined && { movementId: q.movementId }),
        }
        try {
            const services = await CommissionService.find(filters)
                .populate("talentId")
                .populate("serviceCategoryId")
                .populate("termOfServiceId")
                .populate("movementId")

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
            ])

            const min = minValues[0] || {}
            const max = maxValues[0] || {}

            // Ensure default values are set if there are no documents
            const minOrderCount = min.minOrderCount || 0
            const maxOrderCount = max.maxOrderCount || 1 // Avoid division by zero
            const minServiceViews = min.minServiceViews || 0
            const maxServiceViews = max.maxServiceViews || 1 // Avoid division by zero
            const minFollowersCount = min.minFollowersCount || 0
            const maxFollowersCount = max.maxFollowersCount || 1 // Avoid division by zero
            const minArtistViews = min.minArtistViews || 0
            const maxArtistViews = max.maxArtistViews || 1 // Avoid division by zero
            const minAgeInHours = min.minAgeInHours || 0
            const maxAgeInHours = max.maxAgeInHours || 1 // Avoid division by zero

            const scoredServices = await Promise.all(
                services.map(async (service) => {
                    const talent = await User.findById(service.talentId)

                    // Compute scaled values
                    const orderCountScaled =
                        (service.orderCount - minOrderCount) /
                        (maxOrderCount - minOrderCount)
                    const serviceViewsScaled =
                        (service.views - minServiceViews) /
                        (maxServiceViews - minServiceViews)
                    const followersScaled =
                        (talent.followers.length - minFollowersCount) /
                        (maxFollowersCount - minFollowersCount)
                    const artistViewsScaled =
                        (talent.views - minArtistViews) /
                        (maxArtistViews - minArtistViews)

                    // Compute age in hours for scaling
                    const ageInHours =
                        (new Date() - new Date(service.createdAt)) /
                        (60 * 60 * 1000)
                    const ageScaled =
                        (ageInHours - minAgeInHours) /
                        (maxAgeInHours - minAgeInHours)

                    // Define weights
                    const weights = {
                        orderCount: 0.4,
                        serviceViews: 0.2,
                        followers: 0.2,
                        artistViews: 0.1,
                        age: 0.1, // Adding weight for age
                    }

                    // Calculate the score with normalized values
                    const score =
                        orderCountScaled * weights.orderCount +
                        serviceViewsScaled * weights.serviceViews +
                        followersScaled * weights.followers +
                        artistViewsScaled * weights.artistViews +
                        ageScaled * weights.age

                    return { ...service.toObject(), score }
                })
            )

            // Sort services by score
            scoredServices.sort((a, b) => b.score - a.score)

            // Select the top 20 scored services
            const top20Services = scoredServices.slice(0, 20)

            // Select 30 random services from the remaining services
            const remainingServices = scoredServices.slice(20)
            const random30Services = remainingServices
                .sort(() => 0.5 - Math.random())
                .slice(0, 30)

            // Combine top 20 scored services with 30 random services
            const finalServices = [...top20Services, ...random30Services]
            return {
                commissionServices: finalServices,
            }
        } catch (error) {
            console.error("Error in readPopularCommissionServices:", error)
            throw new Error("Failed to read popular services")
        }
    }

    static readLatestCommissionServices = async (req) => {
        const q = req.query
        const filters = {
            ...(q.movementId !== undefined && { movementId: q.movementId }),
        }
        try {
            const commissionServices = await CommissionService.find(filters)
                .populate("talentId")
                .populate("movementId")
                .populate("serviceCategoryId")
                .populate("termOfServiceId")

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
            ])

            const min = minValues[0] || {}
            const max = maxValues[0] || {}

            // Ensure default values are set if there are no documents
            const minOrderCount = Number(min.minOrderCount) || 0
            const maxOrderCount = Number(max.maxOrderCount) || 1 // Avoid division by zero
            const minServiceViews = Number(min.minServiceViews) || 0
            const maxServiceViews = Number(max.maxServiceViews) || 1 // Avoid division by zero
            const minFollowersCount = Number(min.minFollowersCount) || 0
            const maxFollowersCount = Number(max.maxFollowersCount) || 1 // Avoid division by zero
            const minArtistViews = Number(min.minArtistViews) || 0
            const maxArtistViews = Number(max.maxArtistViews) || 1 // Avoid division by zero
            const minAge = Number(min.minAge) || 0
            const maxAge = Number(max.maxAge) || 1 // Avoid division by zero

            const scoredCommissionServices = await Promise.all(
                commissionServices.map(async (service) => {
                    const talent = (await User.findById(service.talentId)) || {
                        followers: [],
                        views: 0,
                    }

                    // Compute scaled values
                    const orderCountScaled =
                        (service.orderCount - minOrderCount) /
                        (maxOrderCount - minOrderCount)
                    const serviceViewsScaled =
                        (service.views.length - minServiceViews) /
                        (maxServiceViews - minServiceViews)
                    const followersScaled = (maxFollowersCount === minFollowersCount)
                        ? 0
                        : (talent.followers.length - minFollowersCount) / (maxFollowersCount - minFollowersCount)
                    const artistViewsScaled = (maxArtistViews === minArtistViews) ? 0 :
                        (talent.views - minArtistViews) /
                        (maxArtistViews - minArtistViews)
                    const ageInHours =
                        (new Date() - new Date(service.createdAt)) /
                        (60 * 60 * 1000)
                    const ageScaled = 1 / (ageInHours - minAge) / (maxAge - minAge)
                    // Define weights
                    const weights = {
                        orderCount: 0,
                        serviceViews: 0,
                        followers: 0,
                        artistViews: 0,
                        ageInHours: 1,
                    }

                    // Calculate the score with normalized values
                    const score =
                        orderCountScaled * weights.orderCount +
                        serviceViewsScaled * weights.serviceViews +
                        followersScaled * weights.followers +
                        artistViewsScaled * weights.artistViews +
                        ageScaled * weights.ageInHours
                    return { ...service.toObject(), score }
                })
            )

            // Sort commission services by score
            scoredCommissionServices.sort((a, b) => b.score - a.score)

            // Select the top 20 scored commission services
            const top20CommissionServices = scoredCommissionServices.slice(
                0,
                20
            )

            // Select 30 random commission services from the remaining commission services
            const remainingCommissionServices =
                scoredCommissionServices.slice(20)
            const random30CommissionServices = remainingCommissionServices
                .sort(() => 0.5 - Math.random())
                .slice(0, 30)

            // Combine top 20 scored commission services with 30 random commission services
            const finalCommissionServices = [
                ...top20CommissionServices,
                ...random30CommissionServices,
            ]
            return {
                commissionServices: finalCommissionServices,
            }
        } catch (error) {
            console.error("Error in readLatestCommissionServices:", error)
            throw new Error("Failed to read latest commission services")
        }
    }

    static readFollowingCommissionServices = async (userId) => {
        try {
            const currentUser = await User.findById(userId)
            if (!currentUser) throw new BadRequestError("User not found")

            // Extract the IDs of the users the current user is following
            const followingIds = currentUser.following.map((user) => user._id)

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
                .exec()
            // Randomize the order of commission services
            const randomCommissionServices = commissionServices.sort(
                () => 0.5 - Math.random()
            )

            return {
                commissionServices: randomCommissionServices,
            }
        } catch (error) {
            console.error("Error in readFollowingCommissionServices:", error)
            throw new BadRequestError("Failed to read following commission services")
        }
    }

    static recommendUsersToFollow = async (userId) => {
        try {
            // Find user A (the logged-in user)
            const userA = await User.findById(userId).populate('following');

            if (!userA) {
                throw new Error("User not found");
            }

            // Get the list of users that A is following
            const followingList = userA.following.map(user => user._id);

            // Find users that are followed by or following someone A follows
            let recommendations = await User.aggregate([
                {
                    $match: {
                        _id: { $ne: new mongoose.Types.ObjectId(userId) },
                        $or: [
                            { followers: { $in: followingList } },   // Users followed by someone A follows
                            { following: { $in: followingList } }    // Users following someone A follows
                        ]
                    }
                },
                { $sample: { size: 10 } }  // Random sample of 10 users
            ]);

            // Populate additional fields
            recommendations = await User.populate(recommendations, {
                path: 'followers following badges',
                select: 'avatar fullName stageName jobTitle followers following badges'
            });

            // Map to return only necessary fields
            recommendations = recommendations.map(user => ({
                _id: user._id,
                avatar: user.avatar,
                fullName: user.fullName,
                stageName: user.stageName,
                jobTitle: user.jobTitle,
                followersCount: user.followers.length,
                followingCount: user.following.length,
                badges: user.badges
            }));

            // If not enough recommendations, fill with recently registered users
            if (recommendations.length < 10) {
                const additionalRecommendations = await User.find({
                    _id: { $nin: recommendations.map(user => user._id).concat(userA._id) }
                })
                    .sort({ createdAt: -1 })  // Recently registered users
                    .limit(10 - recommendations.length)
                    .select('avatar fullName stageName jobTitle followers following badges');

                additionalRecommendations.forEach(user => {
                    recommendations.push({
                        _id: user._id,
                        avatar: user.avatar,
                        fullName: user.fullName,
                        stageName: user.stageName,
                        jobTitle: user.jobTitle,
                        followersCount: user.followers.length,
                        followingCount: user.following.length,
                        badges: user.badges
                    });
                });
            }

            return { usersToFollow: recommendations };

        } catch (error) {
            console.error("Error recommending users:", error);
            throw error;
        }
    };
}

export default RecommenderService
