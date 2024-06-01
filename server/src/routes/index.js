import express from 'express'
import accessRoute from './access/index.js'
import userRoute from './user/index.js'
import briefRoute from './brief/index.js'
import artworkRoute from './artwork/index.js'
import uploadRoute from './upload/index.js'

const router = express.Router()
//check Permission
router.use('/v1/api/access', accessRoute)
router.use('/v1/api/user', userRoute)
router.use('/v1/api/artwork', artworkRoute)
router.use('/v1/api/brief', briefRoute)
router.use('/v1/api/upload', uploadRoute)

export default router