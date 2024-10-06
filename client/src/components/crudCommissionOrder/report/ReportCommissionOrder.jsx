// Imports
import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate, Outlet, useOutletContext } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useQuery, useMutation, useQueryClient } from "react-query";

// Resources
import { useModal } from "../../../contexts/modal/ModalContext";
import { isFilled } from "../../../utils/validator";
import { apiUtils, createFormData } from "../../../utils/newRequest";
import { useAuth } from "../../../contexts/auth/AuthContext";
import { bytesToKilobytes, formatFloat, limitString } from "../../../utils/formatter";

// Styling

export default function ReportCommissionOrder() {
    const commissionOrder = useOutletContext();

    const navigate = useNavigate();

    const [inputs, setInputs] = useState(
        {
            orderId: commissionOrder._id,
            content: "",
        }
    );

    const [errors, setErrors] = useState({});
    const [evidences, setEvidences] = useState();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setInputs((prevState) => ({
                ...prevState,
                [name]: checked
            }));
        } else {
            setInputs((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
        setErrors((values) => ({ ...values, [name]: '' }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newEvidences = evidences?.length > 0 ? evidences.filter(evidence => evidence !== null) : []; // Remove null values
        files.forEach((file) => {
            if (file.size > 10 * 1024 * 1024) {
                setErrors((values) => ({ ...values, evidences: "Dung lượng ảnh không được vượt quá 10 MB." }));
            } else {
                newEvidences.push(file);
            }
        });
        setEvidences(newEvidences);
    };

    const placeholderImage = "/uploads/default_image_placeholder.png";

    const removeImage = (index) => {
        const newEvidences = [...evidences];
        newEvidences[index] = null;
        setEvidences(newEvidences);
    };

    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    };

    const { userInfo } = useAuth();
    const { setModalInfo } = useModal();

    const [isSubmitReportCommissionOrderLoading, setIsSubmitReportCommissionOrderLoading] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");
    const isOrderOwnerAsMember = userInfo?._id === commissionOrder.memberId._id;


    const closeReportCommissionOrderView = () => {
        navigate(`/order-history`);
    }
    // Toggle display modal form
    const commissionOrderRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (commissionOrderRef && commissionOrderRef.current && !commissionOrderRef.current.contains(e.target)) {
                closeReportCommissionOrderView();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    const validateInputs = () => {
        let errors = {};
        const content = selectedReason === "other" ? otherReason : selectedReason;

        if (!isFilled(content)) {
            errors.content = "Vui lòng chọn một lí do";
        }

        if (!evidences || evidences?.length < 3 || evidences?.length > 5) {
            errors.evidences = "Vui lòng đính kèm 3-5 hình ảnh";
        }

        return errors;
    }

    const reportCommissionOrderMutation = useMutation(
        async (fd) => {
            const response = await apiUtils.post(`/commissionReport/createCommissionReport`, fd);
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('fetchTalentOrderHistory');
            },
            onError: (error) => {
                return error;
            },
        }
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitReportCommissionOrderLoading(true);

        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitReportCommissionOrderLoading(false);
            return;
        }

        try {
            const content = selectedReason === "other" ? otherReason : selectedReason;
            const updatedInputs = { ...inputs, content };
            const fd = createFormData(updatedInputs, "files", evidences);

            const response = await reportCommissionOrderMutation.mutateAsync(fd);
            if (response) {
                if (isOrderOwnerAsMember) {
                    setModalInfo({
                        status: "success",
                        message: "Báo cáo họa sĩ thành công",
                    });
                } else {
                    setModalInfo({
                        status: "success",
                        message: "Báo cáo khách hàng thành công",
                    });
                }
            }
        } catch (error) {
            console.error("Failed to submit:", error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response?.data?.message,
            }));
        } finally {
            setIsSubmitReportCommissionOrderLoading(false);
            closeReportCommissionOrderView();
        }
    };

    return (
        <div className="overlay">
            <div className="report-commission-order modal-form type-3 sm" ref={commissionOrderRef} onClick={(e) => { e.stopPropagation() }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={closeReportCommissionOrderView}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h2 className="form__title">{isOrderOwnerAsMember ? "Báo cáo họa sĩ" : "Báo cáo khách hàng"}</h2>
                <div className="form-field">
                    <p className="highlight-bg-text text-align-justify">
                        Pastal Team sẽ dựa trên thông tin bạn cung cấp (1), hợp đồng giữa hai bên (2), điều khoản dịch vụ của họa sĩ (3) và điều khoản chung của nền tảng (4) để xử lí báo cáo vi phạm.
                        Vui lòng kiểm tra email để cập nhật thông báo mới nhất.
                        Quá trình này có thể mất từ 1-3 ngày.
                    </p>
                </div>

                <div className="form-field">
                    <label htmlFor="" className="form-field__label">Lí do vi phạm</label>
                    {isOrderOwnerAsMember ? (
                        <div className="mb-8">
                            <div className="mb-8">
                                <label className="">
                                    <input
                                        type="radio"
                                        name="content"
                                        value="Họa sĩ hoàn thành không đúng hạn"
                                        checked={selectedReason === "Họa sĩ hoàn thành không đúng hạn"}
                                        onChange={(e) => setSelectedReason(e.target.value)}
                                    />
                                    Họa sĩ hoàn thành không đúng hạn
                                </label>
                            </div>

                            <div className="mb-8">
                                <label>
                                    <input
                                        type="radio"
                                        name="content"
                                        value="Li do 2"
                                        checked={selectedReason === "Li do 2"}
                                        onChange={(e) => setSelectedReason(e.target.value)}
                                    />
                                    Li do 2
                                </label>
                            </div>

                            <div className="mb-8">
                                <label>
                                    <input
                                        type="radio"
                                        name="content"
                                        value="other"
                                        checked={selectedReason === "other"}
                                        onChange={(e) => setSelectedReason(e.target.value)}
                                    />
                                    Lí do khác
                                </label>
                            </div>
                            {selectedReason === "other" && (
                                <div className="form-field">
                                    <label htmlFor="content"></label>
                                    <textarea
                                        id="otherReason"
                                        className="form-field__input"
                                        placeholder="Nhập nội dung tố cáo"
                                        value={otherReason}
                                        onChange={(e) => setOtherReason(e.target.value)}
                                    ></textarea>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mb-8">
                            <div className="mb-8">
                                <label>
                                    <input
                                        type="radio"
                                        name="content"
                                        value="Khách hàng không hợp tác"
                                        checked={selectedReason === "Khách hàng không hợp tác"}
                                        onChange={(e) => setSelectedReason(e.target.value)}
                                    />
                                    Khách hàng không hợp tác
                                </label>
                            </div>

                            <div className="mb-8">
                                <label>
                                    <input
                                        type="radio"
                                        name="content"
                                        value="Khách hàng yêu cầu thêm quá nhiều chi tiết không đề cập trong hợp đồng "
                                        checked={selectedReason === "Khách hàng yêu cầu thêm quá nhiều chi tiết không đề cập trong hợp đồng "}
                                        onChange={(e) => setSelectedReason(e.target.value)}
                                    />
                                    Khách thêm quá nhiều chi tiết không đề cập trong hợp đồng
                                </label>
                            </div>

                            <div className="mb-8">
                                <label>
                                    <input
                                        type="radio"
                                        name="content"
                                        value="other"
                                        checked={selectedReason === "other"}
                                        onChange={(e) => setSelectedReason(e.target.value)}
                                    />
                                    Lí do khác
                                </label>
                            </div>
                            {selectedReason === "other" && (
                                <div className="form-field">
                                    <label htmlFor="content" className="form-field__label"></label>
                                    <textarea
                                        id="otherReason"
                                        className="form-field__input"
                                        placeholder="Nhập nội dung tố cáo"
                                        value={otherReason}
                                        onChange={(e) => setOtherReason(e.target.value)}
                                    ></textarea>
                                </div>
                            )}
                        </div>
                    )}
                    {errors.content && <span className="form-field__error">{errors.content}</span>}
                </div>


                <div className="form-field">
                    <label className="form-field__label">Bằng chứng</label>
                    <span className="form-field__annotation">Vui lòng đính kèm 3 - 5 ảnh chứng minh {isOrderOwnerAsMember ? "họa sĩ" : "khách hàng"} đã vi phạm hợp đồng</span>
                    {evidences?.map((evidence, index) => {
                        return (
                            evidence && (
                                <div key={index} className="form-field__input img-preview">
                                    <div className="img-preview--left">
                                        <img
                                            src={
                                                evidence instanceof File
                                                    ? URL.createObjectURL(evidence)
                                                    : evidence || placeholderImage
                                            }
                                            alt={`evidence ${index + 1}`}
                                            className="img-preview__img"
                                        />
                                        <div className="img-preview__info">
                                            <span className="img-preview__name">
                                                {evidence instanceof File
                                                    ? limitString(evidence.name, 15)
                                                    : "Tranh mẫu"}
                                            </span>
                                            <span className="img-preview__size">
                                                {evidence instanceof File
                                                    ? formatFloat(bytesToKilobytes(evidence.size), 1) + " KB"
                                                    : ""}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="img-preview--right">
                                        <svg
                                            onClick={() => removeImage(index)}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="size-6 img-preview__close-ic"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                </div>
                            )
                        );
                    })}

                    <div className="form-field with-ic create-link-btn btn-md" onClick={triggerFileInput}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic create-link-btn__ic">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>Thêm ảnh</span>
                        <input type="file" id="file-input" style={{ display: "none" }} multiple accept="image/*" onChange={handleImageChange} className="form-field__input" />
                    </div>

                    {errors.evidences && <span className="form-field__error">{errors.evidences}</span>}
                </div>

                <div className="form-field">
                    {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
                </div>
                <div className="form-field">
                    <button
                        type="submit"
                        className="form-field__input btn btn-2 btn-md"
                        onClick={handleSubmit}
                        disabled={isSubmitReportCommissionOrderLoading}
                    >
                        {isSubmitReportCommissionOrderLoading ? (
                            <span className="btn-spinner"></span>
                        ) : (
                            "Xác nhận"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
