import React, { createContext, useState, useContext, useEffect } from 'react';
import { useQuery } from 'react-query'
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { newRequest, apiUtils } from "../../utils/newRequest";
import { formatEmailToName } from "../../utils/formatter";

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



    // Fetch user profile data
    const fetchUserProfile = async () => {
        try {
            const response = await newRequest.get('user/me');
            // console.log(response)
            return response.data.metadata.user;
        } catch (error) {
            // console.log(error.response)
            return null;
        }
    };

    const { data, error, isError, isLoading } = useQuery('fetchUserProfile', fetchUserProfile, {
        onError: (error) => {
            console.error('Error fetching user profile:', error);
        },
        onSuccess: (data) => {
            if (data) {
                data.displayName = formatEmailToName(data.email);
                data.socialLinks = [
                    {
                        "url": "https://facebook.com/nhatluu03",
                    },
                    {
                        "url": "https://tiktok.com/nhatluu2003",
                    },
                ]
                setUserInfo(data);
            }
            setLoading(false);
        },
    });

    if (isLoading) {
        return <span>Đang tải...</span>
    }

    if (isError) {
        return <span>Have an errors: {error.message}</span>
    }

    const login = async (email, password) => {
        const response = await newRequest.post("access/users/login", { email, password });

        if (response.data.status == 200) {
            alert("Successfully logged in as: " + response.data.metadata.user.email);
            const formattedUserInfo = response.data.metadata.user;
            setUserInfo(formattedUserInfo);
            setShowLoginForm(false);
            setOverlayVisible(false);
        } else {
            alert("Error: ", response.data.message);
        }
    };

    const logout = async () => {
        try {
            await apiUtils.post("access/users/logout");
            setUserInfo(null);
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
            {children}
        </AuthContext.Provider>
    );
};