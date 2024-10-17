// // Imports
// import { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "react-query";

// // Contexts
// import { useAuth } from "../../contexts/auth/AuthContext";

// // Components
// import RenderCommissionOrder from "../crudCommissionOrder/render/RenderCommissionOrder";
// import UpdateCommissionOrder from "../crudCommissionOrder/update/UpdateCommissionOrder";
// import ArchiveCommissionOrder from "../crudCommissionOrder/archive/ArchiveCommissionOrder";
// import UnarchiveCommissionOrder from "../crudCommissionOrder/archive/UnarchiveCommissionOrder";

// import RenderProposals from "../crudProposal/render/RenderProposals";
// import CreateProposal from "../crudProposal/create/CreateProposal";
// import RenderProposal from "../crudProposal/render/RenderProposal";

// import RenderCommissionTos from "../crudCommissionTos/render/RenderCommissionTos";

// //Contexts
// import { useModal } from "../../contexts/modal/ModalContext";

// // Utils
// import { apiUtils } from "../../utils/newRequest"
// import { formatCurrency } from "../../utils/formatter";

// // Styling
// import "./OrderHistory.scss";
// import RejectCommissionOrder from "../crudCommissionOrder/reject/RejectCommissionOrder";
// import { ClipLoader } from "react-spinners";

// export default function ArchivedOrderHistory() {
//     const queryClient = useQueryClient();

//     const [showArchiveOrderMoreActions, setShowArchiveOrderMoreActions] = useState();
//     const [commissionOrder, setCommissionOrder] = useState();
//     const [showRenderCommissionOrder, setShowRenderCommissionOrder] = useState();

//     const [showUpdateCommissionOrder, setShowUpdateCommissionOrder] = useState();
//     const [showRenderProposals, setShowRenderProposals] = useState(false);

//     const [showCreateProposal, setShowCreateProposal] = useState(false);
//     const [showRenderProposal, setShowRenderProposal] = useState(false);

//     const [showRejectCommissionOrder, setShowRejectCommissionOrder] = useState(false);

//     const [showArchiveCommissionOrder, setShowArchiveCommissionOrder] = useState(false);
//     const [showUnarchiveCommissionOrder, setShowUnarchiveCommissionOrder] = useState(false);

//     const [overlayVisible, setOverlayVisible] = useState();

//     const moreActionsRef = useRef(null);
//     const archiveOrderBtnRef = useRef(null);
//     const reportOrderBtnRef = useRef(null);

//     const fetchArchivedOrderHistory = async () => {
//         try {
//             const response = await apiUtils.get(`/order/readArchivedOrderHistory`);
//             console.log(response)
//             return response.data.metadata.archivedOrderHistory;
//         } catch (error) {
//             return null;
//         }
//     };

//     const {
//         data: orders,
//         error: fetchingArchivedOrderHistoryError,
//         isError: isFetchingArchivedOrderHistoryError,
//         isLoading: isFetchingArchivedOrderHistoryLoading,
//         refetch: refetchArchivedOrderHistory,
//     } = useQuery('fetchArchivedOrderHistory', fetchArchivedOrderHistory, {
//     });

//     const unarchiveCommissionOrderMutation = useMutation(
//         async (orderId) => {
//             const response = await apiUtils.patch(`/order/unarchiveOrder/${orderId}`);
//             return response;
//         },
//         {
//             onSuccess: () => {
//                 queryClient.invalidateQueries('fetchTalentOrderHistory');
//                 queryClient.invalidateQueries('fetchArchivedOrderHistory');
//             },
//             onError: (error) => {
//                 return error;
//             },
//         }
//     );

//     const reportCommissionOrderMutation = useMutation(
//         async (orderId) => {
//             const response = await apiUtils.post(`/commissionReport/createCommissionReport/${orderId}`);
//             return response;
//         },
//         {
//             onSuccess: () => {
//                 queryClient.invalidateQueries('fetchTalentOrderHistory');
//             },
//             onError: (error) => {
//                 return error;
//             },
//         }
//     );


