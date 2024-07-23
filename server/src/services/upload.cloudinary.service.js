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
    if (!user) throw new BadRequestError("Bạn cần đăng nhập để thực hiện thao tác nàyd");
    if (!profileId) throw new BadRequestError("Hãy cung cấp đầy đủ thông tin");
    if (user._id.toString() !== profileId)
        throw new AuthFailureError("Bạn chỉ có thể thay đổi avatar hoặc background của bản thân");
    if (type !== "avatar" && type !== "bg")
        throw new BadRequestError("Thay đổi ảnh đại diện hoặc background không thành công");

    let updatedUser;
    let imagePublicId;
    let dimensions;

    try {
        // 2. Compress and upload the new image
        const result = await compressAndUploadImage({
            buffer: buffer,
            originalname: originalname,
            folderName: `fiyonce/profile/avatarOrCover/${profileId}`,
            ...dimensions,
        });

        // 3. Update the user with the new image
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

        // 4. Delete the old image in Cloudinary
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
            dimensions = { width: 1550, height: 285 };
        } else {
            throw new BadRequestError("Thay đổi ảnh đại diện hoặc background không thành công");
        }

        return {
            type: type,
            image_url: result.secure_url,
            profileId: profileId,
        };
    } catch (error) {
        console.error("Error uploading image:", error);
        throw new BadRequestError("Thay đổi ảnh đại diện hoặc background không thành công");
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
    }
};

export { uploadImageFromURL, uploadAvatarOrCover, uploadImagesFromLocal };
