import { SuccessResponse } from "../core/success.response.js"
import HelpService from "../services/help.service.js"

class HelpController{
    createHelpTheme = async(req, res, next) => {
        new SuccessResponse({
            message: 'Tạo chủ đề trợ giúp thành công',
            metadata: await HelpService.createHelpTheme(req.userId, req.body)
        }).send(res)
    }

    createHelpTopic = async(req, res, next) => {
        new SuccessResponse({
            message: 'Tạo chủ đề trợ giúp thành công',
            metadata: await HelpService.createHelpTopic(req.userId, req.body)
        }).send(res)
    }

    createHelpArticle = async(req, res, next) => {
        new SuccessResponse({
            message: 'Tạo bài viết trợ giúp thành công',
            metadata: await HelpService.createHelpArticle(req.userId, req.body)
        }).send(res)
    }

    readHelpTheme = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem chủ đề trợ giúp thành công',
            metadata: await HelpService.readHelpTheme(req.params.helpThemeId)
        }).send(res)
    }

    readHelpTopic = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem chủ đề trợ giúp thành công',
            metadata: await HelpService.readHelpTopic(req.params.helpTopicId)
        }).send(res)
    }

    readHelpArticle = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem bài viết trợ giúp thành công',
            metadata: await HelpService.readHelpArticle(req.params.helpArticleId)
        }).send(res)
    }

    readHelpThemes = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem chủ đề trợ giúp thành công',
            metadata: await HelpService.readHelpThemes()
        }).send(res)
    }

    readHelpTopics = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem chủ đề trợ giúp thành công',
            metadata: await HelpService.readHelpTopics()
        }).send(res)
    }

    readHelpArticles = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xem bài viết trợ giúp thành công',
            metadata: await HelpService.readHelpArticles()
        }).send(res)
    }

    updateHelpTheme = async(req, res, next) => {
        new SuccessResponse({
            message: 'Cập nhật chủ đề trợ giúp thành công',
            metadata: await HelpService.updateHelpTheme(req.userId, req.params.helpThemeId, req.body)
        }).send(res)
    }

    updateHelpTopic = async(req, res, next) => {
        new SuccessResponse({
            message: 'Cập nhật chủ đề trợ giúp thành công',
            metadata: await HelpService.updateHelpTopic(req.userId, req.params.helpTopicId, req.body)
        }).send(res)
    }

    updateHelpArticle = async(req, res, next) => {
        new SuccessResponse({
            message: 'Cập nhật bài viết trợ giúp thành công',
            metadata: await HelpService.updateHelpArticle(req.userId, req.params.helpArticleId, req.body)
        }).send(res)
    }

    deleteHelpTheme = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xóa chủ đề trợ giúp thành công',
            metadata: await HelpService.deleteHelpTheme(req.userId, req.params.helpThemeId)
        }).send(res)
    }

    deleteHelpTopic = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xóa chủ đề trợ giúp thành công',
            metadata: await HelpService.deleteHelpTopic(req.userId, req.params.helpTopicId)
        }).send(res)
    }

    deleteHelpArticle = async(req, res, next) => {
        new SuccessResponse({
            message: 'Xóa bài viết trợ giúp thành công',
            metadata: await HelpService.deleteHelpArticle(req.userId, req.params.helpArticleId)
        }).send(res)
    }
}

export default new HelpController()