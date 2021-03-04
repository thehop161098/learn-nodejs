import React, { Component } from 'react';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

export default class RevenueManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            todate : new Date(),
        }
    }
    render() {
        return (
            <>
                {/* FORM ADD/EDIT REVENUE */}

                <div className="formRevenue formSmall">
                    <div className="headerForm">
                        <span>Thêm Mới</span>
                    </div>
                    <div className="mainForm">
                        <div className="form-group">
                            <label for="">Việc Cần Thu/Chi</label>
                            <input class="form-control" placeholder="Nhập việc cần thu chi" />
                        </div>
                        <div className="form-group">
                            <label for="">Số Tiền</label>
                            <input type="number" min="0" max="100000000" step="10000" class="form-control" placeholder="Nhập số tiền " />
                        </div>
                        <div className="form-group">
                            <label for="">Loại Thu/Chi</label>
                            <select className="form-control">
                                <option hidden selected>Chọn loại thu/chi</option>
                                <option>Thu</option>
                                <option>Chi</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label for="">Loại Ví</label>
                            <select className="form-control">
                                <option hidden selected>Chọn loại thanh toán</option>
                                <option>Tiền Mặt</option>
                                <option>Ngân Hàng</option>
                                <option>Momo</option>
                            </select>
                        </div>
                        <div className="form-group btnSubmit">
                            <button className="btn btn-success saveSubmit">
                                <i class="fa fa-floppy-o"></i>
                                Lưu
                            </button>
                            <button className="btn btn-danger cancelSubmitRevenue">
                                <i class="fa fa-times"></i>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
                <div className="revenueManager ">
                    <div className="searchRevernue">
                        <div className="row customRow">
                            <div className="col-lg-3 col-md-6 input-col-custom">
                                <div className="workPay">
                                    <label>Công Việc Cần Thu/Chi</label>
                                    <input class="form-control" placeholder="Nhập việc cần thu chi" />
                                    <button className="btn btn-success addWorkPay">
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-6 input-col-custom">
                                <div class="typePay">
                                    <label>Loại Thu/Chi</label>
                                    <select className="form-control">
                                        <option hidden selected>Chọn Loại Thu/Chi</option>
                                        <option>Thu</option>
                                        <option>Chi</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-6 input-col-custom">
                                <div class="form-group">
                                <label>Từ Ngày</label>
                                    <DatePickerInput
                                        className='my-custom-datepicker-component'
                                        onChange={(date) => this.setState({ date })}
                                        value={this.state.date}
                                        displayFormat="DD-MM-YYYY" />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-6 input-col-custom">
                                <div class="form-group">
                                    <label>Đến Ngày</label>
                                    <DatePickerInput
                                        className='my-custom-datepicker-component'
                                        onChange={(todate) => this.setState({ todate })}
                                        value={this.state.todate}
                                        displayFormat="DD-MM-YYYY" />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-6 input-col-custom">
                                <div class="typePayment">
                                    <label>Loại Ví</label>
                                    <select className="form-control">
                                        <option hidden selected>Chọn loại ví</option>
                                        <option>Tiền Mặt</option>
                                        <option>Tài Khoản Ngân Hàng</option>
                                        <option>Momo</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-lg-1 col-md-2 col-5 input-col-custom">
                                <div class="buttonSearchSubmit">
                                    <button className="btn btn-primary searchResult">
                                        <i className="fa fa-search"></i>
                                    </button>
                                    <button className="btn btn-info refreshResult">
                                        <i className="fa fa-refresh"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-4 col-7 input-col-custom">
                                <div className="functionUser">
                                    <button className="btn btn-success addItemRevenue" onclick="openForm()">
                                        <i class="fa fa-plus-circle"></i>
                                        <span>Thêm Mới</span>
                                    </button>
                                    <button className="btn btn-danger delAllItem">
                                        <i class="fa fa-times-circle-o"></i>
                                        <span>Xóa tất cả</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}