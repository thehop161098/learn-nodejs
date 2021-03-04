import callApi from "../../utils/apiCaller";
import { } from '../../constants/ActionTypes';

const URL_API = "frontend/user";

export function actRegisterRequest(data) {
    return dispatch => {
        return callApi(`${URL_API}/register`, 'POST', data).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}

export function actEditRequest(data) {
    return dispatch => {
        return callApi(`${URL_API}/editCustomer/${data._id}`, 'PUT', data).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}


export function actReSendCodeRequest(data) {
    return dispatch => {
        return callApi(`${URL_API}/reSendCode`, 'POST', data).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}

export function actActiveAccountRequest(data) {
    return dispatch => {
        return callApi(`${URL_API}/activeAccount`, 'POST', data).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}

export function actForgetPassRequest(data) {
    return dispatch => {
        return callApi(`${URL_API}/forgetPass`, 'POST', data).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}

export function actUpdatePassRequest(data) {
    return dispatch => {
        return callApi(`${URL_API}/updatePass`, 'POST', data).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}

export function actCheckAccountFaceRequest(data) {
    return dispatch => {
        return callApi(`${URL_API}/checkAccountFace`, 'POST', data).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}

export function actSendCodeRequest(_id) {
    return dispatch => {
        return callApi(`${URL_API}/sendCode/${_id}`).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}