import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { authReducer } from './reducers/AuthReducer';
import { formReducer } from './reducers/FormReducer';
import { dataReducer } from './reducers/DataReducer';
import { dataEditReducer } from './reducers/DataEditReducer';
import { searchReducer } from './reducers/SearchReducer';
import { listCheckedReducer } from './reducers/ListCheckedReducer';
import { routersReducer } from './reducers/RoutersReducer';
import { formCustomReducer } from './reducers/FormCustomReducer';
import { rolesReducer } from './reducers/RolesReducer';

const reducers = combineReducers({
    authReducer,
    formReducer,
    dataReducer,
    dataEditReducer,
    searchReducer,
    listCheckedReducer,
    routersReducer,
    formCustomReducer,
    rolesReducer,
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    reducers,
    composeEnhancer(applyMiddleware(thunk)),
);
