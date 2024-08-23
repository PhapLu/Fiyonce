import PostService from "../services/post.service.js"
import { SuccessResponse } from "../core/success.response.js"

class PostController {
    ///CRUD////////
    createPost = async (req, res, next) => {
        new SuccessResponse({
            message: 'Tạo tác phẩm thành công',
            metadata: await PostService.createPost(req.userId, req)
        }).send(res)
    }

    readPost = async (req, res, next) => {
        new SuccessResponse({
            message: 'Xem chi tiết tác phẩm thành công',
            metadata: await PostService.readPost(req, req.params.postId)
        }).send(res)
    }

    readPostsByMovement = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem tác phẩm thành công',
            metadata: await PostService.readPostsByMovement(req.params.movementId)
        }).send(res)
    }

    readPostCategoriesWithPosts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Xem tác phẩm thành công',
            metadata: await PostService.readPostCategoriesWithPosts(req.params.talentId)
        }).send(res)
    }

    readArtworks = async (req, res, next) => {
        new SuccessResponse({
            message: 'Xem tác phẩm thành công',
            metadata: await PostService.readArtworks(req.params.talentId)
        }).send(res)
    }

    updatePost = async (req, res, next) => {
        new SuccessResponse({
            message: 'Cập nhật tác phẩm thành công',
            metadata: await PostService.updatePost(req.userId, req.params.postId, req)
        }).send(res)
    }

    deletePost = async (req, res, next) => {
        new SuccessResponse({
            message: 'Xóa tác phẩm thành công',
            metadata: await PostService.deletePost(req.userId, req.params.postId)
        }).send(res)
    }

    ///END----CRUD////////
    likePost = async (req, res, next) => {
        new SuccessResponse({
            message: 'Thích tác phẩm thành công',
            metadata: await PostService.likePost(req.userId, req.params.postId)
        }).send(res)
    }

    bookmarkPost = async (req, res, next) => {
        new SuccessResponse({
            message: 'Lưu tác phẩm thành công',
            metadata: await PostService.bookmarkPost(req.userId, req.params.postId)
        }).send(res)
    }


    readBookmarkedPosts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Tìm tác phẩm đã lưu thành công',
            metadata: await PostService.readBookmarkedPosts(req.params.userId)
        }).send(res)
    }

    //Query////////
    findAllPosts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Tìm tất cả tác phẩm thành công',
            metadata: await PostService.findAllPosts(req.query)
        }).send(res)
    }

    findPost = async (req, res, next) => {
        new SuccessResponse({
            message: 'Tìm tác phẩm thành công',
            metadata: await PostService.findPost()
        }).send(res)
    }
    readBookmarkedPosts = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem tác phẩm đã lưu thành công',
            metadata: await PostService.readBookmarkedPosts(req.params.userId)
        }).send(res)
    }
}

export default new PostController()