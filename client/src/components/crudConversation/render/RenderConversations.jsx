import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../../contexts/auth/AuthContext";
import "./RenderConversations.scss";
import { apiUtils } from "../../../utils/newRequest";
import { formatTimeAgo } from "../../../utils/formatter";

export default function RenderConversations({ setConversation, setShowRenderConversation, setShowRenderConversations }) {
    const { userInfo } = useAuth();

    const fetchConversations = async () => {
        try {
            const response = await apiUtils.get(`/conversation/readConversations`);
            console.log(response.data.metadata.conversations)
            return response.data.metadata.conversations;
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

    // const [activeConversations, setActiveConversations] = useState([{
    //     _id: 1,
    //     otherMember: {
    //         _id: "2344543t43t34t",
    //         avatar: "https://i.pinimg.com/236x/ce/a4/5d/cea45d24881883cc2d41cce36ce78dbb.jpg",
    //         fullName: "John Doe",
    //     },
    //     messages: [
    //         {
    //             senderId: "2344543t43t34t",
    //             content: "Hello bro",
    //             createdAt: "2024-08-07",
    //         },
    //         {
    //             senderId: "2344543t43t34t",
    //             content: "Hello bro",
    //             createdAt: "2024-08-07",
    //         },
    //         {
    //             senderId: "665edd23fa87b27398b73d10",
    //             content: "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //             createdAt: "2024-08-07",
    //         },
    //         {
    //             senderId: "2344543t43t34t",
    //             content: "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //             createdAt: "2024-08-07",
    //         },
    //     ]

    // }]);

    const handleConversationClick = (conversation) => {
        setConversation(conversation);
        setShowRenderConversations(false);
        setShowRenderConversation(true);

        // // Check if the conversation is already in the activeConversations array
        // if (!activeConversations.find(active => active._id === conversation._id)) {
        //     setActiveConversations([...activeConversations, conversation]);
        // }
    }

    if (isFetchingConversationsLoading) {
        return <span>Loading</span>
    }

  

    return (
        <>
            <div className="render-conversations">
                <h2>Tin nhắn</h2>
                <hr />
                <div className="conversation-container">
                    {conversations && conversations.length > 0 ? (
                        conversations.map((conversation, index) => (
                            <div
                                key={index}
                                className="conversation-item user md gray-bg-hover p-4 br-8 mb-8"
                                onClick={() => handleConversationClick(conversation)}
                            >
                                <div className="user--left">
                                    <img src={conversation?.otherMember?.avatar} alt="" className="user__avatar" />
                                    <div className="user__name">
                                        <div className="user__name__title">{conversation?.otherMember?.fullName}</div>
                                        <div className="user__name__sub-title">{`${conversation?.lastMember?.id === userInfo._id ? "Bạn :" : ""}`} {conversation?.lastMessage?.content}</div>
                                    </div>
                                </div>

                                <div className="user--right">
                                    <span className="fs-12 downlight-text">{formatTimeAgo(conversation.createdAt)}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Hiện chưa có cuộc trò chuyện nào</p>
                    )}
                </div>
            </div>
            {/* {activeConversations.length > 0 && (
                <div className="active-conversations">
                    {activeConversations.map((activeConversation, index) => (
                        <div className="user md" key={index}>
                            <div className="user--left">
                                <img src={activeConversation?.otherMember?.avatar} alt="" className="user__avatar" />
                                <div className="user__name">
                                    <div className="user__name__title">{activeConversation?.otherMember?.fullName}</div>
                                    <div className="user__name__sub-title">{`${activeConversation?.lastMember?.id === userInfo._id ? "Bạn :" : ""}`} {activeConversation?.lastMessage?.content}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )} */}
        </>
    )
}