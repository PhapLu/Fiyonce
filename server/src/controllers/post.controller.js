import PostService from "../services/post.service.js"
import { SuccessResponse } from "../core/success.response.js"

class PostController{
    ///CRUD////////
    createPost = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Tạo bài viết thành công',
            metadata: await PostService.createPost(req.userId, req)
        }).send(res)
    }
    
    readPost = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem bài viết thành công',
            metadata: await PostService.readPost(req, req.params.postId)
        }).send(res)
    }

    readPosts = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem bài viết thành công',
            metadata: await PostService.readPosts(req.params.talentId)
        }).send(res)
    }
    
    readPostCategoriesWithPosts = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem bài viết thành công',
            metadata: await PostService.readPostCategoriesWithPosts(req.params.talentId)
        }).send(res)
    }

    readArtworks = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem tranh thành công',
            metadata: await PostService.readArtworks(req.params.talentId)
        }).send(res)
    }

    updatePost = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Cập nhật bài viết thành công',
            metadata: await PostService.updatePost(req.userId, req.params.postId, req)
        }).send(res)
    }

    deletePost = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xoá bài viết thành công',
            metadata: await PostService.deletePost(req.userId, req.params.postId)
        }).send(res)
    }

    ///END----CRUD////////

    likePost = async(req, res, next) => {
        new SuccessResponse({
            message: 'Thích bài viết thành công',
            metadata: await PostService.likePost(req.userId, req.params.postId)
        }).send(res)
    }

    //Query////////
    findAllPosts = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Tìm các bài viết thành công',
            metadata: await PostService.findAllPosts(req.query)
        }).send(res)
    }

    findPost = async(req, res, next) => {
        new SuccessResponse({
            message: 'Tìm bài viết thành công',
            metadata: await PostService.findPost()
        }).send(res)
    }
    
}

export default new PostController()