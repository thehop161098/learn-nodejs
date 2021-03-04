import React, { Component } from 'react';
import { EMPTY } from '../../../constants/Params';
import { showToast } from '../../../utils';
import NumberFormat from 'react-number-format';
import Moment from 'react-moment';

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

    getBankTakeName = () => {
        const { model } = this.props;
        if (model) {
            if (model.bank_id) {
                return model.bank_take.name;
            }
            return model.bank_take.name;
        }
        return "";
    }
    getBankMoveName = () => {
        const { model } = this.props;
        if (model) {
            if (model.bank_id) {
                return model.bank_move.name;
            }
            return model.bank_move.name;
        }
        return "";
    }

    render() {
        const { model, onDelete, isNull, onGetEdit, colSpan } = this.props;
        if (isNull) {
            return (<tr><td colSpan={colSpan} className="text-center">{EMPTY}</td></tr>);
        }
        return (
            <tr>
                <td className="text-left">{this.getBankTakeName()}</td>
                <td className="text-left">{this.getBankMoveName()}</td>
                <td className="text-center">
                    <NumberFormat
                        value={model.price}
                        displayType={'text'}
                        thousandSeparator={true}
                    /> {this.props.auth.unit}
                </td>
                <td className="text-center">
                    <NumberFormat
                        value={model.fee}
                        displayType={'text'}
                        thousandSeparator={true}
                    /> {this.props.auth.unit}
                </td>
                <td className="text-left">{model.reason}</td>
                <td className="text-center">
                    <Moment format="DD/MM/YYYY">{model.custome_date}</Moment>
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