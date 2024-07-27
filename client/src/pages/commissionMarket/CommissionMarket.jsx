// Imports
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import Masonry from 'react-masonry-css';

// Components
import CreateOrder from "../../components/crudCommissionOrder/create/CreateCommissionOrder.jsx";
import RenderCommissionOrder from "../../components/crudCommissionOrder/render/RenderCommissionOrder.jsx";
import UpdateCommissionOrder from "../../components/crudCommissionOrder/update/UpdateCommissionOrder.jsx";

import RenderProposals from "../../components/crudProposal/render/RenderProposals.jsx";

// Contexts
import { useAuth } from "../../contexts/auth/AuthContext.jsx";
import { useModal } from "../../contexts/modal/ModalContext.jsx";

// Utils
import { limitString, formatTimeAgo, formatCurrency } from "../../utils/formatter.js";
import { resizeImageUrl } from "../../utils/imageDisplayer.js";
import { newRequest } from "../../utils/newRequest.js";

// Styling
import CommissionMarketBg from "../../assets/img/commission-market-bg.png"
import "./CommissionMarket.scss";
import CreateProposal from "../../components/crudProposal/create/CreateProposal.jsx";

export default function CommissionMarket() {
    const breakpointColumnsObj = {
        default: 3,
        1200: 3,
        800: 2,
        600: 1
    };

    const [inputs, setInputs] = useState({});
    const [commissionOrder, setCommissionOrder] = useState();

    const [showCreateComissionOrder, setShowCreateCommissionOrder] = useState(false);
    const [showRenderComissionOrder, setShowRenderCommissionOrder] = useState(false);
    const [showUpdateComissionOrder, setShowUpdateCommissionOrder] = useState(false);
    const [showDeleteComissionOrder, setShowDeleteCommissionOrder] = useState(false);

    const [showCreateProposal, setShowCreateProposal] = useState(false);
    const [showRenderProposals, setShowRenderProposals] = useState(false);

    const { userInfo } = useAuth();
    const { setModalInfo } = useModal();

    const fetchIndirectOrders = async (params) => {
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await newRequest.get(`/order/readOrders?${queryString}`);
            console.log(response)
            return response.data.metadata.orders;
        } catch (error) {
            return null;
        }
    }

    const queryParameters = { isDirect: false, sortBy: 'createdAt', sortOrder: 'desc' };
    const { data: indirectOrders, error, isError, isLoading } = useQuery(
        ['fetchIndirectOrders', queryParameters],
        () => fetchIndirectOrders(queryParameters),
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching service by ID:', error);
            },
        }
    );

    const [filteredOrders, setFilteredOrders] = useState([]);
    const [overlayVisible, setOverlayVisible] = useState(false);

    useEffect(() => {
        if (indirectOrders) {
            const filtered = indirectOrders.filter(order => {
                const matchesKeyword = inputs.fullName
                    ? (order.description.toLowerCase().includes(inputs.fullName.toLowerCase()) ||
                        order.memberId.fullName.toLowerCase().includes(inputs.fullName.toLowerCase()))
                    : true;
                const matchesStatus = inputs.status && inputs.status !== '*'
                    ? order.status === inputs.status
                    : true;
                const matchesMinPrice = inputs.minPrice
                    ? order.minPrice >= parseFloat(inputs.minPrice)
                    : true;
                const matchesMaxPrice = inputs.maxPrice
                    ? order.maxPrice <= parseFloat(inputs.maxPrice)
                    : true;
                return matchesKeyword && matchesStatus && matchesMinPrice && matchesMaxPrice;
            });
            setFilteredOrders(filtered);
        }
    }, [inputs, indirectOrders]);

    const handleOpenCreateCommissionOrder = () => {
        if (userInfo) {
            setShowCreateCommissionOrder(true); setOverlayVisible(true)
        } else {
            setModalInfo({
                status: "warning",
                message: "Vui lòng đăng nhập trước khi đăng yêu cầu"
            })
        }
    }

    const handleChange = (event) => {
        const { id, value } = event.target;
        setInputs((prevInputs) => ({
            ...prevInputs,
            [id]: value,
        }));
    };

    return (
        <>
            <div className="commission-market page">
                <section className="commission-market__header">
                    <div className="commission-market__header--left">
                        <h1 className="page__title">Chợ commission</h1>
                        <br />
                        <hr />
                        <h3>Fiyonce ở đây để kết nối ý tưởng của các bạn với hơn <span className="highlight-text">10.000+</span> họa sĩ tài năng trên cả nước, hỗ trợ thanh toán an toàn và vận chuyển thuận lợi, đảm bảo lợi ích giữa khách hàng và họa sĩ.</h3>
                        <p>
                            <span>#digital art</span>
                            <span>#digital art</span>
                            <span>#digital art</span>
                            <span>#digital art</span>
                        </p>
                        <br />
                        <button className="btn btn-2 btn-lg" onClick={handleOpenCreateCommissionOrder}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#726FFF" className="size-6">
                                <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
                            </svg>
                            Đăng yêu cầu</button>
                    </div>
                    <div className="commission-market__header--right">
                        <img src={CommissionMarketBg} alt="" className="commission-market__bg" />
                    </div>
                </section>

                <section className="commission-market__collation search">
                    <div className="form collation-form">
                        <div className="collation-form__section">
                            <strong>Tìm kiếm</strong>
                            <div className="form-field with-ic w-unset">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 navbar__search-field__ic ml-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                <input
                                    type="text"
                                    id="fullName"
                                    value={inputs.fullName || ""}
                                    onChange={handleChange}
                                    className="form-field__input"
                                    placeholder="Nhập từ khóa"
                                />
                            </div>
                        </div>

                        <div className="collation-form__section filter">
                            <strong>Trạng thái</strong>
                            <div className="form-field w-unset">
                                <select
                                    id="status"
                                    value={inputs.status || "*"}
                                    onChange={handleChange}
                                    className="form-field__input"
                                >
                                    <option value="*" >Tất cả trạng thái</option>
                                    <option value="pending">Đang đợi họa sĩ ứng</option>
                                    <option value="confirmed">Đã chọn họa sĩ và thanh toán</option>
                                </select>
                            </div>

                        </div>

                        <div className="collation-form__section sort">
                            <strong>Khoảng giá</strong>
                            <div className="form-field w-unset">
                                <input type="text" id="minPrice"
                                    value={inputs?.minPrice || ""}
                                    onChange={handleChange}
                                    placeholder="Nhập giá tối thiểu"
                                    className="form-field__input" />
                            </div>
                            -
                            <div className="form-field w-unset">
                                <input type="text" id="maxPrice"
                                    value={inputs?.maxPrice || ""}
                                    onChange={handleChange}
                                    placeholder="Nhập giá tối đa"
                                    className="form-field__input" />
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    {filteredOrders?.length > 0 ? (
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid commission-market-container"
                            columnClassName="my-masonry-grid_column"
                        >
                            {filteredOrders.map((indirectOrder) => {
                                return (
                                    <div className="commission-market-item" key={indirectOrder._id} onClick={() => {
                                        setCommissionOrder(indirectOrder);
                                        setShowRenderCommissionOrder(true);
                                        setOverlayVisible(true);
                                    }}>
                                        <div className="commission-market-item__header">
                                            <div className="mb-8">
                                                {indirectOrder?.status == "approved" ? (
                                                    <span className="status approved">
                                                        <span> &nbsp;Đã chọn họa sĩ</span>
                                                    </span>
                                                ) : indirectOrder?.status == "confirmed" ? (
                                                    <span className="status approved">
                                                        <span> &nbsp;Đã chọn họa sĩ và thanh toán</span>
                                                    </span>
                                                ) : indirectOrder?.talentsApprovedCount > 0 && (
                                                    <span className="status pending">
                                                        <span className="highlight-text">&nbsp;{indirectOrder.talentsApprovedCount} họa sĩ đã ứng</span>
                                                    </span>
                                                )}
                                            </div>

                                            <div className="user md">
                                                <div className="user--left">
                                                    <img src={indirectOrder?.memberId?.avatar} alt="" className="user__avatar" />
                                                    <div className="user__name">
                                                        <div className="user__name__title">{indirectOrder.memberId.fullName}</div>
                                                        <div className="user__name__subtitle fs-13 mt-4">
                                                            {formatTimeAgo(indirectOrder.createdAt)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="commission-market-item__content">
                                            <div className="mt-16">
                                                <span className="highlight-text fs-16">đ{formatCurrency(indirectOrder.minPrice)}</span> - <span className="highlight-text">đ{formatCurrency(indirectOrder.maxPrice)}</span>
                                            </div>
                                            <div className="mt-8 mb-16">
                                                <span >{limitString(indirectOrder.description, 330)}</span>
                                            </div>
                                        </div>

                                        <div className="reference-container">
                                            {indirectOrder?.references.slice(0, 3).map((reference, index) => {
                                                if (index === 2 && indirectOrder?.references?.length > 3) {
                                                    return (
                                                        <div key={index} className="reference-item">
                                                            <img src={resizeImageUrl(reference, 250)} alt="" /> {/* Use resizeImageUrl here */}
                                                            <div className="reference-item__overlay">
                                                                +{indirectOrder?.references?.length - 3}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return (
                                                    <div className="reference-item" key={index}>
                                                        <img src={resizeImageUrl(reference, 250)} alt="" />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </Masonry>
                    ) : (
                        <div>
                            <h3 className="text-align-center w-100 mt-32">Không tìm thấy kết quả ...</h3>
                        </div>
                    )}
                </section>
            </div>
            {/* Modal forms */}
            {overlayVisible &&
                (
                    <div className="overlay">
                        {/* CRUD commission order */}
                        {showCreateComissionOrder && <CreateOrder isDirect={false} setShowCreateCommissionOrder={setShowCreateCommissionOrder} setOverlayVisible={setOverlayVisible} />}
                        {showRenderComissionOrder && <RenderCommissionOrder commissionOrder={commissionOrder} setShowCreateProposal={setShowCreateProposal} setShowRenderCommissionOrder={setShowRenderCommissionOrder} setShowUpdateCommissionOrder={setShowUpdateCommissionOrder} setShowRenderProposals={setShowRenderProposals} setOverlayVisible={setOverlayVisible} />}
                        {showUpdateComissionOrder && <UpdateCommissionOrder commissionOrder={commissionOrder} setShowUpdateCommissionOrder={setShowUpdateCommissionOrder} setOverlayVisible={setOverlayVisible} />}
                        {showCreateProposal && <CreateProposal commissionOrder={commissionOrder} setShowCreateProposal={setShowCreateProposal} setOverlayVisible={setOverlayVisible} />}
                        {showRenderProposals && <RenderProposals commissionOrder={commissionOrder} setShowRenderProposals={setShowRenderProposals} setOverlayVisible={setOverlayVisible} />}
                    </div>
                )
            }
        </>
    )
}