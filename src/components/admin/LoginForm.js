import React, { Component } from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { URL_REGISTER_BE } from "../../constants/Params";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: "",
            password: "",
            errors: {}
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.setState({ 
            [e.target.name]: e.target.value 
        });
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({ errors: {} });
        let { errors, controllers, ...data_post } = this.state;
        this.props.login(data_post).then(res => {
            let link = this.props.path;
            if (res.link && res.link !== "" && res.link !== null) {
                link = "/" + res.link;
            }
            if (res.success) {
                this.props.history.push(link);
            } else {
                this.setState({ errors: res.errors });
            }
        });
    }

    render() {
        const { phone, password, errors } = this.state;

        return (
            <form onSubmit={this.onSubmit}>
                <div className="mainLogin">
                    <div className="formLogin">
                        <div className="titleFormLogin">
                            <p className="desFormLogin">Đăng Nhập</p>

                            {errors.form && (
                                <div className="alert alert-danger">{errors.form}</div>
                            )}

                        </div>

                        <div className="inputFormLogin">
                            <div className={classnames('form-group', { 'has-error': errors.phone })}>
                                <input
                                    autoFocus placeholder="Số điện thoại"
                                    name="phone"
                                    value={phone}
                                    onChange={this.onChange}
                                />
                                {errors.phone && (<small className="error">{errors.phone}</small>)}
                            </div>

                            <div className={classnames('form-group', { 'has-error': errors.phone })}>
                                <input
                                    placeholder="Mật khẩu"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={this.onChange}
                                />
                                {errors.password && (<small className="error">{errors.password}</small>)}
                            </div>

                            <div className="form-group">
                                <div className="registerAccount">
                                    <Link to={URL_REGISTER_BE}>Đăng ký</Link>
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
                        <button type="submit" className="btn btnLogin">
                            Đăng Nhập
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}
