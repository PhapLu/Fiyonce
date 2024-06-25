import express from 'express'
import accessService from '../../services/auth.service.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js";
import accountDashboardController from '../../controllers/accountDashboard.controller.js';

const router = express.Router()

//authentication
router.use(verifyToken)

export default router
