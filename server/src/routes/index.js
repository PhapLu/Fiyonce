import express from 'express'
import authRoute from './auth/index.js'
import userRoute from './user/index.js'
import briefRoute from './brief/index.js'
import artworkRoute from './artwork/index.js'
import uploadRoute from './upload/index.js'
import talentRequest from './talentRequest/index.js'
import proposalRoute from './proposal/index.js'

const router = express.Router()
//check Permission
router.use('/v1/api/auth', authRoute)
router.use('/v1/api/user', userRoute)
router.use('/v1/api/artwork', artworkRoute)
router.use('/v1/api/brief', briefRoute)
router.use('/v1/api/upload', uploadRoute)
router.use('/v1/api/proposal', proposalRoute)
router.use('/v1/api/talentRequest', talentRequest)


export default router