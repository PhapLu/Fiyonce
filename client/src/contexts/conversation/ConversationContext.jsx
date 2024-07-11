import RenderConversation from "../../components/crudConversation/render/RenderConversation.jsx";
import { createContext, useState, useContext, useEffect } from 'react';

const ConversationContext = createContext();

export const useConversation = () => {
    return useContext(ConversationContext);
};

export const ConversationProvider = ({ children }) => {
    const [conversation, setConversation] = useState();
    const [showRenderConversation, setShowRenderConversation] = useState();

    const value = {
        conversation, setConversation, showRenderConversation, setShowRenderConversation
    };

    return (
        <ConversationContext.Provider value={value}>
            {showRenderConversation &&
                <RenderConversation conversationProp={conversation} setShowRenderConversation={setShowRenderConversation}/>
            }
            {children}
        </ConversationContext.Provider>
    );
};