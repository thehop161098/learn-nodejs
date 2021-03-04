import React, { Component } from "react";
import classnames from "classnames";
import { showToast } from '../../utils';
import { URL_LOGIN_BE } from "../../constants/Params";

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullname: '',
            phone: '',
            email: '',
            password: '',
            repassword: '',
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
        this.props.register(data_post).then(res => {
            if (res.success) {
                this.props.history.push(URL_LOGIN_BE);
                showToast(res.message);
            } else {
                this.setState({ errors: res.errors });
            }
        });
    }

    render() {
        const { fullname, email, phone, password, repassword, errors } = this.state;

        return (
            <form onSubmit={this.onSubmit}>
                <div className="mainRegister">
                    <div className="formRegister">
                        <div className="titleFormRegister">
                            <p className="desFormRegister">Đăng Ký</p>
                        </div>
                        <div className="inputFormRegister">
                            <div className={classnames('form-group', { 'has-error': errors.fullname })}>
                                <input
                                    autoFocus
                                    placeholder="Họ tên"
                                    name="fullname"
                                    value={fullname}
                                    onChange={this.onChange}
                                />
                                {errors.fullname && (<small className="error">{errors.fullname}</small>)}
                            </div>
                            <div className={classnames('form-group', { 'has-error': errors.phone })}>
                                <input
                                    placeholder="Số điện thoại"
                                    name="phone"
                                    value={phone}
                                    onChange={this.onChange}
                                />
                                {errors.phone && (<small className="error">{errors.phone}</small>)}
                            </div>
                            <div className={classnames('form-group', { 'has-error': errors.email })}>
                                <input
                                    placeholder="Email"
                                    name="email"
                                    value={email}
                                    onChange={this.onChange}
                                />
                                {errors.email && (<small className="error">{errors.email}</small>)}
                            </div>
                            <div className={classnames('form-group', { 'has-error': errors.password })}>
                                <input
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Mật khẩu"
                                    value={password}
                                    onChange={this.onChange}
                                />
                                {errors.password && <small className="error">{errors.password}</small>}
                            </div>
                            <div className={classnames('form-group', { 'has-error': errors.repassword })}>
                                <input
                                    name="repassword"
                                    value={repassword}
                                    onChange={this.onChange}
                                    type="password"
                                    placeholder="Nhập lại mật khẩu"
                                    autoComplete="off"
                                />
                                {errors.repassword && <small className="error">{errors.repassword}</small>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottomRegister">
                    <div className="acceptRegister">
                        <button className="btn btnRegister" type="submit">Đăng Ký</button>
                    </div>
                </div>
            </form>
        );
    }
}
