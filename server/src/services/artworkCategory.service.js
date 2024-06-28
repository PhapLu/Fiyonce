import ArtworkCategory from '../models/artworkCategory.model.js'
import CommissionService from '../models/commissionService.model.js'
import { User } from '../models/user.model.js'
import { AuthFailureError, BadRequestError, NotFoundError } from '../core/error.response.js'

class ArtworkCategoryService{
    static createArtworkCategory = async(talentId, body) => {
        //1. Check talent
        const talent = await User.findById(talentId)
        if(!talent) throw new NotFoundError('Talent not found')
        if(talent.role !== 'talent') throw new BadRequestError('He/She is not a talent')

        //2. Validate body
        if(!body.title) throw new BadRequestError('Title is required')

        //3. Create service
        const artworkCategory = new ArtworkCategory({
            title: body.title,
            talentId
        })
        await artworkCategory.save()
        return {
            artworkCategory
        }
    }

    static readArtworkCategories = async(talentId) => {
        //1. Check talent
        const talent = await User.findById(talentId)
        if(!talent) throw new NotFoundError('Talent not found')
        if(talent.role !== 'talent') throw new BadRequestError('He/She is not a talent')

        //2. Find services
        const artworkCategories = await ArtworkCategory.find({talentId: talentId}).populate('talentId', 'stageName avatar')

        return {
            artworkCategories
        }
    }

    static updateArtworkCategory = async(talentId, artworkCategoryId, body) => {
        //1. Check talent and service
        const talent = await User.findById(talentId)
        const artworkCategory = await ArtworkCategory.findById(artworkCategoryId)

        if(!talent) throw new NotFoundError('Talent not found')
        if(!artworkCategory) throw new NotFoundError('Service not found')
        if(artworkCategory.talentId.toString() !== talentId) throw new AuthFailureError('You can only update your service')
        
        //2. Validate body
        if(!body.title) throw new BadRequestError('Title is required')

        //3. Update Service
        const updatedArtworkCategory = await ArtworkCategory.findByIdAndUpdate(
            artworkCategoryId,
            { $set: body },
            { new: true }
        )

        return {
            artworkCategory: updatedArtworkCategory
        }
    }   

    static deleteArtworkCategory = async(talentId, artworkCategoryId) => {
        //1. Check talent and service
        const talent = await User.findById(talentId)
        const artworkCategory = await ArtworkCategory.findById(artworkCategoryId)

        if(!talent) throw new NotFoundError('Talent not found')
        if(!artworkCategory) throw new NotFoundError('Service not found')
        if(artworkCategory.talentId.toString() !== talentId) throw new AuthFailureError('You can only delete your artworkCategory')

        //2. Delete service
        return await artworkCategory.deleteOne()
    }
}

export default ArtworkCategoryService
