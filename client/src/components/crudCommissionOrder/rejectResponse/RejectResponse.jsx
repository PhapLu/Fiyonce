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
import { resizeImageUrl } from "../../../utils/imageDisplayer";


export default function RejectResponse() {
    const commissionOrder = useOutletContext();

    const navigate = useNavigate();
    const location = useLocation();
    const { "commission-order-id": commissionOrderId } = useParams();

    const { setModalInfo } = useModal();
    const { userInfo } = useAuth();
    const [isProcedureVisible, setIsProcedureVisible] = useState(true);

    const closeRejectResponseView = () => {
        navigate("/order-history");
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

    const isOrderOwnerAsMember = userInfo?._id === commissionOrder?.memberId?._id;

    return (
        <div className="overlay">
            <div className="reject-response modal-form type-3" ref={renderOrderRejectResponseRef} onClick={(e) => { e.stopPropagation() }}>
                <h2 className="form__title">Lí do từ chối</h2>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={closeRejectResponseView}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>

                <p className="text-align-justify border-text type-1 mt-20 mb-24">
                    <Link to={`/users/${commissionOrder?.talentChosenId?._id}`} className="user md hover-cursor-opacity w-30">
                        <div className="user--left">
                            <img src={resizeImageUrl(commissionOrder?.talentChosenId?.avatar, 50)} alt="" className="user__avatar" />
                            <div className="user__name">
                                <div className="fs-13">{commissionOrder?.talentChosenId?.fullName}</div>
                                {
                                    commissionOrder?.talentChosenId?.stageName &&
                                    <div className="fs-13">@{commissionOrder?.talentChosenId?.stageName}</div>
                                }
                            </div>
                        </div>
                    </Link>
                    <p className="mt-16">"{commissionOrder?.rejectMessage}"</p>
                </p>
                <button className="btn btn-2 btn-md w-100" onClick={closeRejectResponseView}>Xác nhận</button>
            </div >
        </div >
    )
}