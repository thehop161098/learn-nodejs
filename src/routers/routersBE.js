import { URL_ADMIN } from '../constants/Params';

const routesBE = [
    {
        path: `${URL_ADMIN}controller`,
        title: 'Controller',
        exact: true,
        component: 'ControllerContainer'
    },
    {
        path: `${URL_ADMIN}controllerRole`,
        title: 'ControllerRole',
        exact: true,
        component: 'ControllerRoleContainer'
    },
    {
        path: `${URL_ADMIN}module`,
        title: 'Danh mục',
        exact: true,
        component: 'ModuleContainer'
    },
    {
        path: `${URL_ADMIN}profile`,
        title: 'Thông tin cá nhân',
        exact: true,
        component: 'ProfileContainer'
    },
    {
        path: `${URL_ADMIN}currency`,
        title: 'Tiền tệ',
        exact: true,
        component: 'CurrencyContainer'
    }
];

export default routesBE;