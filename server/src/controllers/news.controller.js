import { SuccessResponse } from "../core/success.response.js"
import NewsService from "../services/news.service.js"

class NewsController{
    createNews = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create news success!',
            metadata: await NewsService.createNews(req.userId, req)
        }).send(res)
    }

    readNews = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read news success!',
            metadata: await NewsService.readNews(req.params.newsId)
        }).send(res)
    }

    readNewss = async(req, res, next) => {
        new SuccessResponse({
            message: 'Read newss success!',
            metadata: await NewsService.readNewss()
        }).send(res)
    }

    updateNews = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update news success!',
            metadata: await NewsService.updateNews(req.userId, req.params.newsId, req)
        }).send(res)
    }

    deleteNews = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete news success!',
            metadata: await NewsService.deleteNews(req.userId, req.params.newsId)
        }).send(res)
    }
}

export default new NewsController()