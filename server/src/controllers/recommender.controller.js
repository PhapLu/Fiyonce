import { SuccessResponse } from "../core/success.response.js"
import RecommenderService from "../services/recommender.service.js"

class RecommenderController {
  search = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Popular Posts success!',
      metadata: await RecommenderService.search(req.query)
    }).send(res);
  }

  readPopularPosts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Popular Posts success!',
      metadata: await RecommenderService.readPopularPosts()
    }).send(res)
  }

  readFollowingPosts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Following Posts success!',
      metadata: await RecommenderService.readFollowingPosts(req.userId)
    }).send(res)
  }

  readLatestPosts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Latest Posts success!',
      metadata: await RecommenderService.readLatestPosts()
    }).send(res)
  }

  readPopularCommissionServices = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Popular Services success!',
      metadata: await RecommenderService.readPopularCommissionServices()
    }).send(res)
  }

  readFollowingCommissionServices = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Popular Commission Services success!',
      metadata: await RecommenderService.readFollowingCommissionServices(req.userId)
    }).send(res)
  }

  readLatestCommissionServices = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Popular Services success!',
      metadata: await RecommenderService.readLatestCommissionServices()
    }).send(res)
  }
}

export default new RecommenderController()