// Imports
import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate, Outlet, useOutletContext } from "react-router-dom";
import { useQuery } from "react-query";
import { LazyLoadImage } from 'react-lazy-load-image-component';

// Contexts
import { useAuth } from "../../../contexts/auth/AuthContext";
import { useModal } from "../../../contexts/modal/ModalContext";
import { bytesToKilobytes, formatFloat, limitString } from "../../../utils/formatter";
import { apiUtils, createFormData } from "../../../utils/newRequest";

// Styling

export default function CreateMilestone() {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [files, setFiles] = useState([])
    const [isSubmitCreateMilestoneLoading, setIsSubmitCreateMilestoneLoading] = useState(false);

    const { setModalInfo } = useModal();
    const triggerFileInput = () => { document.getElementById('file-input').click(); };

    const { userInfo, socket } = useAuth();
    const commissionOrder = useOutletContext();
    const isOrderOwner = commissionOrder?.memberId?._id === userInfo?._id;
    const isTalentChosen = commissionOrder?.talentChosenId?._id === userInfo?._id;

    const [showZoomImage, setShowZoomImage] = useState(false);
    const [zoomedImageSrc, setZoomedImageSrc] = useState();
    const navigate = useNavigate();


    const createMilestoneViewRef = useRef();

    const closeCreateMilestoneView = () => {
        navigate(`/order-history`);
    }

    useEffect(() => {
        let handler = (e) => {
            if (createMilestoneViewRef && createMilestoneViewRef.current && !createMilestoneViewRef.current.contains(e.target)) {
                closeCreateMilestoneView();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [navigate]);
    const validateInputs = () => {
        let errors = {};

        if (!inputs.title) {
            errors.title = 'Vui lòng nhập tiêu đề';
        }

        if (files.length < 1) {
            errors.files = "Vui lòng cung cấp tối thiểu 1 ảnh đính kèm.";
        } else if (files.length > 5) {
            errors.files = "Vui lòng cung cấp tối đa 5 ảnh đính kèm.";
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
            if (file.size > 5 * 1024 * 1024) {
                setErrors((values) => ({ ...values, files: "Dung lượng ảnh không được vượt quá 5MB." }));
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



    const removeImage = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Initialize loading effect for the submit button
        setIsSubmitCreateMilestoneLoading(true);

        // Validate user inputs
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitCreateMilestoneLoading(false);
            return;
        }

        const fd = createFormData(inputs, "files", files)

        try {
            console.log(inputs)
            const response = await apiUtils.patch(`/order/addMilestone/${commissionOrder?._id}`, fd);
            console.log(response);

            setModalInfo({
                status: "success",
                message: "Thêm tiến độ thành công"
            })

            // Send notification
            const senderId = userInfo?._id;
            const receiverId = commissionOrder?.memberId?._id;
            const inputs2 = { receiverId, type: "createCommissionOrderMilestone", url: `/order-history` }
            const response2 = await apiUtils.post(`/notification/createNotification`, inputs2);
            const notificationData = response2.data.metadata.notification;
            socket.emit('sendNotification', { senderId, receiverId, notification: notificationData, url: notificationData.url });

            navigate("/order-history")
        } catch (error) {
            console.log(error);
            setModalInfo({
                status: "error",
                message: error.response.data.message
            })
        } finally {
            setIsSubmitCreateMilestoneLoading(false);
        }
    }


    if (!isOrderOwner && !isTalentChosen) {
        return;
    }

    return (
        <div className="overlay">
            <div className="create-milestone modal-form type-3" ref={createMilestoneViewRef} onClick={(e) => { e.stopPropagation() }}>
                <h2 className="form__title">Thêm tiến độ</h2>
                <div onClick={() => { navigate(`/order-history/commission-orders/${commissionOrder?._id}/render-milestones`) }} aria-label="Xem tất cả" class="hover-display-label left form__back-ic btn-ic">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"></path></svg>
                </div>
                <svg onClick={closeCreateMilestoneView} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 form__close-ic">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>

                <div className="form-field required">
                    <label className="form-field__label">Tiêu đề</label>
                    <input name="title" value={inputs?.title} className="form-field__input" onChange={handleChange} placeholder="Nhập tiêu đề cho giai đoạn này"></input>
                    {errors.title && <span className="form-field__error">{errors.title}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="note" className="form-field__label">Ghi chú cho khách hàng</label>
                    <textarea name="note" value={inputs?.note} className="form-field__input" onChange={handleChange} placeholder="Nhập ghi chú cho khách hàng nếu có"></textarea>
                    {errors.note && <span className="form-field__error">{errors.note}</span>}
                </div>

                <div className="form-field">
                    <label className="form-field__label">Đường dẫn</label>
                    <span className="form-field__annotation">Cung cấp URL đến tác phẩm nếu cần thiết</span>
                    <input name="url" value={inputs?.url} className="form-field__input" onChange={handleChange} placeholder="Nhập URL đến tác phẩm nếu cần thiết"></input>
                    {errors.url && <span className="form-field__error">{errors.url}</span>}
                </div>

                <div className="form-field required">
                    <label className="form-field__label">Bản thảo </label>
                    <span className="form-field__annotation">Cập nhật các bản thảo cho khách hàng (1 - 5 ảnh)</span>
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
                    <button type="submit"
                        className="form-field__input btn btn-2 btn-md"
                        onClick={handleSubmit}
                        disabled={isSubmitCreateMilestoneLoading}>
                        {isSubmitCreateMilestoneLoading ? (
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