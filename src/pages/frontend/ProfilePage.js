import React, { Component } from 'react';
import { Profile } from '../../components/frontend/login';

export default class ProfilePage extends Component {

    render() {
        return (
            <div className="app-login">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5 col-md-7 col-sm-12">
                            <Profile {...this.props} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}