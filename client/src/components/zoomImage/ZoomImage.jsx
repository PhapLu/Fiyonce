// Styling
import "./ZoomImage.scss";

export default function ZoomImage({ src, setShowZoomImage }) {
    return (
        <div className="zoomed-image-overlay">
            {/* <div className="zoom-image"> */}
            <div className="zoom-image">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 close-ic hover-cursor-opacity" onClick={() => { setShowZoomImage(false) }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                <img src={src} alt="Zoomed" className="zoom-image__img" />
            </div>

            {/* </div> */}
        </div>
    )
}