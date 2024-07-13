import { useQuery } from "react-query";
import RenderConversation from "../../components/crudConversation/render/RenderConversation.jsx";
import { createContext, useState, useContext, useEffect } from 'react';
import { apiUtils } from "../../utils/newRequest.js";

const ConversationContext = createContext();

export const useConversation = () => {
    return useContext(ConversationContext);
};


export const ConversationProvider = ({ children }) => {
    const [otherMember, setOtherMember] = useState();
    const [showRenderConversation, setShowRenderConversation] = useState(false);

    const fetchConversation = async (otherMember) => {
        try {
            console.log(otherMember)
            const response = await apiUtils.get(`/conversation/readConversationWithOtherMember/${otherMember._id}`);
            const conversationData = response.data.metadata.conversation;
            console.log("FETCHED CONVERSATION DATA")
            console.log(conversationData)
            return conversationData;
        } catch (error) {
            console.log(error);
            return {
                _id: "",
                otherMember: otherMember,
                messages: [],
            }
        }
    };


    const { data: conversation, error, isLoading } = useQuery(
        ['fetchConversation', otherMember],
        () => fetchConversation(otherMember),
        {
            enabled: !!otherMember, // Only run query if otherMember is set
        }
    );

    useEffect(() => {
        if (otherMember) {
            setShowRenderConversation(true);
        }
    }, [otherMember]);

    const value = {
        otherMember,
        setOtherMember,
        conversation,
        showRenderConversation,
        setShowRenderConversation,
        isLoading,
        error,
    };

    return (
        <ConversationContext.Provider value={value}>
            {showRenderConversation && !isLoading && (
                <RenderConversation />
            )}
            {children}
        </ConversationContext.Provider>
    );
};
