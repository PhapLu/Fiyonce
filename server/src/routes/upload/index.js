import express from 'express'
import uploadController from '../../controllers/upload.controller.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import {uploadDisk, uploadMemory} from '../../configs/multer.config.js'
import { authenticationV2 } from '../../auth/authUtils.js'
import accessService from '../../services/auth.service.js'
import { verifyToken } from "../../middlewares/jwt.js";

const router = express.Router()

//router.post('/product', asyncHandler(uploadController.uploadFile))
//authentication
//router.use(authenticationV2)
router.use(verifyToken)

router.post('/profile/avatarOrCover/:profileId', uploadMemory.single('file'), accessService.grantAccess('updateOwn', 'profile'), asyncHandler(uploadController.uploadAvatarOrCover))
router.post('/product/multiple', uploadMemory.array('files', 5), asyncHandler(uploadController.uploadImagesFromLocal))
export default router
