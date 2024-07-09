// Imports
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

// Components

// Contexts
import { useAuth } from "../../../contexts/auth/AuthContext";

// Utils

// Styling
import "./RenderConversations.scss";


export default function RenderConversations({setConversation, setShowRenderConversation, setShowRenderConversations}) {
    const { userInfo } = useAuth();

    const fetchConversations = async () => {
        try {
            // const response = await apiUtils.get(`/conversation/readConversations`);
            // console.log(response.data.metadata.conversations)
            // return response.data.metadata.conversations;
            return [
                {
                    _id: 1,
                    lastMessage: {
                        senderId: "2344543t43t34t",
                        content: "Hello bro",
                        createdAt: "2024-08-07",
                    },
                    otherMember: {
                        _id: "2344543t43t34t",
                        avatar: "https://i.pinimg.com/236x/ce/a4/5d/cea45d24881883cc2d41cce36ce78dbb.jpg",
                        fullName: "John Doe",
                    }

                },
                {
                    _id: 1,
                    lastMessage: {
                        senderId: "2344543t43t34t",
                        content: "Hello bro",
                        createdAt: "2024-08-07",
                    },
                    otherMember: {
                        _id: "2344543t43t34t",
                        avatar: "https://i.pinimg.com/736x/c1/77/36/c17736c8b3411879f843809f687658fc.jpg",
                        fullName: "John Doe",
                    }

                },
                {
                    _id: 1,
                    lastMessage: {
                        senderId: "2344543t43t34t",
                        content: "Hello bro",
                        createdAt: "2024-08-07",
                    },
                    otherMember: {
                        _id: "2344543t43t34t",
                        avatar: "https://i.pinimg.com/736x/c1/77/36/c17736c8b3411879f843809f687658fc.jpg",
                        fullName: "John Doe",
                    }

                },
                {
                    _id: 1,
                    lastMessage: {
                        senderId: "2344543t43t34t",
                        content: "Hello bro",
                        createdAt: "2024-08-07",
                    },
                    otherMember: {
                        _id: "2344543t43t34t",
                        avatar: "https://i.pinimg.com/736x/c1/77/36/c17736c8b3411879f843809f687658fc.jpg",
                        fullName: "John Doe",
                    }

                },
                {
                    _id: 1,
                    lastMessage: {
                        senderId: "2344543t43t34t",
                        content: "Hello bro",
                        createdAt: "2024-08-07",
                    },
                    otherMember: {
                        _id: "2344543t43t34t",
                        avatar: "https://i.pinimg.com/736x/c1/77/36/c17736c8b3411879f843809f687658fc.jpg",
                        fullName: "John Doe",
                    }

                },
                {
                    _id: 1,
                    lastMessage: {
                        senderId: "2344543t43t34t",
                        content: "Hello bro",
                        createdAt: "2024-08-07",
                    },
                    otherMember: {
                        _id: "2344543t43t34t",
                        avatar: "https://i.pinimg.com/736x/c1/77/36/c17736c8b3411879f843809f687658fc.jpg",
                        fullName: "John Doe",
                    }

                },
                {
                    _id: 1,
                    lastMessage: {
                        senderId: "2344543t43t34t",
                        content: "Hello bro",
                        createdAt: "2024-08-07",
                    },
                    otherMember: {
                        _id: "2344543t43t34t",
                        avatar: "https://i.pinimg.com/736x/c1/77/36/c17736c8b3411879f843809f687658fc.jpg",
                        fullName: "John Doe",
                    }

                },
            ]
        } catch (error) {
            return null;
        }
    }

    const { data: conversations, error: fetchingConversations, isError: isFetchingConversationsError, isLoading: isFetchingConversationsLoading } = useQuery(
        'fetchConversations',
        fetchConversations,
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.error('Error fetching conversations:', error);
            },
        }
    );

    if (isFetchingConversationsLoading) {
        return <span>Loading</span>
    }

    return (
        <div className="render-conversations">
            <h2>Tin nhắn</h2>
            <hr />
            <div className="conversation-container">
                {conversations && conversations.length > 0 ? (
                    conversations.map((conversation, index) => {
                        return (
                            <div className="conversation-item user md gray-bg-hover p-4 br-8 mb-8" onClick={() => {setConversation(conversation), setShowRenderConversations(false), setShowRenderConversation(true)}}>
                                <div className="user--left">
                                    <img src={conversation?.otherMember?.avatar} alt="" className="user__avatar" />
                                    <div className="user__name">
                                        <div className="user__name__title">{conversation?.otherMember?.fullName}</div>
                                        <div className="user__name__sub-title">{`${conversation?.lastMember?.id === userInfo._id ? "Bạn :" : ""}`} {conversation?.lastMessage?.content}</div>
                                    </div>
                                </div>

                                <div className="user--right">
                                    <span className="fs-12 downlight-text">2h truoc</span>
                                </div>
                            </div>
                        )
                    })

                ) : (
                    <p>Hiện chưa có cuộc trò chuyện nào</p>
                )}
            </div>
        </div>
    )
}