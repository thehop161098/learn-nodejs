import React, { Component } from 'react';
import classnames from "classnames";
import { showToast } from '../../utils';
import { Loading } from '../../common';

export default class ProfilePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _id: '',
            username: '',
            fullname: '',
            phone: '',
            email: '',
            address: '',
            password: '',
            repassword: '',
            errors: {},
            is_overlay: false
        };
    }

    componentDidMount() {
        this.props.actGetUser().then(res => {
            if (res && res.success) {
                this.setState(res.model);
                this.setState({ password: res.model.password_text });
            }
        });
    }

    onChange = (e) => {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ errors: {} });
        const { errors, roles, is_overlay, ...data_post } = this.state;
        this.setState({ is_overlay: true });
        this.props.onSubmit(data_post).then((res) => {
            if (res) {
                if (res.success) {
                    showToast(res.message);
                } else {
                    if (res.errors) {
                        this.setState({ errors: res.errors })
                    }
                    if (res.message) {
                        showToast(res.message, 'error');
                    }
                }
                this.setState({ is_overlay: false });
            }
        });
    }

    render() {
        const {
             fullname, phone, email, address, password, repassword, errors, is_overlay
        } = this.state;

        return (
            <div className="row">
                <div className="col-md-8">
                    <div className="tile">

                        {is_overlay && <Loading />}

                        {/* <h3 className="tile-title">Cập nhật thông tin cá nhân</h3> */}
                        <form onSubmit={this.onSubmit} className="form-horizontal">
                            <div className="tile-body">
                                {/* <div className="form-group row">
                                    <label className="control-label col-md-3">Tên đăng nhập</label>
                                    <div className="col-md-9">
                                        <input
                                            type="text" className="form-control"
                                            name="username"
                                            value={username}
                                            onChange={this.onChange}
                                            disabled={true}
                                        />
                                    </div>
                                </div> */}
                                <div className={classnames('form-group row', { 'has-error': errors.fullname })}>
                                    <label className="control-label col-md-3">Họ tên <span className="text-danger">(*)</span></label>
                                    <div className="col-md-9">
                                        <input
                                            type="text" className="form-control"
                                            name="fullname"
                                            value={fullname}
                                            onChange={this.onChange}
                                        />
                                        {errors.fullname && <small className="error">{errors.fullname}</small>}
                                    </div>
                                </div>
                                <div className={classnames('form-group row', { 'has-error': errors.phone })}>
                                    <label className="control-label col-md-3">Số điện thoại <span className="text-danger">(*)</span></label>
                                    <div className="col-md-9">
                                        <input
                                            type="text" className="form-control"
                                            name="phone"
                                            value={phone}
                                            onChange={this.onChange}
                                        />
                                        {errors.phone && <small className="error">{errors.phone}</small>}
                                    </div>
                                </div>
                                <div className={classnames('form-group row', { 'has-error': errors.email })}>
                                    <label className="control-label col-md-3">Email <span className="text-danger">(*)</span></label>
                                    <div className="col-md-9">
                                        <input
                                            type="text" autoComplete="none" className="form-control"
                                            name="email"
                                            value={email}
                                            onChange={this.onChange}
                                        />
                                        {errors.email && <small className="error">{errors.email}</small>}
                                    </div>
                                </div>
                                <div className={classnames('form-group row', { 'has-error': errors.address })}>
                                    <label className="control-label col-md-3">Địa chỉ</label>
                                    <div className="col-md-9">
                                        <input
                                            type="text" className="form-control"
                                            name="address"
                                            value={address}
                                            onChange={this.onChange}
                                        />
                                        {errors.address && <small className="error">{errors.address}</small>}
                                    </div>
                                </div>
                                <div className={classnames('form-group row', { 'has-error': errors.password })}>
                                    <label className="control-label col-md-3">Mật khẩu <span className="text-danger">(*)</span></label>
                                    <div className="col-md-9">
                                        <input
                                            type="password" className="form-control" autoComplete="new-password"
                                            name="password"
                                            value={password}
                                            onChange={this.onChange}
                                        />
                                        {errors.password && <small className="error">{errors.password}</small>}
                                    </div>
                                </div>
                                <div className={classnames('form-group row', { 'has-error': errors.repassword })}>
                                    <label className="control-label col-md-3">Nhập lại mật khẩu <span className="text-danger">(*)</span></label>
                                    <div className="col-md-9">
                                        <input
                                            type="password" className="form-control" autoComplete="off"
                                            name="repassword"
                                            value={repassword}
                                            onChange={this.onChange}
                                        />
                                        {errors.repassword && <small className="error">{errors.repassword}</small>}
                                    </div>
                                </div>
                            </div>
                            <div className="tile-footer">
                                <div className="row">
                                    <div className="col-md-8 col-md-offset-3">
                                        <button className="btn btn-primary mr-1" type="submit">
                                            <i className="fa fa-fw fa-lg fa-check-circle"></i>Cập nhật
                                    </button>
                                        {/* <a className="btn btn-secondary" href="# ">
                                        <i className="fa fa-fw fa-lg fa-times-circle"></i>Hủy
                                    </a> */}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}