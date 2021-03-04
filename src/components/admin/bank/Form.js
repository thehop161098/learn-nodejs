import React, { Component } from 'react';
import classnames from "classnames";
import { showToast, rewriteToUpperCase } from '../../../utils';
import { YES, NO } from '../../../constants/Params';
import { Loading } from '../../../common';
import NumberFormat from 'react-number-format';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            code: "",
            name: "",
            price_first: 0,
            price_curr: 0,
            publish: YES,
            errors: {},
            is_overlay: false
        };
    }

    componentDidMount() {
        if (this.props.modelEdit && this.props.modelEdit._id !== undefined) {
            this.setState(this.props.modelEdit);
        }
    }

    onChange = (e) => {
        let { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            if (checked) value = YES
            else value = NO;
        }
        if (name === 'code') {
            value = rewriteToUpperCase(value);
        }
        this.setState({ [name]: value });
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ errors: {} });
        const { errors, is_overlay, ...data_post } = this.state;
        this.setState({ is_overlay: true });
        this.props.onSubmit(data_post).then(
            (res) => {
                if (res) {
                    if (res.success) {
                        this.props.closeForm();
                        showToast(res.message);
                        this.props.onGetAll(this.props.search);
                    } else {
                        if (res.errors) {
                            this.setState({ errors: res.errors });
                        }
                        if (res.message) {
                            showToast(res.message, 'error');
                        }
                        this.setState({ is_overlay: false });
                    }
                }
            }
        );
    }

    render() {
        const {
            _id, code, name, price_first, price_curr, publish, errors, is_overlay
        } = this.state;
        const title_action = _id === "" ? "Thêm mới" : "Cập nhật";
        const isDisPlay = _id === "" ? true : false;
        return (
            <div className="formRevenue formSmall">
                {is_overlay && <Loading />}

                <div className="headerForm"><span>{title_action}</span></div>

                <div className="mainForm">
                    <form onSubmit={this.onSubmit}>
                        <div className={classnames('form-group', { 'has-error': errors.code })}>
                            <label className="control-label">Mã <span className="text-danger">(*)</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="code"
                                value={code}
                                onChange={this.onChange}
                            />
                            {errors.code && <small className="error">{errors.code}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.name })}>
                            <label className="control-label">Tên <span className="text-danger">(*)</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={name}
                                onChange={this.onChange}
                            />
                            {errors.name && <small className="error">{errors.name}</small>}
                        </div>

                        <div className={classnames('form-group', { 'has-error': errors.price_first }, { 'd-none': isDisPlay === false })}>
                            <label className="control-label">Số dư ban đầu</label>
                            <NumberFormat
                                thousandSeparator={true}
                                type="text"
                                className="form-control"
                                name="price_first"
                                value={price_first}
                                onChange={this.onChange}
                            />
                            {errors.price_first && <small className="error">{errors.price_first}</small>}
                        </div>

                        <div className={classnames('form-group', { 'has-error': errors.price_curr }, { 'd-none': isDisPlay === true })}>
                            <label className="control-label">Số dư hiện tại</label>
                            <NumberFormat
                                thousandSeparator={true}
                                type="text"
                                className="form-control"
                                name="price_curr"
                                value={price_curr}
                                onChange={this.onChange}
                            />
                            {errors.price_curr && <small className="error">{errors.price_curr}</small>}
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