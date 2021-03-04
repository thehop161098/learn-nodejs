import cookie from 'react-cookies'
import callApi from "../../utils/apiCaller";
import { setAuthorizationToken } from "../../utils";
import {
    CHANGE_PAGE, CHANGE_LIMIT_PAGE, SEARCH_MODEL, SEARCH_MODEL_REFRESH, CHECK_ALL, UNCHECK_ALL,
    CHECK_BTN_ALL, OPEN_FORM, CLOSE_FORM, SET_LOGIN, OPEN_FORM_CUSTOM, CLOSE_FORM_CUSTOM,
    GET_ROUTERS, GET_ROLES, SET_USER, SET_FULLNAME
} from '../../constants/ActionTypes';
import { EXPIRED_COOKIE, IS_HTTP } from '../../constants/Config';
import { BE } from '../../constants/Params';

// action login - logout //
const URL_API = "apiClientRouter";
const HOST_API = 'http://127.0.0.1:3002';

export function actLoginRequest(data) {
    return dispatch => {
        const token_name = "token_fe";
        return callApi(`${URL_API}/checkLogin`, 'POST', data, HOST_API).then(res => {
            if (res && res.data) {
                let result = res.data;
                if (result.success) {
                    const token = result.token;
                    cookie.save(token_name, token, {
                        path: '/',
                        maxAge: EXPIRED_COOKIE,
                        secure: IS_HTTP,
                        httpOnly: IS_HTTP
                    });
                    dispatch(actSetUserId(token));
                    dispatch({ type: SET_FULLNAME, fullname: result.fullname });
                }
                return result;
            }
        });
    }
}


export function actionLogout() {
    return dispatch => {
        cookie.remove('token_fe');
        dispatch(actSetUserId());
    };
}

export function actSetUserId(user_id = null) {
    setAuthorizationToken(user_id);
    let is_login = false;
    if (user_id) is_login = true;
    return { type: SET_LOGIN, is_login };
}
// end action login - logout //

// open - close form //
export function openForm() {
    return { type: OPEN_FORM };
}

export function closeForm() {
    return { type: CLOSE_FORM };
}

export function openFormCustom(form_custom) {
    return { type: OPEN_FORM_CUSTOM, form_custom };
}

export function closeFormCustom(form_custom) {
    return { type: CLOSE_FORM_CUSTOM, form_custom };
}
// end open - close form //

// search //
export function actChangePage(page) {
    return { type: CHANGE_PAGE, page }
}

export function actLimitPage(per_page) {
    return { type: CHANGE_LIMIT_PAGE, per_page }
}

export function actSearch(data) {
    return { type: SEARCH_MODEL, data }
}

export function actSearchRefresh(data = {}) {
    return { type: SEARCH_MODEL_REFRESH, data }
}
// end search //

// checked list //
export function actCheckAllList(checked, list) {
    let type = UNCHECK_ALL;
    if (checked) type = CHECK_ALL;
    return { type, list }
}

export function actCheckBtnAll(check, list) {
    return { type: CHECK_BTN_ALL, list, check }
}
// end checked list //

// set routers //
export function actGetRoutersRequest(type) {
    return dispatch => {
        let url = type === BE ? "getAllModulesBE" : "getAllModulesFE";
        return callApi(`${URL_API}/${url}`).then(res => {
            if (res && res.data) {
                let result = res.data;
                if (result.success) {
                    dispatch({ type: GET_ROUTERS, routers: result.routers });
                    const roles = result.routers.roles ? result.routers.roles : [];
                    dispatch({ type: GET_ROLES, roles });
                    dispatch({ type: SET_USER, is_admin: result.is_admin });
                    dispatch({ type: SET_FULLNAME, fullname: result.fullname });
                    return result.routers;
                }
                return [];
            }
        });
    }
}
// end set routers //

export function actCheckAccountRequest(data) {
    return dispatch => {
        return callApi(`${URL_API}/checkAccount`, 'POST', data, HOST_API).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}

export function actGetUserRequest() {
    return dispatch => {
        return callApi('api/getUser').then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}