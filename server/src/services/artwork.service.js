import { BadRequestError, NotFoundError } from "../core/error.response.js";
import Artwork from "../models/artwork.model.js";
import { findAllArtworks, updateArtworkById, findArtwork, searchArtworksByUser, deleteArtwork } from "../models/repositories/artwork.repo.js";
import { User } from "../models/user.model.js";
import { compressAndUploadImage, deleteFileByPublicId, extractPublicIdFromUrl } from "../utils/cloud.util.js";

class ArtworkService{
    static createArtwork = async(userId, req) => {
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
            const newArtwork = new Artwork({
                ...req.body,
                talentId: userId,
                artworks
            })
            await newArtwork.save()

            return {
                artwork: newArtwork
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            throw new Error('File upload or database save failed');
        }
    }

    static readArtwork = async(artworkId) => {
        //1. Find artwork
        const artwork = await Artwork.findById(artworkId).populate('talentId', 'stageName avatar')
        if(!artwork) throw new NotFoundError('Artwork not found')

        return {
            artwork
        }
    }

    static readArtworksOfTalent = async(talentId) => {
        //1. Check talent
        const talent = await User.findById(talentId)
        if(!talent) throw new NotFoundError('User not found')
        if(talent.role !== 'talent') throw new BadRequestError('He/She is not a talent')

        //2. Find artworks
        const artworks = await Artwork.find({talentId})

        return {
            artworks
        }
    }

    static updateArtwork = async (userId, artworkId, req) => {
        // 1. Check user and artwork
        const user = await User.findById(userId);
        const artworkToUpdate = await Artwork.findById(artworkId);
      
        if (!user) throw new NotFoundError('User not found');
        if (!artworkToUpdate) throw new NotFoundError('Artwork not found');
        if (user.role !== 'talent') throw new BadRequestError('You are not a talent');
        if (artworkToUpdate.talentId.toString() !== userId) throw new BadRequestError('You can only update your artwork');
      
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
            }));
      
            const uploadResults = await Promise.all(uploadPromises);
            const artworks = uploadResults.map(result => result.secure_url);
            req.body.artworks = artworks;
      
            // Delete old files from Cloudinary
            const publicIds = artworkToUpdate.artworks.map(url => extractPublicIdFromUrl(url));
            await Promise.all(publicIds.map(publicId => deleteFileByPublicId(publicId)));
          }
      
          // 3. Merge existing artwork fields with req.body to ensure fields not provided in req.body are retained
          const updatedFields = { ...artworkToUpdate.toObject(), ...req.body };
      
          // 4. Update artwork
          const updatedArtwork = await Artwork.findByIdAndUpdate(
            artworkId,
            updatedFields,
            { new: true }
          );
      
          return {
            message: "Update artwork success!",
            status: 200,
            metadata: {
              artwork: updatedArtwork
            }
          };
        } catch (error) {
          console.error('Error in updating artwork:', error);
          throw new Error('Artwork update failed');
        }
      };      

    static deleteArtwork = async(userId, artworkId) => {
        //1. Check user and artwork
        const user = await User.findById(userId)
        const artworkToDelete = await Artwork.findById(artworkId)

        if(!user) throw new NotFoundError('User not found')
        if(!artworkToDelete) throw new NotFoundError('Artwork not found')
        if(user.role !== 'talent') throw new BadRequestError('You are not a talent')
        if(artworkToDelete.talentId.toString() !== userId) throw new BadRequestError('You can only delete your artwork')

        //2. Delete artwork on cloudinary
        try {
            const publicIds = artworkToDelete.artworks.map(url => extractPublicIdFromUrl(url))
            for(const publicId of publicIds){
                await deleteFileByPublicId(publicId)
            }
        } catch (error) {
            console.log('Error deleting artwork images:', error)
        }

        //3. Delete artwork
        await Artwork.findByIdAndDelete(artworkId)

        return {
            message: 'Delete artwork success'
        }
    }
}

export default ArtworkService
