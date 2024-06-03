import express from "express";
import userController from "../../controllers/user.controller.js";
import accessService from "../../services/access.service.js";
import { uploadFields } from "../../configs/multer.config.js";
import { asyncHandler } from "../../auth/checkAuth.js";
import { authenticationV2 } from "../../auth/authUtils.js";
import { verifyToken } from "../../middlewares/jwt.js";

const router = express.Router()
//
router.get('/readUserProfile/:profileId', asyncHandler(userController.readUserProfile))

//authentication
//router.use(authenticationV2)
router.use(verifyToken)

//update Role
router.patch('/updateUserProfile/:id', accessService.grantAccess('updateOwn', 'profile'), asyncHandler(userController.updateProfile))
router.post('/addToBookmarks/:artworkId', accessService.grantAccess('updateOwn', 'profile'), asyncHandler(userController.addToBookmark))
router.delete('/delete:profileId', accessService.grantAccess('deleteOwn', 'profile'), asyncHandler(userController.deleteProfile))
router.post('/requestUpgradingToTalent', uploadFields, accessService.grantAccess('updateOwn', 'profile'), asyncHandler(userController.requestUpgradingToTalent))
//admin
router.patch('/upgradeRoleToTalent/:requestId', accessService.grantAccess('updateAny', 'profile'), asyncHandler(userController.upgradeRoleToTalent))
router.patch('/denyTalentRequest/:requestId', accessService.grantAccess('updateAny', 'profile'), asyncHandler(userController.denyTalentRequest))
router.get('/viewTalentRequest/:requestId', accessService.grantAccess('readAny', 'profile'), asyncHandler(userController.viewTalentRequest))
router.get('/viewTalentRequests', accessService.grantAccess('readAny', 'profile'), asyncHandler(userController.viewTalentRequests))
//router.post('/createTalentCode/:userId', accessService.grantAccess('createAny', 'profile'), asyncHandler(userController.createTalentCode))

export default router