// Imports
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

// Styling
import "./CreateProposal.scss"
import { apiUtils, createFormData } from "../../../utils/newRequest";
import { useModal } from "../../../contexts/modal/ModalContext";
import { bytesToKilobytes, formatCurrency, formatFloat, limitString } from "../../../utils/formatter";
import { isFilled } from "../../../utils/validator";
import { useAuth } from "../../../contexts/auth/AuthContext";
import { resizeImageUrl } from "../../../utils/imageDisplayer";


export default function CreateProposal({ commissionOrder, termOfServices, setShowCreateProposal, setOverlayVisible, createProposalMutation }) {
    console.log(commissionOrder)
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [selectedTermOfService, setSelectedTermOfService] = useState();
    const [isSubmitCreateProposalLoading, setIsSubmitCreateProposalLoading] = useState(false);
    const { setModalInfo } = useModal();
    const [selectedArtworks, setSelectedArtworks] = useState([]);
    const { userInfo } = useAuth();

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newArtworks = selectedArtworks.filter(selectedArtwork => selectedArtwork !== null); // Remove null values
        files.forEach((file) => {
            if (file.size > 10 * 1024 * 1024) {
                setErrors((values) => ({ ...values, selectedArtworks: "Dung lượng ảnh không được vượt quá 10 MB." }));
            } else {
                newArtworks.push(file);
            }
        });
        setSelectedArtworks(newArtworks);
    };

    const placeholderImage = "/uploads/default_image_placeholder.png";

    const removeImage = (index) => {
        const newArtworks = [...selectedArtworks];
        newArtworks[index] = null;
        setSelectedArtworks(newArtworks);
    };

    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    };

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

    const fetchProfileArtworks = async () => {
        try {
            const response = await apiUtils.get(`/post/readArtworks/${userInfo._id}`);
            return response.data.metadata.artworks;
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    const { data: artworks, error: fetchingTalentOrderHistoryError, isError: isFetchingTalentOrderHistoryError, isLoading: isFetchingTalentOrderHistoryLoading } = useQuery(
        'fetchProfileArtworks',
        fetchProfileArtworks,
        {
            onSuccess: (data) => {
                console.log(data)
            },
            onError: (error) => {
                console.error('Error fetching service by ID:', error);
            },
        }
    );

    const createProposalRef = useRef();
    useEffect(() => {
        const handler = (e) => {
            if (createProposalRef.current && !createProposalRef.current.contains(e.target)) {
                setShowCreateProposal(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);


    const validateInputs = () => {
        let errors = {};

        if (!isFilled(inputs.scope)) {
            errors.scope = "Vui lòng nhập mô tả";
        }

        if (!isFilled(inputs.startAt)) {
            errors.startAt = "Vui lòng chọn ngày dự kiến bắt đầu";
        }

        if (!isFilled(inputs.deadline)) {
            errors.deadline = "Vui lòng chọn hạn chót";
        }

        if (!(inputs?.artworks?.length > 1)) {
            errors.artworks = "Vui lòng chọn 3-5 tranh mẫu";
        }

        if (!isFilled(inputs.price)) {
            errors.price = "Vui lòng nhập giá trị đơn hàng";
        }

        if (!isFilled(inputs.termOfServiceId)) {
            errors.termOfServiceId = "Vui lòng chọn 1 điều khoản dịch vụ";
        }

        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitCreateProposalLoading(true);
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitCreateProposalLoading(false);
            return;
        }
        console.log(validationErrors)

        const fd = createFormData(inputs, "files", selectedArtworks);

        try {
            const response = await createProposalMutation.mutateAsync(fd);
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Thêm dịch vụ thành công"
                })
                setShowDeleteCommissionTosForm(false);
                setOverlayVisible(false);
            }
        } catch (error) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response.data.message
            }));
            setModalInfo({
                status: "error",
                message: error.response.data.message
            })
        } finally {
            setIsSubmitCreateProposalLoading(false);
        }
    };

    const displayedSelectedArtworks = selectedArtworks.filter((selectedArtwork) => selectedArtwork !== null).slice(0, 5);

    while (displayedSelectedArtworks.length < 3) {
        displayedSelectedArtworks.push(placeholderImage);
    }

    return (
        <div className="create-proposal modal-form type-2" ref={createProposalRef} onClick={(e) => { e.stopPropagation(); }}>
            <Link to="/help_center" className="form__help" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__help-ic">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg> Trợ giúp
            </Link>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowCreateProposal(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <div className="modal-form--left">
                <span>{!commissionOrder?.isDirect && commissionOrder?.commissionServiceId?.title}</span>
                <div className="user sm mb-8">
                    <div className="user--left">
                        <img src={commissionOrder?.memberId.avatar} alt="" className="user__avatar" />
                        <div className="user__name">
                            <div className="user__name__title">{commissionOrder?.memberId.fullName}</div>
                        </div>
                    </div>
                </div>
                <span>Giá: <span className="highlight-text"> {inputs?.price ? formatCurrency(inputs?.price) : "x"} VND</span></span>
                <hr />
                <div className="images-layout-3">
                    {displayedSelectedArtworks?.slice(0, 3)?.map((selectedArtwork, index) => (
                        <img
                            key={index}
                            src={
                                selectedArtwork.url instanceof File
                                    ? URL.createObjectURL(selectedArtwork.url)
                                    : selectedArtwork.url || placeholderImage
                            }
                            alt={`Tranh mẫu ${index + 1}`}
                        />
                    ))}
                </div>
                <h4>Phạm vi công việc: </h4>
                <p>{inputs?.scope}</p>
                <hr />
            </div>

            <div className="modal-form--right">
                <h2 className="form__title">Soạn hợp đồng</h2>

                <div className="form-field">
                    <label htmlFor="scope" className="form-field__label">Phạm vi công việc</label>
                    <span className="form-field__annotation">Mô tả những gì khách hàng sẽ nhận được từ dịch vụ của bạn</span>
                    <textarea type="text" name="scope" value={inputs?.scope || "Nhập mô tả"} onChange={handleChange} className="form-field__input"></textarea>
                    {errors.scope && <span className="form-field__error">{errors.scope}</span>}
                </div>

                <div className="form-field">
                    <label className="form-field__label">Tranh mẫu</label>
                    <span className="form-field__annotation">Cung cấp một số tranh mẫu để khách hàng hình dung chất lượng dịch vụ của bạn tốt hơn (tối thiểu 3 và tối đa 5 tác phẩm).</span>
                    <div className="img-preview-container border-text">
                        {artworks?.length > 0 && artworks?.map((artwork, index) => {
                            return (
                                <div className="img-preview-item">
                                    <img src={resizeImageUrl(artwork.url, 300)} alt="" className="img-preview-item__img" />
                                </div>
                            )
                        })}
                    </div>
                    {errors.artworks && <span className="form-field__error">{errors.artworks}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="startAt" className="form-field__label">Thời gian dự kiến</label>
                    <span className="form-field__annotation">Cam kết thời gian dự định bắt đầu thực hiện công việc và hạn chót giao sản phẩm</span>
                    <div className="half-split">
                        <label htmlFor="startAt">Bắt đầu</label>
                        <input type="date" name="startAt" placeholder="Nhập tiêu đề" className="form-field__input" />
                        -
                        <label htmlFor="deadline">Hạn chót</label>
                        <input type="date" name="deadline" placeholder="Nhập tiêu đề" className="form-field__input" />
                    </div>
                    {errors.startAt && <span className="form-field__error">{errors.startAt}</span>}
                    {errors.deadline && <span className="form-field__error">{errors.deadline}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="price" className="form-field__label">Giá trị đơn hàng (VND)</label>
                    <span className="form-field__annotation">Đưa ra mức giá chính xác mà bạn cần để thực hiện dịch vụ.</span>
                    <input type="number" name="price" placeholder="Nhập mức giá (VND)" className="form-field__input" onChange={handleChange} />
                    {errors.price && <span className="form-field__error">{errors.price}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="scope" className="form-field__label">Điều khoản dịch vụ</label>
                    <span className="form-field__annotation">Vui lòng chọn một trong những điều khoản dịch vụ của bạn</span>

                    <div className="w-100 display-inline-block">
                        {
                            termOfServices?.map((termOfService, index) => {
                                return (
                                    <div className="mb-8 " onClick={() => setSelectedTermOfService(termOfService)} key={index}>
                                        <label className="flex-align-center w-100">
                                            <input type="radio" name="termOfServiceId" value={termOfService._id} />
                                            {`${termOfService.title} ${(termOfService._id === selectedTermOfService?._id) ? " (Đã chọn)" : ""}`}
                                        </label>
                                    </div>)
                            }
                            )
                        }
                        {selectedTermOfService?.content &&
                            <p className="border-text w-100" dangerouslySetInnerHTML={{ __html: selectedTermOfService?.content }}></p>
                        }
                    </div>
                    {errors.termOfServiceId && <span className="form-field__error">{errors.termOfServiceId}</span>}
                </div>
            </div>

            <div className="form__submit-btn-container">
                <button
                    type="submit"
                    className="form__submit-btn-item btn btn-2 btn-md"
                    onClick={handleSubmit}
                    disabled={isSubmitCreateProposalLoading}
                >
                    {isSubmitCreateProposalLoading ? (
                        <span className="btn-spinner"></span>
                    ) : (
                        "Xác nhận"
                    )}
                </button>
            </div>
        </div>
    )
}