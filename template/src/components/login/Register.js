import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class Register extends Component {
    render() {
        return (
            <div className="Register">
                <div className="registerBox">
                    <div className="container">
                        <div className="topRegister">
                            <div className="backToWebsite">
                                <Link to="/login">
                                    <img src="images/icon/icon-goBack.png" />
                                </Link>
                            </div>
                        </div>
                        <div className="mainRegister">
                            <div className="formRegister">
                                <div className="titleFormRegister">
                                    <p className="desFormRegister">Đăng Ký</p>
                                </div>
                                <div className="inputFormRegister">
                                    <div className="form-group">
                                        <input placeholder="Họ tên" />
                                    </div>
                                    <div className="form-group">
                                        <input placeholder="Số điện thoại" />
                                    </div>
                                    <div className="form-group">
                                        <input placeholder="Email" />
                                    </div>
                                    <div className="form-group">
                                        <input name="password" type="password" placeholder="Mật khẩu" />
                                    </div>
                                    <div className="form-group">
                                        <input name="re-password" type="password" placeholder="Nhập lại mật khẩu" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bottomRegister">
                            <div className="acceptRegister">
                                <button className="btn btnRegister">Đăng Ký</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}