//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (
//                 moreActionsRef.current && !moreActionsRef.current.contains(event.target)
//                 && archiveOrderBtnRef.current && !archiveOrderBtnRef.current.contains(event.target)
//                 && reportOrderBtnRef.current && !reportOrderBtnRef.current.contains(event.target)
//                 // && !event.target.closest('.conversation-item')
//             ) {
//                 setShowArchiveOrderMoreActions(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     if (isFetchingArchivedOrderHistoryLoading) {
//         return <>
//             <br /><br /><br /><br />
//             <div className="text-align-center flex-align-center flex-justify-center mt-40">
//                 <ClipLoader className="clip-loader" size={40} loading={true} />
//                 <h3 className="ml-12">
//                     Đang tải
//                 </h3>
//             </div>
//         </>
//     }

//     if (isFetchingArchivedOrderHistoryError) {
//         return <span>Có lỗi xảy ra: {fetchingArchivedOrderHistoryError.message}</span>
//     }

//     return (
//         <>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Trạng thái</th>
//                         <th>Khách hàng</th>
//                         <th>Giá dự kiến</th>
//                         <th>Deadline dự kiến</th>
//                         <th>Thao tác</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {
//                         orders?.length > 0 ? orders.map((order, index) => {
//                             return (
//                                 <tr key={index}>
//                                     <td >
//                                         <span className={`status ${order.status}`}>
//                                             {order.status === "pending" && "Đang đợi bạn xác nhận"}
//                                             {order.status === "approved" && "Đang đợi khách hàng thanh toán"}
//                                             {order.status === "rejected" && "Bạn đã từ chối"}
//                                             {order.status === "confirmed" && "Khách đã thanh toán cọc"}
//                                             {order.status === "canceled" && "Đã hủy"}
//                                             {order.status === "in_progress" && "Đang thực hiện đơn"}
//                                             {order.status === "finished" && "Hoàn tất"}
//                                             {order.status === "under_processing" && "Admin đang xử lí"}
//                                         </span>
//                                     </td>
//                                     <td>{order.memberId.fullName || "-"}</td>
//                                     <td>{`đ${formatCurrency(order.minPrice)}` || `đ${formatCurrency(order.price)}` || "-"}</td>
//                                     <td>{order.deadline || "-"}</td>
//                                     <td className="flex-align-center">
//                                         <>
//                                             {
//                                                 order.status === "pending" &&
//                                                 (
//                                                     <>
//                                                         <button className="btn btn-3">Soạn hợp đồng</button>
//                                                         <button className="btn btn-3">Từ chối</button>
//                                                     </>
//                                                 )
//                                             }
//                                             {order.status === "approved" && (
//                                                 <button className="btn btn-3">Xem hợp đồng</button>
//                                             )}
//                                         </>
//                                         <button className="btn btn-3 icon-only p-4 more-action-btn" ref={moreActionsRef} onClick={(e) => { e.stopPropagation(), setShowArchiveOrderMoreActions(order) }}>
//                                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
//                                             </svg>

//                                             {showArchiveOrderMoreActions === order && (
//                                                 <div className="more-action-container" ref={archiveOrderBtnRef}>
//                                                     <Link to={`/order-history/commission-orders/${order._id}/unarchive`} className="more-action-item flex-align-center gray-bg-hover p-4 br-4">
//                                                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
//                                                         </svg>
//                                                         Xóa khỏi lưu trữ
//                                                     </Link>
//                                                 </div>
//                                             )}
//                                         </button>
//                                     </td>
//                                 </tr>
//                             )
//                         }) : (
//                             <tr className="non-hover">
//                                 <td colSpan={6} className="text-align-center p-8">Mục lưu trữ đơn hàng đang trống.
//                                 </td>
//                             </tr>
//                         )
//                     }
//                 </tbody>
//             </table>
//         </>
//     )
// }

// // Imports
// import { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "react-query";

// // Contexts
// import { useAuth } from "../../contexts/auth/AuthContext";

