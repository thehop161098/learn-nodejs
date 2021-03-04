import axios from 'axios';
import { API_URL } from '../constants/Config';
import { showToast } from './index';

export default function callApi(action, method = 'GET', data = null, url_api = null) {
    const api = url_api ? url_api : API_URL;
    let config = {
        method: method,
        url: `${api}/${action}`,
        data: data
    };
    return axios(config).catch(err => {
        let message = "Không thể kết nối server";
        if (err.response && err.response.data) {
            const data = err.response.data;
            if (data.message) {
                message = data.message;
            }
        }
        showToast(message, 'error');
    });
}