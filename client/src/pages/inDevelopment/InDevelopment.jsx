import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./InDevelopment.scss";
import "../../assets/scss/buttons.scss";

export default function InDevelopment() {
    const calculateTimeLeft = () => {
        const targetDate = new Date("2024-08-01T00:00:00"); // Replace with your target date
        const now = new Date();
        const difference = targetDate - now;

        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60)
            };
        } else {
            timeLeft = {
                days: 0,
                hours: 0,
                minutes: 0
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 60000); // Update every minute

        return () => clearTimeout(timer);
    }, [timeLeft]);

    return (
        <div className="not-found coming-soon">
            <div className="not-found__content">
                <h2>Dự kiến ra mắt sau</h2>
                <br />
                <br />
                <div className="dot dot-1"></div>
                <div className="dot dot-2"></div>
                <div className="dot dot-3"></div>
                <h2 className="coming-soon__countdown flex-align-center flex-justify-center">
                    <div className="coming-soon__countdown__box">
                        <h4>{String(timeLeft.days).padStart(2, '0')}</h4>
                        <span>ngày</span>
                    </div>
                    <span>:</span>
                    <div className="coming-soon__countdown__box">
                        <h4>{String(timeLeft.hours).padStart(2, '0')}</h4>
                        <span>giờ</span>
                    </div>
                    <span>:</span>
                    <div className="coming-soon__countdown__box">
                        <h4>{String(timeLeft.minutes).padStart(2, '0')}</h4>
                        <span>phút</span>
                    </div>
                </h2>
                <h3>Tính năng này đang được phát triển</h3>
                <Link to="/" className="btn btn-hover color-4">Về trang chủ</Link>
            </div >
        </div >
    );
}