// Imports
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams, useLocation, useOutletContext } from "react-router-dom";
import { useQuery } from "react-query";

// Contexts
import { useModal } from "../../../contexts/modal/ModalContext";

// Utils
import { formatCurrency, formatDate, formatTimeAgo, limitString } from "../../../utils/formatter";
import { apiUtils, newRequest } from "../../../utils/newRequest";

// Styling
import "./RejectResponse.scss"
import { useAuth } from "../../../contexts/auth/AuthContext";

export default function RejectResponse() {
    const commissionOrder = useOutletContext();

    const navigate = useNavigate();
    const location = useLocation();
    const { "commission-order-id": commissionOrderId } = useParams();

    const { setModalInfo } = useModal();
    const { userInfo } = useAuth();
    const [isProcedureVisible, setIsProcedureVisible] = useState(true);

    const fetchOrderRejectResponse = async () => {
        try {
            const response = await apiUtils.get(`/order/readRejectResponse/${commissionOrderId}`);
            console.log(response)
            return response.data.metadata.rejectResponse;
        } catch (error) {
            return null;
        }
    }

    const { data: rejectResponse, fetchingOrderRejectResponseError, isFetchingOrderRejectResponseError, isFetchingOrderRejectResponseLoading } = useQuery(
        ['fetchOrderRejectResponse'],
        () => fetchOrderRejectResponse(),
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching reject response by Order ID:', error);
            },
        }
    );

    const closeRejectResponseView = () => {
        if (location.pathname.includes("commission-market")) {
            navigate("/commission-market");
        } else {
            navigate("/order-history");
        }
        // navigate(commissionOrder?.isDirect ? `/order-history` : `/commission-market`);
    }

    const renderOrderRejectResponseRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (renderOrderRejectResponseRef && renderOrderRejectResponseRef.current && !renderOrderRejectResponseRef.current.contains(e.target)) {
                closeRejectResponseView();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [navigate]);


    if (isFetchingOrderRejectResponseError) {
        return fetchingCommissionOrderError;
    }

    if (isFetchingOrderRejectResponseLoading) {
        return <div className="loading-spinner" />;
    }

    const isOrderOwnerAsMember = userInfo?._id === commissionOrder?.memberId?._id;

    return (
        <div className="overlay">
            <div className="reject-response modal-form type-3" ref={renderOrderRejectResponseRef} onClick={(e) => { e.stopPropagation() }}>
                <h2 className="form__title">Lí do từ chối</h2>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                    closeRejectResponseView();
                }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>

                <p>{rejectResponse?.rejectMessage}</p>
            </div >
        </div >
    )
}