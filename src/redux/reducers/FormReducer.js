import { OPEN_FORM, CLOSE_FORM, GET_ALL } from "../../constants/ActionTypes";

export function formReducer(state = false, action) {
    if (action.type === OPEN_FORM) return true;
    if (action.type === CLOSE_FORM || action.type === GET_ALL) {
        return false
    }
    return state;
}