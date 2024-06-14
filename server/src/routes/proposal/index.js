import express from "express";
import { asyncHandler } from "../../auth/checkAuth.js";
import { authenticationV2 } from "../../auth/authUtils.js";
import proposalController from "../../controllers/proposal.controller.js";
import { verifyToken } from "../../middlewares/jwt.js";

const router = express.Router()
//Member
router.get('/readProposals/:orderId', asyncHandler(proposalController.readProposals))

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
router.get('/viewProposalsHistory', asyncHandler(proposalController.viewProposalsHistory))
router.patch('/confirmProposal/:proposalId', asyncHandler(proposalController.confirmProposal))

export default router