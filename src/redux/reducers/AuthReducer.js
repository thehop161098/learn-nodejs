import { SET_LOGIN, SET_USER, SET_FULLNAME, SET_MONEY, GET_UNIT } from "../../constants/ActionTypes";

const defaultState = {
    is_login: false,
    is_admin: false,
    name: '',
    total: 0,
    unit: "",
    unit_id: ""
}
export function authReducer(state = defaultState, action) {
    if (action.type === SET_LOGIN) {
        return { ...state, is_login: action.is_login };
    }
    if (action.type === SET_USER) return { ...state, is_admin: action.is_admin };
    if (action.type === SET_FULLNAME) return { ...state, name: action.fullname };
    if (action.type === SET_MONEY) return { ...state, total: action.total };
    if (action.type === GET_UNIT) return { ...state, unit: action.unit, unit_id: action.unit_id};
    return state;
}