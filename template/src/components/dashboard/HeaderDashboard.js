import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from "react-router-dom";

export default class HeaderDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
        }
    }
    showSettings(event) {
        event.preventDefault();
    }
    render() {
        return (
            <>
                {/* FORM UPDATE INFOUSER */}
                <div className="formUpdateInfoUser formSmall">
                    <div className="headerForm">
                        <span>Chỉnh Sửa Profile</span>
                    </div>
                    <div className="mainForm">
                        <div className="form-group">
                            <label for="">Số Điện Thoại</label>
                            <input disabled class="form-control" value="0932338344" />
                        </div>
                        <div className="form-group">
                            <label for="">Họ Tên</label>
                            <input class="form-control" value="Admin" />
                        </div>
                        <div className="form-group">
                            <label for="">Email</label>
                            <input class="form-control" value="admin@gmail.com" />
                        </div>
                        <div className="form-group btnSubmit">
                            <button className="btn btn-success saveSubmit">
                                <i class="fa fa-floppy-o"></i>
                                Lưu
                            </button>
                            <button className="btn btn-danger cancelSubmitUpdateInfoUser">
                                <i class="fa fa-times"></i>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
                {/* FORM CHANGE PASSWORD */}
                <div className="formChangePassword formSmall">
                    <div className="headerForm">
                        <span>Đổi Mật Khẩu</span>
                    </div>
                    <div className="mainForm">
                        <div className="form-group">
                            <label for="">Mật khẩu cũ</label>
                            <input disabled type="password" class="form-control" value="123456@" />
                        </div>
                        <div className="form-group">
                            <label for="">Mật Khẩu Mới</label>
                            <input type="password" class="form-control" placeholder=""/>
                        </div>
                        <div className="form-group">
                            <label for="">Nhập Lại Nhập Khẩu Mới</label>
                            <input type="password" class="form-control" placeholder="" />
                        </div>
                        <div className="form-group btnSubmit">
                            <button className="btn btn-success saveSubmit">
                                <i class="fa fa-floppy-o"></i>
                                Lưu
                            </button>
                            <button className="btn btn-danger cancelSubmitChangePassword">
                                <i class="fa fa-times"></i>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
                <div className="topDashboard">
                    <div className="menuDashboard">
                        <div className="row customRow">
                            <div className="col-xl-1 col-lg-1 col-md-6 col-sm-6 col-3">
                                <Menu>
                                    <Link to="/dashboard">
                                        <img src="images/logo/logo-optech2.png" className="imgLogoMenu" />
                                    </Link>
                                    <div id="accordion">
                                        <div className="card not-child">
                                            <Link to="/dashboard">
                                                <div className="card-header" id="headingOne">
                                                    <h5 className="mb-0">
                                                        Dashboard
                                                    </h5>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="card">
                                            <a href="# " className="collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                <div className="card-header" id="headingTwo">
                                                    <h5 class="mb-0">
                                                        Quản lí
                                                    </h5>
                                                </div>
                                            </a>
                                            <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                                                <div class="card-body">
                                                    <div class="list-group">
                                                        <Link to="/revenue" className="list-group-item list-group-item-action">Quản lí thu chi</Link>
                                                        <Link to="/wallet" className="list-group-item list-group-item-action">Quản lí ví</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <a onClick={this.showSettings} className="menu-item--small" href=""></a>
                                </Menu>
                            </div>
                            <div className="col-xl-2 d-xl-block d-lg-block d-md-none d-none">
                                <div className="logo">
                                    <Link to="/dashboard">
                                        <img src="images/logo/logo-optech2.png" />
                                    </Link>
                                </div>
                            </div>
                            <div className="col-xl-9 col-lg-9 col-md-6 col-sm-6 col-9">
                                <div className="menuRight">
                                    <ul>
                                        <li>
                                            <a href="# " class="openNotification">
                                                <img src="images/icon/icon-bell.png" />
                                                <span className="badge badge-pill badge-warning">3</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="# " class="openUserSetting">
                                                <img className="imgAvatar" src="images/icon/icon-account.png" />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                {/* FORM USER SETTING */}
                                <div className="formUserSetting">
                                    <ul>
                                        <div class="card-header nameUser">
                                            <span>Admin</span>
                                        </div>
                                        <a href="# " class="openFormUpdateInfoUser">
                                            <li>Cập nhật thông tin</li>
                                        </a>
                                        <a href="# " class="openFormChangePassword">
                                            <li>Đổi mật khẩu</li>
                                        </a>
                                        <a href="# ">
                                            <li>Đăng xuất</li>
                                        </a>
                                    </ul>
                                </div>
                                {/* FORM NOTI */}
                                <div className="formNotification">
                                    <div className="card">
                                        <div className="card-header">
                                            <span>Thông báo</span>
                                        </div>
                                        <a href="">
                                            <div className="card-body">
                                                <h5 className="card-title">Nguyễn Văn A đã cập nhật doanh thu</h5>
                                                <span className="card-text info-noti">Nguyễn Văn A đã cập nhật doanh thu bộ phận Kinh Doanh tháng 11/2019</span>
                                                <span className="card-text time-noti">10 phút trước</span>
                                            </div>
                                        </a>
                                        <a href="">
                                            <div className="card-body">
                                                <h5 className="card-title">Lê Văn C đã cập nhật doanh thu</h5>
                                                <span className="card-text">Nguyễn Văn A đã cập nhật doanh thu bộ phận Kế Toán tháng 11/2019</span>
                                                <span className="card-text time-noti">3 giờ trước</span>
                                            </div>
                                        </a>
                                        <a href="">
                                            <div className="card-body">
                                                <h5 className="card-title">Chi tiền sửa máy lạnh</h5>
                                                <span className="card-text">Chi tiền sửa máy lạnh : -3.200.000 VND vào ngân sách</span>
                                                <span className="card-text time-noti">1 ngày trước</span>
                                            </div>
                                        </a>
                                        <a href="">
                                            <div className="card-body last">
                                                <p className="card-text">Xem tất cả thông báo</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
