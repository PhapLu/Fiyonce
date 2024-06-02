import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

const newRequest = axios.create({
    baseURL: "http://localhost:3000/v1/api/",
    withCredentials: true,
})

const getLoggedInRequestConfig = () => {
    const token = Cookies.get('accessToken');
    if (!token) {
        throw new Error('No access token found');
    }

    const decodedToken = jwtDecode(token);
    return {
        headers: {
            'x-client-id': decodedToken._id,
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    };
};

const apiUtils = {
    async get(url, config = {}) {
        const requestConfig = { ...getLoggedInRequestConfig(), ...config };
        return newRequest.get(url, requestConfig);
    },

    async post(url, data = {}, config = {}) {
        const requestConfig = { ...getLoggedInRequestConfig(), ...config };
        return newRequest.post(url, data, requestConfig);
    },

    async put(url, data = {}, config = {}) {
        const requestConfig = { ...getLoggedInRequestConfig(), ...config };
        return newRequest.put(url, data, requestConfig);
    },

    async delete(url, config = {}) {
        const requestConfig = { ...getLoggedInRequestConfig(), ...config };
        return newRequest.delete(url, requestConfig);
    }
};

export { newRequest, apiUtils };
