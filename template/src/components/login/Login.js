import React, { Component } from 'react'
import { Link } from "react-router-dom";

export default class Login extends Component {
    render() {
        return (
            <div className="Login">
                <div className="loginBox">
                    <div className="container">
                        <div className="mainLogin">
                            <div className="formLogin">
                                <div className="titleFormLogin">
                                    <p className="desFormLogin">Đăng Nhập</p>
                                </div>
                                <div className="inputFormLogin">
                                    <div className="form-group">
                                        <input placeholder="Số điện thoại" />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" placeholder="Mật khẩu" />
                                    </div>
                                    <div className="form-group">
                                        <div className="registerAccount">
                                            <Link to="/register">Đăng ký</Link>
                                        </div>
                                        <div className="forgetPassword">
                                            <Link to="/forget-password">Quên mật khẩu ?</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bottomLogin">
                            <div className="acceptLogin">
                                <Link to="/dashboard">
                                    <button className="btn btnLogin">
                                         Đăng Nhập
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}