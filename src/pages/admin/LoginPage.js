import React, { Component } from 'react';
import LoginForm from '../../components/admin/LoginForm';

export default class LoginPage extends Component {
    render() {
        const { login, history, config, path } = this.props;
        return (
            <>
                <div className="Login">
                    <div className="loginBox">
                        <div className="container">
                            <LoginForm login={login} history={history} config={config} path={path} />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}