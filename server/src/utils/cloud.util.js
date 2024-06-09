import sharp from 'sharp';
import stream from 'stream';
import { v2 as cloudinary } from 'cloudinary';

export const compressAndUploadImage = async ({ buffer, originalname, folderName }) => {
    try {
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
            public_id: originalname,
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
  
      return await streamUpload(compressedBuffer);
    } catch (error) {
      console.error('Error in compressAndUploadImage:', error);
      throw error;
    }
  };

export const extractPublicIdFromUrl = (url) => {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const versionIndex = pathParts.findIndex(part => part.startsWith('v'));
    const publicIdParts = pathParts.slice(versionIndex + 1).join('/').split('.');
    publicIdParts.pop(); // Remove the file extension
    return decodeURIComponent(publicIdParts.join('.'));
  };

export const deleteFileByPublicId = async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      throw error;
    }
  };
