import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class ForgetPassword extends Component {
    render() {
        return (
            <div className="ForgetPassword">
                <div className="forgetPasswordBox">
                    <div className="container">
                        <div className="topForgetPassword">
                            <div className="backToWebsite">
                                <Link to="/login">
                                    <img src="images/icon/icon-goBack.png" />
                                </Link>
                            </div>
                        </div>
                        <div className="mainForgetPassword">
                            <div className="formForgetPassword">
                                <div className="titleFormForgetPassword">
                                    <p className="desFormForgetPassword">Quên mật khẩu</p>
                                </div>
                                <div className="inputFormForgetPassword">
                                    <div className="form-group">
                                        <input placeholder="SĐT" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bottomForgetPassword">
                            <div className="acceptForgetPassword">
                                <button className="btn btnForgetPassword">Xác Nhận</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}