import { useState, useEffect, useRef } from "react";
import "./Modal.scss";
import Congratulation from "../congratulation/Congratulation";

export default function Modal({ modalInfo }) {
    const [visible, setVisible] = useState(true);
    const [hovered, setHovered] = useState(false);
    const timerRef = useRef(null);
    const startTimeRef = useRef(Date.now());
    const remainingTimeRef = useRef(4000);
    const loadingLineRef = useRef(null);

    useEffect(() => {
        // If modalInfo is not set, return early
        if (!modalInfo) return;

        // Clear any existing timers when modalInfo changes
        clearTimeout(timerRef.current);

        // Reset modal state for new modalInfo
        setVisible(true);
        remainingTimeRef.current = modalInfo?.status === "congrat" ? 5000 : 4000; // Reset the remaining time
        startTimeRef.current = Date.now(); // Reset the start time
        setHovered(false); // Reset hover state

        // Start the timer for the new modal
        const startTimer = () => {
            timerRef.current = setTimeout(() => {
                setVisible(false); // Hide the modal after timeout
            }, remainingTimeRef.current);
        };

        // If the modal is not hovered, start the timer
        if (!hovered) {
            startTimer();
            if (loadingLineRef.current) {
                loadingLineRef.current.style.animationDuration = `${remainingTimeRef.current / 1000}s`;
                loadingLineRef.current.style.animationPlayState = 'running';
            }
        }

        return () => {
            // Cleanup the timer when the component is unmounted or modalInfo changes
            clearTimeout(timerRef.current);
        };
    }, [modalInfo, hovered]); // Add modalInfo and hovered to the dependency array
    // Add hovered to the dependency array

    const handleMouseEnter = () => {
        if (modalInfo?.status !== "congrat") {
            setHovered(true);
            clearTimeout(timerRef.current);

            const elapsedTime = Date.now() - startTimeRef.current;
            remainingTimeRef.current -= elapsedTime;
            if (loadingLineRef.current) {
                loadingLineRef.current.style.animationPlayState = 'paused';
            }
        }
    };

    const handleMouseLeave = () => {
        if (modalInfo?.status !== "congrat") {
            setHovered(false);

            startTimeRef.current = Date.now();
            timerRef.current = setTimeout(() => {
                setVisible(false);
            }, remainingTimeRef.current);
            if (loadingLineRef.current) {
                loadingLineRef.current.style.animationDuration = `${remainingTimeRef.current / 1000}s`;
                loadingLineRef.current.style.animationPlayState = 'running';
            }
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

            {
                modalInfo?.status === "congrat" && (
                    <>
                        <Congratulation />
                        <div className="modal-form__status-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 icon-only">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    </>
                )
            }

            <p className="modal-form__content">
                <strong>
                    {modalInfo?.status === "success" && "Thành công"}
                    {modalInfo?.status === "congrat" && "Chúc mừng"}
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