import React, { Component } from 'react';
import classnames from "classnames";
import { showToast } from '../../../utils';
import {
    BE, YES, NO, FE, BE_NAME, FE_NAME
} from '../../../constants/Params';
import { Loading } from '../../../common';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            type: BE,
            title: "",
            name: "",
            icon: "",
            component: "",
            parent_id: "",
            link: "",
            sort: 0,
            publish: YES,
            errors: {},
            parents: [],
            controllers: [],
            is_overlay: false
        };
    }

    componentDidMount() {
        let { type } = { ...this.state };
        if (this.props.modelEdit && this.props.modelEdit._id !== undefined) {
            this.setState(this.props.modelEdit);
            type = this.props.modelEdit.type;
        }
        this.props.onGetModuleParent(type).then(parents => {
            this.setState({ parents });
        });

        this.props.onGetControllers(type).then(controllers => {
            this.setState({ controllers });
        });
    }

    onChange = (e) => {
        let { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            if (checked) value = YES
            else value = NO;
        }
        if (name === "type") {
            value = parseInt(value);
            this.props.onGetModuleParent(value).then(parents => {
                this.setState({ parents });
            });
            this.props.onGetControllers(value).then(controllers => {
                this.setState({ controllers });
            });
        }
        this.setState({ [name]: value });
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ errors: {} });
        const { errors, parents, controllers, is_overlay, ...data_post } = this.state;
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

    getParents() {
        const { parents, _id } = this.state;
        let results = null;
        if (parents.length > 0) {
            results = parents.map((parent, index) => {
                if (parent._id === _id) return null;
                return <option value={parent._id} key={index}>{parent.name}</option>
            });
        }
        return results;
    }

    getControllers() {
        const { controllers } = this.state;
        let results = null;
        if (controllers.length > 0) {
            results = controllers.map((controller, index) => {
                return <option value={controller.controller} key={index}>{controller.name}</option>
            });
        }
        return results;
    }

    render() {
        const {
            _id, parent_id, type, title, name, icon, component, link, sort, publish, errors, is_overlay
        } = this.state;
        const title_action = _id === "" ? "Thêm mới" : "Cập nhật";
        return (
            <div className="formRevenue formSmall">
                {is_overlay && <Loading />}
                <div className="headerForm"><span>{title_action}</span></div>

                <div className="mainForm">
                    <form onSubmit={this.onSubmit}>
                        <div className={classnames('form-group', { 'has-error': errors.type })}>
                            <label className="control-label">Loại</label>
                            <select
                                className="form-control"
                                name="type"
                                value={type}
                                onChange={this.onChange}
                            >
                                <option value="">---- Loại ----</option>
                                <option value={BE}>{BE_NAME}</option>
                                <option value={FE}>{FE_NAME}</option>
                            </select>
                            {errors.type && <small className="error">{errors.type}</small>}
                        </div>

                        <div className={classnames('form-group', { 'has-error': errors.title })}>
                            <label className="control-label">Tiêu đề</label>
                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={title}
                                onChange={this.onChange}
                            />
                            {errors.title && <small className="error">{errors.title}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.name })}>
                            <label className="control-label">Tên module <span className="text-danger">(*)</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={name}
                                onChange={this.onChange}
                            />
                            {errors.name && <small className="error">{errors.name}</small>}
                        </div>

                        <div className={classnames('form-group', { 'has-error': errors.name })}>
                            <label className="control-label">Icon</label>
                            <input
                                type="text"
                                className="form-control"
                                name="icon"
                                value={icon}
                                onChange={this.onChange}
                            />
                            {errors.icon && <small className="error">{errors.icon}</small>}
                        </div>

                        <div className={classnames('form-group', { 'has-error': errors.parent_id })}>
                            <label className="control-label">Nhóm</label>
                            <select
                                className="form-control"
                                name="parent_id"
                                value={parent_id}
                                onChange={this.onChange}
                            >
                                <option value="">---- Nhóm ----</option>
                                {this.getParents()}
                            </select>
                            {errors.parent_id && <small className="error">{errors.parent_id}</small>}
                        </div>

                        <div className={classnames('form-group', { 'has-error': errors.component })}>
                            <label className="control-label">Chức năng (Component)</label>
                            <select
                                className="form-control"
                                name="component"
                                value={component}
                                onChange={this.onChange}
                            >
                                <option value="">---- Chức năng ----</option>
                                {this.getControllers()}
                            </select>
                            {errors.component && <small className="error">{errors.component}</small>}
                        </div>

                        <div className={classnames('form-group', { 'has-error': errors.link })}>
                            <label className="control-label">Đường dẫn</label>
                            <input
                                type="text"
                                className="form-control"
                                name="link"
                                value={link}
                                onChange={this.onChange}
                            />
                            {errors.link && <small className="error">{errors.link}</small>}
                        </div>

                        <div className={classnames('form-group', { 'has-error': errors.sort })}>
                            <label className="control-label">Sắp xếp</label>
                            <input
                                type="number"
                                className="form-control"
                                name="sort"
                                value={sort}
                                onChange={this.onChange}
                            />
                            {errors.sort && <small className="error">{errors.sort}</small>}
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