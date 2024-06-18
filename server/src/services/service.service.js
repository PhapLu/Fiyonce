import { AuthFailureError, BadRequestError, NotFoundError } from '../core/error.response.js'
import Service from '../models/service.model.js'
import { User } from '../models/user.model.js'

class ServiceService{
    static createService = async(talentId, body) => {
        //1. Check talent exists
        const talent = await User.findById(talentId)
        if(!talent) throw new NotFoundError('Talent not found!')
        if(talent.role !== 'talent') throw new BadRequestError('He/She is not a talent!')

        //2. Validate body
        const {title, serviceCategories, fromPrice, deliverables, portfolios} = body
        if(portfolios.length == 0) throw new BadRequestError('Portfolios must not be empty')
        if(!title || !serviceCategories || !fromPrice || !deliverables) throw new BadRequestError('Please fill in all required fields!')

        //3. Create service
        const service = await Service.create({
            talentId: talentId,
            ...body
        })
        service.save()

        return {
            service
        }
    }

    static readService = async(serviceId) => {
        //1. Check service
        const service = await Service.findById(serviceId)
        if(!service) throw new NotFoundError('Service not found')

        //2. Read service
        return {
            service
        }
    }

    static readServices = async(talentId) => {
        //1. Check talent
        const talent = await User.findById(talentId)
        if(!talent) throw new NotFoundError('Talent not found')
        if(talent.role !== 'talent') throw new BadRequestError('He/She is not a talent')

        //2. Find services
        const services = await Service.find({talentId: talentId}).populate('talentId', 'stageName avatar')

        return {
            services
        }

    }

    static updateService = async(talentId, serviceId, body) => {
        //1. Check talent and service
        const talent = await User.findById(talentId)
        const service = await Service.findById(serviceId)

        if(!talent) throw new NotFoundError('Talent not found')
        if(!service) throw new NotFoundError('Service not found')
        if(service.talentId.toString() !== talentId) throw new BadRequestError('You can only update your service')
        
        //2. Update Service
        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            { $set: body },
            { new: true }
        )

        return {
            service: updatedService
        }
    }   

    static deleteService = async(talentId, serviceId) => {
        //1. Check talent and service
        const talent = await User.findById(talentId)
        const service = await Service.findById(serviceId)

        if(!talent) throw new NotFoundError('Talent not found')
        if(!service) throw new NotFoundError('Service not found')
        if(service.talentId.toString() !== talentId) throw new BadRequestError('You can only delete your service')

        //2. Delete service
        return await service.remove()
    }
}

export default ServiceService
