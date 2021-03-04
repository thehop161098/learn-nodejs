import { CHECK_ALL, UNCHECK_ALL, CHECK_BTN_ALL, GET_ALL } from "../../constants/ActionTypes";

const defaultState = {
    list: [],
    isCheckAll: false
}

export function listCheckedReducer(state = defaultState, action) {
    if (action.type === UNCHECK_ALL || action.type === GET_ALL) return defaultState;
    if (action.type === CHECK_ALL)
        return { ...state, list: action.list, isCheckAll: true };
    if (action.type === CHECK_BTN_ALL) return { ...state, list: action.list, isCheckAll: action.check };
    return state;
}