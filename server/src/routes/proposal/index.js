import express from "express"
import { asyncHandler } from "../../auth/checkAuth.js"
import { authenticationV2 } from "../../auth/authUtils.js"
import proposalController from "../../controllers/proposal.controller.js"
import { verifyToken } from "../../middlewares/jwt.js"
import { uploadFields } from "../../configs/multer.config.js"

const router = express.Router()
//Member
router.get('/readProposalsByOrderId/:orderId', asyncHandler(proposalController.readProposalsByOrderId))

//authentication
//router.use(authenticationV2)
router.use(verifyToken)
//CRUD
//Talent
router.post('/sendProposal/:orderId', asyncHandler(proposalController.sendProposal))
router.get('/readProposal/:proposalId', asyncHandler(proposalController.readProposal))
router.patch('/updateProposal/:proposalId', asyncHandler(proposalController.updateProposal))
router.delete('/deleteProposal/:proposalId', asyncHandler(proposalController.deleteProposal))
//END CRUD
router.get('/readProposalsHistory', asyncHandler(proposalController.readProposalsHistory))
router.post('/confirmProposal/:proposalId', asyncHandler(proposalController.confirmProposal))
router.post('/generatePaymentUrl/:proposalId', asyncHandler(proposalController.generatePaymentUrl))
router.patch('/denyProposal/:proposalId', asyncHandler(proposalController.denyProposal))

export default router