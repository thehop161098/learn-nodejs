import React, { Component } from 'react';
import classnames from "classnames";
import isEmpty from 'lodash/isEmpty';
import { showToast } from '../../../utils';
import { BE, BE_NAME, FE, FE_NAME } from '../../../constants/Params';
import { Loading } from '../../../common';

export default class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            type: BE,
            controller: "",
            name: "",
            errors: {},
            list_action: [],
            is_overlay: false
        };
    }

    componentDidMount() {
        if (this.props.modelEdit && this.props.modelEdit._id !== undefined) {
            this.setState(this.props.modelEdit);
        }
    }

    onChange = (e) => {
        let { name, value } = e.target;
        if (name === "type") {
            value = parseInt(value);
        }
        this.setState({ [name]: value });
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ errors: {} });
        const { errors, controllers, is_overlay, ...data_post } = this.state;
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
                    }
                    this.setState({ is_overlay: false });
                }
            });
    }

    onPlusAction = () => {
        const { list_action } = this.state;
        let new_list_action = [...list_action];
        new_list_action.push({
            action: "",
            name: ""
        });
        this.setState({ list_action: new_list_action });
    }

    onChangeListAction = (e, index_change, key) => {
        const { value } = e.target;
        const { list_action } = this.state;
        const new_list_action = list_action.map((elm, index) => {
            if (index === index_change) {
                if (key === 'action') return { ...elm, action: value };
                return { ...elm, name: value };
            }
            return elm;
        });
        this.setState({ list_action: new_list_action });
    }

    showActions = (list_action, errors) => {
        if (errors.list_action && list_action.length === 0) {
            return <small className="error">Bạn chưa chọn action</small>;
        }
        return list_action.map((elm, index) => {
            return (
                <div className="row" key={index}>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <div className={classnames('form-group', { 'has-error': errors.list_action })}>
                            <label>Action <span className="text-danger">(*)</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name={`action-${index}`}
                                value={elm.action}
                                onChange={(e) => this.onChangeListAction(e, index, 'action')}
                            />
                            {errors.list_action && isEmpty(elm.action) && <small className="error">{errors.list_action}</small>}
                        </div>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <div className={classnames('form-group', { 'has-error': errors.list_action })}>
                            <label>Tên <span className="text-danger">(*)</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name={`name-${index}`}
                                value={elm.name}
                                onChange={(e) => this.onChangeListAction(e, index, 'name')}
                            />
                            {errors.list_action && isEmpty(elm.name) && <small className="error">{errors.list_action}</small>}
                        </div>
                    </div>
                </div>
            );
        });
    }

    render() {
        const { _id, type, controller, name, errors, list_action, is_overlay } = this.state;
        const title = _id === "" ? "Thêm mới" : "Cập nhật";
        const disabled = _id === "" ? false : true;


        return (
            <div className="formRevenue formSmall">
                {is_overlay && <Loading />}

                <div className="headerForm"><span>{title}</span></div>

                <div className="mainForm">
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label className="control-label">Loại <span className="text-danger">(*)</span></label>
                            <select
                                className="form-control"
                                name="type"
                                value={type}
                                onChange={this.onChange}
                                disabled={disabled}
                            >
                                <option value={BE}>{BE_NAME}</option>
                                <option value={FE}>{FE_NAME}</option>
                            </select>
                            {errors.type && <small className="error">{errors.type}</small>}
                        </div>

                        <div className={classnames('form-group', { 'has-error': errors.name })}>
                            <label className="control-label">Container <span className="text-danger">(*)</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="controller"
                                value={controller}
                                onChange={this.onChange}
                            />
                            {errors.controller && <small className="error">{errors.controller}</small>}
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

                        {this.showActions(list_action, errors)}

                        <div className="form-group btnSubmit">
                            <button
                                className="btn btn-primary mr-1"
                                type="button"
                                onClick={this.onPlusAction}
                            >
                                <i className="fa fa-fw fa-lg fa-check-circle"></i>Thêm
                            </button>
                            <button className="btn btn-success saveSubmit" type="submit">
                                <i className="fa fa-floppy-o"></i> Lưu
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger cancelSubmitRevenue"
                                onClick={() => this.props.closeForm()}>
                                <i className="fa fa-times"></i> Hủy
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        );
    }
}