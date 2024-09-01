import { useState } from "react";
import { useAuth } from "../../../contexts/auth/AuthContext";
import { apiUtils } from "../../../utils/newRequest";
import { isFilled } from "../../../utils/validator";

export default function DenyTalentRequest({ talentRequest, denyTalentRequestMutation, setShowDenyTalentRequest, setOverlayVisible }) {
    const [isSubmitDenyTalentRequestLoading, setIsSubmitDenyTalentRequestLoading] = useState(false);
    const { userInfo, socket } = useAuth();
    const [inputs, setInputs] = useState({}); // Initialize as an empty object
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        let errors = {};
        console.log(inputs);
        if (!isFilled(inputs.rejectMessage)) {
            errors.rejectMessage = "Vui lòng nhập lí do từ chối";
        }
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update input value & clear error
        setInputs((values) => ({ ...values, [name]: value }));
        setErrors((values) => ({ ...values, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitDenyTalentRequestLoading(true);
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitDenyTalentRequestLoading(false);
            return;
        }

        try {
            const response = await denyTalentRequestMutation.mutate({ talentRequestId: talentRequest._id, inputs });
            const senderId = userInfo._id;
            const receiverId = talentRequest?.userId?._id;
            const notificationInputs = { receiverId, type: "denyTalentRequest", url: `/users/${receiverId}/upgrade-account` };
            const notificationResponse = await apiUtils.post(`/notification/createNotification`, notificationInputs);
            const notificationData = notificationResponse.data.metadata.notification;
            console.log(notificationData)
            socket.emit('sendNotification', { senderId, receiverId, notification: notificationData, url: notificationData.url });
        } catch (error) {
            console.log(error);
        }
        setIsSubmitDenyTalentRequestLoading(false);
        setShowDenyTalentRequest(false);
        setOverlayVisible(false);
    };

    return (
        <div className="deny-talent-request modal-form type-3">
            <h2 className="form__title">Từ chối yêu cầu nâng cấp tài khoản</h2>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowDenyTalentRequest(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <div className="form-field">
                <label htmlFor="" className="form-field__label">Lí do</label>
                <input type="text" name="rejectMessage" onChange={handleChange} className="form-field__input" placeholder="Nhập lí do từ chối" />

                {errors?.rejectMessage && <span className="form-field__error">{errors?.rejectMessage}</span>}
            </div>
            <div className="form-field">
                <button type="submit" className="btn btn-2 w-100 btn-md form__submit-btn-item" disabled={isSubmitDenyTalentRequestLoading} onClick={handleSubmit}>
                    {isSubmitDenyTalentRequestLoading ? 'Đang tải...' : 'Xác nhận'}
                </button>
            </div>
        </div>
    );
}
