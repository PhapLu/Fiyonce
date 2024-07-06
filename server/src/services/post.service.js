import Post from "../models/post.model.js"
import Artwork from "../models/artwork.model.js"
import { User } from "../models/user.model.js"
import { BadRequestError, NotFoundError } from "../core/error.response.js"
import { compressAndUploadImage, deleteFileByPublicId, extractPublicIdFromUrl } from "../utils/cloud.util.js"

class PostService{
    static createPost = async(userId, req) => {
        //1. Check user
        const user = await User.findById(userId)
        if(!user) throw new NotFoundError('User not found')
        if(user.role !== 'talent') throw new BadRequestError('You are not a talent')

        //2. Validate request body
        const { title, description } = req.body
        if(!req.files || !req.files.artworks) 
            throw new BadRequestError('Please provide artwork files')
        if(!userId || !title || !description) 
            throw new BadRequestError('Please provide all required fields')

        //3. Upload artwork images to cloudinary
        try {
            const uploadPromises = req.files.artworks.map(file => compressAndUploadImage({
                buffer: file.buffer,
                originalname: file.originalname,
                folderName: `fiyonce/artworks/${userId}`,
                width: 1920,
                height: 1080
            }))
            const uploadResults = await Promise.all(uploadPromises)
            const artworks = uploadResults.map(result => result.secure_url)

            //4. Create and save artwork
            let artworksId = []
            await Promise.all(
                artworks.map(async (artwork) => {
                    const newArtwork = new Artwork({
                        talentId: userId,
                        url: artwork
                    })
                    await newArtwork.save()
                    artworksId.push(newArtwork._id)
                })
            )

            //5. Create and save post
            const newPost = new Post({
                ...req.body,
                talentId: userId,
                artworks: artworksId
            })
            await newPost.save()

            return {
                artwork: newPost
            }
        } catch (error) {
            console.error('Error uploading images:', error)
            throw new Error('File upload or database save failed')
        }
    }

    static readPost = async(artworkId) => {
        //1. Find artwork
        const artwork = await Post.findById(artworkId).populate('talentId', 'stageName avatar')
        if(!artwork) throw new NotFoundError('Post not found')

        return {
            artwork
        }
    }

    static readPostsOfTalent = async(talentId) => {
        //1. Check talent
        const talent = await User.findById(talentId)
        if(!talent) throw new NotFoundError('User not found')
        if(talent.role !== 'talent') throw new BadRequestError('He/She is not a talent')

        //2. Find artworks
        const artworks = await Post.find({talentId})

        return {
            artworks
        }
    }

    static updatePost = async (userId, artworkId, req) => {
        // 1. Check user and artwork
        const user = await User.findById(userId)
        const postToUpdate = await Post.findById(artworkId)
      
        if (!user) throw new NotFoundError('User not found')
        if (!postToUpdate) throw new NotFoundError('Post not found')
        if (user.role !== 'talent') throw new BadRequestError('You are not a talent')
        if (postToUpdate.talentId.toString() !== userId) throw new BadRequestError('You can only update your artwork')
      
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

            // Save new artworks to database
            let artworksId = []
            await Promise.all(
              artworks.map(async (artwork) => {
                const newArtwork = new Artwork({
                  talentId: userId,
                  url: artwork
                })
                await newArtwork.save()
                artworksId.push(newArtwork._id)
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
      
          // 4. Update artwork
          const updatedPost = await Post.findByIdAndUpdate(
            artworkId,
            updatedFields,
            { new: true }
          )
      
          return {
            message: "Update artwork success!",
            status: 200,
            metadata: {
              artwork: updatedPost
            }
          }
        } catch (error) {
          console.error('Error in updating artwork:', error)
          throw new Error('Post update failed')
        }
      }      

    static deletePost = async(userId, artworkId) => {
        //1. Check user and artwork
        const user = await User.findById(userId)
        const postToDelete = await Post.findById(artworkId)

        if(!user) throw new NotFoundError('User not found')
        if(!postToDelete) throw new NotFoundError('Post not found')
        if(user.role !== 'talent') throw new BadRequestError('You are not a talent')
        if(postToDelete.talentId.toString() !== userId) throw new BadRequestError('You can only delete your artwork')

        //2. Delete old files from Cloudinary
        try {
            const artworksToDelete = await Artwork.find({ _id: { $in: postToDelete.artworks } })
            const publicIds = artworksToDelete.map(artwork => extractPublicIdFromUrl(artwork.url))
            await Promise.all(publicIds.map(publicId => deleteFileByPublicId(publicId)))
        } catch (error) {
            console.log('Error deleting artwork images:', error)
        }

        //3. Delete artwork and post in database
        await Artwork.deleteMany({ _id: { $in: postToDelete.artworks } })
        await Post.findByIdAndDelete(artworkId)

        return {
            message: 'Delete artwork success'
        }
    }
}

export default PostService
