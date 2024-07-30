import cloudinary from "../configs/cloudinary..config.js";
import { User } from "../models/user.model.js";
import { AuthFailureError, BadRequestError } from "../core/error.response.js";
import {
    compressAndUploadImage,
    extractPublicIdFromUrl,
    deleteFileByPublicId,
    generateOptimizedImageUrl,
} from "../utils/cloud.util.js";
//1.upload Image from URL
const uploadImageFromURL = async () => {
    try {
        const urlImage = "https://www.example.com/image.jpg";
        const folderName = "product/userId",
            newFileName = "testDemo";
        const result = await cloudinary.uploader.upload(urlImage, {
            public_id: newFileName,
            folder: folderName,
        });
        return result;
    } catch (error) {
        console.error(error);
        throw new BadRequestError("Error uploading image");
    }
};

//2.upload image from local
const uploadAvatarOrCover = async (
    { buffer, originalname },
    userId,
    profileId,
    type
) => {
    // 1. Check user, profileId, type is valid
    const user = await User.findById(userId);
    if (!user) throw new BadRequestError("User not found");
    if (!profileId) throw new BadRequestError("ProfileId missing");
    if (user._id.toString() !== profileId)
        throw new AuthFailureError(
            "You can only set avatar/cover for your profile"
        );
    if (type !== "avatar" && type !== "bg")
        throw new BadRequestError("Invalid type of update");

    let updatedUser;
    let imagePublicId;
    let dimensions;

    try {
        // 2. Delete the old image in Cloudinary
        if (type == "avatar") {
            // Do not delete the default image
            if (!user.avatar.includes("pastal_system_default_avatar")) {
                imagePublicId = extractPublicIdFromUrl(user.avatar);
                await deleteFileByPublicId(imagePublicId);
            }
            dimensions = { width: 256, height: 256 };
        } else if (type == "bg") {
            // Do not delete the default image
            if (!user.bg.includes("pastal_system_default_background")) {
                imagePublicId = extractPublicIdFromUrl(user.bg);
                await deleteFileByPublicId(imagePublicId);
            }
            dimensions = { width: 1920, height: 1080 };
        } else {
            throw new BadRequestError("Invalid type");
        }

        // 3. Compress and upload the new image
        const result = await compressAndUploadImage({
            buffer: buffer,
            originalname: originalname,
            folderName: `fiyonce/profile/avatarOrCover/${profileId}`,
            ...dimensions,
        });

        // 4. Update the user with the new image
        // const updateField = type === 'avatar' ? { avatar: result.secure_url } : { bg: result.secure_url }
        // updatedUser = await User.findByIdAndUpdate(profileId, { $set: updateField }, { new: true })
        if (type === "avatar") {
            updatedUser = await User.findByIdAndUpdate(
                profileId,
                { $set: { avatar: result.secure_url } },
                { new: true }
            );
        } else {
            updatedUser = await User.findByIdAndUpdate(
                profileId,
                { $set: { bg: result.secure_url } },
                { new: true }
            );
        }

        return {
            type: type,
            image_url: result.secure_url,
            profileId: profileId,
        };
    } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Error uploading image");
    }
};

//3.upload images from local
const uploadImagesFromLocal = async ({
    files,
    folderName = "product/2404",
}) => {
    try {
        if (!files || !files.length) return;
        const uploadURLs = [];
        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: folderName,
            });
            uploadURLs.push({
                image_url: result.secure_url,
                shopId: 2404,
                thumb_url: await cloudinary.url(result.public_id, {
                    height: 100,
                    width: 100,
                    format: "jpg",
                }),
            });
        }
        return uploadURLs;
    } catch (error) {
        console.error("Error uploading image::", error);
        throw new BadRequestError("Error uploading image");
    }
};

export { uploadImageFromURL, uploadAvatarOrCover, uploadImagesFromLocal };
