export function resizeImageUrl(imageUrl, width) {
    if (!imageUrl) return;
    // Check if the imageUrl already has 'upload' in the path
    const uploadIndex = imageUrl.indexOf('/upload/');
    if (uploadIndex !== -1) {
        // Insert the width parameter after 'upload'
        const transformedUrl = imageUrl.slice(0, uploadIndex + 8) + `w_${width}/` + imageUrl.slice(uploadIndex + 8);
        return transformedUrl;
    } else {
        // If 'upload' is not found, handle accordingly (not typical for Cloudinary URLs)
        return imageUrl; // Or handle error case
    }
}

export async function createImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });
}

export async function getCroppedImg(imageSrc, pixelCrop, zoom) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const scaledCrop = {
        x: pixelCrop.x * scaleX / zoom,
        y: pixelCrop.y * scaleY / zoom,
        width: pixelCrop.width * scaleX / zoom,
        height: pixelCrop.height * scaleY / zoom,
    };

    canvas.width = scaledCrop.width;
    canvas.height = scaledCrop.height;

    console.log("WIDTH", canvas.width)
    console.log("HEIGHT", canvas.height)

    ctx.drawImage(
        image,
        scaledCrop.x,
        scaledCrop.y,
        scaledCrop.width,
        scaledCrop.height,
        0,
        0,
        scaledCrop.width,
        scaledCrop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' }));
            } else {
                reject(new Error('Canvas is empty'));
            }
        }, 'image/jpeg');
    });
}