import callApi from "../../utils/apiCaller";
import { GET_ALL, GET_MODEL, CHANGE_FIELD, SET_MONEY } from '../../constants/ActionTypes';

const URL = "admin/bank";

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
        let formData = new FormData();
        for (var field in data) {
            if (data.hasOwnProperty(field)) {
                formData.append(field, data[field]);
            }
        }
        return callApi(`${URL}/${data._id}`, 'PUT', formData).then(res => {
            if (res && res.data) {
                let result = res.data;
                if (result.success) {
                    dispatch({ type: SET_MONEY, total: result.total });
                }
                return result;
            }
        });
    }
}

export function actAddRequest(data) {
    return dispatch => {
        let formData = new FormData();
        for (var field in data) {
            if (data.hasOwnProperty(field)) {
                formData.append(field, data[field]);
            }
        }
        return callApi(`${URL}/add`, 'POST', formData).then(res => {
            if (res && res.data) {
                let result = res.data;
                if (result.success) {
                    dispatch({ type: SET_MONEY, total: result.total });
                }
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
                if (result.success) {
                    dispatch({ type: SET_MONEY, total: result.total });
                }
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
                if (result.success) {
                    dispatch({ type: SET_MONEY, total: result.total });
                }
                return result;
            }
        });
    }
}

export function actChangeFieldRequest(data) {
    return dispatch => {
        return callApi(`${URL}/changeField`, 'POST', data).then(res => {
            if (res && res.data) {
                let result = res.data;
                if (result.success) {
                    dispatch({ type: CHANGE_FIELD, field: data.field, model: result.model });
                }
                return result;
            }
        });
    }
}
