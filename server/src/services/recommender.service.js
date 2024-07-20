import Post from "../models/post.model.js"
import CommissionService from "../models/commissionService.model.js"
import { User } from "../models/user.model.js"

class RecommenderService {
    static readPopularPosts = async () => {
        try {
            const posts = await Post.find()
                .populate("talentId")
                .populate("artworks")
                .populate("movementId")
                .populate("postCategoryId")

            const scoredPosts = await Promise.all(
                posts.map(async (post) => {
                const talent = await User.findById(post.talentId)
                const postAgeWeight =
                    1 -
                    (Date.now() - new Date(post.createdAt)) /
                    (365 * 24 * 60 * 60 * 1000)
                const engagementRate = post.views
                    ? post.likes.length / post.views
                    : 0

                const weights = {
                    likes: 0.3,
                    views: 0.15,
                    bookmarks: 0.15,
                    postAgeWeight: 0.2,
                    followers: 0.1,
                    engagementRate: 0.1,
                }

                const score =
                    post.likes.length * weights.likes +
                    post.views * weights.views +
                    talent.followers.length * weights.followers +
                    post.bookmarks.length * weights.bookmarks +
                    engagementRate * weights.engagementRate +
                    postAgeWeight * weights.postAgeWeight

                return { ...post.toObject(), score, postAgeWeight, engagementRate }
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

            console.log(finalPosts)
            return { posts: finalPosts }
        } catch (error) {
            console.error("Error in readPopularPosts:", error)
            throw new Error("Failed to read popular posts")
        }
    }

    static readFollowingPosts = async (userId) => {
        try {
            const currentUser = await User.findById(userId).populate("following")
            const posts = await Post.find({
                talentId: { $in: currentUser.following.map((follow) => follow._id) },
            })
            .populate("talentId")
            .populate("artworks")
            .populate("movementId")
            .populate("postCategoryId")

            const scoredPosts = await Promise.all(
                posts.map(async (post) => {
                const talent = await User.findById(post.talentId)
                const engagementRate = post.views
                    ? post.likes.length / post.views
                    : 0

                const score =
                    post.likes.length * 0.3 +
                    post.views * 0.3 +
                    talent.followers.length * 0.2 +
                    post.bookmarks.length * 0.2 +
                    engagementRate * 0.2

            return { ...post.toObject(), score }
                })
            )

            scoredPosts.sort((a, b) => b.score - a.score)
            return scoredPosts.slice(0, 50)
        } catch (error) {
            console.error("Error in readFollowingPosts:", error)
            throw new Error("Failed to read following posts")
        }
    }

    static readLatestPosts = async () => {
        try {
            // Fetch posts and compute min/max values
            const posts = await Post.find({})
                .populate("talentId")
                .populate("artworks")
                .populate("movementId")
                .populate("postCategoryId")
    
            // Compute the minimum and maximum values for scaling
            const [minValues, maxValues] = await Promise.all([
                Post.aggregate([
                    {
                        $lookup: {
                            from: 'Users', // Correct collection name
                            localField: 'talentId',
                            foreignField: '_id',
                            as: 'talent'
                        }
                    },
                    {
                        $unwind: '$talent'
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
                                    1000 * 60 * 60
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            minLikes: { $min: "$likesCount" },
                            minBookmarks: { $min: "$bookmarksCount" },
                            minViews: { $min: "$views" },
                            minFollowers: { $min: "$followersCount" },
                            minAge: { $min: "$ageInHours" }
                        }
                    }
                ]),
                Post.aggregate([
                    {
                        $lookup: {
                            from: 'Users', // Correct collection name
                            localField: 'talentId',
                            foreignField: '_id',
                            as: 'talent'
                        }
                    },
                    {
                        $unwind: '$talent'
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
                                    1000 * 60 * 60
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            maxLikes: { $max: "$likesCount" },
                            maxBookmarks: { $max: "$bookmarksCount" },
                            maxViews: { $max: "$views" },
                            maxFollowers: { $max: "$followersCount" },
                            maxAge: { $max: "$ageInHours" }
                        }
                    }
                ])
            ])
    
            const min = minValues[0] || {}
            const max = maxValues[0] || {}
    
            // Ensure default values are set if there are no documents
            const minLikesCount = min.minLikes || 0
            const maxLikesCount = max.maxLikes || 1 // Avoid division by zero
            const minBookmarksCount = min.minBookmarks || 0
            const maxBookmarksCount = max.maxBookmarks || 1 // Avoid division by zero
            const minViews = min.minViews || 0
            const maxViews = max.maxViews || 1 // Avoid division by zero
            const minFollowersCount = min.minFollowers || 0
            const maxFollowersCount = max.maxFollowers || 1 // Avoid division by zero
            const minAge = min.minAge || 0
            const maxAge = max.maxAge || 1 // Avoid division by zero
    
            const scaledPosts = await Promise.all(
                posts.map(async (post) => {
                    const talent = await User.findById(post.talentId)
    
                    // Compute scaled values
                    const likesScaled = (post.likes.length - minLikesCount) / (maxLikesCount - minLikesCount)
                    const viewsScaled = (post.views - minViews) / (maxViews - minViews)
                    const bookmarksScaled = (post.bookmarks.length - minBookmarksCount) / (maxBookmarksCount - minBookmarksCount)
                    const followersScaled = (talent.followers.length - minFollowersCount) / (maxFollowersCount - minFollowersCount)
    
                    // Compute post age weight
                    const hoursSinceCreation = (new Date() - new Date(post.createdAt)) / (60 * 60 * 1000)
                    const scaledPostAge = (hoursSinceCreation - minAge) / (maxAge - minAge)

                    // Calculate engagement rate
                    const engagementRate = post.views ? post.likes.length / post.views : 0
    
                    // Define weights
                    const weights = {
                        likes: 0.2,
                        views: 0.1,
                        followers: 0.05,
                        bookmarks: 0.05,
                        engagementRate: 0.1,
                        postAgeWeight: 0.5
                    }
    
                    // Calculate the score with normalized values
                    const score =
                        (likesScaled * weights.likes) +
                        (viewsScaled * weights.views) +
                        (followersScaled * weights.followers) +
                        (bookmarksScaled * weights.bookmarks) +
                        (engagementRate * weights.engagementRate) +
                        (scaledPostAge * weights.postAgeWeight)
                    return { ...post.toObject(), score }
                })
            )
    
            // Sort posts by score
            scaledPosts.sort((a, b) => b.score - a.score)
    
            // Select the top 20 scored posts
            const top20Posts = scaledPosts.slice(0, 20)
    
            // Select 30 random posts from the remaining posts
            const remainingPosts = scaledPosts.slice(20)
            const random30Posts = remainingPosts
                .sort(() => 0.5 - Math.random())
                .slice(0, 30)
    
            // Combine top 20 scored posts with 30 random posts
            const finalPosts = [...top20Posts, ...random30Posts]
    
            return { posts: finalPosts }
        } catch (error) {
            console.error("Error in readLatestPosts:", error)
            throw new Error("Failed to read latest posts")
        }
    }    

    static readPopularCommissionServices = async () => {
        try {
            const services = await CommissionService.find()
                .populate('talentId')
                .populate('serviceCategoryId')
                .populate('termOfServiceId')
                .populate('movementId')
        
            const scoredServices = await Promise.all(services.map(async (service) => {
                const talent = await User.findById(service.talentId)
        
                // Updated weights with orderCount having the highest impact
                const weights = {
                    orderCount: 0.5,
                    serviceViews: 0.2,
                    followers: 0.2,
                    artistViews: 0.1,
                }
        
                const score = (service.orderCount * weights.orderCount)
                    + (talent.followers.length * weights.followers)
                    + (talent.views * weights.artistViews)
                    + (service.views * weights.serviceViews)
        
                return { ...service.toObject(), score }
            }))
        
            // Sort services by score
            scoredServices.sort((a, b) => b.score - a.score)
        
            // Select the top 20 scored services
            const top20Services = scoredServices.slice(0, 20)
        
            // Select 30 random services from the remaining services
            const remainingServices = scoredServices.slice(20)
            const random30Services = remainingServices.sort(() => 0.5 - Math.random()).slice(0, 30)
        
            // Combine top 20 scored services with 30 random services
            const finalServices = [...top20Services, ...random30Services]
        
            console.log(finalServices)
            return { services: finalServices }
        } catch (error) {
            console.error('Error in readPopularServices:', error)
            throw new Error('Failed to read popular services')
        }
    }

    static readLatestCommissionServices = async () => {
        try {
            const commissionServices = await CommissionService.find()
                .populate("talentId")
                .populate("movementId")
                .populate("serviceCategoryId")
                .populate("termOfServiceId")

            const scoredCommissionServices = await Promise.all(
                commissionServices.map(async (service) => {
                    const talent = await User.findById(service.talentId)
                    const commissionAgeWeight =
                        (Date.now() - new Date(service.createdAt)) / (365 * 24 * 60 * 60 * 1000)
                    console.log(commissionAgeWeight)
                    const weights = {
                        orderCount: 0.05,
                        serviceViews: 0.05,
                        followers: 0.25,
                        artistViews: 0.05,
                        commissionAgeWeight: 0.6,
                    }

                    const score = (service.orderCount * weights.orderCount)
                        + (service.views * weights.serviceViews)
                        + (talent.followers.length * weights.followers)
                        + (talent.views * weights.artistViews)
                        + (commissionAgeWeight * weights.commissionAgeWeight)

                    return { ...service.toObject(), score }
                })
            )

            // Sort commission services by score
            scoredCommissionServices.sort((a, b) => b.score - a.score)

            // Select the top 20 scored commission services
            const top20CommissionServices = scoredCommissionServices.slice(0, 20)

            // Select 30 random commission services from the remaining commission services
            const remainingCommissionServices = scoredCommissionServices.slice(20)
            const random30CommissionServices = remainingCommissionServices
                .sort(() => 0.5 - Math.random())
                .slice(0, 30)

            // Combine top 20 scored commission services with 30 random commission services
            const finalCommissionServices = [...top20CommissionServices, ...random30CommissionServices]

            return {
                commissionServices: finalCommissionServices,
            }
        } catch (error) {
            console.error('Error in readLatestCommissionServices:', error)
            throw new Error("Failed to read latest commission services")
        }
    }

    static readFollowingCommissionServices = async (userId) => {
        try {
            const currentUser = await User.findById(userId).populate("following")
            const commissionServices = await CommissionService.find({
                talentId: { $in: currentUser.following.map((follow) => follow._id) },
            })
            .populate("talentId")
            .populate("artworks")
            .populate("movementId")
            .populate("serviceCategoryId")
            .populate("termOfServiceId")

            const scoredCommissionServices = await Promise.all(
                commissionServices.map(async (service) => {
                    const talent = await User.findById(service.talentId)
                    const engagementRate = service.views
                        ? service.likes.length / service.views
                        : 0

                    const score =
                        service.likes.length * 0.2 +
                        service.views * 0.1 +
                        talent.followers.length * 0.5 +
                        service.bookmarks.length * 0.1 +
                        engagementRate * 0.1

                    return { ...service.toObject(), score }
                })
            )

            scoredCommissionServices.sort((a, b) => b.score - a.score)
            return {
                commissionServices: scoredCommissionServices.slice(0, 50)
            }
        }
        catch (error) {
        }
    }
}

export default RecommenderService
