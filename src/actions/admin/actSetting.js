import callApi from "../../utils/apiCaller";
import { GET_MODEL } from '../../constants/ActionTypes';

const URL = "admin/setting";

export function actGetAllRequest(data) {
    return dispatch => {
        return callApi(`${URL}`).then(res => {
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

export function actAddRequest(data) {
    return dispatch => {
        let formData = new FormData();
        for (var field in data) {
            if (data.hasOwnProperty(field)) {
                if (data[field].lastModified ||
                    [
                        'logo', 'background', 'right_img', 'img_android', 'img_ios',
                        'background_service', 'right_img_service'
                    ].includes(field)) {
                    formData.append(field, data[field]);
                } else {
                    formData.append(field, JSON.stringify(data[field]));
                }
            }
        }

        return callApi(`${URL}/add`, 'POST', formData).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}

export function actSendEmailRequest(data) {
    return dispatch => {
        return callApi(`${URL}/sendEmail`, 'POST', data).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}