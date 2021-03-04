import React, { Component } from 'react';
import classnames from "classnames";
import ReactDOM from 'react-dom';
import Multiselect from 'react-bootstrap-multiselect';
import 'react-bootstrap-multiselect/css/bootstrap-multiselect.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { showToast } from '../../../utils';
import { Loading } from '../../../common';
import { MALE, FEMALE } from '../../../constants/Params';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            group_customer_id: "",
            sex: MALE,
            name: "",
            phone: "",
            email: "",
            birth_date: new Date(),
            zalo: "",
            facebook: "",
            errors: {},
            is_overlay: false,
            list_game_account: [],
            gameAccounts: [],
            list_bank_customer: [],
            bankCustomers: [],
            groupCustomers: [],
        };
    }

    componentDidMount() {
        let _id = -1;
        if (this.props.modelEdit && this.props.modelEdit._id !== undefined) {
            this.setState(this.props.modelEdit);
            _id = this.props.modelEdit._id;
            if (this.props.modelEdit.birth_date) {
                this.setState({ birth_date: new Date(this.props.modelEdit.birth_date) });
            }
        }
        this.props.actGetAccountUnActivedRequest(_id).then(res => {
            if (res && res.success) {
                this.setState({ gameAccounts: res.models });
            }
        })
        this.props.actGetBankCustomerRequest(_id).then(res => {
            if (res && res.success) {
                this.setState({ bankCustomers: res.models });
            }
        })
        this.props.actGetGroupCustomerRequest().then(res => {
            if (res && res.success) {
                this.setState({ groupCustomers: res.models });
            }
        })
    }

    onChange = (e) => {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onChangeBirthDay = (date) => {
        this.setState({ birth_date: date });
    }

    onChangeMultiple = () => {
        var node = ReactDOM.findDOMNode(this.refs.list_game_account);
        var options = [].slice.call(node.querySelectorAll('option'));
        var selected = options.filter(function (option) {
            return option.selected;
        });
        var list_game_account = selected.map(function (option) {
            return option.value;
        });
        this.setState({ list_game_account });
    }

    onChangeMultipleBank = () => {
        var node = ReactDOM.findDOMNode(this.refs.list_bank_customer);
        var options = [].slice.call(node.querySelectorAll('option'));
        var selected = options.filter(function (option) {
            return option.selected;
        });
        var list_bank_customer = selected.map(function (option) {
            return option.value;
        });
        this.setState({ list_bank_customer });
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ errors: {} });
        const { errors, gameAccounts, bankCustomers, groupCustomers, is_overlay,
            ...data_post } = this.state;
        this.setState({ is_overlay: true });
        this.props.onSubmit(data_post).then((res) => {
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
        });
    }

    render() {
        const {
            _id, code, name, phone, email, birth_date, sex, zalo, facebook, errors, is_overlay,
            list_game_account, gameAccounts, list_bank_customer, bankCustomers,
            group_customer_id, groupCustomers
        } = this.state;
        const title_action = _id === "" ? "Thêm mới" : "Cập nhật";

        let arr_game_account = gameAccounts.map((account, index) => {
            return {
                value: account._id,
                selected: list_game_account.indexOf(account._id) !== -1 ? true : false,
                label: account.game + ' - ' + account.name
            };
        });

        let arr_bank_customer = bankCustomers.map((bankCus, index) => {
            return {
                value: bankCus._id,
                selected: list_bank_customer.indexOf(bankCus._id) !== -1 ? true : false,
                label: bankCus.bank_name + ' - ' + bankCus.account
            };
        });

        return (
            <div className="wrapper-form form-xs">
                {is_overlay && <Loading />}
                <h3 className="title-form">{title_action}</h3>
                <div className="box-form">
                    <form onSubmit={this.onSubmit}>
                        {_id !== "" &&
                            <div className={classnames('form-group', { 'has-error': errors.name })}>
                                <label className="control-label">Mã KH <span className="text-danger">(*)</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="code"
                                    value={code}
                                    disabled={true}
                                />
                                {errors.code && <small className="error">{errors.code}</small>}
                            </div>
                        }
                        <div className={classnames('form-group', { 'has-error': errors.type })}>
                            <label>Giới tính</label>
                            <div className="row">
                                <div className="col-6">
                                    <input
                                        id="male"
                                        type="radio"
                                        name="sex"
                                        value={MALE}
                                        checked={sex === MALE}
                                        onChange={this.onChange}
                                    />
                                    <label htmlFor="male"> Nam</label>
                                </div>
                                <div className="col-6">
                                    <input
                                        id="female"
                                        type="radio"
                                        name="sex"
                                        value={FEMALE}
                                        checked={sex === FEMALE}
                                        onChange={this.onChange}
                                    />
                                    <label htmlFor="female"> Nữ</label>
                                </div>
                            </div>
                            {errors.type && <small className="error">{errors.type}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.name })}>
                            <label className="control-label">Tên <span className="text-danger">(*)</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={name}
                                onChange={this.onChange}
                            />
                            {errors.name && <small className="error">{errors.name}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.phone })}>
                            <label className="control-label">SDT<span className="text-danger">(*)</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="phone"
                                value={phone}
                                onChange={this.onChange}
                            />
                            {errors.phone && <small className="error">{errors.phone}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.email })}>
                            <label className="control-label">Email</label>
                            <input
                                type="text"
                                className="form-control"
                                name="email"
                                value={email}
                                onChange={this.onChange}
                            />
                            {errors.email && <small className="error">{errors.email}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.birth_date })}>
                            <label className="control-label">Ngày sinh</label>
                            <DatePicker
                                autoComplete="off"
                                className="form-control"
                                dateFormat="dd-MM-yyyy"
                                name="birth_date"
                                selected={birth_date}
                                onChange={this.onChangeBirthDay}
                            />
                            {errors.birth_date && <small className="error">{errors.birth_date}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.list_game_account })}>
                            <label className="control-label">Nhân vật game</label>
                            <div className="form-group box_multi">
                                <Multiselect
                                    className="form-control box_multi"
                                    onChange={this.onChangeMultiple}
                                    ref="list_game_account"
                                    data={arr_game_account}
                                    multiple
                                    nonSelectedText="Chưa chọn"
                                    nSelectedText="Đã chọn"
                                    enableFiltering={true}
                                    enableCaseInsensitiveFiltering={true}
                                    maxHeight="250"
                                    filterPlaceholder="Tìm nhân vật game..."
                                />
                            </div>
                            {errors.list_game_account && <small className="error">{errors.list_game_account}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.list_bank_customer })}>
                            <label className="control-label">Tài khoản ngân hàng</label>
                            <div className="form-group box_multi">
                                <Multiselect
                                    className="form-control box_multi"
                                    onChange={this.onChangeMultipleBank}
                                    ref="list_bank_customer"
                                    data={arr_bank_customer}
                                    multiple
                                    nonSelectedText="Chưa chọn"
                                    nSelectedText="Đã chọn"
                                    enableFiltering={true}
                                    enableCaseInsensitiveFiltering={true}
                                    maxHeight="250"
                                    filterPlaceholder="Tìm tài khoản NH..."
                                />
                            </div>
                            {errors.list_bank_customer && <small className="error">{errors.list_bank_customer}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.group_customer_id })}>
                            <label>Nhóm khách hàng <span className="text-danger">(*)</span></label>
                            <select
                                className="custom-select"
                                name="group_customer_id"
                                value={group_customer_id}
                                onChange={this.onChange}
                            >
                                <option value="">--- Nhóm khách hàng ---</option>
                                {groupCustomers.length > 0 && groupCustomers.map((cus, index) =>
                                    <option key={index} value={`${cus._id}`}>{`${cus.name}`}</option>
                                )}
                            </select>
                            {errors.group_customer_id && <small className="error">{errors.group_customer_id}</small>}
                        </div>

                        <div className={classnames('form-group', { 'has-error': errors.zalo })}>
                            <label className="control-label">Zalo</label>
                            <input
                                type="text"
                                className="form-control"
                                name="zalo"
                                value={zalo}
                                onChange={this.onChange}
                            />
                            {errors.zalo && <small className="error">{errors.zalo}</small>}
                        </div>
                        <div className={classnames('form-group', { 'has-error': errors.facebook })}>
                            <label className="control-label">Facebook</label>
                            <input
                                type="text"
                                className="form-control"
                                name="facebook"
                                value={facebook}
                                onChange={this.onChange}
                            />
                            {errors.facebook && <small className="error">{errors.facebook}</small>}
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