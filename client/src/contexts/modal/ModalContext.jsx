import Modal from "../../components/modal/Modal";
import { createContext, useState, useContext, useEffect } from 'react';

const ModalContext = createContext();

export const useModal = () => {
    return useContext(ModalContext);
};

export const ModalProvider = ({ children }) => {
    const [modalInfo, setModalInfo] = useState();

    const value = {
        modalInfo, setModalInfo
    };

    return (
        <ModalContext.Provider value={value}>
            <Modal modalInfo={modalInfo}/>
            {children}
        </ModalContext.Provider>
    );
};