// Imports
import { useEffect, useRef, useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

// Utils
import { getCroppedImg } from '../../utils/imageDisplayer';

// Styling
import "./CropImage.scss";

export default function CropImage({ imageSrc, onCropComplete, onCancel, setShowCropImage, setOverlayVisible }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
        console.log(crop)
        console.log(zoom)
        console.log(croppedAreaPixels)
    }, []);

    const handleShowCroppedImage = useCallback(async () => {
        try {
            const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, zoom);
            onCropComplete(croppedFile);
        } catch (e) {
            console.error(e);
        }
    }, [croppedAreaPixels, imageSrc, onCropComplete, zoom]);

    const cropImageRef = useRef();
    useEffect(() => {
        const handler = (e) => {
            if (cropImageRef.current && !cropImageRef.current.contains(e.target)) {
                setShowCropImage(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    return (
        <div className="modal-form type-3 " ref={cropImageRef} onClick={(e) => { e.stopPropagation() }}>
            <h3 className="form__title">Cắt ảnh</h3>
            <div className='crop-aa'>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    onCropChange={setCrop}
                    onCropComplete={handleCropComplete}
                    onZoomChange={setZoom}
                />
            </div>

            <div className="btn-container mt-8">
                <div className="btn-item btn btn-sm btn-4 " onClick={onCancel}>Cancel</div>
                <div className="btn-item btn btn-sm btn-2 ml-8" onClick={handleShowCroppedImage}> Crop</div>
            </div>
        </div>
    );
}
