import express from "express";
import { asyncHandler } from "../../auth/checkAuth.js";
import { authenticationV2 } from "../../auth/authUtils.js";
import applyController from "../../controllers/apply.controller.js";
import { verifyToken } from "../../middlewares/jwt.js";

const router = express.Router()
//Member
router.get('/readApply/:applyId', asyncHandler(applyController.readApply))
router.get('/readApplies/:briefId', asyncHandler(applyController.readApplies))

//authentication
//router.use(authenticationV2)
router.use(verifyToken)
//CRUD
//Talent
router.post('/submitPortfolio/:briefId', asyncHandler(applyController.submitPortfolio))
router.patch('/updateApply/:applyId', asyncHandler(applyController.updateApply))
router.delete('/deleteApply/:applyId', asyncHandler(applyController.deleteApply))
//END CRUD
router.get('/viewAppliesHistory', asyncHandler(applyController.viewAppliesHistory))

export default router