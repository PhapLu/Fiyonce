import { SuccessResponse } from "../core/success.response.js"
import PostCategoryService from "../services/postCategory.service.js"

class PostCategoryController{
    createPostCategory = async(req, res, next) => {
        new SuccessResponse({
            message: 'Tạo album thành công',
            metadata: await PostCategoryService.createPostCategory(req.userId, req.body)
        }).send(res)
    }
    readPostCategories = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem album thành công',
            metadata: await PostCategoryService.readPostCategories(req.params.talentId)
        }).send(res)
    }
    
    updatePostCategory = async(req, res, next) => {
        new SuccessResponse({
            message: 'Cập nhật album thành công',
            metadata: await PostCategoryService.updatePostCategory(req.userId, req.params.postCategoryId, req.body)
        }).send(res)
    }

    deletePostCategory = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xóa album thành công',
            metadata: await PostCategoryService.deletePostCategory(req.userId, req.params.postCategoryId)
        }).send(res)
    }
}

export default new PostCategoryController()