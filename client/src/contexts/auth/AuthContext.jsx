// Imports
import { createContext, useState, useContext, useEffect } from 'react';
import { useQuery } from 'react-query'
import Cookies from 'js-cookie';

// Contexts
import { useModal } from "../../contexts/modal/ModalContext.jsx";

// Utils
import { newRequest, apiUtils } from "../../utils/newRequest";
import { formatEmailToName } from "../../utils/formatter";
// import socketIOClient from 'socket.io-client';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const {setModalInfo} = useModal();
    const [showResetPasswordVerificationForm, setShowResetPasswordVerificationForm] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
    const [showSetNewPasswordForm, setShowSetNewPasswordForm] = useState(false);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRegisterVerificationForm, setShowRegisterVerificationForm] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    // const [socket, setSocket] = useState(null);
    // useEffect(() => {
    //     if (userInfo) {
    //         const newSocket = socketIOClient('http://localhost:3000'); // Adjust URL to your backend
    //         setSocket(newSocket);

    //         newSocket.on('connect', () => {
    //             console.log('Connected to socket server with ID:', newSocket.id);
    //         });

    //         newSocket.on('disconnect', () => {
    //             console.log('Disconnected from socket server');
    //         });

    //         return () => {
    //             newSocket.disconnect();
    //         };
    //     }
    // }, [userInfo]);

    // Fetch user profile data
    const fetchUserProfile = async () => {
        try {
            const response = await newRequest.get('user/me');
            return response.data.metadata.user;
        } catch (error) {
            // console.log(error.response)
            return null;
        }
    };

    useEffect(() => {
        if (!userInfo) {
            setLoading(false); // Stop loading if there's no user info
        }
    }, [userInfo]);

    const { data, error, isError, isLoading } = useQuery('fetchUserProfile', fetchUserProfile, {
        enabled: !!userInfo, // Only fetch user profile if userInfo is not null
        onError: (error) => {
            console.error('Error fetching user profile:', error);
        },
        onSuccess: (data) => {
            if (data) {
                data.displayName = formatEmailToName(data.email);
                setUserInfo(data);
            }
            setLoading(false);
        },
    });


    if (isLoading) {
        return <span>Đang tải...</span>
    }

    if (isError) {
        return <span>Có lỗi xảy ra: {error.message}</span>
    }

    const login = async (email, password) => {
        try {
            const response = await newRequest.post("auth/users/login", { email, password });
            // alert("Successfully logged in as: " + response.data.metadata.user.email);
            setUserInfo(response.data.metadata.user);
            setShowLoginForm(false);
            setOverlayVisible(false);
        } catch (error) {
            setModalInfo({
                status: "error",
                message: error.response.data.message
            })
        }
    };

const logout = async () => {
    alert("Log out")
    console.log("Log out")
    try {
        await apiUtils.post("auth/users/logout");
        setUserInfo(null);
        Cookies.remove('token'); // Remove token cookie
        localStorage.removeItem('token'); // Remove token from localStorage if used
    } catch (error) {
        console.error('Logout error:', error);
    }
};


const value = {
    showLoginForm,
    setShowLoginForm,
    showResetPasswordForm,
    setShowResetPasswordForm,
    showMenu,
    setShowMenu,
    showSetNewPasswordForm,
    showResetPasswordVerificationForm,
    setShowResetPasswordVerificationForm,
    setShowSetNewPasswordForm,
    showRegisterForm,
    setShowRegisterForm,
    overlayVisible,
    setOverlayVisible,
    userInfo,
    setUserInfo,
    login,
    logout,
    loading,
    showRegisterVerificationForm,
    setShowRegisterVerificationForm
};

return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
);
};