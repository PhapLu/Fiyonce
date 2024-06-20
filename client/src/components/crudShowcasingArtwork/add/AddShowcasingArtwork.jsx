// Imports
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Utils
import { formatCurrency, limitString, formatFloat, bytesToKilobytes, formatNumber } from "../../../utils/formatter.js";
import { isFilled } from "../../../utils/validator.js";

// Styling
import "./AddShowcasingArtwork.scss";

export default function AddShowcasingArtwork({ portfolioCollections, setShowAddShowcasingArtworkForm, setOverlayVisible }) {
    // Initialize variables for inputs, errors, loading effect
    const [inputs, setInputs] = useState({
        artworks: Array(5).fill(null),
    });

    const [errors, setErrors] = useState({});
    const [isSubmitAddShowcasingArtworkLoading, setIsSubmitAddShowcasingArtworkLoading] = useState(false);
    const [isSuccessAddShowcasingArtwork, setIsSuccessAddShowcasingArtwork] = useState(false);
    const [isAddNewPortfolioCollection, setIsAddNewPortfolioCollection] = useState(false);

    const [artworks, setSamples] = useState(Array(5).fill(null));

    // Fetch art movements
    const [movements, setMovements] = useState([
        {   
            _id: 1,
            title: "Truyen than",
        },
        {   
            _id: 2,
            title: "Ve Minh Hoa",
        },
        {   
            _id: 3,
            title: "Thiet ke nhan vat",
        },
    ]);

    // Toggle display overlay box
    const addCommissionRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (addCommissionRef && addCommissionRef.current && !addCommissionRef.current.contains(e.target)) {
                setShowAddShowcasingArtworkForm(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    const validateInputs = () => {
        let errors = {};

        // Validate artworks uploading
        if (artworks.filter(sample => sample !== null).length < 1) {
            errors.artworks = "Vui lòng đăng tải tối thiểu 1 tranh.";
        } else if (artworks.filter(sample => sample !== null).length > 5) {
            errors.artworks = "Vui lòng đăng tải tối đa 5 tranh.";
        }

        // Validate agree to terms
        if (!inputs.agreeTerms) {
            errors.agreeTerms = 'Vui lòng xác nhận đồng ý với điều khoản';
        }

        return errors;
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            if (name === 'fileTypes') {
                setInputs(prevState => ({
                    ...prevState,
                    fileTypes: checked
                        ? [...prevState.fileTypes, value]
                        : prevState.fileTypes.filter(type => type !== value)
                }));
            } else {
                setInputs
                setInputs(prevState => ({
                    ...prevState,
                    [name]: checked
                }));
            }
        } else {
            setInputs(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
        setErrors((values) => ({ ...values, [name]: '' }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newSamples = [...artworks];

        files.forEach((file, index) => {
            if (file.size > 500 * 1024) {
                setErrors((values) => ({ ...values, artworks: "Dung lượng ảnh không được vượt quá 500KB." }));
            } else {
                const sampleIndex = newSamples.findIndex(sample => sample === null);
                if (sampleIndex !== -1) {
                    newSamples[sampleIndex] = file;
                }
            }
        });

        setSamples(newSamples);
    };

    const removeImage = (index) => {
        const newSamples = [...artworks];
        newSamples[index] = null;
        setSamples(newSamples);
    };

    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Initialize loading effect for the submit button
        setIsSubmitAddShowcasingArtworkLoading(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Clear the loading effect if validation failed
            setIsSubmitAddShowcasingArtworkLoading(false);
            return;
        }

        // If create new commission service category
        // if (isAddNewPortfolioCollection) {
        //     try {
        //         alert("Adding new")
        //     } catch (error) {
        //         errors.serverError = error.response.data.message;
        //         return;
        //     }
        // } else {
        //     alert("Not adding new")
        // }

        // Handle submit request
        try {
            setIsSuccessAddShowcasingArtwork(true);
        } catch (error) {
            console.error("Failed to submit:", error);
            errors.serverError = error.response.data.message;
        } finally {
            // Clear the loading effect
            setIsSubmitAddShowcasingArtworkLoading(false);
        }
    };

    return (
        <div className="add-showcasing-artwork modal-form type-2" ref={addCommissionRef} onClick={(e) => { e.stopPropagation() }}>
            <Link to="/help_center" className="form__help" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__help-ic">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg> Trợ giúp
            </Link>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowAddShowcasingArtworkForm(false);
                setIsSuccessAddShowcasingArtwork(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>


            <div className="modal-form--left">
                <span>{inputs.movement || "Thể loại"}</span>
                <h3>{inputs.portfolioCollection || "Tên dịch vụ"}</h3>
                <hr />
                <div className="images-layout-3">
                    {artworks.slice(0, 3).map((artwork, index) => (
                        <img
                            key={index}
                            src={artwork ? URL.createObjectURL(artwork) : "/uploads/default_image_placeholder.png"}
                            alt={`artwork ${index + 1}`}
                        />
                    ))}
                </div>
                <p>Hashtags: <i>{inputs.hashtags && inputs.hashtag.map((hashtag, index) => {
                    <span>#{hashtag.title}</span>
                })}</i></p>
            </div>

            <div className="modal-form--right">
                <h2 className="form__title">Thêm dịch vụ</h2>

                <div className="form-field">
                    <label htmlFor="movement" className="form-field__label">Trường phái</label>
                    <select
                        name="movement"
                        value={inputs.movement || ""}
                        onChange={handleChange}
                        className="form-field__input"
                    >
                        <option value="">-- Chọn trường phái --</option>
                        {movements.map((movement) => {
                            return (<option value={movement._id}>{movement.title}</option>)
                        })}
                    </select>
                    {errors.movement && <span className="form-field__error">{errors.movement}</span>}
                </div>

                {!isSuccessAddShowcasingArtwork ?
                    (
                        <>
                            <div className="form-field">
                                <label htmlFor="portfolioCollection" className="form-field__label">Bộ sưu tập</label>
                                {
                                    isAddNewPortfolioCollection == false ? (
                                        <>
                                            <select
                                                name="portfolioCollection"
                                                value={inputs.portfolioCollection || ""}
                                                onChange={handleChange}
                                                className="form-field__input"
                                            >
                                                <option value="">-- Chọn bộ sưu tập --</option>
                                                {portfolioCollections.map((portfolioCollection) => {
                                                    return (<option value={portfolioCollection._id}>{portfolioCollection.title}</option>)
                                                })}
                                            </select>
                                            <button className="btn btn-2" onClick={() => { setIsAddNewPortfolioCollection(true); }}>Thêm bộ sưu tập</button>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                name="newPortfolioCollection"
                                                value={inputs.newPortfolioCollection}
                                                onChange={handleChange}
                                                className="form-field__input"
                                                placeholder="Nhập tên thể loại"
                                            />
                                            <button className="btn btn-2" onClick={() => { setIsAddNewPortfolioCollection(false) }}>Hủy</button>
                                        </>
                                    )
                                }

                                {errors.portfolioCollection && <span className="form-field__error">{errors.portfolioCollection}</span>}
                            </div>

                            <div className="form-field">
                                <label htmlFor="description" className="form-field__label">Mô tả</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={inputs.description}
                                    onChange={handleChange}
                                    className="form-field__input"
                                    placeholder="Chia sẻ gì đó về bức tranh..."
                                />
                                {errors.description && <span className="form-field__error">{errors.description}</span>}
                            </div>

                            <div className="form-field">
                                <label className="form-field__label">Tranh mẫu</label>
                                {artworks.map((artwork, index) => {
                                    return (artwork &&
                                        <div key={index} className="form-field__input img-preview">
                                            <div className="img-preview--left">
                                                <img src={URL.createObjectURL(artwork)} alt={`artwork ${index + 1}`} className="img-preview__img" />
                                                <div className="img-preview__info">
                                                    <span className="img-preview__name">{limitString(artwork.name, 15)}</span>
                                                    <span className="img-preview__size">{formatFloat(bytesToKilobytes(artwork.size), 1)} KB</span>
                                                </div>
                                            </div>
                                            <div className="img-preview--right">
                                                <svg onClick={() => removeImage(index)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 img-preview__close-ic">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        </div>
                                    )
                                }
                                )}

                                <div className="form-field with-ic add-link-btn btn-md" onClick={triggerFileInput}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic add-link-btn__ic">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span>Thêm ảnh</span>

                                    <input type="file" id="file-input" style={{ display: "none" }} multiple accept="image/*" onChange={handleImageChange} className="form-field__input" />
                                </div>

                                {errors.artworks && <span className="form-field__error">{errors.artworks}</span>}
                            </div>

                            <div className="form-field">
                                <label className="form-field__label">
                                    <input
                                        type="checkbox"
                                        name="agreeTerms"
                                        checked={inputs.agreeTerms}
                                        onChange={handleChange}
                                    /> <span>Tôi đồng ý với các <Link to="/terms_and_policies" className="highlight-text"> điều khoản dịch vụ </Link> của Pastal</span>
                                </label>
                                {errors.agreeTerms && <span className="form-field__error">{errors.agreeTerms}</span>}
                            </div>
                            <div className="form-field">
                                {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
                            </div>
                        </>
                    ) : (
                        <p className="text-align-center">
                            Tác phẩm đã được đăng tải thành công!
                            <br /> Tiếp tục đăng tranh
                        </p>
                    )}
            </div>
            <button type="submit"
                className="form__submit-btn btn btn-2 btn-md"
                onClick={handleSubmit}
                disabled={isSubmitAddShowcasingArtworkLoading}>
                {isSubmitAddShowcasingArtworkLoading ? (
                    <span className="btn-spinner"></span>
                ) : (
                    "Đăng tải"
                )}
            </button>
        </div >
    )
}