import express from 'express'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { verifyToken } from "../../middlewares/jwt.js"
import accessService from '../../services/auth.service.js'
import helpController from '../../controllers/help.controller.js'

const router = express.Router()

router.get('/readHelpTheme', asyncHandler(helpController.readHelpTheme))
router.get('/readHelpTopic', asyncHandler(helpController.readHelpTopic))
router.get('/readHelpArticle', asyncHandler(helpController.readHelpArticle))

router.get('/readHelpThemes', asyncHandler(helpController.readHelpThemes))
router.get('/readHelpTopics', asyncHandler(helpController.readHelpTopics))
router.get('/readHelpArticles', asyncHandler(helpController.readHelpArticles))

//authentication
router.use(verifyToken)

//admin
router.post('/createHelpTheme', uploadFields, accessService.grantAccess('createAny', 'profile'), asyncHandler(helpController.createHelpTheme))
router.post('/createHelpTopic', uploadFields, accessService.grantAccess('createAny', 'profile'), asyncHandler(helpController.createHelpTopic))
router.post('/createHelpArticle', uploadFields, accessService.grantAccess('createAny', 'profile'), asyncHandler(helpController.createHelpArticle))

router.patch('/updateHelpTheme/:helpThemeId', uploadFields, accessService.grantAccess('updateAny', 'profile'), asyncHandler(helpController.updateHelpTheme))
router.patch('/updateHelpTopic/:helpTopicId', uploadFields, accessService.grantAccess('updateAny', 'profile'), asyncHandler(helpController.updateHelpTopic))
router.patch('/updateHelpArticle/:helpArticleId', uploadFields, accessService.grantAccess('updateAny', 'profile'), asyncHandler(helpController.updateHelpArticle))

router.delete('/deleteHelpTheme/:helpThemeId', accessService.grantAccess('deleteAny', 'profile'), asyncHandler(helpController.deleteHelpTheme))
router.delete('/deleteHelpTopic/:helpTopicId', accessService.grantAccess('deleteAny', 'profile'), asyncHandler(helpController.deleteHelpTopic))
router.delete('/deleteHelpArticle/:helpArticleId', accessService.grantAccess('deleteAny', 'profile'), asyncHandler(helpController.deleteHelpArticle))

export default router