// // Components
// import RenderCommissionOrder from "../crudCommissionOrder/render/RenderCommissionOrder";
// import UpdateCommissionOrder from "../crudCommissionOrder/update/UpdateCommissionOrder";
// import ArchiveCommissionOrder from "../crudCommissionOrder/archive/ArchiveCommissionOrder";
// import UnarchiveCommissionOrder from "../crudCommissionOrder/archive/UnarchiveCommissionOrder";
// import ReportCommissionOrder from "../crudCommissionOrder/report/ReportCommissionOrder";

// import RenderProposals from "../crudProposal/render/RenderProposals";
// import CreateProposal from "../crudProposal/create/CreateProposal";
// import RenderProposal from "../crudProposal/render/RenderProposal";

// import RenderCommissionTos from "../crudCommissionTos/render/RenderCommissionTos";

// //Contexts
// import { useModal } from "../../contexts/modal/ModalContext";

// // Utils
// import { apiUtils } from "../../utils/newRequest";
// import { formatCurrency } from "../../utils/formatter";

// // Styling
// import "./OrderHistory.scss";
// import { ClipLoader } from "react-spinners";

// export default function ArchivedOrderHistory() {
//     const queryClient = useQueryClient();
//     const navigate = useNavigate();

//     const [commissionOrder, setCommissionOrder] = useState();
//     const [showMemberOrderMoreActions, setShowMemberOrderMoreActions] =
//         useState();
//     const [showRenderCommissionOrder, setShowRenderCommissionOrder] =
//         useState();

//     const [showUpdateCommissionOrder, setShowUpdateCommissionOrder] =
//         useState();

//     const [showCreateProposal, setShowCreateProposal] = useState(false);
//     const [showRenderProposal, setShowRenderProposal] = useState(false);

//     const [showArchiveCommissionOrder, setShowArchiveCommissionOrder] =
//         useState(false);
//     const [showUnarchiveCommissionOrder, setShowUnarchiveCommissionOrder] =
//         useState(false);
//     const [showReportCommissionOrder, setShowReportCommissionOrder] =
//         useState(false);

//     const [showCommissionTosView, setShowCommissionTosView] = useState(false);

//     const [overlayVisible, setOverlayVisible] = useState();

//     const moreActionsRef = useRef(null);
//     const archiveOrderBtnRef = useRef(null);
//     const reportOrderBtnRef = useRef(null);
//     const fetchArchivedOrderHistory = async () => {
//         try {
//             const response = await apiUtils.get(`/order/readArchivedOrderHistory`);
//             console.log(response)
//             console.log(response.data.metadata.archivedOrderHistory);
//             return response.data.metadata.archivedOrderHistory;
//         } catch (error) {
//             return null;
//         }
//     };
//     const {
//         data: orders,
//         error: fetchingArchivedOrderHistoryError,
//         isError: isFetchingArchivedOrderHistoryError,
//         isLoading: isFetchingArchivedOrderHistoryLoading,
//         refetch: refetchArchivedOrderHistory,
//     } = useQuery("fetchArchivedOrderHistory", fetchArchivedOrderHistory, {});

//     const cancelCommissionOrderMutation = useMutation(
//         async ({ orderId, fd }) => {
//             const response = await apiUtils.patch(
//                 `/order/cancelOrder/${orderId}`,
//                 { cancelMessage: fd.get("cancelMessage") }
//             );
//             return response;
//         },
//         {
//             onSuccess: () => {
//                 queryClient.invalidateQueries("fetchArchivedOrderHistory");
//             },
//             onError: (error) => {
//                 return error;
//             },
//         }
//     );

//     const archiveCommissionOrderMutation = useMutation(
//         async (orderId) => {
//             const response = await apiUtils.patch(
//                 `/order/archiveOrder/${orderId}`
//             );
//             return response;
//         },
//         {
//             onSuccess: () => {
//                 queryClient.invalidateQueries("fetchArchivedOrderHistory");
//                 queryClient.invalidateQueries("fetchArchivedOrderHistory");
//             },
//             onError: (error) => {
//                 return error;
//             },
//         }
//     );

