import { useState } from "react";
import { useAuth } from "../../../contexts/auth/AuthContext";
import { apiUtils } from "../../../utils/newRequest";

export default function ConfirmTalentRequest({ talentRequest, confirmTalentRequestMutation, setShowConfirmTalentRequest, setOverlayVisible }) {
    const [isSubmitConfirmTalentRequestLoading, setIsSubmitConfirmTalentRequestLoading] = useState(false);
    const { userInfo, socket } = useAuth();

    const handleSubmit = async (e) => {
        console.log(talentRequest);
        setIsSubmitConfirmTalentRequestLoading(true);
        try {
            const response = await confirmTalentRequestMutation.mutate(talentRequest._id);
            const senderId = userInfo._id;
            const receiverId = talentRequest?.userId?._id;
            const notificationInputs = { receiverId, type: "confirmTalentRequest", url: `/users/${receiverId}/upgrade-account` };
            const notificationResponse = await apiUtils.post(`/notification/createNotification`, notificationInputs);
            const notificationData = notificationResponse.data.metadata.notification;
            console.log(notificationData)
            socket.emit('sendNotification', { senderId, receiverId, notification: notificationData, url: notificationData.url });

        } catch (error) {
            console.log(error);
        }
        setIsSubmitConfirmTalentRequestLoading(false);
        setShowConfirmTalentRequest(false);
        setOverlayVisible(false);
    };

    return (
        <div className="confirm-talent-request modal-form type-3">
            <h2 className="form__title">Chấp nhận yêu cầu nâng cấp tài khoản</h2>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowConfirmTalentRequest(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <div className="form-field">
                <p className="text-align-center">Chấp nhận yêu cầu nâng cấp họa sĩ của <span className="highlight-text">{talentRequest?.userId?.fullName}</span> ?</p>
            </div>
            <div className="form-field">
                <button type="submit" className="btn btn-2 w-100 btn-md form__submit-btn-item" disabled={isSubmitConfirmTalentRequestLoading} onClick={handleSubmit}>
                    {isSubmitConfirmTalentRequestLoading ? 'Đang tải...' : 'Xác nhận'}
                </button>
            </div>
        </div>
    )
}