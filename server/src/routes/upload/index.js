import express from 'express'
import uploadController from '../../controllers/upload.controller.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import {uploadDisk, uploadMemory} from '../../configs/multer.config.js'
import { authenticationV2 } from '../../auth/authUtils.js'
import accessService from '../../services/access.service.js'
const router = express.Router()

//router.post('/product', asyncHandler(uploadController.uploadFile))
router.use(authenticationV2)
router.post('/profile/avatarOrCover/:userId', uploadMemory.single('file'), accessService.grantAccess('updateOwn', 'profile'), asyncHandler(uploadController.uploadAvatarOrCover))
router.post('/product/multiple', uploadMemory.array('files', 5), asyncHandler(uploadController.uploadImagesFromLocal))
export default router
