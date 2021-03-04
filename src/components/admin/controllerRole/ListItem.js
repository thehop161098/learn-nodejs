import React, { Component } from 'react';
import { showToast } from '../../../utils';
import { NA, EMPTY, BE, BE_NAME } from '../../../constants/Params';

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

    UNSAFE_componentWillReceiveProps(nextProps) {
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

    getType(type) {
        type = parseInt(type);
        switch (type) {
            case BE:
                return BE_NAME;
            default:
                return NA;
        }
    }

    onChange = (e) => {
        let { value } = e.target;
        this.setState({ sort: parseInt(value) });
    }

    onChangeOrder = () => {
        const { sort } = this.state;
        const { onChangeOrder, model } = this.props;
        if (sort === "") {
            showToast("Bạn chưa nhập thứ tự", 'error');
        } else if (sort === this.props.model.sort) {
            showToast("Thứ tự vẫn như cũ", 'warning');
        } else {
            onChangeOrder(model._id, sort).then(res => {
                if (res.success) {
                    showToast(res.message);
                }
            });
        }
    }

    render() {
        const { model, onDelete, isNull, onGetEdit, onChecked } = this.props;
        let list_controller = null;

        if (isNull) {
            return (<tr><td colSpan="6" className="text-center">{EMPTY}</td></tr>);
        } else {
            list_controller = model.list_controller.map((elm, index) => {
                return <h6 key={index}>{elm}</h6>
            });
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
                <td>{this.getType(model.type)}</td>
                <td>{model.name}</td>
                <td>{list_controller}</td>
                <td>
                    <div className="input-group">
                        <input
                            className="form-control text-center"
                            type="number"
                            value={this.state.sort}
                            onChange={this.onChange}
                        />
                        <div className="input-group-append" style={{ cursor: "pointer" }} onClick={this.onChangeOrder}>
                            <span className="input-group-text">
                                <i className="fa fa-check" aria-hidden="true"></i>
                            </span>
                        </div>
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