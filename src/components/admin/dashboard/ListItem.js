import React, { Component } from 'react';
import { EMPTY } from '../../../constants/Params';
//import { showToast } from '../../../utils';
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

    getBankName = () => {
        const { model } = this.props;
        if (model) {
            if (model.bank_id) {
                return model.banks.name;
            }
            return model.banks.name;
        }
        return "";
    }

    render() {
        const { model, isNull, colSpan } = this.props;
        if (isNull) {
            return (<tr><td colSpan={colSpan} className="text-center">{EMPTY}</td></tr>);
        }
        const colorClass = model.typeReven === 'thu' ? 'success' : 'danger';
        return (
            <tr>
                <td>{model.name}</td>
                <td className="text-center">
                    <NumberFormat
                        value={model.price}
                        displayType={'text'}
                        thousandSeparator={true}
                    /> {this.props.auth.unit}
                </td>
                <td className="text-center"><span className={`badge badge-${colorClass}`}>{model.typeReven === 'thu' ? "Thu" : "Chi"}</span></td>
                <td className="text-center"><Moment format="DD/MM/YYYY HH:mm">{model.custome_date}</Moment></td>
                <td className="text-center">{this.getBankName()}</td>
            </tr>

        );
    }
}