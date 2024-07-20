import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler.js';
import { verifyToken } from "../../middlewares/jwt.js";
import recommenderController from '../../controllers/recommender.controller.js';

const router = express.Router();
router.get('/search', asyncHandler(recommenderController.search));
router.get('/readPopularPosts', asyncHandler(recommenderController.readPopularPosts));
router.get('/readFollowingPosts', verifyToken, asyncHandler(recommenderController.readFollowingPosts));
router.get('/readLatestPosts', asyncHandler(recommenderController.readLatestPosts));

export default router;