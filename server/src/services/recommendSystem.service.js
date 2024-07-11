import Post from "../models/post.model.js"
import { User } from "../models/user.model.js"

const getPopularPosts = async (timeRangeInDays) => {
    const startDate = new Date(Date.now() - timeRangeInDays * 24 * 60 * 60 * 1000)
  
    // Fetch posts within the specified time range
    const posts = await Post.find({
      createdAt: { $gte: startDate }
    })
    .populate('talentId')
    .populate('artworks')
    .populate('movementId')
    .populate('postCategoryId')
  
    // Calculate combined score for each post
    const scoredPosts = await Promise.all(posts.map(async (post) => {
      const talent = await User.findById(post.talentId)
      const postAgeWeight = 1 - (Date.now() - new Date(post.createdAt)) / (timeRangeInDays * 24 * 60 * 60 * 1000)
      const engagementRate = post.views ? post.likes.length / post.views : 0
      
      const score = (post.likes.length * 0.3) 
                    + (post.views * 0.2) 
                    + (talent.followers.length * 0.15) 
                    + (post.bookmarks.length * 0.1) 
                    + (engagementRate * 0.15) 
                    + (postAgeWeight * 0.05)
  
      return { ...post.toObject(), score, postAgeWeight, engagementRate }
    }))
  
    // Sort posts by combined score in descending order and limit to top 50
    scoredPosts.sort((a, b) => b.score - a.score)
    return scoredPosts.slice(0, 50)
}

const getFollowingPosts = async (userId, timeRangeInDays) => {
    const startDate = new Date(Date.now() - timeRangeInDays * 24 * 60 * 60 * 1000)

  // Fetch the current user to get their following list
  const currentUser = await User.findById(userId).populate('following')

  // Fetch posts within the specified time range from users that the current user is following
  const posts = await Post.find({
    talentId: { $in: currentUser.following.map(follow => follow._id) },
    createdAt: { $gte: startDate }
  })
  .populate('talentId')
  .populate('artworks')
  .populate('movementId')
  .populate('postCategoryId')

  // Calculate combined score for each post
  const scoredPosts = await Promise.all(posts.map(async (post) => {
    const talent = await User.findById(post.talentId)
    const engagementRate = post.views ? post.likes.length / post.views : 0
    
    const score = (post.likes.length * 0.3) 
                  + (post.views * 0.3) 
                  + (talent.followers.length * 0.2) 
                  + (post.bookmarks.length * 0.2) 
                  + (engagementRate * 0.2)

    return { ...post.toObject(), score }
  }))

  // Sort posts by combined score in descending order and limit to top 50
  scoredPosts.sort((a, b) => b.score - a.score)
  return scoredPosts.slice(0, 50)
}

const getLatestPosts = async (timeRangeInDays) => {
    const startDate = new Date(Date.now() - timeRangeInDays * 24 * 60 * 60 * 1000)

  // Fetch posts within the specified time range
  const posts = await Post.find({
    createdAt: { $gte: startDate }
  })
  .populate('talentId')
  .populate('artworks')
  .populate('movementId')
  .populate('postCategoryId')

  // Calculate combined score for each post, with higher weight for creation date
  const scoredPosts = await Promise.all(posts.map(async (post) => {
    const talent = await User.findById(post.talentId)
    const postAgeWeight = 1 - (Date.now() - new Date(post.createdAt)) / (timeRangeInDays * 24 * 60 * 60 * 1000)
    const engagementRate = post.views ? post.likes.length / post.views : 0
    
    const score = (post.likes.length * 0.2) 
                  + (post.views * 0.2) 
                  + (talent.followers.length * 0.1) 
                  + (post.bookmarks.length * 0.1) 
                  + (engagementRate * 0.1) 
                  + (postAgeWeight * 0.3)

    return { ...post.toObject(), score }
  }))

  // Sort posts by combined score in descending order and limit to top 50
  scoredPosts.sort((a, b) => b.score - a.score)
  return scoredPosts.slice(0, 50)
}
export {
    getPopularPosts,
    getFollowingPosts,
    getLatestPosts
}