import { useState } from "react";

export default function ConfirmTalentRequest({ talentRequest, confirmTalentRequestMutation, setShowConfirmTalentRequest, setOverlayVisible }) {
    const [isSubmitConfirmTalentRequestLoading, setIsSubmitConfirmTalentRequestLoading] = useState(false);

    const handleSubmit = async () => {
        console.log(talentRequest)
        setIsSubmitConfirmTalentRequestLoading(true);
        await confirmTalentRequestMutation.mutate(talentRequest._id);
        setIsSubmitConfirmTalentRequestLoading(false);
        setShowConfirmTalentRequest(false);
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