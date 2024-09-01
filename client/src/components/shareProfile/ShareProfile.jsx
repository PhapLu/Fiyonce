// Imports
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShareSocial } from 'react-share-social'

// Styling
import "./ShareProfile.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getSocialLinkIcon } from "../../utils/iconDisplayer";
import { useModal } from "../../contexts/modal/ModalContext";

export default function ShareProfile({ profileInfo, setShowMoreProfileActions, setOverlayVisible }) {
    const { setModalInfo } = useModal();
    const [shareProfileOption, setShareProfileOption] = useState("social-media");
    const [showCardVisitSide, setShowCardVisitSide] = useState("front");

    // Toggle display modal form
    const shareProfileRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (shareProfileRef && shareProfileRef.current && !shareProfileRef.current.contains(e.target)) {
                setShowMoreProfileActions(false);
                setOverlayVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    const handleCopyReferralCode = () => {
        if (profileInfo?.referral?.code) {
            navigator.clipboard.writeText(profileInfo.referral.code).then(() => {
                setModalInfo({
                    status: "success",
                    message: "Đã sao chép mã giới thiệu"
                })
            }).catch(err => {
                setModalInfo({
                    status: "error",
                    message: "Sao chép mã giới thiệu thất bại"
                })
            });
        }
    };

    const copyUrlToClipboard = () => {
        const url = `${window.location.origin}/users/${profileInfo?._id}`;
        navigator.clipboard.writeText(url).then(() => {
            setModalInfo({
                status: "success",
                message: "Đã sao chép URL trang cá nhân"
            })
        }).catch(err => {
            setModalInfo({
                status: "error",
                message: "Sao chép URL trang cá nhân thất bại"
            })
        });
    };


    return (
        <div className="modal-form type-3 share-profile" ref={shareProfileRef}>
            <h2 className="form__title">Chia sẻ trang cá nhân</h2>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 form__close-ic" onClick={() => {
                setShowMoreProfileActions(false);
                setOverlayVisible(false);
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <br />
            <div className="share-profile__header text-align-center">
                <button className={`btn ${shareProfileOption == "social-media" ? "btn-2" : "btn-3"} mr-8 br-16`} onClick={() => { setShareProfileOption("social-media") }}>Mạng xã hội</button>
                <button className={`btn ${shareProfileOption == "qr-code" ? "btn-2" : "btn-3"} mr-8 br-16`} onClick={() => { setShareProfileOption("qr-code") }}>QR Code</button>
                <button className={`btn ${shareProfileOption == "card-visit" ? "btn-2" : "btn-3"} mr-8 br-16`} onClick={() => { setShareProfileOption("card-visit") }}>Card Visit</button>
            </div>
            <hr className="mb-16" />
            <div className="share-profile__content">
                {
                    shareProfileOption == "qr-code" ? (
                        <div className="qr-code">
                            <br />
                            <div className="qr-code__content border-text text-align-center flex-justify-center p-16">
                                <LazyLoadImage effect="blur" className="share-profile__content__qr-code" src={profileInfo?.qrCode} alt="" />
                            </div>

                            <p className="text-align-center fs-italic">QR Code tạo ra bởi Pastal</p>
                        </div>
                    ) : shareProfileOption == "card-visit" ? (
                        <div className="card-visit">
                            <div className="card-visit--header">
                                <span className={`text-align-center mr-16 ${showCardVisitSide == "front" ? "active" : ""}`} onClick={() => { setShowCardVisitSide("front") }}>Mặt trước</span>
                                <span className={`text-align-center ${showCardVisitSide == "behind" ? "active" : ""}`} onClick={() => { setShowCardVisitSide("behind") }}>Mặt sau</span>
                            </div>

                            {showCardVisitSide == "front" ? (
                                <>
                                    <div className="card-visit__front-side">
                                        <div className="card-visit__front-side--left">
                                            <LazyLoadImage effect="blur" src={profileInfo?.avatar} className="card-visit__front-side__avatar" />
                                            <LazyLoadImage effect="blur" src={profileInfo?.qrCode} className="card-visit__front-side__qr-code" />

                                        </div>
                                        <div className="card-visit__front-side--right">
                                            <span className="flex-align-center mt-8 mb-8 fs-22 fw-bold">{profileInfo?.fullName}</span>

                                            <span className="flex-align-center mb-8">{profileInfo?.stageName} {
                                                profileInfo?.jobTitle &&
                                                (
                                                    <>
                                                        <span className="dot-delimiter sm ml-8 mr-8"></span> {profileInfo?.jobTitle}
                                                    </>
                                                )
                                            } </span>
                                            <span className="flex-align-center">
                                                <strong>{profileInfo?.followers?.length}</strong>
                                                &nbsp;
                                                <span>người theo dõi</span>
                                                <span className="dot-delimiter sm ml-8 mr-8"></span>
                                                <strong>{profileInfo?.followers?.length}</strong>
                                                &nbsp;
                                                <span>đang theo dõi</span>
                                            </span>
                                            <br />
                                            <span className="text-align-justify mt-8">
                                                {profileInfo?.bio}
                                            </span>
                                            <br />
                                            <div className="flex-align-center mt-16">
                                                {profileInfo?.socialLinks?.map((socialLink, index) => {
                                                    return <>
                                                        <Link key={index} to={socialLink} target="_blank" className="flex-align-center mr-8" dangerouslySetInnerHTML={{ __html: getSocialLinkIcon(socialLink, true) }}>
                                                        </Link>
                                                    </>

                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="card-visit__behind-side">
                                        <img className="card-visit__behind-side__bg" src={profileInfo?.bg} alt="" />
                                        <div className="card-visit__behind-side__content">
                                            <img className="card-visit__behind-side__avatar" src={profileInfo?.avatar} alt="" />
                                            <h2>{profileInfo?.fullName}</h2>
                                        </div>
                                    </div>
                                </>

                            )}
                        </div>
                    ) : shareProfileOption == "social-media" ? (

                        <div className="social-media text-align-center">
                            {/*  flex-align-center flex-justify-center */}

                            <p className="flex-justify-center flex-align-center  mt-32">Mã giới thiệu: {profileInfo?.referral?.code}
                                <svg onClick={handleCopyReferralCode} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-16 size-6 hover-cursor-opacity">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                </svg>
                            </p>

                            <div className="flex-justify-center flex-align-center">
                                <div aria-label="Copy URL" className="hover-display-label hover-cursor-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 copy-profile-url-ic " onClick={copyUrlToClipboard}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                    </svg>
                                </div>

                                <ShareSocial
                                    url={window.location.href}  // Pass the current URL
                                    media={window.location.href}  // Pass the current URL
                                    socialTypes={['facebook', 'twitter', 'reddit', 'linkedin', 'pinterest', 'telegram']}
                                    // title={profileInfo?.fullName}  // Pass the title of the news article
                                    // Optionally, you can add more props like description, hashtags, etc.
                                    description={`Trang cá nhân của ${profileInfo?.fullName}`}
                                    hashtags={['Pastal', 'News']}
                                />
                            </div>

                        </div>
                    ) :
                        ""
                }
            </div>
        </div >
    )
}