import React, { Component } from 'react';
import classnames from "classnames";
import { showToast } from '../../../utils';
import { YES, NO } from '../../../constants/Params';
import { Loading } from '../../../common';
import NumberFormat from 'react-number-format';
import 'moment/locale/it.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            bank_take: "",
            bank_move: "",
            price: "",
            fee: "",
            reason: "",
            custome_date: new Date(),
            errors: {},
            banks: [],
            is_overlay: false
        };
    }

    componentDidMount() {
        if (this.props.modelEdit && this.props.modelEdit._id !== undefined) {
            this.setState(this.props.modelEdit);
        }
        this.props.onGetAllBank().then(banks => {
            this.setState({ banks });
        });
    }

    onChange = (e) => {
        let { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            if (checked) value = YES
            else value = NO;
        }
        this.setState({ [name]: value });
    }
    onChangeDate = (jsDate, dateString) => {
        this.setState({ custome_date: dateString });
    }


    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ errors: {} });
        const { errors, parents, is_overlay, ...data_post } = this.state;
        this.setState({ is_overlay: true });
        this.props.onSubmit(data_post).then(
            (res) => {
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
                        this.setState({ is_overlay: false });
                    }
                }
            }
        );
    }
    ///show all ví
    getBanks() {
        const { banks, _id } = this.state;
        let results = null;
        if (banks.length > 0) {
            results = banks.map((bank, index) => {
                if (bank._id === _id) return null;
                return <option value={bank._id} key={index}>{bank.name}</option>
            });
        }
        return results;
    }




    render() {
        const {
            _id, price, bank_take, bank_move,fee, reason, custome_date, errors, is_overlay
        } = this.state;
        const title_action = _id === "" ? "Thêm mới" : "Cập nhật";
        return (
            <div className="formRevenue formSmall">
                {is_overlay && <Loading />}
                <div className="headerForm"><span>{title_action}</span></div>

                <div className="mainForm">
                    <form onSubmit={this.onSubmit}>
                        <div className={classnames('form-group', { 'has-error': errors.bank_take })}>
                            <label>Ví nhận <span className="text-danger">(*)</span></label>
                            <select
                                className="form-control"
                                name="bank_take"
                                value={bank_take}
                                onChange={this.onChange}
                            >
                                <option value="">Chọn ví nhận</option>
                                {this.getBanks()}
                            </select>
                            {errors.bank_take && <small className="error">{errors.bank_take}</small>}
                        </div>

                        <div className={classnames('form-group', { 'has-error': errors.bank_move })}>
                            <label>Ví chuyển <span className="text-danger">(*)</span></label>
                            <select
                                className="form-control"
                                name="bank_move"
                                value={bank_move}
                                onChange={this.onChange}
                            >
                                <option value="">Chọn ví chuyển</option>
                                {this.getBanks()}
                            </select>
                            {errors.bank_move && <small className="error">{errors.bank_move}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.price })}>
                            <label>Số Tiền <span className="text-danger">(*)</span></label>
                            <NumberFormat
                                type="text"
                                thousandSeparator={true}
                                className="form-control"
                                placeholder="Nhập số tiền"
                                name="price"
                                value={price}
                                onChange={this.onChange}
                            />
                            {errors.price && <small className="error">{errors.price}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.fee })}>
                            <label>Thu phí </label>
                            <NumberFormat
                                type="text"
                                thousandSeparator={true}
                                className="form-control"
                                placeholder="Nhập số tiền"
                                name="fee"
                                value={fee}
                                onChange={this.onChange}
                            />
                            {errors.fee && <small className="error">{errors.fee}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.reason })}>
                            <label>Lý do</label>
                            <input 
                                className="form-control"
                                name="reason"
                                value={reason}
                                onChange={this.onChange}
                            />
                            {errors.reason && <small className="error">{errors.reason}</small>}
                        </div>
                        {/* Ngày */}
                        <div className={classnames('form-group', { 'has-error': errors.custome_date })}>
                            <label>Ngày <span className=""></span></label>
                            <DatePickerInput
                                onChange={this.onChangeDate}
                                readOnly
                                className='my-react-component'
                                value={custome_date}
                            />
                            {errors.custome_date && <small className="error">{errors.custome_date}</small>}
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