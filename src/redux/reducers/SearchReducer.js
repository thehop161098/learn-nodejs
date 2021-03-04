import {
    CHANGE_PAGE, GET_ALL, CHANGE_LIMIT_PAGE, SEARCH_MODEL, SEARCH_MODEL_REFRESH
} from "../../constants/ActionTypes";
import { PER_PAGE } from "../../constants/Params";
import merge from 'lodash/merge';

const defaltState = {
    per_page: PER_PAGE,
    page: 1,
    total: 0
}
export function searchReducer(state = defaltState, action) {
    if (action.type === SEARCH_MODEL) {
        let data = action.data;
        let newState = { ...defaltState, page: 1, per_page: state.per_page };
        newState = merge(newState, data);
        return newState;
    }
    if (action.type === SEARCH_MODEL_REFRESH) {
        let data = action.data;
        let newState = merge({ ...defaltState }, data);
        return { ...newState, total: state.total, per_page: state.per_page };
    }
    if (action.type === CHANGE_PAGE) return { ...state, page: action.page };
    if (action.type === CHANGE_LIMIT_PAGE) return { ...state, per_page: action.per_page, page: 1 };
    if (action.type === GET_ALL) {
        let total = state.total;
        if (action.total) {
            total = action.total;
        }
        return { ...state, total };
    }
    return state;
}