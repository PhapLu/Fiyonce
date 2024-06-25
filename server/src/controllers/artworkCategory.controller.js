import { SuccessResponse } from "../core/success.response.js"
import ArtworkCategoryService from "../services/artworkCategory.service.js"

class ArtworkCategoryController{
    createArtworkCategory = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create artworkCategory success!',
            metadata: await ArtworkCategoryService.createArtworkCategory(req.userId, req.body)
        }).send(res)
    }
    readArtworkCategories = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read artworkCategories success!',
            metadata: await ArtworkCategoryService.readArtworkCategories(req.params.talentId)
        }).send(res)
    }
    
    updateArtworkCategory = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update artworkCategory success!',
            metadata: await ArtworkCategoryService.updateArtworkCategory(req.userId, req.params.artworkCategoryId, req.body)
        }).send(res)
    }

    deleteArtworkCategory = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete artworkCategory success!',
            metadata: await ArtworkCategoryService.deleteArtworkCategory(req.userId, req.params.artworkCategoryId)
        }).send(res)
    }
}

export default new ArtworkCategoryController()