import { BadRequestError } from "../core/error.response.js"
import { SuccessResponse } from "../core/success.response.js"
import { uploadAvatarOrCover, uploadImageFromURL, uploadImagesFromLocal } from "../services/upload.cloudinary.service.js"
//import { uploadImageFromLocalS3 } from "../services/upload.service.js"

class UploadController{
    // uploadImageFromLocalS3 = async(req, res, next) => {
    //     const {file} = req
    //     if(!file){
    //         throw new BadRequestError('File missing')
    //     }
    //     new SuccessResponse({
    //         message: 'Upload image using S3Client successfully!',
    //         metadata: await uploadImageFromLocalS3({file})
    //     }).send(res)
    // }
    uploadFile = async(req, res, next) => {
        new SuccessResponse({
            message: 'Upload file successfully!',
            metadata: await uploadImageFromURL()
        }).send(res)
    }

    uploadAvatarOrCover = async(req, res, next) => {
        const { file } = req;
        if (!file) throw new BadRequestError('File missing');
        
        const { buffer, originalname } = file;
        const uploadResult = await uploadAvatarOrCover({
            buffer,
            originalname,
        }, req.userId, req.params.profileId, req.body.type);
    
        new SuccessResponse({
            message: 'Upload file successfully!',
            metadata: uploadResult
        }).send(res);
    };
    
    uploadImagesFromLocal = async(req, res, next) => {
        const {files} = req
        if(!files.length) throw new BadRequestError('File missing')

        new SuccessResponse({
            message: 'Upload file successfully!',
            metadata: await uploadImagesFromLocal({
                files,
            })
        }).send(res)
    }
}

export default new UploadController()