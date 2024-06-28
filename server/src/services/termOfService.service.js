import { AuthFailureError, BadRequestError, NotFoundError } from '../core/error.response.js'
import TermOfService from '../models/termOfService.model.js'
import CommissionService from '../models/commissionService.model.js'
import { User } from '../models/user.model.js'

class TermOfServiceService {
    static createTermOfService = async (userId, body) => {
        //1. Check if user is an talent
        const user = await User.findById(userId)
        if (!user) throw new AuthFailureError('User not found')
        if (user.role !== 'talent') throw new BadRequestError('User is not a talent')

        //2. Validate body
        const { content } = body
        if (!content) throw new BadRequestError('All fields are required')

        //3. Create termOfService
        const termOfService = new TermOfService({
            talentId: userId,
            ...body
        })
        await termOfService.save()

        return {
            termOfService
        }
    }

    static readTermOfService = async (termOfServiceId) => {
        //1. Check if termOfService exists
        const termOfService = await TermOfService.findById(termOfServiceId);
        if (!termOfService) throw new NotFoundError('TermOfService not found')

        return {
            termOfService
        }
    }

    static readTermOfServices = async () => {
        // 1. Fetch all TermOfService documents
        const termOfServices = await TermOfService.find().lean();

        // 2. For each TermOfService, find the associated CommissionServices
        const termOfServicesWithCommissionServices = await Promise.all(termOfServices.map(async termOfService => {
            const commissionServices = await CommissionService.find({ termOfServiceId: termOfService._id });
            return {
                ...termOfService,
                commissionServices
            };
        }));

        return {termOfServices: termOfServicesWithCommissionServices};
    }


    static updateTermOfService = async (userId, termOfServiceId, body) => {
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new AuthFailureError('User not found')
        if (user.role !== 'talent') throw new BadRequestError('User is not a talent')

        //2. Check if termOfService exists
        const termOfService = await TermOfService.findById(termOfServiceId)
        if (!termOfService) throw new NotFoundError('TermOfService not found')
        if (termOfService.talentId.toString() !== userId)
            throw new BadRequestError('User is not authorized to update this termOfService')

        //3. Update termOfService
        const updatedTermOfService = await TermOfService.findByIdAndUpdate(
            termOfServiceId,
            body,
            { new: true }
        )

        return {
            termOfService: updatedTermOfService
        }
    }

    static deleteTermOfService = async (userId, termOfServiceId) => {
       console.log(termOfServiceId)
        //1. Check user
        const user = await User.findById(userId)
        if (!user) throw new AuthFailureError('User not found')
        if (user.role !== 'talent') throw new BadRequestError('User is not a talent')

        //2. Check if termOfService exists
        const termOfService = await TermOfService.findById(termOfServiceId)
        if (!termOfService) throw new NotFoundError('TermOfService not found')
        if (termOfService.talentId.toString() !== userId)
            throw new BadRequestError('User is not authorized to update this termOfService')

        //3. Delete termOfService
        await TermOfService.findByIdAndDelete(termOfServiceId)

        return {
            "message": "TermOfService deleted successfully"
        }
    }
}

export default TermOfServiceService
