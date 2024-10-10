import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../../contexts/auth/AuthContext.jsx';
import { useQuery } from "react-query";
import { apiUtils } from '../../utils/newRequest.js';

export default function RenderTalentRequest() {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const closeModal = () => {
        const currentPath = window.location.pathname;
        const newPath = currentPath.replace('/render-talent-request', '');
        navigate(newPath);
    };

    const fetchTalentRequest = async () => {
        try {
            const response = await apiUtils.get(`/talentRequest/readMyTalentRequest`);
            console.log(response.data.metadata.myTalentRequest)
            return response.data.metadata.myTalentRequest;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const {
        data: talentRequest,
        error,
        isError,
        isLoading,
    } = useQuery("fetchTalentRequest", fetchTalentRequest,
        {
            onSuccess: (data) => {
                if (data) {
                    // Assuming you want to navigate to /render-talent-request
                    const currentPath = window.location.pathname;
                    const newPath = currentPath.replace('/upgrade-account', '/render-talent-request');
                    navigate(`${newPath}`);
                }
            },
            onError: (error) => {
                console.error('Error fetching notifications:', error);
            },
        });

    const handleUpgradeAccountAgain = () => {
        const currentPath = window.location.pathname;
        let newPath = currentPath;
        if (talentRequest?.isSupplemented) {
            newPath = currentPath.replace('/render-talent-request', '/supplement-talent-request?is-again=1');
        } else {
            newPath = currentPath.replace('/render-talent-request', '/upgrade-account?is-again=1');
        }

        console.log(newPath)
        navigate(newPath);
    }

    const RenderTalentRequestRef = useRef();
    useEffect(() => {
        const handler = (e) => {
            if (RenderTalentRequestRef.current && !RenderTalentRequestRef.current.contains(e.target)) {
                closeModal();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    return (
        <div className="overlay">
            <form className="modal-form type-3 upgrade-account-form" ref={RenderTalentRequestRef}>
                <h3 className="form__title">Nâng cấp tài khoản</h3>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                    closeModal();
                }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>

                {talentRequest?.status === "pending" &&
                    (
                        <div className="form-field">
                            <p className="text-align-center">Admin đang xử lí yêu cầu nâng cấp tài khoản của bạn. <br />Trong thời gian đó, bạn có thể tham khảo cẩm nang họa sĩ <Link to="" className="highlight-text underlined-text">Tại đây</Link>.</p>
                            <button className="btn btn-2 btn-md mt-8 w-100" onClick={closeModal}>Tôi hiểu</button>
                        </div>
                    )
                }

                {talentRequest?.status === "approved" &&
                    (
                        <div className="form-field">
                            <p>
                                <span className="text-align-center">Admin đã chấp nhận yêu cầu nâng cấp tài khoản của bạn.</span>
                                <br />
                                <span>Tham khảo <Link to="" className='highlight-text underlined-text'>Cẩm nang họa sĩ</Link> để xây dựng portfolio tốt hơn. Chúc bạn có thật nhiều đơn hàng và trải nghiệm thật tốt trên Pastal nhé.</span>
                            </p>
                            <button className="btn btn-2 btn-md mt-8 w-100" onClick={closeModal}>Tôi hiểu</button>
                        </div>
                    )
                }

                {talentRequest?.status === "rejected" &&
                    (
                        <div className="form-field">
                            <p className="text-align-center">Admin đã từ chối yêu cầu nâng cấp tài khoản của bạn.
                                <br />
                                <span className='mt-8'>Lí do: {talentRequest?.rejectMessage}</span>
                            </p>
                            <button className="btn btn-2 btn-md mt-8 w-100" onClick={handleUpgradeAccountAgain}>Gửi lại yêu cầu</button>
                        </div>
                    )
                }
            </form>
        </div>
    )
}