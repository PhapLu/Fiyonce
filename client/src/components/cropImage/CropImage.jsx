// // Imports
// import { useEffect, useRef, useState, useCallback } from 'react';
// import Cropper from 'react-easy-crop';

// // Utils
// import { getCroppedImg } from '../../utils/imageDisplayer';

// // Styling
// import "./CropImage.scss";

// export default function CropImage({ imageSrc, onCropComplete, onCancel, setShowCropImage, setOverlayVisible }) {
//     const [crop, setCrop] = useState({ x: 0, y: 0 });
//     const [zoom, setZoom] = useState(1);
//     const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

//     const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//         setCroppedAreaPixels(croppedAreaPixels);
//         console.log(crop)
//         console.log(zoom)
//         console.log(croppedAreaPixels)
//     }, []);

//     const handleShowCroppedImage = useCallback(async () => {
//         try {
//             const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, zoom);
//             onCropComplete(croppedFile);
//         } catch (e) {
//             console.error(e);
//         }
//     }, [croppedAreaPixels, imageSrc, onCropComplete, zoom]);

//     const cropImageRef = useRef();
//     useEffect(() => {
//         const handler = (e) => {
//             if (cropImageRef.current && !cropImageRef.current.contains(e.target)) {
//                 setShowCropImage(false);
//                 setOverlayVisible(false);
//             }
//         };
//         document.addEventListener("mousedown", handler);
//         return () => {
//             document.removeEventListener("mousedown", handler);
//         };
//     }, []);

//     return (
//         <div className="modal-form type-3 " ref={cropImageRef} onClick={(e) => { e.stopPropagation() }}>
//             <h3 className="form__title">Cắt ảnh</h3>
//             <div className='crop-aa'>
//                 <Cropper
//                     image={imageSrc}
//                     crop={crop}
//                     zoom={zoom}
//                     onCropChange={setCrop}
//                     onCropComplete={handleCropComplete}
//                     onZoomChange={setZoom}
//                 />
//             </div>

//             <div className="btn-container mt-8">
//                 <div className="btn-item btn btn-sm btn-4 " onClick={onCancel}>Cancel</div>
//                 <div className="btn-item btn btn-sm btn-2 ml-8" onClick={handleShowCroppedImage}> Crop</div>
//             </div>
//         </div>
//     );
// }


import React, { useState } from "react";
import Cropper from "react-easy-crop";
import "./CropImage.scss"

function CropImage({ image, onCropDone, onCropCancel, ratio}) {
    // Define state variables
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const [croppedArea, setCroppedArea] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(ratio || (1 / 1));

    // Callback when cropping is completed
    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        // Store the cropped area in pixels
        setCroppedArea(croppedAreaPixels);
    };

    // Callback when the user changes the aspect ratio
    const onAspectRatioChange = (event) => {
        setAspectRatio(event.target.value);
    };

    return (
        <div className="cropper modal-form type-3">
            <h2 className="form__title">Cắt ảnh</h2>
            <div className="mb-32" style={{ "width": "100%", "height": "400px", "position": "relative", "border-radius": "12px", "overflow": "hidden" }}>

                {/* Image Cropper component */}
                <Cropper
                    image={image}
                    aspect={aspectRatio}
                    crop={crop}
                    zoom={zoom}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>

            <div className="mt-16 form__submit-btn-container">
                <button className="form__submit-btn-item btn btn-md btn-4 mr-16" onClick={onCropCancel}>Hủy</button>
                <button className="form__submit-btn-item btn btn-md btn-2" onClick={() => {
                    onCropDone(croppedArea);
                }}>Xác nhận</button>

            </div>

        </div>
    );
}

export default CropImage;