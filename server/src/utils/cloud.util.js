import sharp from 'sharp'
import stream from 'stream'
import { v2 as cloudinary, v2 } from 'cloudinary'

export const compressAndUploadImage = async ({ buffer, originalname, folderName, width, height }) => {
  try {
    //slice the originalname to just 30 first character and the time(for specify each image)
    const slicedOriginalName = originalname.slice(0, 30);
    const currentTime = new Date().toISOString()
    const finalName = slicedOriginalName + "_" + currentTime.trim()
    // Compress the image using sharp with specified width and height
    const compressedBuffer = await sharp(buffer)
      .resize(width, height, { fit: 'inside' }) // Resize to fit within the specified dimensions
      .jpeg({ quality: 80 }) // Compress to JPEG with 80% quality
      .toBuffer()

    // Function to upload image to Cloudinary
    const streamUpload = async (buffer) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
          resource_type: 'image',
          public_id: finalName,
          folder: folderName,
        }, (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        })

        const bufferStream = new stream.PassThrough()
        bufferStream.end(buffer)
        bufferStream.pipe(uploadStream)
      })
    }

    return await streamUpload(compressedBuffer)
  } catch (error) {
    console.error('Error in compressAndUploadImage:', error)
    throw error
  }
}

export const extractPublicIdFromUrl = (url) => {
  const urlObj = new URL(url)
  const pathParts = urlObj.pathname.split('/')
  const versionIndex = pathParts.findIndex(part => part.startsWith('v'))
  const publicIdParts = pathParts.slice(versionIndex + 1).join('/').split('.')
  publicIdParts.pop() // Remove the file extension
  return decodeURIComponent(publicIdParts.join('.'))
}

export const deleteFileByPublicId = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw error
  }
}

// export const generateOptimizedImageUrl = (publicId, transformations = {}) => {
//   const defaultTransformations = {
//     quality: 'auto',
//     fetch_format: 'auto',
//     ...transformations
//   }

//   // Format transformations correctly
//   const transformationString = Object.entries(defaultTransformations)
//     .map(([key, value]) => `${key}_${value}`)
//     .join(',')

//   // Generate the URL
//   const optimizedUrl = cloudinary.url(publicId, { transformation: transformationString })
//   // Debugging log
//   console.log('Generated Optimized URL:', optimizedUrl)

//   return optimizedUrl
// }

export const generateSignedUrl = async (publicId, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const url = cloudinary.url(publicId, {
        sign_url: true,
        secure: true,
        ...options
      });
      resolve(url);
    } catch (error) {
      reject(error);
    }
  });
};

export const generateOptimizedImageUrl = (publicId, transformations = {}) => {
  const defaultTransformations = {
    quality: 'auto',
    fetch_format: 'auto',
    ...transformations
  };

  // Generate the URL with transformations
  const optimizedUrl = cloudinary.url(publicId, { transformation: [defaultTransformations] });

  // Debugging log
  console.log('Generated Optimized URL:', optimizedUrl);

  return optimizedUrl;
};



