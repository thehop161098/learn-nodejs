import React from 'react';
import NotFoundPage from '../pages/NotFoundPage';
import LoginContainer from '../containers/LoginContainer';
import RegisterContainer from '../containers/RegisterContainer';
import IndexAdminContainer from '../containers/admin/IndexAdminContainer';
import routersBE from './routersBE';
import { URL_LOGIN_BE, URL_ADMIN, URL_REGISTER_BE } from '../constants/Params';

const routes = [
    // back end //
    {
        path: URL_LOGIN_BE,
        exact: true,
        isAuth: false,
        is_admin: true,
        main: ({ history }) => <LoginContainer history={history} />
    },
    {
        path: URL_REGISTER_BE,
        exact: true,
        isAuth: false,
        is_admin: true,
        main: ({ history }) => <RegisterContainer history={history} />
    },
    {
        path: URL_ADMIN,
        exact: false,
        isAuth: true,
        is_admin: true,
        main: ({ match, history }) => <IndexAdminContainer match={match} history={history} routersBE={routersBE} />
    },
    // end back end //
    {
        path: '',
        exact: false,
        isAuth: false,
        main: () => <NotFoundPage />
    }
];

export default routes;