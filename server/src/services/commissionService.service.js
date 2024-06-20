import { AuthFailureError, BadRequestError, NotFoundError } from '../core/error.response.js'
import CommissionService from '../models/commissionService.model.js'
import { User } from '../models/user.model.js'
import { compressAndUploadImage, deleteFileByPublicId, extractPublicIdFromUrl, generateOptimizedImageUrl } from '../utils/cloud.util.js';

class CommissionServiceService{ 
    static createCommissionService = async (talentId, req) => {
        // 1. Check talent exists
        const talent = await User.findById(talentId);
        if (!talent) throw new NotFoundError('Talent not found!');
        if (talent.role !== 'talent') throw new BadRequestError('User is not a talent!');
        console.log(req.files)
    
        // 2. Validate request body
        const { title, serviceCategoryId, minPrice, deliverables } = req.body;
        if (!req.files || !req.files.files) {
            throw new BadRequestError('Please provide artwork files');
        }
        if (!title || !serviceCategoryId || !minPrice || !deliverables) {
            throw new BadRequestError('Please provide all required fields');
        }
    
        // 3. Upload files to Cloudinary (compressed) and get their optimized URLs
        try {
            const uploadPromises = req.files.files.map(file => compressAndUploadImage({
                buffer: file.buffer,
                originalname: file.originalname,
                folderName: `fiyonce/commissionServices/${talentId}`,
                width: 1920,
                height: 1080
            }));
            console.log(uploadPromises)

            const uploadResults = await Promise.all(uploadPromises);
            console.log(uploadResults)
    
            // Generate optimized URLs
            const optimizedUrls = uploadResults.map(result => generateOptimizedImageUrl(result.public_id));
            console.log(optimizedUrls)
            // 4. Create and save commission service
            let service = new CommissionService({
                talentId,
                title,
                serviceCategoryId,
                minPrice,
                deliverables,
                artworks: optimizedUrls
            });
            await service.save();
    
            // Populate talentId field with stageName and avatar
            service = await service.populate('talentId', 'stageName avatar');
    
            return {
                service
            };
        } catch (error) {
            console.error('Error uploading images:', error);
            throw new Error('File upload or database save failed');
        }
    };
    

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

    static deleteCommissionService = async (talentId, serviceId) => {
        // 1. Check talent and service
        const talent = await User.findById(talentId);
        const service = await CommissionService.findById(serviceId);
    
        if (!talent) throw new NotFoundError('Talent not found');
        if (!service) throw new NotFoundError('Service not found');
        if (service.talentId.toString() !== talentId) throw new BadRequestError('You can only delete your service');
    
        // 2. Extract public IDs and delete files from Cloudinary
        const publicIds = service.artworks.map(artwork => extractPublicIdFromUrl(artwork));
        await Promise.all(publicIds.map(publicId => deleteFileByPublicId(publicId)));
    
        // 3. Delete the service from the database
        await service.remove();
    
        return { message: 'Service deleted successfully' };
    };
    
}

export default CommissionServiceService
