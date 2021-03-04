import React, { Component } from 'react';
import Moment from 'react-moment';
import { EMPTY, YES, NO } from '../../../constants/Params';
import { showToast } from '../../../utils';

export default class ListItem extends Component {

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

    render() {
        const { model, isNull, onGetEdit, colSpan } = this.props;

        if (isNull) {
            return (
                <tr>
                    <td colSpan={colSpan} className="text-center">{EMPTY}</td>
                </tr>
            );
        }

        return (
            <tr>
                <td>{model.code}</td>
                <td>{model.name}</td>
                <td>{model.description}</td>
                <td className="text-center">
                    <Moment format="DD/MM/YYYY">{model.created_at}</Moment>
                </td>
                <td className="text-center">
                    <div className="animated-checkbox">
                        <label className="mb-0">
                            <input
                                type="checkbox"
                                checked={model.status}
                                onChange={() => this.onChangeField({
                                    _id: model._id,
                                    field: "status",
                                    value: model.status ? NO : YES,
                                })}
                            />
                            <span className="label-text"></span>
                        </label>
                    </div>
                </td>
                <td className="text-center">
                    <button onClick={() => onGetEdit(model._id)} className="btn btn-sm btn-primary mr-1" type="button">
                        <i className="fa fa-edit"></i>
                    </button>
                    {/* <button onClick={() => onDelete(model._id)} className="btn btn-sm btn-danger" type="button">
                        <i className="fa fa-trash"></i>
                    </button> */}
                </td>
            </tr>
        );
    }
}