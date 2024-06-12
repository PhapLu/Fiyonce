import { AuthFailureError, BadRequestError, NotFoundError } from "../core/error.response.js"
import CommissionRequest from "../models/commissionRequest.model.js"
import { User } from "../models/user.model.js"
import {artwork} from "../models/artwork.model.js"

class CommissionRequestService{
    //requestCommission CRUD
    static requestCommission = async(userId, body) => {
        const {type, talentChosenId} = body
        if(type == 'toMarket'){
            body.toMarket = true
            body.talentChosenId = null
        }else if(type == 'toTalent'){
            const talent = await User.findById(talentChosenId)
            if(!talent) throw new BadRequestError('Talent not found!')
            if(talent.role != 'talent') throw new AuthFailureError('He/She is not a talent!')
            body.toMarket = false
            body.talentChosenId = talentChosenId
        }
        const commissionRequest = new CommissionRequest({
            memberId: userId,
            ...body
        })
        const newCommissionRequest= await commissionRequest.save()

        return {
            commissionRequest: newCommissionRequest
        }
    }

    static readCommissionRequest = async(commissionRequestId) => {
        const commissionRequest = await CommissionRequest.findById(commissionRequestId)
        if(!commissionRequest) throw new NotFoundError('CommissionRequest not found!')
        return {
            commissionRequest
        }
    }
    
    static readCommissionRequests = async() => {
        const commissionRequests = await CommissionRequest.find({toMarket: true})
        return {
            commissionRequests
        }
    }

    static updateCommissionRequest = async(userId, commissionRequestId, body) => {
        //1. check commissionRequest and user
        const oldCommissionRequest = await CommissionRequest.findById(commissionRequestId)
        const foundUser = await User.findById(userId)
        if(!foundUser) throw new NotFoundError('User not found!')
        if(!oldCommissionRequest) throw new NotFoundError('CommissionRequest not found!')
        if(oldCommissionRequest.memberId.toString() != userId) throw new AuthFailureError("You can update only your commissionRequest")
        
        //2. update commissionRequest
        const updatedCommissionRequest = await CommissionRequest.findByIdAndUpdate(
            commissionRequestId,
            {
                $set: body
            },
            { new: true }
        )
        return {
            commissionRequest: updatedCommissionRequest
        }
        
    }

    static deleteCommissionRequest = async(userId, commissionRequestId) => {
        //1. Check user and commissionRequest
        const foundUser = await User.findById(userId)
        const commissionRequest = await CommissionRequest.findById(commissionRequestId)
        if(!foundUser) throw new NotFoundError('User not found!')
        if(!commissionRequest) throw new NotFoundError('CommissionRequest not found!')
        if(foundUser._id != commissionRequest.memberId.toString()) throw new AuthFailureError('You can delete only your commissionRequest!')
        
        //2. Delete commissionRequest
        return await CommissionRequest.findByIdAndDelete(commissionRequestId)
    }
    //End CommissionRequest CRUD

    static viewCommissionRequestHistory = async (clientId) => {
        //1. Check user
        const foundUser = await User.findById(clientId)
        if(!foundUser) throw new NotFoundError('User not found!')
        
        //2. Get commissionRequests
        const commissionRequests = await CommissionRequest.find({ memberId: clientId });
        return {
            commissionRequests
        };
    }

    static chooseTalent = async(userId, commissionRequestId, talentId) => {
        //1. Check user, commissionRequest and talent
        const user = await User.findById(userId)
        const updatedCommissionRequest = await CommissionRequest.findById(commissionRequestId)
        const talent = await User.findById(talentId)

        if(!user) throw new NotFoundError('User not found!')
        if(!updatedCommissionRequest) throw new NotFoundError('CommissionRequest not found!')
        if(!talent) throw new BadRequestError('Talent not found!')
        if(talent.role != 'talent') throw new AuthFailureError('He/She is not a talent!')
        if(user._id != updatedCommissionRequest.memberId.toString()) throw new AuthFailureError('You can choose talent only in your commissionRequest!')
        if(updatedCommissionRequest.talentChosenId) throw new BadRequestError('You have already chosen a talent!')
        if(talentId != updatedCommissionRequest.talentsAccepted.find(talent => talent == talentId)) throw new BadRequestError('You can choose only accepted talent!')

        //2 Choose talent
        updatedCommissionRequest.talentChosenId = talentId
        updatedCommissionRequest.save()

        return {
            commissionRequest: updatedCommissionRequest
        }
    }
}

export default CommissionRequestService