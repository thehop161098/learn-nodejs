import { GET_ROLES } from "../../constants/ActionTypes";

export function rolesReducer(state = {}, action) {
    if (action.type === GET_ROLES) return action.roles;
    return state;
}