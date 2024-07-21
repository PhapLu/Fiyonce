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