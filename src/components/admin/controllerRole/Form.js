import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from "classnames";
import { concat, uniq } from 'lodash';
import { showToast } from '../../../utils';
import Multiselect from 'react-bootstrap-multiselect';
import 'react-bootstrap-multiselect/css/bootstrap-multiselect.css';
import { Loading } from '../../../common';
import { BE, BE_NAME } from '../../../constants/Params';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            type: BE,
            name: "",
            list_controller: [],
            sort: 0,
            controllers: [],
            errors: {},
            is_overlay: false
        };
    }

    componentDidMount() {
        let type = this.state.type;
        let _id = -1;
        if (this.props.modelEdit && this.props.modelEdit._id !== undefined) {
            this.setState(this.props.modelEdit);
            type = this.props.modelEdit.type;
            _id = this.props.modelEdit._id;
        }

        this.props.actGetControllers(type, _id).then(controllers => {
            this.setState({ controllers });
        });
    }

    onChange = (e) => {
        let { name, value } = e.target;
        this.setState({ [name]: value });

        if (name === "type") {
            this.props.actGetControllers(value).then(controllers => {
                if (this.props.modelEdit && this.props.modelEdit._id !== undefined) {
                    controllers = concat(controllers, this.props.modelEdit.list_controller);
                    controllers = uniq(controllers);
                }
                this.setState({ controllers, list_controller: [] });
            });
        }
    }

    onChangeMultiple = () => {
        var node = ReactDOM.findDOMNode(this.refs.list_controller);
        var options = [].slice.call(node.querySelectorAll('option'));
        var selected = options.filter(function (option) {
            return option.selected;
        });
        var list_controller = selected.map(function (option) {
            return option.value;
        });

        this.setState({ list_controller });
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ errors: {} });
        const { errors, controllers, is_overlay, ...data_post } = this.state;
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
                }
                this.setState({ is_overlay: false });
            }
        });
    }

    render() {
        const { _id, type, name, list_controller, sort, controllers, errors, is_overlay } = this.state;
        const title = _id === "" ? "Thêm mới" : "Cập nhật";

        let arr_controllers = controllers.map((control, index) => {
            return {
                value: control.controller,
                selected: list_controller.indexOf(control.controller) !== -1 ? true : false,
                label: control.name
            };
        });

        return (
            <div className="wrapper-form form-xs">
                {is_overlay && <Loading />}

                <h3 className="title-form">{title}</h3>
                <div className="box-form">
                    <form onSubmit={this.onSubmit}>
                        <div className={classnames('form-group', { 'has-error': errors.type })}>
                            <label className="control-label">Loại <span className="text-danger">(*)</span></label>
                            <select
                                className="form-control"
                                name="type"
                                value={type}
                                onChange={this.onChange}
                            >
                                <option value={BE}>{BE_NAME}</option>
                            </select>
                            {errors.type && <small className="error">{errors.type}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.name })}>
                            <label className="control-label">Tên chức năng <span className="text-danger">(*)</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={name}
                                onChange={this.onChange}
                            />
                            {errors.name && <small className="error">{errors.name}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.list_controller })}>
                            <label className="control-label">Danh sách controller <span className="text-danger">(*)</span></label>
                            <div className="form-group box_multi">
                                <Multiselect
                                    className="form-control"
                                    onChange={this.onChangeMultiple}
                                    ref="list_controller"
                                    data={arr_controllers}
                                    multiple
                                    nonSelectedText="Chưa chọn"
                                    nSelectedText="Đã chọn"
                                    enableFiltering={true}
                                    enableCaseInsensitiveFiltering={true}
                                    maxHeight="250"
                                    filterPlaceholder="Tìm controller..."
                                />
                            </div>
                            {errors.list_controller && <small className="error">{errors.list_controller}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.sort })}>
                            <label className="control-label">Thứ tự</label>
                            <input
                                type="text"
                                className="form-control"
                                name="sort"
                                value={sort}
                                onChange={this.onChange}
                            />
                            {errors.sort && <small className="error">{errors.sort}</small>}
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