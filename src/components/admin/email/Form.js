import React, { Component } from 'react';
import CKEditor from 'ckeditor4-react';
import classnames from "classnames";
import { YES, NO } from "../../../constants/Params";
import { showToast, rewriteToUpperCase } from '../../../utils';
import { Loading } from '../../../common';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: '',
            code: '',
            name: '',
            description: '',
            params: "",
            message: '',
            status: YES,
            errors: {},
            disable_code: false,
            is_overlay: false,
        };
    }

    componentDidMount() {
        if (this.props.modelEdit && this.props.modelEdit._id !== undefined) {
            this.setState(this.props.modelEdit);
            this.setState({ disable_code: true });
        }
    }

    onChange = (e) => {
        let { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            if (checked) value = YES
            else value = NO;
        }
        if (name === "code") {
            value = rewriteToUpperCase(value);
        }
        this.setState({ [name]: value });
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ errors: {} });
        const { errors, is_overlay, ...data_post } = this.state;
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
                    }
                    this.setState({ is_overlay: false });
                }
            }
        });
    }

    onEditorChange = (e) => {
        this.setState({ message: e.editor.getData() });
    }

    render() {
        const {
            code, name, description, params, message, status, disable_code, errors, _id, is_overlay
        } = this.state;
        const title_action = _id === "" ? "Thêm mới" : "Cập nhật";

        return (
            <div className="wrapper-form form-lg">
                {is_overlay && <Loading />}

                <h3 className="title-form">{title_action}</h3>

                <div className="box-form">
                    <form onSubmit={this.onSubmit}>
                        <div className="row">
                            <div className="col-lg-6 col-md-6">
                                <div className={classnames('form-group', { 'has-error': errors.code })}>
                                    <label>Mã email <span className="text-danger">(*)</span></label>
                                    <input
                                        disabled={disable_code}
                                        type="text"
                                        className="form-control"
                                        name="code"
                                        value={code}
                                        onChange={this.onChange}
                                    />
                                    {errors.code && <small className="error">{errors.code}</small>}
                                </div>
                                <div className={classnames('form-group', { 'has-error': errors.description })}>
                                    <label>Mô tả<span className="text-danger">(*)</span></label>
                                    <textarea
                                        type="text" rows="4"
                                        className="form-control"
                                        name="description"
                                        value={description}
                                        onChange={this.onChange}
                                    ></textarea>
                                    {errors.description && <small className="error">{errors.description}</small>}
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6">
                                <div className={classnames('form-group', { 'has-error': errors.name })}>
                                    <label>Tên email<span className="text-danger">(*)</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={name}
                                        onChange={this.onChange}
                                    />
                                    {errors.name && <small className="error">{errors.name}</small>}
                                </div>
                                <div className="form-group">
                                    <label>Thông số</label>
                                    <textarea
                                        type="text" rows="4"
                                        className="form-control"
                                        name="params"
                                        value={params}
                                        onChange={this.onChange}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className={classnames('form-group', { 'has-error': errors.message })}>
                            <label>Nội dung email<span className="text-danger">(*)</span></label>
                            <CKEditor
                                data={message}
                                onChange={this.onEditorChange}
                            />
                            {errors.message && <small className="error">{errors.message}</small>}
                        </div>

                        <div className="form-group">
                            <div className="animated-checkbox">
                                <label className="mb-0">
                                    <input
                                        type="checkbox"
                                        name="status"
                                        onChange={this.onChange}
                                        value={YES}
                                        checked={status}
                                    />
                                    <span className="label-text">Hiển thị</span>
                                </label>
                            </div>
                            {errors.status && <small className="error">{errors.status}</small>}
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