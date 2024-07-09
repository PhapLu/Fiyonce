import Post from "../models/post.model.js"
import Artwork from "../models/artwork.model.js"
import { User } from "../models/user.model.js"
import { BadRequestError, NotFoundError } from "../core/error.response.js"
import { compressAndUploadImage, deleteFileByPublicId, extractPublicIdFromUrl } from "../utils/cloud.util.js"
import PostCategory from "../models/postCategory.model.js"
import mongoose, { Mongoose } from "mongoose"

class PostService {
    static createPost = async (userId, req) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('User not found')
        if (user.role !== 'talent') throw new BadRequestError('You are not a talent')

        //2. Validate request body
        const { title, description, postCategoryId } = req.body
        if (!req.files || !req.files.artworks)
            throw new BadRequestError('Please provide artwork files')
        if (!userId || !description || !postCategoryId)
            throw new BadRequestError('Please provide all required fields')

        //3. Upload artwork images to cloudinary
        try {
            const uploadPromises = req.files.artworks.map(file => compressAndUploadImage({
                buffer: file.buffer,
                originalname: file.originalname,
                folderName:`fiyonce/artworks/${userId}`,
                width: 1920,
                height: 1080
            }))
            const uploadResults = await Promise.all(uploadPromises)
            const artworks = uploadResults.map(result => result.secure_url)

            //4. Create and save artwork
            let artworksId = []
            let newArtworks = []
            await Promise.all(
                artworks.map(async (artwork) => {
                    const newArtwork = new Artwork({
                        url: artwork
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
                artworks: artworksId
            })
            await newPost.save()

            //6. Add postId to artworks
            await Promise.all(
                newArtworks.map(async (artwork) => {
                    await Artwork.findByIdAndUpdate(
                        artwork._id,
                        { postId: newPost._id }
                    )
                }
                ))

            return {
                artwork: newPost
            }
        } catch (error) {
            console.error('Error uploading images:', error)
            throw new Error('File upload or database save failed')
        }
    }

    static readPost = async (postId) => {
        //1. Find artwork
        const post = await Post.findById(postId).populate('talentId', 'stageName avatar').populate('postCategoryId', 'title').populate('movementId', 'title').populate('artworks', 'url').exec()
        if (!post) throw new NotFoundError('Post not found')

        return {
            post
        }
    }

    static readPostsOfTalent = async (talentId) => {
        //1. Check talent
        const talent = await User.findById(talentId)
        if (!talent) throw new NotFoundError('User not found')
        if (talent.role !== 'talent') throw new BadRequestError('He/She is not a talent')

        //2. Find artworks
        const artworks = await Post.find({ talentId })

        return {
            artworks
        }
    }

    static readPostCategoriesWithPosts = async (talentId) => {
        try {
            // Fetch all post categories
            const postCategories = await PostCategory.find({ talentId }).lean()

            // For each category, find associated posts
            const categorizedPosts = await Promise.all(postCategories.map(async (category) => {
                const posts = await Post.find({ postCategoryId: category._id }).populate('artworks', 'url').exec();

                return {
                    _id: category._id,
                    title: category.title,
                    posts
                }
            }))
            return { categorizedPosts }
        } catch (error) {
            console.error('Error fetching posts by category:', error)
            throw new Error('Failed to fetch posts by category')
        }
    }

    static readArtworks = async (talentId) => {
        try {
            // Find posts where talentId matches
            const posts = await Post.find({ talentId })
                .populate({
                    path: 'artworks',  // Populate the artworks field
                    model: 'Artwork',  // Model to populate from
                    select: 'url'  // Optionally specify fields to select
                })
                .exec();

            // Extract artworks from posts
            const artworks = posts.reduce((allArtworks, post) => {
                allArtworks.push(...post.artworks);  // Add artworks from each post to the array
                return allArtworks;
            }, []);

            return artworks;
        } catch (error) {
            console.error('Error fetching artworks:', error);
            throw error;
        }
    }

    static updatePost = async (userId, artworkId, req) => {
        console.log("AAAAAAAAAAAAAAA")
        console.log(req.body)
        // 1. Check user and artwork
        const user = await User.findById(userId)
        const postToUpdate = await Post.findById(artworkId)

        if (!user) throw new NotFoundError('User not found')
        if (!postToUpdate) throw new NotFoundError('Post not found')
        if (user.role !== 'talent') throw new BadRequestError('You are not a talent')
        if (postToUpdate.talentId.toString() !== userId) throw new BadRequestError('You can only update your artwork')
        const oldPostCategoryId = postToUpdate.postCategoryId

        // 2. Handle file uploads if new files were uploaded
        try {
            if (req.files && req.files.artworks) {
                // Upload new files to Cloudinary
                const uploadPromises = req.files.artworks.map(file => compressAndUploadImage({
                    buffer: file.buffer,
                    originalname: file.originalname,
                    folderName: `fiyonce/artworks/${userId}`,
                    width: 1920,
                    height: 1080
                }))

                const uploadResults = await Promise.all(uploadPromises)
                const artworks = uploadResults.map(result => result.secure_url)
                console.log("To be upload:")
                console.log(artworks)

                // Save new artworks to database
                let artworksId = []
                await Promise.all(
                    artworks.map(async (artwork) => {
                        const newArtwork = new Artwork({
                            talentId: userId,
                            url: artwork
                        })
                        await newArtwork.save()
                        artworksId.push(new mongoose.Types.ObjectId(newArtwork))
                    })
                )
                req.body.artworks = artworksId

                // Delete old files from Cloudinary
                const artworksToDelete = await Artwork.find({ _id: { $in: postToUpdate.artworks } })
                const publicIds = artworksToDelete.map(artwork => extractPublicIdFromUrl(artwork.url))
                await Promise.all(publicIds.map(publicId => deleteFileByPublicId(publicId)))

                //Delete old artworks from database
                await Artwork.deleteMany({ _id: { $in: postToUpdate.artworks } })
            }

            // 3. Merge existing artwork fields with req.body to ensure fields not provided in req.body are retained
            const updatedFields = { ...postToUpdate.toObject(), ...req.body }
            console.log(updatedFields);
            // 4. Update artwork
            const updatedPost = await Post.findByIdAndUpdate(
                artworkId,
                updatedFields,
                { new: true }
            )

            //5. Check if the postCategory has changed and if the old postCategory is now empty
            if (oldPostCategoryId.toString() !== updatedPost.postCategoryId.toString()){
                const postsInOldPostCategory = await Post.find({oldPostCategoryId})
                if(postsInOldPostCategory.length == 0){
                    await PostCategory.findByIdAndDelete(oldPostCategoryId)
                    console.log(`Deleted PostCategory ID: ${oldPostCategoryId}`)
                }
            }

            return {
                post: updatedPost
            }
        } catch (error) {
            console.error('Error in updating post:', error)
            throw new Error('Post update failed')
        }
    }

    static deletePost = async (userId, artworkId) => {
        //1. Check user and artwork
        const user = await User.findById(userId)
        const postToDelete = await Post.findById(artworkId)

        if (!user) throw new NotFoundError('User not found')
        if (!postToDelete) throw new NotFoundError('Post not found')
        if (user.role !== 'talent') throw new BadRequestError('You are not a talent')
        if (postToDelete.talentId.toString() !== userId) throw new BadRequestError('You can only delete your artwork')

        //2. Delete old files from Cloudinary
        try {
            const artworksToDelete = await Artwork.find({ _id: { $in: postToDelete.artworks } })
            const publicIds = artworksToDelete.map(artwork => extractPublicIdFromUrl(artwork.url))
            await Promise.all(publicIds.map(publicId => deleteFileByPublicId(publicId)))
        } catch (error) {
            console.log('Error deleting artwork images:', error)
        }

        //3. Delete artwork and post in database
        const postCategoryId = postToDelete.postCategoryId
        await Artwork.deleteMany({ _id: { $in: postToDelete.artworks } })
        await Post.findByIdAndDelete(artworkId)

        //4. Delete postCategory if postCategory references is null
        const remainingPostCategories = await Post.find({postCategoryId})
        if(remainingPostCategories.length == 0){
            await PostCategory.findByIdAndDelete(postCategoryId)
        }

        return {
            message: 'Delete post and artwork success'
        }
    }
}

export default PostService