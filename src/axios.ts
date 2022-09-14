import axios, { AxiosError, AxiosResponse } from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: { CompanyID: 1 }
});

instance.interceptors.response.use(function(response: AxiosResponse) {
    return response.data;
}, function(error: AxiosError) {
    return Promise.reject(error.response?.data);
});

export default instance;
