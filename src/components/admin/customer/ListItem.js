import React, { Component } from 'react';
import { EMPTY, MALE } from '../../../constants/Params';
import { showToast } from '../../../utils';
import { Link } from "react-router-dom";
import NumberFormat from 'react-number-format';

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

    getName = (model) => {
        let name = '';
        if (model.sex === MALE) {
            name = 'Anh ';
        } else {
            name = 'Chị ';
        }
        return name + model.name;
    }

    render() {
        const { model, onDelete, isNull, onGetEdit, onChecked, colSpan, modules_props } = this.props;

        if (isNull) {
            return (
                <tr>
                    <td colSpan={colSpan} className="text-center">{EMPTY}</td>
                </tr>
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
                <td>{model.code}</td>
                <td>{this.getName(model)}</td>
                <td>{model.phone}</td>
                <td>{model.email}</td>
                <td>{model.group_customers.length > 0 ? model.group_customers[0].name : ''}</td>
                <td className="text-right">
                    <NumberFormat
                        value={model.buy}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={''}
                    />
                </td>
                <td className="text-right">
                    <NumberFormat
                        value={model.sell}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={''}
                    />
                </td>
                <td>
                    {model.gameAccount.length > 0 && model.gameAccount.map((acc, index) =>
                        <p key={index}>{acc.name}: {acc.sum}</p>
                    )}
                </td>
                <td className="text-center">
                    {(modules_props["HistoryCustomerContainer"] && modules_props["HistoryCustomerContainer"].link) &&
                        <Link className="btn btn-sm btn-primary mr-1"
                            to={`/${modules_props["HistoryCustomerContainer"].link.split('/')[0]}/${model._id}`}
                        >
                            <i className="fa fa-list"></i>
                        </Link>
                    }
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