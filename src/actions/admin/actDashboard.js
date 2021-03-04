import callApi from "../../utils/apiCaller";
import { GET_ALL, CHANGE_FIELD, GET_MODEL } from '../../constants/ActionTypes';

const URL = "admin/dashboard";

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


export function actGetAllBankRequest() {
    return dispatch => {
        return callApi(`${URL}/getAllBank`).then(res => {
            if (res && res.data) {
                if (res.data.models) return res.data.models;
                return [];
            }
        });
    }
}

//
export function actTotalRevenue(data) {
    return dispatch => {
        return callApi(`${URL}/getTotalRevenue`, 'POST', {date : data}).then(res => {
            if (res && res.data) {
                if (res.data.totals) return res.data.totals;
                return [];
            }
        });
    }
}
export function actTotalExpenditure(data) {
    return dispatch => {
        return callApi(`${URL}/getTotalExpenditure`, 'POST', { date: data }).then(res => {
            if (res && res.data) {
                if (res.data.totals) return res.data.totals;
                return [];
            }
        });
    }
}
export function actTotalMonthRevenue(start, end) {
    return dispatch => {
        return callApi(`${URL}/getTotalMonthRevenue`, 'POST', { start_date: start, end_date: end })
        .then(res => {
            if (res && res.data) {
                if (res.data.totals) return res.data.totals;
                return [];
            }
        });
    }
}

export function actTotalMonthExpenditure(start, end) {
    return dispatch => {
        return callApi(`${URL}/getTotalMonthExpenditure`, 'POST', { start_date: start, end_date: end })
        .then(res => {
            if (res && res.data) {
                if (res.data.totals) return res.data.totals;
                return [];
            }
        });
    }
}

export function actgetDataChart() {
    return dispatch => {
        return callApi(`${URL}/getDataChart`).then(res => {
            if (res && res.data) {
                if (res.data.models) return res.data.models;
                return [];
            }
        });
    }
}

////////
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


