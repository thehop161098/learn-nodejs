const axios = require('axios');
const { API_URL } = require('../config/Config');

module.exports = function callApi(action, method = 'GET', data = null) {
    let config = {
        method: method,
        url: `${API_URL}/${action}`,
        data: data
    };
    return axios(config);
}