import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler.js';
import { verifyToken } from "../../middlewares/jwt.js";
import recommenderController from '../../controllers/recommender.controller.js';

const router = express.Router();
router.get('/readPopularPosts', asyncHandler(recommenderController.readPopularPosts));
router.get('/readFollowingPosts', verifyToken, asyncHandler(recommenderController.readFollowingPosts));
router.get('/readLatestPosts', asyncHandler(recommenderController.readLatestPosts));
router.get('/readPopularCommissionServices', asyncHandler(recommenderController.readPopularCommissionServices));
router.get('/readFollowingCommissionServices', asyncHandler(recommenderController.readFollowingCommissionServices));
router.get('/readLatestCommissionServices', asyncHandler(recommenderController.readLatestCommissionServices));

export default router;