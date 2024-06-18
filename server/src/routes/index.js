import express from 'express'
import authRoute from './auth/index.js'
import userRoute from './user/index.js'
import orderRoute from './order/index.js'
import artworkRoute from './artwork/index.js'
import uploadRoute from './upload/index.js'
import talentRequestRoute from './talentRequest/index.js'
import proposalRoute from './proposal/index.js'
import serviceRoute from './service/index.js'

const router = express.Router()
//check Permission
router.use('/v1/api/auth', authRoute)
router.use('/v1/api/user', userRoute)
router.use('/v1/api/artwork', artworkRoute)
router.use('/v1/api/order', orderRoute)
router.use('/v1/api/upload', uploadRoute)
router.use('/v1/api/proposal', proposalRoute)
router.use('/v1/api/talentRequest', talentRequestRoute)
router.use('/v1/api/service', serviceRoute)

export default router