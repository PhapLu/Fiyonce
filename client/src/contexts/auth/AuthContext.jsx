import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);
    // const [user, setUser] = useState({
    //     "_id": "665929b01937df564df71638",
    //     "fullname": "PhapLuuQuoc",
    //     "email": "phapluu9ithd1@gmail.com",
    //     "password": "$2b$10$o43smcifpQva4ebSyAdBse9p2xL4F6IU7AdaUCfoyPWX5Uj8rMp..",
    //     "role": "member",
    //     "avatar": "https://res.cloudinary.com/fiyonce/image/upload/v1717123227/fiyonce/talentRequests/665929b01937df564df71638/1717123229498-Screenshot%20%2822%29.png.png",
    //     "country": "Vietnam",
    //     "dob": null,
    //     "bookmark": [],
    //     "status": "pending",
    //     "followers": [],
    //     "following": [],
    //     "socialLinks": [],
    //     "createdAt": {
    //       "$date": "2024-05-31T01:36:48.343Z"
    //     },
    //     "updatedAt": {
    //       "$date": "2024-05-31T03:27:01.194Z"
    //     },
    //     "__v": 0
    //   });
    
    const [user, setUser] = useState(null);
    const value = {
        showLoginForm,
        setShowLoginForm,
        showRegisterForm,
        setShowRegisterForm,
        overlayVisible,
        setOverlayVisible,
        user, 
        setUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};