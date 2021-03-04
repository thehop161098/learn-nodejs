import cookie from 'react-cookies'
import callApi from "../utils/apiCaller";
import { setAuthorizationToken } from "../utils";
import {
    CHANGE_PAGE, CHANGE_LIMIT_PAGE, SEARCH_MODEL, SEARCH_MODEL_REFRESH, CHECK_ALL, UNCHECK_ALL,
    CHECK_BTN_ALL, OPEN_FORM, CLOSE_FORM, SET_LOGIN, OPEN_FORM_CUSTOM, CLOSE_FORM_CUSTOM,
    GET_ROUTERS, GET_ROLES, SET_USER, SET_FULLNAME, SET_MONEY, GET_UNIT
} from '../constants/ActionTypes';
import { EXPIRED_COOKIE, IS_HTTP } from '../constants/Config';
import { BE } from '../constants/Params';

// action login - logout //
const URL_ADMIN_AUTH = "admin/auth";
const URL_FE_AUTH = "frontend/auth";
const URL_API = "api";

export function actLoginRequest(data, is_admin = true) {
    return dispatch => {
        const url = is_admin ? URL_ADMIN_AUTH : URL_FE_AUTH;
        const token_name = is_admin ? "token" : "token_fe";
        return callApi(`${url}/login`, 'POST', data).then(res => {
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
                }
                return result;
            }
        });
    }
}
export function actRegisterRequest(data, is_admin = true) {
    return dispatch => {
        return callApi(`${URL_ADMIN_AUTH}/register`, 'POST', data).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}
export function actionLogout(type = BE) {
    return dispatch => {
        if (type === BE) {
            cookie.remove('token', { path: '/' });
        } else {
            cookie.remove('token_fe', { path: '/' });
        };
        dispatch(actSetUserId());
    };
}

export function actSetUserId(user_id = null) {
    setAuthorizationToken(user_id);
    let is_login = false;
    if (user_id) {
        is_login = true;
    }
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
                    dispatch({ type: SET_MONEY, total: result.total });
                    dispatch({ type: GET_UNIT, unit: result.unit, unit_id: result.unit_id });
                    // if (type === BE) return result.routers;
                    return result;
                }
                return [];
            }
        });
    }
}
// end set routers //

export function actGetListBanksRequest() {
    return dispatch => {
        return callApi(`${URL_API}/getListBanks`).then(res => {
            if (res && res.data) {
                return res.data;
            }
        });
    }
}

export function actGetListBankCustomersRequest(game_account_id) {
    return dispatch => {
        return callApi(`${URL_API}/getListBankCustomers`, 'POST', { game_account_id })
            .then(res => {
                if (res && res.data) {
                    return res.data;
                }
            });
    }
}

export function actGetListGamesRequest() {
    return dispatch => {
        return callApi(`${URL_API}/getListGames`).then(res => {
            if (res && res.data) {
                return res.data;
            }
        });
    }
}

export function actGetListGameAccountRequest(game_id = null) {
    return dispatch => {
        return callApi(`${URL_API}/getListGameAccounts`, 'POST', { game_id }).then(res => {
            if (res && res.data) {
                return res.data;
            }
        });
    }
}

export function actGetListUsersRequest() {
    return dispatch => {
        return callApi(`${URL_API}/getListUsers`).then(res => {
            if (res && res.data) {
                return res.data;
            }
        });
    }
}

export function actGetExchangeRequest(type) {
    return dispatch => {
        return callApi(`${URL_API}/getExchange`, 'POST', { type }).then(res => {
            if (res && res.data) {
                return res.data;
            }
        });
    }
}

export function actGetListCustomersRequest() {
    return dispatch => {
        return callApi(`${URL_API}/getListCustomers`).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}

export function actGetListCustomerGroupsRequest() {
    return dispatch => {
        return callApi(`${URL_API}/getListCustomerGroups`).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}

export function actGetBlackListRequest() {
    return dispatch => {
        return callApi(`${URL_API}/getBlackList`).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}

export function actGetRatesRequest() {
    return dispatch => {
        return callApi(`${URL_API}/getRates`).then(res => {
            if (res && res.data) {
                let result = res.data;
                return result;
            }
        });
    }
}

// Thế Hợp---- lưu setcurrency
export function actAddSetCurrencyRequest(data) {
    return dispatch => {
        return callApi(`${URL_API}/add`, 'POST', data).then(res => {
            if (res && res.data) {
                let result = res.data;
                if (result.success) {
                    dispatch({ type: GET_UNIT, unit: result.unit, unit_id: result.unit_id });
                }
                return result;
            }
        });
    }
}
