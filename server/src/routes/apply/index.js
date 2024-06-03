import express from "express";
import { asyncHandler } from "../../auth/checkAuth.js";
import { authenticationV2 } from "../../auth/authUtils.js";
import briefController from "../../controllers/brief.controller.js";
import { verifyToken } from "../../middlewares/jwt.js";

const router = express.Router()

router.get('/readApply/:applyId', asyncHandler(briefController.readBrief))
router.get('/readApply', asyncHandler(briefController.readBriefs))

//authentication
//router.use(authenticationV2)
router.use(verifyToken)
//CRUD
router.post('/submitPortfolio', asyncHandler(briefController.briefCommission))
router.patch('/updateApply', asyncHandler(briefController.updateBrief))
router.delete('/deleteApply/:applyId', asyncHandler(briefController.deleteBrief))
//END CRUD
router.get('/viewAppliesHistory', asyncHandler(briefController.viewBriefHistory))

export default router