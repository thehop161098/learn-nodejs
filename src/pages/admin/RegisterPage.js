import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { URL_LOGIN_BE } from "../../constants/Params";
import goBack from "../../assets/images/icon-goBack.png";
import RegisterForm from '../../components/admin/RegisterForm';

export default class RegisterPage extends Component {
    render() {
        const { register, history } = this.props;
        return (
            <>
                <div className="Register">
                    <div className="registerBox">
                        <div className="container">
                            <div className="topRegister">
                                <div className="backToWebsite">
                                    <Link to={URL_LOGIN_BE}>
                                        <img src={goBack} alt="goback" />
                                    </Link>
                                </div>
                            </div>
                            <RegisterForm register={register} history={history} />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}