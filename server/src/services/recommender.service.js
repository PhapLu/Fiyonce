import Post from "../models/post.model.js";
import { User } from "../models/user.model.js";

class RecommenderService {
  static search = async (query) => {
    if (!query.searchTerm) throw new BadRequestError("Invalid search Term")
    const searchRegex = new RegExp(query.searchTerm, 'i'); // 'i' for case-insensitive search
    const userResults = await User.find({
      $or: [
        { fullName: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { bio: { $regex: searchRegex } },
      ]
    });
    // const artworkResults = await Artwork.find({ $text: { $search: query.searchTerm } });
    console.log("SEARCH TERM")
    console.log(query.searchTerm)
    console.log(userResults)
    return {
      userResults,
      // artworkResults
    };
  };

  static readPopularPosts = async () => {
    try {
      const posts = await Post.find()
        .populate('talentId')
        .populate('artworks')
        .populate('movementId')
        .populate('postCategoryId');

      const scoredPosts = await Promise.all(posts.map(async (post) => {
        const talent = await User.findById(post.talentId);
        const postAgeWeight = 1 - (Date.now() - new Date(post.createdAt)) / (365 * 24 * 60 * 60 * 1000);
        const engagementRate = post.views ? post.likes.length / post.views : 0;

        const weights = {
          likes: 0.3,
          views: 0.15,
          bookmarks: 0.15,
          postAgeWeight: 0.2,
          followers: 0.1,
          engagementRate: 0.1,
        };

        const score = (post.likes.length * weights.likes)
          + (post.views * weights.views)
          + (talent.followers.length * weights.followers)
          + (post.bookmarks.length * weights.bookmarks)
          + (engagementRate * weights.engagementRate)
          + (postAgeWeight * weights.postAgeWeight);
        return { ...post.toObject(), score, postAgeWeight, engagementRate };
      }));

      scoredPosts.sort((a, b) => b.score - a.score);
      return { posts: scoredPosts.slice(0, 50) };
    } catch (error) {
      console.error('Error in readPopularPosts:', error);
      throw new Error('Failed to read popular posts');
    }
  };

  static readFollowingPosts = async (userId) => {
    try {
      const currentUser = await User.findById(userId).populate('following');
      const posts = await Post.find({
        talentId: { $in: currentUser.following.map(follow => follow._id) },
      })
        .populate('talentId')
        .populate('artworks')
        .populate('movementId')
        .populate('postCategoryId');

      const scoredPosts = await Promise.all(posts.map(async (post) => {
        const talent = await User.findById(post.talentId);
        const engagementRate = post.views ? post.likes.length / post.views : 0;

        const score = (post.likes.length * 0.3)
          + (post.views * 0.3)
          + (talent.followers.length * 0.2)
          + (post.bookmarks.length * 0.2)
          + (engagementRate * 0.2);

        return { ...post.toObject(), score };
      }));

      scoredPosts.sort((a, b) => b.score - a.score);
      return scoredPosts.slice(0, 50);
    } catch (error) {
      console.error('Error in readFollowingPosts:', error);
      throw new Error('Failed to read following posts');
    }
  };

  static readLatestPosts = async () => {
    try {
      const posts = await Post.find({})
        .populate('talentId')
        .populate('artworks')
        .populate('movementId')
        .populate('postCategoryId');

      const scoredPosts = await Promise.all(posts.map(async (post) => {
        const talent = await User.findById(post.talentId);
        const postAgeWeight = 1 - (Date.now() - new Date(post.createdAt)) / (365 * 24 * 60 * 60 * 1000);
        const engagementRate = post.views ? post.likes.length / post.views : 0;

        const score = (post.likes.length * 0.2)
          + (post.views * 0.2)
          + (talent.followers.length * 0.1)
          + (post.bookmarks.length * 0.1)
          + (engagementRate * 0.1)
          + (postAgeWeight * 0.3);

        return { ...post.toObject(), score };
      }));

      scoredPosts.sort((a, b) => b.score - a.score);
      return scoredPosts.slice(0, 50);
    } catch (error) {
      console.error('Error in readLatestPosts:', error);
      throw new Error('Failed to read latest posts');
    }
  };
}

export default RecommenderService;