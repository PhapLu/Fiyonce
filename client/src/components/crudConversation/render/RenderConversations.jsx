import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../../contexts/auth/AuthContext";
import "./RenderConversations.scss";
import { apiUtils } from "../../../utils/newRequest";
import { formatTimeAgo, limitString } from "../../../utils/formatter";
import { useConversation } from "../../../contexts/conversation/ConversationContext";

export default function RenderConversations({ setShowRenderConversation, setShowRenderConversations }) {
    const { userInfo } = useAuth();
    const { setOtherMember } = useConversation();

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

    const handleConversationClick = (conversation) => {
        setOtherMember(conversation.otherMember)
        setShowRenderConversations(false);
        setShowRenderConversation(true);
    }

    if (isFetchingConversationsLoading) {
        return;
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
                                        <div className={`user__name__sub-title flex-align-center ${userInfo?.unSeenConversations?.some(unSeenConversation => unSeenConversation._id === conversation._id) && "fw-bold"}`}>
                                            {`${conversation?.lastMember?.id === userInfo._id ? "Bạn :" : ""}`} {limitString(conversation?.lastMessage?.content, 10) || (conversation?.lastMessage?.media && (conversation?.lastMessage?.senderId === userInfo._id ? "Bạn đã gửi một ảnh" : "Đã gửi một ảnh"))}
                                            <span className="dot-delimiter sm"></span>
                                            <span className="fs-12 downlight-text fw-500">{formatTimeAgo(conversation.updatedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                                {
                                    userInfo?.unSeenConversations?.some(unSeenConversation => unSeenConversation._id === conversation._id) &&
                                    <div className="user--right unseen-dot">

                                    </div>
                                }
                            </div>
                        ))
                    ) : (
                        <p>Hiện chưa có cuộc trò chuyện nào</p>
                    )}
                </div>
            </div>
        </>
    )
}