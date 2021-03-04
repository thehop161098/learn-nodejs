import axios from 'axios';
import { toast } from 'react-toastify';
import { POSITION_TOAST } from '../constants/Params';
import { API_URL } from '../constants/Config';
import numeral from 'numeral';
// getFullTime //
const moment = require('moment');

export function setAuthorizationToken(token_user = null) {
    //console.log(token_user)
    if (token_user) {
        axios.defaults.headers.common['Authorization'] = `Optech ${token_user}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
}

export function showToast(message, type = 'success', position = POSITION_TOAST) {
    let options = {};
    if (POSITION_TOAST === 'BOTTOM_RIGHT') {
        options.position = toast.POSITION.BOTTOM_RIGHT;
    }

    switch (type) {
        case 'success':
            return toast.success(message, options);
        case 'error':
            return toast.error(message, options);
        default:
            return toast.warn(message, options);
    }
}

export function getImageFE(image, width = 300, height = 300) {
    if (width === 0) {
        return `${API_URL}/api/getImage?image=${image}`;
    }
    return `${API_URL}/api/getImage?image=${image}&width=${width}&height=${height}`;
}

//Vu
export function deleteObjectProps(obj, array) {
    for (const item of array) {
        (item in obj) && (delete obj[item]);
    }
}

export function isEmptyStr(value = '') {
    value = value.toString();
    let str = value.replace(/ /g, '');
    if (str === null || str === undefined || str === '')
        return true;
    return false;
}

export function rewriteToUpperCase(string) {
    let result = rewriteUrl(string);
    result = result.toUpperCase();
    return result;
}

export function rewriteUrl(string, space = false) {
    string = string.trim();
    if (space) {
        string = string.replace(/ /g, "-");
    }
    string = string.replace(/\s+/g, "");
    string = string.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    string = string.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    string = string.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    string = string.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    string = string.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    string = string.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    string = string.replace(/đ/g, "d");
    string = string.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    string = string.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    string = string.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    string = string.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    string = string.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    string = string.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    string = string.replace(/Đ/g, "D");
    string = string.replace("/", "");
    string = string.replace(":", "");
    string = string.replace("!", "");
    string = string.replace("(", "");
    string = string.replace(")", "");
    string = string.replace(" ", "-");
    string = string.replace("%", "");
    string = string.replace("+", "");
    string = string.replace("'", "");
    string = string.replace("“", "");
    string = string.replace("”", "");
    string = string.replace(",", "");
    string = string.replace("’", "");
    string = string.replace(".", "");
    string = string.replace('"', "");
    string = string.replace('\\', "");
    string = string.replace('//', "");
    string = string.replace('?', "");
    string = string.replace('&', "");
    string = string.toLowerCase();
    return string;
}

export function convertPrice(price, type = 'int') {
    if (price && price !== "") {
        price = price.toString();
        price = price.replace(/,/g, '');
        price = price.replace(/-/g, '');
        if (type === 'int') {
            return parseInt(price);
        } else if (type === 'double') {
            return parseFloat(price);
        }
    }

    return price
}

export function checkPermission(roles_access = [], action = 'action', is_show = true) {
    if (!roles_access.includes(-1) && !roles_access.includes(action)) {
        if (is_show) {
            showToast('Bạn không được phép thực hiện hành động này', 'wanring');
        }
        return false;
    }
    return true;
}

export function formatNumber(num, format = '0,0') {
    return numeral(num).format(format);
}

export function getUrlBE(link) {
    let arr_link = link.split('/');
    if (arr_link[arr_link.length - 1]) delete arr_link[arr_link.length - 1];
    return arr_link.join('/');
}
export function getFullTime(format = "YYYY-MM-DD HH:mm:ss") {
    return moment().format(format);
}
export function convertDate(date, format = "YYYY-MM-DD") {
    if (date && date !== "") {
        let date_convert = moment(new Date(date));
        if (date_convert.isValid()) {
            return date_convert.format(format);
        }
    }
    return "";
}