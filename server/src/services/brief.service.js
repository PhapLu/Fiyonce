import { AuthFailureError, BadRequestError, NotFoundError } from "../core/error.response.js"
import Brief from "../models/brief.model.js"
import { User } from "../models/user.model.js"
import {artwork} from "../models/artwork.model.js"

class BriefService{
    //Brief CRUD
    static briefCommission = async(userId, body) => {
        const {type, talentChosenId} = body
        if(type == 'toMarket'){
            body.toMarket = true
            body.talentChosen = null
        }else if(type == 'toTalent'){
            const talent = await User.findById(talentChosenId)
            if(!talent) throw new BadRequestError('Talent not found!')
            if(talent.role != 'talent') throw new AuthFailureError('He/She is not a talent!')
            body.toMarket = false
            body.talentChosen = talentChosenId
        }
        console.log(body)
        const brief = new Brief({
            briefOwner: userId,
            ...body
        })

        const newBrief = await brief.save()
        return newBrief
    }

    static readBrief = async(briefId) => {
        const brief = await Brief.findById(briefId)
        if(!brief) throw new NotFoundError('Brief not found!')
        return brief
    }
    
    static readBriefs = async() => {
        const briefs = await Brief.find()
        return briefs
    }

    static updateBrief = async(userId, briefId, body) => {
        //1. check brief and user
        const oldBrief = await Brief.findById(briefId)
        const foundUser = await User.findById(userId)

        if(!foundUser) throw new NotFoundError('User not found!')
        if(!oldBrief) throw new NotFoundError('Brief not found!')
        if(oldBrief.briefOwner.toString() != userId) throw new AuthFailureError("You can update only your brief")
        //2. update brief
        const updatedBrief = await Brief.findByIdAndUpdate(
            briefId,
            {
                $set: body
            },
            { new: true }
        )
        return updatedBrief
        
    }

    static deleteBrief = async(userId, briefId) => {
        //1. Check user and brief
        const foundUser = await User.findById(userId)
        const brief = await Brief.findById(briefId)

        if(!foundUser) throw new NotFoundError('User not found!')
        if(!brief) throw new NotFoundError('Brief not found!')
        if(foundUser._id != brief.briefOwner.toString()) throw new AuthFailureError('You can delete only your brief!')
        //2. Delete brief
        return await Brief.findByIdAndDelete(briefId)
    }
    //End Brief CRUD

    static viewBriefHistory = async (clientId) => {
        //1. Check user
        const foundUser = await User.findById(clientId)
        if(!foundUser) throw new NotFoundError('User not found!')
        //2. Get briefs
        const briefs = await Brief.find({ briefOwner: clientId });
        return briefs;
    }

    static applyBrief = async (userId, briefId) => {
    }

    static submitPortfolio = async(talentId, briefId, body) => {
        //1. Check brief and talent
        const talent = await User.findById(talentId)
        const brief = await Brief.findById(briefId)
        if(!brief) throw new NotFoundError('Brief not found!')
        if(!talent) throw new BadRequestError('Talent not found!')
        if(talent.role != 'talent') throw new AuthFailureError('You are not a talent!')
        
        //2. Talent accept brief
        const updatedBrief = await Brief.findById(briefId)
        if(talent._id == updatedBrief.briefOwner.toString()) throw new BadRequestError('You cannot submit portfolio to your own brief!')

        updatedBrief.talentsAccepted.push(talentId)
        updatedBrief.save()

        const talentInfo = {
            talentName: talent.stage_name,
            talentFullName: talent.fullname,
            bio: talent.bio,
            email: talent.email,
            avatar: talent.avatar,
            background: talent.bg,
            city: talent.city,
            country: talent.country,
            socialLinks: talent.socialLinks,
            followers: talent.followers.length,
            following: talent.following.length,
        }
        const artworksInfo = body.artworks.map((artwork) => {
            return {
                artworkThumb: artwork.artwork_thumb,
            }
        })
            
        return {
            talentInfo,
            briefInfo: updatedBrief,
            artworksInfo
        }
    }

    static chooseTalent = async(userId, briefId, talentId) => {
        //1. Check user, brief and talent
        const user = await User.findById(userId)
        const updatedBrief = await Brief.findById(briefId)
        const talent = await User.findById(talentId)
        
        if(!user) throw new NotFoundError('User not found!')
        if(!updatedBrief) throw new NotFoundError('Brief not found!')
        if(!talent) throw new BadRequestError('Talent not found!')
        if(talent.role != 'talent') throw new AuthFailureError('He/She is not a talent!')
        if(user._id != updatedBrief.briefOwner.toString()) throw new AuthFailureError('You can choose talent only in your brief!')
        if(updatedBrief.talentChosen) throw new BadRequestError('You have already chosen a talent!')
        if(talentId != updatedBrief.talentsAccepted.find(talent => talent == talentId)) throw new BadRequestError('You can choose only accepted talent!')

        //2 Choose talent
        updatedBrief.talentChosen = talentId
        updatedBrief.save()

        return updatedBrief
    }
}

export default BriefService