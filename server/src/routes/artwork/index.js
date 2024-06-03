import express from 'express'
import artworkController from '../../controllers/artwork.controller.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { authenticationV2 } from '../../auth/authUtils.js'
import accessService from '../../services/access.service.js'
const router = express.Router()

router.get('/search/:keySearch', asyncHandler(artworkController.searchArtworksByUser))
router.get('', asyncHandler(artworkController.findAllArtworks))
router.get('/:artworkId', asyncHandler(artworkController.findArtwork))

//authentication
//router.use(authenticationV2)
router.use(verifyToken)

router.post('', asyncHandler(artworkController.createArtwork))
router.patch('/:artworkId', asyncHandler(artworkController.updateArtwork))
router.delete('/:artworkId', 
    accessService.grantAccess('deleteOwn', 'profile'), 
    asyncHandler(artworkController.deleteArtwork)
)

export default router