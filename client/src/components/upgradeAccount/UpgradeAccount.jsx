import React, { useState } from 'react';
import "./UpgradeAccount.scss";
import UpgradeAccountImg from "../../assets/img/upgrade-account-img.png";
import { trimString, bytesToKilobytes, formatFloat } from "../../utils/formatter";

const UpgradeAccount = ({ closeModal }) => {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [artworks, setArtworks] = useState([]);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
        setErrors((values) => ({ ...values, [name]: '' })); // Clear the error for this field
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newArtworks = [...artworks];

        files.forEach((file) => {
            if (file.size > 500 * 1024) {
                setErrors((values) => ({ ...values, artworks: "Dung lượng ảnh không được vượt quá 500KB." }));
            } else if (newArtworks.length < 7) {
                newArtworks.push(file);
                setErrors((values) => ({ ...values, artworks: "" }));
            } else {
                setErrors((values) => ({ ...values, artworks: "Bạn có thể chọn tối đa 3 tác phẩm." }));
            }
        });
        console.log(newArtworks);

        setArtworks(newArtworks);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (artworks.length < 3) {
            setErrors((values) => ({ ...values, artworks: "Please upload at least 3 images." }));
            return;
        }

        inputs.role = "client";
        const { confirmPassword, ...others } = inputs;

        try {
            const formData = new FormData();
            Object.keys(others).forEach(key => {
                formData.append(key, others[key]);
            });
            artworks.forEach((artwork, index) => {
                formData.append(`artworks[${index}]`, artwork);
            });

            const response = await apiUtils.post("/access/users/signUp", formData);
            if (response) {
                setShowRegisterVerificationForm(true);
                setRegisterEmail(response.data.metadata.email);
            }
        } catch (error) {
            console.log(error.response.data.message);
            setErrors((values) => ({ ...values, serverError: error.response.data.message }));
        }
    };

    const removeImage = (index) => {
        const newArtworks = [...artworks];
        newArtworks.splice(index, 1);
        setArtworks(newArtworks);
    };

    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    };

    return (
        <div className="overlay" onClick={closeModal}>
            <form className="form authentication upgrade-account-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                <div className="authentication--left">
                    <img src={UpgradeAccountImg} className="authentication__img" alt="Authentication image" />
                </div>

                <div className="authentication--right">
                    <h3 className="form__title">Nâng cấp tài khoản</h3>
                    <div className="form-field">
                        <label htmlFor="stageName" className="form-field__label">Nghệ danh</label>
                        <input type="text" id="stageName" name="stageName" value={inputs.stageName || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập nghệ danh của bạn" autoComplete="on" />
                        {errors.stageName && <span className="form-field__error">{errors.stageName}</span>}
                    </div>
                    <div className="form-field">
                        <label htmlFor="portfolioLink" className="form-field__label">Portfolio URL</label>
                        <input type="text" id="portfolioLink" name="portfolioLink" value={inputs.portfolioLink || ""} onChange={handleChange} className="form-field__input" placeholder="Nhập URL đến hồ sơ họa sĩ của bạn (vd Facebook)" autoComplete="on" />
                        {errors.portfolioLink && <span className="form-field__error">{errors.portfolioLink}</span>}
                    </div>

                    <div className="form-field">
                        <label className="form-field__label">Tác phẩm</label>
                        <div className="form-field">
                            {artworks.map((artwork, index) => (
                                <div key={index} className="form-field__input img-preview">
                                    <div className="img-preview--left">
                                        <img src={URL.createObjectURL(artwork)} alt={`Artwork ${index + 1}`} className="img-preview__img" />
                                        <div className="img-preview__info">
                                            <span className="img-preview__name">{trimString(artwork.name, 15)}</span>
                                            <span className="img-preview__size">{formatFloat(bytesToKilobytes(artwork.size), 1)} KB</span>
                                        </div>
                                    </div>
                                    <div className="img-preview--right">
                                        <svg onClick={() => removeImage(index)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 img-preview__close-ic">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="form-field with-ic add-link-btn" onClick={triggerFileInput}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic add-link-btn__ic">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <span>Thêm tác phẩm</span>

                            <input type="file" id="file-input" style={{ display: "none" }} multiple accept="image/*" onChange={handleImageChange} className="form-field__input" />
                        </div>

                        {errors.artworks && <span className="form-field__error">{errors.artworks}</span>}
                    </div>

                    <div className="form-field">
                        <input type="submit" value="Gửi yêu cầu" className="form-field__input btn btn-2 btn-md" />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpgradeAccount;