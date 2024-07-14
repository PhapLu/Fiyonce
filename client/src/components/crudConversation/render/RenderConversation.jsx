import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../contexts/auth/AuthContext";
import { useModal } from "../../../contexts/modal/ModalContext";
import { apiUtils, createFormData } from "../../../utils/newRequest";
import "./RenderConversation.scss";
import { useConversation } from "../../../contexts/conversation/ConversationContext";
import { set } from "date-fns";

export default function RenderConversation() {
    const { userInfo, socket } = useAuth();
    if (!userInfo) {
        return;
    }
    const { setModalInfo } = useModal();
    const [showMediaOptions, setShowMediaOptions] = useState(false);
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [media, setMedia] = useState([]);
    const messagesEndRef = useRef(null);
    const [arrivalMessage, setArrivalMessage] = useState();
    const { conversation, setShowRenderConversation } = useConversation();
    const [conversationId, setConversationId] = useState(conversation._id);
    const [messages, setMessages] = useState(conversation?.messages || []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (messages.length) {
            scrollToBottom();
        }
    }, [messages]);


    useEffect(() => {

        socket.on('getMessage', (newMessage) => {
            console.log("NEW MESSAGE")
            console.log(newMessage);
            // alert(newMessage)
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            // conversation?.messages?.push(newMessage);
        });

        return () => {
            socket.off('getMessage');
            socket.emit('removeUser', userInfo._id);
        };
    }, [userInfo._id]);

    const validateInputs = () => {
        let errors = {};
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs((prevState) => ({
            ...prevState,
            [name]: value
        }));
        setErrors((values) => ({ ...values, [name]: '' }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newMedia = media.filter(portfolio => portfolio !== null); // Remove null values
        files.forEach((file) => {
            if (file.size > 10 * 1024 * 1024) {
                setErrors((values) => ({ ...values, media: "Dung lượng ảnh không được vượt quá 10 MB." }));
            } else {
                newMedia.push(file);
            }
        });
        setMedia(newMedia);
    };

    const removeImage = (index) => {
        const newMedia = [...media];
        newMedia.splice(index, 1); // Remove the element at index
        setMedia(newMedia);
    };

    const handleSendMessage = async () => {
        const fd = createFormData(inputs, "media", media);

        try {
            console.log("PASSED CONVERSATION DATA")
            console.log(conversation)
            fd.append("conversationId", conversationId);
            fd.append("otherMemberId", conversation.otherMember._id);

            console.log(conversationId)
            console.log(conversation.otherMember._id)

            const response = await apiUtils.patch(`/conversation/sendMessage`, fd);
            console.log(response)
            console.log(response.data.metadata.conversation._id)
            const newMessage = response.data.metadata.conversation.messages.slice(-1)[0];
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            setInputs({ content: '' });
            setMedia([]);

            setConversationId(response.data.metadata.conversation._id)
            // Add the new message immediately

            // conversation?.messages?.push(newMessage);
            console.log(userInfo._id)
            console.log(conversation.otherMember._id)
            console.log("SENT MESSAGE")
            console.log(newMessage.content)

            socket.emit('sendMessage', {
                senderId: userInfo._id,
                receiverId: conversation.otherMember._id,
                content: newMessage.content
                // media: newMessage.media
            });
        } catch (error) {
            console.log(error);
            // setModalInfo({ status: "error", message: error.response.data.message });
        }
    };


    const mediaOptionsRef = useRef(null);
    const handleClickOutside = (event) => {
        if (mediaOptionsRef.current && !mediaOptionsRef.current.contains(event.target)) {
            setShowMediaOptions(false);
        }
    };

    useEffect(() => {
        if (showMediaOptions) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMediaOptions]);


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    }

    if (!conversation) {
        return
    }

    return (
        <div className="render-conversation">
            <div className="user md">
                <div className="user--left">
                    {arrivalMessage}
                    <img src={conversation?.otherMember?.avatar} alt="" className="user__avatar" />
                    <div className="user__name">
                        <div className="user__name__title">{conversation?.otherMember?.fullName}</div>
                        <div className="user__name__sub-title">{`${conversation?.lastMember?.id === userInfo._id ? "Bạn :" : ""}`} {conversation?.lastMessage?.content}</div>
                    </div>
                </div>
                <div className="user--right">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-8" onClick={() => { setMinimizeConversation(false) }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                    </svg> */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6" onClick={() => { setShowRenderConversation(false) }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
            <div className="message-container" ref={mediaOptionsRef}>
                {messages?.length > 0 ? (
                    messages?.map((message, index) => (
                        <div key={index} className={`message-item mb-4 ${message.senderId === userInfo._id ? "right" : "left"}`}>
                            {message.media?.map((media, index) => {
                                return (
                                    <img key={index} src={media} alt="Media" />
                                )
                            })}
                            {message.content && (
                                <div className="message-item__content">
                                    <span>{message.content}</span>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="mt-32 text-align-center">Bắt đầu cuộc trò chuyện với {conversation?.otherMember?.fullName}.</div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="send-message flex-justify-space-between flex-align-center">
                <div className="send-message--left flex-align-center mr-8">
                    <input id="image-upload" type="file" multiple onChange={handleImageChange} style={{ display: "none" }} />
                    {
                        inputs?.content || media?.length > 0 ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover-cursor-opacity" onClick={() => setShowMediaOptions(!showMediaOptions)}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                {
                                    showMediaOptions && (
                                        <div className="media-option-container">
                                            <label htmlFor="choose-emoji" className="media-option-item flex-align-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-8 hover-cursor-opacity">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                                                </svg>
                                                Chọn emoji
                                            </label>
                                            <label htmlFor="image-upload" className="media-option-item flex-align-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover-cursor-opacity">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                </svg>
                                                Chọn hình ảnh
                                            </label>
                                        </div>
                                    )
                                }
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-8 hover-cursor-opacity">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                                </svg>
                                <label htmlFor="image-upload" className="flex-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover-cursor-opacity">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                </label>
                            </>
                        )
                    }
                </div>

                <div className={`send-message--middle ${inputs?.content || media ? "typing" : ""}`}>
                    {media && media.length > 0 && (
                        <div className="preview-img-container flex-align-center mb-8">
                            {
                                media.map((media, index) => {
                                    return (
                                        <div className="preview-img-item mr-8" key={index}>
                                            <img
                                                src={
                                                    media instanceof File
                                                        ? URL.createObjectURL(media)
                                                        : media
                                                }
                                                alt={`Preview ${index + 1}`}
                                            />
                                            <svg onClick={() => { removeImage(index) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )}
                    <input type="text" name="content" value={inputs.content || ''} onChange={handleChange} placeholder="Nhấn Enter để gửi" onKeyPress={handleKeyPress} />
                </div>
                <div className="send-message--right">
                    <svg onClick={handleSendMessage} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-8 hover-cursor-opacity">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </div>
            </div>
        </div>
    )
}