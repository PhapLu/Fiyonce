import { AuthFailureError, BadRequestError, NotFoundError } from '../core/error.response.js'
import CommissionService from '../models/commissionService.model.js'
import ServiceCategory from '../models/serviceCategory.model.js';
import { User } from '../models/user.model.js'
import { compressAndUploadImage, deleteFileByPublicId, extractPublicIdFromUrl, generateOptimizedImageUrl } from '../utils/cloud.util.js';

class CommissionServiceService{ 
    static createCommissionService = async (talentId, req) => {
        // 1. Check talent exists
        const talent = await User.findById(talentId);
        if (!talent) throw new NotFoundError('Talent not found!');
        if (talent.role !== 'talent') throw new BadRequestError('User is not a talent!');
    
        // 2. Validate request body
        const { title, serviceCategoryId, minPrice, deliverables } = req.body;
        if (!req.files || !req.files.files) {
            throw new BadRequestError('Please provide artwork files');
        }
        if (!title || !serviceCategoryId || !minPrice || !deliverables) {
            throw new BadRequestError('Please provide all required fields');
        }
    
        // 3. Upload files to Cloudinary (compressed) and get their URLs
        try {
            const uploadPromises = req.files.files.map(file => compressAndUploadImage({
                buffer: file.buffer,
                originalname: file.originalname,
                folderName: `fiyonce/commissionServices/${talentId}`,
                width: 1920,
                height: 1080
            }));
            const uploadResults = await Promise.all(uploadPromises);
    
            // Generate URLs
            const artworks = uploadResults.map(result => result.secure_url);

            // 4. Create and save commission service
            let service = new CommissionService({
                talentId,
                title,
                serviceCategoryId,
                minPrice,
                deliverables,
                artworks
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
    

    static readCommissionService = async(commissionServiceId) => {
        //1. Check service
        const service = await CommissionService.findById(commissionServiceId).populate('talentId', 'stageName avatar')
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


    static updateCommissionService = async (talentId, commissionServiceId, req) => {
        try {
            console.log(req.body)
            // 1. Check talent and service
            const talent = await User.findById(talentId);
            const service = await CommissionService.findById(commissionServiceId);
    
            if (!talent) throw new NotFoundError('Talent not found');
            if (!service) throw new NotFoundError('Service not found');
            if (service.talentId.toString() !== talentId) throw new BadRequestError('You can only update your service');
    
            const oldCategoryId = service.serviceCategoryId; // Store the old category ID
    
            // 2. Handle file uploads if new files were uploaded
            if (req.files && req.files.files) {
                // Upload new files to Cloudinary
                const uploadPromises = req.files.files.map(file => compressAndUploadImage({
                    buffer: file.buffer,
                    originalname: file.originalname,
                    folderName: `fiyonce/commissionServices/${talentId}`,
                    width: 1920,
                    height: 1080
                }));
                const uploadResults = await Promise.all(uploadPromises);
                const artworks = uploadResults.map(result => result.secure_url);
                req.body.artworks = artworks;
    
                // Delete old files from Cloudinary
                const publicIds = service.artworks.map(artwork => extractPublicIdFromUrl(artwork));
                await Promise.all(publicIds.map(publicId => deleteFileByPublicId(publicId)));
            }
    
            // 3. Update the service
            const updatedService = await CommissionService.findByIdAndUpdate(
                commissionServiceId,
                { $set: req.body },
                { new: true }
            );
    
            // 4. Check if the category has changed and if the old category is now empty
            if (oldCategoryId && oldCategoryId.toString() !== updatedService.serviceCategoryId.toString()) {
                const servicesInOldCategory = await CommissionService.find({ serviceCategoryId: oldCategoryId });
                if (servicesInOldCategory.length === 0) {
                    await ServiceCategory.findByIdAndDelete(oldCategoryId);
                    console.log(`Deleted Category ID: ${oldCategoryId}`);
                }
            }
    
            return { service: updatedService };
        } catch (error) {
            console.error('Error in updating commission service:', error);
            throw new Error('Service update failed');
        }
    };
    
    

    static deleteCommissionService = async (talentId, commissionServiceId) => {
        // 1. Check talent and service
        const talent = await User.findById(talentId);
        const service = await CommissionService.findById(commissionServiceId);
        
        if (!talent) throw new NotFoundError('Talent not found');
        if (!service) throw new NotFoundError('Service not found');
        if (service.talentId.toString() !== talentId) throw new BadRequestError('You can only delete your service');
        
        // 2. Extract public IDs and delete files from Cloudinary
        const publicIds = service.artworks.map(artwork => extractPublicIdFromUrl(artwork));
        await Promise.all(publicIds.map(publicId => deleteFileByPublicId(publicId)));
    
        // 3. Find the category of the service
        const serviceCategoryId = service.serviceCategoryId;
        
        // 4. Delete the service from the database
        await service.deleteOne();
        
        // 5. Check if the category has other services
        const remainingServices = await CommissionService.find({ serviceCategoryId });
        
        // 6. Delete the category if it's empty
        if (remainingServices.length === 0) {
            await ServiceCategory.findByIdAndDelete(serviceCategoryId);
        }
    
        return { message: 'Service and possibly empty category deleted successfully' };
    };
    
}

export default CommissionServiceService
