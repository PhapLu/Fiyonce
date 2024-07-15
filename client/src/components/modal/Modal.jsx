import { useState, useEffect, useRef } from "react";
import "./Modal.scss";

export default function Modal({ modalInfo }) {
    const [visible, setVisible] = useState(true);
    const [hovered, setHovered] = useState(false);
    const timerRef = useRef(null);
    const startTimeRef = useRef(Date.now());
    const remainingTimeRef = useRef(4000);
    const loadingLineRef = useRef(null);

    useEffect(() => {
        setVisible(true);
        remainingTimeRef.current = 4000; // Reset the remaining time
        startTimeRef.current = Date.now(); // Reset the start time
        setHovered(false); // Reset hover state

        const startTimer = () => {
            timerRef.current = setTimeout(() => {
                setVisible(false);
            }, remainingTimeRef.current);
        };

        if (!hovered) {
            startTimer();
            if (loadingLineRef.current) {
                loadingLineRef.current.style.animationDuration = `${remainingTimeRef.current / 1000}s`;
                loadingLineRef.current.style.animationPlayState = 'running';
            }
        }

        return () => clearTimeout(timerRef.current); // Cleanup timer on component unmount
    }, [modalInfo]); // Add modalInfo as a dependency

    const handleMouseEnter = () => {
        setHovered(true);
        clearTimeout(timerRef.current);

        const elapsedTime = Date.now() - startTimeRef.current;
        remainingTimeRef.current -= elapsedTime;
        if (loadingLineRef.current) {
            loadingLineRef.current.style.animationPlayState = 'paused';
        }
    };

    const handleMouseLeave = () => {
        setHovered(false);

        startTimeRef.current = Date.now();
        timerRef.current = setTimeout(() => {
            setVisible(false);
        }, remainingTimeRef.current);
        if (loadingLineRef.current) {
            loadingLineRef.current.style.animationDuration = `${remainingTimeRef.current / 1000}s`;
            loadingLineRef.current.style.animationPlayState = 'running';
        }
    };

    if (!visible) return null;
    if (!modalInfo) return null;
    return (
        <div
            className={`modal-form type-4 ${modalInfo?.status} ${hovered ? 'paused' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {modalInfo?.status === "success" && (
                <div className="modal-form__status-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 icon-only">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
            )}
            {
                modalInfo?.status === "error" && (
                    <div className="modal-form__status-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 icon-only">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                )
            }
            {
                modalInfo?.status === "warning" && (
                    <div className="modal-form__status-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 icon-only">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                    </div>
                )
            }
            {
                modalInfo?.status === "info" && (
                    <div className="modal-form__status-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 icon-only">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                    </div>
                )
            }
            <p className="modal-form__content">
                <strong>
                    {modalInfo?.status === "success" && "Thành công"}
                    {modalInfo?.status === "error" && "Thất bại"}
                    {modalInfo?.status === "warning" && "Cảnh báo"}
                    {modalInfo?.status === "info" && "Thông tin"}
                </strong>
                <br />
                {modalInfo?.message}
            </p>
            <div className="modal-form__loading-line" ref={loadingLineRef}></div>
        </div>
    );
}