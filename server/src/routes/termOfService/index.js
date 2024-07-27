import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import termOfServiceController from '../../controllers/termOfService.controller.js'

const router = express.Router()

router.get('/readTermOfService/:termOfServiceId', asyncHandler(termOfServiceController.readTermOfService))

//authentication
router.use(verifyToken)

router.get('/readTermOfServices', asyncHandler(termOfServiceController.readTermOfServices))
router.post('/createTermOfService', asyncHandler(termOfServiceController.createTermOfService))
router.patch('/updateTermOfService/:termOfServiceId', asyncHandler(termOfServiceController.updateTermOfService))
router.delete('/deleteTermOfService/:termOfServiceId', asyncHandler(termOfServiceController.deleteTermOfService))

export default router
