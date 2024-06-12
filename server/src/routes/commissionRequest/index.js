import express from "express";
import { asyncHandler } from "../../auth/checkAuth.js";
import { authenticationV2 } from "../../auth/authUtils.js";
import commissionRequestController from "../../controllers/commissionRequest.controller.js";
import { verifyToken } from "../../middlewares/jwt.js";

const router = express.Router()

router.get('/readCommissionRequest/:commissionRequestId', asyncHandler(commissionRequestController.readCommissionRequest))
router.get('/readCommissionRequests', asyncHandler(commissionRequestController.readCommissionRequests))

//authentication
//router.use(authenticationV2)
router.use(verifyToken)
//CRUD
router.post('/commissionRequestCommission', asyncHandler(commissionRequestController.requestCommission))
router.patch('/updateCommissionRequest/:commissionRequestId', asyncHandler(commissionRequestController.updateCommissionRequest))
router.delete('/deleteCommissionRequest/:commissionRequestId', asyncHandler(commissionRequestController.deleteCommissionRequest))
//END CRUD
router.get('/viewCommissionRequestHistory', asyncHandler(commissionRequestController.viewCommissionRequestHistory))
router.patch('/chooseTalent/:commissionRequestId', asyncHandler(commissionRequestController.chooseTalent))

export default router