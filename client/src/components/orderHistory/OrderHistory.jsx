// Imports
import { useState, useEffect, useRef } from "react";
import { Link, Outlet } from "react-router-dom";
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
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState();
    const { setModalInfo } = useModal();
    const { userInfo } = useAuth();
    const [showCommissionTosView, setShowCommissionTosView] = useState();
    const [overlayVisible, setOverlayVisible] = useState();
    const [orderHistoryType, setOrderHistoryType] = useState(userInfo?.role === "talent" ? "talent" : "member");

    const handleChange = (event) => {
        const { id, value } = event.target;
        setInputs((prevInputs) => ({
            ...prevInputs,
            [id]: value,
        }));
    };


    return (
        <>
            <div className="order-history">
                <h2 className='flex-align-center flex-justify-center'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6 mr-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
                    Quản lí đơn hàng</h2>
                <div className="sub-nav-container flex-justify-center">
                    {
                        userInfo?.role == "talent" && (
                            <div className={`sub-nav-item btn btn-md br-16 mr-8 ${orderHistoryType === "talent" ? "active" : ""}`} onClick={() => setOrderHistoryType("talent")}>Đơn hàng khách đặt</div>
                        )
                    }
                    <div className={`sub-nav-item btn btn-md br-16 mr-8 ${orderHistoryType === "member" ? "active" : ""}`} onClick={() => setOrderHistoryType("member")}>Đơn hàng của bạn</div>
                    <div className={`sub-nav-item btn btn-md br-16 mr-8 ${orderHistoryType === "archived" ? "active" : ""}`} onClick={() => setOrderHistoryType("archived")}>Mục lưu trữ</div>

                    <div className="btn btn-3 icon-only more-action-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>

                        <div className="more-action-container">
                            <div className="more-action-item gray-bg-hover">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                </svg>

                                Quy trình đặt/nhận commission
                            </div>

                            <div className="more-action-item gray-bg-hover">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Liên kết To-do List
                            </div>
                        </div>
                    </div>

                </div>
                <hr className='mb-32' />

                <section className="section">
                    {/* <div className="profile-page__header">
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
                    </div> */}

                    {
                        orderHistoryType === "talent" &&

                        <>
                            {/* <span className="flex-justify-center flex-align-center mb-32">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size- mr-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                </svg>
                                Ở vai trò họa sĩ, bạn vẫn có thể đặt đơn hàng của các họa sĩ khác.
                            </span> */}
                            <TalentOrderHistory />
                        </>
                    }


                    {orderHistoryType === "member" &&
                        <>
                            <span className="flex-justify-center flex-align-center mb-32">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size- mr-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                </svg>
                                Ở vai trò họa sĩ, bạn vẫn có thể đặt commission của các họa sĩ khác.
                            </span>
                            <MemberOrderHistory />
                        </>
                    }


                    {orderHistoryType === "archived" &&
                        <>
                            <span className="flex-justify-center flex-align-center mb-32">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size- mr-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                </svg>
                                Đưa đơn hàng vào mục lưu trữ nếu bạn không muốn chúng xuất hiện trên các mục quản lí đơn hàng khác.
                            </span>
                            <ArchivedOrderHistory />
                        </>
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
            <Outlet />
        </>
    )
}