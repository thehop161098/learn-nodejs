import React, { Component } from 'react';
import { NA, EMPTY, BE, BE_NAME, FE, FE_NAME } from '../../../constants/Params';

export default class ListItem extends Component {

    getType(type) {
        switch (type) {
            case BE:
                return BE_NAME;
            case FE:
                return FE_NAME;
            default:
                return NA;
        }
    }

    isChecked(_id) {
        const { listChecked } = this.props;
        if (listChecked.indexOf(_id) !== -1) {
            return true;
        }
        return false;
    }

    render() {
        const { model, onDelete, isNull, onGetEdit, onChecked } = this.props;
        let list_action = null;
        if (isNull) {
            return (
                <tr>
                    <td colSpan="6" className="text-center">{EMPTY}</td>
                </tr>
            );
        } else {
            list_action = model.list_action.map((elm, index) => {
                return <p key={index}>{elm.action}: {elm.name}</p>
            });
        }
        return (
            <tr>
                <td className="text-center">
                    <div className="custom-control custom-checkbox">
                        <input
                            className="custom-control-input" id="customCheck1"
                            type="checkbox"
                            checked={this.isChecked(model._id)}
                            value={model._id}
                            onChange={onChecked}
                        />
                        <label className="custom-control-label" htmlFor="customCheck1"></label>
                    </div>
                </td>
                <td>{this.getType(model.type)}</td>
                <td>{model.controller}</td>
                <td>{model.name}</td>
                <td>{list_action}</td>
                <td className="text-center">
                    <div className="userCustom">
                        <button onClick={() => onGetEdit(model._id)} className="btn btn-info" type="button">
                            <i className="fa fa-edit"></i>
                        </button>

                        <button onClick={() => onDelete(model._id)} className="btn btn-danger" type="button">
                            <i className="fa fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        );
    }
}