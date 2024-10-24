

// Styling
import {
    FacebookIcon,
    TwitterIcon,
    PinterestIcon,
    EmailShareButton,
    FacebookShareButton,
    GabShareButton,
    HatenaShareButton,
    InstapaperShareButton,
    LineShareButton,
    LinkedinShareButton,
    LivejournalShareButton,
    MailruShareButton,
    OKShareButton,
    PinterestShareButton,
    PocketShareButton,
    RedditShareButton,
    TelegramShareButton,
    TumblrShareButton,
    TwitterShareButton,
    ViberShareButton,
    VKShareButton,
    WhatsappShareButton,
    WorkplaceShareButton,
} from "react-share";

import "./ShareToSocials.scss"
import { useModal } from "../../contexts/modal/ModalContext";

export default function ShareToSocials({ post }) {
    // Contexts
    const { setModalInfo } = useModal();

    // Handle share posts
    const url = window.location.href;

    const handleShare = (platform, itemId) => {
        // Extract the base URL (excluding the query string)
        const baseUrl = url.split('?')[0];

        // Extract the query parameters (everything after the '?')
        const queryParams = url.split('?')[1] || '';

        // URL to share (base URL updated to include '/posts/itemId' and existing query params)
        const shareUrl = `${baseUrl.replace(/\/$/, '')}/posts/${itemId}${queryParams ? `?${queryParams}` : ''}`;

        // URL to share
        switch (platform) {
            case 'copy':
                if (url.includes("profile-posts")) {
                    navigator.clipboard.writeText(`${url}/${itemId}`);
                } else {
                    navigator.clipboard.writeText(shareUrl)
                }

                break;
            default:
                break;
        }

        setModalInfo({ status: "success", message: "Đã sao chép đường dẫn" });
    };



    return (
        <div className="share-to-socials">
            <h4 className="text-align-center">Chia sẻ đến</h4>
            <hr />
            <div className="share-to-socials-container">
                <button className="share-to-socials-item btn hover-cursor-opacity gray-bg-hover" onClick={() => handleShare('copy', post._id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                    </svg>
                    Sao chép đường dẫn
                </button>
                <button className="share-to-socials-item btn hover-cursor-opacity gray-bg-hover">
                    <FacebookShareButton className="flex-align-center" url={`${url}${post._id}`} title={"Share to Facebook"}>
                        <FacebookIcon size={36} round />
                        Share to Facebook
                    </FacebookShareButton>
                </button>

                <button className="share-to-socials-item btn hover-cursor-opacity gray-bg-hover">
                    <TwitterShareButton className="flex-align-center" url={`${url}${post._id}`} title={"Share to Facebook"}>
                        <TwitterIcon size={36} round />
                        Share to Twitter
                    </TwitterShareButton>
                </button>

                <button className="share-to-socials-item btn hover-cursor-opacity gray-bg-hover">
                    <PinterestShareButton media={`${url}${post._id}`} className="flex-align-center" url={`${url}${post._id}`} title={"Share to Facebook"}>
                        <PinterestIcon size={36} round />
                        Share to Pinterest
                    </PinterestShareButton>
                </button>
                {/* <button className="share-to-socials-item w-100 btn" onClick={() => handleShare('x', post._id)}>Share to X</button>
                                                                <button className="share-to-socials-item btn" onClick={() => handleShare('messenger', post._id)}>Share to Messenger</button>
                                                                <button className="share-to-socials-item btn" onClick={() => handleShare('facebook', post._id)}>Share to Facebook</button>
                                                                <button className="share-to-socials-item btn" onClick={() => handleShare('instagram', post._id)}>Share to Instagram</button> */}
            </div>
        </div>
    )
}