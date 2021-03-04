import React, { Component } from 'react';

export default class WalletManager extends Component {
    render() {
        return (
            <>
                <div className="formWallet formSmall">
                    <div className="headerForm">
                        <span>Thêm Mới</span>
                    </div>
                    <div className="mainForm">
                        <div className="form-group">
                            <label for="">Tên Ngân Hàng</label>
                            <input class="form-control" placeholder="Nhập tên ngân hàng " />
                        </div>
                        <div className="form-group">
                            <label for="">Số Dư Ban Đầu</label>
                            <input type="number" min="0" max="100000000" step="10000" class="form-control" placeholder="Nhập số tiền " />
                        </div>
                        <div className="form-group">
                            <label for="">Trạng Thái</label>
                            <select className="form-control">
                                <option hidden selected>Chọn trạng thái của loại ví</option>
                                <option>Có thể thanh toán</option>
                                <option>Ngừng thanh toán</option>
                            </select>
                        </div>
                        <div className="form-group btnSubmit">
                            <button className="btn btn-success saveSubmit">
                                <i class="fa fa-floppy-o"></i>
                                Lưu
                            </button>
                            <button className="btn btn-danger cancelSubmitWallet">
                                <i class="fa fa-times"></i>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
                <div className="walletManager ">
                    <div className="searchRevernue">
                        <div className="row customRow">
                            <div class="col-lg-4 input-col-custom">
                                <div className="formSearch">
                                    <input placeholder="Search" />
                                </div>
                            </div>
                            <div class="col-lg-2 col-sm-5 col-5 input-col-custom">
                                <div class="buttonSearchSubmit">
                                    <button className="btn btn-primary searchResult">
                                        <i className="fa fa-search"></i>
                                    </button>
                                    <button className="btn btn-info refreshResult">
                                        <i className="fa fa-refresh"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-6 col-sm-7 col-7 input-col-custom">
                                <div className="functionUser">
                                    <button className="btn btn-success addItemWallet">
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