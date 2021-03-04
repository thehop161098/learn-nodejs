import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import routes from './routers';
import { connect } from 'react-redux';
import { actSetUserId } from './actions/index';
import cookie from 'react-cookies'
import LoadingPage from './pages/LoadingPage';
import {  URL_LOGIN_BE, URL_LOGIN } from './constants/Params';

function PrivateRoute({ component: Component, ...rest }) {
    let token = rest.is_admin ? cookie.load('token') : cookie.load('token_fe');
    let path = rest.is_admin ? URL_LOGIN_BE : URL_LOGIN;

    return (
        <Route
            {...rest}
            render={props =>
                token ? (
                    <Component {...props} />
                ) : (
                        <Redirect
                            to={{
                                pathname: path,
                                state: { from: props.location }
                            }}
                        />
                    )
            }
        />
    );
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loading: true
        }
    }

    async componentDidMount() {
        let token;
        if (cookie.load('token')) token = cookie.load('token');
        if (token) await this.props.actSetUserId(token);
        this.setState({ is_loading: false });
    }

    showRoutes = (routes) => {
        //const path = window.location.pathname;
        let is_admin = true;
        let results = null;
        if (routes.length > 0) {
            let newRoutes = routes.filter(route => {
                return (is_admin && route.is_admin === true) ||
                    (!is_admin && route.is_admin === false)
            });
            results = newRoutes.map((route, index) => {
                if (route.isAuth) {
                    return (
                        <PrivateRoute
                            key={index}
                            path={route.path}
                            exact={route.exact}
                            component={route.main}
                            is_admin={is_admin}
                        />
                    );
                }
                return (
                    <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        component={route.main}
                    />
                );
            });
        }
        return <Switch>{results}</Switch>
    }
    render() {
        if (this.state.is_loading) {
            return (
                <LoadingPage />
            );
        }

        return (
            <Router>
                {this.showRoutes(routes)}
            </Router>
        );
    }
}

export default connect(null, { actSetUserId })(App);