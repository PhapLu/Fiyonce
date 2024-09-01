// Imports
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useParams, useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

// Styling
import "./CreateProposal.scss"
import { apiUtils, createFormData } from "../../../utils/newRequest";
import { useModal } from "../../../contexts/modal/ModalContext";
import { bytesToKilobytes, formatCurrency, formatFloat, limitString } from "../../../utils/formatter";
import { isFilled, minValue } from "../../../utils/validator";
import { useAuth } from "../../../contexts/auth/AuthContext";
import { resizeImageUrl } from "../../../utils/imageDisplayer";
import DatePicker from "../../datePicker/DatePicker";

export default function CreateProposal() {
    const commissionOrder = useOutletContext();

    const queryClient = useQueryClient();
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [selectedTermOfService, setSelectedTermOfService] = useState();
    const [isSubmitCreateProposalLoading, setIsSubmitCreateProposalLoading] = useState(false);
    const { setModalInfo } = useModal();
    const [selectedArtworks, setSelectedArtworks] = useState([]);
    const { userInfo, socket } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const createProposalMutation = useMutation(
        async ({ orderId, inputs }) => {
            const response = await apiUtils.post(`/proposal/sendProposal/${orderId}`, inputs);
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


    const fetchTermOfServices = async () => {
        try {
            const response = await apiUtils.get(`/termOfService/readTermOfServices`);
            return response.data.metadata.termOfServices;
        } catch (error) {
            return null;
        }
    };

    const {
        data: termOfServices,
        error: fetchingTermOfServicesError,
        isError: isFetchingTermOfServicesError,
        isLoading: isFetchingTermOfServicesLoading,
        refetch: refetchTermOfServices,
    } = useQuery('fetchTermOfServices', fetchTermOfServices, {
    });

    const closeCreateProposalView = () => {
        navigate(-1);
    }

    const handleShowCreateProposal = () => {
        if (termOfServices && termOfServices.length > 0) {
            closeCreateProposalView();
        } else {
            setModalInfo({
                status: "warning",
                message: "Vui lòng tạo điều khoản dịch vụ trước"
            })
        }
    }

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
        setErrors((values) => ({ ...values, artworks: '' }));
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

        setInputs((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Reset error state for the field
        setErrors((values) => ({ ...values, [name]: '' }));
    };

    const handleDateChange = (name, formattedDate) => {
        const date = new Date(formattedDate);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        const formattedDateISO = `${year}-${month}-${day}T00:00:00.000Z`;

        setInputs((values) => ({ ...values, [name]: formattedDateISO }));
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
                closeCreateProposalView();
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

        if (inputs.startAt > inputs.deadline) {
            errors.startAt = "Ngày bắt đầu diễn ra trước deadline";
        }

        if (commissionOrder?.isDirect == false) {
            if (selectedArtworks?.length < 3 || selectedArtworks?.length > 5) {
                errors.artworks = "Vui lòng chọn 3 - 5 tranh mẫu";
            }
            if (!isFilled(inputs.termOfServiceId)) {
                errors.termOfServiceId = "Vui lòng chọn 1 điều khoản dịch vụ";
            }
        }

        if (!isFilled(inputs.price)) {
            errors.price = "Vui lòng nhập giá trị đơn hàng";
        } else {
            if (!minValue(inputs?.price, 100000)) {
                errors.price = "Giá trị đơn hàng phải trên 100.000đ";
            }
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
            console.log(validationErrors)
            return;
        }


        inputs.artworks = selectedArtworks.map((artwork) => artwork._id);

        try {
            const response = await createProposalMutation.mutateAsync({ orderId: commissionOrder._id, inputs });
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Tạo hợp đồng thành công"
                })
                closeCreateProposalView();

                const senderId = userInfo._id;
                const receiverId = commissionOrder.memberId._id;
                const inputs2 = { receiverId, type: "approveCommissionOrder", url: `/users/${commissionOrder.memberId._id}/order-history` }
                const response2 = await apiUtils.post(`/notification/createNotification`, inputs2);
                const notificationData = response2.data.metadata.notification;
                socket.emit('sendNotification', { senderId, receiverId, notification: notificationData, url: notificationData.url });
            }
        } catch (error) {
            console.log(error)
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

    const toggleArtworkSelection = (artwork) => {
        setSelectedArtworks((prevSelectedArtworks) => {
            if (prevSelectedArtworks.includes(artwork)) {
                return prevSelectedArtworks.filter((selectedArtwork) => selectedArtwork !== artwork);
            } else if (prevSelectedArtworks.length < 5) {
                return [...prevSelectedArtworks, artwork];
            }
            return prevSelectedArtworks;
        });
        setErrors((values) => ({ ...values, artworks: '' }));
    };

    const displayedSelectedArtworks = selectedArtworks.filter((selectedArtwork) => selectedArtwork !== null).slice(0, 5);

    while (displayedSelectedArtworks.length < 3) {
        displayedSelectedArtworks.push(placeholderImage);
    }

    return (
        <div className="overlay">
            <div className="create-proposal modal-form type-2" ref={createProposalRef} onClick={(e) => { e.stopPropagation(); }}>
                <Link to="/help_center" className="form__help" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 form__help-ic">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                    </svg> Trợ giúp
                </Link>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                    closeCreateProposalView();
                }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>

                <div className="modal-form--left">
                    <div className="btn btn-3 br-16 btn-sm gray-bg-hover mb-12" onClick={() => { navigate(-1) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                        </svg>
                        Quay lại
                    </div>
                    <br />
                    {commissionOrder?.isDirect == true ? (
                        <>
                            <h3 className="mt-0 mb-8">{commissionOrder?.commissionServiceId?.title}</h3>
                            <span>
                                Do khách hàng đề xuất: <span className="highlight-text">{formatCurrency(commissionOrder?.minPrice)} - {formatCurrency(commissionOrder?.maxPrice)} VND</span>
                                <br />
                                Do bạn đề xuất: <span className="highlight-text">{formatCurrency(inputs?.price) || "x"} VND</span>
                            </span>
                            <hr />
                        </>
                    ) : (
                        <>
                            <h3 className="mt-0 mb-8">Ứng đơn hàng trên Chợ Commission</h3>
                            <span>
                                Do khách hàng đề xuất: <span className="highlight-text">{formatCurrency(commissionOrder?.minPrice)} - {formatCurrency(commissionOrder?.maxPrice)} VND</span>
                                <br />
                                Do bạn đề xuất: <span className="highlight-text">{formatCurrency(inputs?.price) || "x"} VND</span>
                            </span>
                            <hr />
                            <div className="image-container images-layout-3">
                                {displayedSelectedArtworks.slice(0, 3).map((portfolio, index) => {
                                    if (index === 2 && displayedSelectedArtworks.length > 3) {
                                        return (
                                            <div className="image-item">
                                                <img
                                                    key={index}
                                                    src={
                                                        portfolio instanceof File
                                                            ? URL.createObjectURL(portfolio)
                                                            : portfolio.url || placeholderImage
                                                    }
                                                    alt={`portfolio ${index + 1}`}
                                                />
                                                <div className="image-item__overlay">
                                                    +{displayedSelectedArtworks?.length - 3}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div className="image-item">
                                            <img
                                                key={index}
                                                src={
                                                    portfolio instanceof File
                                                        ? URL.createObjectURL(portfolio)
                                                        : portfolio.url || placeholderImage
                                                }
                                                alt={`portfolio ${index + 1}`}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    <br />
                    <h4>Phạm vi công việc: </h4>
                    <div>
                        <span className="w-100">{inputs?.scope ? limitString(inputs?.scope, 150) : "Mô tả phạm vi công việc"}</span>
                    </div>
                </div>

                <div className="modal-form--right">
                    <h2 className="form__title">Soạn hợp đồng</h2>

                    <div className="form-field">
                        <label htmlFor="scope" className="form-field__label">Phạm vi công việc</label>
                        <span className="form-field__annotation">Mô tả những gì khách hàng sẽ nhận được từ dịch vụ của bạn</span>
                        <textarea type="text" name="scope" value={inputs?.scope || ""} placeholder="Nhập mô tả" onChange={handleChange} className="form-field__input"></textarea>
                        {errors.scope && <span className="form-field__error">{errors.scope}</span>}
                    </div>

                    {commissionOrder?.isDirect == false && (
                        <div className="form-field">
                            <label className="form-field__label">Tranh mẫu</label>
                            <span className="form-field__annotation">Cung cấp một số tranh mẫu để khách hàng hình dung chất lượng dịch vụ của bạn tốt hơn (3 - 5 tác phẩm).</span>
                            <div className="img-preview-container border-text">
                                {artworks?.length > 0 && artworks?.map((artwork, index) => {
                                    return (
                                        <div key={artwork._id}
                                            className={`img-preview-item ${selectedArtworks.includes(artwork) ? "active" : ""}`}
                                            onClick={() => toggleArtworkSelection(artwork)}>
                                            <img src={resizeImageUrl(artwork.url, 300)} alt="" className="img-preview-item__img" />
                                        </div>
                                    )
                                })}
                            </div>

                            {errors.artworks && <span className="form-field__error">{errors.artworks}</span>}
                        </div>
                    )}


                    <div className="form-field">
                        <label htmlFor="startAt" className="form-field__label">Thời gian dự kiến</label>
                        <span className="form-field__annotation">Cam kết thời gian dự định bắt đầu thực hiện công việc và hạn chót giao sản phẩm</span>
                        <div className="flex-align-center date-picker-sm">
                            <label className="mr-8" htmlFor="startAt">Ngày bắt đầu</label>
                            <DatePicker name="startAt" value={inputs.startAt} onChange={(date) => handleDateChange('startAt', date)} />
                        </div>
                        <div className="flex-align-center date-picker-sm mt-8">
                            <label className="mr-8" htmlFor="deadline">Hạn chót</label>
                            <DatePicker name="deadline" value={inputs.deadline} onChange={(date) => handleDateChange('deadline', date)} />
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

                    {
                        commissionOrder?.isDirect == false && (
                            <div className="form-field">
                                <label htmlFor="scope" className="form-field__label">Điều khoản dịch vụ</label>
                                <span className="form-field__annotation">Vui lòng chọn một trong những điều khoản dịch vụ của bạn</span>

                                <div className="w-100 display-inline-block">
                                    {
                                        termOfServices?.map((termOfService, index) => {
                                            return (
                                                <div className="mb-8" key={index}>
                                                    <label className="flex-align-center w-100">
                                                        <input
                                                            type="radio"
                                                            name="termOfServiceId"
                                                            value={termOfService._id}
                                                            checked={inputs.termOfServiceId === termOfService._id}
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                                setSelectedTermOfService(termOfService); // Update the selected term of service
                                                            }}
                                                        />
                                                        {`${termOfService.title} ${(termOfService._id === selectedTermOfService?._id) ? " (Đã chọn)" : ""}`}
                                                    </label>
                                                </div>
                                            );
                                        })
                                    }

                                    {selectedTermOfService?.content &&
                                        <p className="border-text w-100" dangerouslySetInnerHTML={{ __html: selectedTermOfService?.content }}></p>
                                    }
                                </div>
                                {errors.termOfServiceId && <span className="form-field__error">{errors.termOfServiceId}</span>}
                            </div>
                        )
                    }

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
        </div>
    )
}