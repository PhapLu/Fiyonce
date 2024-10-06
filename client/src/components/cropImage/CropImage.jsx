// Imports
import { useState, useEffect, useRef } from "react";
import Cropper from "react-easy-crop";

// Styling
import "./CropImage.scss"

function CropImage({ image, onCropDone, onCropCancel, ratio }) {
    // Define state variables
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const [croppedArea, setCroppedArea] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(ratio || (1 / 1));

    const cropImageRef = useRef();

    // Callback when cropping is completed
    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        // Store the cropped area in pixels
        setCroppedArea(croppedAreaPixels);
    };

    // Callback when the user changes the aspect ratio
    const onAspectRatioChange = (event) => {
        setAspectRatio(event.target.value);
    };

    // Close modal when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cropImageRef.current && !cropImageRef.current.contains(event.target)) {
                onCropCancel(); // Trigger onCropCancel if click is outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [cropImageRef]);

    return (
        <div className="cropper modal-form type-3" ref={cropImageRef}>
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