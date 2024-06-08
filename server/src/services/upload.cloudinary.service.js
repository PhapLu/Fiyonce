import cloudinary from "../configs/cloudinary..config.js";
import { AuthFailureError, BadRequestError } from "../core/error.response.js";
import { User } from "../models/user.model.js";
import stream from 'stream'
import {promisify} from 'util'
import { compressAndUploadImage, extractPublicIdFromUrl, deleteFileByPublicId } from "../utils/cloud.util.js";
const pipeline = promisify(stream.pipeline);
//1.upload Image from URL
const uploadImageFromURL = async() => {
    try {
        const urlImage = 'https://www.example.com/image.jpg'
        const folderName = 'product/userId', newFileName = 'testDemo'
        const result = await cloudinary.uploader.upload(urlImage, {
            public_id: newFileName,
            folder: folderName,
        })
        return result
    } catch (error) {
        console.error(error)
    }
}

//2.upload image from local

const uploadAvatarOrCover = async ({
    buffer,
    originalname,
}, userId, profileId, type) => {
    const folderName = `fiyonce/profile/avatarOrCover/${profileId}`
    //1. Check user, profileId, type is valid
    const user = await User.findById(userId);
    if (!user) throw new BadRequestError('User not found');
    if (!profileId) throw new BadRequestError('ProfileId missing');
    if (user._id.toString() !== profileId) throw new AuthFailureError('You can only set avatar/cover for your profile');
    if (type !== 'avatar' && type !== 'cover') throw new BadRequestError('Invalid type');

    let updatedUser
    let imagePublicId

    try {
        //2. Delete the old image in cloudinary
        if(type == 'avatar'){
            imagePublicId = extractPublicIdFromUrl(user.avatar)
            await deleteFileByPublicId(imagePublicId)
        } else if(type == 'cover'){
            imagePublicId = extractPublicIdFromUrl(user.bg)
            await deleteFileByPublicId(imagePublicId)
        } else{
            throw new BadRequestError('Invalid type')
        }

        //3. Compress and upload the new image
        const result = await compressAndUploadImage(buffer, originalname, folderName);

        //4. Update the user with the new image
        if (type === 'avatar') {
            updatedUser = await User.findByIdAndUpdate(profileId,
                { $set: { avatar: result.secure_url } },
                { new: true }
            );
        } else {
            updatedUser = await User.findByIdAndUpdate(profileId,
                { $set: { bg: result.secure_url } },
                { new: true }
            );
        }

        return {
            type: type,
            image_url: result.secure_url,
            profileId: profileId,
            thumb_url: cloudinary.url(result.public_id, {
                height: 1080,
                width: 1920,
                format: 'jpg',
            })
        };
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Error uploading image');
    }
};


//3.upload images from local
const uploadImagesFromLocal = async({
    files,
    folderName = 'product/2404',
}) => {
    try {
        console.log(`files::`, files, folderName)
        if(!files || !files.length) return
        const uploadURLs = []
        for (const file of files){
            const result = await cloudinary.uploader.upload(file.path, {
                folder: folderName,
            })
            uploadURLs.push({
                image_url: result.secure_url,
                shopId: 2404,
                thumb_url: await cloudinary.url(result.public_id, {
                    height: 100,
                    width: 100,
                    format: 'jpg',
                })
            })
        }
        return uploadURLs
    } catch (error) {
        console.error('Error uploading image::', error)
    }
}

export {uploadImageFromURL, uploadAvatarOrCover, uploadImagesFromLocal}

