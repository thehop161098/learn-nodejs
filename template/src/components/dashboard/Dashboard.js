import React, { Component } from 'react';
import Chart from "react-apexcharts";

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '70%',
                        endingShape: 'rounded'
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                },
                yaxis: {
                    title: {
                        text: 'Tr VNĐ'
                    }
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + " Triệu VNĐ"
                        }
                    }
                }
            },
            series: [{
                name: 'Tổng Thu',
                data: [80, 82, 115, 74, 152, 114, 173, 87, 134, 147 , 113, 130]
            }, {
                name: 'Tổng Chi',
                data: [13, 16, 11, 22, 34, 15, 48, 24, 18, 27, 33 , 24]
            }],
        }
    }
    render() {
        return (
            <div className="mainDashboard">
                <div className="income__spend">
                    <div className="row customRow">
                        <div className="col-lg-3 col-md-6 col-12">
                            <div class="incomeToday">
                                <div className="row">
                                    <div className="col-lg-12 col-md-4 col-4">
                                        <div className="imgIncome">
                                            <img src="images/icon/icon-income.png" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-8 col-8">
                                        <div className="infoIncome">
                                            <div className="titleIncome">
                                                <p>Tổng Thu Hôm Nay</p>
                                            </div>
                                            <div className="countIncome">
                                                <p>21.430.000 VNĐ</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12">
                            <div class="spendToday">
                                <div className="row">
                                    <div className="col-lg-12 col-md-4 col-4">
                                        <div className="imgSpend">
                                            <img src="images/icon/icon-spend.png" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-8 col-8">
                                        <div className="infoSpend">
                                            <div className="titleSpend">
                                                <p>Tổng Chi Hôm Nay</p>
                                            </div>
                                            <div className="countSpend">
                                                <p>5.950.000 VNĐ</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12">
                            <div class="incomeThisMonth">
                                <div className="row">
                                    <div className="col-lg-12 col-md-4 col-4">
                                        <div className="imgIncome">
                                            <img src="images/icon/icon-month-income.png" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-8 col-8">
                                        <div className="infoIncome">
                                            <div className="titleIncome">
                                                <p>Tổng Thu Tháng 12/2019</p>
                                            </div>
                                            <div className="countIncome">
                                                <p>325.780.000 VNĐ</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12">
                            <div class="spendThisMonth">
                                <div className="row">
                                    <div className="col-lg-12 col-md-4 col-4">
                                        <div className="imgSpend">
                                            <img src="images/icon/icon-month-spend.png" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-8 col-8">
                                        <div className="infoSpend">
                                            <div className="titleSpend">
                                                <p>Tổng Chi Tháng 12/2019</p>
                                            </div>
                                            <div className="countSpend">
                                                <p>65.250.000 VNĐ</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="chart" className="chartDashboard">
                    <Chart options={this.state.options} series={this.state.series} type="bar" height="350" />
                </div>
                <div class="formSearchDashboard">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-6">
                            <div className="formSearch">
                                <input placeholder="Search" />
                                <i class="fa fa-search"></i>
                                <a href=""><i class="fa fa-times-circle"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="revenueResult table-responsive revenueDashboard">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Việc Cần Thu / Chi</th>
                                <th>Số Tiền</th>
                                <th>Thu/Chi</th>
                                <th>Ngày</th>
                                <th>Loại Ví</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Hợp Đồng Khách Hàng</td>
                                <td>80.000.000</td>
                                <td><span class="badge badge-success">Thu</span></td>
                                <td>10-12-2019</td>
                                <td>Vietcombank</td>
                            </tr>
                            <tr>
                                <td>Thuê Nhà</td>
                                <td>8.000.000</td>
                                <td><span class="badge badge-danger">Chi</span></td>
                                <td>12-12-2019</td>
                                <td>Tiền Mặt</td>
                            </tr>
                            <tr>
                                <td>Hợp Đồng Khách Hàng</td>
                                <td>30.000.000</td>
                                <td><span class="badge badge-success">Thu</span></td>
                                <td>14-12-2019</td>
                                <td>VPBank</td>
                            </tr>
                        </tbody>
                    </table>
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
                </div>
            </div>

        )
    }
}