import PostService from "../services/post.service.js"
import { SuccessResponse } from "../core/success.response.js"

class PostController{
    ///CRUD////////
    createPost = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Create new Post success!',
            metadata: await PostService.createPost(req.userId, req)
        }).send(res)
    }
    
    readPost = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get an post success!',
            metadata: await PostService.readPost(req.params.postId)
        }).send(res)
    }

    readPostsOfTalent = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get list posts success!',
            metadata: await PostService.readPostsOfTalent(req.params.talentId)
        }).send(res)
    }
    
    updatePost = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Update post success!',
            metadata: await PostService.updatePost(req.userId, req.params.postId, req)
        }).send(res)
    }

    deletePost = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete an post success!',
            metadata: await PostService.deletePost(req.userId, req.params.postId)
        }).send(res)
    }
    ///END----CRUD////////

    likePost = async(req, res, next) => {
        new SuccessResponse({
            message: 'Like an post success!',
            metadata: await PostService.likePost(req.userId, req.params.postId)
        }).send(res)
    }

    //Query////////
    findAllPosts = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Find all posts success!',
            metadata: await PostService.findAllPosts(req.query)
        }).send(res)
    }

    findPost = async(req, res, next) => {
        new SuccessResponse({
            message: 'Find an post success!',
            metadata: await PostService.findPost()
        }).send(res)
    }
    
}

export default new PostController()