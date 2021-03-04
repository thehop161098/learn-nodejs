import React, { Component } from 'react';
import { URL_ADMIN, URL_LOGIN_BE } from '../../../constants/Params';
import { Link } from "react-router-dom";
import { showToast } from '../../../utils';
import logo from "../../../assets/images/logo-optech2.png";
import iconBell from "../../../assets/images/icon-bell.png";
import iconAcc from "../../../assets/images/icon-account.png";
import NumberFormat from 'react-number-format';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currency_id: ""
        };
    }

    onLogout = (e) => {
        e.preventDefault();
        this.props.onLogout();
        this.props.history.push(URL_LOGIN_BE);
    }

    onChange = async (e) => {
        let { name, value } = e.target;
        await this.setState({ [name]: value });
        this.props.onSetCurrency(this.state).then(res => {
            if (res) {
                if (res.success) {
                    showToast(res.message);
                } else {
                    if (res.message) {
                        showToast(res.message, 'error');
                    }
                }
            }
        });
    }

    ///show all đơn vị
    getCurrencys() {
        const { currency } = this.props;
        let results = null;
        if (currency.length > 0) {
            results = currency.map((elm, index) => {
                return <option value={elm._id} key={index}>{elm.name}</option>
            });
        }
        return results;
    }

    render() {
        return (
            <>
                <div className="col-xl-2 d-xl-block d-lg-block d-md-none d-none">
                    <div className="logo">
                        <Link to="/">
                            <img src={logo} alt="Logo" />
                        </Link>
                    </div>
                </div>

                <div className="col-xl-9 col-lg-9 col-md-6 col-sm-6 col-9">
                    <div className="menuRight">

                        <div className="totalPrice">
                            
                            Tổng tiền:
                            <span>
                                <NumberFormat
                                    value={this.props.auth.total}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                /> <div className="currency">
                                    <select
                                        className="slCurrency"
                                        name="currency_id"
                                        value={this.props.auth.unit_id}
                                        onChange={this.onChange}
                                    >
                                        <option value="">Tiền</option>
                                        {this.getCurrencys()}
                                    </select>
                                </div>
                            </span>
                        </div>
                        <div className="dropdown show">
                            <a className="btn btnNoti" href="# " role="button" id="dropdownMenuLinkNoti" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src={iconBell} alt="ic_bell" />
                            </a>
                            <div className="dropdown-menu formNoti" aria-labelledby="dropdownMenuLinkNoti">
                                <div className="list-noti">
                                    <a href="# ">
                                        <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                                            <div className="toast-header">
                                                <div className="mr-auto title">This example text is going to run a bit longer so that you can.</div>
                                            </div>
                                            <div className="toast-body">
                                                Hello, world! This is a toast message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.
                                                    </div>
                                            <div className="toast-footer">
                                                <small>11 mins ago</small>
                                            </div>
                                        </div>
                                    </a>
                                    <a href="# ">
                                        <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                                            <div className="toast-header">
                                                <div className="mr-auto title">This example text is going to run a bit longer so that you can.</div>
                                            </div>
                                            <div className="toast-body">
                                                Hello, world! This is a toast message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.
                                                    </div>
                                            <div className="toast-footer">
                                                <small>11 mins ago</small>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="dropdown show formUser">
                            <a className="btn btnUser" href="# " role="button" id="dropdownMenuLinkUser" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src={iconAcc} alt="account" />
                            </a>
                            <div className="dropdown-menu list-item" aria-labelledby="dropdownMenuLinkUser">
                                <a className="dropdown-item" href={`${URL_ADMIN}profile`}>Cập nhật thông tin</a>
                                <a className="dropdown-item" onClick={this.onLogout} href="# ">Đăng xuất</a>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}