import React, { Component } from 'react';
import { Register } from '../../components/frontend/login';

export default class RegisterPage extends Component {
    render() {
        return (
            <div className="app-login">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5 col-md-7 col-sm-12">
                            <Register {...this.props} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}