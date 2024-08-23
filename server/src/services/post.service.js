import Post from "../models/post.model.js"
import Artwork from "../models/artwork.model.js"
import { User } from "../models/user.model.js"
import { BadRequestError, NotFoundError } from "../core/error.response.js"
import { compressAndUploadImage, deleteFileByPublicId, extractPublicIdFromUrl } from "../utils/cloud.util.js"
import PostCategory from "../models/postCategory.model.js"
import mongoose from "mongoose"
import jwt from 'jsonwebtoken'

class PostService {
    static createPost = async (userId, req) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (user.role !== "talent")
            throw new BadRequestError("Bạn không phải là họa sĩ")

        //2. Validate request body
        const { movementId, postCategoryId } = req.body
        if (!req.files || !req.files.artworks)
            throw new BadRequestError("Hãy nhập những thông tin bắt buộc")
        if (!userId || !movementId || !postCategoryId)
            throw new BadRequestError("Hãy nhập những thông tin bắt buộc")

        //3. Upload artwork images to cloudinary
        try {
            const uploadPromises = req.files.artworks.map((file) =>
                compressAndUploadImage({
                    buffer: file.buffer,
                    originalname: file.originalname,
                    folderName: `fiyonce/artworks/${userId}`,
                    width: 1920,
                    height: 1080,
                })
            )
            const uploadResults = await Promise.all(uploadPromises)
            const artworks = uploadResults.map((result) => result.secure_url)

            //4. Create and save artwork
            let artworksId = []
            let newArtworks = []
            await Promise.all(
                artworks.map(async (artwork) => {
                    const newArtwork = new Artwork({
                        url: artwork,
                    })
                    await newArtwork.save()
                    artworksId.push(newArtwork._id)
                    newArtworks.push(newArtwork.toObject())
                })
            )

            //5. Create and save post
            const newPost = new Post({
                ...req.body,
                talentId: userId,
                artworks: artworksId,
            })
            await newPost.save()

            //6. Add postId to artworks
            await Promise.all(
                newArtworks.map(async (artwork) => {
                    await Artwork.findByIdAndUpdate(artwork._id, {
                        postId: newPost._id,
                    })
                })
            )

            return {
                artwork: newPost,
            }
        } catch (error) {
            console.error("Error uploading images:", error)
            throw new BadRequestError("Tạo tác phẩm không thành công")
        }
    }

    static readPost = async (req, postId) => {
        try {
            // Extract token from cookies
            const token = req.cookies.accessToken

            // Initialize user-related variables
            let userId = null
            let email = null

            if (token) {
                // Verify token if it exists
                const payload = jwt.verify(token, process.env.JWT_SECRET)
                userId = payload.id
                email = payload.email
            }

            // Find post
            const post = await Post.findById(postId)
                .populate('talentId', 'fullName stageName avatar')
                .populate('postCategoryId', 'title')
                .populate('movementId', 'title')
                .populate('artworks', 'url')
                .exec()

            if (!post) throw new NotFoundError('Tác phẩm không tồn tại')

            // If user is authenticated and not the post owner, increment the views
            if (userId && userId !== post.talentId.toString()) {
                post.views.push({ user: new mongoose.Types.ObjectId(userId) })
                await post.save() // Save the post to update views
            }

            return {
                post
            }
        } catch (error) {
            console.error('Error reading post:', error)
            throw new BadRequestError('Xem tác phẩm không thành công')
        }
    }



    static likePost = async (userId, postId) => {
        // Find user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('Bạn cần đăng nhập để thực hiện thao tác này')

        // Find post
        const post = await Post.findById(postId)
        if (!post) throw new NotFoundError('Tác phẩm không tồn tại')

        const likeIndex = post.likes.findIndex(like => like.user.toString() === userId)

        // Let action to know if the user like/undo their interactions
        let action = "like"

        if (likeIndex === -1) {
            // Add like
            post.likes.push({ user: new mongoose.Types.ObjectId(userId) })


            // Check if user is post owner
            if (userId !== post.talentId) {
                post.views.concat({ user: new mongoose.Types.ObjectId(userId) })
            }
        } else {
            // Remove like
            post.likes.splice(likeIndex, 1)
            action = "dislike"
        }

        await post.save()

        return {
            post,
            action
        }
    }

    static readBookmarkedPosts = async (userId) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError("User not found")

        //2. Fetch all bookmarked posts
        const bookmarkedPosts = await Post.find({ _id: { $in: user.postBookmarks } })
            .populate('talentId', 'stageName avatar')
            .populate('postCategoryId', 'title')
            .populate('movementId', 'title')
            .populate('artworks', 'url')
            .exec()

        return {
            posts: bookmarkedPosts
        }
    }

    //-------------------END CRUD----------------------------------------------------
    static bookmarkPost = async (userId, postId) => {
        // Find user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('Bạn cần đăng nhập để thực hiện thao tác này')

        // Find post
        const post = await Post.findById(postId).populate('talentId', 'stageName avatar').populate('postCategoryId', 'title').populate('movementId', 'title').populate('artworks', 'url').exec()
        if (!post) throw new NotFoundError('Tác phẩm không tồn tại')

        const userPostBookmarkIndex = user.postBookmarks.findIndex(postBookmark => postBookmark.toString() === postId)
        const postBookmarkIndex = post.bookmarks.findIndex(bookmark => bookmark.user.toString() === userId)

        // Let action to know if the user postBookmark/undo their interactions
        let action = "bookmark"

        if (userPostBookmarkIndex === -1) {
            user.postBookmarks.push(postId)
            post.bookmarks.push({ user: new mongoose.Types.ObjectId(userId) })

            // Check if user is post owner
            if (userId !== post.talentId) {
                post.views.concat({ user: new mongoose.Types.ObjectId(userId) })
            }
        } else {
            // Remove postBookmark
            user.postBookmarks.splice(userPostBookmarkIndex, 1)
            post.bookmarks.splice(postBookmarkIndex, 1)
            action = "unbookmark"
        }

        await user.save()
        await post.save()

        return {
            post,
            action
        }
    }

    static readPostCategoriesWithPosts = async (talentId) => {
        try {
            // Fetch all post categories
            const postCategories = await PostCategory.find({ talentId }).lean()

            // For each category, find associated posts
            const categorizedPosts = await Promise.all(
                postCategories.map(async (category) => {
                    const posts = await Post.find({
                        postCategoryId: category._id,
                    })
                        .populate("artworks", "url")
                        .populate("talentId", "stageName fullName avatar")
                        .exec()

                    return {
                        _id: category._id,
                        title: category.title,
                        posts,
                    }
                })
            )
            return { categorizedPosts }
        } catch (error) {
            console.error("Error fetching posts by category:", error)
            throw new BadRequestError("Xem tác phẩm không thành công")
        }
    }

    static readArtworks = async (talentId) => {
        try {
            // Find posts where talentId matches
            const posts = await Post.find({ talentId })
                .populate({
                    path: "artworks", // Populate the artworks field
                    model: "Artwork", // Model to populate from
                    select: "url", // Optionally specify fields to select
                })
                .exec()

            // Extract artworks from posts
            const artworks = posts.reduce((allArtworks, post) => {
                allArtworks.push(...post.artworks) // Add artworks from each post to the array
                return allArtworks
            }, [])
            return { artworks }
        } catch (error) {
            console.error("Error fetching artworks:", error)
            throw new BadRequestError("Xem tác phẩm không thành công")
        }
    }

    static updatePost = async (userId, artworkId, req) => {
        // 1. Check user and artwork
        const user = await User.findById(userId)
        const postToUpdate = await Post.findById(artworkId)

        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!postToUpdate) throw new NotFoundError("Tác phẩm không tồn tại")
        if (user.role !== "talent")
            throw new BadRequestError("Bạn không phải là họa sĩ")
        if (postToUpdate.talentId.toString() !== userId)
            throw new BadRequestError("Bạn không có quyền thực hiện thao tác này")
        const oldPostCategoryId = postToUpdate.postCategoryId

        // 2. Handle file uploads if new files were uploaded
        try {
            if (req.files && req.files.artworks) {
                // Upload new files to Cloudinary
                const uploadPromises = req.files.artworks.map((file) =>
                    compressAndUploadImage({
                        buffer: file.buffer,
                        originalname: file.originalname,
                        folderName: `fiyonce/artworks/${userId}`,
                        width: 1920,
                        height: 1080,
                    })
                )

                const uploadResults = await Promise.all(uploadPromises)
                const artworks = uploadResults.map(
                    (result) => result.secure_url
                )

                // Save new artworks to database
                let artworksId = []
                await Promise.all(
                    artworks.map(async (artwork) => {
                        const newArtwork = new Artwork({
                            talentId: userId,
                            url: artwork,
                        })
                        await newArtwork.save()
                        artworksId.push(
                            new mongoose.Types.ObjectId(newArtwork)
                        )
                    })
                )
                req.body.artworks = artworksId

                // Delete old files from Cloudinary
                const artworksToDelete = await Artwork.find({
                    _id: { $in: postToUpdate.artworks },
                })
                const publicIds = artworksToDelete.map((artwork) =>
                    extractPublicIdFromUrl(artwork.url)
                )
                await Promise.all(
                    publicIds.map((publicId) => deleteFileByPublicId(publicId))
                )

                //Delete old artworks from database
                await Artwork.deleteMany({
                    _id: { $in: postToUpdate.artworks },
                })
            }

            // 3. Merge existing artwork fields with req.body to ensure fields not provided in req.body are retained
            const updatedFields = { ...postToUpdate.toObject(), ...req.body }
            // 4. Update artwork
            const updatedPost = await Post.findByIdAndUpdate(
                artworkId,
                updatedFields,
                { new: true }
            )

            //5. Check if the postCategory has changed and if the old postCategory is now empty
            if (oldPostCategoryId.toString() !== updatedPost.postCategoryId.toString()) {
                const postsInOldPostCategory = await Post.find({ oldPostCategoryId })
                if (postsInOldPostCategory.length == 0) {
                    await PostCategory.findByIdAndDelete(oldPostCategoryId)
                }
            }

            return {
                post: updatedPost,
            }
        } catch (error) {
            console.error("Error in updating post:", error)
            throw new BadRequestError("Cập nhật tác phẩm không thành công")
        }
    }

    static deletePost = async (userId, artworkId) => {
        //1. Check user and artwork
        const user = await User.findById(userId)
        const postToDelete = await Post.findById(artworkId)

        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")
        if (!postToDelete) throw new NotFoundError("Tác phẩm không tồn tại")
        if (user.role !== "talent")
            throw new BadRequestError("Bạn không phải là họa sĩ")
        if (postToDelete.talentId.toString() !== userId)
            throw new BadRequestError("Bạn không có quyền thực hiện thao tác này")

        //2. Delete old files from Cloudinary
        try {
            const artworksToDelete = await Artwork.find({
                _id: { $in: postToDelete.artworks },
            })
            const publicIds = artworksToDelete.map((artwork) =>
                extractPublicIdFromUrl(artwork.url)
            )
            await Promise.all(
                publicIds.map((publicId) => deleteFileByPublicId(publicId))
            )
        } catch (error) {
            console.log("Error deleting artwork images:", error)
            throw new BadRequestError("Xóa tác phẩm không thành công")
        }

        //3. Delete artwork and post in database
        const postCategoryId = postToDelete.postCategoryId
        await Artwork.deleteMany({ _id: { $in: postToDelete.artworks } })
        await Post.findByIdAndDelete(artworkId)

        //4. Delete postCategory if postCategory references is null
        const remainingPostCategories = await Post.find({ postCategoryId })
        if (remainingPostCategories.length == 0) {
            await PostCategory.findByIdAndDelete(postCategoryId)
        }

        return {
            message: "Xóa tác phẩm thành công",
        }
    }
}

export default PostService
