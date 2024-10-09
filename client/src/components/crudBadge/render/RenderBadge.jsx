// // Imports
// import { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import { useQuery } from "react-query";

// // Styling
// import "./RenderBadge.scss"
// import { resizeImageUrl } from "../../../utils/imageDisplayer";
// import { limitString } from "../../../utils/formatter";

// export default function RenderBadge({ selectedBadge, setSelectedBadge, setOverlayVisible }) {
//     // Toggle display overlay box
//     const renderBadgeRef = useRef();
//     useEffect(() => {
//         let handler = (e) => {
//             if (renderBadgeRef && renderBadgeRef.current && !renderBadgeRef.current.contains(e.target)) {
//                 setSelectedBadge(null);
//                 setOverlayVisible(false);
//             }
//         };
//         document.addEventListener("mousedown", handler);
//         return () => {
//             document.removeEventListener("mousedown", handler);
//         };
//     }, [setSelectedBadge, setOverlayVisible]);

//     return (
//         <div className="modal-form type-3 render-badges" ref={renderBadgeRef}>
//             <h2 className="form__title">Huy hiệu</h2>
//             <svg onClick={() => { setSelectedBadge(null); setOverlayVisible(false) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 form__close-ic">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
//             </svg>

//             <div className={` ${selectedBadge?.isComplete ? "active" : " "}`}>
//                 <img className="badge-item__thumbnail" src={selectedBadge.thumbnail} alt="" />

//                 <div>
//                     <strong className="fw-bold fs-16">{selectedBadge?.title}</strong>
//                     <br />
//                     <span className="mt-8 text-align-justify">{limitString(selectedBadge?.description, 50)}</span>
//                 </div>
//             </div>
//         </div >
//     )
// }