import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import './Congratulation.scss';

export default function Congratulation({ onClose }) {
    const [fadeOut, setFadeOut] = useState(false);
    const [confettiDuration, setConfettiDuration] = useState(5000); // Duration in milliseconds

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true); // Start fade-out effect
        }, confettiDuration - 1200); // Trigger fade-out 2 seconds before confetti ends

        return () => clearTimeout(timer);
    }, [confettiDuration]);

    return (
        <div className={`congratulation ${fadeOut ? 'fade-out' : ''}`}>
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                numberOfPieces={200}
                gravity={0.1}
                initialVelocityX={7}
                initialVelocityY={10}
                drawShape={ctx => {
                    ctx.beginPath();
                    ctx.rect(-10, -5, 20, 10); // Rectangle shape
                    ctx.fill();
                }}
            />
            {/* <div className="congratulation__content">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="congratulation__close" onClick={onClose}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h2>Chúc mừng!</h2>
                <p>Bạn đã đăng kí tài khoản thành công.</p>
                <button onClick={onClose} className="btn btn-primary">Bắt đầu</button>
            </div> */}
        </div>
    );
}