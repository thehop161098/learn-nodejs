import React, { Component } from 'react';
import classnames from "classnames";
import { showToast } from '../../../utils';
import { Loading } from '../../../common';
import { YES, NO } from '../../../constants/Params';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            name: "",
            publish: YES,
            is_overlay: false,
            errors: {}
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
            value = checked ? YES: NO;
        }
        this.setState({ [name]: value });
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ errors: {} });
        const { errors, parents, is_overlay, ...data_post } = this.state;
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

    render() {
        const { _id, name, publish, errors, is_overlay } = this.state;
        const title = _id === "" ? "Thêm mới" : "Cập nhật";
        return (
            <div className="wrapper-form form-xs">
                {is_overlay && <Loading />}

                <h3 className="title-form">{title}</h3>
                <div className="box-form">
                    <form onSubmit={this.onSubmit}>
                        <div className={classnames('form-group', { 'has-error': errors.name })}>
                            <label className="control-label">Tên nhóm quyền <span className="text-danger">(*)</span></label>
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