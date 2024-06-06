import { AuthFailureError, BadRequestError, NotFoundError } from "../core/error.response.js"
import Apply from "../models/apply.model.js"
import Brief from "../models/brief.model.js"
import { User } from "../models/user.model.js"
import {artwork} from "../models/artwork.model.js"

class ApplyService{
    static submitPortfolio = async(userId, briefId, body) => {
        //1. Check if user, brief exists
        const user = await User.findById(userId)
        const brief = await Brief.findById(briefId)
        if(!user) throw new NotFoundError('User not found')
        if(!brief) throw new NotFoundError('Brief not found')

        //2. Check if user is a talent
        if(user.role !== 'talent')
            throw new AuthFailureError('You are not a talent')

        //3. Check if user has already applied for the brief
        const existingApply = await Apply.findOne({talentId: userId, briefId: briefId})
        if(existingApply) 
            throw new BadRequestError('You have already applied for this brief')

        //4. Check if artworks are valid
        // if(body.artworks){
        //     const artworks = await artwork.find({_id: body.artworks})
        //     if(artworks.length !== body.artworks.length)
        //         throw new BadRequestError('Several artworks are not found')
        // }
        //5. Modify the acceptedTalent
        brief.talentsAccepted.push(userId)
        brief.save()
        //5.Check if price is valid
        if(body.price < 0)
            throw new BadRequestError('Price must be greater than 0')
        if(body.price < brief.minPrice*90/100 || body.price > brief.maxPrice*110/100)
            throw new BadRequestError('Price must be within the range of the brief')
        
        //6. Submit portfolio
        const apply = new Apply({
            briefId: briefId,
            userId: brief.briefOwner,
            talentId: userId,
            artworks: body.artworks,
            price: body.price,
        })
        await apply.save()
        return {
            apply
        }
    }
    static readApply = async(applyId) => {
        //1. Check if apply exists
        const apply = await Apply.findById(applyId)
        if(!apply) throw new NotFoundError('Apply not found')
        return {
            apply
        }
    }
    static readApplies = async(briefId) => {
        //1. Check if brief exists
        const brief = await Brief.findById(briefId)
        if(!brief) throw new NotFoundError('Brief not found')

        //2. Read all applies of a brief
        const applies = await Apply.find({briefId: briefId})
        return {
            applies
        }
    }
    static updateApply = async(userId, applyId, body) => {
        //1. Check if apply, user exists
        const user = await User.findById(userId)
        const apply = await Apply.findById(applyId)
        if(!apply) throw new NotFoundError('Apply not found')
        if(!user) throw new NotFoundError('User not found')

        //2. Check if user is authorized to update apply
        if(apply.talentId.toString() !== userId) 
            throw new AuthFailureError('You are not authorized to update this apply')
        
        //3. Check if artworks are valid
        if(body.artworks){
            const artworks = await artwork.find({_id: body.artworks})
            if(artworks.length !== body.artworks.length)
                throw new BadRequestError('Several artworks are not found')
        }

        //4. Update apply
        const updatedApply = await Apply.findByIdAndUpdate(
            applyId,
            {
                $set: body
            },
            {new: true}
        )
        await apply.save()

        return {
            apply: updatedApply
        }

    }

    static deleteApply = async(userId, applyId) => {
        //1. Check apply, user exists
        const apply = await Apply.findById(applyId)
        const user = await User.findById(userId)
        if(!apply) throw new NotFoundError('Apply not found')
        if(!user) throw new NotFoundError('User not found')

        //2. Check if user is authorized to delete apply
        if(apply.talentId.toString() !== userId) 
            throw new AuthFailureError('You are not authorized to delete this apply')
        
        //3. Delete apply
        await apply.remove()
        return {
            apply
        }
    }
    static viewAppliesHistory = async(userId) => {
        //1. Check if user exists
        const user = await User.findById(userId)
        if(!user) throw new NotFoundError('User not found')

        //2. View all applies of a talent
        const applies = await Apply.find({talentId: userId})
        return {
            applies
        }
    }
}

export default ApplyService