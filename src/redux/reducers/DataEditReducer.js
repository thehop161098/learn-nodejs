import { GET_MODEL, CLOSE_FORM, GET_ALL, CLOSE_FORM_CUSTOM } from "../../constants/ActionTypes";

export function dataEditReducer(state = {}, action) {
    if (action.type === GET_MODEL) return action.model;
    if (action.type === CLOSE_FORM || action.type === GET_ALL || action.type === CLOSE_FORM_CUSTOM)
        return {};
    return state;
}