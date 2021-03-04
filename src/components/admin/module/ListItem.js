import React, { Component } from 'react';
import { EMPTY, YES, NO, FE, FE_NAME, NA, BE, BE_NAME } from '../../../constants/Params';
import { showToast } from '../../../utils';

export default class ListItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sort: 0
        };
    }

    componentDidMount() {
        if (this.props.model) {
            this.setState({ sort: this.props.model.sort });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.model && this.props.model.sort !== nextProps.model.sort) {
            this.setState({ sort: nextProps.model.sort });
        }
    }

    isChecked(_id) {
        const { listChecked } = this.props;
        if (listChecked.indexOf(_id) !== -1) {
            return true;
        }
        return false;
    }

    onChange = (e) => {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onChangeField = (data) => {
        this.props.onChangeField(data).then(res => {
            if (res.success) {
                showToast(res.message);
            } else {
                showToast(res.message, 'error');
            }
        });
    }

    getType = () => {
        const { model } = this.props;
        switch (model.type) {
            case FE:
                return FE_NAME;
            case BE:
                return BE_NAME;
            default:
                return NA
        }
    }

    getName = () => {
        const { model } = this.props;
        if (model) {
            if (model.parent_id) {
                return `--- ${model.name}`;
            }
            return model.name;
        }
        return "";
    }

    render() {
        const { sort } = this.state;
        const { model, onDelete, isNull, onGetEdit, onChecked, colSpan } = this.props;

        if (isNull) {
            return (<tr><td colSpan={colSpan} className="text-center">{EMPTY}</td></tr>);
        }
        return (
            <tr>
                <td className="text-center">
                    <div className="custom-control custom-checkbox ckb-custom">
                        <input
                            className="custom-control-input" id={`customCheck1${model._id}`}
                            type="checkbox"
                            checked={this.isChecked(model._id)}
                            value={model._id}
                            onChange={onChecked}
                        />
                        <label className="custom-control-label" htmlFor={`customCheck1${model._id}`}></label>
                    </div>
                </td>
                <td>{this.getType()}</td>
                <td>{this.getName()}</td>
                <td>{model.link}</td>
                <td>
                    <div className="col-auto">
                        <div className="input-group mb-2">
                            <input
                                className="form-control ip-group text-center"
                                type="number"
                                name="sort"
                                value={sort}
                                onChange={this.onChange}
                                autoComplete="off"
                            />
                            <div className="input-group-prepend"
                                style={{ cursor: "pointer" }}
                                onClick={() => this.onChangeField({
                                    _id: model._id,
                                    field: "sort",
                                    value: sort,
                                })}
                            >
                                <div className="input-group-text">
                                    <i className="fa fa-check"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
                <td className="text-center">
                    <div className="custom-control custom-checkbox ckb-custom2">
                        <input
                            className="custom-control-input" id={`checkShow${model._id}`}
                            type="checkbox"
                            checked={model.publish}
                            onChange={() => this.onChangeField({
                                _id: model._id,
                                field: "publish",
                                value: model.publish ? NO : YES,
                            })}
                        />
                        <label className="custom-control-label" htmlFor={`checkShow${model._id}`}></label>
                    </div>

                </td>
                <td className="text-center">
                    <button onClick={() => onGetEdit(model._id)} className="btn btn-sm btn-primary mr-1" type="button">
                        <i className="fa fa-edit"></i>
                    </button>
                    <button onClick={() => onDelete(model._id)} className="btn btn-sm btn-danger" type="button">
                        <i className="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        );
    }
}