import express from 'express'
import artworkController from '../../controllers/artwork.controller.js'
import { asyncHandler } from '../../helpers/asyncHandler.js'
import accessService from '../../services/auth.service.js'
import { verifyToken } from "../../middlewares/jwt.js";
import { uploadFields } from '../../configs/multer.config.js';

const router = express.Router()

router.get('/readArtwork/:artworkId', asyncHandler(artworkController.readArtwork))
router.get('/readArtworksOfTalent/:talentId', asyncHandler(artworkController.readArtworksOfTalent))

//authentication
router.use(verifyToken)

router.post('/createArtwork', uploadFields, asyncHandler(artworkController.createArtwork))
router.patch('/updateArtwork/:artworkId', uploadFields, asyncHandler(artworkController.updateArtwork))
router.delete('/deleteArtwork/:artworkId', asyncHandler(artworkController.deleteArtwork))

export default router