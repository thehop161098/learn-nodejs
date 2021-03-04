import React, { Component } from 'react';

export default class RevenueResult extends Component {
    render() {
        return (
            <>
                <div className="revenueResult table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input" id="customCheckAll" />
                                        <label className="custom-control-label" for="customCheckAll"></label>
                                    </div>
                                </th>
                                <th>Việc Cần Thu / Chi</th>
                                <th>Số Tiền</th>
                                <th>Thu/Chi</th>
                                <th>Ngày</th>
                                <th>Loại Ví</th>
                                <th>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="customCheck1" />
                                        <label class="custom-control-label" for="customCheck1"></label>
                                    </div>
                                </th>
                                <td>Hợp Đồng Khách Hàng</td>
                                <td>80.000.000</td>
                                <td><span class="badge badge-success">Thu</span></td>
                                <td>10-12-2019</td>
                                <td>Tiền Mặt</td>
                                <td>
                                    <div class="userCustom">
                                        <button class="btn btn-info">
                                            <i class="fa fa-edit"></i>
                                        </button>
                                        <button class="btn btn-danger">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="customCheck2" />
                                        <label class="custom-control-label" for="customCheck2"></label>
                                    </div>
                                </th>
                                <td>Hợp Đồng Khách Hàng</td>
                                <td>80.000.000</td>
                                <td><span class="badge badge-danger">Chi</span></td>
                                <td>10-12-2019</td>
                                <td>Tiền Mặt</td>
                                <td>
                                    <div class="userCustom">
                                        <button class="btn btn-info">
                                            <i class="fa fa-edit"></i>
                                        </button>
                                        <button class="btn btn-danger">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="customCheck1" />
                                        <label class="custom-control-label" for="customCheck1"></label>
                                    </div>
                                </th>
                                <td>Hợp Đồng Khách Hàng</td>
                                <td>80.000.000</td>
                                <td><span class="badge badge-success">Thu</span></td>
                                <td>10-12-2019</td>
                                <td>Tiền Mặt</td>
                                <td>
                                    <div class="userCustom">
                                        <button class="btn btn-info">
                                            <i class="fa fa-edit"></i>
                                        </button>
                                        <button class="btn btn-danger">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="customCheck2" />
                                        <label class="custom-control-label" for="customCheck2"></label>
                                    </div>
                                </th>
                                <td>Hợp Đồng Khách Hàng</td>
                                <td>80.000.000</td>
                                <td><span class="badge badge-success">Thu</span></td>
                                <td>10-12-2019</td>
                                <td>Tiền Mặt</td>
                                <td>
                                    <div class="userCustom">
                                        <button class="btn btn-info">
                                            <i class="fa fa-edit"></i>
                                        </button>
                                        <button class="btn btn-danger">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="customCheck1" />
                                        <label class="custom-control-label" for="customCheck1"></label>
                                    </div>
                                </th>
                                <td>Hợp Đồng Khách Hàng</td>
                                <td>80.000.000</td>
                                <td><span class="badge badge-success">Thu</span></td>
                                <td>10-12-2019</td>
                                <td>Tiền Mặt</td>
                                <td>
                                    <div class="userCustom">
                                        <button class="btn btn-info">
                                            <i class="fa fa-edit"></i>
                                        </button>
                                        <button class="btn btn-danger">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <nav className="paginationResult" aria-label="Page navigation example">
                    <ul class="pagination justify-content-center">
                        <li class="page-item disabled">
                            <a class="page-link" href="#" tabindex="-1">&laquo;</a>
                        </li>
                        <li class="page-item"><a class="page-link" href="#">1</a></li>
                        <li class="page-item"><a class="page-link" href="#">2</a></li>
                        <li class="page-item"><a class="page-link" href="#">3</a></li>
                        <li class="page-item">
                            <a class="page-link" href="#">&raquo;</a>
                        </li>
                    </ul>
                </nav>
            </>
        )
    }
}
