import sharp from 'sharp';
import stream from 'stream';
import { v2 as cloudinary } from 'cloudinary';

export const compressAndUploadImage = async (buffer, folderName = 'fiyonce/profile/avatarOrCover') => {
    // Compress the image using sharp
    const compressedBuffer = await sharp(buffer)
        .resize(1920, 1080, { fit: 'inside' }) // Resize to fit within 1920x1080
        .jpeg({ quality: 80 }) // Compress to JPEG with 80% quality
        .toBuffer();

    // Function to upload image to Cloudinary
    const streamUpload = async (buffer) => {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                resource_type: 'image',
                public_id: 'avatarOrCover',
                folder: folderName,
            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });

            const bufferStream = new stream.PassThrough();
            bufferStream.end(buffer);
            bufferStream.pipe(uploadStream);
        });
    };

    try {
        const result = await streamUpload(compressedBuffer);
        return result;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Error uploading image');
    }
};
