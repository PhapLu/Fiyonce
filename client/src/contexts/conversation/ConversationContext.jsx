import { useQuery, useQueryClient } from "react-query";
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
    const [conversationFetched, setConversationFetched] = useState(false);
    const queryClient = useQueryClient();

    const fetchConversation = async (otherMember) => {
        try {
            const response = await apiUtils.get(`/conversation/readConversationWithOtherMember/${otherMember._id}`);
            const conversationData = response.data.metadata.conversation;
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
            onSuccess: () => {
                setConversationFetched(true);
            },
            onError: () => {
                setConversationFetched(false);
            }
        }
    );

    useEffect(() => {
        if (otherMember) {
            setShowRenderConversation(false);
            setConversationFetched(false);
            queryClient.invalidateQueries(['fetchConversation', otherMember]);
        }
    }, [otherMember, queryClient]);

    useEffect(() => {
        if (conversationFetched) {
            setShowRenderConversation(true);
        }
    }, [conversationFetched]);

    const value = {
        otherMember: otherMember || {}, // Provide default empty object
        setOtherMember,
        conversation: conversation || {
            _id: "",
            otherMember: otherMember,
            messages: [],
        }, // Provide default empty object
        showRenderConversation: showRenderConversation || false,
        setShowRenderConversation,
        isLoading: isLoading || false,
        error: error || null,
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
