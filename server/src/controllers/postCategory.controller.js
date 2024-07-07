import { SuccessResponse } from "../core/success.response.js"
import PostCategoryService from "../services/postCategory.service.js"

class PostCategoryController{
    createPostCategory = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create postCategory success!',
            metadata: await PostCategoryService.createPostCategory(req.userId, req.body)
        }).send(res)
    }
    readPostCategories = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read postCategories success!',
            metadata: await PostCategoryService.readPostCategories(req.params.talentId)
        }).send(res)
    }
    
    updatePostCategory = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update postCategory success!',
            metadata: await PostCategoryService.updatePostCategory(req.userId, req.params.postCategoryId, req.body)
        }).send(res)
    }

    deletePostCategory = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete postCategory success!',
            metadata: await PostCategoryService.deletePostCategory(req.userId, req.params.postCategoryId)
        }).send(res)
    }
}

export default new PostCategoryController()