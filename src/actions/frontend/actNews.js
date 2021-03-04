import callApi from "../../utils/apiCaller";
import { GET_ALL } from '../../constants/ActionTypes';

const URL_API = "frontend/news";

export function actGetAll(models, total) {
    return {
        type: GET_ALL,
        models,
        total
    }
}

export function actGetAllRequest(data) {
    return dispatch => {
        return callApi(`${URL_API}`, 'POST', data).then(res => {
            if (res && res.data) {
                let results = res.data;
                dispatch(actGetAll(results.models, results.total));
            }
        });
    }
}

export function actCheckAliasRequest(alias) {
    return dispatch => {
        return callApi(`${URL_API}/checkNew`, 'POST', { alias }).then(res => {
            if (res && res.data) {
                let results = res.data;
                return results;
            }
        });
    }
}

export function actCheckAliasCateNewRequest(data) {
    return dispatch => {
        return callApi(`${URL_API}/checkCateNew`, 'POST', data).then(res => {
            if (res && res.data) {
                let results = res.data;
                return results;
            }
        });
    }
}