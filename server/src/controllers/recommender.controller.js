import { SuccessResponse } from "../core/success.response.js"
import RecommenderService from "../services/recommender.service.js"

class RecommenderController {
  search = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Popular Posts success!',
      metadata: await RecommenderService.search(req.query)
    }).send(res);
  }

  readSearchResults = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get search results success!',
      metadata: await RecommenderService.readSearchResults(req.query)
    }).send(res)
  }

  readPopularPosts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Popular Posts success!',
      metadata: await RecommenderService.readPopularPosts(req)
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
      metadata: await RecommenderService.readLatestPosts(req)
    }).send(res)
  }

  readPopularCommissionServices = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Popular Services success!',
      metadata: await RecommenderService.readPopularCommissionServices(req)
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
      metadata: await RecommenderService.readLatestCommissionServices(req)
    }).send(res)
  }

  recommendUsersToFollow = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get users to follow success!',
      metadata: await RecommenderService.recommendUsersToFollow(req.userId)
    }).send(res)
  }
}

export default new RecommenderController()