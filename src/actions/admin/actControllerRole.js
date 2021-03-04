import callApi from "../../utils/apiCaller";
import { GET_ALL, GET_MODEL, CHANGE_FIELD } from '../../constants/ActionTypes';

const URL = "admin/controllerRole";

export function actGetAll(models, total) {
    return {
        type: GET_ALL,
        models,
        total
    }
}

export function actGetAllRequest(data) {
    return dispatch => {
        return callApi(`${URL}`, 'POST', data).then(res => {
            if (res && res.data) {
                let results = res.data;
                dispatch(actGetAll(results.models, results.total));
            }
        });
    }
}

export function actGetRequest(_id) {
    return dispatch => {
        return callApi(`${URL}/${_id}`, 'GET').then(res => {
            if (res && res.data) {
                let result = res.data;
                if (result.success) {
                    dispatch({ type: GET_MODEL, model: result.model });
                }

                return result;
            }
        });
    }
}

export function actEditRequest(data) {
    return dispatch => {
        return callApi(`${URL}/${data._id}`, 'PUT', data).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}

export function actAddRequest(data) {
    return dispatch => {
        return callApi(`${URL}/add`, 'POST', data).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}

export function actDelRequest(_id) {
    return dispatch => {
        return callApi(`${URL}/${_id}`, 'DELETE').then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}

export function actDelAllRequest(arr_id) {
    return dispatch => {
        return callApi(`${URL}/deleteAll`, 'POST', arr_id).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}

export function actGetControllers(type, _id) {
    return dispatch => {
        return callApi(`${URL}/getControllers/${type}/${_id}`).then(res => {
            if (res && res.data) {
                if (res.data.controllers) return res.data.controllers;
                return [];
            }
        });
    }
}

export function actChangeOrderRequest(_id, sort) {
    return dispatch => {
        return callApi(`${URL}/changeOrder/${_id}/${sort}`).then(res => {
            if (res && res.data) {
                let result = res.data;
                if (result.success) {
                    dispatch({ type: CHANGE_FIELD, field: "sort", model: result.model });
                }
                return result;
            }
        });
    }
}