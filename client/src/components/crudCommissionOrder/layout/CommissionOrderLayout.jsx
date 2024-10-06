// Imports
import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate, Outlet } from "react-router-dom";
import { useQuery } from "react-query";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { apiUtils } from "../../../utils/newRequest";

export default function CommissionOrderLayout() {
    const { "commission-order-id": commissionOrderId } = useParams();

    const fetchCommissionOrder = async () => {
        try {
            const response = await apiUtils.get(`/order/readOrder/${commissionOrderId}`);
            return response.data.metadata.order;
        } catch (error) {
            return null;
        }
    }

    const { data: commissionOrder, error, isError, isLoading } = useQuery(
        ['fetchCommissionOrder'],
        () => fetchCommissionOrder(),
        {
            onSuccess: (data) => {
                // console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching commissionOrders by Order ID:', error);
            },
        }
    );

    if (isError) {
        return <div>{error}</div>
    }

    if (isLoading) {
        return <div className="loading-spinner"></div>
    }

    return (
        <div className="commission-order-layout">
            <Outlet context={commissionOrder} />
        </div>
    )
}