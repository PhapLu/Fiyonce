import { useState, useEffect, useRef } from "react";
import { useNavigate, useOutlet, useOutletContext, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { useModal } from "../../../contexts/modal/ModalContext.jsx";
import { apiUtils } from "../../../utils/newRequest.js";
import "./DeletePost.scss";

export default function DeletePost() {
    const { setModalInfo } = useModal();
    const navigate = useNavigate();
    const { postId, userId } = useParams();
    const queryClient = useQueryClient();
    const { deletePostMutation } = useOutletContext();

    const [errors, setErrors] = useState({});
    const [isSubmitDeletePostLoading, setIsSubmitDeletePostLoading] = useState(false);

    const deletePostRef = useRef();

    const closeForm = () => {
        navigate(`/users/${userId}/profile-posts`);
    };

    useEffect(() => {
        const handler = (e) => {
            if (deletePostRef.current && !deletePostRef.current.contains(e.target)) {
                closeForm();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [navigate]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitDeletePostLoading(true);
        try {
            const response = await deletePostMutation.mutateAsync(postId);
            if (response) {
                setModalInfo({ status: "success", message: "Post deleted successfully!" });
            }
        } catch (error) {
            setModalInfo({ status: "error", message: error.response.data.message });
        } finally {
            closeForm();
        }
    };

    return (
        <div className="overlay">
            <div className="create-commission-service modal-form type-3" ref={deletePostRef} onClick={(e) => { e.stopPropagation(); }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={closeForm}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>

                <h2 className="form__title">Xóa tác phẩm</h2>
                <div className="form-field">
                    <p className="text-align-center">Bạn có chắc muốn xóa tác phẩm này không?
                        <br />
                        Thông tin về tác phẩm sẽ bị xóa vĩnh viễn khỏi Pastal.</p>
                </div>
                <div className="form-field">
                    {errors.serverError && <span className="form-field__error">{errors.serverError}</span>}
                </div>

                <div className="form-field">
                    <button
                        type="submit"
                        className="form-field__input btn btn-2 btn-md"
                        onClick={handleSubmit}
                        disabled={isSubmitDeletePostLoading}
                    >
                        {isSubmitDeletePostLoading ? (
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