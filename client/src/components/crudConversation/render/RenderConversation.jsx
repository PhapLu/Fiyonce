// Imports
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

// Components

// Contexts
import { useAuth } from "../../../contexts/auth/AuthContext";

// Utils

// Styling
import "./RenderConversation.scss";
import { format } from "date-fns";
import { useModal } from "../../../contexts/modal/ModalContext";

export default function RenderConversation({ conversationId, handleCloseConversation, handleMinimizeConversation }) {
    const { userInfo } = useAuth();
    const { setModalInfo } = useModal();
    const [showMediaOptions, setShowMediaOptions] = useState(false);

    const fetchConversation = async () => {
        try {
            // const response = await apiUtils.get(/conversation/readConversation${conversationId});
            // console.log(response.data.metadata.conversation)
            // return response.data.metadata.conversation;
            return {
                _id: 1,
                otherMember: {
                    _id: "2344543t43t34t",
                    avatar: "https://i.pinimg.com/236x/ce/a4/5d/cea45d24881883cc2d41cce36ce78dbb.jpg",
                    fullName: "John Doe",
                },
                messages: [
                    {
                        senderId: "2344543t43t34t",
                        content: "Hello bro",
                        createdAt: "2024-08-07",
                    },
                    {
                        senderId: "2344543t43t34t",
                        content: "Hello bro",
                        createdAt: "2024-08-07",
                    },
                    {
                        senderId: "665edd23fa87b27398b73d10",
                        content: "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                        createdAt: "2024-08-07",
                    },
                    {
                        senderId: "2344543t43t34t",
                        content: "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                        createdAt: "2024-08-07",
                    },
                ]

            }
        } catch (error) {
            return null;
        }
    }

    const { data: conversation, error: fetchingConversation, isError: isFetchingConversationError, isLoading: isFetchingConversationLoading } = useQuery(
        'fetchConversation',
        fetchConversation,
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching conversation:', error);
            },
        }
    );

    const messagesEndRef = useRef(null);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation]);


    const [message, setMessage] = useState(null);
    const [image, setImage] = useState(null);

    const handleSendMessage = async () => {
        const fd = new FormData();
        if (message) {
            fd.append("content", message);
        }
        if (image) {
            fd.append("media", image);
        }
        try {
            console.log(message)
            // const response = await apiUtils.post(`/conversation/sendMessage/${conversationId}`, fd);
            // console.log(response.data);
            // Simulate adding the message to the conversation
            if (response) {
                const newMessage = {
                    senderId: userInfo._id,
                    content: message,
                    image: URL.createObjectURL(image),
                    createdAt: new Date().toISOString(),
                };
                conversation.messages.push(newMessage);
            }
        } catch (error) {
            setModalInfo({ status: "error", message: error.response.data.message });
        }
    }


    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const mediaOptionsRef  = useRef(null);
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

    if (isFetchingConversationLoading) {
        return <span>Loading</span>
    }

    return (
        <div className="render-conversation">
            <div className="user md">
                <div className="user--left">
                    <img src={conversation?.otherMember?.avatar} alt="" className="user__avatar" />
                    <div className="user__name">
                        <div className="user__name__title">{conversation?.otherMember?.fullName}</div>
                        <div className="user__name__sub-title">{`${conversation?.lastMember?.id === userInfo._id ? "Bạn :" : ""}`} {conversation?.lastMessage?.content}</div>
                    </div>
                </div>
                <div className="user--right">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-8" onClick={() => { handleMinimizeConversation }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                    </svg>

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6" onClick={() => { handleCloseConversation }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
            <div className="message-container" ref={mediaOptionsRef}>
                {conversation.messages?.length > 0 && (
                    conversation.messages.map((message, index) => {
                        return (
                            <div key={index} className={`message-item mb-4" ${message.senderId === userInfo._id ? "right" : "left"}`}>
                                <div className="message-item__content">
                                    {message.content}
                                </div>
                            </div>
                        )
                    }))}
            </div>
            <div className="send-message flex-space-between flex-align-center">
                <div className="send-message--left">
                    <input id="image-upload" type="file" onChange={handleImageChange} style={{ display: "none" }} />
                    {
                        message ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover-cursor-opacity" onClick={() => setShowMediaOptions(!showMediaOptions)}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                {
                                    showMediaOptions && (
                                        <div className="media-option-container">
                                            <div className="media-option-item flex-align-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-8 hover-cursor-opacity">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                                                </svg>
                                                Chọn emoji
                                            </div>
                                            <div className="media-option-item flex-align-center">
                                                <label htmlFor="image-upload">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover-cursor-opacity mr-8">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                    </svg>
                                                </label>
                                                Chọn hình ảnh
                                            </div>
                                        </div>
                                    )
                                }
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-8 hover-cursor-opacity">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                                </svg>
                                <label htmlFor="image-upload">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover-cursor-opacity">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                </label>
                            </>
                        )
                    }
                </div>
                <div className={`send-message--middle ${message || image ? "typing" : ""}`}>
                    {
                        image && (<img className="preview-img" src={URL.createObjectURL(image)} />)
                    }
                    <input type="text" onChange={(e) => setMessage(e.target.value)} placeholder="Nhấn Enter để gửi" />
                </div>
                <div className="send-message--right">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover-cursor-opacity">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </div>
            </div>
        </div >
    )
}