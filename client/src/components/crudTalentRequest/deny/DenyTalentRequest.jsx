
export default function ConfirmTalentRequest({ talentRequest, setShowTalentRequest, setOverlayVisible }) {
    const [isSubmitConfirmTalentRequestLoading, setIsSubmitConfirmTalentRequestLoading] = useState(false);

    return (
        <div className="confirm-talent-request modal-form type-3">
            <h2 className="form__title">Chấp nhận yêu cầu nâng cấp tài khoản</h2>

            <div className="form-field">
                <label htmlFor="" className="form-field__label">Họ và tên</label>
                <p>{talentRequest?.fullName}</p>
            </div>
            <div className="form-field">
                <label htmlFor="" className="form-field__label">Email</label>
                <p>{talentRequest?.email}</p>
            </div>
            <div className="form-field">
                <label htmlFor="" className="form-field__label">Địa chỉ</label>
                <p>{talentRequest?.address}</p>
            </div>
            <div className="form-field">
                <label htmlFor="" className="form-field__label">Vị trí công việc</label>
                <p>{talentRequest?.jobTitle}</p>
            </div>
            <div className="form-field">
                <label htmlFor="" className="form-field__label">CMND/CCCD</label>
                <p>{talentRequest?.cccd}</p>
            </div>
            <div className="form-field">
                <label htmlFor="" className="form-field__label">Mã số thuế</label>
                <p>{talentRequest?.cccd}</p>
            </div>

            <div className="form-field">
                <label htmlFor="" className="form-field__label">Tranh</label>
                {
                    talentRequest?.portfolios?.map((portfolio, index) => {
                        return (
                            <div key={index} className="img-preview">
                                <img
                                    src={
                                        portfolio instanceof File
                                            ? URL.createObjectURL(portfolio)
                                            : portfolio
                                    }
                                    alt=""
                                    className="img-preview--img"
                                />
                            </div>
                        )
                    })
                }
            </div>

            <div className="form__submit-btn-container">
                <button type="submit" className="btn btn-2 btn-md form__submit-btn-item" disabled={isSubmitConfirmTalentRequestLoading} onClick={handleSubmit}>
                    {isSubmitConfirmTalentRequestLoading ? 'Đang thêm...' : 'Thêm mới'}
                </button>
            </div>
        </div>
    )
}