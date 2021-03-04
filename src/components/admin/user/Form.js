import React, { Component } from 'react';
import classnames from "classnames";
import { showToast } from '../../../utils';
import { Loading } from '../../../common';
import { YES, NO } from '../../../constants/Params';
import { rewriteUrl } from '../../../utils';

export default class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _id: '',
            role_id: '',
            username: '',
            fullname: '',
            phone: '',
            email: '',
            address: '',
            password: '',
            repassword: '',
            publish: YES,
            errors: {},
            roles: [],
        };
    }

    componentDidMount() {
        if (this.props.modelEdit && this.props.modelEdit._id !== undefined) {
            this.setState(this.props.modelEdit);
            this.setState({ password: this.props.modelEdit.password_text });
        }
        this.props.actGetAllRole().then(res => {
            if (res && res.success) {
                this.setState({ roles: res.model })
            }
        });

    }

    onChange = (e) => {
        let { name, value, type, checked } = e.target;
        if (name === 'username') {
            value = rewriteUrl(value);
        }
        if (type === "checkbox") {
            value = checked ? YES : NO;
        }
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
                    this.props.closeForm();
                    showToast(res.message);
                    this.props.onGetAll(this.props.search);
                } else {
                    if (res.errors) {
                        this.setState({ errors: res.errors })
                    }
                    if (res.message) {
                        showToast(res.message, 'error');
                        this.setState({ is_overlay: false });
                    }
                }
            }
        });
    }

    render() {
        const { role_id, username, fullname, phone, email, address, password, repassword, errors, _id,
            roles, publish, is_overlay } = this.state;
        const title = _id === "" ? "Thêm mới" : "Cập nhật";
        const disabled = _id === "" ? false : true;
        return (
            <div className="wrapper-form form-xs">
                {is_overlay && <Loading />}

                <h3 className="title-form">{title}</h3>
                <div className="box-form">
                    <form onSubmit={this.onSubmit}>
                        <div className={classnames('form-group', { 'has-error': errors.username })}>
                            <label>Tên đăng nhập <span className="text-danger">(*)</span></label>
                            <input
                                type="text" className="form-control"
                                name="username"
                                value={username}
                                onChange={this.onChange}
                                disabled={disabled}
                            />
                            {errors.username && <small className="error">{errors.username}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.fullname })}>
                            <label>Họ tên</label>
                            <input
                                type="text" className="form-control"
                                name="fullname"
                                value={fullname}
                                onChange={this.onChange}
                            />
                            {errors.fullname && <small className="error">{errors.fullname}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.phone })}>
                            <label>Số điện thoại</label>
                            <input
                                type="text" className="form-control"
                                name="phone"
                                value={phone}
                                onChange={this.onChange}
                            />
                            {errors.phone && <small className="error">{errors.phone}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.email })}>
                            <label>Email</label>
                            <input
                                type="text" autoComplete="none" className="form-control"
                                name="email"
                                value={email}
                                onChange={this.onChange}
                            />
                            {errors.email && <small className="error">{errors.email}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.address })}>
                            <label>Địa chỉ</label>
                            <input
                                type="text" className="form-control"
                                name="address"
                                value={address}
                                onChange={this.onChange}
                            />
                            {errors.address && <small className="error">{errors.address}</small>}
                        </div>

                        <div className={classnames('form-group', { 'has-error': errors.role_id })}>
                            <label>Nhóm quyền <span className="text-danger">(*)</span></label>
                            <select
                                className="custom-select"
                                name="role_id"
                                value={role_id}
                                onChange={this.onChange}
                            >
                                <option value="">--- Nhóm quyền ---</option>
                                {roles.length > 0 && roles.map((role, index) =>
                                    <option key={index} value={`${role._id}`}>{`${role.name}`}</option>
                                )}
                            </select>
                            {errors.role_id && <small className="error">{errors.role_id}</small>}
                        </div>

                        <div className={classnames('form-group', { 'has-error': errors.password })}>
                            <label>Mật khẩu <span className="text-danger">(*)</span></label>
                            <input
                                type="password" className="form-control" autoComplete="new-password"
                                name="password"
                                value={password}
                                onChange={this.onChange}
                            />
                            {errors.password && <small className="error">{errors.password}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.repassword })}>
                            <label>Nhập lại mật khẩu <span className="text-danger">(*)</span></label>
                            <input
                                type="password" className="form-control" autoComplete="off"
                                name="repassword"
                                value={repassword}
                                onChange={this.onChange}
                            />
                            {errors.repassword && <small className="error">{errors.repassword}</small>}
                        </div>

                        <div className="form-group">
                            <div className="animated-checkbox">
                                <label className="mb-0">
                                    <input
                                        type="checkbox"
                                        name="publish"
                                        onChange={this.onChange}
                                        value={YES}
                                        checked={publish}
                                    />
                                    <span className="label-text">Hiển thị</span>
                                </label>
                            </div>
                            {errors.publish && <small className="error">{errors.publish}</small>}
                        </div>

                        <div className="tile-footer">
                            <button className="btn btn-primary mr-1" type="submit">
                                <i className="fa fa-fw fa-lg fa-check-circle"></i>Lưu
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => this.props.closeForm()}>
                                <i className="fa fa-fw fa-lg fa-times-circle"></i> Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}