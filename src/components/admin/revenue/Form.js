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
            name: "",
            price: 0,
            typeReven: "",
            bank_id: "",
            custome_date: new Date(),
            publish: YES,
            parents: [],
            autoComplete: [],
            errors: {},
            hidden: "",
            is_overlay: false
        };
    }

    componentDidMount() {
        if (this.props.modelEdit && this.props.modelEdit._id !== undefined) {
            this.setState(this.props.modelEdit);
        }
        this.props.onGetWalletParent().then(parents => {
            this.setState({ parents });
        });
    }

    onChange = (e) => {
        let { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            if (checked) value = YES
            else value = NO;
        }
        this.setState({ [name]: value });
        if (name === 'name') {
            this.props.onAutoComplete({ value }).then(res => {
                if (res.success === true) {
                    this.setState({ autoComplete: res.autocompletes, hidden: '' });
                }
            });
        }
    }
    onChangeDate = (jsDate, dateString) => {
        this.setState({ custome_date: dateString });
    }

    onSelectAutoComplete = (e) => {
        var text = e.currentTarget.textContent;
        this.setState({ name: text, hidden: 'd-none' });


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
    getParents() {
        const { parents, _id } = this.state;
        let results = null;
        if (parents.length > 0) {
            results = parents.map((parent, index) => {
                if (parent._id === _id) return null;
                return <option value={parent._id} key={index}>{parent.name}</option>
            });
        }
        return results;
    }

    


    render() {
        const {
            _id, name, price, typeReven, bank_id, custome_date, publish, autoComplete, errors, hidden, is_overlay
        } = this.state;
        const title_action = _id === "" ? "Thêm mới" : "Cập nhật";
        return (
            <div className="formRevenue formSmall">
                {is_overlay && <Loading />}
                <div className="headerForm"><span>{title_action}</span></div>

                <div className="mainForm">
                    <form onSubmit={this.onSubmit}>
                        <div className={classnames('form-group', { 'has-error': errors.name })}>
                            <label className="control-label">Việc Cần Thu/Chi <span className="text-danger">(*)</span></label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập việc thu/chi"
                                autoComplete="off"
                                name="name"
                                value={name}
                                onChange={this.onChange}
                            />
                            {autoComplete && autoComplete.length > 0 &&
                                autoComplete.map((elm, index) =>
                                    <div onClick={this.onSelectAutoComplete} key={index} className={`autoComplete ${hidden}`}>{elm}</div>
                                )
                            }
                            {errors.name && <small className="error">{errors.name}</small>}
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

                        <div className={classnames('form-group', { 'has-error': errors.typeReven })}>
                            <label>Loại Thu/Chi <span className="text-danger">(*)</span></label>
                            <select
                                className="form-control"
                                name="typeReven"
                                value={typeReven}
                                onChange={this.onChange}
                            >
                                <option value="">Chọn loại thu/chi</option>
                                <option value="thu" >Thu</option>
                                <option value="chi" >Chi</option>
                            </select>
                            {errors.typeReven && <small className="error">{errors.typeReven}</small>}
                        </div>

                        <div className={classnames('form-group', { 'has-error': errors.bank_id })}>
                            <label>Loại Ví <span className="text-danger">(*)</span></label>
                            <select
                                className="form-control"
                                name="bank_id"
                                value={bank_id}
                                onChange={this.onChange}
                            >
                                <option value="">Chọn loại thanh toán</option>
                                {this.getParents()}
                            </select>
                            {errors.bank_id && <small className="error">{errors.bank_id}</small>}
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

                        <div className="form-group">
                            <div className="animated-checkbox">
                                <label className="mb-0">
                                    <input
                                        type="checkbox"
                                        name="publish"
                                        onChange={this.onChange}
                                        value={YES}
                                        checked={publish}
                                    />
                                    <span className="label-text">Hiển thị</span>
                                </label>
                            </div>
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