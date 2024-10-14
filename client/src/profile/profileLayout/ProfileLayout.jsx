import { useState, useRef, useEffect } from "react";
import { useQuery } from 'react-query';
import { useParams, useLocation, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../contexts/auth/AuthContext.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import ProfileSidebar from "../profileSidebar/ProfileSidebar";
import CropImage from '../../components/cropImage/CropImage.jsx';
import { newRequest, apiUtils } from "../../utils/newRequest.js";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import RenderBadges from "../../components/crudBadge/render/RenderBadges.jsx";
import "./ProfileLayout.scss";
import { ClipLoader } from "react-spinners";

export default function ProfileLayout() {
    const [profileBtnActive, setProfileNavActive] = useState(null);
    const [uploadBgLoading, setUploadBgLoading] = useState();
    const { userInfo, setUserInfo } = useAuth();
    const { userId } = useParams();
    const [profileInfo, setProfileInfo] = useState();
    const isProfileOwner = userInfo && userInfo?._id === userId;

    const [selectedCoverImage, setSelectedCoverImage] = useState(null);
    const [isCoverCropping, setIsCoverCropping] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(null);
    const [showRenderBadges, setShowRenderBadges] = useState(false);

    const location = useLocation();

    const fetchProfileById = async () => {
        try {
            const response = await newRequest.get(`/user/readUserProfile/${userId}`);
            console.log('Profile fetched:', response);
            return response.data.metadata.user;
        } catch (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
    };

    const { data, error, isError, isLoading } = useQuery(['fetchProfileById', userId], fetchProfileById, {
        onError: (error) => {
            console.error('Error fetching profile:', error);
        },
        onSuccess: (data) => {
            if (data) {
                console.log('Fetched profile:', data);
                setProfileInfo(data);
            }
        },
    });

    // useEffect(() => {
    //     setProfileInfo(data);
    // }, [data, userId]);



    const handleCoverClick = () => {
        document.getElementById('coverPhoto').click();
    };

    const [selectedImage, setSelectedImage] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const handleFileUpload = async (croppedFile) => {
        const formData = new FormData();
        formData.append('file', croppedFile);
        formData.append('type', "bg");
        setUploadBgLoading(true);

        try {
            const response = await apiUtils.post(`/upload/profile/avatarOrCover/${profileInfo._id}`, formData);
            if (response.data.metadata.image_url) {
                setUserInfo({ ...profileInfo, bg: response.data.metadata.image_url });
                setProfileInfo({ ...profileInfo, bg: response.data.metadata.image_url });
                setModalInfo({
                    status: "success",
                    message: "Cập nhật ảnh bìa thành công"
                })
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setUploadBgLoading(false);
    };


    const [image, setImage] = useState("");

    // Callback function when an image is selected
    const onImageSelected = (selectedImg) => {
        setImage(selectedImg);
    };

    // Callback function when cropping is done
    const onCropDone = (imgCroppedArea) => {
        // Create a canvas element to crop the image
        const canvasEle = document.createElement("canvas");
        canvasEle.width = imgCroppedArea.width;
        canvasEle.height = imgCroppedArea.height;

        const context = canvasEle.getContext("2d");

        // Load the selected image
        let imageObj1 = new Image();
        imageObj1.src = image; // Assuming 'image' is a URL or a data URI
        imageObj1.onload = function () {
            // Draw the cropped portion of the image onto the canvas
            context.drawImage(
                imageObj1,
                imgCroppedArea.x,
                imgCroppedArea.y,
                imgCroppedArea.width,
                imgCroppedArea.height,
                0,
                0,
                imgCroppedArea.width,
                imgCroppedArea.height
            );

            // Convert the canvas content to a Blob (JPEG format)
            canvasEle.toBlob((blob) => {
                if (blob) {
                    // Optionally convert the Blob to a File object
                    const croppedFile = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });

                    // Now you can pass croppedFile to handleFileUpload
                    handleFileUpload(croppedFile);

                    // Optionally, you can also create a data URL if you still need it
                    setIsCropping(false);
                    setOverlayVisible(false);
                }
            }, "image/jpeg");
        };
    };


    // Callback function when cropping is canceled
    const onCropCancel = () => {
        setImage("");
        setIsCropping(false);
        setOverlayVisible(false);
    };

    const inputRef = useRef();

    // Handle the change event when a file is selected
    const onChooseImg = () => {
        inputRef.current.click();
    };

    const handleOnChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = function (e) {
                onImageSelected(reader.result);
                setSelectedImage(reader.result);
                setIsCropping(true); // Set isCropping after the image is selected
                setOverlayVisible(true); // Set overlayVisible after the image is selected
            };
        } else {
            // Reset states if no image is selected or the user cancels the file dialog
            setIsCropping(false);
            setOverlayVisible(false);
            setSelectedImage(null);
        }

        // Reset the file input to allow selecting the same file again
        event.target.value = null;
    };



    if (isLoading) {
        return <>
            <br /><br /><br /><br />
            <div className="text-align-center flex-align-center flex-justify-center mt-40">
                <ClipLoader className="clip-loader" size={40} loading={true} />
                <h3 className="ml-12">
                    Đang tải
                </h3>
            </div>
        </>;
    }

    if (isError) {
        return <span>Have an error: {error.message}</span>;
    }

    if (!profileInfo) {
        return;
    }


    return (
        <div className="profile-layout">
            <ProfileSidebar profileInfo={profileInfo} setProfileInfo={setProfileInfo} />

            <div className="outlet-content">
                <div className="profile">
                    <div className="profile__bg">
                        <LazyLoadImage
                            src={profileInfo.bg || "/uploads/pastal_system_default_background.png"}
                            alt={`${profileInfo.fullName}'s cover photo`}
                            className={`mobile-hide profile__bg__img ${uploadBgLoading ? "skeleton-img" : ""}`}
                            effect="blur"
                        />
                        {isProfileOwner && (
                            <>
                                <button className="profile__bg__edit-btn btn btn-md mobile-hide" onClick={onChooseImg}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2.5"
                                        stroke="currentColor"
                                        className="size-6 profile__bg__ic"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 15.75L7.409 10.591a2.25 2.25 0 013.182 0L15.75 15.75m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0L22.75 15.75m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zM12.75 8.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                        />
                                    </svg>
                                    Đổi ảnh nền
                                </button>
                                {/* {isCoverCropping && (
                                        <CropImage
                                            imageSrc={selectedCoverImage}
                                            onCropComplete={handleCoverCropComplete}
                                            onCancel={handleCoverCancelCrop}
                                        />
                                    )} */}

                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={inputRef}
                                    onChange={handleOnChange}
                                    style={{ display: "none" }}
                                />
                            </>
                        )}
                    </div>

                    <div className="sub-nav-container">
                        <div className="sub-nav-container--left">
                            {isProfileOwner ? (userInfo?.role === "talent" ? (
                                <>
                                    <Link
                                        to={`/users/${userId}/profile-commission-services`}
                                        className={`sub-nav-item btn ${location.pathname.includes("/users/") &&
                                            (location.pathname.endsWith("/profile-commission-services") || location.pathname.split("/").length === 3) ? "active" : ""}`}
                                    >
                                        Dịch vụ
                                    </Link>
                                    <Link
                                        to={`/users/${userId}/profile-posts`}
                                        className={`sub-nav-item btn ${location.pathname.includes('/profile-posts') ? "active" : ""}`}
                                    >
                                        Tác phẩm
                                    </Link>
                                    <Link
                                        to={`/users/${userId}/term-of-services`}
                                        className={`sub-nav-item btn ${location.pathname.includes('/term-of-services') ? "active" : ""}`}
                                    >
                                        Điều khoản
                                    </Link>
                                    <Link
                                        to={`/users/${userId}/basic-info`}
                                        className={`sub-nav-item btn ${location.pathname.includes('/basic-info') ? "active" : ""}`}
                                    >
                                        Thông tin cơ bản
                                    </Link>
                                    <Link
                                        to={`/users/${userId}/archive`}
                                        className={`sub-nav-item btn ${location.pathname.includes('/archive') ? "active" : ""}`}
                                    >
                                        Lưu trữ
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to={`/users/${userId}/basic-info`}
                                        className={`sub-nav-item btn ${location.pathname.includes('/basic-info') || location.pathname.split("/").length === 3 ? "active" : ""}`}
                                    >
                                        Thông tin cơ bản
                                    </Link>
                                    <Link
                                        to={`/users/${userId}/archive`}
                                        className={`sub-nav-item btn ${location.pathname.includes('/archive') ? "active" : ""}`}
                                    >
                                        Lưu trữ
                                    </Link>
                                </>
                            )) : (
                                <>
                                    <Link
                                        to={`/users/${userId}/profile-commission-services`}
                                        className={`sub-nav-item btn ${location.pathname.includes("/users/") &&
                                            (location.pathname.endsWith("/profile-commission-services") || location.pathname.split("/").length === 3) ? "active" : ""}`}
                                    >
                                        Dịch vụ
                                    </Link>
                                    <Link
                                        to={`/users/${userId}/profile-posts`}
                                        className={`sub-nav-item btn ${location.pathname.includes('/profile-posts') ? "active" : ""}`}
                                    >
                                        Tác phẩm
                                    </Link>
                                </>
                            )}
                            {/* 
                            {
                                !isProfileOwner?.isPublicArchive && (
                                    <Link
                                        to={`/users/${userId}/archive`}
                                        className={`sub-nav-item btn ${location.pathname.includes('/archive') ? "active" : ""}`}
                                    >
                                        Lưu trữ
                                    </Link>
                                )
                            } */}
                        </div>


                    </div>
                    <hr />
                </div >
                {overlayVisible && (
                    <div className="overlay">

                        {isCropping && (
                            <CropImage
                                image={selectedImage}
                                onCropDone={onCropDone}
                                onCropCancel={onCropCancel}
                                ratio={990 / 220}
                            />
                        )}
                        {showRenderBadges && <RenderBadges setShowRenderBadges={setShowRenderBadges} setOverlayVisible={setOverlayVisible} />}
                    </div>
                )}

                <Outlet context={{ profileInfo, setProfileInfo }} />
            </div >
        </div>
    );
}