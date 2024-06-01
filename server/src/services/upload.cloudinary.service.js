import cloudinary from "../configs/cloudinary..config.js";
import { BadRequestError } from "../core/error.response.js";
import { User } from "../models/user.model.js";
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

const uploadAvatarOrCover = async({
    path,
    folderName = 'fiyonce/profile/avatarOrCover',
}, userId, type) => {
    //1.Check if user exists
    const user = await User.findById(userId)
    if(!user) throw new BadRequestError('User not found')
    if(type !== 'avatar' && type !== 'cover') throw new BadRequestError('Invalid type')
    let updatedUser
    //2.Upload image
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id: 'avatarOrCover',
            folder: folderName,
        })
        if(type === 'avatar'){
            updatedUser = await User.findByIdAndUpdate(userId, 
                { $set: {avatar: result.secure_url} },
                { new: true }
            )
        }else{
            updatedUser = await User.findByIdAndUpdate(userId, 
                { $set: {bg: result.secure_url} },
                { new: true }
            )
        }
        return {
            type: type,
            image_url : result.secure_url,
            userId: userId,
            thumb_url: await cloudinary.url(result.public_id, {
                height: 1080,
                width: 1920,
                format: 'jpg',
            })
        }
    } catch (error) {
        console.error('Error uploading image::', error)
    }
}

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

