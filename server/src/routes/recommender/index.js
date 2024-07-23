import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import recommenderController from '../../controllers/recommender.controller.js'

const router = express.Router()
router.get('/search', asyncHandler(recommenderController.search));
router.get('/readPopularPosts', asyncHandler(recommenderController.readPopularPosts))
router.get('/readLatestPosts', asyncHandler(recommenderController.readLatestPosts))
router.get('/readPopularCommissionServices', asyncHandler(recommenderController.readPopularCommissionServices))
router.get('/readLatestCommissionServices', asyncHandler(recommenderController.readLatestCommissionServices))

router.use(verifyToken)
router.get('/readFollowingPosts', asyncHandler(recommenderController.readFollowingPosts))
router.get('/readFollowingCommissionServices',  asyncHandler(recommenderController.readFollowingCommissionServices))

export default router