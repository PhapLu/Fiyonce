import React, { useEffect, useContext } from 'react';
import "./Sidebar.scss";
import { useAuth } from "../../contexts/auth/AuthContext";

export default function Sidebar() {
    const { userInfo, setUserInfo } = useAuth();
    useEffect(() => {
        if (!userInfo) {
            return;
        }
    }, [])

    if (!userInfo) {
        return;
    }

    return (
        <div className="sidebar">
            <img src={userInfo.avatar} alt="" className="sidebar__avatar" />
            <h4 className="sidebar__fullname">{userInfo.fullname}</h4>
            <span className="sidebar__email">{userInfo.displayName}</span>

            <div className="sidebar__follow">
                <span className="sidebar__follow__follower">{userInfo.followers.length == 0 ? "Chưa có người theo dõi" : userInfo.followers.length + "Chưa có người theo dõi"}</span>
                -
                <span className="sidebar__follow__following">{userInfo.following.length == 0 ? "Chưa có người theo dõi" : userInfo.following.length + "Chưa có người theo dõi"}</span>
            </div>
            <button className="sidebar__btn btn btn-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
                Chỉnh sửa thông tin
            </button>
            <button className="sidebar__btn btn btn-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
                Nâng cấp tài khoản
            </button>
        </div>
    )
}