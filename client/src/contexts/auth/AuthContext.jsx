import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { newRequest, apiUtils } from "../../utils/newRequest";
import {formatEmailToName} from "../../utils/formatter";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            try {
                let formattedUserInfo = jwtDecode(token);
                formattedUserInfo.displayName = formatEmailToName(formattedUserInfo.email);
                setUserInfo(formattedUserInfo);
            } catch (error) {
                console.error('Failed to decode token:', error);
                Cookies.remove('accessToken');
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const response = await newRequest.post("access/users/login", { email, password });
        // setUserInfo(response.data.metadata.user);
        // console.log('token', response.data.metadata.tokens.accessToken);
        Cookies.set('accessToken', response.data.metadata.tokens.accessToken);

        if (response.data.status == 200) {
            alert("Successfully logged in as: " + response.data.metadata.user.email);
            const formattedUserInfo = response.data.metadata.user;
            setUserInfo(formattedUserInfo);
            setShowLoginForm(false);
            setOverlayVisible(false);
        } else {
            alert("Error: ", response.data.message);
        }

        // const accessToken = response.data.metadata.tokens;
        // const user = response.data.metadata.user;
        // Cookies.set('token', accessToken, { secure: true, sameSite: 'Strict' });
        // setUserInfo(user);
        // setShowLoginForm(false);
        // setOverlayVisible(false);
    };

    const logout = async () => {
        try {
            await apiUtils.post("access/users/logout");

            Cookies.remove('accessToken'); // Ensure you're removing the correct token
            setUserInfo(null); // Ensure you're setting the correct state
        } catch (error) {
            console.error('Logout error:', error);
        }
    };


    const value = {
        showLoginForm,
        setShowLoginForm,
        showRegisterForm,
        setShowRegisterForm,
        overlayVisible,
        setOverlayVisible,
        userInfo,
        setUserInfo,
        login,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};