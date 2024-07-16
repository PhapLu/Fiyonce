import { SuccessResponse } from "../core/success.response.js";
import RecommenderService from "../services/recommender.service.js";

class RecommenderController {
  readPopularPosts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Popular Posts success!',
      metadata: await RecommenderService.readPopularPosts()
    }).send(res);
  }

  readFollowingPosts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Following Posts success!',
      metadata: await RecommenderService.readFollowingPosts(req.userId)
    }).send(res);
  }

  readLatestPosts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Latest Posts success!',
      metadata: await RecommenderService.readLatestPosts()
    }).send(res);
  }
}

export default new RecommenderController();