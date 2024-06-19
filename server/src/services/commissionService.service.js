import { AuthFailureError, BadRequestError, NotFoundError } from '../core/error.response.js'
import CommissionService from '../models/commissionService.model.js'
import ServiceCategory from '../models/serviceCategory.model.js'
import { User } from '../models/user.model.js'

class CommissionServiceService{ 
    static createCommissionService = async(talentId, body) => {
        //1. Check talent exists
        const talent = await User.findById(talentId);
        if (!talent) throw new NotFoundError('Talent not found!');
        if (talent.role !== 'talent') throw new BadRequestError('He/She is not a talent!');
    
        //2. Validate body
        const { title, serviceCategoryTitle, fromPrice, deliverables, portfolios } = body;
        if (!title || !serviceCategoryTitle || !fromPrice || !deliverables || portfolios.length === 0) {
            throw new BadRequestError('Please fill in all required fields and ensure portfolios is not empty!');
        }
    
        //3. Check service category
        let serviceCategory = await ServiceCategory.findOne({ talentId: talentId, title: serviceCategoryTitle });
        if (!serviceCategory) {
            serviceCategory = await ServiceCategory.create({
                talentId: talentId,
                title: serviceCategoryTitle
            });
        }
    
        //4. Create service
        let service = await CommissionService.create({
            talentId: talentId,
            serviceCategoryId: serviceCategory._id,
            ...body
        });
    
        // Populate talentId field with stageName and avatar
        service = await service.populate('talentId', 'stageName avatar').execPopulate();
    
        return {
            service
        };
    }
    

    static readCommissionService = async(serviceId) => {
        //1. Check service
        const service = await CommissionService.findById(serviceId).populate('talentId', 'stageName avatar')
        if(!service) throw new NotFoundError('Service not found')

        //2. Read service
        return {
            service
        }
    }

    static readCommissionServices = async(talentId) => {
        //1. Check talent
        const talent = await User.findById(talentId)
        if(!talent) throw new NotFoundError('Talent not found')
        if(talent.role !== 'talent') throw new BadRequestError('He/She is not a talent')

        //2. Find services
        const services = await CommissionService.find({talentId: talentId}).populate('talentId', 'stageName avatar')

        return {
            services
        }
    }

    static updateCommissionService = async(talentId, serviceId, body) => {
        //1. Check talent and service
        const talent = await User.findById(talentId)
        const service = await CommissionService.findById(serviceId)

        if(!talent) throw new NotFoundError('Talent not found')
        if(!service) throw new NotFoundError('Service not found')
        if(service.talentId.toString() !== talentId) throw new BadRequestError('You can only update your service')
        
        //2. Update Service
        let updatedService = await CommissionService.findByIdAndUpdate(
            serviceId,
            { $set: body },
            { new: true }
        )
        updatedService = await updatedService.populate('talentId', 'stageName avatar').execPopulate()

        return {
            service: updatedService
        }
    }   

    static deleteCommissionService = async(talentId, serviceId) => {
        //1. Check talent and service
        const talent = await User.findById(talentId)
        const service = await CommissionService.findById(serviceId)

        if(!talent) throw new NotFoundError('Talent not found')
        if(!service) throw new NotFoundError('Service not found')
        if(service.talentId.toString() !== talentId) throw new BadRequestError('You can only delete your service')

        //2. Delete service
        return await service.remove()
    }
}

export default CommissionServiceService
