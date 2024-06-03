import express from "express";
import { asyncHandler } from "../../auth/checkAuth.js";
import { authenticationV2 } from "../../auth/authUtils.js";
import briefController from "../../controllers/brief.controller.js";
const router = express.Router()

router.get('/readBrief/:briefId', asyncHandler(briefController.readBrief))
router.get('/readBriefs', asyncHandler(briefController.readBriefs))

//authentication
//router.use(authenticationV2)
router.use(verifyToken)
//CRUD
router.post('/briefCommission', asyncHandler(briefController.briefCommission))
router.patch('/updateBrief/:briefId', asyncHandler(briefController.updateBrief))
router.delete('/deleteBrief/:briefId', asyncHandler(briefController.deleteBrief))
//END CRUD
router.get('/viewBriefHistory', asyncHandler(briefController.viewBriefHistory))
router.patch('/submitPortfolio/:briefId', asyncHandler(briefController.submitPortfolio))
router.patch('/chooseTalent/:briefId', asyncHandler(briefController.chooseTalent))

export default router