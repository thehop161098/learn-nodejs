import React, { Component } from 'react';
import { EMPTY } from '../../../constants/Params';
import { showToast } from '../../../utils';
import NumberFormat from 'react-number-format';

export default class ListItem extends Component {

    

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
        const { model, isNull, colSpan } = this.props;

        if (isNull) {
            return (<tr><td colSpan={colSpan} className="text-center">{EMPTY}</td></tr>);
        }
        return (
            <tr>
                
                <td className="text-center">{model.code}</td>
                <td className="text-center">{model.name}</td>
                <td className="text-center">
                    <NumberFormat
                        value={model.price_first}
                        displayType={'text'}
                        thousandSeparator={true}
                    /> {this.props.auth.unit}
                </td>
                <td className="text-center">
                    <NumberFormat
                        value={model.price_curr}
                        displayType={'text'}
                        thousandSeparator={true}
                    /> {this.props.auth.unit}
                </td>
            </tr>
        );
    }
}