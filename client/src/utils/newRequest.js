import axios from 'axios';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

const newRequest = axios.create({
    baseURL: "http://localhost:3000/v1/api/",
    withCredentials: true,
});

const getLoggedInRequestConfig = (data) => {
    let contentType = 'application/json';
    if (data instanceof FormData) {
        contentType = 'multipart/form-data';
    }
    return {
        headers: {
            "Content-Type": contentType,
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
        const requestConfig = { ...getLoggedInRequestConfig(data), ...config };
        return newRequest.post(url, data, requestConfig);
    },

    async patch(url, data = {}, config = {}) {
        const requestConfig = { ...getLoggedInRequestConfig(data), ...config };
        return newRequest.patch(url, data, requestConfig);
    },

    async delete(url, config = {}) {
        const requestConfig = { ...getLoggedInRequestConfig(), ...config };
        return newRequest.delete(url, requestConfig);
    }
};

export { newRequest, apiUtils };

// Example usage with JSON data
const userId = "12345";
const jsonInputs = {
    name: "John Doe",
    email: "john.doe@example.com",
    // other fields
};

