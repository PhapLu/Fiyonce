import React, { useContext } from 'react';
import "./Sidebar.scss";
import {useAuth} from "../../contexts/auth/AuthContext";

export default function Sidebar() {
    const { userInfo, setUserInfo} = useAuth();
    return (
        <div className="sidebar">
            <img src={userInfo.avatar} alt="" className="sidebar__avatar" />
            h3.sidebar__
        </div>
    )
}