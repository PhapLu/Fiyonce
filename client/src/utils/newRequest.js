import axios from 'axios';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

const newRequest = axios.create({
    baseURL: "https://fiyoncee.onrender.com/",
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

function createFormData(inputs, filesKey, files) {
    const formData = new FormData();

    // Append non-file inputs
    for (const key in inputs) {
        if (inputs.hasOwnProperty(key)) {
            formData.append(key, inputs[key]);
        }
    }

    // Append file inputs
    files.forEach(file => {
        if (file) {
            formData.append(filesKey, file);
        }
    });

    return formData;
}



export { createFormData, newRequest, apiUtils};




