import { GET_ROUTERS } from "../../constants/ActionTypes";

export function routersReducer(state = [], action) {
    if (action.type === GET_ROUTERS) return action.routers;
    return state;
}