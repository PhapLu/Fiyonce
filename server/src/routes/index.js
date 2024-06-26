import express from 'express'
import authRoute from './auth/index.js'
import userRoute from './user/index.js'
import orderRoute from './order/index.js'
import artworkRoute from './artwork/index.js'
import uploadRoute from './upload/index.js'
import talentRequestRoute from './talentRequest/index.js'
import proposalRoute from './proposal/index.js'
import commissionServiceRoute from './commissionService/index.js'
import serviceCategoryRoute from './serviceCategory/index.js'
import artworkCategoryRoute from './artworkCategory/index.js'
import movementRoute from './movement/index.js'
import accountDashboardRoute from './accountDashboard/index.js'
import overviewDashboardRoute from './overviewDashboard/index.js'
import transactionDashboardRoute from './transactionDashboard/index.js'
import challengeDashboardRoute from './challengeDashboard/index.js'
import reportDashboardRoute from './reportDashboard/index.js'
import reviewRoute from './review/index.js'

const router = express.Router()

//Check Permission
router.use('/v1/api/auth', authRoute)
router.use('/v1/api/user', userRoute)
router.use('/v1/api/artwork', artworkRoute)
router.use('/v1/api/order', orderRoute)
router.use('/v1/api/upload', uploadRoute)
router.use('/v1/api/proposal', proposalRoute)
router.use('/v1/api/talentRequest', talentRequestRoute)
router.use('/v1/api/commissionService', commissionServiceRoute)
router.use('/v1/api/serviceCategory', serviceCategoryRoute)
router.use('/v1/api/artworkCategory', artworkCategoryRoute)
router.use('/v1/api/movement', movementRoute)
router.use('/v1/api/accountDashboard', accountDashboardRoute)
router.use('/v1/api/overviewDashboard', overviewDashboardRoute)
router.use('/v1/api/transactionDashboard', transactionDashboardRoute)
router.use('/v1/api/challengeDashboard', challengeDashboardRoute)
router.use('/v1/api/reportDashboard', reportDashboardRoute)
router.use('/v1/api/review', reviewRoute)

export default router