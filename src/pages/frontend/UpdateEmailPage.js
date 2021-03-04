import React, { Component } from 'react';
import { UpdateEmail } from '../../components/frontend/login';

export default class UpdateEmailPage extends Component {
    render() {
        return (
            <div className="app-login">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5 col-md-7 col-sm-12">
                            <UpdateEmail {...this.props} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}