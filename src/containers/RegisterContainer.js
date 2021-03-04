import React, { Component } from 'react';
import { connect } from 'react-redux';
import RegisterPage from '../pages/admin/RegisterPage';
import { actRegisterRequest } from '../actions';

class RegisterContainer extends Component {
    render() {
        const { history, actRegisterRequest } = this.props;
        return (
            <RegisterPage register={actRegisterRequest} history={history} />
        );
    }
}

export default connect(null, { actRegisterRequest })(RegisterContainer);