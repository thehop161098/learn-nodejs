import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoginPage from '../pages/admin/LoginPage';
import { actLoginRequest } from '../actions';
import { Redirect } from "react-router-dom";
import cookie from 'react-cookies'

class LoginContainer extends Component {
    render() {
        const { history, actLoginRequest } = this.props;
        let token = cookie.load('token');
        let path = "/";
        if (token) {
            return (<Redirect to={path} />);
        }
        return (
            <LoginPage login={actLoginRequest} history={history} path={path} />
        );
    }
}

export default connect(null, { actLoginRequest })(LoginContainer);