//     const reportCommissionOrderMutation = useMutation(
//         async (orderId) => {
//             const response = await apiUtils.post(
//                 `/commissionReport/createCommissionReport/${orderId}`
//             );
//             return response;
//         },
//         {
//             onSuccess: () => {
//                 queryClient.invalidateQueries("fetchArchivedOrderHistory");
//             },
//             onError: (error) => {
//                 return error;
//             },
//         }
//     );

//     const unarchiveCommissionOrderMutation = useMutation(
//         async (orderId) => {
//             const response = await apiUtils.patch(`/order/unarchiveOrder/${orderId}`);
//             return response;
//         },
//         {
//             onSuccess: () => {
//                 queryClient.invalidateQueries("fetchArchivedOrderHistory");
//             },
//             onError: (error) => {
//                 return error;
//             },
//         }
//     );

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (
//                 moreActionsRef.current &&
//                 !moreActionsRef.current.contains(event.target) &&
//                 archiveOrderBtnRef.current &&
//                 !archiveOrderBtnRef.current.contains(event.target) &&
//                 reportOrderBtnRef.current &&
//                 !reportOrderBtnRef.current.contains(event.target)
//                 // && !event.target.closest('.conversation-item')
//             ) {
//                 setShowMemberOrderMoreActions(false);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     if (isFetchingArchivedOrderHistoryLoading) {
//         return <>
//             <br /><br /><br /><br />
//             <div className="text-align-center flex-align-center flex-justify-center mt-40">
//                 <ClipLoader className="clip-loader" size={40} loading={true} />
//                 <h3 className="ml-12">
//                     Đang tải
//                 </h3>
//             </div>
//         </>
//     }

//     if (isFetchingArchivedOrderHistoryError) {
//         return (
//             <span>
//                 Có lỗi xảy ra: {fetchingArchivedOrderHistoryError.message}
//             </span>
//         );
//     }

//     return (
//         <>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Trạng thái</th>
//                         <th>Dịch vụ</th>
//                         <th>Giá dự kiến</th>
//                         <th>Deadline dự kiến</th>
//                         <th>Thao tác</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {orders?.length > 0 ? (
//                         orders?.map((order, index) => {
//                             return (
//                                 <tr key={index} onClick={() => { navigate(`/order-history/commission-orders/${order._id}`) }}>
//                                     <td >
//                                         <div className="status-cell">
//                                             <div className={`status-cell__bg ${order?.status}`}>
//                                             </div>
//                                             <div className="status-cell__title">
//                                                 {order?.status === "pending"
//                                                     ? "Đang đợi họa sĩ xác nhận"
//                                                     : order?.status === "approved"
//                                                         ? "Đang đợi bạn thanh toán"
//                                                         : order?.status === "rejected"
//                                                             ? "Họa sĩ đã từ chối"
//                                                             : order?.status === "confirmed"
//                                                                 ? "Đã thanh toán cọc"
//                                                                 : order?.status === "canceled"
//                                                                     ? "Bạn đã hủy đơn"
//                                                                     : order?.status === "in_progress"
//                                                                         ? "Họa sĩ đang thực hiện"
//                                                                         : order?.status === "finished"
//                                                                             ? "Hoàn tất"
//                                                                             : order?.status === "under_processing"
//                                                                                 ? "Admin đang xử lí"
//                                                                                 : ""}
//                                             </div>
//                                         </div>
//                                     </td>

//                                     {order?.isDirect ? (
//                                         <td>
//                                             {order?.commissionServiceId?.title}
//                                         </td>
//                                     ) : (
//                                         <td>
//                                             {"Đặt hàng trên Chợ Commission"}
//                                         </td>
//                                     )}
//                                     <td className="">
//                                         {`${formatCurrency(
//                                             order?.minPrice
//                                         )} - ${formatCurrency(
//                                             order?.maxPrice
//                                         )} VND`}
//                                     </td>
//                                     <td>{order?.deadline || "-"}</td>
//                                     <td className="flex-align-center">
//                                         <>
//                                             {order?.status === "approved" && (
//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         navigate(`/order-history/commission-orders/${order._id}/proposals`)
//                                                     }}
//                                                     className="btn btn-3"
//                                                 >
//                                                     Xem hợp đồng
//                                                 </button>
//                                             )}
//                                         </>
//                                         <button
//                                             className="btn btn-3 icon-only p-4 more-action-btn"
//                                             ref={moreActionsRef}
//                                             onClick={(e) => {
//                                                 e.stopPropagation(),
//                                                     setShowMemberOrderMoreActions(
//                                                         order
//                                                     );
//                                             }}
//                                         >
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 fill="none"
//                                                 viewBox="0 0 24 24"
//                                                 strokeWidth={1.5}
//                                                 stroke="currentColor"
//                                                 className="size-6"
//                                             >
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
//                                                 />
//                                             </svg>

//                                             {showMemberOrderMoreActions ===
//                                                 order && (
//                                                     <div
//                                                         className="more-action-container"
//                                                         ref={archiveOrderBtnRef}
//                                                     >
//                                                         <div
//                                                             className="more-action-item flex-align-center gray-bg-hover p-4 br-4"
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation(),
//                                                                     setCommissionOrder(
//                                                                         order
//                                                                     ),
//                                                                     setShowArchiveCommissionOrder(
//                                                                         true
//                                                                     );
//                                                                 setOverlayVisible(
//                                                                     true
//                                                                 );
//                                                             }}
//                                                         >
//                                                             <svg
//                                                                 xmlns="http://www.w3.org/2000/svg"
//                                                                 fill="none"
//                                                                 viewBox="0 0 24 24"
//                                                                 strokeWidth={1.5}
//                                                                 stroke="currentColor"
//                                                                 className="size-6"
//                                                             >
//                                                                 <path
//                                                                     strokeLinecap="round"
//                                                                     strokeLinejoin="round"
//                                                                     d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
//                                                                 />
//                                                             </svg>
//                                                             Lưu trữ
//                                                         </div>
//                                                         <hr />
//                                                         <div
//                                                             className="more-action-item flex-align-center gray-bg-hover p-4 br-4"
//                                                             ref={reportOrderBtnRef}
//                                                             onClick={() => {
//                                                                 setCommissionOrder(
//                                                                     order
//                                                                 ),
//                                                                     setShowReportCommissionOrder(
//                                                                         true
//                                                                     );
//                                                                 setOverlayVisible(
//                                                                     true
//                                                                 );
//                                                             }}
//                                                         >
//                                                             <svg
//                                                                 xmlns="http://www.w3.org/2000/svg"
//                                                                 fill="none"
//                                                                 viewBox="0 0 24 24"
//                                                                 strokeWidth={1.5}
//                                                                 stroke="currentColor"
//                                                                 className="size-6 mr-8"
//                                                             >
//                                                                 <path
//                                                                     strokeLinecap="round"
//                                                                     strokeLinejoin="round"
//                                                                     d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
//                                                                 />
//                                                             </svg>
//                                                             Báo cáo
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                         </button>
//                                     </td>
//                                 </tr>
//                             );
//                         })
//                     ) : (
//                         <tr className="non-hover">
//                             <td colSpan={6} className="text-align-center p-8">
//                                 Hiện chưa có đơn hàng nào.
//                                 &nbsp;<Link to="/commission-market">
//                                     <span className="highlight-text">
//                                         Tìm kiếm họa sĩ
//                                     </span>
//                                 </Link>&nbsp;
//                                 trên Chợ Commission nhé!
//                             </td>
//                         </tr>
//                     )}
//                 </tbody>

//             </table >

//             {/* Modal forms */}
//             {
//                 overlayVisible && (
//                     <div className="overlay">
//                         {showRenderCommissionOrder && (
//                             <RenderCommissionOrder
//                                 commissionOrder={commissionOrder}
//                                 setShowRenderCommissionOrder={
//                                     setShowRenderCommissionOrder
//                                 }
//                                 setShowUpdateCommissionOrder={setShowUpdateCommissionOrder}
//                                 setShowRenderProposals={setShowRenderProposals}
//                                 setOverlayVisible={setOverlayVisible}
//                             />
//                         )}
//                         {showUpdateCommissionOrder && (
//                             <UpdateCommissionOrder
//                                 commissionOrder={commissionOrder}
//                                 setShowUpdateCommissionOrder={
//                                     setShowUpdateCommissionOrder
//                                 }
//                                 setOverlayVisible={setOverlayVisible}
//                             />
//                         )}
//                         {showArchiveCommissionOrder && (
//                             <ArchiveCommissionOrder
//                                 commissionOrder={commissionOrder}
//                                 setShowArchiveCommissionOrder={
//                                     setShowArchiveCommissionOrder
//                                 }
//                                 setOverlayVisible={setOverlayVisible}
//                                 archiveCommissionOrderMutation={
//                                     archiveCommissionOrderMutation
//                                 }
//                             />
//                         )}
//                         {showUnarchiveCommissionOrder && (
//                             <UnarchiveCommissionOrder
//                                 commissionOrder={commissionOrder}
//                                 setShowUnarchiveCommissionOrder={
//                                     setShowUnarchiveCommissionOrder
//                                 }
//                                 setOverlayVisible={setOverlayVisible}
//                                 unarchiveCommissionOrderMutation={
//                                     unarchiveCommissionOrderMutation
//                                 }
//                             />
//                         )}
//                         {showReportCommissionOrder && (
//                             <ReportCommissionOrder
//                                 commissionOrder={commissionOrder}
//                                 setShowReportCommissionOrder={
//                                     setShowReportCommissionOrder
//                                 }
//                                 setOverlayVisible={setOverlayVisible}
//                                 reportCommissionOrderMutation={
//                                     reportCommissionOrderMutation
//                                 }
//                             />
//                         )}

//                         {/* {
//                         showRenderProposal && (

//                         )
//                     } */}
//                     </div>
//                 )
//             }
//         </>
//     );
// }



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
import StartWipCommissionOrder from "../crudCommissionOrder/startWip/StartWipCommissionOrder";

import RenderProposals from "../crudProposal/render/RenderProposals";
import CreateProposal from "../crudProposal/create/CreateProposal";
import RenderProposal from "../crudProposal/render/RenderProposal";

import RenderCommissionTos from "../crudCommissionTos/render/RenderCommissionTos";

//Contexts
import { useModal } from "../../contexts/modal/ModalContext";

// Utils
import { apiUtils } from "../../utils/newRequest"
import { formatCurrency, formatDate } from "../../utils/formatter";

// Styling
import "./OrderHistory.scss";
import RejectCommissionOrder from "../crudCommissionOrder/reject/RejectCommissionOrder";
import { resizeImageUrl } from "../../utils/imageDisplayer";
import { ClipLoader } from "react-spinners";

export default function ArchivedOrderHistory() {
    const queryClient = useQueryClient();

    const [showTalentOrderMoreActions, setShowTalentOrderMoreActions] = useState();

    const moreActionsRef = useRef(null);
    const archiveOrderBtnRef = useRef(null);
    const reportOrderBtnRef = useRef(null);

    const fetchArchivedOrderHistory = async () => {
        try {
            const response = await apiUtils.get(`/order/readArchivedOrderHistory`);
            console.log(response.data.metadata.archivedOrderHistory)
            return response.data.metadata.archivedOrderHistory;
        } catch (error) {
            return null;
        }
    };

    const {
        data: orders,
        error: fetchingArchivedOrderHistoryError,
        isError: isFetchingArchivedOrderHistoryError,
        isLoading: isFetchingArchivedOrderHistoryLoading,
        refetch: refetchArchivedOrderHistory,
    } = useQuery('fetchArchivedOrderHistory', fetchArchivedOrderHistory, {
    });

    const rejectCommissionOrderMutation = useMutation(
        async ({ orderId, fd }) => {
            const response = await apiUtils.patch(`/order/rejectOrder/${orderId}`, { rejectMessage: fd.get("rejectMessage") });
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchArchivedOrderHistory');
            },
            onError: (error) => {
                return error;
            },
        }
    );




    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                moreActionsRef.current && !moreActionsRef.current.contains(event.target)
                && archiveOrderBtnRef.current && !archiveOrderBtnRef.current.contains(event.target)
                && reportOrderBtnRef.current && !reportOrderBtnRef.current.contains(event.target)
                // && !event.target.closest('.conversation-item')
            ) {
                setShowTalentOrderMoreActions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (isFetchingArchivedOrderHistoryLoading) {
        return <>
            <br /><br /><br /><br />
            <div className="text-align-center flex-align-center flex-justify-center mt-40">
                <ClipLoader className="clip-loader" size={40} loading={true} />
                <h3 className="ml-12">
                    Đang tải
                </h3>
            </div>
        </>
    }

    if (isFetchingArchivedOrderHistoryError) {
        return <span>Có lỗi xảy ra: {fetchingArchivedOrderHistoryError.message}</span>
    }

    return (
        <div className="member-order-history">
            <table>
                <thead>
                    <tr className="non-hover">
                        <th >
                            <span className="flex-align-center">
                                <span className="hover-display-label top-left flex-align-center hover-cursor" aria-label="Trạng thái đơn hàng" >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                    </svg>
                                </span>
                                Trạng thái
                            </span>
                        </th>
                        <th >
                            <span className="flex-align-center">
                                <span className="hover-display-label top-left flex-align-center hover-cursor" aria-label="Loại dịch vụ mà khách đặt" >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                    </svg>
                                </span>
                                Dịch vụ
                            </span>
                        </th>
                        <th>
                            <span className="flex-align-center">
                                <span className="hover-display-label top-left flex-align-center hover-cursor" aria-label="Thông tin họa sĩ/khách hàng" >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                    </svg>
                                </span>
                                Họa sĩ/ Khách hàng
                            </span>
                        </th>
                        <th>
                            <span className="flex-align-center">
                                <span className="hover-display-label top-left flex-align-center hover-cursor" aria-label="Giá do khách hàng và họa sĩ đề xuất" >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                    </svg>
                                </span>
                                Giá dự kiến
                            </span>
                        </th>
                        <th>
                            <span className="flex-align-center">
                                <span className="hover-display-label top-left flex-align-center hover-cursor" aria-label="Deadline do họa sĩ đề xuất" >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                    </svg>
                                </span>
                                Deadline dự kiến
                            </span>
                        </th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orders?.length > 0 ? orders.map((order, index) => {
                            return (
                                <tr key={index}>
                                    <td >
                                        <div className={`status ${order?.status}`}>
                                            <div className="status__title">
                                                {order?.status === "pending"
                                                    ? "Đang đợi bạn xác nhận"
                                                    : order?.status === "approved"
                                                        ? "Đang đợi khách hàng thanh toán"
                                                        : order?.status === "rejected"
                                                            ? "Bạn đã từ chối"
                                                            : order?.status === "confirmed"
                                                                ? "Khách đã thanh toán cọc"
                                                                : order?.status === "canceled"
                                                                    ? "Đã hủy"
                                                                    : order?.status === "in_progress"
                                                                        ? "Đang thực hiện đơn"
                                                                        : order?.status === "delivered"
                                                                            ? "Đã bàn giao"
                                                                            : order?.status === "finished"
                                                                                ? "Hoàn tất"
                                                                                : order?.status === "under_processing"
                                                                                    ? "Admin đang xử lí"
                                                                                    : ""}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {order?.isDirect ? order?.commissionServiceId?.title : "Đơn hàng trên Chợ Commission"}
                                    </td>
                                    <td>
                                        <span>
                                            <Link to={`/users/${order?.talentChosenId?._id}`} className="user sm hover-cursor-opacity">
                                                <div className="user--left">
                                                    <img src={resizeImageUrl(order?.talentChosenId?.avatar, 50)} alt="" className="user__avatar" />
                                                    <div className="user__name">
                                                        <div className="fs-13">{order?.talentChosenId?.fullName}</div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </span>
                                    </td>
                                    <td>
                                        Khách đề xuất:  {`đ${formatCurrency(order.minPrice)}` || `đ${formatCurrency(order.price)}` || "-"}
                                        <br />
                                        Họa sĩ đề xuất: {order?.proposalId?.price ? `đ${formatCurrency(order?.proposalId?.price)}` : "-"}
                                    </td>
                                    <td>{order.proposalId?.startAt && order.proposalId?.deadline ? formatDate(order.proposalId?.startAt) + " - " + formatDate(order.proposalId?.deadline) : "-"}</td>

                                    <td className="flex-align-center">
                                        <>
                                            {
                                                <Link to={`/order-history/commission-orders/${order._id}`} className="btn btn-3 mr-8">Xem yêu cầu</Link>
                                            }
                                            {order.status === "approved" && (
                                                <Link to={`/order-history/commission-orders/${order?._id}/proposals`} aria-label="Xem hồ sơ họa sĩ đã gửi" className="btn btn-3 mr-8 hover-display-label">Xem hợp đồng</Link>
                                            )}
                                            {order.status === "rejected" && (
                                                <Link to={`/order-history/commission-orders/${order?._id}/reject-response`} aria-label="Xem lí do từ chối" className="btn btn-3 mr-8 hover-display-label">Lí do từ chối</Link>
                                            )}
                                            {order.status === "confirmed" && (
                                                <Link to={`/order-history/commission-orders/${order?._id}/start-wip`} aria-label="Bắt đầu thực hiện đơn hàng" className="btn btn-3 hover-display-label mr-8">Bắt đầu</Link>
                                            )}
                                            {order.status === "in_progress" && (
                                                <>
                                                    <Link to={`/order-history/commission-orders/${order?._id}/render-milestones`} aria-label="Xem tiến độ công việc" className="btn btn-3 hover-display-label mr-8">Xem tiến độ</Link>
                                                </>
                                            )}

                                            {order.status === "delivered" && (
                                                <>
                                                    <Link to={`/order-history/commission-orders/${order?._id}/render-final-delivery`} aria-label="Xem sản phẩm do họa sĩ bàn giao" className="btn btn-3 hover-display-label mr-8">Xem sản phẩm</Link>
                                                    <Link to={`/order-history/commission-orders/${order?._id}/render-reviews`} aria-label="Xem đánh giá" className="btn btn-3 hover-display-label mr-8">Xem đánh giá</Link>
                                                </>
                                            )}
                                        </>
                                        <button className="btn btn-3 icon-only p-4 more-actions-btn" ref={moreActionsRef} onClick={(e) => { e.stopPropagation(), setShowTalentOrderMoreActions(order) }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                            </svg>

                                            {showTalentOrderMoreActions === order && (
                                                <div className="more-actions-container" ref={archiveOrderBtnRef}>
                                                    <Link to={`/order-history/commission-orders/${order?._id}/archive`} className="more-actions-item flex-align-center gray-bg-hover p-4 br-4">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                                        </svg>
                                                        Lưu trữ
                                                    </Link>
                                                    {
                                                        ["confirmed", "in_progress", "finished", "canceled", "under_processing"].includes(order?.status)
                                                        && (
                                                            <>
                                                                <hr />
                                                                <Link to={`/order-history/commission-orders/${order?._id}/report`} className="more-actions-item flex-align-center gray-bg-hover p-4 br-4" ref={reportOrderBtnRef}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-8">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                                    </svg>
                                                                    Báo cáo
                                                                </Link>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            )
                        }) : (
                            <tr className="non-hover">
                                <td colSpan={6} className="text-align-center p-8">Hiện chưa nhận được đơn hàng nào. Tham khảo
                                    &nbsp;<Link><span className="highlight-text underlined-text">cẩm nang họa sĩ</span></Link>&nbsp; để xây dựng hồ sơ tốt hơn.
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}