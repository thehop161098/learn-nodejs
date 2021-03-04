import React, { Component } from 'react';
import { connect } from 'react-redux';
import concat from 'lodash/concat';
import Loadable from '@loadable/component'
import { Route, Switch, Link } from "react-router-dom";

import { TITLE } from '../../constants/Config';
import IndexAdminPage from '../../pages/admin/IndexAdminPage';
import {
    actGetRoutersRequest, actionLogout, actSearchRefresh, actAddSetCurrencyRequest
} from '../../actions';
import { BE } from '../../constants/Params';
import NotFoundPage from '../../pages/NotFoundPage';
import LoadingPage from '../../pages/LoadingPage';

class IndexAdminContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loading: true,
            currency: []
        };

        this.props.history.listen((location, action) => {
            this.props.actSearchRefresh();
        });
    }

    componentDidMount() {
        this.props.actGetRoutersRequest(BE).then(is_done => {
            if (is_done.success) {
                this.setState({
                    is_loading: false,
                    currency: is_done.currency
                });
            }
        });
    }

    getRoutersObj(routers) {
        let results = {};

        routers.modules.forEach(route => {
            if (route.component === 'RateSettingContainer' && results[route.component] &&
                results[route.component].link && results[route.component].link.split('/').length === 1) {
                results[route.component] = results[route.component];
            } else {
                results[route.component] = {
                    name: route.name,
                    link: route.link
                }
            }
            if (route.childs && route.childs.length > 0) {
                route.childs.forEach(child => {
                    results[child.component] = {
                        name: child.name,
                        link: child.link
                    }
                });
            }
        });
        return results;
    }

    getPropsRoute = (component, routers_props, props, title) => {
        let new_props;
        let modules_props = {};
        if (component === "CardContainer" || component === "CardMoneyContainer") {
            ["CardContainer", "CardMoneyContainer"].forEach(container => {
                modules_props[container] = { ...routers_props[container] };
            });
            new_props = { ...props, title_page: title, modules_props };
        } else {
            new_props = { ...props, title_page: title, modules_props };
        }

        return new_props;
    }

    showRoutes = () => {
        const { routers, routersBE, auth } = this.props;
        const { getPropsRoute } = this;

        const path = this.props.history.location.pathname.substring(1);
        const routers_props = this.getRoutersObj(routers);
        let results = [];
        let results_temp = [];
        let is_valid = false;
        let title_page = null;
        let roles = auth.is_admin ? [] : this.props.roles;
        let list_component = [];
        if (routers.modules.length > 0) {
            results = routers.modules.map((route, index) => {
                if (route.childs.length === 0) {
                    if (route.link === path) {
                        title_page = route.title;
                        is_valid = true;
                    }
                }
                list_component.push(route.component);
                if (auth.is_admin) roles[route.component] = [-1];
                const Component = Loadable(() => import('../../containers/admin/' + route.component).catch(error => {
                    return () => <LoadingPage error={true} />;
                }), { fallback: <LoadingPage /> });

                if (route.childs.length > 0) {
                    const temp = route.childs.map((child, index_child) => {
                        if (!title_page) {
                            if (child.link === path) {
                                title_page = child.title;
                                is_valid = true;
                            }
                        }
                        list_component.push(child.component);
                        if (auth.is_admin) roles[child.component] = [-1];
                        const ComponentChild = Loadable(() => import('../../containers/admin/' + child.component).catch(error => {
                            title_page = null;
                            return () => <LoadingPage error={true} />;
                        }), { fallback: <LoadingPage /> });
                        const title = child.title && child.title !== "" ? `${child.title} - ${TITLE}` : TITLE;
                        return (
                            <Route
                                key={`child-${index}-${index_child}`}
                                path={`/${child.link}`}
                                exact={true}
                                component={(props) => {
                                    const new_props = getPropsRoute(child.component, routers_props, props, title);
                                    return <ComponentChild {...new_props} title_private={child.title} roles={roles} />;
                                }}
                            />
                        )
                    });
                    results_temp = concat(results_temp, temp);
                }
                const title = route.title && route.title !== "" ? `${route.title} - ${TITLE}` : TITLE;
                return (
                    <Route
                        key={index}
                        path={`/${route.link}`}
                        exact={true}
                        component={(props) => {
                            const new_props = getPropsRoute(route.component, routers_props, props, title);
                            return <Component {...new_props} title_private={route.title} roles={roles} />;
                        }}
                    />
                );
            });
        }
        results = concat(results, results_temp);

        if (routersBE.length > 0) {
            const routerDefaultBE = routersBE.filter(router => !list_component.includes(router.component))
                .map((route, index) => {
                    const temp_path = '/' + path;
                    if (!title_page && route.path === temp_path) {
                        title_page = route.title;
                        is_valid = true;
                    }
                    const title = route.title && route.title !== "" ? `${route.title} - ${TITLE}` : TITLE;
                    const ComponentBE = Loadable(() => import('../../containers/admin/' + route.component).catch(error => {
                        return () => <LoadingPage error={true} />;
                    }), { fallback: <LoadingPage /> });
                    if (auth.is_admin) roles[route.component] = [-1];
                    return (
                        <Route
                            key={`default-${index}`}
                            path={route.path}
                            exact={route.exact}
                            component={(props) => {
                                return <ComponentBE {...props} title_page={title} roles={roles} />;
                            }}
                        />
                    );
                });
            results = concat(results, routerDefaultBE);
        }

        if (!is_valid) {
            results.push(<Route
                key={`notFound`}
                path={`/${path}`}
                exact={true}
                component={() => <NotFoundPage />}
            />);
        }

        return { title_page, routes: <Switch>{results}</Switch> };
    }

    onLogout = () => {
        this.props.actionLogout();
    }

    onClickPrevent = (e) => {
        e.preventDefault();
    }

    getModules = () => {
        const { routers } = this.props;
        let modules = null;
        if (routers.modules.length > 0) {
            modules = routers.modules.filter(route => route.publish).map((route, index) => {
                if (route.childs.length > 0) {
                    const childs = route.childs.filter(child => child.publish).map((child, index_child) => {
                        const link = child.link === '/' ? '' : child.link;
                        return (

                            <div key={`child-${index}-${index_child}`} className="list-group">
                                <Link to={`/${link}`} className="list-group-item font-300 list-group-item-action">{child.name}</Link>
                            </div>
                        );
                    });
                    return (

                        <div key={index} className="card">
                            <a href="# " className="collapsed" data-toggle="collapse" data-target={`#collapseDrop${index}`} aria-expanded="false" aria-controls={`collapseDrop${index}`}>
                                <div className="card-header" id={`headingDrop${index}`}>
                                    <h5 className="mb-0 font-300">
                                        {route.name}
                                    </h5>
                                </div>
                            </a>

                            <div id={`collapseDrop${index}`} className="collapse" aria-labelledby={`headingDrop${index}`} data-parent="#accordion">
                                <div className="card-body">
                                    {childs}
                                </div>
                            </div>

                        </div>
                    );
                }
                const link = route.link === '/' ? '' : route.link;
                return (
                    <div key={index} className="card not-child">
                        <Link to={`/${link}`}>
                            <div className="card-header">
                                <h5 className="mb-0 font-300">{route.name}</h5>
                            </div>
                        </Link>
                    </div>
                );
            });
        }
        return modules;
    }


    // Thế hợp
    onSetCurrency = (data) => {
        return this.props.actAddSetCurrencyRequest(data);
    }

    render() {
        const { is_loading, currency } = this.state;
        const { history, routers, auth } = this.props;

        if (is_loading) {
            return (
                <LoadingPage is_fullpage={true} />
            );
        }

        const { routes, title_page } = this.showRoutes();

        return (
            <IndexAdminPage
                onSetCurrency={this.onSetCurrency}
                currency={currency}
                routes={routes}
                title_page={title_page}
                history={history}
                routers={routers}
                auth={auth}
                onLogout={this.onLogout}
                getModules={this.getModules}
            />
        );
    }
}

const mapState = state => ({
    routers: state.routersReducer,
    roles: state.rolesReducer,
    auth: state.authReducer,
});

const mapProps = {
    actGetRoutersRequest, actionLogout, actSearchRefresh, actAddSetCurrencyRequest
};

export default connect(mapState, mapProps)(IndexAdminContainer);