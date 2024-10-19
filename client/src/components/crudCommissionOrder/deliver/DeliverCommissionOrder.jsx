// Imports
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation, useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

// Resources
import { useModal } from "../../../contexts/modal/ModalContext";
import { isFilled } from "../../../utils/validator";
import { apiUtils, createFormData } from "../../../utils/newRequest";
import { useAuth } from "../../../contexts/auth/AuthContext";
import { bytesToKilobytes, formatFloat, limitString } from "../../../utils/formatter";

// Styling

export default function DeliverCommissionOrder() {
    // Return null if the commission order to be delivered is not specified
    const { userInfo, socket } = useAuth();
    const { setModalInfo } = useModal();

    const commissionOrder = useOutletContext();
    const queryClient = useQueryClient();

    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [files, setFiles] = useState([])

    const triggerFileInput = () => { document.getElementById('file-input').click(); };
    const isOrderOwner = commissionOrder?.memberId?._id === userInfo?._id;
    const isTalentChosen = commissionOrder?.talentChosenId?._id === userInfo?._id;

    const [showZoomImage, setShowZoomImage] = useState(false);
    const [zoomedImageSrc, setZoomedImageSrc] = useState();

    const [isSubmitDeliverCommissionOrderLoading, setIsSubmitDeliverCommissionOrderLoading] = useState(false);
    const [isDeliverCommissionOrderSuccess, setIsDeliverCommissionOrderSuccess] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    // Toggle display modal form
    const closeDeliverCommissionOrderView = () => {
        if (location.pathname.includes("commission-market")) {
            navigate("/commission-market");
        } else {
            navigate("/order-history");
        }
    }

    const commissionOrderRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (commissionOrderRef && commissionOrderRef.current && !commissionOrderRef.current.contains(e.target)) {
                closeDeliverCommissionOrderView();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    const validateInputs = () => {
        let errors = {};

        if (files.length < 1) {
            errors.files = "Vui lòng cung cấp tối thiểu 1 ảnh đính kèm.";
        } else if (files.length > 10) {
            errors.files = "Vui lòng cung cấp tối đa 10 ảnh đính kèm.";
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
                setInputs(prevState => ({
                    ...prevState,
                    [name]: checked
                }));
            }
        } else if (type === 'radio') {
            setInputs(prevState => ({
                ...prevState,
                [name]: value
            }));
        } else {
            setInputs(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const newFiles = [...files];

        selectedFiles.forEach((file) => {
            if (file.size > 2 * 1024 * 1024) {
                setErrors((values) => ({ ...values, files: "Dung lượng ảnh không được vượt quá 2MB." }));
            } else if (newFiles.length + selectedFiles.length <= 10) {
                newFiles.push(file);
                setErrors((values) => ({ ...values, files: "" }));
            } else {
                setErrors((values) => ({ ...values, files: "Bạn có thể chọn tối đa 10 ảnh đính kèm." }));
            }
        });

        setFiles(newFiles);

        // Reset the input value to allow re-selecting the same file later
        e.target.value = '';
    };

    const deliverCommissionOrderMutation = useMutation(
        async (fd) => {
            const response = await apiUtils.patch(`/order/deliverOrder/${commissionOrder?._id}`, fd);
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

    const removeImage = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitDeliverCommissionOrderLoading(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitDeliverCommissionOrderLoading(false);
            return;
        }

        const fd = createFormData(inputs, "files", files)

        try {
            console.log(commissionOrder._id)
            console.log(inputs)
            // const response = await apiUtils.patch(`/order/deliverOrder/${commissionOrder.orderId}`, fd);
            const response = await deliverCommissionOrderMutation.mutateAsync(fd);
            if (response) {
                setModalInfo({
                    status: "success",
                    message: "Hoàn tất bàn giao sản phẩm",
                });

                // Send notification
                const senderId = userInfo?._id;
                const receiverId = commissionOrder?.memberId?._id;
                const inputs2 = { receiverId, type: "deliverCommissionOrder", url: `/order-history` }
                const response2 = await apiUtils.post(`/notification/createNotification`, inputs2);
                const notificationData = response2.data.metadata.notification;
                socket.emit('sendNotification', { senderId, receiverId, notification: notificationData, url: notificationData.url });

                closeDeliverCommissionOrderView();
            }

            setModalInfo({
                status: "congrat",
                message: "Hoàn tất bàn giao sản phẩm",
            })

            // const senderId = userInfo._id;
            // const receiverId = commissionOrder.memberId._id;
            // const inputs2 = { receiverId, type: "deliverCommissionOrder", url: `/order-history` }
            // const response2 = await apiUtils.post(`/notification/createNotification`, inputs2);
            // const notificationData = response2.data.metadata.notification;
            // socket.emit('sendNotification', { senderId, receiverId, notification: notificationData, url: notificationData.url });
        } catch (error) {
            console.error("Failed to submit:", error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                serverError: error.response?.data?.message,
            }));
            setModalInfo({
                status: "error",
                message: error.response?.data?.message,
            });
        } finally {
            setIsSubmitDeliverCommissionOrderLoading(false);
        }
    };

    return (
        <div className="overlay">
            <div className="deliver-commission-order modal-form type-3 sm" ref={commissionOrderRef} onClick={(e) => { e.stopPropagation() }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                    closeDeliverCommissionOrderView();
                }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h2 className="form__title">Hoàn tất đơn hàng</h2>

                {
                    isDeliverCommissionOrderSuccess ? (
                        <p className="mt-8 mb-32 text-align-center">
                            Tadaaa, chúc mừng bạn đã hoàn thành đơn hàng cho khách và đóng góp vào hoạt động cải thiện bữa ăn cho trẻ em vùng cao cũng như trồng thêm cây xanh.
                            <br />
                            Pastal Team chúc bạn sớm có những đơn hàng kế tiếp và luôn đạt được trạng thái tốt nhất khi làm việc trên nền tảng. <span className="fs-20">🎉</span>.

                            <Link to={`/order-history/commission-orders/${commissionOrder?._id}/review`} className="btn btn-2 btn-md w-100">Đánh giá trải nghiệm</Link>
                        </p>
                    ) : (
                        <>
                            <div className="form-field">
                                <p className="highlight-bg-text text-align-justify fs-13">
                                    Nếu khách hàng hài lòng với chất lượng sản phẩm và chọn "Đã nhận được hàng", 95.5% giá trị đơn hàng sẽ được chuyển vào tài khoản thanh toán mà bạn liên kết với Pastal trong vòng 24h. Nếu sau 07 ngày kể từ khi hoàn tất giao dịch mà không có phản hồi và báo cáo vi phạm từ phía khách hàng, giá trị đơn hàng cũng sẽ tự động được chuyển vào tài khoản của bạn.
                                </p>
                            </div>

                            <div className="form-field">
                                <label htmlFor="note" className="form-field__label">Ghi chú cho khách hàng</label>
                                <textarea name="note" value={inputs?.note} className="form-field__input" onChange={handleChange} placeholder="Nhập ghi chú cho khách hàng"></textarea>
                                {errors.note && <span className="form-field__error">{errors.note}</span>}
                            </div>

                            <div className="form-field">
                                <label className="form-field__label">Đường dẫn</label>
                                <span className="form-field__annotation">Cung cấp URL đến tác phẩm nếu cần thiết</span>
                                <input name="url" value={inputs?.url} className="form-field__input" onChange={handleChange} placeholder="Nhập URL đến tác phẩm nếu cần thiết"></input>
                                {errors.url && <span className="form-field__error">{errors.url}</span>}
                            </div>

                            <div className="form-field required">
                                <label className="form-field__label">Sản phẩm</label>
                                <span className="form-field__annotation">Bàn giao tranh cho khách hàng (tối đa 10 ảnh)</span>
                                <div className="form-field with-ic btn add-link-btn" onClick={triggerFileInput}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.0" stroke="currentColor" className="size-6 form-field__ic add-link-btn__ic">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span>Thêm ảnh</span>

                                    <input type="file" id="file-input" style={{ display: "none" }} multiple accept="image/*" onChange={handleImageChange} className="form-field__input" />
                                </div>
                                {files?.map((file, index) => (
                                    <div key={index} className="form-field__input img-preview">
                                        <div className="img-preview--left">
                                            <img src={URL.createObjectURL(file)} alt={`file ${index + 1}`} className="img-preview__img" />
                                            <div className="img-preview__info">
                                                <span className="img-preview__name">{limitString(file.name, 15)}</span>
                                                <span className="img-preview__size">{formatFloat(bytesToKilobytes(file.size), 1)} KB</span>
                                            </div>
                                        </div>
                                        <div className="img-preview--right">
                                            <svg onClick={() => removeImage(index)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 img-preview__close-ic">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                                {errors.files && <span className="form-field__error">{errors.files}</span>}
                            </div>

                            <div className="form-field">
                                <button
                                    type="submit"
                                    className="form-field__input btn btn-2 btn-md"
                                    onClick={handleSubmit}
                                    disabled={isSubmitDeliverCommissionOrderLoading}
                                >
                                    {isSubmitDeliverCommissionOrderLoading ? (
                                        <span className="btn-spinner"></span>
                                    ) : (
                                        "Xác nhận"
                                    )}
                                </button>
                            </div >


                        </>
                    )}
            </div >
        </div >
    );
}