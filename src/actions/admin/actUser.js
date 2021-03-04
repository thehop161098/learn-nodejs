import callApi from "../../utils/apiCaller";
import { GET_ALL, DEL_MODEL, GET_MODEL, EDIT_MODEL, CHANGE_FIELD } from '../../constants/ActionTypes';
const URL = "admin/user";

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
                let models = results.models;
                dispatch(actGetAll(models, results.total));
            }
        });
    }
}

export function actDelRequest(_id) {
    return dispatch => {
        return callApi(`${URL}/${_id}`, 'DELETE').then(res => {
            if (res && res.data) {
                let result = res.data;
                dispatch({ type: DEL_MODEL, _id });

                return result;
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
export function actGetByCodeRequest(code) {
    return dispatch => {
        return callApi(`${URL}/getByCode/${code}`, 'GET').then(res => {
            if (res && res.data) {
                let result = res.data;
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
                if (result.success) {
                    dispatch({ type: EDIT_MODEL, model: result.model });
                }

                return result;
            }
        });
    }
}

export function actEditStatusRequest(_id,status) {
    return dispatch => {
        return callApi(`${URL}/status/${_id}/${status}`, 'PUT').then(res => {
            if (res && res.data) {
                return res.data;
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

export function actGetAllRole() {
    return dispatch => {
        return callApi(`${URL}/getRoles`, 'GET').then(res => {
            if (res && res.data) {
                let result = res.data;
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

export function actGetUser() {
    return dispatch => {
        return callApi(`${URL}/getUser`, 'GET').then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}