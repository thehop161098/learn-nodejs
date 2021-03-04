import { OPEN_FORM, OPEN_FORM_CUSTOM, CLOSE_FORM_CUSTOM, GET_ALL } from "../../constants/ActionTypes";

export function formCustomReducer(state = [], action) {
    if (action.type === OPEN_FORM_CUSTOM) return state.concat(action.form_custom)
    if (action.type === CLOSE_FORM_CUSTOM)
        return state.filter(form_custom => form_custom !== action.form_custom);
    if (action.type === GET_ALL || action.type === OPEN_FORM) return [];
    return state;
}