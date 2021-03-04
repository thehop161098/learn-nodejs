import callApi from "../../utils/apiCaller";
import { } from '../../constants/ActionTypes';

const URL_API = "frontend/home";
const URL_DEPOSIT = "frontend/deposit";

export function actGetDatasRequest(data) {
    return dispatch => {
        return callApi(`${URL_API}/getDatas`).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}

export function actDepositRequest(data) {
    return dispatch => {
        return callApi(`${URL_DEPOSIT}/deposit`, 'POST', data).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}