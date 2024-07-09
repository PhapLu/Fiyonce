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

export default function RenderConversation({ conversationId }) {
    console.log(conversationId)
    const { userInfo } = useAuth();
    
    const fetchConversation = async () => {
        try {
            // const response = await apiUtils.get(`/conversation/readConversation${conversationId}`);
            // console.log(response.data.metadata.conversation)
            // return response.data.metadata.conversation;
            return {
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>

                </div>
            </div>
        </div>
    )
}