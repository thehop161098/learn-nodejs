import {
    GET_ALL, CHANGE_FIELD
} from "../../constants/ActionTypes";

export function dataReducer(state = [], action) {
    if (action.type === GET_ALL) return action.models;

    if (action.type === CHANGE_FIELD) {
        return state.map(st => {
            if (st._id !== action.model._id) return st;
            if (action.status_other) {
                return {
                    ...st,
                    [action.field]: action.model[action.field],
                    status_other: action.model.status_other
                };
            }
            return { ...st, [action.field]: action.model[action.field] };
        });
    }

    return state;
}
