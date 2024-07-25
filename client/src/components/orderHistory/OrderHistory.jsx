// Imports
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

// Contexts
import { useAuth } from "../../contexts/auth/AuthContext";

// Components
import RenderCommissionOrder from "../crudCommissionOrder/render/RenderCommissionOrder";
import UpdateCommissionOrder from "../crudCommissionOrder/update/UpdateCommissionOrder";
import ArchiveCommissionOrder from "../crudCommissionOrder/archive/ArchiveCommissionOrder";
import UnarchiveCommissionOrder from "../crudCommissionOrder/archive/UnarchiveCommissionOrder";
import ReportCommissionOrder from "../crudCommissionOrder/report/ReportCommissionOrder";

import RenderProposals from "../crudProposal/render/RenderProposals";
import CreateProposal from "../crudProposal/create/CreateProposal";
import RenderProposal from "../crudProposal/render/RenderProposal";

import RenderCommissionTos from "../crudCommissionTos/render/RenderCommissionTos";

import TalentOrderHistory from "./TalentOrderHistory"
import MemberOrderHistory from "./MemberOrderHistory"
import ArchivedOrderHistory from "./ArchivedOrderHistory"

//Contexts
import { useModal } from "../../contexts/modal/ModalContext";

// Utils
import { apiUtils } from "../../utils/newRequest"

// Styling
import "./OrderHistory.scss";
import RejectCommissionOrder from "../crudCommissionOrder/reject/RejectCommissionOrder";

export default function OrderHistory() {
    const { setModalInfo } = useModal();
    const { userInfo } = useAuth();
    const [showCommissionTosView, setShowCommissionTosView] = useState();
    const [overlayVisible, setOverlayVisible] = useState();
    const [orderHistoryType, setOrderHistoryType] = useState(userInfo?.role === "talent" ? "talent" : "member");

    return (
        <>
            <div className="order-history">
                <section className="section">
                    <div className="profile-page__header">
                        <div className="profile-page__header--left">
                            {userInfo.role === "talent" && (
                                <button
                                    className={`btn btn-3 btn-md ${orderHistoryType === "talent" ? "active" : ""}`}
                                    onClick={() => setOrderHistoryType("talent")}
                                >
                                    Đơn khách đặt
                                </button>
                            )}

                            <button
                                className={`btn btn-3 btn-md ${orderHistoryType === "member" ? "active" : ""}`}
                                onClick={() => setOrderHistoryType("member")}
                            >
                                Đơn hàng của tôi
                            </button>
                            <button
                                className={`btn btn-3 btn-md ${orderHistoryType === "archived" ? "active" : ""}`}
                                onClick={() => setOrderHistoryType("archived")}
                            >
                                Mục lưu trữ
                            </button>
                        </div>

                        {
                            userInfo?.role === "talent" && (
                                <div className="profile-page__header--right">
                                    <button className="btn btn-3" onClick={() => { setShowCommissionTosView(true); setOverlayVisible(true) }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
                                        </svg>
                                        Điều khoản
                                    </button>
                                </div>
                            )
                        }
                    </div>

                    {
                        orderHistoryType === "talent" && <TalentOrderHistory />
                    }

                    {
                        orderHistoryType === "member" && <MemberOrderHistory/>
                    }

                    {
                        orderHistoryType === "archived" && <ArchivedOrderHistory/>
                    }
                </section>
            </div>

            {overlayVisible && (
                <div className="overlay">
                    {/* Commission TOS */}
                    {showCommissionTosView &&
                        <RenderCommissionTos
                            setShowCommissionTosView={setShowCommissionTosView}
                            setOverlayVisible={setOverlayVisible}
                        />
                    }
                </div>
            )}
        </>
    )
}