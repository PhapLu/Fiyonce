import { useState, useEffect, useRef } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import ProfileCommissionServices from "../profileCommissionServices/ProfileCommissionServices";
import OrderHistory from "../../components/orderHistory/OrderHistory";

export default function MyProfile() {
    const { profileInfo } = useOutletContext();

    // useEffect(() => {
    //     if (profileInfo.role !== "talent") {
    //         navigate(`/users/${userId}/order-history`);
    //     }
    // }, [profileInfo, userId, navigate]);
    // const navigate = useNavigate();

    return (
        <>
            {profileInfo?.role === "talent" ? (
                <ProfileCommissionServices />
            ) : (
                <OrderHistory />
            )}
        </>
    )
}