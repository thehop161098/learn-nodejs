import React, { Component } from 'react';
import Moment from 'react-moment';
import { showToast } from '../../../utils';
import { EMPTY, YES, NO } from '../../../constants/Params';

export default class ListItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sort: 0,
        };
    }

    componentDidMount() {
        if (this.props.model) {
            this.setState({ sort: this.props.model.sort });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.model && this.props.model) {
            if (nextProps.model.sort !== this.props.model.sort) {
                this.setState({ sort: nextProps.model.sort });
            }
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

    onChangeField = (data, model) => {
        this.props.onChangeField(data).then(res => {
            if (res.success) {
                showToast(res.message);
            } else {
                showToast(res.message, 'error');
            }
        });
    }

    onGetEdit = (model) => {
        this.props.onGetEdit(model._id);
    }

    onDelete = (model) => {
        this.props.onDelete(model._id);
    }

    onChecked = (e, model) => {
        this.props.onChecked(e);
    }

    render() {
        const { model, onDelete, isNull, onGetEdit, onChecked, onOpenRole } = this.props;
        if (isNull) {
            return (
                <tr><td colSpan="5" className="text-center">{EMPTY}</td></tr>
            );
        }

        return (
            <tr>
                <td className="text-center">
                    <div className="animated-checkbox">
                        <label className="mb-0">
                            <input
                                type="checkbox"
                                checked={this.isChecked(model._id)}
                                value={model._id}
                                onChange={onChecked}
                            />
                            <span className="label-text"></span>
                        </label>
                    </div>
                </td>
                <td>{model.name}</td>
                <td className="text-center">
                    <Moment format="DD/MM/YYYY HH:mm" add={{ hours: 8 }}>{model.created_at}</Moment>
                </td>
                <td className="text-center">
                    <div className="animated-checkbox">
                        <label className="mb-0">
                            <input
                                type="checkbox"
                                checked={model.publish}
                                onChange={() => this.onChangeField({
                                    _id: model._id,
                                    field: "publish",
                                    value: model.publish ? NO : YES,
                                })}
                            />
                            <span className="label-text"></span>
                        </label>
                    </div>
                </td>
                <td className="text-center">
                    <button onClick={() => onOpenRole(model._id)} className="btn btn-sm btn-primary mr-1" title="Phân quyền">
                        <i className="fa fa-user"></i>
                    </button>
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